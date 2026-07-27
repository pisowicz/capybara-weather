/**
 * activities.js — "Smart Forecasts": score upcoming hours against
 * user-defined ideal conditions and surface the best time windows.
 * Rules are stored in °F / mph; hourly data is converted before scoring so
 * the display-unit toggle never changes results. Pure client-side.
 */

const Activities = (() => {
  const STORAGE_KEY = "wc_activities";

  const TEMPLATES = [
    { id: "run", name: "Running", emoji: "🏃", tempMin: 45, tempMax: 70, windMax: 15, precipMax: 20, daylight: true },
    { id: "bike", name: "Cycling", emoji: "🚴", tempMin: 50, tempMax: 80, windMax: 12, precipMax: 15, daylight: true },
    { id: "dog", name: "Dog Walk", emoji: "🐕", tempMin: 30, tempMax: 85, windMax: 20, precipMax: 30, daylight: false },
    { id: "garden", name: "Gardening", emoji: "🌱", tempMin: 50, tempMax: 85, windMax: 15, precipMax: 25, daylight: true },
  ];

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(saved) && saved.length) return saved;
    } catch { /* fall through */ }
    return TEMPLATES.slice();
  }

  function save(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  /** Score one hour 0–100 against a rule set (0 = fails a hard condition). */
  function scoreHour(rule, tempF, windMph, precipPct, isDay) {
    if (rule.daylight && !isDay) return 0;
    if (tempF < rule.tempMin || tempF > rule.tempMax) return 0;
    if (windMph > rule.windMax) return 0;
    if (precipPct > rule.precipMax) return 0;
    const mid = (rule.tempMin + rule.tempMax) / 2;
    const half = Math.max((rule.tempMax - rule.tempMin) / 2, 1);
    const tempPenalty = (Math.abs(tempF - mid) / half) * 30;
    const windPenalty = (windMph / Math.max(rule.windMax, 1)) * 15;
    const precipPenalty = (precipPct / Math.max(rule.precipMax, 1)) * 15;
    return Math.max(1, Math.round(100 - tempPenalty - windPenalty - precipPenalty));
  }

  /**
   * Find contiguous windows of passing hours in the next 48h.
   * Returns top windows sorted by average score.
   */
  function findWindows(rule, fc, units, startIdx) {
    const toF = (t) => (units === "imperial" ? t : (t * 9) / 5 + 32);
    const toMph = (w) => (units === "imperial" ? w : w / 1.609);
    const end = Math.min(startIdx + 48, fc.hourly.time.length);

    const windows = [];
    let cur = null;
    for (let i = startIdx; i < end; i++) {
      const s = scoreHour(
        rule,
        toF(fc.hourly.temperature_2m[i]),
        toMph(fc.hourly.wind_speed_10m[i]),
        fc.hourly.precipitation_probability?.[i] ?? 0,
        fc.hourly.is_day?.[i] ?? 1
      );
      if (s > 0) {
        if (!cur) cur = { from: i, to: i, scores: [] };
        cur.to = i;
        cur.scores.push(s);
      } else if (cur) {
        windows.push(cur);
        cur = null;
      }
    }
    if (cur) windows.push(cur);
    return windows
      .map((w) => ({
        from: w.from,
        to: w.to,
        hours: w.to - w.from + 1,
        avg: Math.round(w.scores.reduce((a, b) => a + b, 0) / w.scores.length),
        peak: Math.max(...w.scores),
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);
  }

  // ---------- rendering ----------
  function fmtWindowLabel(fc, w) {
    const fmt = (iso) => {
      const d = new Date(iso);
      const day = d.toLocaleDateString("en-US", { weekday: "short" });
      let h = d.getHours();
      const ampm = h >= 12 ? "pm" : "am";
      h = h % 12 || 12;
      return { day, label: `${h} ${ampm}` };
    };
    const a = fmt(fc.hourly.time[w.from]);
    // Window end = the end of the last passing hour.
    const endDate = new Date(new Date(fc.hourly.time[w.to]).getTime() + 3600e3);
    let eh = endDate.getHours();
    const eampm = eh >= 12 ? "pm" : "am";
    eh = eh % 12 || 12;
    return `${a.day} ${a.label} – ${eh} ${eampm}`;
  }

  function render(fc, units, startIdx) {
    const listEl = document.getElementById("activity-list");
    if (!listEl || !fc) return;
    const activities = load();
    listEl.innerHTML = "";

    for (const rule of activities) {
      const windows = findWindows(rule, fc, units, startIdx);
      const card = document.createElement("div");
      card.className = "activity-card";
      const rulesText =
        `${rule.tempMin}–${rule.tempMax}°F · wind ≤ ${rule.windMax} mph · ` +
        `precip ≤ ${rule.precipMax}%${rule.daylight ? " · daylight" : ""}`;
      let windowsHtml;
      if (windows.length) {
        windowsHtml = windows
          .map(
            (w, i) =>
              `<div class="activity-window${i === 0 ? " best" : ""}">` +
              `<span class="aw-label">${i === 0 ? "★ Best" : "Also good"}</span>` +
              `<span class="aw-time">${fmtWindowLabel(fc, w)}</span>` +
              `<span class="aw-score">score ${w.avg}</span></div>`
          )
          .join("");
      } else {
        windowsHtml = `<div class="activity-window none">No good window in the next 48 hours.</div>`;
      }
      card.innerHTML =
        `<div class="activity-head"><span class="activity-emoji">${rule.emoji}</span>` +
        `<div><div class="activity-name">${rule.name}</div>` +
        `<div class="activity-rules">${rulesText}</div></div>` +
        `<button class="activity-del" data-id="${rule.id}" title="Remove">✕</button></div>` +
        windowsHtml;
      listEl.appendChild(card);
    }
  }

  function addFromForm(form) {
    const list = load();
    const name = form.querySelector("[name=act-name]").value.trim();
    if (!name) return false;
    list.push({
      id: "custom-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + list.length,
      name,
      emoji: form.querySelector("[name=act-emoji]").value.trim() || "⭐",
      tempMin: Number(form.querySelector("[name=act-tmin]").value) || 40,
      tempMax: Number(form.querySelector("[name=act-tmax]").value) || 80,
      windMax: Number(form.querySelector("[name=act-wind]").value) || 15,
      precipMax: Number(form.querySelector("[name=act-precip]").value) || 25,
      daylight: form.querySelector("[name=act-day]").checked,
    });
    save(list);
    return true;
  }

  function remove(id) {
    save(load().filter((a) => a.id !== id));
  }

  return { render, addFromForm, remove, findWindows, scoreHour, TEMPLATES };
})();
