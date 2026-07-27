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
    hi: "#c9a172",   // sunlit back
    mid: "#a97c50",  // base coat
    lo: "#8a6138",   // belly / legs
    dk: "#6e4a2c",   // deep shadow
    ear: "#7a5230",  // inner ear
    line: "#4a321e", // outline accents
    nose: "#38261a",
    eye: "#2c1f12",
    blush: "#e59a7c",
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
    const eyeK = opts.shades ? "shades" : opts.eye || "open";
    const eye =
      eyeK === "closed"
        ? `<path d="M203 56 q6 6 13 1" stroke="${F.eye}" stroke-width="3" fill="none" stroke-linecap="round"/>`
        : eyeK === "happy"
        ? `<path d="M203 58 q6 -8 13 -1" stroke="${F.eye}" stroke-width="3" fill="none" stroke-linecap="round"/>`
        : eyeK === "shades"
        ? ""
        : `<ellipse cx="210" cy="56" rx="${opts.baby ? 7 : 5.5}" ry="${opts.baby ? 8 : 6.5}" fill="${F.eye}"/>
           <circle cx="212.5" cy="52.5" r="2" fill="#fff" opacity="0.9"/>
           <path d="M202 49 q8 -5 16 -1" stroke="${F.dk}" stroke-width="1.6" fill="none" opacity="0.55"/>`;
    const shades = opts.shades
      ? `<g>
          <path d="M186 46 C200 40 232 38 248 44" stroke="#23232e" stroke-width="5" stroke-linecap="round" fill="none"/>
          <rect x="196" y="44" width="34" height="21" rx="10" fill="#23232e"/>
          <rect x="236" y="43" width="12" height="17" rx="6" fill="#23232e"/>
          <circle cx="206" cy="51" r="3.4" fill="#fff" opacity="0.6"/>
          <path d="M196 50 C190 48 186 42 187 36" stroke="#23232e" stroke-width="4" stroke-linecap="round" fill="none"/>
        </g>`
      : "";
    const scarf = opts.scarf
      ? `<g>
          <path d="M158 96 C170 108 196 112 214 104 L212 120 C192 128 166 122 152 110 Z" fill="#d64545"/>
          <path d="M158 96 C170 108 196 112 214 104" stroke="#b93a3a" stroke-width="3" fill="none" opacity="0.6"/>
          <path d="M176 116 L172 146 L186 146 L188 118 Z" fill="#d64545"/>
          <path d="M173 140 l0 8 M179 141 l0 8 M185 140 l0 8" stroke="#a83232" stroke-width="3" stroke-linecap="round"/>
        </g>`
      : "";
    const yuzu = opts.yuzu
      ? `<g transform="translate(196 8)">
          <circle cx="0" cy="0" r="12" fill="#f2a53a"/>
          <circle cx="-4" cy="-4" r="3.5" fill="#ffd27f" opacity="0.85"/>
          <path d="M1 -12 q6 -7 13 -4 q-5 6 -13 4 z" fill="#5f9e4a"/>
          <circle cx="1" cy="-11" r="1.5" fill="#4a7c3f"/>
        </g>`
      : "";
    const beanie = opts.beanie
      ? `<g>
          <path d="M174 34 C178 12 224 10 234 30 C218 24 190 24 174 34 Z" fill="#4a7fb5"/>
          <rect x="172" y="28" width="64" height="10" rx="5" fill="#3a6a9c"/>
          <circle cx="204" cy="11" r="7" fill="#f0e6d2"/>
        </g>`
      : "";
    const leaf = opts.leaf
      ? `<g transform="translate(120 -52)">
          <line x1="76" y1="30" x2="66" y2="74" stroke="#4a7c3f" stroke-width="6" stroke-linecap="round"/>
          <path d="M-24 30 Q30 -22 96 -6 Q152 8 162 30 Q104 54 52 46 Q0 38 -24 30 Z" fill="#6ab04c"/>
          <path d="M-16 30 Q70 14 154 28" stroke="#4a7c3f" stroke-width="3" fill="none" opacity="0.7"/>
          <path d="M20 36 l-6 -12 M58 42 l-4 -14 M100 42 l-2 -14 M134 36 l0 -12" stroke="#4a7c3f" stroke-width="2" opacity="0.5"/>
        </g>`
      : "";
    const bird = opts.bird
      ? `<g transform="translate(196 4)">
          <ellipse cx="0" cy="0" rx="11" ry="9" fill="#f6d55c"/>
          <circle cx="7" cy="-3" r="2" fill="${F.eye}"/>
          <path d="M10 0 l8 3 l-8 3 z" fill="#e77b23"/>
          <path d="M-10 -1 q-7 -6 -3 -11 q6 2 6 8 z" fill="#e8b923"/>
          <path d="M-2 8 l0 4 M3 8 l0 4" stroke="#e77b23" stroke-width="2" stroke-linecap="round"/>
        </g>`
      : "";
    const whiskers = opts.baby
      ? ""
      : `<g stroke="${F.dk}" stroke-width="1.1" opacity="0.45" stroke-linecap="round">
          <path d="M238 74 L256 70"/><path d="M238 79 L257 78"/><path d="M236 84 L254 86"/>
        </g>
        <g fill="${F.dk}" opacity="0.6">
          <circle cx="234" cy="74" r="1"/><circle cx="236" cy="79" r="1"/><circle cx="233" cy="83" r="1"/>
        </g>`;
    const furTexture = opts.fur === false
      ? ""
      : `<g stroke="${F.hi}" stroke-width="2" stroke-linecap="round" opacity="0.5" fill="none">
          <path d="M70 40 l7 -8 M84 37 l7 -8 M98 35 l7 -8"/>
          <path d="M126 33 l6 -8 M140 33 l6 -8"/>
        </g>
        <g stroke="${F.dk}" stroke-width="2" stroke-linecap="round" opacity="0.35" fill="none">
          <path d="M52 116 l-7 7 M66 122 l-6 7 M84 127 l-5 7"/>
          <path d="M150 128 l-4 7 M136 127 l-5 7"/>
          <path d="M186 100 l7 6 M182 90 l8 5"/>
        </g>`;

    return `
      <g class="capy-body">
        <!-- ground shadow -->
        <ellipse cx="136" cy="154" rx="112" ry="10" fill="#3a2c1c" opacity="0.16"/>
        <!-- far legs -->
        <rect x="76" y="118" width="18" height="34" rx="8" fill="${F.dk}"/>
        <rect x="170" y="118" width="18" height="34" rx="8" fill="${F.dk}"/>
        <!-- body -->
        <path d="M196 118 C204 86 188 52 146 42 C104 33 54 44 38 72 C26 94 32 122 60 133 C98 148 166 145 196 118 Z" fill="url(#${gid})"/>
        <!-- near legs with toes -->
        <g fill="${F.lo}">
          <rect x="48" y="124" width="21" height="30" rx="8"/>
          <rect x="142" y="124" width="21" height="30" rx="8"/>
        </g>
        <g fill="${F.dk}">
          <circle cx="54" cy="152.5" r="2.4"/><circle cx="60" cy="153.5" r="2.4"/><circle cx="66" cy="152.5" r="2.4"/>
          <circle cx="148" cy="152.5" r="2.4"/><circle cx="154" cy="153.5" r="2.4"/><circle cx="160" cy="152.5" r="2.4"/>
        </g>
        <!-- back highlight / belly shadow -->
        <ellipse cx="112" cy="56" rx="66" ry="16" fill="#ffffff" opacity="0.14" transform="rotate(-7 112 56)"/>
        <ellipse cx="112" cy="126" rx="62" ry="13" fill="${F.dk}" opacity="0.2"/>
        <!-- far ear, head, near ear -->
        <path d="M166 32 q-3 -14 10 -14 q9 1 7 12 q-2 9 -9 9 q-6 -1 -8 -7 z" fill="${F.dk}"/>
        <path d="M152 62 C150 34 178 16 212 21 C240 25 254 42 254 64 C254 78 251 91 241 99 C228 109 202 112 184 104 C163 96 153 82 152 62 Z" fill="url(#${gid})"/>
        <path d="M222 30 C240 36 251 48 251.5 66 C251.8 78 249 89 241 96 C233 102 224 103 217 100 C224 80 224 52 216 33 Z" fill="${F.dk}" opacity="0.18"/>
        <path d="M186 28 q-4 -16 11 -17 q11 0 10 13 q-1 10 -10 11 q-8 0 -11 -7 z" fill="${F.mid}"/>
        <path d="M190 26 q-2 -9 7 -10 q7 0 6 8 q-1 6 -6 7 q-5 0 -7 -5 z" fill="${F.ear}"/>
        <!-- face -->
        ${eye}
        <ellipse cx="245" cy="57" rx="3" ry="4.4" fill="${F.nose}" transform="rotate(-14 245 57)"/>
        <path d="M251 82 C246 89 237 91 229 88" stroke="${F.nose}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M229 88 q-3 4 -8 3" stroke="${F.nose}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.8"/>
        ${whiskers}
        <ellipse cx="222" cy="76" rx="7" ry="4.5" fill="${F.blush}" opacity="${opts.baby ? 0.65 : 0.4}"/>
        ${furTexture}
        ${shades}${scarf}${yuzu}${beanie}${bird}${leaf}
      </g>`;
  }

  const baby = (opts = {}, gid) => capySide({ ...opts, baby: true, fur: false }, gid);

  // ---------- Soaking capybara (head above the waterline, 150x120) ----------
  function soakHead(opts = {}, gid = "capyFur") {
    const eye =
      opts.eye === "open"
        ? `<ellipse cx="88" cy="52" rx="5.5" ry="6.5" fill="${F.eye}"/><circle cx="90.5" cy="49" r="2" fill="#fff"/>`
        : `<path d="M81 54 q6 -8 13 -1" stroke="${F.eye}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const yuzu = opts.yuzu
      ? `<g transform="translate(74 2)">
          <circle cx="0" cy="0" r="11" fill="#f2a53a"/>
          <circle cx="-3.5" cy="-3.5" r="3" fill="#ffd27f" opacity="0.85"/>
          <path d="M1 -11 q6 -6 12 -3 q-5 5 -12 3 z" fill="#5f9e4a"/>
        </g>`
      : "";
    return `
      <g class="capy-body">
        <path d="M30 58 C28 30 56 12 90 17 C118 21 132 38 132 60 C132 74 129 87 119 95 C106 105 80 108 62 100 C41 92 31 78 30 58 Z" fill="url(#${gid})"/>
        <path d="M100 26 C118 32 129 44 129.5 62 C129.8 74 127 85 119 92 C111 98 102 99 95 96 C102 76 102 48 94 29 Z" fill="${F.dk}" opacity="0.18"/>
        <path d="M64 24 q-4 -16 11 -17 q11 0 10 13 q-1 10 -10 11 q-8 0 -11 -7 z" fill="${F.mid}"/>
        <path d="M68 22 q-2 -9 7 -10 q7 0 6 8 q-1 6 -6 7 q-5 0 -7 -5 z" fill="${F.ear}"/>
        <path d="M44 28 q-3 -14 10 -14 q9 1 7 12 q-2 9 -9 9 q-6 -1 -8 -7 z" fill="${F.dk}"/>
        ${eye}
        <ellipse cx="123" cy="53" rx="3" ry="4.4" fill="${F.nose}" transform="rotate(-14 123 53)"/>
        <path d="M129 78 C124 85 115 87 107 84" stroke="${F.nose}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <ellipse cx="100" cy="72" rx="7" ry="4.5" fill="${F.blush}" opacity="0.55"/>
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
      <path d="M-14 0 Q-16 -12 -4 -12 Q2 -12 4 -8 Q16 -10 14 -2 Q12 4 0 4 Q-10 4 -14 0 Z" fill="#f6d55c"/>
      <circle cx="-7" cy="-14" r="7" fill="#f6d55c"/>
      <circle cx="-5" cy="-15.5" r="1.4" fill="#3a281a"/>
      <path d="M-14 -14 l-7 2 l7 3 z" fill="#e77b23"/>
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
  function foreground(g, W, H) {
    const cx = W / 2;
    const wide = W > 500;
    const gy = H - 96; // ground horizon
    const hill = (fill, dx, ry) => `<ellipse cx="${cx + dx}" cy="${H + 30}" rx="${W * 0.85}" ry="${ry}" fill="${fill}"/>`;
    // A scattered background herd along the horizon line.
    const bgHerd = (tint, y0, spots) =>
      spots.map(([fx, sc, flip, graze]) =>
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
  function scene(code, isDay, wide) {
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
      ${foreground(g, W, H)}
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
    const gid = `cpFur${++uid}`;
    return `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${furDefs(gid)}
      <path d="M8 50 C6 20 22 6 40 6 C58 6 74 20 72 50 Z" fill="url(#${gid})"/>
      <path d="M14 14 q-2 -10 8 -10 q9 0 7 9 q-2 7 -8 7 q-6 -1 -7 -6 z" fill="${F.mid}"/>
      <path d="M17 13 q-1 -6 5 -6 q5 0 4 6 q-1 4 -4 4 q-4 0 -5 -4 z" fill="${F.ear}"/>
      <path d="M58 13 q-2 -9 7 -9 q9 0 8 9 q-1 7 -7 7 q-6 -1 -8 -7 z" fill="${F.mid}"/>
      <path d="M61 12 q-1 -5 4 -5 q5 0 4 5 q0 4 -4 4 q-3 0 -4 -4 z" fill="${F.ear}"/>
      <path d="M36 6 l2 -5 l2 4 l2 -4 l2 5 z" fill="${F.mid}"/>
      <g>
        <ellipse cx="26" cy="27" rx="3.6" ry="4.2" fill="${F.eye}"/><circle cx="27.4" cy="25.4" r="1.2" fill="#fff"/>
        <ellipse cx="54" cy="27" rx="3.6" ry="4.2" fill="${F.eye}"/><circle cx="55.4" cy="25.4" r="1.2" fill="#fff"/>
        <path d="M21 22 q5 -3 9 -1 M50 21 q5 -2 9 1" stroke="${F.dk}" stroke-width="1.3" fill="none" opacity="0.5"/>
      </g>
      <path d="M28 32 Q28 27 40 27 Q52 27 52 32 L52 42 Q52 48 40 48 Q28 48 28 42 Z" fill="${F.lo}"/>
      <ellipse cx="35.5" cy="36" rx="1.7" ry="2.6" fill="${F.nose}"/>
      <ellipse cx="44.5" cy="36" rx="1.7" ry="2.6" fill="${F.nose}"/>
      <path d="M35 44 q5 4 10 0" stroke="${F.nose}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <g fill="${F.dk}" opacity="0.55">
        <circle cx="31" cy="40" r="0.8"/><circle cx="30" cy="43" r="0.8"/><circle cx="49" cy="40" r="0.8"/><circle cx="50" cy="43" r="0.8"/>
      </g>
      <ellipse cx="17" cy="35" rx="4.5" ry="3" fill="${F.blush}" opacity="0.55"/>
      <ellipse cx="63" cy="35" rx="4.5" ry="3" fill="${F.blush}" opacity="0.55"/>
      <g fill="${F.mid}">
        <rect x="10" y="44" width="13" height="7" rx="3.5"/>
        <rect x="57" y="44" width="13" height="7" rx="3.5"/>
      </g>
      <g stroke="${F.dk}" stroke-width="1.2" opacity="0.6">
        <path d="M14 45 l0 5 M18 45 l0 5 M61 45 l0 5 M65 45 l0 5"/>
      </g>
    </svg>`;
  }

  // ---------- Walker (footer commuters) ----------
  function walkerSVG() {
    const gid = `cwFur${++uid}`;
    return `<svg viewBox="0 0 104 62" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${furDefs(gid)}
      <rect class="capy-leg-a" x="20" y="42" width="8" height="18" rx="4" fill="${F.dk}"/>
      <rect class="capy-leg-b" x="62" y="42" width="8" height="18" rx="4" fill="${F.dk}"/>
      <path d="M84 44 C90 30 84 14 64 9 C44 4 18 9 10 24 C4 36 8 48 22 52 C42 58 72 56 84 44 Z" fill="url(#${gid})"/>
      <rect class="capy-leg-b" x="30" y="44" width="9" height="17" rx="4.5" fill="${F.lo}"/>
      <rect class="capy-leg-a" x="70" y="44" width="9" height="17" rx="4.5" fill="${F.lo}"/>
      <g fill="${F.dk}">
        <circle cx="33" cy="60" r="1.3"/><circle cx="36.5" cy="60.5" r="1.3"/>
        <circle cx="73" cy="60" r="1.3"/><circle cx="76.5" cy="60.5" r="1.3"/>
      </g>
      <path d="M64 26 C63 12 76 4 92 7 C104 9 110 18 109 29 C108 37 104 43 96 46 C86 50 72 49 66 42 C62 36 63 30 64 26 Z" fill="url(#${gid})" transform="translate(-8 0)"/>
      <path d="M74 10 q-2 -8 6 -8 q6 0 5 7 q-1 5 -5 6 q-4 0 -6 -5 z" fill="${F.mid}"/>
      <path d="M76 9 q-1 -4 3 -4 q4 0 3 4 q0 3 -3 3 q-3 0 -3 -3 z" fill="${F.ear}"/>
      <circle cx="86" cy="24" r="2.8" fill="${F.eye}"/><circle cx="87" cy="23" r="0.9" fill="#fff"/>
      <ellipse cx="98.5" cy="26" rx="1.7" ry="2.4" fill="${F.nose}" transform="rotate(-12 98.5 26)"/>
      <path d="M100 36 q-5 4 -10 2" stroke="${F.nose}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M30 16 l4 -4 M42 13 l4 -4 M54 12 l4 -4" stroke="${F.hi}" stroke-width="1.6" stroke-linecap="round" opacity="0.6"/>
    </svg>`;
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

  window.CapyMascot = { render, groupFor, wisdom, loadingHTML, comfort, decorate, scene, caption };
})();
