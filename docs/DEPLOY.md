# Deployment

## Live app

**https://weatherclone-zeta.vercel.app** (Vercel, production)

Because this session couldn't push large payloads in one piece, the Vercel deployment is split
across four projects in the same account, all deployed 2026-07-18:

| Project | Serves |
| --- | --- |
| `weatherclone` | `index.html`, `manifest.webmanifest`, `sw.js`, `icons/icon-180.png` — the app entry |
| `weatherclone-js` | `js/app.min.js` (API/Blend/Stations/Alerts/Activities/MapHub modules, minified) |
| `weatherclone-boot` | `js/app2.min.js` (UI controller, minified) |
| `weatherclone-static` | `css/styles.css` (minified), `icons/icon.svg` |

The deployed `index.html` references the asset projects by their public production domains
(`weatherclone-js.vercel.app`, `weatherclone-boot.vercel.app`, `weatherclone-static.vercel.app`
— NOT the team-scoped `*-brians-projects-*` aliases, which sit behind Vercel deployment
protection and serve a login page to anonymous visitors) and Leaflet 1.9.4 from
unpkg. The service worker precaches all of it (cross-origin included) for offline use. This
differs from the repo layout (vendored Leaflet, unminified multi-file JS) purely as packaging —
behavior is identical, and the minified deploy build passed the same 21-check smoke test.

### Updating the deployment

Simplest path: in the Vercel dashboard, import `pisowicz/capybara-weather` into the `capybara-weather` project
(Project → Settings → Git). Then every push deploys the repo as-is — vendored Leaflet,
unminified files, no split projects — and the three asset projects can be deleted. The repo is
a zero-build static site, so no build settings are needed (framework: Other, output: root).

## iPhone install (PWA)

1. Open **https://weatherclone-zeta.vercel.app** in Safari
2. Allow location access when asked (or search your city)
3. Tap the Share button → **Add to Home Screen** → Add

It launches full-screen with its own icon, remembers your location/favorites/settings, and shows
the last-loaded forecast offline.

## GitHub Pages (not active)

`.github/workflows/pages.yml` deploys the repo to Pages on push, but this repo is **private**
and Pages on private repos requires a paid GitHub plan — both workflow runs failed on
enablement. If the repo is ever made public (or the account upgraded), the workflow will start
working; the site would appear at `https://pisowicz.github.io/capybara-weather/`.
