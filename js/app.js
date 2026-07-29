/**
 * app.js — UI controller for Capybara Weather.
 * Pipeline per location: fetch forecast + air quality + nearby stations +
 * alerts → QC stations → bias-correct the forecast (mini-BestForecast) →
 * render every panel. Radar/map lives in map.js, activities in activities.js,
 * SVG gauges in widgets.js.
 */

(() => {
  // ---------- WMO weather interpretation codes ----------
  const WMO = {
    0:  { text: "Sunny", night: "Clear", icon: "☀️", nightIcon: "🌙" },
    1:  { text: "Mostly Sunny", night: "Mostly Clear", icon: "🌤️", nightIcon: "🌙" },
    2:  { text: "Partly Cloudy", night: "Partly Cloudy", icon: "⛅", nightIcon: "☁️" },
    3:  { text: "Cloudy", night: "Cloudy", icon: "☁️", nightIcon: "☁️" },
    45: { text: "Fog", night: "Fog", icon: "🌫️", nightIcon: "🌫️" },
    48: { text: "Freezing Fog", night: "Freezing Fog", icon: "🌫️", nightIcon: "🌫️" },
    51: { text: "Light Drizzle", night: "Light Drizzle", icon: "🌦️", nightIcon: "🌧️" },
    53: { text: "Drizzle", night: "Drizzle", icon: "🌦️", nightIcon: "🌧️" },
    55: { text: "Heavy Drizzle", night: "Heavy Drizzle", icon: "🌧️", nightIcon: "🌧️" },
    56: { text: "Freezing Drizzle", night: "Freezing Drizzle", icon: "🌧️", nightIcon: "🌧️" },
    57: { text: "Freezing Drizzle", night: "Freezing Drizzle", icon: "🌧️", nightIcon: "🌧️" },
    61: { text: "Light Rain", night: "Light Rain", icon: "🌦️", nightIcon: "🌧️" },
    63: { text: "Rain", night: "Rain", icon: "🌧️", nightIcon: "🌧️" },
    65: { text: "Heavy Rain", night: "Heavy Rain", icon: "🌧️", nightIcon: "🌧️" },
    66: { text: "Freezing Rain", night: "Freezing Rain", icon: "🌧️", nightIcon: "🌧️" },
    67: { text: "Freezing Rain", night: "Freezing Rain", icon: "🌧️", nightIcon: "🌧️" },
    71: { text: "Light Snow", night: "Light Snow", icon: "🌨️", nightIcon: "🌨️" },
    73: { text: "Snow", night: "Snow", icon: "❄️", nightIcon: "❄️" },
    75: { text: "Heavy Snow", night: "Heavy Snow", icon: "❄️", nightIcon: "❄️" },
    77: { text: "Snow Grains", night: "Snow Grains", icon: "🌨️", nightIcon: "🌨️" },
    80: { text: "Scattered Showers", night: "Scattered Showers", icon: "🌦️", nightIcon: "🌧️" },
    81: { text: "Showers", night: "Showers", icon: "🌧️", nightIcon: "🌧️" },
    82: { text: "Heavy Showers", night: "Heavy Showers", icon: "🌧️", nightIcon: "🌧️" },
    85: { text: "Snow Showers", night: "Snow Showers", icon: "🌨️", nightIcon: "🌨️" },
    86: { text: "Heavy Snow Showers", night: "Heavy Snow Showers", icon: "❄️", nightIcon: "❄️" },
    95: { text: "Thunderstorms", night: "Thunderstorms", icon: "⛈️", nightIcon: "⛈️" },
    96: { text: "Storms w/ Hail", night: "Storms w/ Hail", icon: "⛈️", nightIcon: "⛈️" },
    99: { text: "Storms w/ Hail", night: "Storms w/ Hail", icon: "⛈️", nightIcon: "⛈️" },
  };

  function wmo(code, isDay = 1) {
    const w = WMO[code] || { text: "—", night: "—", icon: "❔", nightIcon: "❔" };
    return { text: isDay ? w.text : w.night, icon: isDay ? w.icon : w.nightIcon };
  }

  const COMPASS = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const windDir = (deg) => COMPASS[Math.round(((deg % 360) / 22.5)) % 16];

  // ---------- State ----------
  const state = {
    location: JSON.parse(localStorage.getItem("wc_location") || "null"),
    units: localStorage.getItem("wc_units") || "imperial",
    favorites: JSON.parse(localStorage.getItem("wc_favorites") || "[]"),
    settings: JSON.parse(localStorage.getItem("wc_settings") || "{}"),
    forecast: null,
    aqi: null,
    stations: [],
    correction: null, // { bias, used, dropped }
    alerts: null,     // null = NWS unavailable (non-US); [] = no active alerts
    hourlyMetric: "overview",
    monthlyKey: null, // cache key of the loaded monthly data
  };
  const DEFAULT_LOCATION = { name: "New York, NY", lat: 40.7128, lon: -74.006 };
  const CORRECTION_HOURS = 12;
  const MIN_BIAS = 0.5; // don't bother correcting below this (display units)

  const $ = (id) => document.getElementById(id);
  const tempUnit = () => (state.units === "imperial" ? "°F" : "°C");
  const speedUnit = () => (state.units === "imperial" ? "mph" : "km/h");
  const precipUnit = () => (state.units === "imperial" ? "in" : "mm");
  const fmtTemp = (v) => (v === null || v === undefined ? "—" : `${Math.round(v)}°`);

  function fmtHour(iso) {
    const d = new Date(iso);
    let h = d.getHours();
    const ampm = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return `${h} ${ampm}`;
  }
  function fmtClock(iso) {
    const d = new Date(iso);
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }
  const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const dayName = (iso, i) => (i === 0 ? "Today" : `${DAY_NAMES[new Date(iso + "T12:00").getDay()]} ${new Date(iso + "T12:00").getDate()}`);
  const shortDate = (iso) => {
    const d = new Date(iso + "T12:00");
    return `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
  };
  const longDate = (iso) => new Date(iso + "T12:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  function currentHourIndex(fc) {
    const now = new Date(fc.current.time);
    const idx = fc.hourly.time.findIndex((t) => new Date(t) >= now);
    return Math.max(0, idx);
  }

  // ---------- Loading a location ----------
  async function loadLocation(loc) {
    state.location = loc;
    localStorage.setItem("wc_location", JSON.stringify(loc));
    $("loading").classList.remove("hidden");
    $("loading").innerHTML = window.CapyMascot ? CapyMascot.loadingHTML() : "Loading forecast…";
    $("loc-pill-name").textContent = loc.name;

    let forecast, aqi, stations, alerts;
    try {
      [forecast, aqi, stations, alerts] = await Promise.all([
        API.getForecast(loc.lat, loc.lon, state.units),
        API.getAirQuality(loc.lat, loc.lon),
        Stations.nearby(loc.lat, loc.lon, state.settings.synopticToken).catch(() => []),
        Alerts.fetchActive(loc.lat, loc.lon),
      ]);
    } catch (err) {
      $("loading").innerHTML = `<div class="capy-loading">🐹 The capybara went to get the forecast and came back with an orange.<br><span class="capy-err">${err.message}</span><br>It will try again if you reload.</div>`;
      return;
    }

    state.stations = stations;
    state.alerts = alerts;
    state.correction = applyStationCorrection(forecast, stations);
    state.forecast = forecast;
    state.aqi = aqi;
    state.monthlyKey = null; // force monthly reload for the new location

    renderAll(forecast, aqi);
    loadBlendPanel();
    Activities.render(forecast, state.units, currentHourIndex(forecast));
    MapHub.setCenter(loc);
    MapHub.renderAlertLayer(alerts || []);
    MapHub.renderStationLayer(stations, state.units);
    if (document.querySelector('.tab-btn[data-tab="monthly"]').classList.contains("active")) ensureMonthly();

    $("loading").classList.add("hidden");
    document.querySelectorAll(".hidden-until-load").forEach((el) => el.classList.remove("hidden-until-load"));
    if (window.CapyMascot) CapyMascot.decorate(); // re-seat peekers on freshly rendered cards
  }

  /**
   * The mini-BestForecast step: QC nearby stations, compute the local bias vs
   * the model's current temperature, and blend it into the next N hours with a
   * linear decay (a "now" signal, not a tomorrow signal). Mutates the forecast.
   */
  function applyStationCorrection(fc, stations) {
    if (!stations?.length) return null;
    const result = Stations.qcAndBias(stations, fc.current.temperature_2m, state.units);
    if (!result || Math.abs(result.bias) < MIN_BIAS) return result ? { ...result, applied: false } : null;

    const bias = result.bias;
    fc.current.temperature_2m += bias;
    fc.current.apparent_temperature += bias;
    const start = currentHourIndex(fc);
    for (let h = 0; h < CORRECTION_HOURS; h++) {
      const i = start + h;
      if (i >= fc.hourly.time.length) break;
      const decay = 1 - h / CORRECTION_HOURS;
      fc.hourly.temperature_2m[i] += bias * decay;
      if (fc.hourly.apparent_temperature?.[i] != null) fc.hourly.apparent_temperature[i] += bias * decay;
    }
    return { ...result, applied: true };
  }

  // ---------- Rendering ----------
  function renderAll(fc, aqi) {
    renderPageHead(fc);
    renderHero(fc);
    renderCorrectionChip();
    renderWidgets(fc, aqi);
    renderRail(fc, aqi);
    renderStationsCard();
    renderAlerts(fc);
    renderOutlook(fc);
    renderTodaySegments(fc);
    renderHourlyGroups(fc);
    renderTenDay(fc);
    renderAirQualityPage(aqi);
    renderAllergyPage(fc, aqi);
    renderFavButton();
  }

  function renderPageHead(fc) {
    const asof = `As of ${fmtClock(fc.current.time)} ${fc.timezone_abbreviation}`;
    $("page-title").textContent = `${state.location.name.split(",")[0]} Weather`;
    $("loc-full").textContent = state.location.name;
    $("obs-time").textContent = asof;
    document.querySelectorAll(".loc-full-copy").forEach((el) => (el.textContent = state.location.name));
    document.querySelectorAll(".obs-time-copy").forEach((el) => (el.textContent = asof));
  }

  window.matchMedia("(min-width: 701px)").addEventListener("change", () => {
    if (state.forecast) renderHero(state.forecast);
  });

  function renderHero(fc) {
    const c = fc.current;
    const w = wmo(c.weather_code, c.is_day);
    const i = currentHourIndex(fc);
    $("current-temp").textContent = fmtTemp(c.temperature_2m);
    $("current-icon").textContent = w.icon;
    $("current-condition").textContent = w.text;
    $("scene-loc").textContent = state.location.name.split(",")[0];
    $("scene-time").textContent = `${fmtClock(c.time)} ${fc.timezone_abbreviation}`;
    const photoMode = (state.settings.heroStyle || "photo") === "photo" && !!window.CapyPhotos;
    if (window.CapyMascot) {
      $("capy-scene").innerHTML = CapyMascot.scene(c.weather_code, c.is_day, window.innerWidth > 700, Number(state.settings.herdSize) || 2);
      if (!photoMode) $("capy-caption").textContent = CapyMascot.caption(c.weather_code, c.is_day);
    }
    if (window.CapyPhotos) {
      if (photoMode) CapyPhotos.start($("hero-card"));
      else CapyPhotos.stop();
    }
    $("hero-feels").textContent = fmtTemp(c.apparent_temperature);
    $("hero-high").textContent = fmtTemp(fc.daily.temperature_2m_max[0]);
    $("hero-low").textContent = fmtTemp(fc.daily.temperature_2m_min[0]);
    $("hero-rain").textContent = `${fc.hourly.precipitation_probability?.[i] ?? 0}%`;
    const sum = fc.daily.precipitation_sum?.[0];
    $("hero-precip").textContent = sum == null ? "" : `${state.units === "imperial" ? sum.toFixed(2) : Math.round(sum)} ${precipUnit()}`;
    const uv = Math.round(fc.hourly.uv_index?.[i] ?? 0);
    const uvLabel = uv <= 2 ? "Low" : uv <= 5 ? "Moderate" : uv <= 7 ? "High" : uv <= 10 ? "Very High" : "Extreme";
    $("hero-uv").textContent = `${uv} (${uvLabel})`;
  }

  function renderCorrectionChip() {
    const chip = $("adj-chip");
    const c = state.correction;
    if (!c || !c.applied) {
      chip.classList.add("hidden");
      return;
    }
    const sign = c.bias > 0 ? "+" : "−";
    chip.textContent =
      `📡 Adjusted ${sign}${Math.abs(c.bias).toFixed(1)}° from ${c.used.length} nearby ` +
      `station${c.used.length === 1 ? "" : "s"}` +
      (c.dropped ? ` (${c.dropped} outlier dropped)` : "");
    chip.classList.remove("hidden");
  }

  // ---------- Current-conditions widget tiles ----------
  const AQI_LEVELS = [
    [50, "Good", "#7fb26a"], [100, "Moderate", "#f0b41c"],
    [150, "Unhealthy for Sensitive Groups", "#e77b23"], [200, "Unhealthy", "#cf3b3b"],
    [300, "Very Unhealthy", "#8f3f97"], [Infinity, "Hazardous", "#7e0023"],
  ];
  const aqiLevel = (v) => AQI_LEVELS.find(([limit]) => v <= limit);

  function tile(icon, name, bodyHTML) {
    return `<div class="widget"><div class="widget-head"><span class="w-ico">${icon}</span>${name}</div>` +
      `<div class="widget-body">${bodyHTML}</div></div>`;
  }

  function renderWidgets(fc, aqi) {
    const c = fc.current;
    const i = currentHourIndex(fc);
    const parts = [];

    // Capybara Comfort Index™ — the tile the meteorology community
    // didn't ask for. Scores conditions by capybara standards.
    if (window.CapyMascot) {
      const tempF = state.units === "imperial" ? c.apparent_temperature : c.apparent_temperature * 9 / 5 + 32;
      const windMph = state.units === "imperial" ? c.wind_speed_10m : c.wind_speed_10m * 0.621371;
      const cc = CapyMascot.comfort({ tempF, code: c.weather_code, windMph, isDay: c.is_day });
      parts.push(tile("🐹", "Capybara Comfort Index™",
        `<div class="capy-comfort"><div class="cc-score">${cc.score}<span class="cc-outof">/10</span></div>` +
        `<div class="cc-oranges">${"🍊".repeat(Math.max(1, Math.round(cc.score / 2)))}</div>` +
        `<div class="cc-verdict">${cc.verdict}</div>` +
        `<div class="cc-note">Field notes: ${cc.note}</div></div>`));
    }

    // Feels Like — small dial mapped over a plausible temperature span.
    const feels = c.apparent_temperature;
    const span = state.units === "imperial" ? [-10, 110] : [-25, 45];
    parts.push(tile("🌡️", "Feels Like",
      Widgets.arcGauge({ frac: (feels - span[0]) / (span[1] - span[0]), color: "#f0b41c", value: fmtTemp(feels) })));

    // Wind compass.
    parts.push(tile("💨", "Wind",
      Widgets.compass({ dirDeg: c.wind_direction_10m }) +
      `<div class="widget-label">↘ <strong>${Math.round(c.wind_speed_10m)} ${speedUnit()} ${windDir(c.wind_direction_10m)}</strong>` +
      (c.wind_gusts_10m != null ? ` · gusts ${Math.round(c.wind_gusts_10m)}` : "") + `</div>`));

    // Humidity.
    const rh = c.relative_humidity_2m;
    parts.push(tile("💧", "Humidity",
      Widgets.arcGauge({ frac: rh / 100, color: "#1d67d2", value: `${rh}%`, sub: rh >= 70 ? "High" : rh <= 30 ? "Dry" : "" })));

    // UV Index.
    const uv = Math.round(fc.hourly.uv_index?.[i] ?? 0);
    const uvLabel = uv <= 2 ? "Low" : uv <= 5 ? "Moderate" : uv <= 7 ? "High" : uv <= 10 ? "Very High" : "Extreme";
    parts.push(tile("😎", "UV Index",
      Widgets.tickDial({ ticks: 11, filled: Math.min(uv, 11), color: "#e77b23", value: String(uv), sub: uvLabel })));

    // Air Quality.
    const aqiVal = aqi?.current?.us_aqi;
    if (aqiVal != null) {
      const [, label, color] = aqiLevel(aqiVal);
      parts.push(tile("🍃", "Air Quality",
        Widgets.arcGauge({ frac: Math.min(aqiVal / 300, 1), color, value: String(aqiVal), sub: label.length > 12 ? "Sensitive" : label })));
    }

    // Dew Point.
    const dew = c.dew_point_2m ?? fc.hourly.dew_point_2m?.[i];
    if (dew != null) {
      const dspan = state.units === "imperial" ? [30, 80] : [0, 27];
      parts.push(tile("💦", "Dew Point",
        `<div class="widget-value">${fmtTemp(dew)}</div>` +
        Widgets.rangeBar({ frac: (dew - dspan[0]) / (dspan[1] - dspan[0]) }) +
        `<div class="widget-foot" style="width:150px"><span>${dspan[0]}</span><span>${dspan[1]}</span></div>`));
    }

    // Pressure (mean-sea-level; 980–1040 hPa dial span).
    const p = c.pressure_msl ?? c.surface_pressure;
    const pDisplay = state.units === "imperial" ? `${(p * 0.02953).toFixed(2)} in` : `${Math.round(p)} hPa`;
    parts.push(tile("⏱️", "Pressure",
      Widgets.arcGauge({ frac: (p - 980) / 60, color: "#1d67d2", value: pDisplay.split(" ")[0], sub: pDisplay.split(" ")[1] })));

    // Visibility.
    const visRaw = fc.hourly.visibility?.[i];
    if (visRaw != null) {
      const visUnit = fc.hourly_units?.visibility || "m";
      const miles = visUnit === "ft" ? visRaw / 5280 : visRaw / 1609.34;
      const km = visUnit === "ft" ? (visRaw * 0.3048) / 1000 : visRaw / 1000;
      const visText = state.units === "imperial" ? `${Math.round(miles)} mi` : `${Math.round(km)} km`;
      parts.push(tile("👁️", "Visibility",
        `<div class="widget-value">${visText}</div>` +
        Widgets.barRow({ frac: Math.min(state.units === "imperial" ? miles / 10 : km / 16, 1), color: "#1d67d2" })));
    }

    // Cloud Cover.
    parts.push(tile("☁️", "Cloud Cover",
      Widgets.arcGauge({ frac: c.cloud_cover / 100, color: "#6c727c", value: `${c.cloud_cover}%`, sub: c.cloud_cover >= 85 ? "Overcast" : c.cloud_cover <= 15 ? "Clear" : "" })));

    // Sunrise · Sunset.
    const sr = fc.daily.sunrise[0], ss = fc.daily.sunset[0];
    const now = new Date(fc.current.time).getTime();
    const frac = (now - new Date(sr)) / (new Date(ss) - new Date(sr));
    parts.push(tile("🌅", "Sunrise · Sunset",
      Widgets.sunArc({ frac }) +
      `<div class="widget-foot" style="width:150px"><span>↑ ${fmtClock(sr)}</span><span>↓ ${fmtClock(ss)}</span></div>`));

    // Moon Phase.
    const moon = Widgets.moonPhase(new Date(fc.current.time));
    parts.push(tile("🌙", "Moon Phase",
      `<div style="font-size:2.6rem;line-height:1">${moon.emoji}</div>` +
      `<div class="widget-value" style="font-size:1.05rem">${moon.name}</div>` +
      `<div class="widget-label">${moon.illum}% illuminated</div>`));

    $("current-widgets").innerHTML = parts.join("");
  }

  // ---------- Right rail ----------
  function renderRail(fc, aqi) {
    const i = currentHourIndex(fc);
    const uv = Math.round(fc.hourly.uv_index?.[i] ?? 0);
    const aqiVal = aqi?.current?.us_aqi;
    const pollen = pollenSummary(aqi);
    const items = [
      { icon: "🌼", title: "Seasonal Allergies and Pollen Count Forecast", sub: pollen ? `${pollen.worstName} pollen is ${pollen.worstLevel.toLowerCase()} in your area` : "Pollen outlook for your area", goto: "allergies" },
      { icon: "😷", title: "Air Quality Forecast", sub: aqiVal != null ? `Air quality is ${aqiLevel(aqiVal)[1].toLowerCase()} in your area` : "Air quality outlook", goto: "airquality" },
      { icon: "🧴", title: "Sun Safety Forecast", sub: `UV index is ${uv <= 2 ? "low" : uv <= 5 ? "moderate" : uv <= 7 ? "high" : "very high"} right now (${uv})`, goto: "tenday" },
      { icon: "🚴", title: "Outdoor Activity Windows", sub: "Best hours for your saved activities", goto: "activities" },
    ];
    $("rail-health").innerHTML = items.map((it) =>
      `<a class="rail-item" data-goto="${it.goto}" href="#">` +
      `<span class="rail-ico">${it.icon}</span>` +
      `<span class="rail-text"><span class="rail-title">${it.title}</span><br /><span class="rail-sub">${it.sub}</span></span>` +
      `<span class="rail-arrow">›</span></a>`).join("");

    if (aqiVal != null) {
      const [, label, color] = aqiLevel(aqiVal);
      $("rail-aqi").innerHTML =
        `<div style="display:flex;align-items:center;gap:1rem">` +
        Widgets.arcGauge({ frac: Math.min(aqiVal / 300, 1), color, value: String(aqiVal), size: 88 }) +
        `<div><div class="rail-title">${label}</div><div class="rail-sub">US AQI · tap for pollutant detail</div></div></div>` +
        `<a class="link-next48" data-goto="airquality" href="#">See details ›</a>`;
    } else {
      $("rail-aqi").innerHTML = `<p class="rail-sub">Air quality data unavailable for this location.</p>`;
    }
  }

  function renderStationsCard() {
    const card = $("stations-card");
    const strip = $("stations-strip");
    if (!state.stations.length) {
      card.classList.add("hidden");
      return;
    }
    card.classList.remove("hidden");
    strip.innerHTML = "";
    const usedIds = new Set((state.correction?.used || []).map((s) => s.id));
    const pinned = (state.settings.myStation || "").trim().toUpperCase();
    const ordered = [...state.stations].sort((a, b) => {
      if (a.id.toUpperCase() === pinned) return -1;
      if (b.id.toUpperCase() === pinned) return 1;
      return a.distKm - b.distKm;
    });
    for (const s of ordered.slice(0, 6)) {
      const temp = Stations.cToDisplay(s.tempC, state.units);
      const ageMin = Math.max(0, Math.round((Date.now() - new Date(s.time).getTime()) / 60000));
      const div = document.createElement("div");
      const isPinned = s.id.toUpperCase() === pinned;
      div.className =
        "station-card" +
        (isPinned ? " pinned" : "") +
        (state.correction?.applied && !usedIds.has(s.id) ? " qc-dropped" : "");
      div.innerHTML =
        `<div class="st-name">${isPinned ? "📌 " : ""}${s.name}</div>` +
        `<div class="st-meta">${s.network} · ${s.id} · ${s.distKm.toFixed(1)} km · ${ageMin} min ago</div>` +
        `<div class="st-temp">${fmtTemp(temp)}</div>` +
        `<div class="st-extra">${s.humidity != null ? Math.round(s.humidity) + "% RH" : ""}` +
        `${s.windKmh != null ? " · " + Math.round(state.units === "imperial" ? s.windKmh / 1.609 : s.windKmh) + " " + speedUnit() : ""}</div>`;
      strip.appendChild(div);
    }
    $("stations-note").textContent = state.settings.synopticToken
      ? "Sources: NWS official stations + Synoptic (CWOP/mesonet). Grayed cards failed quality control."
      : "Source: NWS official stations. Add a free Synoptic token in Settings ⚙ for denser neighborhood coverage.";
  }

  function renderAlerts(fc) {
    const banner = $("alert-banner");
    const card = $("alerts-card");
    const list = $("alerts-list");

    if (state.alerts?.length) {
      const top = state.alerts[0].properties;
      banner.textContent = `⚠ ${top.event}: ${top.headline || "see details below"}`;
      banner.classList.remove("hidden");
      card.classList.remove("hidden");
      list.innerHTML = "";
      for (const a of state.alerts) {
        const p = a.properties;
        const item = document.createElement("div");
        item.className = `alert-item sev-${p.severity || "Unknown"}`;
        item.innerHTML =
          `<div class="al-event">${p.event} <span class="card-subtitle">${p.severity || ""}</span></div>` +
          `<div class="al-headline">${p.headline || ""}</div>` +
          `<details><summary>Full alert text</summary><pre>${(p.description || "").replace(/</g, "&lt;")}` +
          `${p.instruction ? "\n\n" + p.instruction.replace(/</g, "&lt;") : ""}</pre></details>`;
        list.appendChild(item);
      }
      return;
    }

    card.classList.add("hidden");
    if (state.alerts === null) {
      renderHeuristicBanner(fc, banner); // non-US fallback
    } else {
      banner.classList.add("hidden"); // NWS reachable, zero alerts
    }
  }

  /** WMO-code heuristic banner for locations api.weather.gov doesn't cover. */
  function renderHeuristicBanner(fc, banner) {
    const severe = { 95: "Thunderstorms", 96: "Thunderstorms with hail", 99: "Severe thunderstorms with hail", 65: "Heavy rain", 75: "Heavy snow", 66: "Freezing rain", 67: "Freezing rain", 82: "Violent rain showers" };
    const start = currentHourIndex(fc);
    for (let i = start; i < Math.min(start + 24, fc.hourly.time.length); i++) {
      const code = fc.hourly.weather_code[i];
      if (severe[code]) {
        const t = fc.hourly.time[i];
        const sameDay = t.slice(0, 10) === fc.current.time.slice(0, 10);
        banner.textContent = `⚠ Weather Alert: ${severe[code]} expected around ${fmtHour(t)} ${sameDay ? "today" : "tomorrow"}.`;
        banner.classList.remove("hidden");
        return;
      }
    }
    banner.classList.add("hidden");
  }

  // ---------- Today's Outlook (hourly strip with sun markers) ----------
  function renderOutlook(fc) {
    const start = currentHourIndex(fc);
    const el = $("today-hourly-strip");
    el.innerHTML = "";

    // Insight line, like the real site's one-sentence outlook.
    const hiToday = fc.daily.temperature_2m_max[0];
    const hiTomorrow = fc.daily.temperature_2m_max[1];
    const diff = Math.round(hiToday - hiTomorrow);
    const cmp = Math.abs(diff) <= 1 ? "about the same as" : diff > 0 ? `${Math.abs(diff)}° warmer than` : `${Math.abs(diff)}° cooler than`;
    const maxPp = Math.max(...fc.hourly.precipitation_probability.slice(start, start + 12).filter((v) => v != null), 0);
    $("outlook-insight").textContent =
      `Today's high temperature will be ${cmp} tomorrow's.` +
      (maxPp >= 40 ? ` Chance of precipitation reaches ${maxPp}% in the next 12 hours.` : "");

    // Sun events that fall inside the window get their own mini chip.
    const sunEvents = [];
    for (let d = 0; d < 2; d++) {
      if (fc.daily.sunrise?.[d]) sunEvents.push({ t: new Date(fc.daily.sunrise[d]), icon: "🌅", label: "Sunrise", clock: fmtClock(fc.daily.sunrise[d]) });
      if (fc.daily.sunset?.[d]) sunEvents.push({ t: new Date(fc.daily.sunset[d]), icon: "🌇", label: "Sunset", clock: fmtClock(fc.daily.sunset[d]) });
    }

    for (let i = start; i < Math.min(start + 24, fc.hourly.time.length); i++) {
      const hourStart = new Date(fc.hourly.time[i]);
      const hourEnd = new Date(hourStart.getTime() + 3600000);
      const w = wmo(fc.hourly.weather_code[i], fc.hourly.is_day?.[i] ?? 1);
      const chip = document.createElement("div");
      chip.className = "hour-chip" + (i === start ? " now" : "");
      chip.innerHTML =
        `<div class="hc-time">${i === start ? "Now" : fmtHour(fc.hourly.time[i])}</div>` +
        `<span class="hc-icon">${w.icon}</span>` +
        `<div class="hc-temp">${fmtTemp(fc.hourly.temperature_2m[i])}</div>` +
        `<div class="hc-precip">💧 ${fc.hourly.precipitation_probability?.[i] ?? 0}%</div>`;
      el.appendChild(chip);

      for (const ev of sunEvents) {
        if (ev.t >= hourStart && ev.t < hourEnd) {
          const mark = document.createElement("div");
          mark.className = "hour-chip sunmark";
          mark.innerHTML =
            `<div class="hc-time">${ev.clock.replace(" ", "").toLowerCase()}</div>` +
            `<span class="hc-icon">${ev.icon}</span>` +
            `<div class="hc-temp">${ev.label}</div>`;
          el.appendChild(mark);
        }
      }
    }
  }

  function renderTodaySegments(fc) {
    const segs = [
      { name: "Morning", from: 6, to: 12 },
      { name: "Afternoon", from: 12, to: 18 },
      { name: "Evening", from: 18, to: 24 },
      { name: "Overnight", from: 24, to: 30 },
    ];
    const baseDay = fc.current.time.slice(0, 10);
    const startIdx = fc.hourly.time.findIndex((t) => t.startsWith(baseDay) && new Date(t).getHours() === 0);
    const el = $("today-segments");
    el.innerHTML = "";
    for (const s of segs) {
      const idxs = [];
      for (let h = s.from; h < s.to; h++) {
        const i = startIdx + h;
        if (i >= 0 && i < fc.hourly.time.length) idxs.push(i);
      }
      if (!idxs.length) continue;
      const temps = idxs.map((i) => fc.hourly.temperature_2m[i]);
      const precips = idxs.map((i) => fc.hourly.precipitation_probability?.[i] ?? 0);
      const midIdx = idxs[Math.floor(idxs.length / 2)];
      const w = wmo(fc.hourly.weather_code[midIdx], fc.hourly.is_day?.[midIdx] ?? 1);
      const div = document.createElement("div");
      div.className = "segment";
      div.innerHTML =
        `<div class="seg-name">${s.name}</div>` +
        `<span class="seg-icon">${w.icon}</span>` +
        `<div class="seg-temp">${fmtTemp(Math.max(...temps))}</div>` +
        `<div class="seg-precip">💧 ${Math.max(...precips)}%</div>`;
      el.appendChild(div);
    }
  }

  // ---------- Hourly page (grouped by day, metric pills) ----------
  const METRIC_COLUMNS = {
    overview:      ["Temperature", "Precip amount", "Humidity", "Wind"],
    temperature:   ["Temperature", "Feels Like", "Humidity", "Wind"],
    feels:         ["Feels Like", "Temperature", "Humidity", "Wind"],
    precipitation: ["Precip chance", "Precip amount", "Temperature", "Wind"],
    wind:          ["Wind", "Gusts", "Temperature", "Precip chance"],
    humidity:      ["Humidity", "Dew Point", "Temperature", "Precip chance"],
  };

  function metricValue(fc, col, i) {
    switch (col) {
      case "Temperature": return `<span class="hr-temp">${fmtTemp(fc.hourly.temperature_2m[i])}</span>`;
      case "Feels Like": return `<span class="hr-temp">${fmtTemp(fc.hourly.apparent_temperature?.[i])}</span>`;
      case "Precip amount": {
        const v = fc.hourly.precipitation?.[i] ?? 0;
        return `<span class="hr-col">${state.units === "imperial" ? v.toFixed(2) : Math.round(v * 10) / 10} ${precipUnit()}</span>`;
      }
      case "Precip chance": return `<span class="hr-col" style="color:var(--blue);font-weight:700">${fc.hourly.precipitation_probability?.[i] ?? 0}%</span>`;
      case "Humidity": return `<span class="hr-col">${fc.hourly.relative_humidity_2m?.[i] ?? "—"}%</span>`;
      case "Dew Point": return `<span class="hr-col">${fmtTemp(fc.hourly.dew_point_2m?.[i])}</span>`;
      case "Wind": return `<span class="hr-muted">${Math.round(fc.hourly.wind_speed_10m[i])} ${speedUnit()} ${windDir(fc.hourly.wind_direction_10m[i])}</span>`;
      case "Gusts": return `<span class="hr-muted">${fc.hourly.wind_gusts_10m?.[i] != null ? Math.round(fc.hourly.wind_gusts_10m[i]) + " " + speedUnit() : "—"}</span>`;
      default: return "";
    }
  }

  function renderHourlyGroups(fc) {
    const start = currentHourIndex(fc);
    const cols = METRIC_COLUMNS[state.hourlyMetric];
    const wrap = $("hourly-groups");
    wrap.innerHTML = "";

    let currentDay = null;
    let card = null, listEl = null;
    for (let i = start; i < Math.min(start + 48, fc.hourly.time.length); i++) {
      const t = fc.hourly.time[i];
      const day = t.slice(0, 10);
      if (day !== currentDay) {
        currentDay = day;
        const head = document.createElement("h2");
        head.className = "hour-day-head";
        head.textContent = longDate(day);
        wrap.appendChild(head);
        card = document.createElement("div");
        card.className = "card table-card";
        card.innerHTML =
          `<div class="hourly-table-head"><span>Time</span><span></span><span>Sky condition</span>` +
          cols.map((c) => `<span class="num-head">${c}</span>`).join("") + `</div>`;
        listEl = card;
        wrap.appendChild(card);
      }
      const w = wmo(fc.hourly.weather_code[i], fc.hourly.is_day?.[i] ?? 1);
      const row = document.createElement("div");
      row.className = "hour-row";
      row.innerHTML =
        `<div class="hr-time">${i === start ? "Now" : fmtHour(t)}</div>` +
        `<div class="hr-icon">${w.icon}<span class="hr-pp">${fc.hourly.precipitation_probability?.[i] || 0}%</span></div>` +
        `<div class="hr-cond">${w.text}</div>` +
        cols.map((c) => `<div>${metricValue(fc, c, i)}</div>`).join("");
      listEl.appendChild(row);
    }
  }

  // ---------- 10 Day page (expandable rows) ----------
  function renderTenDay(fc) {
    const el = $("tenday-list");
    el.innerHTML = "";
    const d = fc.daily;
    const globalMin = Math.min(...d.temperature_2m_min);
    const globalMax = Math.max(...d.temperature_2m_max);
    const span = Math.max(globalMax - globalMin, 1);

    d.time.forEach((date, i) => {
      const w = wmo(d.weather_code[i], 1);
      const lo = d.temperature_2m_min[i];
      const hi = d.temperature_2m_max[i];
      const left = ((lo - globalMin) / span) * 100;
      const width = Math.max(((hi - lo) / span) * 100, 4);
      const wrap = document.createElement("div");
      wrap.className = "day-row-wrap";
      const sum = d.precipitation_sum?.[i];
      wrap.innerHTML =
        `<button class="day-row" aria-expanded="false">` +
        `<div class="dr-name">${dayName(date, i)}<span class="dr-date">${shortDate(date)}</span></div>` +
        `<div class="dr-cond-cell"><span class="dr-icon">${w.icon}</span><span class="dr-pp">${d.precipitation_probability_max?.[i] ?? 0}%</span><span class="dr-cond">${w.text}</span></div>` +
        `<span class="temp-lo">${fmtTemp(lo)}</span>` +
        `<div class="temp-bar"><div class="temp-bar-fill" style="left:${left}%;width:${width}%"></div></div>` +
        `<span class="temp-hi">${fmtTemp(hi)}</span>` +
        `<span class="dr-wind">${Math.round(d.wind_speed_10m_max[i])} ${speedUnit()} ↘ ${windDir(d.wind_direction_10m_dominant[i])}</span>` +
        `<span class="dr-chevron">▾</span>` +
        `</button>` +
        `<div class="day-detail"><div class="day-detail-grid">` +
        `<div class="dd-item"><div class="dd-label">Conditions</div><div class="dd-value">${w.text}</div></div>` +
        `<div class="dd-item"><div class="dd-label">Precip chance</div><div class="dd-value">${d.precipitation_probability_max?.[i] ?? 0}%</div></div>` +
        `<div class="dd-item"><div class="dd-label">Precip amount</div><div class="dd-value">${sum == null ? "—" : (state.units === "imperial" ? sum.toFixed(2) : Math.round(sum * 10) / 10) + " " + precipUnit()}</div></div>` +
        `<div class="dd-item"><div class="dd-label">Max UV index</div><div class="dd-value">${d.uv_index_max?.[i] != null ? Math.round(d.uv_index_max[i]) : "—"}</div></div>` +
        `<div class="dd-item"><div class="dd-label">Sunrise</div><div class="dd-value">${fmtClock(d.sunrise[i])}</div></div>` +
        `<div class="dd-item"><div class="dd-label">Sunset</div><div class="dd-value">${fmtClock(d.sunset[i])}</div></div>` +
        `<div class="dd-item"><div class="dd-label">Wind</div><div class="dd-value">${windDir(d.wind_direction_10m_dominant[i])} up to ${Math.round(d.wind_speed_10m_max[i])} ${speedUnit()}</div></div>` +
        `</div></div>`;
      const btn = wrap.querySelector(".day-row");
      const detail = wrap.querySelector(".day-detail");
      btn.addEventListener("click", () => {
        const open = detail.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
      });
      el.appendChild(wrap);
    });
  }

  // ---------- Monthly calendar ----------
  async function ensureMonthly() {
    if (!state.location) return;
    const key = `${state.location.lat},${state.location.lon},${state.units}`;
    if (state.monthlyKey === key) return;
    $("monthly-grid").innerHTML = `<p class="cal-note">Loading calendar…</p>`;
    try {
      const data = await API.getMonthlyDaily(state.location.lat, state.location.lon, state.units);
      state.monthlyKey = key;
      renderMonthly(data);
    } catch (err) {
      $("monthly-grid").innerHTML = `<p class="cal-note">Could not load monthly data: ${err.message}</p>`;
    }
  }

  function renderMonthly(data) {
    const byDate = {};
    data.daily.time.forEach((t, i) => {
      byDate[t] = {
        code: data.daily.weather_code[i],
        hi: data.daily.temperature_2m_max[i],
        lo: data.daily.temperature_2m_min[i],
      };
    });

    const todayStr = (state.forecast?.current.time || new Date().toISOString()).slice(0, 10);
    const [y, m] = todayStr.split("-").map(Number);
    $("monthly-label").textContent = new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const first = new Date(y, m - 1, 1);
    const daysInMonth = new Date(y, m, 0).getDate();
    const grid = $("monthly-grid");
    grid.innerHTML = "";
    for (let i = 0; i < first.getDay(); i++) {
      grid.insertAdjacentHTML("beforeend", `<div class="cal-cell empty"></div>`);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const rec = byDate[iso];
      const isToday = iso === todayStr;
      const isPast = iso < todayStr;
      let inner = `<span class="cal-date">${day}</span>`;
      if (rec && rec.hi != null) {
        inner += `<span class="cal-icon">${wmo(rec.code, 1).icon}</span>` +
          `<span class="cal-temps"><span class="cal-hi">${fmtTemp(rec.hi)}</span><span class="cal-lo">${fmtTemp(rec.lo)}</span></span>`;
      }
      grid.insertAdjacentHTML("beforeend",
        `<div class="cal-cell${isToday ? " today" : isPast ? " past" : ""}">${inner}</div>`);
    }
  }

  // ---------- Air Quality page ----------
  const POLLUTANTS = [
    { key: "pm2_5", name: "PM2.5", sub: "Fine particulate matter", max: 75 },
    { key: "pm10", name: "PM10", sub: "Coarse particulate matter", max: 200 },
    { key: "ozone", name: "O₃", sub: "Ozone", max: 200 },
    { key: "nitrogen_dioxide", name: "NO₂", sub: "Nitrogen dioxide", max: 200 },
    { key: "sulphur_dioxide", name: "SO₂", sub: "Sulphur dioxide", max: 350 },
    { key: "carbon_monoxide", name: "CO", sub: "Carbon monoxide", max: 10000 },
  ];

  function renderAirQualityPage(aqi) {
    const el = $("aq-content");
    const v = aqi?.current?.us_aqi;
    if (v == null) {
      el.innerHTML = `<div class="card"><p class="blend-explainer">Air quality data is unavailable for this location.</p></div>`;
      return;
    }
    const [, label, color] = aqiLevel(v);
    const desc =
      v <= 50 ? "Air quality is considered satisfactory, and air pollution poses little or no risk." :
      v <= 100 ? "Air quality is acceptable; however, some pollutants may be a moderate concern for a small number of unusually sensitive people." :
      v <= 150 ? "Members of sensitive groups may experience health effects. The general public is less likely to be affected." :
      v <= 200 ? "Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects." :
      "Health warnings of emergency conditions. The entire population is likely to be affected.";

    let html = `<div class="card"><div class="aq-hero">` +
      `<div class="aq-dial-wrap">${Widgets.arcGauge({ frac: Math.min(v / 300, 1), color, value: String(v), sub: "US AQI", size: 160 })}</div>` +
      `<div class="aq-text"><div class="aq-cat" style="color:${color}">${label}</div><p class="aq-desc">${desc}</p></div>` +
      `</div></div>`;

    html += `<h2 class="section-title">Pollutants</h2><div class="pollutant-grid">`;
    for (const p of POLLUTANTS) {
      const val = aqi.current[p.key];
      if (val == null) continue;
      const frac = Math.min(val / p.max, 1);
      const barColor = frac < 0.34 ? "#7fb26a" : frac < 0.67 ? "#f0b41c" : "#cf3b3b";
      html += `<div class="poll-tile">` +
        `<div class="poll-name">${p.name}</div><div class="poll-sub">${p.sub}</div>` +
        `<div class="poll-value">${Math.round(val * 10) / 10} <span class="poll-unit">µg/m³</span></div>` +
        `<div class="poll-bar"><div class="poll-bar-fill" style="width:${(frac * 100).toFixed(0)}%;background:${barColor}"></div></div>` +
        `</div>`;
    }
    html += `</div>`;
    el.innerHTML = html;
  }

  // ---------- Allergies page ----------
  const POLLENS = [
    { key: "grass_pollen", name: "Grass", icon: "🌾" },
    { key: "birch_pollen", name: "Birch", icon: "🌳" },
    { key: "alder_pollen", name: "Alder", icon: "🌳" },
    { key: "ragweed_pollen", name: "Ragweed", icon: "🌿" },
    { key: "mugwort_pollen", name: "Mugwort", icon: "🌿" },
    { key: "olive_pollen", name: "Olive", icon: "🫒" },
  ];

  function pollenLevel(v) {
    if (v == null) return null;
    if (v < 10) return ["Low", "#7fb26a"];
    if (v < 50) return ["Moderate", "#f0b41c"];
    if (v < 200) return ["High", "#e77b23"];
    return ["Very High", "#cf3b3b"];
  }

  function pollenSummary(aqi) {
    if (!aqi?.current) return null;
    let worst = null;
    for (const p of POLLENS) {
      const v = aqi.current[p.key];
      if (v == null) continue;
      if (!worst || v > worst.value) worst = { value: v, worstName: p.name, worstLevel: pollenLevel(v)[0] };
    }
    return worst;
  }

  function renderAllergyPage(fc, aqi) {
    const el = $("allergy-content");
    const hasPollen = POLLENS.some((p) => aqi?.current?.[p.key] != null);
    let html = "";

    if (hasPollen) {
      html += `<h2 class="section-title" style="margin-top:0">Pollen Breakdown</h2><div class="pollutant-grid">`;
      for (const p of POLLENS) {
        const v = aqi.current[p.key];
        if (v == null) continue;
        const [label, color] = pollenLevel(v);
        html += `<div class="poll-tile">` +
          `<div class="poll-name">${p.icon} ${p.name} Pollen</div><div class="poll-sub">grains/m³</div>` +
          `<div class="poll-value">${Math.round(v)}</div>` +
          `<span class="level-pill" style="background:${color}">${label}</span>` +
          `</div>`;
      }
      html += `</div>`;
    } else {
      html += `<div class="card"><p class="blend-explainer">Modeled pollen concentrations are currently only published for Europe by
        Open-Meteo's air quality model (CAMS). For this location, use the conditions below — dry, windy days spread the most
        pollen, and rain washes it out.</p></div>`;
    }

    // Allergy-relevant conditions, always shown.
    const i = currentHourIndex(fc);
    const c = fc.current;
    html += `<h2 class="section-title">Conditions That Affect Allergies</h2><div class="pollutant-grid">` +
      `<div class="poll-tile"><div class="poll-name">💨 Wind</div><div class="poll-sub">stronger wind spreads pollen</div><div class="poll-value">${Math.round(c.wind_speed_10m)} <span class="poll-unit">${speedUnit()}</span></div></div>` +
      `<div class="poll-tile"><div class="poll-name">💧 Humidity</div><div class="poll-sub">humid air keeps pollen down</div><div class="poll-value">${c.relative_humidity_2m}<span class="poll-unit">%</span></div></div>` +
      `<div class="poll-tile"><div class="poll-name">🌧️ Rain chance</div><div class="poll-sub">rain washes pollen out</div><div class="poll-value">${fc.hourly.precipitation_probability?.[i] ?? 0}<span class="poll-unit">%</span></div></div>` +
      `</div>`;
    el.innerHTML = html;
  }

  // ---------- Model blend panel ----------
  async function loadBlendPanel() {
    const { lat, lon } = state.location;
    try {
      const data = await API.getMultiModelForecast(lat, lon, state.units);
      renderBlend(data);
    } catch (err) {
      $("blend-chart-wrap").innerHTML = `<p class="blend-explainer">Model data unavailable: ${err.message}</p>`;
    }
  }

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function renderBlend(data) {
    const models = API.BLEND_MODELS;
    const { times, series } = Blend.extractSeries(data, "temperature_2m", models);
    const { blend, spread } = Blend.consensus(series, models);

    // Local-station corrected line, when a correction is live.
    let corrected = null;
    if (state.correction?.applied) {
      corrected = blend.map((v, i) =>
        v == null ? null : v + state.correction.bias * Math.max(0, 1 - i / CORRECTION_HOURS)
      );
    }

    const legend = $("blend-legend");
    legend.innerHTML = "";
    for (const m of models.filter((m) => series[m.id])) {
      legend.innerHTML += `<span class="legend-item"><span class="legend-swatch" style="background:${m.color}"></span>${m.label} (w=${m.weight})</span>`;
    }
    legend.innerHTML += `<span class="legend-item" style="color:#1d67d2"><span class="legend-swatch dashed"></span><strong>Blended consensus</strong></span>`;
    if (corrected) {
      legend.innerHTML += `<span class="legend-item" style="color:#e77b23"><span class="legend-swatch" style="background:#e77b23"></span><strong>Blend + local station correction</strong></span>`;
    }

    const N = Math.min(48, times.length);
    const all = [];
    for (const m of models) if (series[m.id]) all.push(...series[m.id].slice(0, N).filter((v) => v != null));
    if (!all.length) { $("blend-chart-wrap").innerHTML = "<p class='blend-explainer'>No model data returned for this location.</p>"; return; }
    const yMin = Math.floor(Math.min(...all)) - 2;
    const yMax = Math.ceil(Math.max(...all)) + 2;

    const gridColor = cssVar("--card-border", "#e3e5e8");
    const gridFaint = cssVar("--inner", "#f2f3f5");
    const labelColor = cssVar("--muted", "#6c727c");

    const W = 900, H = 320, padL = 44, padR = 12, padT = 12, padB = 34;
    const x = (i) => padL + (i / (N - 1)) * (W - padL - padR);
    const y = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB);
    const path = (arr) => arr.slice(0, N).map((v, i) => (v == null ? "" : `${i === 0 || arr[i-1] == null ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)).join(" ");

    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Multi-model temperature forecast chart">`;
    const step = Math.max(2, Math.round((yMax - yMin) / 6));
    for (let v = yMin; v <= yMax; v += step) {
      svg += `<line x1="${padL}" y1="${y(v)}" x2="${W - padR}" y2="${y(v)}" stroke="${gridColor}" stroke-width="1"/>`;
      svg += `<text x="${padL - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="${labelColor}">${v}°</text>`;
    }
    for (let i = 0; i < N; i += 6) {
      svg += `<text x="${x(i)}" y="${H - 10}" text-anchor="middle" font-size="11" fill="${labelColor}">${fmtHour(times[i])}</text>`;
      svg += `<line x1="${x(i)}" y1="${padT}" x2="${x(i)}" y2="${H - padB}" stroke="${gridFaint}" stroke-width="1"/>`;
    }
    for (const m of models) {
      if (!series[m.id]) continue;
      svg += `<path d="${path(series[m.id])}" fill="none" stroke="${m.color}" stroke-width="1.6" opacity="0.75"/>`;
    }
    svg += `<path d="${path(blend)}" fill="none" stroke="#1d67d2" stroke-width="3" stroke-dasharray="7 4"/>`;
    if (corrected) svg += `<path d="${path(corrected)}" fill="none" stroke="#e77b23" stroke-width="2.5"/>`;
    svg += `</svg>`;
    $("blend-chart-wrap").innerHTML = svg;

    let rows = "";
    for (let i = 0; i < Math.min(12, N); i++) {
      rows += `<tr><td>${fmtHour(times[i])}</td>` +
        models.map((m) => `<td>${series[m.id] ? fmtTemp(series[m.id][i]) : "—"}</td>`).join("") +
        `<td class="blend-col">${fmtTemp(corrected ? corrected[i] : blend[i])}</td>` +
        `<td>${spread[i] == null ? "—" : spread[i].toFixed(1) + "°"}</td></tr>`;
    }
    $("blend-table-wrap").innerHTML =
      `<table class="blend-table"><thead><tr><th>Hour</th>` +
      models.map((m) => `<th>${m.label}</th>`).join("") +
      `<th>${corrected ? "Blend + Local" : "Blend"}</th><th>Spread</th></tr></thead><tbody>${rows}</tbody></table>`;

    let conf = Blend.confidenceSummary(spread.slice(0, N), tempUnit());
    if (corrected) {
      const sign = state.correction.bias > 0 ? "+" : "−";
      conf += ` Local stations are currently running ${sign}${Math.abs(state.correction.bias).toFixed(1)}° vs the models; the orange line applies that correction with a ${CORRECTION_HOURS}-hour decay.`;
    }
    $("blend-confidence").textContent = conf;
  }

  // ---------- Favorites ----------
  function favKey(loc) { return `${loc.lat.toFixed(3)},${loc.lon.toFixed(3)}`; }
  function isFavorite(loc) { return state.favorites.some((f) => favKey(f) === favKey(loc)); }

  function renderFavButton() {
    $("fav-btn").textContent = isFavorite(state.location) ? "★" : "☆";
  }

  function toggleFavorite() {
    if (isFavorite(state.location)) {
      state.favorites = state.favorites.filter((f) => favKey(f) !== favKey(state.location));
    } else {
      state.favorites.push(state.location);
    }
    localStorage.setItem("wc_favorites", JSON.stringify(state.favorites));
    renderFavButton();
    renderFavList();
  }

  function renderFavList() {
    const ul = $("fav-list");
    ul.innerHTML = "";
    if (!state.favorites.length) {
      ul.innerHTML = `<li class="card-subtitle" style="margin-left:0">No saved locations yet — tap ☆ to save this one.</li>`;
      return;
    }
    for (const f of state.favorites) {
      const li = document.createElement("li");
      li.innerHTML = `<span>${f.name}</span><button class="fav-remove" title="Remove">✕</button>`;
      li.querySelector("span").addEventListener("click", () => {
        closeLocPanel();
        loadLocation(f);
      });
      li.querySelector(".fav-remove").addEventListener("click", (e) => {
        e.stopPropagation();
        state.favorites = state.favorites.filter((x) => favKey(x) !== favKey(f));
        localStorage.setItem("wc_favorites", JSON.stringify(state.favorites));
        renderFavButton();
        renderFavList();
      });
      ul.appendChild(li);
    }
  }

  // ---------- Location panel + search ----------
  function openLocPanel() {
    renderFavList();
    $("loc-panel").classList.remove("hidden");
    $("search-input").focus();
  }
  function closeLocPanel() {
    $("loc-panel").classList.add("hidden");
    $("search-results").classList.add("hidden");
    $("search-input").value = "";
  }

  let searchTimer = null;
  function onSearchInput(e) {
    clearTimeout(searchTimer);
    const q = e.target.value.trim();
    if (q.length < 2) { $("search-results").classList.add("hidden"); return; }
    searchTimer = setTimeout(async () => {
      try {
        const results = await API.searchLocations(q);
        const ul = $("search-results");
        ul.innerHTML = "";
        results.forEach((r) => {
          const li = document.createElement("li");
          const admin = [r.admin1, r.country].filter(Boolean).join(", ");
          li.innerHTML = `${r.name} <span class="result-admin">${admin}</span>`;
          li.addEventListener("click", () => {
            closeLocPanel();
            loadLocation({ name: `${r.name}${r.admin1 ? ", " + r.admin1 : ""}`, lat: r.latitude, lon: r.longitude });
          });
          ul.appendChild(li);
        });
        ul.classList.toggle("hidden", !results.length);
      } catch { /* ignore transient search errors */ }
    }, 300);
  }

  function geolocate({ silent } = {}) {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(false);
      let settled = false;
      const settle = (ok, warn) => {
        if (settled) return;
        settled = true;
        if (warn && !silent) alert("Could not get your location — check browser permissions.");
        resolve(ok);
      };
      // Hard fallback: an unanswered permission prompt never fires either
      // callback, and the API's own timeout doesn't cover that state.
      setTimeout(() => settle(false, false), 10000);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (settled) return;
          settled = true;
          closeLocPanel();
          loadLocation({ name: "My Location", lat: pos.coords.latitude, lon: pos.coords.longitude });
          resolve(true);
        },
        () => settle(false, true),
        { timeout: 8000, maximumAge: 300000 }
      );
    });
  }

  // ---------- Tabs, sidebar, units, theme, settings ----------
  const SIDE_FOR_TAB = {
    today: "today", hourly: "today", tenday: "today", monthly: "today",
    allergies: "today", airquality: "today",
    map: "map", activities: "activities", blend: "blend",
  };

  function switchTab(name) {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === `tab-${name}`));
    document.querySelectorAll(".side-item").forEach((s) =>
      s.classList.toggle("active", s.dataset.goto === (SIDE_FOR_TAB[name] === "today" ? "today" : name))
    );
    if (name === "map") MapHub.init(state.location || DEFAULT_LOCATION);
    if (name === "monthly") ensureMonthly();
    window.scrollTo({ top: 0 });
  }

  function toggleUnits() {
    state.units = state.units === "imperial" ? "metric" : "imperial";
    localStorage.setItem("wc_units", state.units);
    $("unit-toggle").textContent = tempUnit();
    loadLocation(state.location);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("wc_theme", theme);
    $("theme-toggle").textContent = theme === "dark" ? "☀️ Theme" : "🌙 Theme";
    if (state.forecast) {
      loadBlendPanel(); // redraw chart with theme colors
      renderWidgets(state.forecast, state.aqi);
    }
  }

  function initTheme() {
    // The current weather.com is a light design; dark is the opt-in alternative.
    applyTheme(localStorage.getItem("wc_theme") || "light");
  }

  function openSettings() {
    $("set-synoptic").value = state.settings.synopticToken || "";
    $("set-mystation").value = state.settings.myStation || "";
    $("set-herd").value = String(state.settings.herdSize || 2);
    $("set-hero").value = state.settings.heroStyle || "photo";
    $("settings-modal").classList.remove("hidden");
  }

  function saveSettings() {
    state.settings.synopticToken = $("set-synoptic").value.trim();
    state.settings.myStation = $("set-mystation").value.trim();
    state.settings.herdSize = Number($("set-herd").value) || 2;
    state.settings.heroStyle = $("set-hero").value;
    localStorage.setItem("wc_settings", JSON.stringify(state.settings));
    $("settings-modal").classList.add("hidden");
    loadLocation(state.location); // refetch with new sources
  }

  // ---------- Share card ----------
  // Renders the current hero (photo or cartoon scene) + weather + the
  // capybara's motto onto a canvas and hands it to the system share sheet
  // (or downloads it where Web Share isn't available).
  async function shareCapyCard() {
    const fc = state.forecast;
    if (!fc) return;
    const c = fc.current;
    const W = 1080, H = 1350;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");

    const photo = (state.settings.heroStyle || "photo") === "photo" && window.CapyPhotos ? CapyPhotos.current() : null;
    const loadImg = (src, cors) => new Promise((res, rej) => {
      const im = new Image();
      if (cors) im.crossOrigin = "anonymous";
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = src;
    });

    try {
      let im;
      if (photo) {
        const hi = photo.u.replace("/200px-", `/${Math.min(photo.mw, 1280)}px-`);
        im = await loadImg(hi, true).catch(() => loadImg(photo.url, true));
      } else {
        const svg = CapyMascot.scene(c.weather_code, c.is_day, false, Number(state.settings.herdSize) || 2);
        im = await loadImg("data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg), false);
      }
      // cover-crop, biased toward the top third where the faces are
      const s = Math.max(W / im.width, H / im.height);
      const dw = im.width * s, dh = im.height * s;
      ctx.drawImage(im, (W - dw) / 2, Math.min(0, -(dh - H) * 0.32), dw, dh);
    } catch (e) {
      ctx.fillStyle = "#2f8fd0";
      ctx.fillRect(0, 0, W, H);
    }

    let g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "rgba(8,18,28,0.55)");
    g.addColorStop(0.35, "rgba(8,18,28,0.05)");
    g.addColorStop(0.62, "rgba(8,18,28,0.05)");
    g.addColorStop(1, "rgba(8,18,28,0.72)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const w = wmo(c.weather_code, c.is_day);
    const font = (weight, size) => `${weight} ${size}px -apple-system, "Segoe UI", Roboto, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 14;
    ctx.font = font(300, 64);
    ctx.fillText(state.location.name.split(",")[0], W / 2, 110);
    ctx.font = font(200, 230);
    ctx.fillText(fmtTemp(c.temperature_2m), W / 2, 330);
    ctx.font = font(400, 50);
    ctx.fillText(`\u2191 ${fmtTemp(fc.daily.temperature_2m_max[0])}   \u2193 ${fmtTemp(fc.daily.temperature_2m_min[0])}   ${w.text}`, W / 2, 405);

    const motto = photo ? `\u201C${photo.s}\u201D` : `\u201C${CapyMascot.wisdom()}\u201D`;
    const who = photo ? `\u2014 ${photo.n}, capybara` : "\u2014 the capybara";
    ctx.font = font(600, 46);
    const words = motto.split(" ");
    const lines = [];
    let line = "";
    for (const word of words) {
      const t = line ? line + " " + word : word;
      if (ctx.measureText(t).width > W - 140) { lines.push(line); line = word; }
      else line = t;
    }
    if (line) lines.push(line);
    let y = H - 195 - (lines.length - 1) * 56;
    for (const l of lines) { ctx.fillText(l, W / 2, y); y += 56; }
    ctx.font = font(500, 38);
    ctx.fillText(who, W / 2, y + 8);

    ctx.shadowBlur = 6;
    ctx.font = font(400, 26);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText("Capybara Weather \u00B7 pisowicz.github.io/capybara-weather", W / 2, H - 28);
    if (photo) {
      ctx.textAlign = "right";
      ctx.font = font(400, 22);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(`\u{1F4F7} ${photo.a} \u00B7 ${photo.l} \u00B7 Wikimedia Commons`, W - 24, H - 64);
    }

    const blob = await new Promise((res) => cv.toBlob(res, "image/png"));
    if (!blob) return;
    const file = new File([blob], "capybara-weather.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: "Capybara Weather" }).catch(() => {});
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "capybara-weather.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 10000);
    }
  }

  // ---------- Boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    // Every new photo introduces its capybara: name + personal motto.
    if (window.CapyPhotos) {
      CapyPhotos.onChange((p) => {
        if ((state.settings.heroStyle || "photo") !== "photo") return;
        $("capy-caption").textContent = `\u201C${p.s}\u201D \u2014 ${p.n}`;
      });
    }

    $("share-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      shareCapyCard().catch(() => {});
    });

    // Tap the scene: a squeak, and one more capybara arrives.
    $("hero-card").addEventListener("click", (e) => {
      if (!window.CapyMascot || e.target.closest("#adj-chip") || e.target.closest(".capy-photo-credit") || e.target.closest("#share-btn")) return;
      const r = $("hero-card").getBoundingClientRect();
      CapyMascot.sceneTap($("hero-card"), e.clientX - r.left, e.clientY - r.top);
    });
    $("unit-toggle").textContent = tempUnit();
    $("unit-toggle").addEventListener("click", toggleUnits);
    $("theme-toggle").addEventListener("click", () =>
      applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark")
    );
    $("search-input").addEventListener("input", onSearchInput);
    $("locate-btn").addEventListener("click", () => geolocate({ silent: false }));
    $("fav-btn").addEventListener("click", toggleFavorite);
    $("location-pill").addEventListener("click", () => {
      if ($("loc-panel").classList.contains("hidden")) openLocPanel();
      else closeLocPanel();
    });
    $("settings-btn").addEventListener("click", openSettings);
    $("settings-save").addEventListener("click", saveSettings);
    $("settings-close").addEventListener("click", () => $("settings-modal").classList.add("hidden"));
    $("logo-home").addEventListener("click", (e) => { e.preventDefault(); switchTab("today"); });

    document.querySelectorAll(".tab-btn").forEach((b) =>
      b.addEventListener("click", () => switchTab(b.dataset.tab))
    );
    // Sidebar buttons + any in-content links carrying data-goto.
    document.addEventListener("click", (e) => {
      const go = e.target.closest("[data-goto]");
      if (go) {
        e.preventDefault();
        switchTab(go.dataset.goto);
        return;
      }
      if (!e.target.closest(".loc-wrap")) closeLocPanel();
    });

    document.querySelectorAll(".metric-pill").forEach((p) =>
      p.addEventListener("click", () => {
        state.hourlyMetric = p.dataset.metric;
        document.querySelectorAll(".metric-pill").forEach((x) => x.classList.toggle("active", x === p));
        if (state.forecast) renderHourlyGroups(state.forecast);
      })
    );

    $("activity-form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (Activities.addFromForm(e.target)) {
        e.target.reset();
        if (state.forecast) Activities.render(state.forecast, state.units, currentHourIndex(state.forecast));
      }
    });
    $("activity-list").addEventListener("click", (e) => {
      const btn = e.target.closest(".activity-del");
      if (btn) {
        Activities.remove(btn.dataset.id);
        if (state.forecast) Activities.render(state.forecast, state.units, currentHourIndex(state.forecast));
      }
    });

    MapHub.wireControls();

    if ("serviceWorker" in navigator) {
      // When a new service worker takes over an already-controlled page,
      // reload once so the user actually sees the new version.
      const hadController = !!navigator.serviceWorker.controller;
      let reloaded = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (reloaded || !hadController) return;
        reloaded = true;
        location.reload();
      });
      navigator.serviceWorker
        .register("sw.js")
        .then((reg) => {
          // Re-check for updates whenever the app returns to the foreground
          // (installed PWAs can otherwise sit on a stale worker for days).
          document.addEventListener("visibilitychange", () => {
            if (!document.hidden) reg.update().catch(() => {});
          });
        })
        .catch(() => { /* offline support is best-effort */ });
    }

    // First visit: try geolocation before falling back to the default city.
    if (state.location) {
      loadLocation(state.location);
    } else {
      geolocate({ silent: true }).then((ok) => {
        if (!ok) loadLocation(DEFAULT_LOCATION);
      });
    }
  });
})();
