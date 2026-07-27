/**
 * stations.js — nearby personal/official weather stations, read-only.
 *
 * Two adapters:
 *   - NWS (api.weather.gov): official ASOS/AWOS stations. Keyless, US only.
 *   - Synoptic Data open-access tier: CWOP citizen stations + mesonets for
 *     real neighborhood density. Requires a free token (Settings ⚙).
 *
 * The QC + bias step is a miniature of Weather Underground's BestForecast:
 * discard outlier/stale stations, then compute a distance-weighted mean of
 * (observed − model) to correct the blended forecast for the next few hours.
 */

const Stations = (() => {
  const NWS_BASE = "https://api.weather.gov";
  const SYNOPTIC_BASE = "https://api.synopticdata.com/v2/stations/latest";
  const MAX_AGE_MIN = 75;      // observations older than this are ignored
  const MAX_STATIONS = 8;

  function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371, toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  async function getJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  }

  /** Official NWS stations near a point. Returns [] outside the US. */
  async function nwsNearby(lat, lon) {
    let point;
    try {
      point = await getJSON(`${NWS_BASE}/points/${lat.toFixed(4)},${lon.toFixed(4)}`);
    } catch {
      return []; // non-US or API hiccup
    }
    const stationsUrl = point?.properties?.observationStations;
    if (!stationsUrl) return [];
    const list = await getJSON(stationsUrl).catch(() => null);
    const features = (list?.features || []).slice(0, 6); // already distance-ordered
    const results = await Promise.all(
      features.map(async (f) => {
        try {
          const obs = await getJSON(`${f.id}/observations/latest`);
          const p = obs.properties;
          if (p?.temperature?.value === null || p?.temperature?.value === undefined) return null;
          const [slon, slat] = f.geometry.coordinates;
          return {
            id: f.properties.stationIdentifier,
            name: f.properties.name,
            network: "NWS",
            lat: slat, lon: slon,
            distKm: haversineKm(lat, lon, slat, slon),
            tempC: p.temperature.value,
            windKmh: p.windSpeed?.value ?? null,
            humidity: p.relativeHumidity?.value ?? null,
            time: p.timestamp,
          };
        } catch {
          return null;
        }
      })
    );
    return results.filter(Boolean);
  }

  /** Synoptic open-access stations (CWOP/mesonets) near a point. */
  async function synopticNearby(lat, lon, token) {
    const url =
      `${SYNOPTIC_BASE}?token=${encodeURIComponent(token)}` +
      `&radius=${lat},${lon},25&limit=12&vars=air_temp,wind_speed,relative_humidity` +
      `&within=${MAX_AGE_MIN}&units=metric&status=active`;
    const data = await getJSON(url).catch(() => null);
    return (data?.STATION || [])
      .map((s) => {
        const t = s.OBSERVATIONS?.air_temp_value_1;
        if (!t || t.value === null || t.value === undefined) return null;
        const slat = parseFloat(s.LATITUDE), slon = parseFloat(s.LONGITUDE);
        return {
          id: s.STID,
          name: s.NAME,
          network: s.MNET_SHORTNAME || "Synoptic",
          lat: slat, lon: slon,
          distKm: haversineKm(lat, lon, slat, slon),
          tempC: t.value,
          windKmh: s.OBSERVATIONS?.wind_speed_value_1?.value != null
            ? s.OBSERVATIONS.wind_speed_value_1.value * 3.6 // m/s → km/h
            : null,
          humidity: s.OBSERVATIONS?.relative_humidity_value_1?.value ?? null,
          time: t.date_time,
        };
      })
      .filter(Boolean);
  }

  /** Fetch from all configured sources, dedupe by id, sort by distance. */
  async function nearby(lat, lon, synopticToken) {
    const jobs = [nwsNearby(lat, lon)];
    if (synopticToken) jobs.push(synopticNearby(lat, lon, synopticToken));
    const settled = await Promise.allSettled(jobs);
    const all = settled.flatMap((s) => (s.status === "fulfilled" ? s.value : []));
    const seen = new Set();
    return all
      .filter((s) => (seen.has(s.id) ? false : seen.add(s.id)))
      .sort((a, b) => a.distKm - b.distKm)
      .slice(0, MAX_STATIONS);
  }

  const cToDisplay = (c, units) => (units === "imperial" ? (c * 9) / 5 + 32 : c);

  /**
   * QC + bias: drop stale readings, drop outliers vs the local median (when
   * there are enough stations to vote), then distance-weight the remainder.
   * Returns null when no trustworthy correction can be made.
   */
  function qcAndBias(stations, modelTemp, units, now = Date.now()) {
    const outlierLimit = units === "imperial" ? 7 : 4; // degrees from median
    let fresh = stations
      .map((s) => ({ ...s, temp: cToDisplay(s.tempC, units), ageMin: (now - new Date(s.time).getTime()) / 60000 }))
      .filter((s) => s.ageMin >= 0 && s.ageMin <= MAX_AGE_MIN && Number.isFinite(s.temp));
    if (!fresh.length) return null;

    let dropped = 0;
    if (fresh.length >= 3) {
      const sorted = fresh.map((s) => s.temp).sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const kept = fresh.filter((s) => Math.abs(s.temp - median) <= outlierLimit);
      dropped = fresh.length - kept.length;
      if (kept.length) fresh = kept;
    }

    let wsum = 0, sum = 0;
    for (const s of fresh) {
      const w = 1 / (1 + s.distKm);
      wsum += w;
      sum += w * (s.temp - modelTemp);
    }
    const bias = sum / wsum;
    if (!Number.isFinite(bias)) return null;
    return { bias, used: fresh, dropped };
  }

  return { nearby, qcAndBias, cToDisplay, haversineKm };
})();
