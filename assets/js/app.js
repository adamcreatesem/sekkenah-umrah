/* Sekkenah, interface behaviour. Ethiopia tours only.
 *
 * Everything renders from data.js, so a language switch is a re-render rather than a
 * patch-up of half the page. The one piece of real state is the booking draft, which is
 * kept in memory while the wizard is open and written to localStorage only once the
 * visitor confirms, a half-finished booking should not survive a reload as if it were
 * a reservation.
 */
import { BRAND, TRACKS, REGIONS, LEVELS, TOURS, STAYS, CARS, SERVICES, STEPS, FAQS, EXTRAS } from './data.js';
import { STR, MONTHS, stringFor, setOverrides } from './i18n.js';
import { FILMS, SHOTS } from './trips.js';
import { apiReady, submitBooking, submitEnquiry, availability } from './api.js';
import { loadCatalogue } from './content.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const isAr = () => state.lang === 'ar';
const t = (k) => stringFor(state.lang, k);
const tx = (o) => (o && (o[state.lang] ?? o.en)) || '';
const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
const etb = (n) => Math.round(n * BRAND.etbPerUsd).toLocaleString('en-US');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
// One id per attempt, so a retry after a dropped connection cannot book twice.
const makeRequestId = () => (crypto.randomUUID
  ? crypto.randomUUID()
  : 'r-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
const findTour = (id) => TOURS.find((x) => x.id === id);
const regionOf = (id) => REGIONS.find((r) => r.id === id);

/* Which desk the visitor walked up to. A route with no `track` is an Ethiopia route, so the
 * fourteen that were already here did not have to be touched when the second desk opened. */
const activeTrack = () => (state.track === 'umrah' ? 'umrah' : 'ethiopia');
const trackTours = () => TOURS.filter((p) => (p.track || 'ethiopia') === activeTrack());
const trackRegions = () => REGIONS.filter((r) => trackTours().some((p) => p.region === r.id));

const state = {
  lang: 'en',
  track: null,
  region: 'all',
  openTour: null,
  openStay: null,
  trip: { stays: [] },
  draft: null,
  step: 0,
  lastBooking: null,
  sending: false,
  bookingStored: false,
};

const LS = {
  lang: 'sekkenah.lang',
  bookings: 'sekkenah.bookings.v1',
  enquiry: 'sekkenah.enquiries.v1',
  track: 'sekkenah.track',
};

/* language */

function setLang(lang, { announce = true } = {}) {
  state.lang = lang === 'ar' ? 'ar' : 'en';
  const ar = state.lang === 'ar';
  document.documentElement.lang = state.lang;
  document.documentElement.dir = ar ? 'rtl' : 'ltr';
  try { localStorage.setItem(LS.lang, state.lang); } catch { /* private mode */ }

  $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  $$('[data-brand]').forEach((el) => {
    const key = el.dataset.brand;
    // The name follows the desk, everything else a brand line stays the office's own copy.
    const source = key === 'name' && state.track ? TRACKS[state.track].name : BRAND[key];
    el.textContent = key === 'address' || key === 'name' || key === 'legal' ? tx(source) : el.textContent;
  });
  // The glyph is the language the button will switch *to*, so it has to follow the
  // current language rather than sitting on the Arabic letter in both directions.
  const glyph = $('#langGlyph');
  if (glyph) glyph.textContent = ar ? 'E' : 'ع';
  document.title = t('meta.title');
  $('meta[name="description"]').setAttribute('content', t('meta.desc'));

  const status = $('#searchStatus');
  if (status) status.textContent = '';
  renderAll();
  paintCalendar();
  paintLinks();
  if (announce) $('#langBtn').setAttribute('aria-label', t('nav.langLabel'));
}

/* Places left, per route and departure. The card used to print the bus's capacity as if it
 * were a vacancy; the server now owns the number and counts every booking that is not cancelled. */
const AVAIL = new Map();
const availKey = (tourId, depart) => tourId + '|' + depart;
function availOf(tourId, depart) { return AVAIL.get(availKey(tourId, depart)) || null; }
// While the office edits a seat count, that working number beats the last server figure.
const SEAT_DRAFT = new Map();

async function loadAvailability() {
  const data = await availability().catch(() => null);
  if (!data || !Array.isArray(data.tours)) return;
  for (const a of data.tours) if (a && a.tourId) AVAIL.set(availKey(a.tourId, a.depart), a);
  refreshAvailUI();
}

function refreshAvailUI() {
  $$('[data-tour]').forEach((card) => {
    const p = findTour(card.dataset.tour);
    const draft = p ? SEAT_DRAFT.get(p.id) : null;
    const a = p && draft == null ? availOf(p.id, p.depart) : null;
    const badge = card.querySelector('.card__seats');
    if (badge && (a || draft != null)) {
      const left = draft ?? a.left;
      badge.textContent = `${left} ${t('tours.seats')}`;
      badge.classList.toggle('is-low', left <= 3);
    }
  });
  if (state.openTour && !$('#drawer').hidden) {
    const p = findTour(state.openTour);
    const draft = p ? SEAT_DRAFT.get(p.id) : null;
    const a = p && draft == null ? availOf(p.id, p.depart) : null;
    const el = $('#dSeats');
    if (el && (a || draft != null)) el.textContent = draft ?? a.left;
  }
  if ($('#wAvail')) paintWizardAvail();
}

/* catalogue */

function tourCard(p) {
  const draft = SEAT_DRAFT.get(p.id);
  const av = draft == null ? availOf(p.id, p.depart) : null;
  const left = draft ?? (av ? av.left : p.seats);
  const low = left <= 3;
  return `
  <article class="card card--tour" data-tour="${p.id}" data-region="${p.region}">
    <div class="card__media">
      <img src="${p.image}" alt="${esc(tx(p.name))}" loading="lazy" decoding="async" width="1400" height="1050">
      <span class="card__tag" data-edit="tour:${p.id}:tag">${esc(tx(p.tag))}</span>
      <span class="card__seats${low ? ' is-low' : ''}" data-edit="tour:${p.id}:seats">${left} ${t('tours.seats')}</span>
    </div>
    <div class="card__body">
      <div class="card__meta"><span>${p.days} <span data-i18n="${p.days === 1 ? 'tours.day' : 'tours.days'}">${t(p.days === 1 ? 'tours.day' : 'tours.days')}</span></span><span class="dot">·</span><span>${p.nights} <span data-i18n="${p.nights === 1 ? 'tours.night' : 'tours.nights'}">${t(p.nights === 1 ? 'tours.night' : 'tours.nights')}</span></span><span class="dot">·</span><span>${esc(tx(LEVELS[p.level]))}</span></div>
      <h3 class="card__title" data-edit="tour:${p.id}:name">${esc(tx(p.name))}</h3>
      <p class="card__blurb" data-edit="tour:${p.id}:blurb">${esc(tx(p.blurb))}</p>
      <div class="card__foot">
        <span class="price"><small data-i18n="tours.from">${t('tours.from')}</small><b data-edit="tour:${p.id}:price">${usd(p.price)}</b><small data-i18n="tours.perPerson">${t('tours.perPerson')}</small></span>
        <button class="btn btn--line btn--sm" type="button" data-open-tour="${p.id}"><span data-i18n="tours.view">${t('tours.view')}</span></button>
      </div>
      <p class="card__date"><span data-i18n="pkg.depart">${t('pkg.depart')}</span> <b data-edit="tour:${p.id}:depart">${fmtDate(p.depart)}</b> · <span data-edit="region:${p.region}:label">${esc(tx(regionOf(p.region)?.label))}</span></p>
    </div>
  </article>`;
}

function stayCard(s) {
  const added = state.trip.stays.includes(s.id);
  return `
  <article class="stay" data-stay="${s.id}">
    <button class="stay__media" type="button" data-open-stay="${s.id}" aria-label="${esc(t('stays.view'))}: ${esc(tx(s.name))}">
      <img src="${s.image}" alt="" loading="lazy" decoding="async" width="1100" height="1375">
      <span class="stay__area" data-edit="stay:${s.id}:area">${esc(tx(s.area))}</span>
    </button>
    <div class="stay__body">
      <div class="stay__stars" aria-label="${s.stars} ${t('stays.stars')}">${'★'.repeat(s.stars)}<span>${'★'.repeat(5 - s.stars)}</span></div>
      <h3 class="stay__name"><button class="stay__open" type="button" data-open-stay="${s.id}" data-edit="stay:${s.id}:name">${esc(tx(s.name))}</button></h3>
      <p class="stay__note" data-edit="stay:${s.id}:note">${esc(tx(s.note))}</p>
      <div class="stay__foot">
        <span class="price"><b data-edit="stay:${s.id}:price">${usd(s.price)}</b><small>/<span data-i18n="stays.night">${t('stays.night')}</span></small></span>
        <button class="btn btn--line btn--sm${added ? ' is-added' : ''}" type="button" data-add-stay="${s.id}">
          <span data-i18n="${added ? 'stays.added' : 'stays.add'}">${added ? t('stays.added') : t('stays.add')}</span>
        </button>
      </div>
    </div>
  </article>`;
}

function carCard(c) {
  return `
  <article class="service">
    <span class="service__icon">${ICONS[c.icon] || ICONS.car}</span>
    <h3 class="h3" data-edit="car:${c.id}:title">${esc(tx(c.title))}</h3>
    <p data-edit="car:${c.id}:body">${esc(tx(c.body))}</p>
    <div class="service__foot">
      <span class="service__price"><b data-edit="car:${c.id}:price">${usd(c.price)}</b><small data-edit="car:${c.id}:unit">${esc(tx(c.unit))}</small></span>
      <button class="btn btn--line btn--sm" type="button" data-book-car="${c.id}"><span data-i18n="cars.reserve">${t('cars.reserve')}</span></button>
    </div>
  </article>`;
}

function serviceCard(s) {
  return `
  <article class="service">
    <span class="service__icon">${ICONS[s.icon] || ICONS.route}</span>
    <h3 class="h3" data-edit="service:${s.id}:title">${esc(tx(s.title))}</h3>
    <p data-edit="service:${s.id}:body">${esc(tx(s.body))}</p>
  </article>`;
}

const ICONS = {
  route: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6h5a4 4 0 0 1 0 8h-3a4 4 0 0 0 0 8h5"/></svg>',
  plane: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13.5 21 4l-4.5 17-3.5-6.5L3 13.5Z"/><path d="M13 14.5 21 4"/></svg>',
  bed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18v-7h18v7M3 18h18M6 11V7h5v4"/><path d="M15 11V8h3a2 2 0 0 1 2 2v1"/></svg>',
  car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16h16M5 16v2M19 16v2"/><path d="M4.5 16l1.6-5.2A2 2 0 0 1 8 9.3h8a2 2 0 0 1 1.9 1.5L19.5 16"/><circle cx="7.5" cy="16" r="1.4"/><circle cx="16.5" cy="16" r="1.4"/></svg>',
  users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3 3 0 0 1 0 5.6M17.5 19a5.4 5.4 0 0 0-1.2-3.4"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5.5c0 4.5-3 7.6-7 9.5-4-1.9-7-5-7-9.5V6l7-3Z"/><path d="M9 12l2.2 2.2L15.5 10"/></svg>',
  flag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V4"/><path d="M6 5h10l-2 3.5L16 12H6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/></svg>',
};

function renderFilters() {
  const row = $('#tourFilters');
  if (!row) return;
  // The count sits in the chip because the first question a filter row gets is "what is
  // in there", five routes or two changes whether the click is worth it.
  const chips = [{ id: 'all', label: { en: t('filters.all'), ar: t('filters.all') }, n: trackTours().length }, ...trackRegions()];
  row.innerHTML = chips.map((r) => {
    const n = r.n ?? trackTours().filter((p) => p.region === r.id).length;
    const label = r.id === 'all'
      ? `<span data-i18n="filters.all">${esc(tx(r.label))}</span>`
      : `<span data-edit="region:${r.id}:label">${esc(tx(r.label))}</span>`;
    return `
    <button class="chip${state.region === r.id ? ' is-on' : ''}" type="button"
      aria-pressed="${state.region === r.id}" data-region="${r.id}">${label}<span class="chip__n">${n}</span></button>`;
  }).join('');
}

function renderTours() {
  const grid = $('#tourGrid');
  if (!grid) return;
  const all = trackTours();
  const list = state.region === 'all' ? all : all.filter((p) => p.region === state.region);
  grid.innerHTML = list.map(tourCard).join('');
  $('#tourEmpty').hidden = list.length > 0;
  observe(grid);
}

function renderStays() {
  const grid = $('#stayGrid');
  if (!grid) return;
  grid.innerHTML = STAYS.map(stayCard).join('');
  observe(grid);
}

function renderCars() {
  const grid = $('#carGrid');
  if (!grid) return;
  grid.innerHTML = CARS.map(carCard).join('');
}

function renderSteps() {
  $('#pathSteps').innerHTML = STEPS.map((s, i) => `
    <li class="pstep">
      <span class="pstep__n">${String(i + 1).padStart(2, '0')}</span>
      <h3 class="h3" data-edit="step:${i}:title">${esc(tx(s.title))}</h3>
      <p data-edit="step:${i}:body">${esc(tx(s.body))}</p>
    </li>`).join('');
}

function renderServices() {
  $('#serviceGrid').innerHTML = SERVICES.map(serviceCard).join('');
}

function renderFaq() {
  $('#faqList').innerHTML = FAQS.map((f, i) => `
    <details class="qa"${i === 0 ? ' open' : ''}>
      <summary><span data-edit="faq:${i}:q">${esc(tx(f.q))}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></summary>
      <div class="qa__body"><p data-edit="faq:${i}:a">${esc(tx(f.a))}</p></div>
    </details>`).join('');
}

function renderMonths() {
  const months = new Set(trackTours().flatMap((p) => p.bestMonths));
  const sel = $('#fMonth');
  if (!sel) return;
  const keep = sel.value;
  sel.innerHTML = `<option value="">${t('search.anyMonth')}</option>` +
    [...months].sort((a, b) => a - b).map((m) => `<option value="${m}">${MONTHS[state.lang][m - 1]}</option>`).join('');
  sel.value = keep;
}

function renderRegions() {
  const sel = $('#fRegion');
  if (!sel) return;
  const keep = sel.value;
  sel.innerHTML = `<option value="">${t('search.anyRegion')}</option>` +
    trackRegions().map((r) => `<option value="${r.id}">${esc(tx(r.label))}</option>`).join('');
  sel.value = keep || state.region;
  if (!sel.value) sel.value = '';
}

function renderAll() {
  renderFilters();
  renderTours();
  renderStays();
  renderCars();
  renderSteps();
  renderServices();
  renderFaq();
  renderTrips();
  renderMonths();
  renderRegions();
  $('#year').textContent = new Date().getFullYear();
  if (state.openTour) openTourDrawer(state.openTour, { keepFocus: true });
  if (state.openStay) openStayDrawer(state.openStay, { keepFocus: true });
  if (!$('#modal').hidden) renderStep();
}

/* dates */

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  const opts = { day: 'numeric', month: 'short', year: 'numeric' };
  try { return d.toLocaleDateString(isAr() ? 'ar-ET' : 'en-GB', opts); }
  catch { return d.toDateString(); }
}

/* The Ethiopian calendar is the one the country actually keeps; Intl computes it, so it
 * is right today and in ten years without a lookup table. The era suffix is dropped
 * because the label already says which calendar this is. A small arithmetic fallback
 * keeps the date visible in browsers built without the ethiopic calendar. */
const ETH_MONTHS = {
  en: ['Meskerem', 'Tekemt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit', 'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'],
  ar: ['مسكرام', 'تكيمت', 'هدار', 'تهاسا', 'تر', 'يكاتيت', 'ميغابيت', 'ميازيا', 'غينبوت', 'سني', 'هاملي', 'نهاسي', 'باغومي'],
};

function ethiopianDate(date = new Date()) {
  const jdn = (() => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const a = Math.floor((14 - m) / 12);
    const yy = y + 4800 - a;
    const mm = m + 12 * a - 3;
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  })();
  const offset = 1723856;
  const r = (jdn - offset) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  return {
    year: 4 * Math.floor((jdn - offset) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460),
    month: Math.floor(n / 30) + 1,
    day: (n % 30) + 1,
  };
}

function fmtEthiopian(date = new Date()) {
  try {
    const out = new Intl.DateTimeFormat(isAr() ? 'ar-ET-u-ca-ethiopic' : 'en-GB-u-ca-ethiopic',
      { day: 'numeric', month: 'long', year: 'numeric' }).format(date).replace(/\s*(AM|هـ)$/, '');
    if (out) return out;
  } catch { /* use the arithmetic fallback */ }
  const e = ethiopianDate(date);
  return `${e.day} ${ETH_MONTHS[isAr() ? 'ar' : 'en'][e.month - 1]} ${e.year}`;
}

function paintCalendar() {
  const now = new Date();
  const d = fmtEthiopian(now);
  for (const id of ['calDate', 'calHero']) {
    const el = $('#' + id);
    if (el) el.textContent = d;
  }
}

let calendarClock;
function startCalendarClock() {
  clearInterval(calendarClock);
  // Re-read the clock every minute so a page left open past midnight moves to the new day.
  calendarClock = setInterval(paintCalendar, 60000);
}

/* links */

const waHref = (text) => `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;

function paintPhones() {
  $$('[data-edit-phone]').forEach((a) => {
    const tel = (BRAND.phones || [])[Number(a.dataset.editPhone)];
    if (!tel) return;
    a.textContent = tel;
    if (a.tagName === 'A') a.href = 'tel:' + tel.replace(/[^\d+]/g, '');
  });
}

function paintLinks() {
  paintPhones();
  $('#heroWa').href = waHref(isAr()
    ? 'السلام عليكم، أرغب في الاستفسار عن جولات في إثيوبيا.'
    : 'Hello, I would like to ask about your tours in Ethiopia.');
  $('#waBtn').href = waHref(isAr()
    ? 'السلام عليكم، لدي استفسار عن جولة في إثيوبيا.'
    : 'Hello, I have an enquiry about a tour in Ethiopia.');
  $('#mapBtn').href = `https://www.google.com/maps/search/?api=1&query=${BRAND.mapQuery}`;
}

/* reveal */

let io;
function observe(root = document) {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach((el) => el.classList.add('in')); return; }
  io = io || new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  $$('.reveal:not(.in)', root).forEach((el) => io.observe(el));
}

/* drawer */

let lastFocus = null;

function openTourDrawer(id, { keepFocus = false } = {}) {
  const p = findTour(id);
  if (!p) return;
  if (!keepFocus) lastFocus = document.activeElement;
  state.openTour = id;

  const region = regionOf(p.region);
  $('#drawerKicker').textContent = `${tx(region?.label)} · ${tx(LEVELS[p.level])}`;

  $('#drawerBody').innerHTML = `
    <figure class="drawer__fig"><img src="${p.image}" alt="${esc(tx(p.name))}" width="1400" height="1050"></figure>
    <h2 class="drawer__title" id="drawerTitle">${esc(tx(p.name))}</h2>
    <div class="drawer__stats">
      <div class="dstat"><b>${p.days} / ${p.nights}</b><span>${t('tours.days')} / ${p.nights === 1 ? t('tours.night') : t('tours.nights')}</span></div>
      <div class="dstat"><b>${usd(p.price)}</b><span>${t('tours.perPerson')}</span></div>
      <div class="dstat"><b id="dSeats">${(availOf(p.id, p.depart) || {}).left ?? p.seats}</b><span>${t('tours.seats')}</span></div>
      <div class="dstat"><b>${esc(tx(LEVELS[p.level]))}</b><span>${t('tours.level')}</span></div>
    </div>
    <p class="drawer__blurb">${esc(tx(p.blurb))}</p>

    <h3 class="drawer__h">${t('tours.story')}</h3>
    ${paragraphs(p.story)}

    <h3 class="drawer__h">${t('pkg.included')}</h3>
    <ul class="ticks">${p.includes.map((i) => `<li>${esc(tx(i))}</li>`).join('')}</ul>

    <h3 class="drawer__h">${t('pkg.itinerary')}</h3>
    <ol class="itin">${p.daysList.map((d, i) => `
      <li><span class="itin__d">${t('pkg.day')} ${i + 1}</span><b>${esc(tx(d.t))}</b><span>${esc(tx(d.b))}</span></li>`).join('')}</ol>

    <dl class="drawer__facts">
      <div><dt>${t('pkg.depart')}</dt><dd>${fmtDate(p.depart)}</dd></div>
      <div><dt>${t('tours.best')}</dt><dd>${bestMonths(p)}</dd></div>
      <div><dt>${t('search.region')}</dt><dd>${esc(tx(region?.label))}</dd></div>
      <div><dt>${t('tours.getting')}</dt><dd>${esc(tx(p.getting))}</dd></div>
    </dl>

    ${galleryBlock(p.gallery)}
    <p class="drawer__note">${t('pkg.private')} · ${t('pkg.priceNote')}</p>
    <button class="btn btn--solid drawer__cta" type="button" data-book-from="${p.id}">${t('pkg.choose')}</button>
  `;

  $('#drawer').hidden = false;
  $('#scrim').hidden = false;
  document.body.classList.add('is-locked');
  requestAnimationFrame(() => $('#drawer').classList.add('is-on'));
  $('#drawer .x').focus();
}

/* A lodge gets the same treatment as a route: a story, the place it sits in, what is
 * around it, and its own way into the booking flow. */
function openStayDrawer(id, { keepFocus = false } = {}) {
  const s = STAYS.find((x) => x.id === id);
  if (!s) return;
  if (!keepFocus) lastFocus = document.activeElement;
  state.openStay = id;
  state.openTour = null;
  const added = state.trip.stays.includes(s.id);

  $('#drawerKicker').textContent = `${t('stays.kicker')} · ${esc(tx(s.area))}`;
  $('#drawerBody').innerHTML = `
    <figure class="drawer__fig"><img src="${s.image}" alt="${esc(tx(s.name))}" width="1100" height="1375"></figure>
    <h2 class="drawer__title" id="drawerTitle">${esc(tx(s.name))}</h2>
    <div class="drawer__stats">
      <div class="dstat"><b>${'★'.repeat(s.stars)}</b><span>${t('stays.stars')}</span></div>
      <div class="dstat"><b>${usd(s.price)}</b><span>${t('stays.rate')}</span></div>
      <div class="dstat"><b>${esc(tx(s.area))}</b><span>${t('stays.place')}</span></div>
    </div>
    <p class="drawer__blurb">${esc(tx(s.note))}</p>

    <h3 class="drawer__h">${t('stays.place')}</h3>
    ${paragraphs(s.story)}

    <dl class="drawer__facts">
      <div><dt>${t('stays.near')}</dt><dd>${esc(tx(s.near))}</dd></div>
      <div><dt>${t('stays.rate')}</dt><dd>${usd(s.price)}</dd></div>
    </dl>

    ${galleryBlock(s.gallery)}

    <div class="drawer__actions">
      <button class="btn btn--solid drawer__cta" type="button" data-book-stay="${s.id}">${t('stays.book')}</button>
      <button class="btn btn--line drawer__cta${added ? ' is-added' : ''}" type="button" data-add-stay="${s.id}">
        ${added ? t('stays.added') : t('stays.add')}
      </button>
    </div>
    <p class="drawer__note">${t('stays.note')}</p>
  `;

  $('#drawer').hidden = false;
  $('#scrim').hidden = false;
  document.body.classList.add('is-locked');
  requestAnimationFrame(() => $('#drawer').classList.add('is-on'));
  $('#drawer .x').focus();
}

/* Long copy is written as one paragraph per thought and split here, so the data stays a
 * single string per language instead of an array that has to be kept in step. */
function paragraphs(text) {
  return String(tx(text)).split(/\n\n+/).map((p) => `<p class="drawer__p">${esc(p)}</p>`).join('');
}

function galleryBlock(images) {
  if (!images || !images.length) return '';
  return `<div class="gal">
    ${images.map((src) => `<figure class="gal__fig"><img src="${src}" alt="" loading="lazy" width="1200" height="800"></figure>`).join('')}
  </div>`;
}

/* past trips */

/* Three films in phone frames. preload="none" means the page shows a poster and never
 * fetches a 10 MB video on its own; the file is asked for when the visitor presses play,
 * which is also the gesture that lets the browser start it with sound. */
function filmCard(f, i) {
  return `<figure class="film">
    <div class="film__frame">
      <video class="film__v" src="${f.src}" poster="${f.poster}" preload="none" playsinline></video>
      <button class="film__play" type="button" data-play="${i}" aria-label="${esc(t('trips.play'))}: ${esc(tx(f.name))}">
        <span class="film__tri" aria-hidden="true"></span>
      </button>
      <span class="film__len" data-edit="film:${i}:len">${f.len}</span>
    </div>
    <figcaption class="film__cap">
      <b data-edit="film:${i}:name">${esc(tx(f.name))}</b>
      <span data-edit="film:${i}:note">${esc(tx(f.note))}</span>
    </figcaption>
  </figure>`;
}

function renderTrips() {
  const row = $('#filmRow');
  if (!row) return;
  row.innerHTML = FILMS.map(filmCard).join('');
  $('#tripGrid').innerHTML = SHOTS.map((s, i) => `
    <button class="shot" type="button" data-shot="${i}">
      <img src="${s.src}" alt="${esc(tx(s.cap))}" loading="lazy" decoding="async" width="1080" height="1350">
      <span class="shot__cap" data-edit="shot:${i}:cap">${esc(tx(s.cap))}</span>
    </button>`).join('');
}

let shotAt = 0;
let shotReturn = null;

function paintShot(i) {
  if (!SHOTS.length) return;
  shotAt = (i + SHOTS.length) % SHOTS.length;
  const s = SHOTS[shotAt];
  const img = $('#lbImg');
  img.src = s.big;
  img.alt = tx(s.cap);
  $('#lbCap').textContent = tx(s.cap);
}

function openShot(i) {
  shotReturn = document.activeElement;
  paintShot(i);
  const lb = $('#lightbox');
  lb.hidden = false;
  document.body.classList.add('is-locked');
  requestAnimationFrame(() => lb.classList.add('is-on'));
  $('.lightbox__x').focus();
}

function closeShot() {
  const lb = $('#lightbox');
  if (lb.hidden) return;
  lb.classList.remove('is-on');
  document.body.classList.remove('is-locked');
  setTimeout(() => { lb.hidden = true; }, 220);
  if (shotReturn && shotReturn.focus) shotReturn.focus();
}

/* Best months read as a range when the route runs straight through the calendar, and
 * most Ethiopian seasons do, across the year boundary: October to March is one run, not
 * two. A single gap in the ring is a range; more than one is a list. */
function bestMonths(p) {
  const N = MONTHS[state.lang];
  const ms = [...new Set(p.bestMonths)].sort((a, b) => a - b);
  const gaps = ms.map((m, i) => ({ i, d: (ms[(i + 1) % ms.length] - m + 12) % 12 }));
  const breaks = gaps.filter((g) => g.d > 1);
  if (ms.length > 2 && breaks.length === 1) {
    const start = ms[(breaks[0].i + 1) % ms.length];
    const end = ms[breaks[0].i];
    return `${N[start - 1]} to ${N[end - 1]}`;
  }
  return ms.map((m) => N[m - 1]).join(', ');
}

function closeDrawer() {
  const d = $('#drawer');
  if (d.hidden) return;
  d.classList.remove('is-on');
  $('#scrim').hidden = true;
  document.body.classList.remove('is-locked');
  state.openTour = null;
  state.openStay = null;
  setTimeout(() => { d.hidden = true; }, 260);
  if (lastFocus) lastFocus.focus();
}

/* pricing */

const STAY_EXTRAS = ['transfer', 'insurance'];
const isoIn = (days) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
};

function quote(d = state.draft) {
  if (!d) return { base: 0, extras: 0, stays: 0, total: 0, deposit: 0, balance: 0 };
  if (d.mode === 'stay') {
    const s = STAYS.find((x) => x.id === d.stayId);
    const base = s ? s.price * Math.max(d.nights, 1) * Math.max(d.rooms, 1) : 0;
    const paying = d.adults + d.children;
    const extras = EXTRAS.filter((e) => d.extras.includes(e.id) && STAY_EXTRAS.includes(e.id))
      .reduce((n, e) => n + e.price * (e.unit === 'person' ? paying : 1), 0);
    const total = base + extras;
    return { base, extras, stays: 0, total, deposit: total * 0.3, balance: total * 0.7 };
  }
  const p = findTour(d.packageId);
  const nights = p ? Math.max(p.nights, 1) : 0;
  const paying = d.adults + d.children;
  const pax = d.adults + d.children * 0.6 + d.infants * 0.1;
  const base = p ? p.price * pax : 0;
  const extras = EXTRAS.filter((e) => d.extras.includes(e.id))
    .reduce((n, e) => n + e.price * (e.unit === 'person' ? paying : 1), 0);
  const stays = state.trip.stays
    .map((id) => STAYS.find((s) => s.id === id))
    .filter(Boolean)
    .reduce((n, s) => n + s.price * nights * Math.max(d.rooms, 1), 0);
  const total = base + extras + stays;
  return { base, extras, stays, total, deposit: total * 0.3, balance: total * 0.7 };
}

function priceLine() {
  const q = quote();
  return q.total ? `<b>${usd(q.total)}</b><small>${t('book.total')}</small>` : '';
}

/* wizard */

function openBooking(packageId = null, { mode = 'tour', stayId = null } = {}) {
  lastFocus = document.activeElement;
  state.step = 0;
  state.lastBooking = null;
  $('#btnNext').dataset.action = '';
  $('#btnBack').dataset.action = '';
  $('#btnBack').hidden = false;
  $('#btnBack').textContent = t('book.back');
  state.draft = mode === 'stay'
    ? {
      mode: 'stay',
      stayId: stayId || STAYS[0].id,
      checkIn: isoIn(14),
      nights: 2, rooms: 1,
      adults: 2, children: 0, infants: 0,
      travellers: [], extras: [], notes: '', packageId: null, depart: null,
    }
    : {
      mode: 'tour',
      packageId: packageId || TOURS[0].id,
      depart: packageId ? (findTour(packageId) || {}).depart : TOURS[0].depart,
      adults: 2, children: 0, infants: 0, rooms: 1,
      travellers: [], extras: [], notes: '', stayId: null, checkIn: null, nights: null,
    };
  state.draft.requestId = makeRequestId();
  $('#modal').hidden = false;
  document.body.classList.add('is-locked');
  requestAnimationFrame(() => $('#modal').classList.add('is-on'));
  renderStep();
  $('#btnNext').focus();
}

function closeBooking() {
  const m = $('#modal');
  if (m.hidden) return;
  m.classList.remove('is-on');
  document.body.classList.remove('is-locked');
  state.draft = null;
  setTimeout(() => { m.hidden = true; }, 260);
  if (lastFocus) lastFocus.focus();
}

function stepKeys() {
  return state.draft && state.draft.mode === 'stay'
    ? ['book.step1Stay', 'book.step2Stay', 'book.step3', 'book.step4']
    : ['book.step1', 'book.step2', 'book.step3', 'book.step4'];
}

function renderTrack() {
  $('#stepper').innerHTML = stepKeys().map((k, i) => `
    <li class="track${i === state.step ? ' is-on' : ''}${i < state.step ? ' is-done' : ''}">
      <span class="track__n">${i < state.step ? '✓' : i + 1}</span>
      <span class="track__l">${t(k)}</span>
    </li>`).join('');
}

function renderStep() {
  const d = state.draft;
  if (!d) return;
  renderTrack();
  const body = $('#modalBody');
  const foot = $('#btnBack');

  if (state.lastBooking && state.step === 3) { renderTicket(); return; }
  if (d.mode === 'stay') { renderStayStep(); return; }

  if (state.step === 0) {
    body.innerHTML = `
      <div class="form">
        <label class="field"><span>${t('book.route')}</span>
          <select id="wPkg">
            ${TOURS.map((p) => `<option value="${p.id}"${p.id === d.packageId ? ' selected' : ''}>${esc(tx(p.name))}, ${usd(p.price)}</option>`).join('')}
          </select>
        </label>
        <label class="field"><span>${t('book.depart')}</span>
          <input id="wDepart" type="date" value="${d.depart}" min="${isoIn(0)}">
        </label>
        <p class="form__note" id="wAvail" aria-live="polite"></p>
        <div class="row">
          ${numField('adults', t('book.adults'), d.adults, 1, 20)}
          ${numField('children', t('book.children'), d.children, 0, 12)}
          ${numField('infants', t('book.infants'), d.infants, 0, 6)}
          ${numField('rooms', t('book.rooms'), d.rooms, 1, 8)}
        </div>
        <p class="form__note">${t('pkg.priceNote')}</p>
      </div>`;
    $('#btnNext').textContent = t('book.next');
    foot.hidden = true;
    $('#liveTotal').innerHTML = priceLine();
    paintWizardAvail();
    return;
  }

  if (state.step === 1) {
    const pax = d.adults + d.children + d.infants;
    while (d.travellers.length < pax) d.travellers.push({ name: '', passport: '', phone: '', email: '' });
    d.travellers.length = pax;
    body.innerHTML = `
      <div class="travellers">
        ${d.travellers.map((tr, i) => `
          <fieldset class="traveller">
            <legend>${t('book.traveller')} ${i + 1}</legend>
            <label class="field"><span>${t('book.fullName')} *</span><input data-tr="${i}" data-k="name" value="${esc(tr.name)}" autocomplete="name" required></label>
            <div class="row">
              <label class="field"><span>${t('book.passport')} *</span><input data-tr="${i}" data-k="passport" value="${esc(tr.passport)}" dir="ltr" required></label>
              <label class="field"><span>${t('book.phone')}${i === 0 ? ' *' : ''}</span><input data-tr="${i}" data-k="phone" value="${esc(tr.phone)}" type="tel" dir="ltr"${i === 0 ? ' required' : ''}></label>
            </div>
            <label class="field"><span>${t('book.email')}</span><input data-tr="${i}" data-k="email" value="${esc(tr.email)}" type="email" dir="ltr"></label>
          </fieldset>`).join('')}
        <label class="field"><span>${t('book.notes')}</span><textarea id="wNotes" rows="2">${esc(d.notes)}</textarea></label>
      </div>`;
    $('#btnNext').textContent = t('book.next');
    foot.hidden = false;
    $('#liveTotal').innerHTML = priceLine();
    return;
  }

  if (state.step === 2) {
    const paying = d.adults + d.children;
    body.innerHTML = `
      <div class="form">
        <div class="extras">
          ${EXTRAS.map((e) => `
            <label class="check">
              <input type="checkbox" data-extra="${e.id}"${d.extras.includes(e.id) ? ' checked' : ''}>
              <span class="check__box" aria-hidden="true"></span>
              <span class="check__t">${esc(tx(e.name))}</span>
              <span class="check__p">${usd(e.price)}${e.unit === 'person' ? ` × ${paying}` : ''}</span>
            </label>`).join('')}
        </div>
        ${state.trip.stays.length ? `<h3 class="drawer__h">${t('stays.title')}</h3>
        <ul class="ticks">${state.trip.stays.map((id) => {
          const s = STAYS.find((x) => x.id === id);
          return s ? `<li>${esc(tx(s.name))}, ${usd(s.price)}/${t('stays.night')}</li>` : '';
        }).join('')}</ul>` : ''}
      </div>`;
    $('#btnNext').textContent = t('book.next');
    foot.hidden = false;
    return;
  }

  if (state.step === 3) {
    const p = findTour(d.packageId);
    const q = quote();
    body.innerHTML = `
      <div class="review">
        <div class="review__rows">
          <div><span>${t('book.package')}</span><b>${esc(tx(p.name))}</b></div>
          <div><span>${t('book.depart')}</span><b>${fmtDate(d.depart)}</b></div>
          <div><span>${t('book.adults')}</span><b>${d.adults}</b></div>
          ${d.children ? `<div><span>${t('book.children')}</span><b>${d.children}</b></div>` : ''}
          ${d.infants ? `<div><span>${t('book.infants')}</span><b>${d.infants}</b></div>` : ''}
          <div><span>${t('book.rooms')}</span><b>${d.rooms}</b></div>
          ${state.trip.stays.length ? `<div><span>${t('stays.title')}</span><b>${state.trip.stays.map((id) => esc(tx((STAYS.find((s) => s.id === id) || {}).name))).join(', ')}</b></div>` : ''}
          ${d.travellers.filter((x) => x.name).map((x, i) => `<div><span>${t('book.traveller')} ${i + 1}</span><b>${esc(x.name)}</b></div>`).join('')}
        </div>
        <div class="totals">
          <div><span>${t('book.subtotal')}</span><b>${usd(q.base)}</b></div>
          ${q.extras ? `<div><span>${t('book.extras')}</span><b>${usd(q.extras)}</b></div>` : ''}
          ${q.stays ? `<div><span>${t('stays.title')}</span><b>${usd(q.stays)}</b></div>` : ''}
          <div class="totals__sum"><span>${t('book.total')}</span><b>${usd(q.total)}</b></div>
          <div class="totals__small"><span>${t('book.etb')}</span><b>ETB ${etb(q.total)}</b></div>
          <div class="totals__dep"><span>${t('book.deposit')}</span><b>${usd(q.deposit)}</b></div>
          <div class="totals__small"><span>${t('book.balance')}</span><b>${usd(q.balance)}</b></div>
        </div>
        <p class="form__note">${t('book.summaryNote')}</p>
        <p class="form__note form__legal">${t('book.consentLead')} <a href="privacy.html" target="_blank" rel="noopener">${t('book.consentLink')}</a>.</p>
      </div>`;
    $('#btnNext').textContent = t('book.confirm');
    foot.hidden = false;
    $('#liveTotal').innerHTML = priceLine();
  }
}

/* Room-only booking: a lodge, a check-in date, nights and rooms, priced per room per
 * night. Same four steps and the same reference number as a route, because the office
 * should not have to learn a second flow to sell a bed. */
function renderStayStep() {
  const d = state.draft;
  const s = STAYS.find((x) => x.id === d.stayId) || STAYS[0];
  const body = $('#modalBody');
  const foot = $('#btnBack');

  if (state.step === 0) {
    body.innerHTML = `
      <div class="form">
        <label class="field"><span>${t('book.lodge')}</span>
          <select id="wStay">
            ${STAYS.map((x) => `<option value="${x.id}"${x.id === d.stayId ? ' selected' : ''}>${esc(tx(x.name))}, ${usd(x.price)}</option>`).join('')}
          </select>
        </label>
        <div class="row">
          <label class="field"><span>${t('book.checkIn')}</span>
            <input id="wCheckIn" type="date" value="${d.checkIn}" min="${isoIn(0)}">
          </label>
          ${numField('nights', t('book.nights'), d.nights, 1, 14)}
          ${numField('rooms', t('book.rooms'), d.rooms, 1, 8)}
        </div>
        <div class="row">
          ${numField('adults', t('book.adults'), d.adults, 1, 12)}
          ${numField('children', t('book.children'), d.children, 0, 8)}
          ${numField('infants', t('book.infants'), d.infants, 0, 4)}
        </div>
        <p class="form__note">${usd(s.price)} ${t('stays.rate')} · ${t('book.stayNote')}</p>
      </div>`;
    $('#btnNext').textContent = t('book.next');
    foot.hidden = true;
    $('#liveTotal').innerHTML = priceLine();
    return;
  }

  if (state.step === 1) {
    const pax = d.adults + d.children + d.infants;
    while (d.travellers.length < pax) d.travellers.push({ name: '', phone: '', email: '' });
    d.travellers.length = pax;
    body.innerHTML = `
      <div class="travellers">
        ${d.travellers.map((tr, i) => `
          <fieldset class="traveller">
            <legend>${t('book.traveller')} ${i + 1}</legend>
            <label class="field"><span>${t('book.fullName')} *</span><input data-tr="${i}" data-k="name" value="${esc(tr.name)}" autocomplete="name" required></label>
            <div class="row">
              <label class="field"><span>${t('book.phone')}${i === 0 ? ' *' : ''}</span><input data-tr="${i}" data-k="phone" value="${esc(tr.phone)}" type="tel" dir="ltr"${i === 0 ? ' required' : ''}></label>
              <label class="field"><span>${t('book.email')}</span><input data-tr="${i}" data-k="email" value="${esc(tr.email)}" type="email" dir="ltr"></label>
            </div>
          </fieldset>`).join('')}
        <label class="field"><span>${t('book.notes')}</span><textarea id="wNotes" rows="2">${esc(d.notes)}</textarea></label>
      </div>`;
    $('#btnNext').textContent = t('book.next');
    foot.hidden = false;
    $('#liveTotal').innerHTML = priceLine();
    return;
  }

  if (state.step === 2) {
    const paying = d.adults + d.children;
    body.innerHTML = `
      <div class="form">
        <div class="extras">
          ${EXTRAS.filter((e) => STAY_EXTRAS.includes(e.id)).map((e) => `
            <label class="check">
              <input type="checkbox" data-extra="${e.id}"${d.extras.includes(e.id) ? ' checked' : ''}>
              <span class="check__box" aria-hidden="true"></span>
              <span class="check__t">${esc(tx(e.name))}</span>
              <span class="check__p">${usd(e.price)}${e.unit === 'person' ? ` × ${paying}` : ''}</span>
            </label>`).join('')}
        </div>
      </div>`;
    $('#btnNext').textContent = t('book.next');
    foot.hidden = false;
    return;
  }

  if (state.step === 3) {
    const q = quote();
    body.innerHTML = `
      <div class="review">
        <div class="review__rows">
          <div><span>${t('book.lodge')}</span><b>${esc(tx(s.name))}</b></div>
          <div><span>${t('book.checkIn')}</span><b>${fmtDate(d.checkIn)}</b></div>
          <div><span>${t('book.nights')}</span><b>${d.nights}</b></div>
          <div><span>${t('book.rooms')}</span><b>${d.rooms}</b></div>
          <div><span>${t('book.adults')}</span><b>${d.adults}${d.children ? ` + ${d.children}` : ''}${d.infants ? ` + ${d.infants}` : ''}</b></div>
          ${d.travellers.filter((x) => x.name).map((x, i) => `<div><span>${t('book.traveller')} ${i + 1}</span><b>${esc(x.name)}</b></div>`).join('')}
        </div>
        <div class="totals">
          <div><span>${usd(s.price)} × ${d.nights} ${t('tours.night')} × ${d.rooms}</span><b>${usd(q.base)}</b></div>
          ${q.extras ? `<div><span>${t('book.extras')}</span><b>${usd(q.extras)}</b></div>` : ''}
          <div class="totals__sum"><span>${t('book.total')}</span><b>${usd(q.total)}</b></div>
          <div class="totals__small"><span>${t('book.etb')}</span><b>ETB ${etb(q.total)}</b></div>
          <div class="totals__dep"><span>${t('book.deposit')}</span><b>${usd(q.deposit)}</b></div>
          <div class="totals__small"><span>${t('book.balance')}</span><b>${usd(q.balance)}</b></div>
        </div>
        <p class="form__note">${t('book.summaryNote')}</p>
        <p class="form__note form__legal">${t('book.consentLead')} <a href="privacy.html" target="_blank" rel="noopener">${t('book.consentLink')}</a>.</p>
      </div>`;
    $('#btnNext').textContent = t('book.confirm');
    foot.hidden = false;
    $('#liveTotal').innerHTML = priceLine();
  }
}

function collectStayDates() {
  const d = state.draft;
  d.stayId = $('#wStay').value;
  d.checkIn = $('#wCheckIn').value;
  d.nights = clamp(parseInt($('#w-nights').value, 10) || 1, 1, 14);
  d.rooms = clamp(parseInt($('#w-rooms').value, 10) || 1, 1, 8);
  d.adults = clamp(parseInt($('#w-adults').value, 10) || 1, 1, 12);
  d.children = clamp(parseInt($('#w-children').value, 10) || 0, 0, 8);
  d.infants = clamp(parseInt($('#w-infants').value, 10) || 0, 0, 4);
}

/* An Arabic keyboard types ٠٩١١... unless the field forces a Latin keypad, and the server
 * stores Western digits. Count real digits either way, so the form does not reject a number
 * the office would be happy to ring. */
const WESTERN = (v) => String(v == null ? '' : v)
  .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
  .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06F0));

function phoneOk(value) {
  return (WESTERN(value).match(/[0-9]/g) || []).length >= 7;
}

function validateStayGuests() {
  let bad = null;
  $$('[data-tr]').forEach((el) => {
    const leadPhone = el.dataset.tr === '0' && el.dataset.k === 'phone';
    if (!leadPhone && el.dataset.k !== 'name') return;
    const empty = leadPhone ? !phoneOk(el.value) : !el.value.trim();
    el.classList.toggle('is-bad', empty);
    if (empty && !bad) bad = el;
  });
  if (bad) { bad.focus(); toast(t('book.required')); }
  return !bad;
}

function numField(id, label, val, min, max) {
  return `<label class="field field--num"><span>${label}</span>
    <span class="stepper">
      <button type="button" data-nudge="${id}" data-dir="-1" aria-label="−">−</button>
      <input id="w-${id}" type="number" value="${val}" min="${min}" max="${max}" inputmode="numeric">
      <button type="button" data-nudge="${id}" data-dir="1" aria-label="+">+</button>
    </span></label>`;
}

function collectStep0() {
  const d = state.draft;
  d.packageId = $('#wPkg').value;
  d.depart = $('#wDepart').value;
  d.adults = clamp(parseInt($('#w-adults').value, 10) || 1, 1, 20);
  d.children = clamp(parseInt($('#w-children').value, 10) || 0, 0, 12);
  d.infants = clamp(parseInt($('#w-infants').value, 10) || 0, 0, 6);
  d.rooms = clamp(parseInt($('#w-rooms').value, 10) || 1, 1, 8);
}

function collectStep1() {
  const d = state.draft;
  $$('[data-tr]').forEach((el) => { d.travellers[+el.dataset.tr][el.dataset.k] = el.value.trim(); });
  d.notes = ($('#wNotes') || {}).value || '';
}

function validateStep1() {
  let bad = null;
  $$('[data-tr]').forEach((el) => {
    const leadPhone = el.dataset.tr === '0' && el.dataset.k === 'phone';
    const need = leadPhone || el.dataset.k === 'name' || el.dataset.k === 'passport';
    const empty = leadPhone ? !phoneOk(el.value) : !el.value.trim();
    el.classList.toggle('is-bad', need && empty);
    if (need && empty && !bad) bad = el;
  });
  if (bad) { bad.focus(); toast(t('book.required')); }
  return !bad;
}

function collectStep2() {
  state.draft.extras = $$('[data-extra]').filter((el) => el.checked).map((el) => el.dataset.extra);
}

async function nextStep() {
  const stay = state.draft.mode === 'stay';
  if (state.step === 0) {
    if (stay) collectStayDates(); else collectStep0();
    // The date picker refuses a past day, but a typed value can still bypass it.
    const chosen = stay ? state.draft.checkIn : state.draft.depart;
    if (!chosen || chosen < isoIn(0)) {
      toast(t('book.pickDate'));
      const field = stay ? $('#wCheckIn') : $('#wDepart');
      if (field) field.focus();
      return;
    }
    if (!stay) {
      const pax0 = state.draft.adults + state.draft.children + state.draft.infants;
      const av = await availability(state.draft.packageId, state.draft.depart).catch(() => null);
      if (av && av.left != null && pax0 > av.left) {
        toast(t('book.soldOut'));
        paintWizardAvail();
        return;
      }
    }
  }
  if (state.step === 1) {
    collectStep1();
    if (!(stay ? validateStayGuests() : validateStep1())) return;
  }
  if (state.step === 2) collectStep2();
  if (state.step === 3) {
    if (state.sending) return;
    state.sending = true;
    $('#btnNext').disabled = true;
    try { await confirmBooking(); } finally { state.sending = false; $('#btnNext').disabled = false; }
    return;
  }
  state.step = Math.min(3, state.step + 1);
  renderStep();
  $('#modalBody').scrollTop = 0;
}

function prevStep() {
  if (state.lastBooking) { state.lastBooking = null; state.step = 0; renderStep(); return; }
  if (state.step === 0) { closeBooking(); return; }
  state.step -= 1;
  renderStep();
}

/* The request goes to the booking API first; the local copy and the WhatsApp handoff stay
 * as the fallback, so a network failure never leaves the visitor with nothing. */
function bookingPayload(d, q) {
  const travellers = (d.travellers || []).filter((x) => x && (x.name || x.passport || x.phone || x.email));
  const first = travellers[0] || {};
  const stay = d.mode === 'stay' ? STAYS.find((s) => s.id === d.stayId) : null;
  const tour = d.mode === 'tour' ? findTour(d.packageId) : null;
  return {
    requestId: d.requestId,
    mode: d.mode,
    tourId: tour ? tour.id : null,
    tourName: tour ? tx(tour.name) : null,
    stayId: stay ? stay.id : null,
    stayName: stay ? tx(stay.name) : null,
    depart: d.depart || null,
    checkIn: d.checkIn || null,
    nights: d.nights || 0,
    rooms: d.rooms || 1,
    adults: d.adults,
    children: d.children,
    infants: d.infants,
    travellers,
    extras: (d.extras || []).map((id) => {
      const e = EXTRAS.find((x) => x.id === id);
      return e ? tx(e.name) : id;
    }),
    notes: d.notes || '',
    quote: q,
    lang: state.lang,
    name: first.name || '',
    phone: first.phone || '',
    email: first.email || '',
  };
}

async function confirmBooking() {
  const d = state.draft;
  const q = quote();
  let ref = 'SKN-' + Date.now().toString(36).slice(-6).toUpperCase();
  let stored = false;

  if (apiReady()) {
    try {
      const res = await submitBooking(bookingPayload(d, q));
      if (res && res.ref) { ref = res.ref; stored = true; }
    } catch (err) {
      if (err && (err.message === 'sold_out' || err.message === 'not_enough_seats')) {
        toast(t('book.soldOut'));
        return;
      }
      if (err && err.status >= 400 && err.status < 500) {
        toast(t('book.checkDetails'));
        return;
      }
      stored = false;
    }
  }
  state.bookingStored = stored;

  state.lastBooking = { ref, ...structuredClone(d), quote: q, stays: [...state.trip.stays], at: new Date().toISOString(), stored };
  // Passport numbers are not kept on the device. Nothing ever read the local copy, and a
  // shared phone would have held forty travellers' documents for good, so it is only in memory
  // now and any copy written by an earlier version is cleared at start up (see boot).
  renderTicket();
}

function waMessage(b) {
  const L = [];
  if (b.mode === 'stay') {
    const s = STAYS.find((x) => x.id === b.stayId);
    L.push(isAr() ? 'طلب حجز نزل، سكينة' : 'Lodge booking request، Sekkenah');
    L.push(`${t('book.ref')}: ${b.ref}`);
    L.push(`${t('book.lodge')}: ${tx(s.name)}`);
    L.push(`${t('book.checkIn')}: ${fmtDate(b.checkIn)}`);
    L.push(`${t('book.nights')}: ${b.nights}  ${t('book.rooms')}: ${b.rooms}`);
    L.push(`${t('book.adults')}: ${b.adults}  ${t('book.children')}: ${b.children}  ${t('book.infants')}: ${b.infants}`);
    if (b.travellers.length) L.push(`${t('book.travellers')}: ` + b.travellers.map((x) => x.name).filter(Boolean).join(', '));
    if (b.extras.length) L.push(`${t('book.extras')}: ` + b.extras.map((id) => tx((EXTRAS.find((e) => e.id === id) || {}).name)).join(', '));
    L.push(`${t('book.total')}: ${usd(b.quote.total)} (~ETB ${etb(b.quote.total)})`);
    L.push(`${t('book.deposit')}: ${usd(b.quote.deposit)}`);
    return L.join('\n');
  }
  const p = findTour(b.packageId);
  L.push(isAr() ? 'طلب جولة في إثيوبيا، سكينة' : 'Ethiopia tour request، Sekkenah');
  L.push(`${t('book.ref')}: ${b.ref}`);
  L.push(`${t('book.package')}: ${tx(p.name)} (${fmtDate(b.depart)})`);
  L.push(`${t('book.adults')}: ${b.adults}  ${t('book.children')}: ${b.children}  ${t('book.infants')}: ${b.infants}`);
  L.push(`${t('book.rooms')}: ${b.rooms}`);
  if (b.travellers.length) L.push(`${t('book.travellers')}: ` + b.travellers.map((x) => x.name).filter(Boolean).join(', '));
  if (b.extras.length) L.push(`${t('book.extras')}: ` + b.extras.map((id) => tx((EXTRAS.find((e) => e.id === id) || {}).name)).join(', '));
  if (b.stays && b.stays.length) L.push(`${t('stays.title')}: ` + b.stays.map((id) => tx((STAYS.find((s) => s.id === id) || {}).name)).filter(Boolean).join(', '));
  L.push(`${t('book.total')}: ${usd(b.quote.total)} (~ETB ${etb(b.quote.total)})`);
  L.push(`${t('book.deposit')}: ${usd(b.quote.deposit)}`);
  return L.join('\n');
}

function renderTicket() {
  const b = state.lastBooking;
  const p = b.mode === 'stay' ? STAYS.find((x) => x.id === b.stayId) : findTour(b.packageId);
  renderTrack();
  $('#modalBody').innerHTML = `
    <div class="ticket" id="ticket">
      <div class="ticket__top">
        <span class="ticket__mark">سكينة</span>
        <span class="ticket__ref">${t('book.ref')} <b>${b.ref}</b></span>
      </div>
      <h3 class="ticket__title">${t('book.doneTitle')}</h3>
      <p class="ticket__body">${t(b.stored ? 'book.doneBodyStored' : 'book.doneBody')}</p>
      ${b.stored ? '' : `<p class="ticket__warn">${t('book.notStored')}</p>`}
      <div class="review__rows">
        <div><span>${b.mode === 'stay' ? t('book.lodge') : t('book.package')}</span><b>${esc(tx(p.name))}</b></div>
        ${b.mode === 'stay'
          ? `<div><span>${t('book.checkIn')}</span><b>${fmtDate(b.checkIn)}</b></div>
             <div><span>${t('book.nights')}</span><b>${b.nights} · ${b.rooms} ${t('book.rooms')}</b></div>`
          : `<div><span>${t('book.depart')}</span><b>${fmtDate(b.depart)}</b></div>`}
        <div><span>${t('book.adults')}</span><b>${b.adults}${b.children ? ` + ${b.children}` : ''}${b.infants ? ` + ${b.infants}` : ''}</b></div>
        ${b.travellers.filter((x) => x.name).length ? `<div><span>${t('book.travellers')}</span><b>${b.travellers.filter((x) => x.name).map((x) => esc(x.name)).join(', ')}</b></div>` : ''}
        <div><span>${t('book.total')}</span><b>${usd(b.quote.total)}</b></div>
        <div><span>${t('book.deposit')}</span><b>${usd(b.quote.deposit)}</b></div>
      </div>
      <p class="ticket__foot">${t('book.summaryNote')}</p>
      ${b.stored ? `<p class="ticket__manage"><a class="link" href="manage.html?ref=${encodeURIComponent(b.ref)}">${t('book.manage')}</a></p>` : ''}
    </div>`;
  $('#btnNext').textContent = t('book.doneNew');
  $('#btnNext').dataset.action = 'new';
  $('#btnBack').hidden = false;
  $('#btnBack').textContent = t('book.donePrint');
  $('#btnBack').dataset.action = 'print';
  $('#liveTotal').innerHTML = '';
  $('#modalFoot').querySelectorAll('[data-wa]').forEach((n) => n.remove());
  const wa = document.createElement('a');
  wa.className = 'btn btn--brass';
  wa.dataset.wa = '1';
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.href = waHref(waMessage(b));
  wa.textContent = t('contact.sendWa');
  $('#modalFoot').insertBefore(wa, $('#modalFoot').lastElementChild);
}

/* misc UI */

function toast(msg, ms = 2600) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add('is-on'));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.classList.remove('is-on'); setTimeout(() => { el.hidden = true; }, 250); }, ms);
}

/* Keeps tab focus inside whichever overlay is open. A drawer that lets Tab walk into
   the page behind it is the plainest accessibility failure an overlay can have. */
function trackFocus() {
  document.addEventListener('keydown', (e) => {
    const panel = !$('#modal').hidden ? $('#modal')
      : (!$('#drawer').hidden ? $('#drawer') : (!$('#lightbox').hidden ? $('#lightbox') : null));
    if (e.key === 'Escape') {
      if (!$('#modal').hidden) closeBooking();
      else if (!$('#drawer').hidden) closeDrawer();
      else if (!$('#lightbox').hidden) closeShot();
      return;
    }
    if (e.key !== 'Tab' || !panel) return;
    const f = $$('a[href],button:not([disabled]),input,select,textarea,summary,[tabindex]:not([tabindex="-1"])', panel)
      .filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* events */

function bind() {
  // The header text is bone-coloured for the hero photograph; over the paper-coloured
  // menu sheet that is white on white, so the header inverts while the menu is open.
  const setMenu = (open) => {
    $('#burger').setAttribute('aria-expanded', String(open));
    $('#mobileMenu').hidden = !open;
    $('#head').classList.toggle('is-menu', open);
    document.body.classList.toggle('is-locked', open);
  };
  $('#burger').addEventListener('click', () => setMenu($('#burger').getAttribute('aria-expanded') !== 'true'));
  $('#mobileMenu').addEventListener('click', (e) => {
    if (e.target.closest('a,button')) setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) setMenu(false);
  });

  $$('[data-track-pick]').forEach((b) => b.addEventListener('click', () => {
    applyTrack(b.dataset.trackPick);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
  $('#trackSwitch').addEventListener('click', () => applyTrack(activeTrack() === 'umrah' ? 'ethiopia' : 'umrah'));
  $('#langBtn').addEventListener('click', () => setLang(isAr() ? 'en' : 'ar'));
  $$('[data-lang-toggle]').forEach((b) => b.addEventListener('click', () => setLang(isAr() ? 'en' : 'ar')));

  $('#tourFilters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-region]');
    if (!b) return;
    state.region = b.dataset.region;
    renderFilters();
    renderTours();
  });

  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-tour]');
    if (openBtn) { openTourDrawer(openBtn.dataset.openTour); return; }

    const openStayBtn = e.target.closest('[data-open-stay]');
    if (openStayBtn) { openStayDrawer(openStayBtn.dataset.openStay); return; }

    const bookStay = e.target.closest('[data-book-stay]');
    if (bookStay) { closeDrawer(); openBooking(null, { mode: 'stay', stayId: bookStay.dataset.bookStay }); return; }

    const addStay = e.target.closest('[data-add-stay]');
    if (addStay) {
      const id = addStay.dataset.addStay;
      const i = state.trip.stays.indexOf(id);
      if (i >= 0) state.trip.stays.splice(i, 1); else state.trip.stays.push(id);
      renderStays();
      if (state.openStay === id) openStayDrawer(id, { keepFocus: true });
      toast(i >= 0 ? (isAr() ? 'أُزيل من الرحلة' : 'Removed from trip') : t('stays.added'));
      return;
    }

    const bookCar = e.target.closest('[data-book-car]');
    if (bookCar) {
      const c = CARS.find((x) => x.id === bookCar.dataset.bookCar);
      if (c) window.open(waHref(`${t('cars.waIntro')}\n${tx(c.title)}, ${usd(c.price)} ${tx(c.unit)}`), '_blank', 'noopener');
      return;
    }

    if (e.target.closest('[data-close-drawer]') || e.target.id === 'scrim') { closeDrawer(); return; }
    if (e.target.closest('[data-close-modal]')) { closeBooking(); return; }
    if (e.target.closest('[data-open-book]')) {
      closeDrawer();
      openBooking(state.openTour || null);
      return;
    }
    const fromTour = e.target.closest('[data-book-from]');
    if (fromTour) { closeDrawer(); openBooking(fromTour.dataset.bookFrom); return; }
  });

  $('#modal').addEventListener('change', (e) => {
    if (e.target.id === 'wPkg') {
      state.draft.packageId = e.target.value;
      const p = findTour(e.target.value);
      if (p) { state.draft.depart = p.depart; $('#wDepart').value = p.depart; }
      $('#liveTotal').innerHTML = priceLine();
    }
    if (e.target.dataset.extra) {
      collectStep2();
      const q = quote();
      $('#liveTotal').innerHTML = `<b>${usd(q.total)}</b><small>${t('book.total')}</small>`;
    }
  });

  $('#modal').addEventListener('input', (e) => {
    if (e.target.id && e.target.id.startsWith('w-')) {
      state.draft[e.target.id.slice(2)] = parseInt(e.target.value, 10) || 0;
      $('#liveTotal').innerHTML = priceLine();
    }
    if (e.target.dataset.tr) e.target.classList.remove('is-bad');
  });

  $('#modal').addEventListener('click', (e) => {
    const n = e.target.closest('[data-nudge]');
    if (n) {
      const id = n.dataset.nudge;
      const input = $('#w-' + id);
      const next = clamp((parseInt(input.value, 10) || 0) + Number(n.dataset.dir), +input.min, +input.max);
      input.value = next;
      state.draft[id] = next;
      $('#liveTotal').innerHTML = priceLine();
    }
  });

  $('#btnNext').addEventListener('click', () => {
    if ($('#btnNext').dataset.action === 'new') {
      state.lastBooking = null;
      $('#btnBack').dataset.action = '';
      openBooking();
      return;
    }
    nextStep();
  });

  $('#btnBack').addEventListener('click', () => {
    if ($('#btnBack').dataset.action === 'print') { window.print(); return; }
    prevStep();
  });

  /* One film at a time; the native controls appear only once a film has started. */
  $('#filmRow').addEventListener('click', (e) => {
    const b = e.target.closest('[data-play]');
    if (!b) return;
    const card = b.closest('.film');
    const v = $('.film__v', card);
    $$('#filmRow .film').forEach((o) => {
      if (o === card) return;
      const other = $('.film__v', o);
      other.pause();
      other.controls = false;
      o.classList.remove('is-playing');
    });
    card.classList.add('is-playing');
    v.controls = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => card.classList.remove('is-playing'));
  });
  // Media events do not bubble, so the end of a film is caught in the capture phase.
  $('#filmRow').addEventListener('ended', (e) => {
    const card = e.target.closest('.film');
    if (!card) return;
    card.classList.remove('is-playing');
    e.target.controls = false;
    e.target.currentTime = 0;
  }, true);

  $('#tripGrid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-shot]');
    if (b) openShot(Number(b.dataset.shot));
  });
  $('#lightbox').addEventListener('click', (e) => {
    const step = e.target.closest('[data-lb-step]');
    if (step) { paintShot(shotAt + Number(step.dataset.lbStep)); return; }
    if (e.target.closest('[data-lb-close]') || e.target.id === 'lightbox') closeShot();
  });
  document.addEventListener('keydown', (e) => {
    if ($('#lightbox').hidden) return;
    if (e.key === 'ArrowRight') paintShot(shotAt + (isAr() ? -1 : 1));
    if (e.key === 'ArrowLeft') paintShot(shotAt + (isAr() ? 1 : -1));
  });

  $('#search').addEventListener('submit', (e) => {
    e.preventDefault();
    const region = $('#fRegion').value;
    const month = Number($('#fMonth').value) || 0;
    const pax = Number($('#fPax').value) || 1;
    state.region = region || 'all';
    const list = TOURS.filter((p) =>
      (state.region === 'all' || p.region === state.region) &&
      (!month || p.bestMonths.includes(month)) &&
      p.seats >= pax);
    renderFilters();
    $('#tourGrid').innerHTML = list.map(tourCard).join('');
    $('#tourEmpty').hidden = list.length > 0;
    const status = $('#searchStatus');
    status.textContent = list.length
      ? `${list.length} ${t('search.results')}`
      : t('search.none');
    observe($('#tourGrid'));
    $('#tours').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#enquiry').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const data = { name: f.name.value.trim(), phone: f.phone.value.trim(), message: f.message.value.trim(), at: new Date().toISOString(), lang: state.lang };
    if (apiReady()) {
      // Fire and forget: the visitor should not wait on a form that also has WhatsApp.
      submitEnquiry({ ...data, company: (f.company || {}).value || '' }).catch(() => {});
    }
    try {
      const all = JSON.parse(localStorage.getItem(LS.enquiry) || '[]');
      all.push(data);
      localStorage.setItem(LS.enquiry, JSON.stringify(all.slice(-50)));
    } catch { /* ignore */ }
    const text = isAr()
      ? `استفسار، ${data.name}\n${data.phone}\n${data.message}`
      : `Enquiry, ${data.name}\n${data.phone}\n${data.message}`;
    $('#enquiryWa').href = waHref(text);
    $('#enquiryDone').hidden = false;
    f.reset();
  });

  // The date or the party changed: ask the server how many places are actually left on that day.
  const availIfChanged = (e) => {
    // The draft is only collected when Next is pressed, so keep it in step here or the
    // availability question is asked about the old date.
    if (e.target.id === 'wDepart') state.draft.depart = e.target.value;
    if (e.target.id === 'wPkg') {
      state.draft.packageId = e.target.value;
      const p = findTour(e.target.value);
      if (p) {
        state.draft.depart = p.depart;
        const field = $('#wDepart');
        if (field) field.value = p.depart;
      }
    }
    if (e.target.id === 'wDepart' || e.target.id === 'wPkg') paintWizardAvail();
  };
  $('#modalBody').addEventListener('change', availIfChanged);
  $('#modalBody').addEventListener('input', availIfChanged);
  $('#modalBody').addEventListener('click', (e) => {
    if (e.target.closest('[data-nudge]')) setTimeout(paintWizardAvail, 0);
  });

  const head = $('#head');
  const onScroll = () => head.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* boot */

/* Resolve the desk: an explicit ?track= wins over the stored choice, because a link shared
 * for the Umrah desk must open on the Umrah desk. No answer means show the chooser. */
function initialTrack() {
  const q = new URLSearchParams(location.search).get('track');
  if (q === 'umrah' || q === 'ethiopia') return q;
  try {
    const saved = localStorage.getItem(LS.track);
    if (saved === 'umrah' || saved === 'ethiopia') return saved;
  } catch { /* storage blocked */ }
  return null;
}

function applyTrack(track, { paint = true } = {}) {
  state.track = track === 'umrah' ? 'umrah' : track === 'ethiopia' ? 'ethiopia' : null;
  const desk = state.track ? TRACKS[state.track] : null;
  document.body.dataset.track = state.track || 'ethiopia';
  state.region = 'all';

  const choose = $('#choose');
  if (choose) choose.hidden = Boolean(desk);

  for (const img of $$('[data-track-pick-logo]')) {
    const d = TRACKS[img.dataset.trackPickLogo];
    if (!d) continue;
    img.src = d.logo;
    img.onerror = () => { img.onerror = null; img.src = d.fallbackLogo; };
  }

  if (desk) {
    try { localStorage.setItem(LS.track, state.track); } catch { /* private mode */ }
    const mark = $('#brandMark');
    if (mark) {
      mark.src = desk.logo;
      mark.onerror = () => { mark.onerror = null; mark.src = desk.fallbackLogo; };
    }
    const hero = $('#heroImg');
    if (hero) hero.src = desk.hero;
    const name = $('[data-brand="name"]');
    if (name) name.textContent = tx(desk.name);
    const tag = $('.brand__tag');
    if (tag) tag.dataset.i18n = desk.tag;
    const setKey = (sel, key) => { const el = $(sel); if (el) el.dataset.i18n = key; };
    setKey('#heroKicker', desk.copy.kicker);
    setKey('#heroLine1', desk.copy.line1);
    setKey('#heroLine2', desk.copy.line2);
    setKey('#heroSub', desk.copy.sub);
    setKey('#heroCta', desk.copy.cta);
    const sw = $('#trackSwitch');
    if (sw) sw.dataset.i18n = desk.id === 'umrah' ? 'track.switch.ethiopia' : 'track.switch.umrah';
  }

  if (paint) setLang(state.lang, { announce: false });
  else renderAll();
}

function boot() {
  // Earlier versions copied every booking, passports included, into this browser and never read
  // it back. Clear it for anyone who still has such a device.
  try { localStorage.removeItem(LS.bookings); } catch { /* storage blocked */ }
  const q = new URLSearchParams(location.search).get('lang');
  let saved = null;
  try { saved = localStorage.getItem(LS.lang); } catch { /* ignore */ }
  // An explicit ?lang= beats the stored preference: a shared link must open in the
  // language it was shared in, or an Arabic recipient gets the English page.
  const guess = q || saved || (navigator.language || 'en').slice(0, 2);
  state.lang = guess === 'ar' ? 'ar' : 'en';

  // setLang() does the whole first paint, including the static copy, so a visitor whose
  // stored language is Arabic never sees one English frame before the swap.
  applyTrack(initialTrack(), { paint: false });
  setLang(state.lang, { announce: false });
  startCalendarClock();
  bind();
  trackFocus();
  observe();
  document.body.classList.add('is-ready');
}

/* A published catalogue replaces the shipped one in place, because the imports are live
 * bindings onto mutable arrays and objects. Any failure leaves data.js untouched. */
/* Pictures that belong to the page rather than to a route or a lodge, such as the hero.
 * The office replaces them in the in place editor; the catalogue carries the new address. */
function applyImages(images) {
  if (!images || typeof images !== 'object') return;
  $$('[data-photo]').forEach((el) => {
    const url = images[el.dataset.photo];
    if (typeof url === 'string' && url) el.src = url;
  });
}

function applyCatalogue(c) {
  SEAT_DRAFT.clear();
  if (c.previewSeats && typeof c.previewSeats === 'object') {
    for (const [id, value] of Object.entries(c.previewSeats)) {
      const n = Number(value);
      if (Number.isFinite(n) && n >= 0) SEAT_DRAFT.set(id, n);
    }
  }
  if (Array.isArray(c.tours) && c.tours.length) { TOURS.length = 0; TOURS.push(...c.tours); }
  if (Array.isArray(c.stays) && c.stays.length) { STAYS.length = 0; STAYS.push(...c.stays); }
  if (Array.isArray(c.films) && c.films.length) { FILMS.length = 0; FILMS.push(...c.films); }
  if (Array.isArray(c.shots) && c.shots.length) { SHOTS.length = 0; SHOTS.push(...c.shots); }
  if (c.text) setOverrides(c.text);
  applyImages(c.images);
  const s = c.settings || {};
  if (s.brand) Object.assign(BRAND, s.brand);
  for (const [key, target] of [['regions', REGIONS], ['extras', EXTRAS], ['cars', CARS], ['services', SERVICES], ['steps', STEPS], ['faqs', FAQS]]) {
    if (Array.isArray(s[key]) && s[key].length) { target.length = 0; target.push(...s[key]); }
  }
}

async function start() {
  const published = await loadCatalogue();
  if (published) applyCatalogue(published);
  boot();
  // After the page is usable, not before: if the server is slow the site still paints.
  loadAvailability();
}

/* The places left on the date the visitor picked. The server has the final word; this is the
 * early warning that stops someone filling a form for a date that is already full. */
let availToken = 0;
async function paintWizardAvail() {
  const d = state.draft;
  const box = $('#wAvail');
  if (!box || d.mode !== 'tour') return;
  const pax = d.adults + d.children + d.infants;
  const token = ++availToken;
  box.textContent = t('book.checking');
  const data = await availability(d.packageId, d.depart).catch(() => null);
  if (token !== availToken || !$('#wAvail')) return;
  if (!data || data.left == null) { box.textContent = ''; return; }
  AVAIL.set(availKey(data.tourId, data.depart), data);
  if (data.left <= 0) box.textContent = t('book.seatsFull');
  else if (data.left < pax) box.textContent = `${data.left} ${t('tours.seats')}. ${t('book.soldOut')}`;
  else box.textContent = `${data.left} ${t('tours.seats')}`;
}

/* The office page embeds this document with ?edit=1 and holds a catalogue with edits that
 * have not been published yet. Handing that catalogue back to the page keeps those lines
 * and pictures on screen when the editor switches language or reloads the preview, instead
 * of showing the older published copy until Save. Nothing here is available to a visitor. */
if (new URLSearchParams(location.search).has('edit')) {
  window.__sekApplyCatalogue = (c) => {
    if (!c) return;
    applyCatalogue(c);
    setLang(state.lang, { announce: false });
  };
}

start();
