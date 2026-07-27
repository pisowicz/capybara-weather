/**
 * map.js — WunderMap-style layer hub on Leaflet.
 * Layers: animated radar (RainViewer), satellite (NASA GIBS GOES GeoColor),
 * NWS alert polygons, nearby-station temperature markers.
 */

const MapHub = (() => {
  const state = {
    map: null,
    frames: [],
    host: null,
    idx: 0,
    timer: null,
    radarLayerCache: {},
    activeRadarLayer: null,
    satLayer: null,
    alertLayer: null,
    stationLayer: null,
    enabled: { radar: true, satellite: false, alerts: true, stations: true },
    lastAlerts: [],
    lastStations: [],
  };

  const $ = (id) => document.getElementById(id);

  function fmtFrameTime(unixSec) {
    const d = new Date(unixSec * 1000);
    let h = d.getUTCHours();
    const m = String(d.getUTCMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm} UTC`;
  }

  async function init(loc) {
    if (state.map) {
      state.map.invalidateSize();
      return;
    }
    state.map = L.map("radar-map").setView([loc.lat, loc.lon], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 12,
    }).addTo(state.map);

    state.satLayer = L.tileLayer(
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GOES-East_ABI_GeoColor/default/default/GoogleMapsCompatible_Level7/{z}/{y}/{x}.jpg",
      { opacity: 0.65, maxNativeZoom: 7, attribution: "© NASA GIBS / NOAA GOES" }
    );

    try {
      const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
      const meta = await res.json();
      state.frames = [...(meta.radar?.past || []), ...(meta.radar?.nowcast || [])];
      state.host = meta.host;
      const scrub = $("radar-scrub");
      scrub.max = Math.max(state.frames.length - 1, 0);
      if (state.frames.length) {
        const lastPast = state.frames.length - (meta.radar?.nowcast?.length || 0) - 1;
        showFrame(Math.max(lastPast, 0));
      }
    } catch {
      $("radar-timestamp").textContent = "Radar data unavailable.";
    }

    applyToggles();
    renderAlertLayer(state.lastAlerts);
    renderStationLayer(state.lastStations);
  }

  function showFrame(idx) {
    if (!state.frames.length || !state.enabled.radar) return;
    state.idx = ((idx % state.frames.length) + state.frames.length) % state.frames.length;
    const frame = state.frames[state.idx];
    if (!state.radarLayerCache[frame.path]) {
      state.radarLayerCache[frame.path] = L.tileLayer(
        `${state.host}${frame.path}/256/{z}/{x}/{y}/4/1_1.png`,
        { opacity: 0.7, maxNativeZoom: 7, attribution: "© RainViewer" }
      );
    }
    const next = state.radarLayerCache[frame.path];
    next.addTo(state.map);
    if (state.activeRadarLayer && state.activeRadarLayer !== next) state.map.removeLayer(state.activeRadarLayer);
    state.activeRadarLayer = next;
    $("radar-scrub").value = state.idx;
    $("radar-timestamp").textContent =
      `${fmtFrameTime(frame.time)}${frame.path.includes("nowcast") ? " (forecast)" : ""}`;
  }

  function toggleLoop() {
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
      $("radar-play").textContent = "▶ Play";
    } else {
      state.timer = setInterval(() => showFrame(state.idx + 1), 600);
      $("radar-play").textContent = "⏸ Pause";
    }
  }

  function applyToggles() {
    if (!state.map) return;
    const en = state.enabled;
    if (en.radar) {
      if (state.activeRadarLayer) state.activeRadarLayer.addTo(state.map);
    } else if (state.activeRadarLayer) {
      state.map.removeLayer(state.activeRadarLayer);
      if (state.timer) toggleLoop();
    }
    if (en.satellite) state.satLayer.addTo(state.map);
    else if (state.map.hasLayer(state.satLayer)) state.map.removeLayer(state.satLayer);
    if (state.alertLayer) {
      if (en.alerts) state.alertLayer.addTo(state.map);
      else state.map.removeLayer(state.alertLayer);
    }
    if (state.stationLayer) {
      if (en.stations) state.stationLayer.addTo(state.map);
      else state.map.removeLayer(state.stationLayer);
    }
  }

  function setLayer(name, on) {
    state.enabled[name] = on;
    applyToggles();
    if (name === "radar" && on) showFrame(state.idx);
  }

  const ALERT_COLORS = { Extreme: "#b0002a", Severe: "#d64545", Moderate: "#f5a623", Minor: "#e8c547", Unknown: "#888" };

  function renderAlertLayer(alerts) {
    state.lastAlerts = alerts || [];
    if (!state.map) return;
    if (state.alertLayer) {
      state.map.removeLayer(state.alertLayer);
      state.alertLayer = null;
    }
    try {
      buildAlertLayer();
    } catch { /* malformed geometry must never break the map */ }
  }

  function buildAlertLayer() {
    const withGeom = state.lastAlerts
      .filter((a) => a.geometry)
      .map((a) => ({ type: "Feature", properties: a.properties, geometry: a.geometry }));
    if (!withGeom.length) return;
    state.alertLayer = L.geoJSON(
      { type: "FeatureCollection", features: withGeom },
      {
        style: (f) => ({
          color: ALERT_COLORS[f.properties.severity] || "#888",
          weight: 2,
          fillOpacity: 0.15,
        }),
        onEachFeature: (f, layer) =>
          layer.bindPopup(
            `<strong>${f.properties.event}</strong><br>${f.properties.headline || ""}`
          ),
      }
    );
    if (state.enabled.alerts) state.alertLayer.addTo(state.map);
  }

  function renderStationLayer(stations, units) {
    state.lastStations = stations || [];
    if (!state.map) return;
    if (state.stationLayer) {
      state.map.removeLayer(state.stationLayer);
      state.stationLayer = null;
    }
    if (!state.lastStations.length) return;
    const markers = state.lastStations.map((s) => {
      const temp = Math.round(Stations.cToDisplay(s.tempC, units || "imperial"));
      const icon = L.divIcon({
        className: "station-marker",
        html: `<span class="station-temp-label">${temp}°</span>`,
        iconSize: [34, 20],
      });
      return L.marker([s.lat, s.lon], { icon }).bindPopup(
        `<strong>${s.name}</strong><br>${s.network} · ${s.distKm.toFixed(1)} km away<br>${temp}°`
      );
    });
    state.stationLayer = L.layerGroup(markers);
    if (state.enabled.stations) state.stationLayer.addTo(state.map);
  }

  function setCenter(loc) {
    if (state.map) state.map.setView([loc.lat, loc.lon], 8);
  }

  function wireControls() {
    $("radar-play").addEventListener("click", toggleLoop);
    $("radar-scrub").addEventListener("input", (e) => showFrame(Number(e.target.value)));
    document.querySelectorAll(".layer-toggle").forEach((cb) =>
      cb.addEventListener("change", () => setLayer(cb.dataset.layer, cb.checked))
    );
  }

  return { init, setCenter, renderAlertLayer, renderStationLayer, wireControls, showFrame };
})();
