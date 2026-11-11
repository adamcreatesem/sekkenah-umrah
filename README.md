# Sekkenah, Ethiopia tours, Addis Ababa

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
| Past trips | One film per place (Wonchi, then the road to Butajira) and eight photographs shot on the client's own departures: phone-framed video that loads on click, a photo grid with a keyboard-driven lightbox |
| Route drawer | Region and level, price, seats, the story of the road, what is included, the written day-by-day, how you get there, next departure, best months, two photographs |
| How it works | Six steps from "tell us the dates" to "back in Addis" |
| Lodges | Ten places on the water, in the crater and in the forest. Every card opens its own drawer: story, distance, rate, photographs, with **Add to trip** and **Book this room** |
| Cars & drivers | Airport transfer, day car, 4×4 and minibus with rates, reserved over WhatsApp |
| Services | Routes, domestic flights, cars, lodges, permits, guides, groups, on-trip support |
| Booking | Four steps → reference number → printable summary → WhatsApp handoff |
| About / FAQ / contact | The office, seven real questions, both phone lines, map link, enquiry form |

**Routes.** `assets/js/data.js` is generated from the client portal
(`tools/sync-content.mjs`, see `../sekkenah-portal/`) and holds the fourteen tours, each with a region (`rift`,
`north`, `south`, `wild`), a level (easy / moderate / demanding), `bestMonths` for the
season filter, an explicit itinerary, and bilingual copy. Region chips are generated from
`REGIONS`, so an empty region still reads as a place.

**Booking model.** Two ways in, one four-step wizard:

- A **route** is a private departure, priced per person:
  `price × (adults + 0.6 × children + 0.1 × infants)`, plus extras, plus any lodge nights
  (`rate × route nights × rooms`).
- A **room on its own** is priced per room per night: `rate × nights × rooms`, plus airport
  transfers and insurance. The step labels change to Stay / Guests, and guests need a name
  rather than a passport.

Deposit is 30% either way. Confirmation posts the request to the booking API, which stores it,
issues the `SKN-XXXXXX` reference and emails the office and the visitor. The same request is
also written to `localStorage` (`sekkenah.bookings.v1`) and rendered as a printable summary
with a pre-filled WhatsApp message. If the API is not configured or cannot be reached, the
local copy and the WhatsApp handoff are the whole flow, exactly as before, with a line telling
the visitor the office has not received it yet.

Set the API endpoint once, in `index.html`: `<meta name="sekkenah-api" content="https://...">`.
Empty means no network call is attempted.

**Language.** Header, footer and `?lang=ar` all switch. The button glyph follows the
language it switches *to* (`ع` on English, `E` on Arabic). Layout is written with logical
properties, so Arabic mirrors rather than flips; the display and body type stacks swap and
letterspacing is dropped. The date in the header is the **Ethiopian calendar**, computed
with `Intl` (`ethiopic`), not a hardcoded string.

## Files

```
index.html            page
admin.html            the staff office: bookings, enquiries, routes, lodges, settings
credits.html          photo attribution (required by the licences)
assets/css/site.css   the design system
assets/js/data.js     tours, lodges, cars, services, steps, FAQs, extras
assets/js/trips.js    past trips: the client's own films and photographs (hand-written)
assets/js/i18n.js     interface strings, EN + AR
assets/js/app.js      rendering, filters, drawer, booking wizard
assets/js/api.js      booking and enquiry transport, with the offline fallback
assets/js/content.js  fetches the published catalogue, falls back to the shipped one
assets/js/admin.js    the office page logic
tools/sync-content.mjs  rebuilds data.js from the portal (generated file, do not hand-edit)
assets/img/           route, lodge, gallery and editorial photography
assets/video/         two web encodes (H.264 faststart, 1080x1920) with posters
PHOTO-CREDITS.json    the same attribution as data
serve.mjs             local preview (node serve.mjs 8910)
```

`RESEARCH.md` records where the content and photography came from, and what is still a
draft figure.

## Open items for the client

1. Replace the draft prices, lodge rates and route dates with real inventory.
2. Claim the Cloudflare account the API was deployed into, or Cloudflare deletes it. Online
   payment and per-date availability are still not built. See `../sekkenah-portal/HANDOVER.md`.
3. Add a privacy note: the enquiry and booking forms collect names, phone numbers and
   passport numbers, and they are now stored on a server so the office can work them. The
   site does not say so yet.
4. Add analytics, and an Amharic / Afaan Oromo locale.
5. Send a tours-specific social handle if there is one. The Umrah accounts
   (`@sekkenah.umra.serv`, `@sekinah.umrah`) are deliberately not linked from this site.

## Checks run

Chromium (headless, CDP), 58 checks against the local server and the live GitHub Pages URL:
14 tours, 5 region chips with counts, 10 lodges, 4 cars, 8 services, 6 steps, 7 FAQs, every
image loading, 0 console errors, no "Makkah / Madinah / Umrah / Hajj / Haram" string
anywhere on the page. Region filtering, month and party-size search (including the empty
state), the Rift Valley Lakes drawer (story, access note, two gallery frames), the wizard
through to the `SKN` reference, adding a lodge and seeing it priced in the review, the
lodge drawer, and a **room-only booking** with no route attached (`$100 × 3 nights`,
Stay / Guests / Extras / Review, lodge wording on the WhatsApp handoff) were all exercised.
The Arabic switch (RTL, glyph `E`, translated headings, chips, levels and card metadata)
is covered too. Layout measured at 390 / 768 / 1440 px in both languages: no horizontal
overflow, 1 / 2 / 3 tour columns, 4 lodge columns.

Photography: 62 frames, all Wikimedia Commons, all credited on `credits.html`.

## Two desks, two marks

The visitor is asked once, on the way in, whether they are travelling inside Ethiopia or for
Umrah. The choice is stored (`sekkenah.track`), can be linked (`?track=umrah`), and can be
changed from the header. Each desk has its own mark, its own hero copy and its own routes:

| Desk | Mark | Routes |
|---|---|---|
| Ethiopia tours | `assets/img/brand-ethiopia.png`, falling back to `mark.svg` | the fourteen routes in `TOURS` |
| Umrah and Hajj | `assets/img/brand-umrah.png`, falling back to `kaaba-night.jpg` | the three in `UMRAH_TOURS` |

Both marks are the client's own artwork, cut from the two files sent over Telegram. Each one
arrived as a full lockup (emblem, wordmark, tagline and a row of service icons) on a cream
background, which is unusable at the 38px the header allots. So for each desk the emblem was
keyed off its background to transparency, cropped square around its own ink, and exported at
384px for a 128px display: no cream rectangle, no halo, and it renders on the dark hero as
well as on cream paper. The header and the chooser put it on a cream disc, because the
Ethiopia emblem is dark green and would otherwise vanish into the photograph. The original
lockups are kept in `tmp/logos-out/lockup-*.png` if the office ever needs them in print.

The Ethiopia desk keeps the lodges, cars and past-trips sections. The Umrah desk hides them
(`body[data-track='umrah']` in `site.css`), because rooms and flights carry that journey, not
a lodge on Lake Langano.

## The office: manager and staff

`admin.html` takes a user and a password, and the API returns a signed token that expires
after twelve hours.

| Role | Can do |
|---|---|
| Manager | everything: bookings, enquiries, the page editor, routes, lodges, trips, settings, history, uploads, backups, the spreadsheet |
| Staff | the desk: read bookings and enquiries, change a status, write an office note |

Deleting a booking is manager-only, because it is the one desk action the page cannot undo.
Signing in needs three secrets on the Worker, and the test suite covers the split:

```
npx wrangler secret put MANAGER_PASSWORD
npx wrangler secret put STAFF_PASSWORD
npx wrangler secret put SESSION_SECRET
```

`MANAGER_USER` and `STAFF_USER` are plain vars in `wrangler.toml`. `ADMIN_TOKEN` still works
and counts as the manager, so the seed and export scripts keep running.
