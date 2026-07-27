/**
 * alerts.js — real government weather alerts from api.weather.gov (US).
 * Falls back to the WMO-code heuristic in app.js when no alerts are available
 * (non-US locations or API failure returns null, not []).
 */

const Alerts = (() => {
  const SEVERITY_RANK = { Extreme: 0, Severe: 1, Moderate: 2, Minor: 3, Unknown: 4 };

  /** Active alerts for a point, most severe first. Null = source unavailable. */
  async function fetchActive(lat, lon) {
    try {
      const res = await fetch(
        `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      const feats = (data.features || []).filter((f) => f.properties);
      feats.sort(
        (a, b) =>
          (SEVERITY_RANK[a.properties.severity] ?? 4) - (SEVERITY_RANK[b.properties.severity] ?? 4)
      );
      return feats;
    } catch {
      return null;
    }
  }

  return { fetchActive, SEVERITY_RANK };
})();
