# Sekkenah — website build

A bilingual (English / Arabic) booking site for **Sekkenah Tour & Travel**, an Umrah and
Hajj operator at Jemo Michael, Addis Ababa. Static HTML, CSS and ES modules — no build
step, no framework, no dependencies. Open `index.html` through the preview server:

```bash
node serve.mjs 8910        # http://127.0.0.1:8910/
```

The server is `no-store` on purpose: this is a design build that gets edited between
screenshots.

---

## What is in it

| Section | What it does |
|---|---|
| Hero + search | Journey type / month / traveller count, filters the grid and scrolls to it |
| Umrah | Six rounds, filter chips, live seat counts, detail drawer |
| Ethiopia tours | Fourteen guided tours from Addis — Rift Valley lakes (Ziway, Langano, Hawassa), Bishoftu crater lakes, Wonchi, Arba Minch and Nech Sar, Bale and Sof Omar, Omo Valley, Harar, plus Lalibela, Simien, Danakil, Gondar and Axum. Filter chips by kind, own itineraries, bookable through the same wizard |
| Lakes & resorts | Eight Ethiopian lodges by the water — Langano, Hawassa, Bishoftu, Arba Minch, Bahir Dar, Wonchi and the Harenna forest — per-room rate, add-to-trip |
| Cars & drivers | Airport transfer, day car, 4×4 and minibus with rates, reserved over WhatsApp with the route and date |
| Detail drawer | Includes, generated day-by-day (13 days for the 11-night round), departure, price note |
| How it works | Six-step path from enquiry to return |
| Hotels | Makkah / Madinah tabs, distance to the Haram, per-night rate, add-to-trip |
| Services | Visa, tickets, hotels, transfers, ziyarah, groups, insurance, on-trip support |
| Booking | Four steps → reference number → printable ticket → WhatsApp handoff |
| About / social / FAQ | Story, the two real accounts with their real counts, seven questions |
| Contact | Office, both phone lines, WhatsApp, map link, enquiry form |

**Language toggle** is in the header, in the footer, and available as `?lang=ar`
(an explicit parameter wins over the stored preference). The choice persists in
`localStorage`; the document swaps `lang` and `dir` and every string, including the
data-driven cards, is re-rendered — there is no half-translated state.

**Booking model.** `assets/js/data.js` holds packages; price is
`base × (adults + 0.7 × children + 0.12 × infants) × room factor`, plus extras, plus any
attached hotel nights. Deposit is 30%. Confirmation stores the request in
`localStorage` (`sekkenah.bookings.v1`), issues an `SKN-XXXXXX` reference, renders a
printable ticket, and builds a pre-filled WhatsApp message containing every field, so the
office confirms instead of re-keying.

---

## Files

```
index.html                 markup, i18n hooks, drawer + modal shells
credits.html               generated photo attribution (licence requirement)
assets/css/site.css        design system, layout, RTL, print, reduced motion
assets/fonts/              self-hosted Fraunces, Instrument Sans, Reem Kufi, IBM Plex Sans Arabic
assets/js/data.js          packages, tours, hotels, stays, cars, services, steps, FAQs, extras, room types
assets/js/i18n.js          flat EN/AR dictionary + month names
assets/js/app.js           rendering, filters, wizard, drawer, focus trap, persistence
assets/img/                cropped and graded photography, the vector emblem, the client's logo
PHOTO-CREDITS.json         machine-readable attribution manifest
RESEARCH.md                what was found about the client and what it changed
serve.mjs                  no-store preview server
```

---

## Draft data to replace before this goes live

Everything below is a placeholder. Nothing here was published by the client.

- **Prices** on all six journeys except `USD 1850` (that figure is from their own post).
  The hotel rates, seats left and departure dates are invented, and **the Ethiopia tours
  are a proposed product line** — the client has no published tours, so their prices,
  dates and itineraries are drafts to be replaced with real operations.
- **The emblem** in `assets/img/mark.svg` is a redraw of the client's badge, simplified so
  it survives at 38 px; the untouched artwork is `assets/img/logo-full.png` (taken from
  their 1080 px TikTok avatar). Their lockup spells the brand **SEKINA UMRA SERVICE**
  while the handles read Sekkenah / Sekinah — the site keeps their trading name and uses
  the emblem, so nothing on the page contradicts either.
- **Hotel names** — the eight Makkah / Madinah properties are fictional, with invented
  distances and rates. The eight Ethiopian lodges in `STAYS` (Sabana Beach Resort,
  Bishangari Lodge, Haile Resort Hawassa, Kuriftu Bishoftu, Haile Resort Arba Minch,
  Kuriftu Lake Tana, Wonchi Eco Lodge, Bale Mountain Lodge) are real named properties,
  but their rates, star ratings and availability here are drafts — confirm with the
  client before this is sent to anyone as bookable inventory.
- **`hello@sekkenah.com`** and any domain assumptions.
- **The tagline tail** — they use "Journey with trust, travel with …"; the site says
  "Journey with trust." until they confirm the rest.
- **Licence line** — no Ministry of Hajj and Umrah number was available, so none is
  claimed. Add it when supplied.
- **Amharic and Afaan Oromo** — the audience speaks both; only EN/AR ship here.

## Before launch

1. Replace the catalogue in `data.js` with real inventory.
2. Add the licence number and a real email; point the map link at the exact pin.
3. Wire the booking flow to a backend (or a form service) — the WhatsApp handoff is a
   stopgap, not a booking engine.
4. Add a privacy note: the enquiry and booking forms collect names, phone numbers and
   passport numbers, and at present they only ever reach `localStorage` on the visitor's
   own device. Nothing is transmitted.
5. Add analytics and an Amharic / Afaan Oromo locale.

## Checks run

Chromium (headless, CDP): 14 tours and 7 tour filter chips, 8 Makkah/Madinah hotels,
8 Ethiopian stays, 4 car cards, 6 journeys, 8 services, 7 FAQs, 0 console errors,
0 broken images. Filtering, the Wonchi drawer, the booking wizard (listing every tour),
adding a stay to the trip, and the Arabic switch (RTL, 14 tours still rendered, translated
stays and cars headings) were all exercised against both the local server and the live
GitHub Pages URL.
