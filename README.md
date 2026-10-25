# Sekkenah — Ethiopia tours, Addis Ababa

A bilingual (English ⇄ Arabic) site for Sekkenah Tour & Travel, a tour operator at Jemo
Michael in Addis Ababa. The whole site is about tours **inside Ethiopia**: fourteen routes
out of Addis, eight lodges, cars and drivers, and the services a route needs. Nothing on
the page sells Umrah, Hajj, Makkah or Madinah hotels.

Live: <https://adamcreatesem.github.io/sekkenah-umrah/> (GitHub Pages, repo
`adamcreatesem/sekkenah-umrah`, branch `main`). The repo path still says `umrah` because
the URL was already in use; renaming it would break the shared link.

## What is in it

| Section | What it does |
|---|---|
| Hero + search | Region / month / traveller count, filters the tour grid and scrolls to it |
| Why | One quote, guides who know the road, rates before you commit |
| Tours | Fourteen routes, region chips with counts, duration and level on every card |
| Detail drawer | Region and level, price, seats, what is included, the written day-by-day, next departure, best months |
| How it works | Six steps from "tell us the dates" to "back in Addis" |
| Lodges | Eight places on the water and in the forest, per-room rate, add-to-trip |
| Cars & drivers | Airport transfer, day car, 4×4 and minibus with rates, reserved over WhatsApp |
| Services | Routes, domestic flights, cars, lodges, permits, guides, groups, on-trip support |
| Booking | Four steps → reference number → printable summary → WhatsApp handoff |
| About / FAQ / contact | The office, seven real questions, both phone lines, map link, enquiry form |

**Routes.** `assets/js/data.js` holds the fourteen tours, each with a region (`rift`,
`north`, `south`, `wild`), a level (easy / moderate / demanding), `bestMonths` for the
season filter, an explicit itinerary, and bilingual copy. Region chips are generated from
`REGIONS`, so an empty region still reads as a place.

**Booking model.** A route is a private departure, priced per person:
`price × (adults + 0.6 × children + 0.1 × infants)`, plus extras, plus lodge nights
(`rate × route nights × rooms`). Deposit is 30%. Confirmation stores the request in
`localStorage` (`sekkenah.bookings.v1`), issues an `SKN-XXXXXX` reference, renders a
printable summary, and builds a pre-filled WhatsApp message with every field.

**Language.** Header, footer and `?lang=ar` all switch. The button glyph follows the
language it switches *to* (`ع` on English, `E` on Arabic). Layout is written with logical
properties, so Arabic mirrors rather than flips; the display and body type stacks swap and
letterspacing is dropped. The date in the header is the **Ethiopian calendar**, computed
with `Intl` (`ethiopic`), not a hardcoded string.

## Files

```
index.html            page
credits.html          photo attribution (required by the licences)
assets/css/site.css   the design system
assets/js/data.js     tours, lodges, cars, services, steps, FAQs, extras
assets/js/i18n.js     interface strings, EN + AR
assets/js/app.js      rendering, filters, drawer, booking wizard
assets/img/           route, lodge and editorial photography
PHOTO-CREDITS.json    the same attribution as data
serve.mjs             local preview (node serve.mjs 8910)
```

`RESEARCH.md` records where the content and photography came from, and what is still a
draft figure.

## Open items for the client

1. Replace the draft prices, lodge rates and route dates with real inventory.
2. Wire the booking flow to a backend (or a form service) — the WhatsApp handoff is a
   stopgap, not a booking engine.
3. Add a privacy note: the enquiry and booking forms collect names, phone numbers and
   passport numbers, and at present they only ever reach `localStorage` on the visitor's
   own device. Nothing is transmitted.
4. Add analytics, and an Amharic / Afaan Oromo locale.
5. Send a tours-specific social handle if there is one — the Umrah accounts
   (`@sekkenah.umra.serv`, `@sekinah.umrah`) are deliberately not linked from this site.

## Checks run

Chromium (headless, CDP), against the local server and the live GitHub Pages URL: 14 tours,
5 region chips with counts, 8 lodges, 4 cars, 8 services, 6 steps, 7 FAQs, every image
loading, 0 console errors, no "Makkah / Madinah / Umrah / Hajj / Haram" string anywhere on
the page. Region filtering, month and party-size search (including the empty state), the
Rift Valley Lakes drawer, the wizard through to the `SKN` reference, adding a lodge and
seeing it priced in the review, and the Arabic switch (RTL, glyph `E`, translated headings,
chips, levels and card metadata) were all exercised. Layout measured at 390 / 768 / 1440 px
in both languages: no horizontal overflow, 1 / 2 / 3 tour columns, 4 lodge columns.
