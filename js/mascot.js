/*
 * mascot.js — the Capybara Weather mascot.
 *
 * Draws a cute inline-SVG capybara whose scene matches the current
 * conditions: sunbathing in the sun, soaking in a hot spring with a
 * yuzu orange on its head when it rains, bundled in a scarf for snow,
 * hiding under a leaf during thunderstorms, dozing at night, and so on.
 * No external assets; every scene is generated here.
 */
(function () {
  "use strict";

  // Shared palette
  const FUR = "#b07a4e";
  const FUR_DARK = "#96633c";

  // Base capybara, side view, sitting. Options let scenes tweak the pose.
  // opts: { eye: "open"|"closed"|"happy", blush: bool, extras: svg string layered on the body }
  function capy(opts = {}) {
    const eye =
      opts.eye === "closed"
        ? '<path d="M118 62 q5 4 10 0" stroke="#3d2a1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
        : opts.eye === "happy"
        ? '<path d="M118 64 q5 -6 10 0" stroke="#3d2a1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
        : '<circle cx="123" cy="62" r="3.4" fill="#3d2a1a"/>';
    const blush = opts.blush === false ? "" : '<ellipse cx="116" cy="72" rx="5.5" ry="3.4" fill="#e59a7c" opacity="0.55"/>';
    return `
      <g class="capy-body">
        <!-- body -->
        <path d="M38 96 q-4 -34 34 -40 q28 -5 52 -2 q26 3 26 26 q0 24 -26 28 q-40 6 -66 0 q-18 -4 -20 -12 z" fill="${FUR}"/>
        <!-- head -->
        <path d="M112 38 q26 -4 34 14 q7 15 -2 26 q-8 10 -24 9 q-18 -1 -22 -16 q-5 -24 14 -33 z" fill="${FUR}"/>
        <!-- muzzle -->
        <path d="M138 54 q12 2 10 14 q-2 11 -14 10 q-10 -1 -10 -11 q0 -11 14 -13 z" fill="${FUR_DARK}"/>
        <ellipse cx="141" cy="62" rx="2.4" ry="1.7" fill="#3d2a1a"/>
        <path d="M137 72 q4 3 8 0" stroke="#3d2a1a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <!-- ear -->
        <path d="M113 40 q-2 -8 6 -9 q7 -1 6 7 q-1 6 -6 7 z" fill="${FUR_DARK}"/>
        ${eye}
        ${blush}
        <!-- legs -->
        <rect x="52" y="102" width="10" height="12" rx="5" fill="${FUR_DARK}"/>
        <rect x="112" y="102" width="10" height="12" rx="5" fill="${FUR_DARK}"/>
        ${opts.extras || ""}
      </g>`;
  }

  const rays = (cx, cy) =>
    [0, 45, 90, 135, 180, 225, 270, 315]
      .map((a) => `<line x1="${cx}" y1="${cy - 17}" x2="${cx}" y2="${cy - 23}" stroke="#f6b93b" stroke-width="3" stroke-linecap="round" transform="rotate(${a} ${cx} ${cy})"/>`)
      .join("");
  const sun = (cx, cy) => `<g class="capy-sun"><circle cx="${cx}" cy="${cy}" r="12" fill="#f6b93b"/>${rays(cx, cy)}</g>`;
  const cloud = (x, y, s = 1, o = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><path d="M0 14 q-1 -9 8 -10 q3 -8 12 -6 q8 2 8 8 q9 0 8 8 q-1 6 -8 6 l-22 0 q-6 -1 -6 -6 z" fill="#ffffff"/></g>`;
  const drops = (n) =>
    Array.from({ length: n }, (_, i) => {
      const x = 26 + ((i * 53) % 150);
      const d = (i * 0.35) % 1.4;
      return `<line class="capy-drop" style="animation-delay:${d}s" x1="${x}" y1="18" x2="${x - 3}" y2="28" stroke="#9ed2f0" stroke-width="3" stroke-linecap="round"/>`;
    }).join("");
  const flakes = (n) =>
    Array.from({ length: n }, (_, i) => {
      const x = 22 + ((i * 47) % 156);
      const d = (i * 0.5) % 2;
      return `<circle class="capy-flake" style="animation-delay:${d}s" cx="${x}" cy="${16 + ((i * 13) % 20)}" r="2.6" fill="#eaf4fc"/>`;
    }).join("");
  const zzz = `
    <g fill="#ffffff" font-family="inherit" font-weight="800" opacity="0.9">
      <text class="capy-z" x="142" y="34" font-size="13">z</text>
      <text class="capy-z" style="animation-delay:0.6s" x="154" y="24" font-size="10">z</text>
      <text class="capy-z" style="animation-delay:1.2s" x="163" y="16" font-size="8">z</text>
    </g>`;
  const yuzu = `
    <g transform="translate(120 30)">
      <circle cx="0" cy="0" r="8" fill="#f5a623"/>
      <circle cx="-3" cy="-3" r="2" fill="#ffd27f" opacity="0.8"/>
      <path d="M0 -8 q4 -5 8 -3 q-3 4 -8 3 z" fill="#6ab04c"/>
    </g>`;
  const steam = `
    <g stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.7">
      <path class="capy-steam" d="M55 78 q4 -7 0 -13 q-4 -6 0 -12"/>
      <path class="capy-steam" style="animation-delay:0.7s" d="M90 80 q4 -7 0 -13 q-4 -6 0 -12"/>
      <path class="capy-steam" style="animation-delay:1.4s" d="M160 80 q4 -7 0 -13 q-4 -6 0 -12"/>
    </g>`;
  // Hot-spring scene: only the capybara's head above the water line.
  const soakingCapy = `
    <g>
      ${steam}
      <path d="M112 52 q26 -4 34 14 q7 15 -2 26 q-8 10 -24 9 q-18 -1 -22 -16 q-5 -24 14 -33 z" fill="${FUR}" transform="translate(-24 4)"/>
      <path d="M138 68 q12 2 10 14 q-2 11 -14 10 q-10 -1 -10 -11 q0 -11 14 -13 z" fill="${FUR_DARK}" transform="translate(-24 4)"/>
      <ellipse cx="117" cy="76" rx="2.4" ry="1.7" fill="#3d2a1a"/>
      <path d="M113 86 q4 3 8 0" stroke="#3d2a1a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M89 58 q-2 -8 6 -9 q7 -1 6 7 q-1 6 -6 7 z" fill="${FUR_DARK}"/>
      <path d="M94 78 q5 -6 10 0" stroke="#3d2a1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="92" cy="86" rx="5.5" ry="3.4" fill="#e59a7c" opacity="0.6"/>
      <g transform="translate(-24 14)">${yuzu}</g>
      <path d="M20 96 q45 -10 80 0 q45 10 80 0 l0 24 l-160 0 z" fill="#7ec8e3" opacity="0.85"/>
      <path d="M20 96 q45 -10 80 0 q45 10 80 0" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.8"/>
      <circle cx="60" cy="104" r="2.5" fill="#ffffff" opacity="0.6"/>
      <circle cx="140" cy="108" r="3" fill="#ffffff" opacity="0.5"/>
    </g>`;
  const scarf = `
    <g>
      <path d="M104 78 q18 10 36 2 l2 8 q-20 9 -40 -2 z" fill="#d64545"/>
      <rect x="128" y="84" width="9" height="20" rx="4" fill="#d64545"/>
      <line x1="130" y1="100" x2="130" y2="104" stroke="#a83232" stroke-width="2"/>
      <line x1="134" y1="100" x2="134" y2="104" stroke="#a83232" stroke-width="2"/>
    </g>`;
  const shades = `
    <g>
      <rect x="114" y="56" width="17" height="11" rx="4" fill="#2d2d3a"/>
      <rect x="136" y="56" width="15" height="11" rx="4" fill="#2d2d3a"/>
      <line x1="131" y1="60" x2="136" y2="60" stroke="#2d2d3a" stroke-width="2.5"/>
      <circle cx="119" cy="59" r="1.8" fill="#ffffff" opacity="0.7"/>
    </g>`;
  const leaf = `
    <g transform="translate(96 6)">
      <line x1="24" y1="20" x2="20" y2="52" stroke="#4a7c3f" stroke-width="4" stroke-linecap="round"/>
      <path d="M-14 22 q20 -26 52 -14 q26 10 30 22 q-30 12 -52 6 q-24 -6 -30 -14 z" fill="#6ab04c"/>
      <path d="M-10 22 q30 -4 64 4" stroke="#4a7c3f" stroke-width="2" fill="none" opacity="0.7"/>
    </g>`;
  const bolt = `<path class="capy-bolt" d="M40 20 l-10 20 l8 0 l-7 17 l17 -21 l-8 0 l9 -16 z" fill="#f6d55c"/>`;
  const bird = `
    <g transform="translate(112 26)">
      <ellipse cx="0" cy="0" rx="7.5" ry="6" fill="#f6d55c"/>
      <circle cx="5" cy="-2" r="1.4" fill="#3d2a1a"/>
      <path d="M7 0 l5 2 l-5 2 z" fill="#e77b23"/>
      <path d="M-7 0 q-4 -4 -2 -7 q4 1 4 5 z" fill="#e8b923"/>
    </g>`;
  const moon = `<path d="M164 22 a13 13 0 1 0 12 18 a10.5 10.5 0 0 1 -12 -18 z" fill="#f5e6a8"/>`;
  const stars = `
    <g fill="#ffffff">
      <circle class="capy-star" cx="30" cy="20" r="1.8"/>
      <circle class="capy-star" style="animation-delay:0.8s" cx="70" cy="12" r="1.4"/>
      <circle class="capy-star" style="animation-delay:1.5s" cx="120" cy="20" r="1.6"/>
    </g>`;
  const grass = `
    <g stroke="#7fb069" stroke-width="2.5" stroke-linecap="round" fill="none">
      <path d="M24 114 q1 -8 -2 -12 M28 114 q0 -7 3 -10"/>
      <path d="M176 114 q1 -8 -2 -12 M180 114 q0 -7 3 -10"/>
    </g>`;
  const ground = (fill) => `<ellipse cx="100" cy="114" rx="88" ry="9" fill="${fill}"/>`;

  // One scene per condition group. Each returns inner SVG for a 200x124 viewBox.
  const SCENES = {
    "clear-day": () => `${sun(36, 32)}${ground("#a8d08d")}${grass}${capy({ eye: "happy", extras: shades })}`,
    "clear-night": () => `${moon}${stars}${ground("#5d7a52")}${capy({ eye: "closed" })}${zzz}`,
    partly: () => `${sun(36, 30)}${cloud(48, 18, 0.9)}${ground("#a8d08d")}${grass}${capy({ eye: "happy", extras: bird })}`,
    cloudy: () => `${cloud(24, 14, 1, 0.95)}${cloud(120, 8, 0.8, 0.85)}${ground("#9cbf85")}${capy({ extras: bird })}`,
    fog: () => `
      ${capy({ eye: "open" })}
      <g stroke="#ffffff" stroke-linecap="round" fill="none" opacity="0.75">
        <path class="capy-fog" d="M14 48 h74" stroke-width="7"/>
        <path class="capy-fog" style="animation-delay:1s" d="M96 72 h92" stroke-width="8"/>
        <path class="capy-fog" style="animation-delay:2s" d="M28 94 h120" stroke-width="7"/>
      </g>`,
    rain: () => `${cloud(30, 2, 1.1, 0.95)}${cloud(120, 0, 0.9, 0.9)}${drops(6)}${soakingCapy}`,
    snow: () => `${cloud(30, 2, 1, 0.95)}${flakes(8)}${ground("#eaf4fc")}${capy({ eye: "happy", extras: scarf })}`,
    storm: () => `${cloud(20, 2, 1.2, 0.95)}${cloud(110, 0, 1, 0.9)}${bolt}${drops(4)}${capy({ eye: "open", blush: false, extras: leaf })}`,
  };

  function groupFor(code, isDay) {
    if (code === 0 || code === 1) return isDay ? "clear-day" : "clear-night";
    if (code === 2) return "partly";
    if (code === 3) return "cloudy";
    if (code === 45 || code === 48) return "fog";
    if (code >= 95) return "storm";
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
    if (code >= 51) return "rain";
    return isDay ? "clear-day" : "clear-night";
  }

  function render(code, isDay = 1) {
    const g = groupFor(Number(code), Number(isDay));
    return `<svg viewBox="0 0 200 124" role="img" aria-label="Capybara mascot: ${g}" xmlns="http://www.w3.org/2000/svg">${SCENES[g]()}</svg>`;
  }

  window.CapyMascot = { render, groupFor };
})();
