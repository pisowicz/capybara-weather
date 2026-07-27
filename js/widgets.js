/**
 * widgets.js — SVG gauge renderers for the "Current Conditions" tile grid.
 * Each helper returns an SVG string sized for a tile body. Pure presentation;
 * no data fetching. All drawing is original.
 */

const Widgets = (() => {
  const TAU = Math.PI * 2;

  function polar(cx, cy, r, angleDeg) {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  /** Arc path from startAngle to endAngle (degrees, clockwise, 0 = 12 o'clock). */
  function arcPath(cx, cy, r, startDeg, endDeg) {
    const s = polar(cx, cy, r, startDeg);
    const e = polar(cx, cy, r, endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  }

  /**
   * 270° arc gauge (like weather.com's humidity / pressure / AQI dials).
   * frac: 0..1 fill, color: stroke for the filled part,
   * value/sub: center labels.
   */
  function arcGauge({ frac, color, value, sub = "", size = 110 }) {
    const c = size / 2;
    const r = c - 9;
    const start = -135, end = 135;
    const f = Math.max(0, Math.min(1, frac));
    const fillEnd = start + (end - start) * f;
    let svg = `<svg width="${size}" height="${size * 0.88}" viewBox="0 0 ${size} ${size * 0.94}">`;
    svg += `<path d="${arcPath(c, c, r, start, end)}" fill="none" stroke="var(--inner)" stroke-width="9" stroke-linecap="round"/>`;
    if (f > 0.01) {
      svg += `<path d="${arcPath(c, c, r, start, fillEnd)}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"/>`;
    }
    svg += `<text x="${c}" y="${c + 2}" text-anchor="middle" class="gauge-center-val">${value}</text>`;
    if (sub) svg += `<text x="${c}" y="${c + 20}" text-anchor="middle" class="gauge-center-sub">${sub}</text>`;
    svg += `</svg>`;
    return svg;
  }

  /** Tick-style dial for UV index (11 ticks, filled up to the value). */
  function tickDial({ ticks = 11, filled, color, value, sub = "", size = 110 }) {
    const c = size / 2;
    const rOut = c - 6, rIn = c - 18;
    const start = -135, end = 135;
    let svg = `<svg width="${size}" height="${size * 0.88}" viewBox="0 0 ${size} ${size * 0.94}">`;
    for (let i = 0; i < ticks; i++) {
      const a = start + ((end - start) * i) / (ticks - 1);
      const p1 = polar(c, c, rIn, a);
      const p2 = polar(c, c, rOut, a);
      const on = i < filled;
      svg += `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="${on ? color : "var(--inner)"}" stroke-width="5" stroke-linecap="round"/>`;
    }
    svg += `<text x="${c}" y="${c + 2}" text-anchor="middle" class="gauge-center-val">${value}</text>`;
    if (sub) svg += `<text x="${c}" y="${c + 20}" text-anchor="middle" class="gauge-center-sub">${sub}</text>`;
    svg += `</svg>`;
    return svg;
  }

  /** Wind compass: ring with cardinal letters and an arrow pointing where the wind blows toward. */
  function compass({ dirDeg, size = 110 }) {
    const c = size / 2;
    const r = c - 10;
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    svg += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="var(--inner)" stroke-width="2" stroke-dasharray="2 4"/>`;
    for (const [label, ang] of [["N", 0], ["E", 90], ["S", 180], ["W", 270]]) {
      const p = polar(c, c, r - 9, ang);
      svg += `<text x="${p.x.toFixed(1)}" y="${(p.y + 3.5).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="var(--muted)">${label}</text>`;
    }
    // Arrow points downwind (direction the air moves toward).
    const to = (dirDeg + 180) % 360;
    const tail = polar(c, c, r - 24, (to + 180) % 360);
    const head = polar(c, c, r - 2, to);
    svg += `<line x1="${tail.x.toFixed(1)}" y1="${tail.y.toFixed(1)}" x2="${head.x.toFixed(1)}" y2="${head.y.toFixed(1)}" stroke="var(--text)" stroke-width="2.5" stroke-linecap="round"/>`;
    const hl = polar(head.x, head.y, 7, (to + 150) % 360);
    const hr = polar(head.x, head.y, 7, (to + 210) % 360);
    svg += `<path d="M ${hl.x.toFixed(1)} ${hl.y.toFixed(1)} L ${head.x.toFixed(1)} ${head.y.toFixed(1)} L ${hr.x.toFixed(1)} ${hr.y.toFixed(1)}" fill="none" stroke="var(--text)" stroke-width="2.5" stroke-linecap="round"/>`;
    svg += `<circle cx="${tail.x.toFixed(1)}" cy="${tail.y.toFixed(1)}" r="3.4" fill="var(--text)"/>`;
    svg += `</svg>`;
    return svg;
  }

  /** Rising bar row (weather.com's visibility widget look). frac 0..1 filled. */
  function barRow({ frac, color, bars = 10, size = 120 }) {
    const gap = 4;
    const bw = (size - gap * (bars - 1)) / bars;
    const hMin = 8, hMax = 34;
    const filled = Math.round(Math.max(0, Math.min(1, frac)) * bars);
    let svg = `<svg width="${size}" height="${hMax + 4}" viewBox="0 0 ${size} ${hMax + 4}">`;
    for (let i = 0; i < bars; i++) {
      const h = hMin + ((hMax - hMin) * i) / (bars - 1);
      const x = i * (bw + gap);
      const y = hMax + 2 - h;
      svg += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${(bw / 2).toFixed(1)}" fill="${i < filled ? color : "var(--inner)"}"/>`;
    }
    svg += `</svg>`;
    return svg;
  }

  /** Horizontal gradient range bar with a value marker (dew point style). */
  function rangeBar({ frac, size = 150 }) {
    const h = 12;
    const f = Math.max(0.02, Math.min(0.98, frac));
    let svg = `<svg width="${size}" height="${h + 10}" viewBox="0 0 ${size} ${h + 10}">`;
    svg += `<defs><linearGradient id="ddg" x1="0" x2="1" y1="0" y2="0">` +
      `<stop offset="0" stop-color="#7fb26a"/><stop offset="0.55" stop-color="#f0b41c"/><stop offset="1" stop-color="#e77b23"/>` +
      `</linearGradient></defs>`;
    svg += `<rect x="0" y="4" width="${size}" height="${h}" rx="${h / 2}" fill="var(--inner)"/>`;
    svg += `<rect x="0" y="4" width="${(size * f).toFixed(1)}" height="${h}" rx="${h / 2}" fill="url(#ddg)"/>`;
    svg += `<circle cx="${(size * f).toFixed(1)}" cy="${4 + h / 2}" r="4" fill="#fff" stroke="var(--text)" stroke-width="1.5"/>`;
    svg += `</svg>`;
    return svg;
  }

  /** Sun path arc: horizon line + arc + sun dot at the day-fraction position. */
  function sunArc({ frac, size = 150 }) {
    const w = size, h = 64;
    const y0 = h - 12;
    const r = w / 2 - 10;
    const c = w / 2;
    let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;
    svg += `<path d="${arcPath(c, y0, r, -90, 90)}" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-dasharray="3 4"/>`;
    svg += `<line x1="4" y1="${y0}" x2="${w - 4}" y2="${y0}" stroke="var(--card-border)" stroke-width="1.5"/>`;
    svg += `<circle cx="${(c - r).toFixed(1)}" cy="${y0}" r="3" fill="var(--muted)"/>`;
    svg += `<circle cx="${(c + r).toFixed(1)}" cy="${y0}" r="3" fill="var(--muted)"/>`;
    if (frac != null && frac >= 0 && frac <= 1) {
      const ang = -90 + 180 * frac;
      const p = polar(c, y0, r, ang);
      svg += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="7" fill="#f0b41c" stroke="#fff" stroke-width="2"/>`;
    }
    svg += `</svg>`;
    return svg;
  }

  /**
   * Moon phase from the date: age in the 29.53-day synodic cycle measured
   * from a known new moon (2000-01-06 18:14 UTC).
   */
  function moonPhase(date = new Date()) {
    const SYNODIC = 29.530588853;
    const ref = Date.UTC(2000, 0, 6, 18, 14);
    const days = (date.getTime() - ref) / 86400000;
    const age = ((days % SYNODIC) + SYNODIC) % SYNODIC;
    const illum = Math.round(((1 - Math.cos((age / SYNODIC) * TAU)) / 2) * 100);
    const phases = [
      [1.85, "New Moon", "🌑"], [5.54, "Waxing Crescent", "🌒"],
      [9.23, "First Quarter", "🌓"], [12.92, "Waxing Gibbous", "🌔"],
      [16.61, "Full Moon", "🌕"], [20.30, "Waning Gibbous", "🌖"],
      [23.99, "Last Quarter", "🌗"], [27.68, "Waning Crescent", "🌘"],
      [Infinity, "New Moon", "🌑"],
    ];
    const [, name, emoji] = phases.find(([limit]) => age < limit);
    return { age, name, emoji, illum };
  }

  return { arcGauge, tickDial, compass, barRow, rangeBar, sunArc, moonPhase };
})();
