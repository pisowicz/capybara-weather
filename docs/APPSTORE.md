# Taking Capybara Weather to the App Store

The web app is complete and installable as a PWA, but an App Store listing
unlocks the three things a PWA can't do well on iOS: home-screen widgets,
a reliable daily notification, and paid distribution. This is the path.

## 1. Before charging money (required)

- **Open-Meteo commercial plan** (~€29/mo, https://open-meteo.com/en/pricing):
  the free API is non-commercial only. The switch is an API-key swap —
  add `&apikey=...` and change hosts to `customer-api.open-meteo.com` in
  `js/api.js` and `js/blend.js`.
- Photo licenses are already compliant (credits link to each Commons file).
  Keep the credit line visible in any paid build.
- Search the App Store + USPTO TESS for "Capybara Weather" conflicts
  before buying the developer membership ($99/yr).

## 2. Wrap with Capacitor (a Mac with Xcode required)

```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init "Capybara Weather" com.pisowicz.capybaraweather --web-dir .
npx cap add ios
npx cap open ios        # opens Xcode; set signing team, build, run
```

The whole static site is the web-dir — no build step. The service worker
keeps working inside the wrapper.

## 3. Native upgrades, in order of payoff

1. **Daily notification in the capybara's voice** — `@capacitor/local-notifications`,
   schedule at the user's chosen hour; compose the line from the day's
   forecast + a `CapyPhotos` motto. No server needed.
2. **Home-screen widget** — a WidgetKit extension (SwiftUI) showing
   today's capybara photo + temperature. Fetch Open-Meteo directly in the
   widget timeline provider; reuse the Wikimedia thumb URLs from
   `js/photos.js`.
3. **iMessage sticker pack** — see `../stickers/README.md`; ship it as a
   separate free app that advertises the main one.

## 4. Pricing that fits the audience

- App: **$1.99 one-time** (capybara joy is an impulse buy; subscriptions
  invite churn and resentment at this scale).
- IAP: cosmetic accessory packs for the hand-drawn herd ($0.99–1.99):
  the code path is `capySide(opts)` accessories — santa hat, flower crown,
  tiny umbrella are each ~20 lines of SVG.
- Keep the web version free as the funnel.
