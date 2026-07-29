/*
 * capylife.js — facts, live cams, and pilgrimage sites.
 *
 * The "Capy Life" panel: a rotating capybara fact, a directory of live
 * capybara webcams (robust YouTube links that never go stale), and
 * one-tap weather for the world's famous capybara places.
 */
window.CapyLife = (function () {
  "use strict";

  const FACTS = [
    "Capybaras are the largest rodents on Earth — up to about 65 kg (143 lb) of calm.",
    "The name comes from Tupi ka'apiûara — roughly, 'the grass eater.'",
    "Their scientific name, Hydrochoerus hydrochaeris, basically means 'water pig' twice.",
    "Capybaras can hold their breath underwater for around five minutes.",
    "They sleep in water with just their noses poking out, like furry submarines.",
    "Eyes, ears, and nostrils sit on top of the head — the hippo layout, at 2% of the size.",
    "Their feet are partially webbed. Yes, they have a swim advantage. No, they won't race you.",
    "A capybara can run about 35 km/h (22 mph) when it absolutely must. It rarely must.",
    "They live in herds of 10–20, which can swell to 100 in the dry season. Introverts welcome.",
    "Capybaras purr, bark, whistle, click, and squeal — a whole podcast of tiny sounds.",
    "Their teeth never stop growing, so they chew constantly to keep them filed down.",
    "An adult eats 3–4 kg of grass a day. Consistency is a virtue.",
    "They re-eat their own droppings each morning to digest grass twice. Nature's meal prep.",
    "Birds ride capybaras to snack on insects — capybaras are public transit for the wetlands.",
    "Other animals famously lounge on them: monkeys, ducks, rabbits, even caimans nearby.",
    "Scientists have called them 'nature's ottoman.' The capybaras have not objected.",
    "They're crepuscular — most active at dawn and dusk, napping through the paperwork hours.",
    "Native to almost every country in South America, always near water.",
    "In Brazil they're capivara; in Argentina and Uruguay, carpincho.",
    "Capybaras are close cousins of guinea pigs — same family, bigger dreams.",
    "Wild lifespan is 6–10 years; pampered zoo capybaras push past 12.",
    "Pups are born fully furred with open eyes and can eat grass within a week.",
    "A mother's pups nurse from any lactating female in the herd. Communal daycare.",
    "Gestation is about 150 days, usually producing 4 pups (up to 8).",
    "Capybara hot-tubbing began in 1982 at Japan's Izu Shaboten Zoo, when keepers noticed them soaking in warm cleaning water.",
    "Japanese zoos now hold yuzu baths at the winter solstice — citrus floating in the onsen, capybaras steaming happily.",
    "Their fur dries quickly and is sparse enough that they sunburn — hence the mud spa habit.",
    "Mud isn't a mess to a capybara. It's sunscreen, air conditioning, and skincare.",
    "The scent gland on a capybara's snout is called a morrillo. It's for signing their work.",
    "Capybaras have webbed toes: four on the front feet, three on the back.",
    "In the wild, capybaras and caimans routinely share the same banks. An understanding exists.",
    "They can sleep standing up, sitting, loafing, floating, or on each other. Range.",
    "Capybara herds post sentries who bark when trouble approaches. Even chill needs security.",
    "They're strong swimmers from day one — pups paddle within hours of birth.",
    "São Paulo's Pinheiros river banks host urban capybaras who commute past joggers.",
    "A group of capybaras doesn't have a fancy collective noun, so people just say 'a chill of capybaras.' Correct.",
  ];

  const CAMS = [
    { icon: "🇯🇵", name: "Nagasaki Bio Park", note: "the world's most famous capybara exhibit — frequent live streams", url: "https://www.youtube.com/results?search_query=nagasaki+bio+park+capybara+live" },
    { icon: "🍊", name: "Capybara onsen cams", note: "hot-spring bath streams — best in winter, peak yuzu at the solstice", url: "https://www.youtube.com/results?search_query=capybara+onsen+live" },
    { icon: "🔴", name: "Live capybara cams right now", note: "everything currently streaming, filtered to live", url: "https://www.youtube.com/results?search_query=capybara+live+cam&sp=EgJAAQ%253D%253D" },
    { icon: "🏛️", name: "Izu Shaboten Zoo", note: "where the capybara bath tradition began in 1982", url: "https://www.youtube.com/results?search_query=izu+shaboten+capybara" },
  ];

  const PLACES = [
    { name: "Nagasaki, Japan", sub: "Bio Park herd", lat: 32.75, lon: 129.88 },
    { name: "Higashiizu, Japan", sub: "birthplace of the yuzu bath", lat: 34.77, lon: 139.04 },
    { name: "Pantanal, Brazil", sub: "the world's capybara capital", lat: -17.71, lon: -57.4 },
    { name: "Esteros del Iberá, Argentina", sub: "carpincho country", lat: -28.54, lon: -57.16 },
    { name: "São Paulo, Brazil", sub: "urban capybaras of the Pinheiros", lat: -23.55, lon: -46.63 },
  ];

  let factIdx = Math.floor(Math.random() * FACTS.length);

  function renderFact() {
    const el = document.getElementById("capy-fact");
    if (el) el.textContent = FACTS[factIdx];
  }

  function render(onPlace) {
    renderFact();
    const nextBtn = document.getElementById("capy-fact-next");
    if (nextBtn && !nextBtn._wired) {
      nextBtn._wired = true;
      nextBtn.addEventListener("click", () => {
        factIdx = (factIdx + 1) % FACTS.length;
        renderFact();
      });
    }

    const cams = document.getElementById("capy-cams");
    if (cams && !cams.childElementCount) {
      cams.innerHTML = CAMS.map((c) =>
        `<a class="cam-row" href="${c.url}" target="_blank" rel="noopener">
          <span class="cam-ico">${c.icon}</span>
          <span class="cam-body"><strong>${c.name}</strong><span class="cam-note">${c.note}</span></span>
          <span class="cam-go">›</span>
        </a>`).join("");
    }

    const places = document.getElementById("capy-places");
    if (places && !places.childElementCount) {
      places.innerHTML = PLACES.map((p, i) =>
        `<button class="place-chip" data-i="${i}"><strong>${p.name}</strong><span>${p.sub}</span></button>`).join("");
      places.addEventListener("click", (e) => {
        const b = e.target.closest(".place-chip");
        if (!b) return;
        onPlace(PLACES[Number(b.dataset.i)]);
      });
    }
  }

  return { render, factCount: FACTS.length };
})();
