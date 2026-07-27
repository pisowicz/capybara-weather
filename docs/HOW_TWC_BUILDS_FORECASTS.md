# How The Weather Channel Builds Its Forecasts

Research notes compiled July 2026. This document explains the forecasting pipeline behind
weather.com / The Weather Channel app, and maps each stage to what this repo's **WeatherClone**
app replicates at miniature scale.

**Corporate context.** The Weather Company (TWC) — parent of weather.com, The Weather Channel
app, Weather Underground, and Storm Radar — was owned by IBM from 2016 until Francisco Partners
completed its acquisition on Feb 1, 2024 ([Francisco Partners](https://www.franciscopartners.com/media/francisco-partners-completes-acquisition-of-the-weather-company),
[IBM Newsroom](https://newsroom.ibm.com/2023-08-22-Francisco-Partners-to-Acquire-The-Weather-Company-Assets-from-IBM)).
The cable TV network is separately owned by Allen Media Group; the app, website, and forecasting
engine belong to TWC.

## 1. Data ingestion

TWC ingests one of the largest collections of weather data in the world:

- Surface observations from government feeds (NWS/NOAA and international met agencies)
- Satellites, radar mosaics, aircraft reports, and lightning detection
- A global network of **~250,000+ Weather Underground personal weather stations**, reporting as
  often as every 2.5 seconds and passing quality-control checks
  ([Weather Underground PWS overview](https://www.wunderground.com/pws/overview))
- Crowdsourced smartphone barometric-pressure readings (with user consent)

Sources: [TWC "proven accuracy"](https://www.weathercompany.com/proven-accuracy/),
[TWC blog: storms to solutions](https://www.weathercompany.com/blog/storms-to-solutions-with-weather-data/).
(TWC marketing cites eye-watering daily data volumes; the units vary between publications, so
treat exact figures skeptically.)

## 2. Numerical weather prediction: 100+ models, including IBM GRAF

The observations feed **more than 100 forecast models**: government NWP models (NOAA GFS, ECMWF
IFS, UK Met Office, Canadian GEM, DWD ICON, …), statistical and ML models, and TWC's own
**GRAF** — the Global High-Resolution Atmospheric Forecasting System, launched November 2019 as
the first operational global model running on GPU-accelerated HPC:

- **Model core:** MPAS (Model for Prediction Across Scales), developed by NCAR with Los Alamos
  National Laboratory, on a variable-resolution unstructured Voronoi mesh
- **Resolution:** ~3 km over ~30% of the globe (most land areas), relaxing to ~15 km elsewhere —
  convective-permitting, i.e. it can explicitly represent individual thunderstorms, versus
  12–13 km GFS and ~9 km ECMWF at launch
- **Cadence:** hourly-updating runs to ~15 hours plus 6-hourly runs to ~3 days, versus 6–12-hour
  cycles for conventional global models
- **Hardware:** IBM Power9 + NVIDIA V100 GPU supercomputer ("Dyeus"); MPAS dynamics ported to
  GPUs via OpenACC. In March 2024 TWC expanded its NVIDIA collaboration (Earth-2) toward
  AI-based high-resolution modeling.

Sources: [HPCwire](https://www.hpcwire.com/2019/01/09/ibm-global-weather-forecasting-system-gpus/),
[NVIDIA developer blog](https://developer.nvidia.com/blog/new-gpu-accelerated-weather-forecasting-system-dramatically-improves-accuracy),
[launch release](https://www.prnewswire.com/news-releases/ibm-makes-higher-quality-weather-forecasts-available-worldwide-300958046.html),
[TWC × NVIDIA 2024](https://www.weathercompany.com/news/the-weather-company-expands-collaboration-with-nvidia-to-advance-ai-based-weather-forecasting-and-visualization-capabilities/).

## 3. Blending and bias correction: DICast ("Forecast Builder")

The heart of the system is **DICast** (Dynamic Integrated foreCast system), developed at NCAR's
Research Applications Laboratory and extended by TWC (architect: Peter Neilley, TWC's SVP of
weather forecasting sciences). It turns 100+ raw model outputs into one consensus forecast:

1. **Dynamic MOS bias correction** — every input model is statistically corrected against its
   own recent forecast-vs-observation history (needs only ~90 days of training data, vs a year+
   for classic Model Output Statistics).
2. **Optimal weighting** — a confidence-weighted sum of the corrected models, with weights
   learned per variable, per location, and per lead time, updated continuously (daily
   gradient-descent-style updates against fresh verification).
3. **Machine learning on top** — e.g. gradient-boosted regression trees improved TWC's
   precipitation-probability Brier scores 10–20% over DICast alone
   ([IEEE: Machine Learning for Applied Weather Prediction](https://ieeexplore.ieee.org/document/8588666/)).
4. **Humans over the loop** — 100+ staff meteorologists supervise the automated pipeline and
   intervene in high-impact events (hurricanes, winter storms); their edits feed back in.

Sources: [NCAR RAL DICast](https://ral.ucar.edu/solutions/products/dynamic-integrated-forecast-dicast-system),
[NCAR annual report](https://nar.ucar.edu/2017/ral/weather-prediction-machine-learning-optimization),
[Neilley congressional testimony, Nov 2019 (PDF)](https://republicans-science.house.gov/_cache/files/6/c/6c89628c-e29d-4cc4-b5e0-f2cb14385371/A0646E4AD3011905FA087A41E6459AF1.2019-11-20-testimony-neilley.pdf),
[COMET/MetEd on bias correction](https://www.meted.ucar.edu/nwp/bias_correction/print.htm).

## 4. Localization: Forecasts on Demand & Currents on Demand

- **Forecasts on Demand (FoD):** interpolates the blended DICast output to any point at request
  time — ~25 billion forecasts/day for **2.2 billion locations**
  ([TWC news](https://www.weathercompany.com/news/twco-widens-lead-as-worlds-most-accurate-forecaster/)).
- **Update cadence:** 15-minute refreshes for the first ~6 hours; hourly for days 1–15; gridded
  products at ~4 km resolution globally ([TWC Weather Data APIs](https://www.weathercompany.com/weather-data-apis/)).
- **Currents on Demand (CoD):** synthesizes "current conditions" for any point — blending
  nearby surface observations (including personal weather stations), radar, satellite, lightning
  and short-term model output — instead of just reporting the nearest airport station
  ([IBM CoD docs](https://www.ibm.com/docs/en/environmental-intel-suite?topic=apis-currents-demand)).
- **Verification:** independent ForecastWatch studies rank TWC the most accurate provider
  overall every year 2017–2024
  ([ForecastWatch 2021–2024 report PDF](https://forecastwatch.com/wp-content/uploads/ForecastWatch_Global_and_Regional_Weather_Forecast_Accuracy_Overview_2021-2024.pdf)).

## 5. What the consumer app shows

Current conditions ("feels like", humidity, UV, visibility, pressure), hourly forecasts, a
10-day (now up to 15-day) outlook, live and future radar, government severe-weather alerts,
air quality (EPA AQI scale), and pollen/health indices. Notably, the **precipitation
probability** shown is the chance that measurable precipitation (≥ 0.01 in) falls at that
specific point in the period — not areal coverage or duration
([NWS explainer](https://www.weather.gov/lmk/pops)).

## How WeatherClone replicates each stage

| TWC pipeline stage | WeatherClone equivalent |
| --- | --- |
| 100+ NWP models (GFS, ECMWF, GRAF, …) | Fetches 3 real global models — ECMWF IFS 0.25°, NOAA GFS, DWD ICON — via [Open-Meteo](https://open-meteo.com/) |
| DICast bias correction + optimal weighting | `js/blend.js`: skill-based weighted consensus (ECMWF 0.45 / GFS 0.30 / ICON 0.25) with graceful handling of missing model cycles |
| Ensemble spread → forecast confidence | Model disagreement (max − min across models) rendered as a spread column and a plain-language confidence statement |
| Forecasts on Demand point localization | Open-Meteo's grid interpolation to the searched lat/lon; geocoding search + browser geolocation |
| Currents on Demand | Open-Meteo `current` block (model-analysis based) plus Open-Meteo air-quality API |
| Radar | RainViewer public radar tiles on a Leaflet map, with a past→nowcast animation loop |
| Severe alerts | A banner derived from severe WMO weather codes in the next 24 h (real TWC pushes government warnings) |

What it deliberately does **not** replicate: running an actual NWP model, dynamic per-location
weight training against observations, and human forecaster overrides — those need
supercomputers, observation archives, and meteorologists.
