# Capybara Weather — Cozy Forecasts with a Capybara Friend 🐹☀️

An ad-free weather app starring a cute capybara mascot that reacts to the weather — sunbathing
in shades on clear days, soaking in a hot spring with a yuzu orange on its head when it rains,
bundled in a scarf for snow, hiding under a leaf during thunderstorms, and snoozing under the
stars at night. Underneath the cuteness is a serious forecast engine: multi-model blending like
The Weather Channel's DICast, corrected in real time against nearby weather stations like
Weather Underground's BestForecast. Pure static site: no backend, no build step, no API keys
required.

A capybara-themed sibling of [Beezer Weather](https://github.com/pisowicz/Beezer-Weather).

> 📖 Research: [`docs/HOW_TWC_BUILDS_FORECASTS.md`](docs/HOW_TWC_BUILDS_FORECASTS.md) ·
> Plan: [`docs/PLAN.md`](docs/PLAN.md)

## Features

- **Capybara mascot** — a hand-drawn SVG capybara in the hero card with a different animated
  scene for every condition: clear day/night, partly cloudy (with a bird friend), cloudy, fog,
  rain (hot-spring soak 🍊), snow, and thunderstorms — `js/mascot.js`
- **Today** — a full-screen hand-drawn capybara scene with big thin overlay type and a
  caption in the capybara's voice (Kitty Weather energy), then Today's Outlook with sunrise/sunset markers,
  morning/afternoon/evening/overnight forecast, and a gauge-tile grid (feels-like, wind
  compass, humidity, UV dial, air quality, dew point, pressure, visibility, cloud cover,
  sun arc, moon phase), plus a Health & Activities rail — and no ads, anywhere
- **Herd controls** — a Herd Size setting (Cozy / Big / MAXIMUM CAPYBARA), and tap the
  scene to hear a squeak and summon one more capybara, who walks through the weather
- **Nearby Stations** — live observations from real weather stations around you (NWS official
  stations, plus CWOP/mesonet density via an optional free Synoptic token). Stations pass a
  neighbor-comparison quality check; outliers are grayed out.
- **Hyperlocal correction** — the app computes the distance-weighted bias between nearby
  stations and the model forecast and applies it with a 12-hour decay, showing its work:
  *"📡 Adjusted +2.6° from 3 nearby stations (1 outlier dropped)"*
- **Real alerts** — active NWS watches/warnings for your location (banner + full alert text +
  map polygons), with a WMO-code heuristic fallback outside the US
- **Hourly** — 48 hours grouped by day with metric pills; **10 Day** — expandable rows with
  temperature-range bars; **Monthly** — calendar of past days + 15-day forecast
- **Air Quality** — US AQI dial with per-pollutant breakdown (PM2.5, PM10, O₃, NO₂, SO₂, CO)
- **Allergies** — pollen breakdown where modeled (Europe), allergy-relevant conditions everywhere
- **Map** — layer hub: animated RainViewer radar with a timeline scrubber, GOES satellite
  (NASA GIBS), alert polygons, and station temperature markers
- **Activities (Smart Forecasts)** — define ideal conditions per activity (running, cycling…)
  and get the best time windows in the next 48 h, scored on the *corrected* forecast
- **Model Blend** — three real global models (ECMWF IFS, NOAA GFS, DWD ICON) charted against a
  skill-weighted consensus, plus the station-corrected line when a correction is live
- **PWA** — installable, offline shell with last-known forecast; dark mode; favorite locations;
  geolocation; °F/°C toggle

## Running it

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Any static host works (GitHub Pages, Vercel, Netlify, Cloudflare Pages) — there is no build.

**Optional setup (Settings ⚙ in the app):**
- *Synoptic token* — a free open-access token from [synopticdata.com](https://synopticdata.com/)
  adds CWOP citizen stations and mesonets for real neighborhood density (without it, station
  data comes from official NWS stations only).
- *Pin my station* — a station ID from the nearby list to always show first.

## Data sources (all free)

| Data | Source | Key |
| --- | --- | --- |
| Forecast, current, multi-model blend | [Open-Meteo](https://open-meteo.com/) | none |
| Air quality | [Open-Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api) | none |
| Geocoding | [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | none |
| Station observations | [api.weather.gov](https://www.weather.gov/documentation/services-web-api) | none |
| Dense station observations | [Synoptic Data](https://synopticdata.com/) open access | free token |
| Alerts | api.weather.gov/alerts | none |
| Radar tiles | [RainViewer](https://www.rainviewer.com/api.html) | none |
| Satellite | [NASA GIBS](https://nasa-gibs.github.io/gibs-api-docs/) GOES GeoColor | none |
| Base map | OpenStreetMap via Leaflet (vendored) | none |

## How the forecast is made

1. **Blend:** three global NWP models are fetched per location and combined with skill-based
   weights (ECMWF 0.45 / GFS 0.30 / ICON 0.25) — `js/blend.js`
2. **Verify:** model spread (max − min per hour) becomes a plain-language confidence statement
3. **Correct:** nearby station observations are quality-controlled (staleness + median-outlier
   checks), then the distance-weighted station−model bias is applied to the next 12 hours with
   linear decay — `js/stations.js`

That's the TWC pipeline — observe → model → blend → localize — at personal scale, with a
capybara on top.

## Project layout

```
index.html                     App shell: sidebar, pill nav, panels, settings modal
manifest.webmanifest, sw.js    PWA install + offline support
css/styles.css                 Warm capybara styling, light + dark themes
js/mascot.js                   The capybara: SVG mascot scenes per weather condition
js/api.js                      Open-Meteo data layer
js/blend.js                    Mini-DICast: weighted consensus + spread → confidence
js/stations.js                 Nearby stations (NWS + Synoptic), QC, bias correction
js/alerts.js                   NWS active alerts
js/activities.js               Smart Forecasts rules engine
js/map.js                      Map hub: radar, satellite, alerts, station layers
js/widgets.js                  SVG gauge renderers for the condition tiles
js/app.js                      UI controller and orchestration
vendor/leaflet/                Leaflet 1.9.4, vendored
docs/                          Research + build-out plan
icons/                         Capybara app icons (SVG + PNG)
```

Not affiliated with The Weather Channel, The Weather Company, or Weather Underground.
Built for personal, educational use. Capybaras are for everyone.
