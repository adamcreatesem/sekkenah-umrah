# Sekkenah, research behind the build

What this site says, where each kind of claim comes from, and what is deliberately a draft.
The site covers **Ethiopia only**: routes, lodges, cars and services inside the country.

---

## 1. The operator

**Name and line.** Sekkenah Tour & Travel, "Journey with trust." Jemo Michael, Megfira
(Megbira) Mall, 4th floor, Addis Ababa. Two phone lines: +251 95 960 7070 and
+251 95 960 8080. Taken from the company's own TikTok and Instagram bios.

**What is confirmed:** the office address, both phone numbers, the business name, the line
"Journey with trust.", and the fact that the office arranges travel, car, driver, guide,
flights, lodges.

**What is not:** there is no published tour inventory, no public price list and no
confirmed office email. Everything numeric on the site, route prices, lodge rates, seat
counts, next departures, is a draft figure for the design, and the footer says so.

## 2. The routes

The seventeen routes are built from places an Addis operator actually runs: the Rift Valley
lakes (Ziway, Abijatta-Shalla, Langano, Hawassa, Bishoftu), Wonchi and Arba Minch; the
historic north (Lalibela, Gondar and Lake Tana, Axum, the Simien Mountains); the south and
east (Omo valley, Harar, Sof Omar); and the wild two (Bale, Danakil).

Each route carries what a traveller asks about before price: region, days and nights,
level, the month range it is sensible in, what is included, and a written day-by-day. The
itineraries are written per route rather than generated, because a tour is not a
nights-split of two cities, the old template-generated "Makkah day 3 / Madinah day 1" is
exactly the tell this build removes.

Each route also carries a short narrative ("the story of the road"), an access note, road
or domestic flight, and roughly how long, and two gallery frames. The story is written
about the place, not about the service: what the light does, what the market is like, why
the salt caravans still cut by hand. It is the part of a tour site that a price table
cannot do.

**Seasons.** Dry season, roughly October to March, for most of the country; the Danakil
only November to February; the south and Omo from September. The month filter reads
`bestMonths` on each route, which is the honest axis for a private departure: the date is
the traveller's, the season is the country's.

## 2b. The lodges

Ten places, each with the same three layers as a route: the setting (a paragraph about the
shore, the crater rim or the forest edge), how far it is from Addis, and photographs of the
place and its surroundings. The two Kuriftu additions are 
**Kuriftu Resort & Spa Entoto** (the city resort in the Entoto eucalyptus, useful for the
first or last night) and **Kuriftu Resort & Spa Awash Falls** (on the cliff above the falls
in Awash National Park, on the road east). They join Kuriftu Bishoftu and Kuriftu Lake Tana,
which were already in the set.

Rates are per room per night and are draft figures. A room can be booked on its own, no
route attached, or added to a route and priced for its nights.

**Private departures.** Every route is sold as the traveller's own group, their car, their
guide, so the FAQ answers "do we travel with strangers?" with no. The seat count is
capacity on that date, not a shared coach.

## 3. Design decisions

- One display serif (Fraunces), one neutral sans (Instrument Sans); tracked small-caps
  labels; hairline rules instead of boxes; generous section rhythm.
- Palette taken from the highlands rather than a template: green-black, bone, brass.
- Photography is full-bleed and slowly drifting over a real landscape, not a stock
  skyline. Cards move the photograph on hover, not the card.
- Numbers as design elements: days and nights on every card, 01/02/03 on the reasons, the
  six-step path.
- Region chips carry their counts, because the first question a filter row gets is "what is
  in there".
- The header date is the **Ethiopian calendar**, computed with `Intl`, right today, in
  Arabic too, and without a lookup table.

**Bilingual specifics.** Arabic is not a translation layer bolted on:

- Logical CSS properties throughout; the drawer slides from the inline end, the modal's
  stepper and footer reverse, the arrow flips.
- A separate Arabic type stack (Reem Kufi display, IBM Plex Sans Arabic text), letterspacing
  removed, line-height raised.
- `?lang=ar` beats the stored preference, so a shared link opens in the language it was
  shared in.

**Photography.** Twenty-seven frames from Wikimedia Commons under CC BY / CC BY-SA / FAL,
cropped and split-toned (cool shadows, warm highlights) so several photographers' work
reads as one commission. Attribution is on `credits.html`, linked from the footer, as the
licences require. No stock CDN, no generated imagery, no client photo used without
permission.

## 4. Deliberate omissions

- **No fake testimonials.** No named traveller is quoted without permission.
- **No invented trust numbers** ("12,000 guests served"). The site states what can be
  checked: the office, the two lines, the languages, the routes.
- **No licence or registration number.** That line should be added once the client supplies
  it.
- **No payment step.** A card form that cannot charge is worse than a clear reservation
  request, and it would imply PCI obligations nobody has taken on.
- **No Umrah, Hajj or Saudi hotel inventory.** It belonged to the first draft of this site;
  it is not part of this product.
- **No links to the Umrah-branded social accounts.** They are real, but they sit off this
  site's subject; a tours account can be added when there is one.
