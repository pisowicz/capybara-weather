/*
 * photos.js — the real capybara hero.
 *
 * A curated set of 111 cute capybara photographs from Wikimedia Commons,
 * all free licenses (CC BY / CC BY-SA / CC0 / public domain), shown as a
 * rotating full-bleed hero with a crossfade every 30 seconds and a photo
 * credit linking back to the source. Every capybara has a name and a
 * personal motto, delivered fresh on every app open. The hand-drawn SVG
 * scene stays underneath as the offline / load-failure fallback.
 */
window.CapyPhotos = (function () {
  "use strict";

  const PHOTOS = [
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/028_Capybara_and_Pink_Ip%C3%AA_trees_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg/250px-028_Capybara_and_Pink_Ip%C3%AA_trees_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg",
  "f": "028 Capybara and Pink Ipê trees in Encontro das Águas State Park Photo by Giles Laurent.jpg",
  "a": "Giles Laurent",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Turnip",
  "s": "I have inspected the weather. It is outside."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/057_Capybara_mother_nursing_her_babies_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg/250px-057_Capybara_mother_nursing_her_babies_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg",
  "f": "057 Capybara mother nursing her babies in Encontro das Águas State Park Photo by Giles Laurent.jpg",
  "a": "Giles Laurent",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Butterbean",
  "s": "Today I will be doing nothing, but outdoors."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/073_Capybara_mother_and_baby_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg/250px-073_Capybara_mother_and_baby_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg",
  "f": "073 Capybara mother and baby in Encontro das Águas State Park Photo by Giles Laurent.jpg",
  "a": "Giles Laurent",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Bartholomew",
  "s": "The pond called. I answered. No further comment."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/0_Hydrochoerus_hydrochaeris_-_Capybara_%281%29.JPG/250px-0_Hydrochoerus_hydrochaeris_-_Capybara_%281%29.JPG",
  "f": "0 Hydrochoerus hydrochaeris - Capybara (1).JPG",
  "a": "Jean-Pol GRANDMONT",
  "l": "CC BY-SA 3.0",
  "mw": 1600,
  "n": "Splash",
  "s": "If you can't find me, check the warm spot."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Baby_capybaras_in_Ito%2C_Japan.jpg/250px-Baby_capybaras_in_Ito%2C_Japan.jpg",
  "f": "Baby capybaras in Ito, Japan.jpg",
  "a": "Arizhura",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Biscuit",
  "s": "I am not slow. The world is unnecessarily fast."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Brazil_-_Curitiba_-_Parque_Barigui_%289%29.jpg/250px-Brazil_-_Curitiba_-_Parque_Barigui_%289%29.jpg",
  "f": "Brazil - Curitiba - Parque Barigui (9).jpg",
  "a": "Loco085",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Pudding",
  "s": "My hobbies include sitting and advanced sitting."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Capibara_1.jpg/250px-Capibara_1.jpg",
  "f": "Capibara 1.jpg",
  "a": "Fidel León Darder",
  "l": "CC BY-SA 3.0",
  "mw": 1600,
  "n": "Mochi",
  "s": "Every puddle is a hot tub if you believe in yourself."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Capibara_2_edit.jpg/250px-Capibara_2_edit.jpg",
  "f": "Capibara 2 edit.jpg",
  "a": "Fidel León Darder",
  "l": "CC BY-SA 3.0",
  "mw": 1280,
  "n": "Tofu",
  "s": "I woke up today. That was the whole plan."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Capibara_en_cautiverio.jpg/250px-Capibara_en_cautiverio.jpg",
  "f": "Capibara en cautiverio.jpg",
  "a": "Ehécatl Cabrera",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Miso",
  "s": "The grass was delicious again. Incredible run of form."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Capibara_tomando_el_sol.jpg/250px-Capibara_tomando_el_sol.jpg",
  "f": "Capibara tomando el sol.jpg",
  "a": "Nass0410",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Noodle",
  "s": "Never once have I checked the time. Look how I turned out."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Capivara%28Hydrochoerus_hydrochaeris%29.jpg/250px-Capivara%28Hydrochoerus_hydrochaeris%29.jpg",
  "f": "Capivara(Hydrochoerus hydrochaeris).jpg",
  "a": "Clodomiro Esteves Junior",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Pancake",
  "s": "A bird sat on me today. Honestly? An honor."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Capivara.jpg/250px-Capivara.jpg",
  "f": "Capivara.jpg",
  "a": "Mateus Hidalgo",
  "l": "CC BY-SA 2.5 br",
  "mw": 1600,
  "n": "Waffles",
  "s": "I let the river do the walking."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Capivara_no_Lago_Cascavel_%28PR%29.jpg/250px-Capivara_no_Lago_Cascavel_%28PR%29.jpg",
  "f": "Capivara no Lago Cascavel (PR).jpg",
  "a": "CLAITON LUIS MORAES",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Gerald",
  "s": "Being this round takes discipline."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Capivaras_no_Parque_do_Sabi%C3%A1.jpg/250px-Capivaras_no_Parque_do_Sabi%C3%A1.jpg",
  "f": "Capivaras no Parque do Sabiá.jpg",
  "a": "José Renato F. V. Prata Resende",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Susan",
  "s": "My schedule is full. Of naps."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Capybara_%2825789958658%29.jpg/250px-Capybara_%2825789958658%29.jpg",
  "f": "Capybara (25789958658).jpg",
  "a": "Ray in Manila",
  "l": "CC BY 2.0",
  "mw": 1600,
  "n": "Carlos",
  "s": "Nothing bothers me. I checked."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Capybara_%28DSC02452%29.jpg/250px-Capybara_%28DSC02452%29.jpg",
  "f": "Capybara (DSC02452).jpg",
  "a": "nachans",
  "l": "CC BY 2.0",
  "mw": 880,
  "n": "Paulo",
  "s": "I don't chase anything. Things arrive."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Capybara_%28Hydrochoerus_hydrachaeris%29_splashing_water_..._-_Flickr_-_berniedup.jpg/250px-Capybara_%28Hydrochoerus_hydrachaeris%29_splashing_water_..._-_Flickr_-_berniedup.jpg",
  "f": "Capybara (Hydrochoerus hydrachaeris) splashing water ... - Flickr - berniedup.jpg",
  "a": "Bernard DUPONT from FRANCE",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Rosa",
  "s": "The mud and I have an understanding."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Capybara_%28Hydrochoerus_hydrachaeris%29_young.jpg/250px-Capybara_%28Hydrochoerus_hydrachaeris%29_young.jpg",
  "f": "Capybara (Hydrochoerus hydrachaeris) young.jpg",
  "a": "Bernard DUPONT",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Yuzu",
  "s": "Somewhere it is raining, and I am happy for that place."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Capybara_%28Hydrochoerus_hydrachaeris%29_young_suckling.jpg/250px-Capybara_%28Hydrochoerus_hydrachaeris%29_young_suckling.jpg",
  "f": "Capybara (Hydrochoerus hydrachaeris) young suckling.jpg",
  "a": "Bernard DUPONT",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Clementine",
  "s": "I have never had a bad day. Just damp ones."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Capybara%28Hydrochoerus_hydrochaeris%29_swimming.JPG/250px-Capybara%28Hydrochoerus_hydrochaeris%29_swimming.JPG",
  "f": "Capybara(Hydrochoerus hydrochaeris) swimming.JPG",
  "a": "Charles J. Sharp",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Melon",
  "s": "You can't rush a capybara. Many have tried. All are calmer now."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Capybara%2C_Parrot_World.jpg/250px-Capybara%2C_Parrot_World.jpg",
  "f": "Capybara, Parrot World.jpg",
  "a": "Florent Pécassou",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Cucumber",
  "s": "The sun follows me around. I allow it."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Capybara_%28Hydrochoerus_hydrochaeris%29.jpg/250px-Capybara_%28Hydrochoerus_hydrochaeris%29.jpg",
  "f": "Capybara (Hydrochoerus hydrochaeris).jpg",
  "a": "Charles J. Sharp",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Pickles",
  "s": "I ate a leaf this big. No I will not elaborate."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Capybara_%28IMGP0646%29.jpg/250px-Capybara_%28IMGP0646%29.jpg",
  "f": "Capybara (IMGP0646).jpg",
  "a": "nachans",
  "l": "CC BY 2.0",
  "mw": 1600,
  "n": "Olive",
  "s": "Floating is just sitting for professionals."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Capybara_%28IMGP2981%29.jpg/250px-Capybara_%28IMGP2981%29.jpg",
  "f": "Capybara (IMGP2981).jpg",
  "a": "Asp Explorer",
  "l": "CC BY 2.0",
  "mw": 1580,
  "n": "Figgy",
  "s": "My personal record for doing nothing is ongoing."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Capybara_%28IMGP4473%29.jpg/250px-Capybara_%28IMGP4473%29.jpg",
  "f": "Capybara (IMGP4473).jpg",
  "a": "nachans",
  "l": "CC BY 2.0",
  "mw": 1600,
  "n": "Mango",
  "s": "Everyone I have ever met is my friend. Even the duck."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Capybara_%28IMG_7319%29.jpg/250px-Capybara_%28IMG_7319%29.jpg",
  "f": "Capybara (IMG 7319).jpg",
  "a": "Olena Tkach",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Papaya",
  "s": "Especially the duck."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Capybara_%28IMG_7323%29.jpg/250px-Capybara_%28IMG_7323%29.jpg",
  "f": "Capybara (IMG 7323).jpg",
  "a": "Olena Tkach",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Guava",
  "s": "Warm rock. Enough said."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Capybara_-_Chig%C3%BCire_%28Hydrochoerus_hydrochaeris%29_%289722123353%29.jpg/250px-Capybara_-_Chig%C3%BCire_%28Hydrochoerus_hydrochaeris%29_%289722123353%29.jpg",
  "f": "Capybara - Chigüire (Hydrochoerus hydrochaeris) (9722123353).jpg",
  "a": "Fernando Flores from Caracas, Venezuela",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Peanut",
  "s": "I share my snacks because hoarding ruins the vibe."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Capybara_and_Jackdaw.jpg/250px-Capybara_and_Jackdaw.jpg",
  "f": "Capybara and Jackdaw.jpg",
  "a": "Africa Gómez",
  "l": "CC BY 2.0",
  "mw": 1600,
  "n": "Cashew",
  "s": "The forecast says sit. It always says sit, if you read it right."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Capybara_at_SF_Zoo.jpg/250px-Capybara_at_SF_Zoo.jpg",
  "f": "Capybara at SF Zoo.jpg",
  "a": "Sanjay Acharya",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Walnut",
  "s": "I once walked quickly. Didn't care for it."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Capybara_male.jpg/250px-Capybara_male.jpg",
  "f": "Capybara male.jpg",
  "a": "Pattycarabelli",
  "l": "CC BY-SA 3.0",
  "mw": 1600,
  "n": "Hazel",
  "s": "Life tip: be near water and mean no harm."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Capybara_swimming.jpg/250px-Capybara_swimming.jpg",
  "f": "Capybara swimming.jpg",
  "a": "Bob Johnson",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Acorn",
  "s": "The crocodile and I simply do not discuss it."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Capybara_with_its_Cattle_Tyrant%2C_Esteros_Del_Ibera%2C_Corrientes%2C_Argentina%2C_2nd._Jan._2011_-_Flickr_-_PhillipC.jpg/250px-Capybara_with_its_Cattle_Tyrant%2C_Esteros_Del_Ibera%2C_Corrientes%2C_Argentina%2C_2nd._Jan._2011_-_Flickr_-_PhillipC.jpg",
  "f": "Capybara with its Cattle Tyrant, Esteros Del Ibera, Corrientes, Argentina, 2nd. Jan. 2011 - Flickr - PhillipC.jpg",
  "a": "Phillip Capper from Wellington, New Zealand",
  "l": "CC BY 2.0",
  "mw": 1600,
  "n": "Maple",
  "s": "I am the calm before, during, and after the storm."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Capybara_young_and_adult_Sydney_Zoo_2023-01-02.jpg/250px-Capybara_young_and_adult_Sydney_Zoo_2023-01-02.jpg",
  "f": "Capybara young and adult Sydney Zoo 2023-01-02.jpg",
  "a": "Pelagic",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Cedar",
  "s": "My fur dries eventually. Everything does."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Capybara2.jpg/250px-Capybara2.jpg",
  "f": "Capybara2.jpg",
  "a": "Jevgenijs Slihto",
  "l": "CC BY 2.0",
  "mw": 1600,
  "n": "Fern",
  "s": "Yes I will get in. It was never a question."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Capybaracropped.jpg/250px-Capybaracropped.jpg",
  "f": "Capybaracropped.jpg",
  "a": "Giles Laurent",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Moss",
  "s": "An orange on the head keeps the worries away."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Capybaramallards.jpg/250px-Capybaramallards.jpg",
  "f": "Capybaramallards.jpg",
  "a": "Stickpen",
  "l": "Public domain",
  "mw": 1600,
  "n": "Puddle",
  "s": "I have strong opinions about nothing."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Capybaras_%28Hydrochaerus_hydrochaeris%29_female_with_twins_at_the_beach_..._%2828555170992%29.jpg/250px-Capybaras_%28Hydrochaerus_hydrochaeris%29_female_with_twins_at_the_beach_..._%2828555170992%29.jpg",
  "f": "Capybaras (Hydrochaerus hydrochaeris) female with twins at the beach ... (28555170992).jpg",
  "a": "Bernard DUPONT from FRANCE",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Brook",
  "s": "The best seat is wherever I already am."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Capybaras_%28Hydrochoerus_hydrachaeris%29_female_and_young_suckling_..._%2848427191032%29.jpg/250px-Capybaras_%28Hydrochoerus_hydrachaeris%29_female_and_young_suckling_..._%2848427191032%29.jpg",
  "f": "Capybaras (Hydrochoerus hydrachaeris) female and young suckling ... (48427191032).jpg",
  "a": "Bernard DUPONT from FRANCE",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Riverson",
  "s": "I don't sweat the small stuff. Or sweat."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Capybaras_%28Hydrochoerus_hydrochaeris%29_couple_swimming_%28male_right%29_%2828530374913%29.jpg/250px-Capybaras_%28Hydrochoerus_hydrochaeris%29_couple_swimming_%28male_right%29_%2828530374913%29.jpg",
  "f": "Capybaras (Hydrochoerus hydrochaeris) couple swimming (male right) (28530374913).jpg",
  "a": "Bernard DUPONT from FRANCE",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Marsh",
  "s": "Mondays are fine. Everything is fine. I'm serious."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Capybaras_%28Hydrochoerus_hydrochaeris%29_family_cuddling_to_get_warm_..._-_Flickr_-_berniedup.jpg/250px-Capybaras_%28Hydrochoerus_hydrochaeris%29_family_cuddling_to_get_warm_..._-_Flickr_-_berniedup.jpg",
  "f": "Capybaras (Hydrochoerus hydrochaeris) family cuddling to get warm ... - Flickr - berniedup.jpg",
  "a": "Bernard DUPONT from FRANCE",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Pondrick",
  "s": "I peaked years ago and it's still going."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Capybaras_%28Hydrochoerus_hydrochaeris%29_female_and_youngs_..._%2828630908701%29.jpg/250px-Capybaras_%28Hydrochoerus_hydrochaeris%29_female_and_youngs_..._%2828630908701%29.jpg",
  "f": "Capybaras (Hydrochoerus hydrochaeris) female and youngs ... (28630908701).jpg",
  "a": "Bernard DUPONT from FRANCE",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Lakey",
  "s": "When in doubt, wade in."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Capybaras_%28Hydrochoerus_hydrochaeris%29_mom_and_kids_at_the_beach_..._%2828555170992%29.jpg/250px-Capybaras_%28Hydrochoerus_hydrochaeris%29_mom_and_kids_at_the_beach_..._%2828555170992%29.jpg",
  "f": "Capybaras (Hydrochoerus hydrochaeris) mom and kids at the beach ... (28555170992).jpg",
  "a": "Bernard DUPONT from FRANCE",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Bayou",
  "s": "I let my thoughts pass like clouds. All two of them."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Capybaras_%28Hydrochoerus_hydrochaeris%29_suckling_youngs_..._%2831032759263%29.jpg/250px-Capybaras_%28Hydrochoerus_hydrochaeris%29_suckling_youngs_..._%2831032759263%29.jpg",
  "f": "Capybaras (Hydrochoerus hydrochaeris) suckling youngs ... (31032759263).jpg",
  "a": "Bernard DUPONT from FRANCE",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Pebble",
  "s": "Grass for breakfast, grass for lunch. Consistency."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Capybaras_near_lake.png/250px-Capybaras_near_lake.png",
  "f": "Capybaras near lake.png",
  "a": "Bigas do Amaral",
  "l": "CC BY 4.0",
  "mw": 1580,
  "n": "Boulder",
  "s": "A little rain never hurt anyone this relaxed."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Capybaras_of_Chiba%3B_2013.jpg/250px-Capybaras_of_Chiba%3B_2013.jpg",
  "f": "Capybaras of Chiba; 2013.jpg",
  "a": "skasamatsu",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Clay",
  "s": "I keep my circle small: about forty capybaras."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Carpincho%2C_Reserva_Dr._Rodolfo_T%C3%A1lice.jpg/250px-Carpincho%2C_Reserva_Dr._Rodolfo_T%C3%A1lice.jpg",
  "f": "Carpincho, Reserva Dr. Rodolfo Tálice.jpg",
  "a": "Hoverfish",
  "l": "CC BY-SA 3.0",
  "mw": 1004,
  "n": "Muddy",
  "s": "Stress is a predator and I have none."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Carpinchos_juveniles_%28Hydrochoerus_hydrochaeris%29%2C_Uruguay%2C_2019.jpg/250px-Carpinchos_juveniles_%28Hydrochoerus_hydrochaeris%29%2C_Uruguay%2C_2019.jpg",
  "f": "Carpinchos juveniles (Hydrochoerus hydrochaeris), Uruguay, 2019.jpg",
  "a": "Enrique González",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Dusty",
  "s": "You blink slow at me, I blink slow at you. Diplomacy."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Carpinchos_ocult%C3%A1ndose.JPG/250px-Carpinchos_ocult%C3%A1ndose.JPG",
  "f": "Carpinchos ocultándose.JPG",
  "a": "Laura Pagés Méndez",
  "l": "CC BY-SA 3.0",
  "mw": 1600,
  "n": "Sandy",
  "s": "The water is always fine. That's the secret. It's always fine."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Cattle_tyrant_%28Machetornis_rixosa%29_on_Capybara.jpg/250px-Cattle_tyrant_%28Machetornis_rixosa%29_on_Capybara.jpg",
  "f": "Cattle tyrant (Machetornis rixosa) on Capybara.jpg",
  "a": "Charles J. Sharp",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Misty",
  "s": "I loafed so long the bread industry called."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Chester_Zoo_2016_030_-_Capybara.jpg/250px-Chester_Zoo_2016_030_-_Capybara.jpg",
  "f": "Chester Zoo 2016 030 - Capybara.jpg",
  "a": "Photograph by Mike Peel (www.mikepeel.net).",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Bruma",
  "s": "My spirit animal is also me."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Chiguire_Venezolano.jpg/250px-Chiguire_Venezolano.jpg",
  "f": "Chiguire Venezolano.jpg",
  "a": "Wilfredor",
  "l": "CC BY-SA 3.0",
  "mw": 1600,
  "n": "Stormzy",
  "s": "Some sit to think. I sit to sit."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Chiguiros_-_Hacienda_N%C3%A1poles.jpg/250px-Chiguiros_-_Hacienda_N%C3%A1poles.jpg",
  "f": "Chiguiros - Hacienda Nápoles.jpg",
  "a": "Arrasaris",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Sunbeam",
  "s": "Winter is just soup weather for the pond."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Chig%C3%BCire_o_Capybara_2.jpg/250px-Chig%C3%BCire_o_Capybara_2.jpg",
  "f": "Chigüire o Capybara 2.jpg",
  "a": "Javier Yores",
  "l": "CC BY-SA 3.0",
  "mw": 990,
  "n": "Nimbly",
  "s": "Every direction is downhill if you refuse to hurry."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chig%C3%BCires_en_tertulia.jpg/250px-Chig%C3%BCires_en_tertulia.jpg",
  "f": "Chigüires en tertulia.jpg",
  "a": "Carlos Santos",
  "l": "CC BY-SA 3.0",
  "mw": 1600,
  "n": "Breezy",
  "s": "The zoomies visited once. I waited them out."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Excurs%C3%A3o_pelo_Rio_Paraguai_em_C%C3%A1ceres_%28Mato_Grosso%29_392.jpg/250px-Excurs%C3%A3o_pelo_Rio_Paraguai_em_C%C3%A1ceres_%28Mato_Grosso%29_392.jpg",
  "f": "Excursão pelo Rio Paraguai em Cáceres (Mato Grosso) 392.jpg",
  "a": "Túllio F",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Drizzle",
  "s": "My five-year plan is this exact spot."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Fam%C3%ADlia_de_capivaras.jpg/250px-Fam%C3%ADlia_de_capivaras.jpg",
  "f": "Família de capivaras.jpg",
  "a": "Petyson Antonio",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Humita",
  "s": "They said touch grass. I live there."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/File_by_Peteris_P1160527_%283664692729%29.jpg/250px-File_by_Peteris_P1160527_%283664692729%29.jpg",
  "f": "File by Peteris P1160527 (3664692729).jpg",
  "a": "Pēteris",
  "l": "CC BY 2.0",
  "mw": 1600,
  "n": "Chimichurri",
  "s": "I am moist and unbothered."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Gfp-capybara-2.jpg/250px-Gfp-capybara-2.jpg",
  "f": "Gfp-capybara-2.jpg",
  "a": "Yinan Chen",
  "l": "Public Domain",
  "mw": 1600,
  "n": "Empanada",
  "s": "Small dogs fear nothing. I respect that. From my bath."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Gfp-capybara.jpg/250px-Gfp-capybara.jpg",
  "f": "Gfp-capybara.jpg",
  "a": "Yinan Chen",
  "l": "Public Domain",
  "mw": 1600,
  "n": "Churro",
  "s": "Do not mistake my silence for thought."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Herr_von_B%C3%B6defeld.jpg/250px-Herr_von_B%C3%B6defeld.jpg",
  "f": "Herr von Bödefeld.jpg",
  "a": "ZooSpotter",
  "l": "CC0",
  "mw": 1600,
  "n": "Flan",
  "s": "I was born round and I have protected that."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hydrochaeris_hydrochaeris_-_Flickr_-_Dick_Culbert.jpg/250px-Hydrochaeris_hydrochaeris_-_Flickr_-_Dick_Culbert.jpg",
  "f": "Hydrochaeris hydrochaeris - Flickr - Dick Culbert.jpg",
  "a": "Dick Culbert from Gibsons, B.C., Canada",
  "l": "CC BY 2.0",
  "mw": 880,
  "n": "Dulce",
  "s": "The horizon is nice but it's so far."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Hydrochoeris_hydrochaeris_IMG_9456_01.jpg/250px-Hydrochoeris_hydrochaeris_IMG_9456_01.jpg",
  "f": "Hydrochoeris hydrochaeris IMG 9456 01.jpg",
  "a": "Sunny365days",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Alfajor",
  "s": "I met a monkey once. Exhausting."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Hydrochoeris_hydrochaeris_IMG_9456_05.jpg/250px-Hydrochoeris_hydrochaeris_IMG_9456_05.jpg",
  "f": "Hydrochoeris hydrochaeris IMG 9456 05.jpg",
  "a": "Sunny365days",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Mate",
  "s": "Snacks taste better when someone shares them. I am someone."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Hydrochoeris_hydrochaeris_in_Brazil_in_Petr%C3%B3polis%2C_Rio_de_Janeiro%2C_Brazil_09.jpg/250px-Hydrochoeris_hydrochaeris_in_Brazil_in_Petr%C3%B3polis%2C_Rio_de_Janeiro%2C_Brazil_09.jpg",
  "f": "Hydrochoeris hydrochaeris in Brazil in Petrópolis, Rio de Janeiro, Brazil 09.jpg",
  "a": "Wilfredor",
  "l": "CC0",
  "mw": 1600,
  "n": "Tereré",
  "s": "I have no natural predators. Only natural nap-mates."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hydrochoerus_hydrochaeris_-_Gabriel_Jov%C3%AAncio_Ribeiro_-_423061493.jpeg/250px-Hydrochoerus_hydrochaeris_-_Gabriel_Jov%C3%AAncio_Ribeiro_-_423061493.jpeg",
  "f": "Hydrochoerus hydrochaeris - Gabriel Jovêncio Ribeiro - 423061493.jpeg",
  "a": "Gabriel Jovêncio Ribeiro",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Cassava",
  "s": "Once I floated for a whole afternoon. Career highlight."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Hydrochoerus_hydrochaeris_01.jpg/250px-Hydrochoerus_hydrochaeris_01.jpg",
  "f": "Hydrochoerus hydrochaeris 01.jpg",
  "a": "Σ64",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Yucca",
  "s": "The rain does my showering. Efficiency."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Hydrochoerus_hydrochaeris_188912237.jpg/250px-Hydrochoerus_hydrochaeris_188912237.jpg",
  "f": "Hydrochoerus hydrochaeris 188912237.jpg",
  "a": "Taiel Nazar",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Taro",
  "s": "Everything comes to those who sit by the water."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Hydrochoerus_hydrochaeris_216288510.jpg/250px-Hydrochoerus_hydrochaeris_216288510.jpg",
  "f": "Hydrochoerus hydrochaeris 216288510.jpg",
  "a": "Tomás Carranza Perales",
  "l": "CC0",
  "mw": 1600,
  "n": "Lotus",
  "s": "I don't hold grudges. Too heavy."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Hydrochoerus_hydrochaeris_217191532.jpg/250px-Hydrochoerus_hydrochaeris_217191532.jpg",
  "f": "Hydrochoerus hydrochaeris 217191532.jpg",
  "a": "Tomás Carranza Perales",
  "l": "CC0",
  "mw": 1600,
  "n": "Lily",
  "s": "My ears fold down for a reason: scheduled peace."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Hydrochoerus_hydrochaeris_217252709.jpg/250px-Hydrochoerus_hydrochaeris_217252709.jpg",
  "f": "Hydrochoerus hydrochaeris 217252709.jpg",
  "a": "Silvio Montani",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Reed",
  "s": "Yes, this is my resting face. All of them are."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Hydrochoerus_hydrochaeris_222765445.jpg/250px-Hydrochoerus_hydrochaeris_222765445.jpg",
  "f": "Hydrochoerus hydrochaeris 222765445.jpg",
  "a": "Ezequiel Racker",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Rush",
  "s": "Somewhere between wet and dry is where I live."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Hydrochoerus_hydrochaeris_222765566.jpg/250px-Hydrochoerus_hydrochaeris_222765566.jpg",
  "f": "Hydrochoerus hydrochaeris 222765566.jpg",
  "a": "Ezequiel Racker",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Sedge",
  "s": "I've seen things. Mostly grass. Wonderful things."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Hydrochoerus_hydrochaeris_222765743.jpg/250px-Hydrochoerus_hydrochaeris_222765743.jpg",
  "f": "Hydrochoerus hydrochaeris 222765743.jpg",
  "a": "Ezequiel Racker",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Willow",
  "s": "Patience is easy when you have nowhere to be."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Hydrochoerus_hydrochaeris_baby_at_Giardino_zoologico_di_Pistoia.jpg/250px-Hydrochoerus_hydrochaeris_baby_at_Giardino_zoologico_di_Pistoia.jpg",
  "f": "Hydrochoerus hydrochaeris baby at Giardino zoologico di Pistoia.jpg",
  "a": "Federigo Federighi",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Wisteria",
  "s": "The little ones climb on me. I am furniture. I am home."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Hydrochoerus_hydrochaeris_in_Okayama_Forest_Park_03.jpg/250px-Hydrochoerus_hydrochaeris_in_Okayama_Forest_Park_03.jpg",
  "f": "Hydrochoerus hydrochaeris in Okayama Forest Park 03.jpg",
  "a": "ノボホショコロトソ",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Clover",
  "s": "A warm puddle is a five-star establishment."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Isla_Anchieta%2C_Ubatuba%2C_Sao_Paulo_Litroal_16.JPG/250px-Isla_Anchieta%2C_Ubatuba%2C_Sao_Paulo_Litroal_16.JPG",
  "f": "Isla Anchieta, Ubatuba, Sao Paulo Litroal 16.JPG",
  "a": "Tony My Friend",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Dandelion",
  "s": "I don't do drama. I do ponds."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Kapibara-san_%286969729614%29.jpg/250px-Kapibara-san_%286969729614%29.jpg",
  "f": "Kapibara-san (6969729614).jpg",
  "a": "Michael Day",
  "l": "CC BY 2.0",
  "mw": 1600,
  "n": "Thistle",
  "s": "Tell me your worries. I will blink slowly until they leave."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Kapibara_1.jpg/250px-Kapibara_1.jpg",
  "f": "Kapibara 1.jpg",
  "a": "Sebas optura",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Bramble",
  "s": "No thoughts. Pond empty."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/La_carpinchada.JPG/250px-La_carpinchada.JPG",
  "f": "La carpinchada.JPG",
  "a": "Miguel A Germann",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Bindweed",
  "s": "I am the group project member who shows up and naps."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Mam%C3%A1_y_cachorros_de_carpinchos.JPG/250px-Mam%C3%A1_y_cachorros_de_carpinchos.JPG",
  "f": "Mamá y cachorros de carpinchos.JPG",
  "a": "Miguel A Germann",
  "l": "CC BY-SA 4.0",
  "mw": 1025,
  "n": "Barnaby",
  "s": "Hot springs? In this economy? Yes. Always yes."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Mato_Grosso_do_Sul_-_Pantanal_03.jpg/250px-Mato_Grosso_do_Sul_-_Pantanal_03.jpg",
  "f": "Mato Grosso do Sul - Pantanal 03.jpg",
  "a": "Anderson Momesso",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Winston",
  "s": "My tail is a rumor."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Neopark_Okinawa%2C_Japan_%289506926312%29.jpg/250px-Neopark_Okinawa%2C_Japan_%289506926312%29.jpg",
  "f": "Neopark Okinawa, Japan (9506926312).jpg",
  "a": "pelican from Tokyo, Japan",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Percival",
  "s": "I run a tight ship. The ship is a log I float on."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/O_Sono_das_Capivaras.JPG/250px-O_Sono_das_Capivaras.JPG",
  "f": "O Sono das Capivaras.JPG",
  "a": "Julie Ribeiro da Silva",
  "l": "CC BY-SA 3.0",
  "mw": 1600,
  "n": "Mabel",
  "s": "Confidence is sitting with your back to the jungle."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/On_the_Rio_Tambopata%E2%80%A6Capybara_%288445827764%29.jpg/250px-On_the_Rio_Tambopata%E2%80%A6Capybara_%288445827764%29.jpg",
  "f": "On the Rio Tambopata…Capybara (8445827764).jpg",
  "a": "Murray Foubister",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Agnes",
  "s": "Whatever it was, I forgive it. Too warm here to care."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Pantamal_L033.jpg/250px-Pantamal_L033.jpg",
  "f": "Pantamal L033.jpg",
  "a": "John  Crane",
  "l": "CC BY 2.0",
  "mw": 1600,
  "n": "Doris",
  "s": "I judge no one. Takes energy."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Pantanal_J304.jpg/250px-Pantanal_J304.jpg",
  "f": "Pantanal J304.jpg",
  "a": "John  Crane",
  "l": "CC BY 2.0",
  "mw": 1600,
  "n": "Harold",
  "s": "The yuzu bath is medicinal. The medicine is joy."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Pantanal_sul.jpg/250px-Pantanal_sul.jpg",
  "f": "Pantanal sul.jpg",
  "a": "Paulo augusto rezek",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Nigel",
  "s": "I am aerodynamic like a bar of soap. Perfect."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Patrim%C3%B4nio_do_Horto_13.JPG/250px-Patrim%C3%B4nio_do_Horto_13.JPG",
  "f": "Patrimônio do Horto 13.JPG",
  "a": "Washington Luiz",
  "l": "CC BY-SA 3.0",
  "mw": 1600,
  "n": "Beatrice",
  "s": "Everything in moderation. Except sitting."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Taim_-_famille_capivara.JPG/250px-Taim_-_famille_capivara.JPG",
  "f": "Taim - famille capivara.JPG",
  "a": "FrancoBras",
  "l": "CC BY-SA 3.0",
  "mw": 1600,
  "n": "Mortimer",
  "s": "They put me in the brochure for calm."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/The_City%27s_Carpinchos.jpg/250px-The_City%27s_Carpinchos.jpg",
  "f": "The City's Carpinchos.jpg",
  "a": "Mualpha7",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Chauncey",
  "s": "I was told to seize the day. I sat on it instead."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/To_face-_a_capibara.jpg/250px-To_face-_a_capibara.jpg",
  "f": "To face- a capibara.jpg",
  "a": "Martin Fisch",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Reginald",
  "s": "My cardio is chewing."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Two_capybaras_standing_in_grass_-_DPLA_-_1cdd30691cefed9c92d047aac3720a43.jpg/250px-Two_capybaras_standing_in_grass_-_DPLA_-_1cdd30691cefed9c92d047aac3720a43.jpg",
  "f": "Two capybaras standing in grass - DPLA - 1cdd30691cefed9c92d047aac3720a43.jpg",
  "a": "Garst, Warren, 1922-2016, photographer",
  "l": "CC BY-SA 4.0",
  "mw": 1552,
  "n": "Penelope",
  "s": "If lost, do not return me. I am where I should be."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Vizidiszn%C3%B3.JPG/250px-Vizidiszn%C3%B3.JPG",
  "f": "Vizidisznó.JPG",
  "a": "Azay at Hungarian Wikipedia",
  "l": "CC BY-SA 3.0",
  "mw": 1600,
  "n": "Gwendolyn",
  "s": "The stars are nice. I've slept under all of them."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Wasserschwein_Hydrochoerus_hydrochaeris_Tierpark_Hellabrunn-2.jpg/250px-Wasserschwein_Hydrochoerus_hydrochaeris_Tierpark_Hellabrunn-2.jpg",
  "f": "Wasserschwein Hydrochoerus hydrochaeris Tierpark Hellabrunn-2.jpg",
  "a": "Rufus46",
  "l": "CC BY-SA 3.0",
  "mw": 1600,
  "n": "Rupert",
  "s": "I know a shortcut. It's to stay here."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Wasserschwein_und_Grasslandtyrann.jpg/250px-Wasserschwein_und_Grasslandtyrann.jpg",
  "f": "Wasserschwein und Grasslandtyrann.jpg",
  "a": "Scarabinol",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Cornelius",
  "s": "Ambition is a young rodent's game."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Wasserschweine_%28Zoo_Leipzig%29_%282%29.jpg/250px-Wasserschweine_%28Zoo_Leipzig%29_%282%29.jpg",
  "f": "Wasserschweine (Zoo Leipzig) (2).jpg",
  "a": "Fiver, der Hellseher",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Philbert",
  "s": "My good side is all of them, viewed from a warm place."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Wasserschweine_%28Zoo_Leipzig%29_%283%29.jpg/250px-Wasserschweine_%28Zoo_Leipzig%29_%283%29.jpg",
  "f": "Wasserschweine (Zoo Leipzig) (3).jpg",
  "a": "Fiver, der Hellseher",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Eugenia",
  "s": "The current took my stick. The river owes me nothing. We're good."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Yellow-headed_caracara_%28Milvago_chimachima%29_on_capybara_%28Hydrochoeris_hydrochaeris%29.JPG/250px-Yellow-headed_caracara_%28Milvago_chimachima%29_on_capybara_%28Hydrochoeris_hydrochaeris%29.JPG",
  "f": "Yellow-headed caracara (Milvago chimachima) on capybara (Hydrochoeris hydrochaeris).JPG",
  "a": "Charles J. Sharp",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Horace",
  "s": "Believe in yourself as much as I believe in lunch."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Zoo_Zl%C3%ADn%2C_kapybara_01.jpg/250px-Zoo_Zl%C3%ADn%2C_kapybara_01.jpg",
  "f": "Zoo Zlín, kapybara 01.jpg",
  "a": "Palickap",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Prudence",
  "s": "I don't rise and grind. I lower and soften."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D0%B0_%D0%B2_%D0%9A%D0%B0%D0%BB%D0%B8%D0%BD%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5.jpg/250px-%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D0%B0_%D0%B2_%D0%9A%D0%B0%D0%BB%D0%B8%D0%BD%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5.jpg",
  "f": "Капибара в Калининградском зоопарке.jpg",
  "a": "Mulyaevic",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Capuccino",
  "s": "An egret told me a secret. It was 'stand still more.'"
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_01_%282024%29.jpg/250px-%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_01_%282024%29.jpg",
  "f": "Капибары в Московском зоопарке - 01 (2024).jpg",
  "a": "О. Сосницкий / Mos.ru",
  "l": "CC BY 4.0",
  "mw": 1580,
  "n": "Espresso",
  "s": "You cannot pour from an empty cup, so I stay in the cup."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_02_%282024%29.jpg/250px-%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_02_%282024%29.jpg",
  "f": "Капибары в Московском зоопарке - 02 (2024).jpg",
  "a": "О. Сосницкий / Mos.ru",
  "l": "CC BY 4.0",
  "mw": 1580,
  "n": "Chai",
  "s": "The vibes today are moist and correct."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_06_%282024%29.jpg/250px-%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_06_%282024%29.jpg",
  "f": "Капибары в Московском зоопарке - 06 (2024).jpg",
  "a": "О. Сосницкий / Mos.ru",
  "l": "CC BY 4.0",
  "mw": 1580,
  "n": "Oolong",
  "s": "I tried worrying once. Fell asleep halfway."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_07_%282024%29.jpg/250px-%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_07_%282024%29.jpg",
  "f": "Капибары в Московском зоопарке - 07 (2024).jpg",
  "a": "О. Сосницкий / Mos.ru",
  "l": "CC BY 4.0",
  "mw": 1580,
  "n": "Matcha",
  "s": "Home is wherever the herd loafs."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_08_%282024%29.jpg/250px-%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_08_%282024%29.jpg",
  "f": "Капибары в Московском зоопарке - 08 (2024).jpg",
  "a": "О. Сосницкий / Mos.ru",
  "l": "CC BY 4.0",
  "mw": 1580,
  "n": "Cocoa",
  "s": "I'm not wet. The world is briefly dry around me."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_09_%282024%29.jpg/250px-%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_09_%282024%29.jpg",
  "f": "Капибары в Московском зоопарке - 09 (2024).jpg",
  "a": "О. Сосницкий / Mos.ru",
  "l": "CC BY 4.0",
  "mw": 1580,
  "n": "Toffee",
  "s": "Growth is just getting rounder, spiritually."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%BD%D0%B0_%D0%BE%D0%B7%D0%B5%D1%80%D0%B5.jpg/250px-%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D1%8B_%D0%BD%D0%B0_%D0%BE%D0%B7%D0%B5%D1%80%D0%B5.jpg",
  "f": "Капибары на озере.jpg",
  "a": "Kitenok13",
  "l": "CC BY 4.0",
  "mw": 1600,
  "n": "Caramelo",
  "s": "The best time to nap was 20 minutes ago. The second best time is now."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/%E3%82%80%E3%82%93%E3%81%9A_%2815528935137%29.jpg/250px-%E3%82%80%E3%82%93%E3%81%9A_%2815528935137%29.jpg",
  "f": "むんず (15528935137).jpg",
  "a": "★Kumiko★ from Tokyo, Japan",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Nougat",
  "s": "I have achieved inbox zero by having no inbox."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/%E3%82%AB%E3%83%94%E3%83%90%E3%83%A9_ECO.jpg/250px-%E3%82%AB%E3%83%94%E3%83%90%E3%83%A9_ECO.jpg",
  "f": "カピバラ ECO.jpg",
  "a": "大阪ECO動物海洋専門学校",
  "l": "CC BY-SA 4.0",
  "mw": 1600,
  "n": "Marzipan",
  "s": "Slow is smooth, smooth is nap."
 },
 {
  "u": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/%E8%83%8C%E3%81%AE%E4%B8%8A%E3%81%AE%E5%96%A7%E9%A8%92_%2815528938417%29.jpg/250px-%E8%83%8C%E3%81%AE%E4%B8%8A%E3%81%AE%E5%96%A7%E9%A8%92_%2815528938417%29.jpg",
  "f": "背の上の喧騒 (15528938417).jpg",
  "a": "★Kumiko★ from Tokyo, Japan",
  "l": "CC BY-SA 2.0",
  "mw": 1600,
  "n": "Strudel",
  "s": "May your grass be green and your water warm."
 }
];

  const ROTATE_MS = 30000;
  let stage = null, layers = [], front = 0, order = [], pos = -1, timer = null, started = false;
  let lastShown = null, lastUrl = null, changeCb = null;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function urlFor(p) {
    const vw = Math.max(window.innerWidth || 390, 390);
    const want = Math.min(p.mw, Math.max(640, Math.ceil(vw * Math.min(window.devicePixelRatio || 1, 3) / 160) * 160));
    return p.u.replace("/200px-", "/" + want + "px-");
  }

  function creditHTML(p) {
    const page = "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(p.f);
    return `<a class="capy-photo-credit" href="${page}" target="_blank" rel="noopener">\u{1F4F7} ${p.a} \u{B7} ${p.l} \u{B7} Wikimedia</a>`;
  }

  function show(wrap, tries) {
    pos = (pos + 1) % order.length;
    if (pos === 0) shuffle(order);
    const p = PHOTOS[order[pos]];
    const img = new Image();
    img.onload = () => {
      const back = 1 - front;
      const url = `url("${img.src}")`;
      layers[back].querySelector(".cp-blur").style.backgroundImage = url;
      layers[back].querySelector(".cp-main").style.backgroundImage = url;
      layers[back].classList.add("on");
      layers[front].classList.remove("on");
      front = back;
      const credit = document.querySelector(".capy-photo-credit-slot");
      if (credit) credit.innerHTML = creditHTML(p);
      stage.classList.add("capy-photos-live");
      lastShown = p;
      lastUrl = img.src;
      if (changeCb) changeCb(p);
    };
    img.onerror = () => { if (tries > 0) show(wrap, tries - 1); };
    img.src = urlFor(p);
  }

  function start(wrap) {
    if (!stage) {
      stage = document.getElementById("capy-photo-stage");
      if (!stage) return;
      stage.innerHTML =
        `<div class="capy-photo"><div class="cp-blur"></div><div class="cp-main"></div></div>` +
        `<div class="capy-photo"><div class="cp-blur"></div><div class="cp-main"></div></div>`;
      layers = Array.from(stage.querySelectorAll(".capy-photo"));
      order = shuffle(PHOTOS.map((_, i) => i));
    }
    stage.classList.remove("hidden");
    if (started) return;
    started = true;
    show(wrap, 4);
    timer = setInterval(() => { if (!document.hidden) show(wrap, 4); }, ROTATE_MS);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    started = false;
    if (stage) {
      stage.classList.add("hidden");
      stage.classList.remove("capy-photos-live");
    }
  }

  const onChange = (cb) => { changeCb = cb; if (lastShown) cb(lastShown); };
  const current = () => (lastShown ? { ...lastShown, url: lastUrl } : null);

  return { start, stop, onChange, current, all: () => PHOTOS, count: PHOTOS.length };
})();
