# Sekkenah office system

Scope: two desks, one office, five to eight people, Addis Ababa. WhatsApp first, 30 percent
deposit, no card payments in Ethiopia yet.

## Logins

| Login | Sees | Can change | Locked out of |
|---|---|---|---|
| Manager | everything | prices, refunds, suppliers, users, exports | nothing |
| Monitor | today, departures, suppliers, tasks, travellers, money read only | assignments, confirmations, incidents | prices, refunds, exports, users |
| Reservations | enquiries, quotes, bookings, travellers | own quotes, deposits, follow ups | cost prices, margin, payroll, exports |
| Finance | payments, invoices, suppliers, bookings | payments, payables, refunds | itineraries, catalogue, users |
| Umrah desk | pilgrims, batches, allotments, visas, rooming, manifests | pilgrim files, rooming, visa states | tours pricing, payroll |
| Guide or driver | today's manifest | checklist, incident report | rates, history, other trips |
| Accountant | reports, exports | nothing | everything else |

## Screens

### Today
Manager and monitor. Six lists, no charts.

- Departures today: reference, travellers, route, guide, vehicle, pickup, state.
- Departures tomorrow: the same, with suppliers still unconfirmed.
- Unconfirmed suppliers: component, supplier, due date, days late.
- Money due in seven days: booking, balance, method, owner.
- Documents expiring in 90 days: traveller, document, expiry.
- Open incidents: departure, severity, owner, age.

Actions: assign guide, assign vehicle, confirm supplier, open booking, log incident.
Green confirmed, amber waiting, red overdue.

### Departures
By date: date, route, seats sold, seats held, seats free, guide, vehicle, margin. Open one to
the trip file: travellers, suppliers, documents, money, tasks, notes.

### Enquiries
One queue, newest first: received, source (site, WhatsApp, phone, walk in), name, phone,
language, route, dates, party, owner, last contact, next action.
Actions: convert to quote, assign, set follow up, mark lost with a reason.
Filters: source, owner, age, desk.

### Quotes
Priced from the published catalogue, so a phone quote and a web booking cannot disagree.
Lines: route days, lodge nights, car days, guide days, permits, domestic flights, extras.
Totals: per person, children, infants, deposit at 30 percent, balance due date.
Actions: send by email or WhatsApp link, convert to booking, duplicate, expire after seven days.

### Bookings
Reference, traveller, route, departure date, party, total, paid, balance, state, owner.
States: enquiry, quoted, held, deposit paid, confirmed, travelling, completed, cancelled,
refunded.
Actions: take deposit, add payment, change dates, cancel by rule, print confirmation.

### Suppliers
One row per component to buy: booking, component, supplier, dates, pax, cost, currency, state,
confirmation reference, due date, paid.
States: to request, requested, confirmed, cancelled, invoiced, paid.
Actions: request, record confirmation, attach proof, mark paid, generate voucher.

### Payments
Date, booking, type (deposit, instalment, balance, extra, refund), amount, currency, method
(cash, bank, Telebirr, Chapa), reference, proof, recorded by.
Views: today's cash, receivables by age, payables by due date, refunds pending.

### Travellers
Name, phone, language, passport number, expiry, nationality, past trips, balance, notes.
Documents: passport, visa, insurance, with expiry warnings. Open to reservations, the Umrah
desk and the manager. Every open is logged.

### Umrah desk

- Packages: season, dates, hotels per city, room categories, flights, transport, ziyarat,
  price per category.
- Pilgrims: one file each, passport, mahram link, vaccination, contact, group.
- Batches: departure, seats contracted, seats sold, allotment per hotel with release date and
  cut off.
- Visas: batch state and per pilgrim state (submitted, approved, rejected, fixed), reason,
  fixed today flag.
- Rooming: per hotel, room type, occupants, families together, men and women by rule, one
  click export.
- Manifests: per flight and per bus, name, passport, room, contact, print or CSV.

### Tasks
Task, booking, owner, due, state, note. Views: mine, overdue, by departure. Created when a
supplier is booked, a payment falls due, or a document expires.

### Reports
Bookings by source and by route. Fill rate per departure. Margin per departure and per route.
Receivables by age. Payables due. Guide and vehicle utilisation. Umrah allotment usage, visa
states. CSV now, journal style later.

### Settings and audit
Catalogue, prices, users, roles, WhatsApp templates, cancellation rules, backup.
Audit: who, what, when, from which login. Every price change, refund, deletion and export is
written.

## Data

Entities: traveller, enquiry, quote, quote line, booking, payment, supplier, supplier booking,
voucher, task, document, departure, route, lodge, room type, allotment, vehicle, guide,
incident, user, audit entry, content version.

Rules that hold:

- A seat or a room is sold once: counter per route and date, per room type and night, holds
  expire.
- A total sent to a browser is never trusted: prices recalculate server side.
- Passports are opened by few, exported by a manager only, and the export is logged.
- Money and audit rows are never deleted.

## Numbers

| Metric | Target | Reviewed |
|---|---|---|
| Lead conversion (bookings / enquiries) | 20 to 30 percent | weekly |
| Fill rate on departures run | 80 percent plus | weekly, in season |
| Cancellation rate | under 10 percent | weekly |
| Gross margin per route | 25 to 35 percent | monthly |
| Deposits collected on confirmed bookings | above 90 percent | weekly |
| Balances unpaid inside 14 days of travel | zero | daily |
| First reply to an enquiry | under 2 working hours | daily |
| Guide and vehicle utilisation | 70 to 85 percent | weekly |
| Umrah allotment sold before release | above 85 percent | weekly, in season |
| Visa rejections | under 3 percent, fixed same day | per batch |

## Build order

Weeks 1 to 2: availability counters and holds, deposit collection through Chapa or Telebirr,
bank transfer with proof upload.

Weeks 3 to 5: supplier bookings, vouchers, trip sheets, the needs action queue, tasks, audit
log.

Weeks 6 to 9: payment ledger, receivables, payables, reminders, document expiry, margin per
departure, read only finance access.

Weeks 10 to 12: the Umrah desk, pilgrim files, allotments with release dates, rooming, visa
batches, manifests.

Then: Amharic and Afaan Oromo interface, WhatsApp templates, guide mobile view, journal
exports.

Buy rather than build the Umrah back office once groups pass a few a month, and keep this
build for the tours desk and the shared customer record.

## Sources

- CBI, tourism value chain in Ethiopia: https://www.cbi.eu/sites/default/files/vca-study-tourism-ethiopia.pdf
- Addis Fortune, operators cutting fleet and staff: https://addisfortune.news/tourism-mirage-in-a-land-of-ancient-castles
- Ethiopian Business Review, operator constraints: https://ethiopianbusinessreview.net/our-operators-the-key-to-sectors-development
- Tour operator feature sets: https://voyiso.com/features, https://www.softrip.com/resources/guides/tour-operator-management-software-features-softrip-platform, https://www.gullysystem.com/product/tour-operator-management-software, https://www.toogonet.com/features/operations
- Umrah back offices: https://umrahcore.com/features, https://tawafe.com/en, https://www.omradesk.com/en/umrah-agency-software, https://ziyara.io/guides/umrah-pre-departure-checklist, https://travelboost.app/docs/hajj
- Evaluation questions for pilgrimage systems: https://swiftitsols.com/evaluating-hajj-umrah-software
- Role models: https://help.tripworks.com/your-team/user-permissions-reference, https://journeyfuse.com/kb/agency-management/roles-permissions, https://app.tripistic.com/docs/permissions, https://support.travelport.com/webhelp/uDesktopAdmin/Content/Roles_Overview.htm
- KPI practice: https://www.tourtracker.uz/blog/tour-operator-kpis-what-to-measure, https://tmmr.ai/blog/tour-operator-kpis-and-dashboards, https://wptravel.io/travel-business-kpis, https://junglebee.com/blog/tour-operator-software-reporting-checklist
