# WeatherClone Build-Out Plan — Personal Edition

Scope decisions (July 2026): this app is **for one user**. No community features, no station
ingestion, no accounts, no history/almanac. The centerpiece is **read-only integration of very
local weather stations** to make the forecast hyperlocal — Weather Underground's BestForecast
idea without building Weather Underground. The app stays a **zero-backend static site**
throughout this plan.

Companion research: [`HOW_TWC_BUILDS_FORECASTS.md`](HOW_TWC_BUILDS_FORECASTS.md).

## The centerpiece: nearby stations + hyperlocal correction

What Weather Underground actually does with its station network, minus the network-building:
we *read* stations that already exist and upload to public networks, then use them two ways —
show real neighborhood conditions, and bias-correct the model blend.

### Station data sources (read-only, no backend)

| Source | What it gives | Access |
| --- | --- | --- |
| **api.weather.gov** `/points → /stations → /observations/latest` | Official ASOS/AWOS stations (mostly airports) — reliable baseline, sparse | Keyless, CORS-friendly |
| **Synoptic Data open-access tier** | The density win: CWOP citizen stations + state mesonets + NWS in one API — usually several stations within a few km in populated areas | Free token (embedded is fine for personal use), CORS-friendly |
| **Your own station** (optional, if you ever buy one) | Readings from your actual backyard — the ultimate "very local" | Ambient Weather / Ecowitt cloud APIs, free key |

### How the correction works (all in the browser)

1. Fetch latest observations from stations within ~15 km; drop stale (>60 min) readings.
2. **QC pass:** discard stations that disagree with the local median by more than a threshold
   (a lightweight version of WU's neighbor-comparison check).
3. Compute the **current bias**: distance-weighted mean of (station temp − model current temp),
   same for humidity/wind where available.
4. Apply the bias to the blended forecast with a decay over the next ~12 hours (full correction
   now, fading to zero — bias is a "now" signal, not a tomorrow signal).
5. Show your work: "Adjusted +2.1° from 4 nearby stations" with a tap-through to the station
   list. The Model Blend panel gains a fourth line: *blend + local correction*. This completes
   the real TWC/DICast pipeline in miniature: models → blend → observation correction.

### UI additions

- **Nearby Stations strip** on Today: closest 3–5 stations with name, distance, temp, wind,
  age of reading — the WU "neighborhood conditions" experience.
- Station dots on the map tab (temp label per station, click for details).
- A settings field for "my station ID" to pin your own station to the top (and, if it's
  Ambient/Ecowitt, pull it directly).

---

## Phases

### Phase 1 — Ship it *(small)*
Public URL (Vercel git-import or GitHub Pages), PWA install + offline shell, geolocate on first
visit, favorite locations, dark mode. **Done when:** it's on your phone's home screen showing
your street.

### Phase 2 — Nearby stations + hyperlocal correction *(medium — the payoff)*
Everything in the centerpiece section above. Build order: NWS stations first (keyless proof of
the pipeline), then Synoptic for density, then the correction math, then the "adjusted from N
stations" transparency UI. **Done when:** the Today temperature visibly differs from raw
Open-Meteo and the app can show you exactly which stations moved it and by how much.

### Phase 3 — Real alerts + trimmed map hub *(medium)*
- Replace the heuristic banner with real **api.weather.gov alerts** for your point (banner +
  full alert text). Keep the WMO heuristic as non-US fallback.
- Map tab upgrades, personal-scale only: alert polygons, GOES satellite layer, station dots
  from Phase 2, radar timeline scrubber. No hurricane hub, no storm-report layers unless you
  find yourself wanting them.

**Done when:** a tornado watch for your county shows the actual NWS text within a minute of
issuance, over live radar.

### Phase 4 — Smart Forecasts *(small)*
WU's activity feature, client-side: define ideal conditions ("Run: 45–70°F, wind < 15 mph,
precip < 20%"), the app scores the next 48 h **using the corrected forecast from Phase 2** and
highlights the best windows on the hourly strip. A few templates + a custom builder, stored in
localStorage. **Done when:** the Today tab tells you the best hour to be outside tomorrow.

---

## Explicitly out of scope (decided, not deferred)

- Station **uploads**, accounts, dashboards, API keys — no community, no backend
- History & almanac, calendar view
- Webcams, storm report submission
- Hurricane hub (map alert layer covers personal severe-weather needs)

## Risks / notes

- **Synoptic token** rides in client code — fine for a personal free-tier token; rotate if
  abused. Keyless NWS-only mode remains as fallback.
- **Station density varies:** rural locations may see only an airport 30 km away — the
  correction weights by distance, so sparse data degrades toward "no correction," never a
  wrong one.
- **Open-Meteo limits** (~10k calls/day non-commercial) are a non-issue for one user; still
  cache last response per location for snappier loads.
