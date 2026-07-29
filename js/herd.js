/*
 * herd.js — the collectible herd.
 *
 * Every capybara that appears in the photo rotation counts as "met" and
 * joins your herd, permanently (localStorage). The My Herd panel shows the
 * collection — met capybaras with their photo, name, and motto; unmet ones
 * as mystery cards — plus weather badges earned by opening the app in
 * notable conditions, and milestone toasts along the way.
 */
window.CapyHerd = (function () {
  "use strict";

  const MET_KEY = "wc_herd_met";
  const BADGE_KEY = "wc_herd_badges";

  const load = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } };
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  let met = load(MET_KEY);
  let badges = load(BADGE_KEY);

  const MILESTONES = [5, 10, 25, 50, 75, 100, 111];

  const BADGES = [
    { id: "rain", icon: "🌧️", name: "Rain Ranger", how: "open the app while it rains", test: (c) => (c.weather_code >= 51 && c.weather_code <= 67) || (c.weather_code >= 80 && c.weather_code <= 82) },
    { id: "storm", icon: "⛈️", name: "Storm Sitter", how: "open the app in a thunderstorm", test: (c) => c.weather_code >= 95 },
    { id: "snow", icon: "❄️", name: "Snow Loaf", how: "open the app while it snows", test: (c) => (c.weather_code >= 71 && c.weather_code <= 77) || c.weather_code === 85 || c.weather_code === 86 },
    { id: "fog", icon: "🌫️", name: "Fog Walker", how: "open the app in fog", test: (c) => c.weather_code === 45 || c.weather_code === 48 },
    { id: "night", icon: "🌙", name: "Night Owl", how: "check the weather at night", test: (c) => !c.is_day },
    { id: "heat", icon: "🥵", name: "Heat Loafer", how: "brave a 95°F+ scorcher", test: (c, tF) => tF >= 95 },
    { id: "cold", icon: "🥶", name: "Freeze Fluff", how: "brave 20°F or colder", test: (c, tF) => tF <= 20 },
    { id: "wind", icon: "💨", name: "Wind Compliance", how: "open the app in 25+ mph wind", test: (c, tF, wMph) => wMph >= 25 },
  ];

  function toast(msg) {
    const old = document.querySelector(".capy-toast");
    if (old) old.remove();
    const el = document.createElement("div");
    el.className = "capy-toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add("on"), 30);
    setTimeout(() => { el.classList.remove("on"); setTimeout(() => el.remove(), 600); }, 4200);
  }

  // Record a meeting. Returns the new count.
  function meet(name) {
    const isNew = !met[name];
    if (isNew) {
      met[name] = Date.now();
      save(MET_KEY, met);
      const n = Object.keys(met).length;
      if (MILESTONES.includes(n)) {
        toast(n === 111
          ? `🏆 ${name} was the last one — you've met the ENTIRE herd. 111/111.`
          : `🐹 New herd member: ${name}! ${n}/111 met`);
      }
      updateChip();
    }
    return Object.keys(met).length;
  }

  // Check the current conditions against badge criteria.
  function checkBadges(c, tempF, windMph) {
    for (const b of BADGES) {
      if (!badges[b.id] && b.test(c, tempF, windMph)) {
        badges[b.id] = Date.now();
        save(BADGE_KEY, badges);
        toast(`${b.icon} Badge earned: ${b.name}!`);
      }
    }
  }

  const count = () => Object.keys(met).length;

  function updateChip() {
    const chip = document.getElementById("herd-chip");
    if (chip) chip.textContent = `🐹 ${count()}/111`;
  }

  function render() {
    const badgeRow = document.getElementById("herd-badges");
    const grid = document.getElementById("herd-grid");
    const title = document.getElementById("herd-count");
    if (!grid || !window.CapyPhotos) return;
    const photos = CapyPhotos.all();

    if (title) title.textContent = `${count()} of ${photos.length} capybaras met`;

    badgeRow.innerHTML = BADGES.map((b) => {
      const got = !!badges[b.id];
      return `<div class="herd-badge ${got ? "got" : ""}" title="${got ? b.name : "Locked: " + b.how}">
        <span class="hb-ico">${got ? b.icon : "🔒"}</span>
        <span class="hb-name">${b.name}</span>
        <span class="hb-how">${got ? "earned" : b.how}</span>
      </div>`;
    }).join("");

    grid.innerHTML = photos.map((p) => {
      if (met[p.n]) {
        const when = new Date(met[p.n]).toLocaleDateString();
        return `<div class="herd-card met">
          <img src="${p.u.replace("/200px-", "/330px-")}" loading="lazy" alt="${p.n} the capybara">
          <div class="hc-name">${p.n}</div>
          <div class="hc-motto">“${p.s}”</div>
          <div class="hc-when">met ${when}</div>
        </div>`;
      }
      return `<div class="herd-card mystery" title="Keep opening the app — they'll wander in.">
        <div class="hc-q">?</div>
        <div class="hc-name">Not yet met</div>
      </div>`;
    }).join("");
  }

  return { meet, checkBadges, render, count, updateChip };
})();
