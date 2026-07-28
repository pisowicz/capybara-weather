/*
 * mascot.js — the Capybara Weather herd.
 *
 * Every capybara in the app is drawn here as hand-built SVG: the detailed
 * scene capybaras (gradient fur, boxy muzzle, toes, whiskers), the babies,
 * the hot-spring soakers, the card peekers, the commuting footer staff,
 * and the loading-screen soaker. No external assets anywhere.
 */
(function () {
  "use strict";

  // ---------- Palette ----------
  const F = {
    ln: "#4a3423",     // the bold sticker outline
    body: "#dcaf80",   // flat tan coat
    patch: "#946b4b",  // head cap, muzzle patch, far limbs
    deep: "#7d573c",   // far legs / far ear
    belly: "#eed3ab",  // tummy highlight
    ear: "#7a5230",    // inner ear
    nose: "#4a3423",
    eye: "#3a2a1c",
    blush: "#f0a09b",
    // kept for grazers / older callers
    hi: "#c9a172", mid: "#a97c50", lo: "#8a6138", dk: "#6e4a2c",
  };

  // Shared fur gradient (one def per inline SVG; duplicate ids across
  // identical defs are harmless because the defs are identical).
  const furDefs = (id) => `
    <defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${F.hi}"/>
        <stop offset="0.5" stop-color="${F.mid}"/>
        <stop offset="1" stop-color="${F.lo}"/>
      </linearGradient>
    </defs>`;

  // Chrome won't paint gradients whose <defs> live in a display:none subtree
  // (hidden tab panels), so every standalone SVG gets a unique gradient id.
  let uid = 0;

  const place = (x, y, s, flip, inner, w = 260) =>
    `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})${flip ? ` translate(${-w} 0)` : ""}">${inner}</g>`;

  // ---------- The detailed capybara (side view, faces right, 260x160) ----------
  // opts: eye "open"|"closed"|"happy", shades, scarf, yuzu, beanie, leaf,
  //       bird, baby (bigger eye, no whiskers), fur (texture on/off)
  function capySide(opts = {}, gid = "capyFur") {
    const LW = 5;
    const eyeK = opts.shades ? "shades" : opts.eye || "open";
    const eye =
      eyeK === "closed"
        ? `<path d="M197 55 q7 8 14 1" stroke="${F.eye}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`
        : eyeK === "happy"
        ? `<path d="M197 59 q7 -10 14 -1" stroke="${F.eye}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`
        : eyeK === "shades"
        ? ""
        : `<circle cx="205" cy="56" r="${opts.baby ? 7.5 : 6}" fill="${F.eye}"/>
           <circle cx="207.5" cy="53" r="2.2" fill="#fff"/>
           <circle cx="202.5" cy="58.5" r="1.1" fill="#fff" opacity="0.8"/>`;
    const shades = opts.shades
      ? `<g>
          <path d="M186 46 C200 40 232 38 248 44" stroke="#23232e" stroke-width="5" stroke-linecap="round" fill="none"/>
          <rect x="194" y="44" width="34" height="21" rx="10" fill="#23232e"/>
          <rect x="234" y="43" width="12" height="17" rx="6" fill="#23232e"/>
          <circle cx="204" cy="51" r="3.4" fill="#fff" opacity="0.6"/>
          <path d="M194 50 C188 48 184 42 185 36" stroke="#23232e" stroke-width="4" stroke-linecap="round" fill="none"/>
        </g>`
      : "";
    const scarf = opts.scarf
      ? `<g stroke="${F.ln}" stroke-width="3" stroke-linejoin="round">
          <path d="M158 96 C170 108 196 112 214 104 L212 120 C192 128 166 122 152 110 Z" fill="#e05a5a"/>
          <path d="M176 116 L172 146 L186 146 L188 118 Z" fill="#e05a5a"/>
          <path d="M173 140 l0 8 M179 141 l0 8 M185 140 l0 8" stroke-width="2.5" stroke-linecap="round"/>
        </g>`
      : "";
    const yuzu = opts.yuzu
      ? `<g transform="translate(196 8)">
          <circle cx="0" cy="0" r="12" fill="#f2a53a" stroke="${F.ln}" stroke-width="3"/>
          <circle cx="-4" cy="-4" r="3.5" fill="#ffd27f" opacity="0.85"/>
          <path d="M1 -12 q6 -7 13 -4 q-5 6 -13 4 z" fill="#5f9e4a" stroke="${F.ln}" stroke-width="2"/>
        </g>`
      : "";
    const beanie = opts.beanie
      ? `<g stroke="${F.ln}" stroke-width="3" stroke-linejoin="round">
          <path d="M174 34 C178 12 224 10 234 30 C218 24 190 24 174 34 Z" fill="#5b8fc4"/>
          <rect x="172" y="28" width="64" height="10" rx="5" fill="#4a7aab"/>
          <circle cx="204" cy="11" r="7" fill="#f0e6d2"/>
        </g>`
      : "";
    const leaf = opts.leaf
      ? `<g transform="translate(120 -52)" stroke="${F.ln}" stroke-width="3.5" stroke-linejoin="round">
          <line x1="76" y1="30" x2="66" y2="74" stroke-width="6" stroke-linecap="round"/>
          <path d="M-24 30 Q30 -22 96 -6 Q152 8 162 30 Q104 54 52 46 Q0 38 -24 30 Z" fill="#74b657"/>
          <path d="M-16 30 Q70 14 154 28" stroke="#4a7c3f" stroke-width="3" fill="none" opacity="0.7"/>
        </g>`
      : "";
    const bird = opts.bird
      ? `<g transform="translate(196 4)" stroke="${F.ln}" stroke-width="2.5" stroke-linejoin="round">
          <ellipse cx="0" cy="0" rx="11" ry="9" fill="#f8dc6c"/>
          <circle cx="7" cy="-3" r="2" fill="${F.eye}" stroke="none"/>
          <path d="M10 0 l8 3 l-8 3 z" fill="#e77b23"/>
          <path d="M-10 -1 q-7 -6 -3 -11 q6 2 6 8 z" fill="#e8b923"/>
        </g>`
      : "";
    const whiskers = opts.baby
      ? ""
      : `<g fill="${F.ln}" opacity="0.65">
          <circle cx="222" cy="76" r="1.4"/><circle cx="226" cy="82" r="1.4"/><circle cx="219" cy="84" r="1.4"/>
        </g>`;

    return `
      <g class="capy-body" stroke-linejoin="round" stroke-linecap="round">
        <ellipse cx="136" cy="154" rx="112" ry="10" fill="#3a2c1c" opacity="0.14"/>
        <!-- far legs -->
        <rect x="76" y="118" width="18" height="34" rx="8" fill="${F.deep}" stroke="${F.ln}" stroke-width="3"/>
        <rect x="170" y="118" width="18" height="34" rx="8" fill="${F.deep}" stroke="${F.ln}" stroke-width="3"/>
        <!-- body -->
        <path d="M196 118 C204 86 188 52 146 42 C104 33 54 44 38 72 C26 94 32 122 60 133 C98 148 166 145 196 118 Z" fill="${F.body}" stroke="${F.ln}" stroke-width="${LW}"/>
        <ellipse cx="110" cy="114" rx="56" ry="17" fill="${F.belly}" opacity="0.85"/>
        <!-- near legs -->
        <rect x="48" y="124" width="21" height="30" rx="9" fill="${F.body}" stroke="${F.ln}" stroke-width="4"/>
        <rect x="142" y="124" width="21" height="30" rx="9" fill="${F.body}" stroke="${F.ln}" stroke-width="4"/>
        <path d="M55 147 l0 6 M62 147 l0 6 M149 147 l0 6 M156 147 l0 6" stroke="${F.ln}" stroke-width="2.4"/>
        <!-- far ear -->
        <path d="M166 32 q-3 -14 10 -14 q9 1 7 12 q-2 9 -9 9 q-6 -1 -8 -7 z" fill="${F.deep}" stroke="${F.ln}" stroke-width="3"/>
        <!-- head -->
        <path d="M152 62 C150 34 178 16 212 21 C240 25 254 42 254 64 C254 78 251 91 241 99 C228 109 202 112 184 104 C163 96 153 82 152 62 Z" fill="${F.body}" stroke="${F.ln}" stroke-width="${LW}"/>
        <!-- head cap -->
        <path d="M158 52 C168 26 198 14 226 23 C242 28 250 40 252 54 C240 42 220 35 200 36 C182 37 166 43 158 52 Z" fill="${F.patch}"/>
        <!-- near ear -->
        <path d="M186 28 q-4 -16 11 -17 q11 0 10 13 q-1 10 -10 11 q-8 0 -11 -7 z" fill="${F.body}" stroke="${F.ln}" stroke-width="3.6"/>
        <path d="M190 26 q-2 -9 7 -10 q7 0 6 8 q-1 6 -6 7 q-5 0 -7 -5 z" fill="${F.ear}"/>
        <!-- muzzle patch -->
        <ellipse cx="228" cy="72" rx="24" ry="26" fill="${F.patch}"/>
        ${eye}
        <ellipse cx="242" cy="58" rx="4" ry="5" fill="${F.nose}" transform="rotate(-12 242 58)"/>
        <path d="M244 68 C242 78 236 83 228 84" stroke="${F.nose}" stroke-width="2.8" fill="none"/>
        <path d="M228 84 q-4 3 -9 2" stroke="${F.nose}" stroke-width="2.4" fill="none" opacity="0.85"/>
        ${whiskers}
        <ellipse cx="192" cy="78" rx="9" ry="6" fill="${F.blush}" opacity="${opts.baby ? 0.9 : 0.75}"/>
        ${shades}${scarf}${yuzu}${beanie}${bird}${leaf}
      </g>`;
  }

  const baby = (opts = {}, gid) => capySide({ ...opts, baby: true, fur: false }, gid);

  // ---------- Soaking capybara (head above the waterline, 150x120) ----------
  function soakHead(opts = {}, gid = "capyFur") {
    const eye =
      opts.eye === "open"
        ? `<circle cx="86" cy="52" r="6" fill="${F.eye}"/><circle cx="88.5" cy="49" r="2.2" fill="#fff"/>`
        : opts.eye === "happy"
        ? `<path d="M79 55 q7 -10 14 -1" stroke="${F.eye}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`
        : `<path d="M79 51 q7 8 14 1" stroke="${F.eye}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
    const yuzu = opts.yuzu
      ? `<g transform="translate(74 2)">
          <circle cx="0" cy="0" r="11" fill="#f2a53a" stroke="${F.ln}" stroke-width="3"/>
          <circle cx="-3.5" cy="-3.5" r="3" fill="#ffd27f" opacity="0.85"/>
          <path d="M1 -11 q6 -6 12 -3 q-5 5 -12 3 z" fill="#5f9e4a" stroke="${F.ln}" stroke-width="2"/>
        </g>`
      : "";
    return `
      <g class="capy-body" stroke-linejoin="round" stroke-linecap="round">
        <path d="M44 26 q-4 -15 10 -15 q10 1 8 13 q-2 9 -10 9 q-6 -1 -8 -7 z" fill="${F.deep}" stroke="${F.ln}" stroke-width="3"/>
        <path d="M30 58 C28 30 56 12 90 17 C118 21 132 38 132 60 C132 74 129 87 119 95 C106 105 80 108 62 100 C41 92 31 78 30 58 Z" fill="${F.body}" stroke="${F.ln}" stroke-width="5"/>
        <path d="M36 48 C46 22 76 10 104 19 C120 24 128 36 130 50 C118 38 98 31 78 32 C60 33 44 39 36 48 Z" fill="${F.patch}"/>
        <path d="M64 24 q-4 -16 11 -17 q11 0 10 13 q-1 10 -10 11 q-8 0 -11 -7 z" fill="${F.body}" stroke="${F.ln}" stroke-width="3.6"/>
        <path d="M68 22 q-2 -9 7 -10 q7 0 6 8 q-1 6 -6 7 q-5 0 -7 -5 z" fill="${F.ear}"/>
        <ellipse cx="106" cy="68" rx="23" ry="25" fill="${F.patch}"/>
        ${eye}
        <ellipse cx="120" cy="54" rx="4" ry="5" fill="${F.nose}" transform="rotate(-12 120 54)"/>
        <path d="M122 64 C120 74 114 79 106 80" stroke="${F.nose}" stroke-width="2.8" fill="none"/>
        <g fill="${F.ln}" opacity="0.65">
          <circle cx="100" cy="72" r="1.4"/><circle cx="104" cy="78" r="1.4"/><circle cx="97" cy="80" r="1.4"/>
        </g>
        <ellipse cx="70" cy="74" rx="9" ry="6" fill="${F.blush}" opacity="0.85"/>
        ${yuzu}
      </g>`;
  }

  // ---------- Environment props ----------
  const reeds = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})" stroke-linecap="round">
      <path d="M0 0 q-4 -34 2 -58" stroke="#5f8a4c" stroke-width="4" fill="none"/>
      <ellipse cx="1" cy="-64" rx="5" ry="14" fill="#7a5230"/>
      <path d="M16 0 q6 -28 0 -48" stroke="#6f9a58" stroke-width="4" fill="none"/>
      <ellipse cx="14" cy="-54" rx="4.5" ry="12" fill="#8a6138"/>
      <path d="M-14 0 q-8 -22 -4 -40" stroke="#547a44" stroke-width="3.5" fill="none"/>
    </g>`;
  const flowers = (x, y, s = 1, c = "#e8788a") => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M0 0 q-2 -12 0 -20 M14 2 q2 -10 1 -16 M-13 1 q-2 -8 -1 -14" stroke="#5f8a4c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <g fill="${c}"><circle cx="0" cy="-24" r="4.5"/><circle cx="15" cy="-20" r="3.8"/><circle cx="-14" cy="-17" r="3.4"/></g>
      <g fill="#f6d55c"><circle cx="0" cy="-24" r="1.8"/><circle cx="15" cy="-20" r="1.5"/><circle cx="-14" cy="-17" r="1.4"/></g>
    </g>`;
  const tree = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <rect x="-6" y="-30" width="12" height="34" rx="5" fill="#7a5a3c"/>
      <ellipse cx="0" cy="-58" rx="42" ry="34" fill="#6f9a58"/>
      <ellipse cx="-24" cy="-44" rx="24" ry="18" fill="#7fae66"/>
      <ellipse cx="26" cy="-46" rx="22" ry="17" fill="#5f8a4c"/>
    </g>`;
  const bareTree = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})" stroke="#7d6652" fill="none" stroke-linecap="round">
      <path d="M0 4 L0 -46 M0 -20 L-20 -40 M0 -14 L18 -34 M0 -34 L-10 -48 M0 -30 L12 -46" stroke-width="7"/>
      <path d="M-20 -40 L-26 -50 M18 -34 L26 -44" stroke-width="5"/>
      <g stroke="none" fill="#eef5fb"><ellipse cx="0" cy="-48" rx="10" ry="4"/><ellipse cx="-22" cy="-44" rx="8" ry="3"/><ellipse cx="20" cy="-38" rx="8" ry="3"/></g>
    </g>`;
  const butterfly = (x, y) => `
    <g class="capy-butterfly" transform="translate(${x} ${y})">
      <path d="M0 0 Q-10 -12 -16 -4 Q-18 4 -2 4 Z" fill="#e8788a"/>
      <path d="M0 0 Q10 -12 16 -4 Q18 4 2 4 Z" fill="#f0a3b0"/>
      <line x1="0" y1="-2" x2="0" y2="5" stroke="#4a3a2c" stroke-width="1.6"/>
    </g>`;
  const fireflies = (W, H) => {
    let d = "";
    for (let i = 0; i < 7; i++) {
      const x = 40 + ((i * 137) % (W - 80)), y = H - 260 + ((i * 71) % 190), delay = (i * 0.7) % 3.5;
      d += `<circle class="capy-firefly" style="animation-delay:${delay}s" cx="${x}" cy="${y}" r="3" fill="#ffe38a"/>`;
    }
    return d;
  };
  const duck = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-14 0 Q-16 -12 -4 -12 Q2 -12 4 -8 Q16 -10 14 -2 Q12 4 0 4 Q-10 4 -14 0 Z" fill="#f8dc6c" stroke="#4a3423" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="-7" cy="-14" r="7" fill="#f8dc6c" stroke="#4a3423" stroke-width="2.4"/>
      <circle cx="-5" cy="-15.5" r="1.4" fill="#3a281a"/>
      <path d="M-14 -14 l-7 2 l7 3 z" fill="#e77b23" stroke="#4a3423" stroke-width="1.6" stroke-linejoin="round"/>
    </g>`;
  const snowCapy = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <ellipse cx="0" cy="14" rx="46" ry="6" fill="#c9d6e2" opacity="0.6"/>
      <path d="M34 8 C40 -8 32 -26 8 -30 C-16 -34 -38 -26 -42 -10 C-45 2 -38 10 -24 13 C-4 17 26 16 34 8 Z" fill="#ffffff" stroke="#b9c9d6" stroke-width="2.5"/>
      <path d="M22 -22 C22 -38 36 -46 52 -43 C64 -40 69 -32 68 -22 C67 -14 62 -8 54 -6 C44 -3 30 -6 26 -14 Z" fill="#ffffff" stroke="#b9c9d6" stroke-width="2.5"/>
      <path d="M30 -40 q-2 -9 6 -9 q7 0 6 8 q-1 6 -6 6 q-5 0 -6 -5 z" fill="#eef5fb" stroke="#c9d6e2" stroke-width="1.5"/>
      <path d="M52 -44 q0 -8 7 -7 q6 1 4 8 q-2 5 -6 5 q-4 -1 -5 -6 z" fill="#eef5fb" stroke="#c9d6e2" stroke-width="1.5"/>
      <circle cx="44" cy="-26" r="3" fill="#3a4a5a"/>
      <circle cx="45" cy="-27" r="0.9" fill="#fff"/>
      <ellipse cx="62" cy="-20" rx="5" ry="4" fill="#f2a53a"/>
      <path d="M64 -12 q-6 5 -13 3" stroke="#8fa3b5" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M-30 -4 l6 3 M-14 -8 l6 3 M2 -9 l6 3" stroke="#dfe9f2" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="-20" cy="2" r="2.2" fill="#8fa3b5"/><circle cx="-4" cy="0" r="2.2" fill="#8fa3b5"/><circle cx="12" cy="0" r="2.2" fill="#8fa3b5"/>
    </g>`;
  const splash = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})" stroke="#cfe4f2" stroke-width="2" fill="none" opacity="0.7">
      <ellipse cx="0" cy="0" rx="10" ry="3"/><ellipse cx="0" cy="0" rx="18" ry="5.5" opacity="0.5"/>
    </g>`;

  // Distant herd member: simplified, cheap, reads at small sizes.
  // graze=true lowers the head to the grass.
  function grazer(x, y, s, flip, graze, tint = "#96683e", op = 1) {
    const head = graze
      ? `<g transform="rotate(38 52 26)"><path d="M46 30 C45 16 58 8 74 10 C87 12 93 20 92 31 C91 39 87 45 79 47 C69 50 55 48 50 41 C47 37 46 33 46 30 Z" fill="${tint}"/><path d="M56 12 q-1 -7 5 -7 q5 0 4 6 q0 5 -4 5 q-4 0 -5 -4 z" fill="${tint}" opacity="0.75"/></g>`
      : `<path d="M46 26 C45 12 58 4 74 6 C87 8 93 16 92 27 C91 35 87 41 79 43 C69 46 55 44 50 37 C47 33 46 29 46 26 Z" fill="${tint}"/>
         <path d="M56 8 q-1 -7 5 -7 q5 0 4 6 q0 5 -4 5 q-4 0 -5 -4 z" fill="${tint}" opacity="0.75"/>
         <circle cx="72" cy="22" r="2" fill="#3a281a" opacity="0.8"/>`;
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})${flip ? " translate(-96 0)" : ""}" opacity="${op}">
      <rect x="12" y="34" width="7" height="14" rx="3.5" fill="${tint}"/>
      <rect x="42" y="34" width="7" height="14" rx="3.5" fill="${tint}"/>
      <path d="M58 36 C64 24 58 10 40 7 C22 4 4 9 0 21 C-3 31 2 40 14 43 C30 47 52 45 58 36 Z" fill="${tint}"/>
      ${head}
    </g>`;
  }

  // A cloud that is, on closer inspection, a capybara.
  const capyCloud = (x, y, s = 1, op = 0.75) => `
    <g class="capy-cloud-drift" transform="translate(${x} ${y}) scale(${s})" opacity="${op}" fill="#ffffff">
      <ellipse cx="0" cy="0" rx="58" ry="22"/>
      <ellipse cx="52" cy="-10" rx="22" ry="16"/>
      <ellipse cx="46" cy="-26" rx="7" ry="6"/>
      <ellipse cx="72" cy="-6" rx="8" ry="6"/>
    </g>`;

  // ---------- Sky + ambient ----------
  const SKIES = {
    "clear-day":   ["#2f8fd0", "#a8ddf5"],
    "clear-night": ["#0d1834", "#2c4570"],
    partly:        ["#3f9bd2", "#b5e0f2"],
    cloudy:        ["#6f8798", "#c3d0d9"],
    fog:           ["#8b99a3", "#d3dbe0"],
    rain:          ["#4e6478", "#9fb4c4"],
    snow:          ["#7d97ad", "#e3ecf4"],
    storm:         ["#232e40", "#5d6e85"],
  };

  function ambient(g, W) {
    if (g === "rain" || g === "storm") {
      let d = "";
      for (let i = 0; i < 18; i++) {
        const x = 14 + ((i * 61) % (W - 24)), y = ((i * 97) % 280), delay = (i * 0.21) % 1.7;
        d += `<line class="capy-drop-far" style="animation-delay:${delay}s" x1="${x}" y1="${y}" x2="${x - 6}" y2="${y + 22}" stroke="#cfe4f2" stroke-width="3" stroke-linecap="round" opacity="0.7"/>`;
      }
      if (g === "storm") d += `<path class="capy-bolt" d="M${Math.round(W * 0.78)} 90 l-26 52 l20 0 l-18 44 l44 -55 l-20 0 l23 -41 z" fill="#f6d55c"/>`;
      return d;
    }
    if (g === "snow") {
      let d = "";
      for (let i = 0; i < 20; i++) {
        const x = 10 + ((i * 53) % (W - 15)), y = ((i * 83) % 300), delay = (i * 0.37) % 3;
        d += `<circle class="capy-flake-far" style="animation-delay:${delay}s" cx="${x}" cy="${y}" r="${2.5 + (i % 3)}" fill="#ffffff" opacity="0.85"/>`;
      }
      return d;
    }
    if (g === "fog") {
      return `<g stroke="#ffffff" stroke-linecap="round" fill="none" opacity="0.5">
        <path class="capy-fog" d="M-20 220 h${Math.round(W * 0.66)}" stroke-width="26"/>
        <path class="capy-fog" style="animation-delay:1.4s" d="M${Math.round(W * 0.4)} 320 h${Math.round(W * 0.68)}" stroke-width="30"/>
        <path class="capy-fog" style="animation-delay:2.8s" d="M-30 410 h${Math.round(W * 0.78)}" stroke-width="26"/>
      </g>`;
    }
    if (g === "clear-night") {
      let d = `<path d="M${W - 76} 66 a30 30 0 1 0 28 42 a24 24 0 0 1 -28 -42 z" fill="#f5e6a8"/>`;
      for (let i = 0; i < 16; i++) {
        const x = 12 + ((i * 71) % (W - 20)), y = 16 + ((i * 47) % 320), delay = (i * 0.5) % 2.4;
        d += `<circle class="capy-star" style="animation-delay:${delay}s" cx="${x}" cy="${y}" r="${1.5 + (i % 2)}" fill="#ffffff"/>`;
      }
      return d;
    }
    if (g === "clear-day") {
      return `<circle cx="${W - 72}" cy="88" r="62" fill="#ffe38a" opacity="0.35"/>
        <circle cx="${W - 72}" cy="88" r="35" fill="#f6d55c"/>
        <path class="capy-bird-fly" d="M${Math.round(W * 0.18)} 130 q7 -8 14 0 q7 -8 14 0" stroke="#5a6a78" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path class="capy-bird-fly" style="animation-delay:-9s" d="M${Math.round(W * 0.3)} 92 q6 -7 12 0 q6 -7 12 0" stroke="#5a6a78" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>`;
    }
    return `<g fill="#ffffff">
      <ellipse class="capy-cloud-drift" cx="${Math.round(W * 0.23)}" cy="140" rx="85" ry="30" opacity="0.85"/>
      <ellipse class="capy-cloud-drift" style="animation-delay:-6s" cx="${Math.round(W * 0.77)}" cy="90" rx="70" ry="24" opacity="0.7"/>
    </g>
    ${capyCloud(Math.round(W * 0.5), 215, 0.9, 0.55)}`;
  }

  // ---------- Foreground compositions (the herd REALLY lives here) ----------
  function foreground(g, W, H, herd = 2) {
    const cx = W / 2;
    const wide = W > 500;
    const gy = H - 96; // ground horizon
    const hill = (fill, dx, ry) => `<ellipse cx="${cx + dx}" cy="${H + 30}" rx="${W * 0.85}" ry="${ry}" fill="${fill}"/>`;
    // A scattered background herd along the horizon line. Herd setting:
    // 1 = family only, 2 = herd (default), 3 = MAXIMUM CAPYBARA.
    const MAX_SPOTS = [[-0.24, 0.3, 1, 1], [0.2, 0.27, 0, 1], [0.03, 0.34, 0, 0], [-0.13, 0.24, 1, 0], [0.47, 0.28, 1, 1], [-0.48, 0.26, 0, 0]];
    const bgHerd = (tint, y0, spots) =>
      herd < 2 ? "" : spots.concat(herd >= 3 ? MAX_SPOTS : []).map(([fx, sc, flip, graze]) =>
        grazer(cx + fx * W, y0 + sc * 10, sc, flip, graze, tint, 0.85)).join("");

    if (g === "rain") {
      // The onsen at rush hour. Everyone is here. The duck is here.
      const poolTop = H - 170;
      const heads = wide
        ? [[-420, 0.85, "closed", 0], [-295, 0.7, "open", 1], [-160, 1.0, "closed", 0], [-10, 1.1, "closed", 0, 1], [140, 0.72, "open", 1], [255, 0.9, "happy", 0], [370, 0.6, "closed", 1]]
        : [[-185, 0.95, "closed", 0], [-60, 1.1, "closed", 0, 1], [72, 0.72, "open", 1], [148, 0.55, "closed", 0]];
      return `
        <g stroke="#e8ecf0" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.7">
          <path class="capy-steam" d="M${cx - 130} ${poolTop - 28} q5 -9 0 -17 q-5 -8 0 -16"/>
          <path class="capy-steam" style="animation-delay:0.8s" d="M${cx + 6} ${poolTop - 32} q5 -9 0 -17 q-5 -8 0 -16"/>
          <path class="capy-steam" style="animation-delay:1.6s" d="M${cx + 130} ${poolTop - 26} q5 -9 0 -17 q-5 -8 0 -16"/>
        </g>
        ${heads.map(([dx, sc, eye, flip, yz]) =>
          place(cx + dx, poolTop - 88 * sc, sc, !!flip, soakHead({ eye, yuzu: !!yz }, "csFur"), 150)).join("")}
        <!-- baby, mid-cannonball -->
        <g transform="translate(${cx + (wide ? 320 : 128)} ${poolTop - 150}) rotate(-24)">
          ${place(0, 0, 0.34, true, capySide({ eye: "happy", fur: false, baby: true }, "csFur"))}
        </g>
        <path d="M${cx + (wide ? 330 : 138)} ${poolTop - 168} q14 -18 34 -20 M${cx + (wide ? 344 : 152)} ${poolTop - 146} q10 -12 24 -14" stroke="#e8ecf0" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6"/>
        <path d="M-10 ${poolTop} C ${W * 0.25} ${poolTop - 14}, ${W * 0.75} ${poolTop + 12}, ${W + 10} ${poolTop - 4} L ${W + 10} ${H + 10} L -10 ${H + 10} Z" fill="#7ec8e3" opacity="0.94"/>
        <path d="M-10 ${poolTop} C ${W * 0.25} ${poolTop - 14}, ${W * 0.75} ${poolTop + 12}, ${W + 10} ${poolTop - 4}" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
        <g stroke="#ffffff" fill="none" opacity="0.45" stroke-width="2">
          <ellipse cx="${cx - 130}" cy="${poolTop + 34}" rx="58" ry="8"/>
          <ellipse cx="${cx + 20}" cy="${poolTop + 44}" rx="66" ry="9"/>
          <ellipse cx="${cx + 150}" cy="${poolTop + 30}" rx="42" ry="7"/>
        </g>
        <g fill="#9aa7b0" stroke="#8f9ca6" stroke-width="2">
          <ellipse cx="${cx - W * 0.44}" cy="${poolTop + 2}" rx="44" ry="17"/>
          <ellipse cx="${cx - W * 0.36}" cy="${poolTop + 10}" rx="30" ry="13" fill="#aab7c0"/>
          <ellipse cx="${cx + W * 0.43}" cy="${poolTop}" rx="48" ry="18"/>
          <ellipse cx="${cx + W * 0.34}" cy="${poolTop + 10}" rx="26" ry="12" fill="#8f9ca6"/>
        </g>
        <!-- towel capybara supervising from the rocks (needs the wide deck) -->
        ${wide ? place(cx - W * 0.47, poolTop - 92, 0.55, false, capySide({ eye: "closed", fur: false }, "csFur")) : ""}
        ${duck(cx - (wide ? 180 : 110), poolTop + 52, 1.1)}
        <circle cx="${cx - 60}" cy="${poolTop + 58}" r="3.5" fill="#ffffff" opacity="0.5"/>
        <circle cx="${cx + 88}" cy="${poolTop + 66}" r="2.5" fill="#ffffff" opacity="0.4"/>`;
    }

    if (g === "clear-night") {
      return `
        ${hill("#3a5138", -W * 0.3, 130)}
        ${bgHerd("#33472f", gy - 42, wide
          ? [[-0.42, 0.42, 0, 0], [-0.3, 0.36, 1, 0], [0.3, 0.4, 0, 0], [0.42, 0.34, 1, 0], [0.12, 0.32, 0, 0]]
          : [[-0.4, 0.4, 0, 0], [0.34, 0.36, 1, 0], [0.12, 0.3, 0, 0]])}
        ${hill("#4a6647", W * 0.25, 105)}
        ${fireflies(W, H)}
        ${reeds(cx - W * 0.44, gy + 40, 1.1)}
        <!-- the pile -->
        ${place(cx - 250, gy - 116, 0.92, false, capySide({ eye: "closed", fur: false }, "csFur"))}
        ${place(cx - 60, gy - 124, 1.02, true, capySide({ eye: "closed" }, "csFur"))}
        ${place(cx - 148, gy - 158, 0.5, false, baby({ eye: "closed", fur: false }, "csFur"))}
        ${place(cx + 60, gy - 58, 0.5, false, baby({ eye: "closed" }, "csFur"))}
        <g fill="#ffffff" font-weight="800" opacity="0.9" font-family="inherit">
          <text class="capy-z" x="${cx + 108}" y="${gy - 128}" font-size="26">z</text>
          <text class="capy-z" style="animation-delay:0.6s" x="${cx + 136}" y="${gy - 156}" font-size="20">z</text>
          <text class="capy-z" style="animation-delay:1.2s" x="${cx + 158}" y="${gy - 180}" font-size="15">z</text>
          <text class="capy-z" style="animation-delay:0.9s" x="${cx - 160}" y="${gy - 214}" font-size="13">z</text>
        </g>`;
    }

    if (g === "snow") {
      return `
        ${hill("#dde9f3", -W * 0.3, 130)}
        ${bgHerd("#b9c9d6", gy - 40, wide
          ? [[-0.44, 0.4, 0, 1], [-0.32, 0.34, 1, 0], [0.34, 0.38, 0, 1], [0.45, 0.32, 1, 0]]
          : [[-0.38, 0.38, 0, 1], [0.4, 0.34, 1, 0]])}
        ${hill("#eef5fb", W * 0.25, 105)}
        ${wide ? bareTree(cx - W * 0.46, gy + 6, 1.5) : ""}
        ${wide ? snowCapy(cx + 330, gy + 16, 1.3) : snowCapy(cx + 128, gy + 14, 1.0)}
        ${place(cx - 236, gy - 134, 1.08, false, capySide({ eye: "happy", scarf: true }, "csFur"))}
        ${place(cx - 20, gy - 66, 0.52, true, baby({ eye: "open", beanie: true }, "csFur"))}
        ${place(cx + (wide ? 180 : 40), gy - 116, 0.85, true, capySide({ eye: "closed", fur: false }, "csFur"))}
        <g fill="#c9d6e2" opacity="0.8">
          <ellipse cx="${cx - 250}" cy="${gy + 42}" rx="5" ry="2.5"/><ellipse cx="${cx - 226}" cy="${gy + 50}" rx="5" ry="2.5"/>
          <ellipse cx="${cx - 200}" cy="${gy + 44}" rx="5" ry="2.5"/><ellipse cx="${cx - 178}" cy="${gy + 52}" rx="5" ry="2.5"/>
        </g>`;
    }

    if (g === "storm") {
      return `
        ${hill("#59794c", -W * 0.3, 130)}
        ${bgHerd("#4c6841", gy - 38, wide
          ? [[-0.42, 0.36, 0, 0], [0.4, 0.38, 1, 0], [0.28, 0.3, 1, 0]]
          : [[-0.38, 0.34, 0, 0], [0.38, 0.32, 1, 0]])}
        ${hill("#6f965e", W * 0.25, 105)}
        ${splash(cx - 190, gy + 40, 1.2)}${splash(cx + 170, gy + 30, 1)}${splash(cx + 40, gy + 52, 0.8)}
        <!-- one leaf, many tenants -->
        ${place(cx - 210, gy - 132, 1.08, false, capySide({ eye: "open", leaf: true }, "csFur"))}
        ${place(cx - 20, gy - 108, 0.8, true, capySide({ eye: "closed", fur: false }, "csFur"))}
        ${place(cx - 96, gy - 62, 0.5, false, baby({ eye: "closed" }, "csFur"))}
        <!-- the one who simply accepts the rain -->
        ${place(cx + (wide ? 300 : 128), gy - 76, 0.62, true, capySide({ eye: "closed", fur: false }, "csFur"))}
        ${splash(cx + (wide ? 340 : 168), gy + 4, 0.7)}`;
    }

    if (g === "fog") {
      return `
        ${hill("#7e957a", -W * 0.3, 130)}
        ${hill("#8fa38c", W * 0.25, 105)}
        ${place(cx + 150, gy - 150, 0.5, false, `<g opacity="0.16">${capySide({ fur: false }, "csFur")}</g>`)}
        ${place(cx + 60, gy - 122, 0.72, true, `<g opacity="0.32">${capySide({ eye: "open", fur: false }, "csFur")}</g>`)}
        ${place(cx - 40, gy - 96, 0.6, false, `<g opacity="0.24">${capySide({ fur: false }, "csFur")}</g>`)}
        ${wide ? place(cx + 320, gy - 90, 0.55, false, `<g opacity="0.2">${capySide({ fur: false }, "csFur")}</g>`) : ""}
        ${wide ? place(cx - 400, gy - 100, 0.62, true, `<g opacity="0.26">${capySide({ fur: false }, "csFur")}</g>`) : ""}
        ${place(cx - 245, gy - 132, 1.08, false, capySide({ eye: "open" }, "csFur"))}
        ${place(cx - 120, gy - 60, 0.45, true, `<g opacity="0.85">${baby({ eye: "open" }, "csFur")}</g>`)}
        <path d="M-20 ${gy - 10} h${W + 40}" stroke="#ffffff" stroke-width="30" stroke-linecap="round" opacity="0.35" class="capy-fog"/>`;
    }

    if (g === "cloudy") {
      // Maximum group loaf.
      return `
        ${hill("#86ab74", -W * 0.3, 130)}
        ${bgHerd("#6f9058", gy - 40, wide
          ? [[-0.45, 0.4, 0, 1], [-0.33, 0.34, 1, 0], [0.3, 0.42, 0, 1], [0.44, 0.34, 1, 1], [0.1, 0.3, 1, 0]]
          : [[-0.42, 0.38, 0, 1], [0.34, 0.4, 1, 1], [0.1, 0.28, 0, 0]])}
        ${hill("#9cbf85", W * 0.25, 105)}
        ${reeds(cx + W * 0.42, gy + 36, 1.1)}
        ${place(cx - 285, gy - 112, 0.9, false, capySide({ eye: "closed", fur: false }, "csFur"))}
        ${place(cx - 60, gy - 124, 1.02, true, capySide({ eye: "open", bird: true }, "csFur"))}
        ${place(cx + (wide ? 190 : 105), gy - 100, 0.78, true, capySide({ eye: "closed", fur: false }, "csFur"))}
        ${place(cx - 105, gy - 60, 0.48, false, baby({ eye: "closed" }, "csFur"))}
        ${place(cx + 30, gy - 54, 0.42, true, baby({ eye: "open" }, "csFur"))}`;
    }

    if (g === "partly") {
      return `
        ${hill("#93b97e", -W * 0.3, 130)}
        ${bgHerd("#7aa065", gy - 40, wide
          ? [[-0.44, 0.4, 0, 1], [-0.3, 0.32, 1, 0], [0.32, 0.4, 0, 1], [0.44, 0.34, 1, 0]]
          : [[-0.4, 0.38, 0, 1], [0.36, 0.36, 1, 0]])}
        ${hill("#a9d18e", W * 0.25, 105)}
        ${wide ? tree(cx - 400, gy + 10, 1.3) : ""}
        ${flowers(cx + W * 0.38, gy + 26, 1.2)}
        ${place(cx - 230, gy - 134, 1.08, false, capySide({ eye: "happy", bird: true }, "csFur"))}
        ${place(cx - 10, gy - 68, 0.52, false, baby({ eye: "open" }, "csFur"))}
        ${place(cx + (wide ? 210 : 96), gy - 108, 0.8, true, capySide({ eye: "closed", fur: false }, "csFur"))}
        ${butterfly(cx + 118, gy - 130)}`;
    }

    // clear-day: sunbathing club, plus the grazing commuters on the hill
    return `
      ${hill("#93b97e", -W * 0.3, 130)}
      ${bgHerd("#7aa065", gy - 40, wide
        ? [[-0.45, 0.42, 0, 1], [-0.34, 0.36, 1, 0], [-0.12, 0.3, 0, 1], [0.3, 0.42, 0, 1], [0.42, 0.36, 1, 0], [0.14, 0.32, 1, 0]]
        : [[-0.42, 0.4, 0, 1], [0.36, 0.38, 1, 1], [0.12, 0.3, 0, 0]])}
      ${hill("#a9d18e", W * 0.25, 105)}
      ${wide ? tree(cx + 380, gy + 8, 1.4) : ""}
      ${flowers(cx - W * 0.4, gy + 28, 1.2)}
      ${flowers(cx + W * 0.42, gy + 22, 0.9, "#c99df0")}
      ${place(cx - 235, gy - 134, 1.08, false, capySide({ shades: true, eye: "happy" }, "csFur"))}
      ${place(cx + 15, gy - 68, 0.52, true, baby({ eye: "happy" }, "csFur"))}
      ${place(cx + (wide ? 200 : 92), gy - 110, 0.82, true, capySide({ eye: "closed", fur: false }, "csFur"))}
      ${butterfly(cx + 6, gy - 188)}
      ${wide ? butterfly(cx - 330, gy - 150) : ""}`;
  }

  // ---------- The immersive scene ----------
  // At herd level 3, the herd overflows the frame edges.
  function edgeExtras(g, W, H) {
    const gy = H - 96;
    if (g === "fog") return "";
    if (g === "rain") {
      const poolTop = H - 170;
      return `${place(-58, poolTop - 52, 0.62, false, soakHead({ eye: "closed" }, "csFur"), 150)}
        ${place(W - 76, poolTop - 46, 0.58, true, soakHead({ eye: "happy" }, "csFur"), 150)}
        ${duck(W - 40, poolTop + 70, 0.9)}`;
    }
    return `${place(-74, gy - 96, 0.78, false, capySide({ eye: "closed", fur: false }, "csFur"))}
      ${place(W - 96, gy - 88, 0.72, true, capySide({ eye: "closed", fur: false }, "csFur"))}
      ${place(W - 150, gy - 40, 0.34, false, baby({ eye: "open" }, "csFur"))}`;
  }

  function scene(code, isDay, wide, herd = 2) {
    const g = groupFor(Number(code), Number(isDay));
    const [top, bottom] = SKIES[g];
    const W = wide ? 1000 : 390, H = wide ? 980 : 700;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Capybara scene: ${g}">
      ${furDefs("csFur")}
      <defs><linearGradient id="csSky-${g}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/>
      </linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#csSky-${g})"/>
      ${ambient(g, W)}
      ${foreground(g, W, H, herd)}
      ${herd >= 3 ? edgeExtras(g, W, H) : ""}
    </svg>`;
  }

  // ---------- Captions (the capybara reports live) ----------
  const CAPTIONS = {
    "clear-day": [
      "I have achieved optimal warm. Do not perceive me.",
      "The sun and I have an arrangement. This is the arrangement.",
      "The little one is using me as furniture. This is fine.",
    ],
    "clear-night": [
      "The forecast said stars. I am counting them with my eyes closed.",
      "Night shift. All quiet. Mostly because I am asleep.",
      "Pile formation achieved. Goodnight.",
    ],
    partly: [
      "The bird says it's nice out. I pay the bird in crumbs, so I believe it.",
      "Half sun, half cloud. I remain fully committed to sitting.",
      "The bird found us. The bird always finds us.",
    ],
    cloudy: [
      "Big gray fluffy sky. Relatable content.",
      "Group loaf engaged. Do not schedule anything.",
      "The clouds are doing my job: hanging around, looking soft.",
    ],
    fog: [
      "I can't see you. Legally, that means it's nap time.",
      "The sky came down for a soak. Respect.",
      "We are somewhere. That is all we know.",
    ],
    rain: [
      "The sky is refilling my tub. Please hold all appointments.",
      "Room for one more in the spring. It's you. Get in.",
      "Bath night. Everyone was invited. Everyone came.",
    ],
    snow: [
      "Cold fluff falling from the sky. I have a scarf. I am invincible.",
      "The small one has a hat now. Morale is extremely high.",
      "We made a snow capybara. It's not going anywhere. Neither are we.",
    ],
    storm: [
      "The sky is being dramatic. I am under my leaf. We are not the same.",
      "Everyone under the leaf. It's a one-leaf household.",
      "Thunder is just the sky doing a big yawn. Still rude though.",
    ],
  };
  function caption(code, isDay) {
    const arr = CAPTIONS[groupFor(Number(code), Number(isDay))];
    return arr[Math.floor(Math.random() * arr.length)];
  }

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

  // Small standalone render (kept for compatibility / future tiles).
  function render(code, isDay = 1) {
    const g = groupFor(Number(code), Number(isDay));
    const gid = `crFur${++uid}`;
    return `<svg viewBox="0 0 260 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Capybara: ${g}">
      ${furDefs(gid)}${capySide({ eye: g === "clear-night" ? "closed" : "open" }, gid)}
    </svg>`;
  }

  // ---------- Texts ----------
  const WISDOM = [
    "There is no bad weather, only naps you haven't taken yet.",
    "Rain is just the sky refilling the hot tub.",
    "A 30% chance of rain is a 100% chance the capybara doesn't care.",
    "Wind is how the sky practices swimming.",
    "Humidity is just pre-soak.",
    "The capybara has reviewed all three models. The capybara prefers the pond.",
    "Dress for the weather. The capybara will not.",
    "UV index high. Apply mud.",
    "Snow is cold water doing its best.",
    "Today's forecast: sitting, with a chance of extended sitting.",
    "Every forecast is 100% accurate about something.",
    "Cold front approaching. The capybara has authorized additional friends for warmth.",
    "Fog is a cloud that came down to say hi. Be polite.",
    "The barometric pressure is falling. The capybara was already lying down.",
    "Check the radar all you want; the pond already knows.",
  ];
  const wisdom = () => WISDOM[Math.floor(Math.random() * WISDOM.length)];

  const LOADING_LINES = [
    "Waking the capybara…",
    "Consulting the capybara council…",
    "Checking the pond temperature…",
    "Bribing the forecast models with oranges…",
    "Asking nearby capybaras how it feels outside…",
    "The capybara is squinting at the sky…",
    "Blending three weather models and one very calm rodent…",
    "Herding cumulus…",
  ];
  const loadingLine = () => LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)];

  const loadingHTML = () => `
    <div class="capy-loading">
      <svg viewBox="0 0 190 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        ${furDefs("clFur")}
        <g transform="translate(28 -4) scale(0.82)">${soakHead({ eye: "closed", yuzu: true }, "clFur")}</g>
        <path d="M6 82 q45 -12 90 0 q45 12 88 0 l0 28 l-178 0 z" fill="#7ec8e3" opacity="0.85"/>
        <path d="M6 82 q45 -12 90 0 q45 12 88 0" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.8"/>
        <path class="capy-steam" d="M30 74 q5 -8 0 -15" stroke="#9aa5b1" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6"/>
        <path class="capy-steam" style="animation-delay:0.8s" d="M160 74 q5 -8 0 -15" stroke="#9aa5b1" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6"/>
      </svg>
      <div>${loadingLine()}</div>
    </div>`;

  // ---------- Capybara Comfort Index™ ----------
  function comfort({ tempF, code, windMph, isDay }) {
    let score = 10;
    const notes = [];
    if (tempF < 65) { score -= Math.min(6, (65 - tempF) / 5); notes.push("colder than the pond"); }
    if (tempF > 85) { score -= Math.min(4, (tempF - 85) / 5); notes.push("warmer than the mud"); }
    if (windMph > 12) { score -= Math.min(2, (windMph - 12) / 8); notes.push("wind: rude"); }
    const g = groupFor(Number(code), Number(isDay));
    if (g === "storm") { score -= 4; notes.push("thunder (unacceptable)"); }
    else if (g === "snow") { score -= 2; notes.push("water is being weird"); }
    else if (g === "rain") { score += 1; notes.push("free shower"); }
    else if (g === "fog") { notes.push("mysterious, approved"); }
    score = Math.max(0, Math.min(10, Math.round(score)));
    const verdict =
      score >= 10 ? "Peak capybara. Cancel your plans; commence lounging." :
      score >= 8 ? "Extremely soakable." :
      score >= 6 ? "Acceptable. The capybara will allow it." :
      score >= 4 ? "Suboptimal. The capybara remains unbothered, but it has been noted." :
      score >= 2 ? "The capybara is filing a complaint with the atmosphere." :
      "Indoor capybara hours.";
    return { score, verdict, note: notes[0] || "no notes. flawless." };
  }

  // ---------- Peeker (front view, gripping the card edge) ----------
  function peekerSVG() {
    return `<svg viewBox="0 0 80 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke-linejoin="round" stroke-linecap="round">
        <path d="M8 52 C6 20 22 6 40 6 C58 6 74 20 72 52 Z" fill="${F.body}" stroke="${F.ln}" stroke-width="3.5"/>
        <path d="M12 30 C14 14 26 7 40 7 C54 7 66 14 68 30 C58 20 50 17 40 17 C30 17 22 20 12 30 Z" fill="${F.patch}"/>
        <path d="M14 14 q-2 -10 8 -10 q9 0 7 9 q-2 7 -8 7 q-6 -1 -7 -6 z" fill="${F.body}" stroke="${F.ln}" stroke-width="3"/>
        <path d="M17 13 q-1 -6 5 -6 q5 0 4 6 q-1 4 -4 4 q-4 0 -5 -4 z" fill="${F.ear}"/>
        <path d="M58 13 q-2 -9 7 -9 q9 0 8 9 q-1 7 -7 7 q-6 -1 -8 -7 z" fill="${F.body}" stroke="${F.ln}" stroke-width="3"/>
        <path d="M61 12 q-1 -5 4 -5 q5 0 4 5 q0 4 -4 4 q-3 0 -4 -4 z" fill="${F.ear}"/>
        <path d="M22 27 q4 -6 9 -1 M49 26 q4 -5 9 1" stroke="${F.eye}" stroke-width="2.6" fill="none"/>
        <path d="M28 32 Q28 27 40 27 Q52 27 52 32 L52 43 Q52 50 40 50 Q28 50 28 43 Z" fill="${F.patch}"/>
        <ellipse cx="35.5" cy="36" rx="1.8" ry="2.7" fill="${F.nose}"/>
        <ellipse cx="44.5" cy="36" rx="1.8" ry="2.7" fill="${F.nose}"/>
        <path d="M35 43 q2.5 3 5 0 q2.5 3 5 0" stroke="${F.nose}" stroke-width="2.2" fill="none"/>
        <g fill="${F.ln}" opacity="0.6">
          <circle cx="31" cy="40" r="0.9"/><circle cx="30" cy="43.5" r="0.9"/><circle cx="49" cy="40" r="0.9"/><circle cx="50" cy="43.5" r="0.9"/>
        </g>
        <ellipse cx="16.5" cy="36" rx="5" ry="3.4" fill="${F.blush}" opacity="0.85"/>
        <ellipse cx="63.5" cy="36" rx="5" ry="3.4" fill="${F.blush}" opacity="0.85"/>
        <rect x="9" y="45" width="14" height="8" rx="4" fill="${F.body}" stroke="${F.ln}" stroke-width="2.6"/>
        <rect x="57" y="45" width="14" height="8" rx="4" fill="${F.body}" stroke="${F.ln}" stroke-width="2.6"/>
        <path d="M14 46 l0 5 M18 46 l0 5 M62 46 l0 5 M66 46 l0 5" stroke="${F.ln}" stroke-width="1.4" opacity="0.7"/>
      </g>
    </svg>`;
  }

  // ---------- Walker (footer commuters) ----------
  function walkerSVG() {
    return `<svg viewBox="0 0 106 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke-linejoin="round" stroke-linecap="round">
        <rect class="capy-leg-a" x="20" y="42" width="8" height="18" rx="4" fill="${F.deep}" stroke="${F.ln}" stroke-width="2"/>
        <rect class="capy-leg-b" x="62" y="42" width="8" height="18" rx="4" fill="${F.deep}" stroke="${F.ln}" stroke-width="2"/>
        <path d="M84 44 C90 30 84 14 64 9 C44 4 18 9 10 24 C4 36 8 48 22 52 C42 58 72 56 84 44 Z" fill="${F.body}" stroke="${F.ln}" stroke-width="3.2"/>
        <rect class="capy-leg-b" x="30" y="44" width="9" height="17" rx="4.5" fill="${F.body}" stroke="${F.ln}" stroke-width="2.6"/>
        <rect class="capy-leg-a" x="70" y="44" width="9" height="17" rx="4.5" fill="${F.body}" stroke="${F.ln}" stroke-width="2.6"/>
        <path d="M56 26 C55 12 68 4 84 7 C96 9 102 18 101 29 C100 37 96 43 88 46 C78 50 64 49 58 42 C54 36 55 30 56 26 Z" fill="${F.body}" stroke="${F.ln}" stroke-width="3.2"/>
        <path d="M58 22 C64 10 78 4 90 9 C97 12 101 18 101 26 C93 18 82 14 72 16 C66 17 61 19 58 22 Z" fill="${F.patch}"/>
        <path d="M66 10 q-2 -8 6 -8 q6 0 5 7 q-1 5 -5 6 q-4 0 -6 -5 z" fill="${F.body}" stroke="${F.ln}" stroke-width="2.4"/>
        <path d="M68 9 q-1 -4 3 -4 q4 0 3 4 q0 3 -3 3 q-3 0 -3 -3 z" fill="${F.ear}"/>
        <ellipse cx="92" cy="30" rx="11" ry="12" fill="${F.patch}"/>
        <circle cx="80" cy="24" r="3" fill="${F.eye}"/><circle cx="81" cy="23" r="1" fill="#fff"/>
        <ellipse cx="98.5" cy="24" rx="2" ry="2.6" fill="${F.nose}" transform="rotate(-12 98.5 24)"/>
        <path d="M100 32 q-4 5 -10 4" stroke="${F.nose}" stroke-width="2" fill="none"/>
        <ellipse cx="74" cy="34" rx="4.5" ry="3.2" fill="${F.blush}" opacity="0.8"/>
      </g>
    </svg>`;
  }

  // ---------- Tap the sky, summon a capybara ----------
  let actx = null;
  function squeak() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t = actx.currentTime;
      for (const [dt, f0, f1] of [[0, 950, 1500], [0.12, 1150, 1650]]) {
        const o = actx.createOscillator(), gn = actx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(f0, t + dt);
        o.frequency.exponentialRampToValueAtTime(f1, t + dt + 0.07);
        gn.gain.setValueAtTime(0.0001, t + dt);
        gn.gain.exponentialRampToValueAtTime(0.1, t + dt + 0.015);
        gn.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.11);
        o.connect(gn); gn.connect(actx.destination);
        o.start(t + dt); o.stop(t + dt + 0.13);
      }
    } catch (e) { /* audio is a bonus, never an error */ }
  }

  const EEPS = ["eep!", "squeak!", "mlem", "eep eep!", "*blinks slowly*"];
  function sceneTap(wrap, x, y) {
    squeak();
    const eep = document.createElement("div");
    eep.className = "capy-eep";
    eep.textContent = EEPS[Math.floor(Math.random() * EEPS.length)];
    eep.style.left = `${x}px`;
    eep.style.top = `${y}px`;
    wrap.appendChild(eep);
    setTimeout(() => eep.remove(), 1300);

    const walkers = wrap.querySelectorAll(".capy-wander");
    if (walkers.length >= 8) walkers[0].remove();
    const w = document.createElement("div");
    w.className = "capy-wander";
    const size = Math.round(46 + Math.random() * 42);
    const rtl = Math.random() < 0.5;
    const dur = (9 + Math.random() * 7).toFixed(1);
    const dist = Math.round(wrap.offsetWidth + size + 220);
    w.style.cssText =
      `width:${size}px;bottom:${Math.round(4 + Math.random() * 46)}px;--wx:${dist}px;animation-duration:${dur}s;` +
      (rtl ? `right:${-size - 30}px;animation-name:capy-wander-l;` : `left:${-size - 30}px;animation-name:capy-wander-r;`);
    w.innerHTML = walkerSVG();
    if (rtl) w.querySelector("svg").style.transform = "scaleX(-1)";
    w.addEventListener("animationend", () => w.remove());
    wrap.appendChild(w);
  }

  // ---------- Decorations ----------
  const STAFF = [
    "Humberto — Chief Forecast Officer",
    "Doppler — Radar Dept.",
    "Puddles — Hydrology (currently in the hydrology)",
    "Cumulus — Senior Cloud Watcher",
    "Beans — Intern (bird liaison)",
    "Nimbus — Precipitation Tasting",
    "Gustav — Wind Compliance",
    "Mochi — Snack Forecasting",
  ];

  const PEEK_SPOTS = [
    ["tab-hourly", "Hourly quality control."],
    ["tab-tenday", "Supervising all ten days personally."],
    ["tab-monthly", "Has a calendar. Uses it as a mat."],
    ["tab-allergies", "Sniffing the pollen so you don't have to."],
    ["tab-airquality", "Certified air taster."],
    ["tab-map", "Not a weather balloon."],
    ["tab-activities", "Your accountability capybara."],
    ["tab-blend", "Peer reviewer #3."],
  ];

  function decorate() {
    for (const [id, joke] of PEEK_SPOTS) {
      const card = document.querySelector(`#${id} .card`);
      if (!card || card.querySelector(".capy-peek")) continue;
      const el = document.createElement("div");
      el.className = "capy-peek";
      el.title = joke;
      el.innerHTML = peekerSVG();
      card.appendChild(el);
    }

    const footer = document.querySelector(".site-footer");
    if (footer && !document.querySelector(".capy-herd")) {
      const herd = document.createElement("div");
      herd.className = "capy-herd";
      herd.innerHTML =
        `<div class="capy-herd-track" aria-hidden="true">` +
        STAFF.map((name, i) =>
          `<span class="capy-walker" style="animation-delay:${i * -4.4}s" title="${name}">${walkerSVG()}</span>`
        ).join("") +
        `</div><p class="capy-herd-caption">The Capybara Weather team, heading to the pond. They are always heading to the pond.</p>`;
      footer.prepend(herd);
    }

    if (!document.querySelector(".capy-corner")) {
      const corner = document.createElement("button");
      corner.className = "capy-corner";
      corner.type = "button";
      corner.title = "The capybara is watching the weather so you don't have to.";
      corner.setAttribute("aria-label", "Capybara wisdom");
      corner.innerHTML = `<span class="capy-bubble hidden"></span>${peekerSVG()}`;
      corner.addEventListener("click", () => {
        const bubble = corner.querySelector(".capy-bubble");
        bubble.textContent = wisdom();
        bubble.classList.remove("hidden");
        clearTimeout(corner._t);
        corner._t = setTimeout(() => bubble.classList.add("hidden"), 6000);
      });
      document.body.appendChild(corner);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", decorate);
  } else {
    decorate();
  }

  window.CapyMascot = { render, groupFor, wisdom, loadingHTML, comfort, decorate, scene, caption, sceneTap };
})();
