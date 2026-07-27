/* Capybara Weather service worker: offline shell + last-known data. */

const STATIC_CACHE = "capy-static-v3";
const DATA_CACHE = "capy-data-v3";

const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "js/api.js",
  "js/mascot.js",
  "js/blend.js",
  "js/stations.js",
  "js/alerts.js",
  "js/activities.js",
  "js/map.js",
  "js/widgets.js",
  "js/app.js",
  "vendor/leaflet/leaflet.css",
  "vendor/leaflet/leaflet.js",
  "icons/icon.svg",
  "icons/icon-maskable.svg",
  "icons/icon-180.png",
  "icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  // Cache each asset individually — one miss must not abort the whole install.
  e.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== STATIC_CACHE && k !== DATA_CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Data hosts get network-first with cache fallback so the app shows the last
// forecast offline. Map tiles are left uncached (too many, too big).
const DATA_HOSTS = [
  "api.open-meteo.com",
  "air-quality-api.open-meteo.com",
  "geocoding-api.open-meteo.com",
  "api.weather.gov",
  "api.synopticdata.com",
];

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;

  if (DATA_HOSTS.includes(url.hostname)) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(DATA_CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(e.request, copy));
            return res;
          })
      )
    );
  }
});
