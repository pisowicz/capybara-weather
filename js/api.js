/**
 * api.js — Open-Meteo data layer.
 *
 * All endpoints are free and keyless. Two forecast calls are made per location:
 *   1. "best_match" forecast that powers the consumer UI (current / hourly / daily),
 *   2. a multi-model call (GFS + ECMWF + ICON) that powers the Model Blend panel,
 *      mirroring how The Weather Channel blends many NWP models into one forecast.
 */

const API = (() => {
  const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
  const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
  const AQI_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

  // Models used in the miniature blend. Weights loosely track published skill
  // rankings (ECMWF IFS > GFS ≈ ICON); the real TWC engine derives weights
  // dynamically from recent verification at each location and lead time.
  const BLEND_MODELS = [
    { id: "ecmwf_ifs025", label: "ECMWF IFS 0.25°", weight: 0.45, color: "#d64545" },
    { id: "gfs_seamless", label: "NOAA GFS", weight: 0.30, color: "#2e8b57" },
    { id: "icon_seamless", label: "DWD ICON", weight: 0.25, color: "#8a63d2" },
  ];

  async function getJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed (${res.status}): ${url}`);
    return res.json();
  }

  function unitParams(units) {
    return units === "imperial"
      ? "&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch"
      : "";
  }

  async function searchLocations(query) {
    const url = `${GEO_URL}?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const data = await getJSON(url);
    return data.results || [];
  }

  async function getForecast(lat, lon, units) {
    const current = [
      "temperature_2m", "apparent_temperature", "relative_humidity_2m",
      "weather_code", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m",
      "surface_pressure", "pressure_msl", "cloud_cover", "is_day",
      "dew_point_2m", "precipitation",
    ].join(",");
    const hourly = [
      "temperature_2m", "apparent_temperature", "precipitation_probability",
      "precipitation", "weather_code", "wind_speed_10m", "wind_direction_10m",
      "wind_gusts_10m", "relative_humidity_2m", "dew_point_2m",
      "visibility", "uv_index", "is_day",
    ].join(",");
    const daily = [
      "weather_code", "temperature_2m_max", "temperature_2m_min",
      "precipitation_probability_max", "precipitation_sum", "sunrise", "sunset",
      "wind_speed_10m_max", "wind_direction_10m_dominant", "uv_index_max",
    ].join(",");
    const url =
      `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` +
      `&current=${current}&hourly=${hourly}&daily=${daily}` +
      `&forecast_days=10&timezone=auto${unitParams(units)}`;
    return getJSON(url);
  }

  async function getMultiModelForecast(lat, lon, units) {
    const models = BLEND_MODELS.map((m) => m.id).join(",");
    const url =
      `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` +
      `&hourly=temperature_2m,precipitation&models=${models}` +
      `&forecast_days=3&timezone=auto${unitParams(units)}`;
    return getJSON(url);
  }

  async function getAirQuality(lat, lon) {
    const current = [
      "us_aqi", "european_aqi", "pm2_5", "pm10", "ozone",
      "nitrogen_dioxide", "sulphur_dioxide", "carbon_monoxide",
      "alder_pollen", "birch_pollen", "grass_pollen",
      "mugwort_pollen", "olive_pollen", "ragweed_pollen",
    ].join(",");
    const url = `${AQI_URL}?latitude=${lat}&longitude=${lon}&current=${current}&timezone=auto`;
    try {
      return await getJSON(url);
    } catch {
      return null; // AQI coverage is not global; degrade gracefully.
    }
  }

  /**
   * Daily series spanning the past month plus the forecast horizon — powers
   * the Monthly calendar. Past days come from the model analysis that
   * Open-Meteo blends into the forecast endpoint via past_days.
   */
  async function getMonthlyDaily(lat, lon, units) {
    const daily = "weather_code,temperature_2m_max,temperature_2m_min";
    const url =
      `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` +
      `&daily=${daily}&past_days=35&forecast_days=16&timezone=auto${unitParams(units)}`;
    return getJSON(url);
  }

  return { searchLocations, getForecast, getMultiModelForecast, getAirQuality, getMonthlyDaily, BLEND_MODELS };
})();
