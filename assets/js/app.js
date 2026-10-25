/* Sekkenah — interface behaviour. Ethiopia tours only.
 *
 * Everything renders from data.js, so a language switch is a re-render rather than a
 * patch-up of half the page. The one piece of real state is the booking draft, which is
 * kept in memory while the wizard is open and written to localStorage only once the
 * visitor confirms — a half-finished booking should not survive a reload as if it were
 * a reservation.
 */
import { BRAND, REGIONS, LEVELS, TOURS, STAYS, CARS, SERVICES, STEPS, FAQS, EXTRAS } from './data.js';
import { STR, MONTHS } from './i18n.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const isAr = () => state.lang === 'ar';
const t = (k) => (STR[state.lang][k] ?? STR.en[k] ?? k);
const tx = (o) => (o && (o[state.lang] ?? o.en)) || '';
const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
const etb = (n) => Math.round(n * BRAND.etbPerUsd).toLocaleString('en-US');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const findTour = (id) => TOURS.find((x) => x.id === id);
const regionOf = (id) => REGIONS.find((r) => r.id === id);

const state = {
  lang: 'en',
  region: 'all',
  openTour: null,
  trip: { stays: [] },
  draft: null,
  step: 0,
  lastBooking: null,
};

const LS = {
  lang: 'sekkenah.lang',
  bookings: 'sekkenah.bookings.v1',
  enquiry: 'sekkenah.enquiries.v1',
};

/* ───────────────────────────── language ───────────────────────────── */

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
    el.textContent = key === 'address' || key === 'name' || key === 'legal' ? tx(BRAND[key]) : el.textContent;
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

/* ───────────────────────────── catalogue ───────────────────────────── */

function tourCard(p) {
  const low = p.seats <= 8;
  return `
  <article class="card card--tour" data-tour="${p.id}" data-region="${p.region}">
    <div class="card__media">
      <img src="${p.image}" alt="${esc(tx(p.name))}" loading="lazy" decoding="async" width="1400" height="1050">
      <span class="card__tag">${esc(tx(p.tag))}</span>
      <span class="card__seats${low ? ' is-low' : ''}">${p.seats} ${t('tours.seats')}</span>
    </div>
    <div class="card__body">
      <div class="card__meta"><span>${p.days} ${t(p.days === 1 ? 'tours.day' : 'tours.days')}</span><span class="dot">·</span><span>${p.nights} ${t(p.nights === 1 ? 'tours.night' : 'tours.nights')}</span><span class="dot">·</span><span>${esc(tx(LEVELS[p.level]))}</span></div>
      <h3 class="card__title">${esc(tx(p.name))}</h3>
      <p class="card__blurb">${esc(tx(p.blurb))}</p>
      <div class="card__foot">
        <span class="price"><small>${t('tours.from')}</small><b>${usd(p.price)}</b><small>${t('tours.perPerson')}</small></span>
        <button class="btn btn--line btn--sm" type="button" data-open-tour="${p.id}">${t('tours.view')}</button>
      </div>
      <p class="card__date">${t('pkg.depart')} <b>${fmtDate(p.depart)}</b> · ${esc(tx(regionOf(p.region)?.label))}</p>
    </div>
  </article>`;
}

function stayCard(s) {
  const added = state.trip.stays.includes(s.id);
  return `
  <article class="stay">
    <div class="stay__media">
      <img src="${s.image}" alt="${esc(tx(s.name))}" loading="lazy" decoding="async" width="1100" height="1375">
      <span class="stay__area">${esc(tx(s.area))}</span>
    </div>
    <div class="stay__body">
      <div class="stay__stars" aria-label="${s.stars} ${t('stays.stars')}">${'★'.repeat(s.stars)}<span>${'★'.repeat(5 - s.stars)}</span></div>
      <h3 class="stay__name">${esc(tx(s.name))}</h3>
      <p class="stay__note">${esc(tx(s.note))}</p>
      <div class="stay__foot">
        <span class="price"><b>${usd(s.price)}</b><small>/${t('stays.night')}</small></span>
        <button class="btn btn--line btn--sm${added ? ' is-added' : ''}" type="button" data-add-stay="${s.id}">
          ${added ? t('stays.added') : t('stays.add')}
        </button>
      </div>
    </div>
  </article>`;
}

function carCard(c) {
  return `
  <article class="service">
    <span class="service__icon">${ICONS[c.icon] || ICONS.car}</span>
    <h3 class="h3">${esc(tx(c.title))}</h3>
    <p>${esc(tx(c.body))}</p>
    <div class="service__foot">
      <span class="service__price"><b>${usd(c.price)}</b><small>${esc(tx(c.unit))}</small></span>
      <button class="btn btn--line btn--sm" type="button" data-book-car="${c.id}">${t('cars.reserve')}</button>
    </div>
  </article>`;
}

function serviceCard(s) {
  return `
  <article class="service">
    <span class="service__icon">${ICONS[s.icon] || ICONS.route}</span>
    <h3 class="h3">${esc(tx(s.title))}</h3>
    <p>${esc(tx(s.body))}</p>
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
  // in there" — five routes or two changes whether the click is worth it.
  const chips = [{ id: 'all', label: { en: t('filters.all'), ar: t('filters.all') }, n: TOURS.length }, ...REGIONS];
  row.innerHTML = chips.map((r) => {
    const n = r.n ?? TOURS.filter((p) => p.region === r.id).length;
    return `
    <button class="chip${state.region === r.id ? ' is-on' : ''}" type="button"
      aria-pressed="${state.region === r.id}" data-region="${r.id}">${esc(tx(r.label))}<span class="chip__n">${n}</span></button>`;
  }).join('');
}

function renderTours() {
  const grid = $('#tourGrid');
  if (!grid) return;
  const list = state.region === 'all' ? TOURS : TOURS.filter((p) => p.region === state.region);
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
      <h3 class="h3">${esc(tx(s.title))}</h3>
      <p>${esc(tx(s.body))}</p>
    </li>`).join('');
}

function renderServices() {
  $('#serviceGrid').innerHTML = SERVICES.map(serviceCard).join('');
}

function renderFaq() {
  $('#faqList').innerHTML = FAQS.map((f, i) => `
    <details class="qa"${i === 0 ? ' open' : ''}>
      <summary>${esc(tx(f.q))}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></summary>
      <div class="qa__body"><p>${esc(tx(f.a))}</p></div>
    </details>`).join('');
}

function renderMonths() {
  const months = new Set(TOURS.flatMap((p) => p.bestMonths));
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
    REGIONS.map((r) => `<option value="${r.id}">${esc(tx(r.label))}</option>`).join('');
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
  renderMonths();
  renderRegions();
  $('#year').textContent = new Date().getFullYear();
  if (state.openTour) openTourDrawer(state.openTour, { keepFocus: true });
  if (!$('#modal').hidden) renderStep();
}

/* ───────────────────────────── dates ───────────────────────────── */

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  const opts = { day: 'numeric', month: 'short', year: 'numeric' };
  try { return d.toLocaleDateString(isAr() ? 'ar-ET' : 'en-GB', opts); }
  catch { return d.toDateString(); }
}

/* The Ethiopian calendar is the one the country actually keeps; Intl computes it, so it
 * is right today and in ten years without a lookup table. The era suffix is dropped
 * because the label already says which calendar this is. */
function fmtEthiopian(date = new Date()) {
  try {
    return new Intl.DateTimeFormat(isAr() ? 'ar-ET-u-ca-ethiopic' : 'en-GB-u-ca-ethiopic',
      { day: 'numeric', month: 'long', year: 'numeric' }).format(date).replace(/\s*(AM|هـ)$/, '');
  } catch { return ''; }
}

function paintCalendar() {
  const d = fmtEthiopian();
  for (const id of ['calDate', 'calHero']) {
    const el = $('#' + id);
    if (el) el.textContent = d;
  }
}

/* ───────────────────────────── links ───────────────────────────── */

const waHref = (text) => `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;

function paintLinks() {
  $('#heroWa').href = waHref(isAr()
    ? 'السلام عليكم، أرغب في الاستفسار عن جولات في إثيوبيا.'
    : 'Hello, I would like to ask about your tours in Ethiopia.');
  $('#waBtn').href = waHref(isAr()
    ? 'السلام عليكم، لدي استفسار عن جولة في إثيوبيا.'
    : 'Hello, I have an enquiry about a tour in Ethiopia.');
  $('#mapBtn').href = `https://www.google.com/maps/search/?api=1&query=${BRAND.mapQuery}`;
}

/* ───────────────────────────── reveal ───────────────────────────── */

let io;
function observe(root = document) {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach((el) => el.classList.add('in')); return; }
  io = io || new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  $$('.reveal:not(.in)', root).forEach((el) => io.observe(el));
}

/* ───────────────────────────── drawer ───────────────────────────── */

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
      <div class="dstat"><b>${p.seats}</b><span>${t('tours.seats')}</span></div>
      <div class="dstat"><b>${esc(tx(LEVELS[p.level]))}</b><span>${t('tours.level')}</span></div>
    </div>
    <p class="drawer__blurb">${esc(tx(p.blurb))}</p>

    <h3 class="drawer__h">${t('pkg.included')}</h3>
    <ul class="ticks">${p.includes.map((i) => `<li>${esc(tx(i))}</li>`).join('')}</ul>

    <h3 class="drawer__h">${t('pkg.itinerary')}</h3>
    <ol class="itin">${p.daysList.map((d, i) => `
      <li><span class="itin__d">${t('pkg.day')} ${i + 1}</span><b>${esc(tx(d.t))}</b><span>${esc(tx(d.b))}</span></li>`).join('')}</ol>

    <dl class="drawer__facts">
      <div><dt>${t('pkg.depart')}</dt><dd>${fmtDate(p.depart)}</dd></div>
      <div><dt>${t('tours.best')}</dt><dd>${bestMonths(p)}</dd></div>
      <div><dt>${t('search.region')}</dt><dd>${esc(tx(region?.label))}</dd></div>
    </dl>
    <p class="drawer__note">${t('pkg.private')} · ${t('pkg.priceNote')}</p>
    <button class="btn btn--solid drawer__cta" type="button" data-book-from="${p.id}">${t('pkg.choose')}</button>
  `;

  $('#drawer').hidden = false;
  $('#scrim').hidden = false;
  document.body.classList.add('is-locked');
  requestAnimationFrame(() => $('#drawer').classList.add('is-on'));
  $('#drawer .x').focus();
}

/* Best months read as a range when the route runs straight through the calendar — and
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
    return `${N[start - 1]}–${N[end - 1]}`;
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
  setTimeout(() => { d.hidden = true; }, 260);
  if (lastFocus) lastFocus.focus();
}

/* ───────────────────────────── pricing ───────────────────────────── */

function quote(d = state.draft) {
  if (!d) return { base: 0, extras: 0, stays: 0, total: 0, deposit: 0, balance: 0 };
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

/* ───────────────────────────── wizard ───────────────────────────── */

function openBooking(packageId = null) {
  lastFocus = document.activeElement;
  state.step = 0;
  state.lastBooking = null;
  $('#btnNext').dataset.action = '';
  $('#btnBack').dataset.action = '';
  $('#btnBack').hidden = false;
  $('#btnBack').textContent = t('book.back');
  state.draft = {
    packageId: packageId || TOURS[0].id,
    depart: packageId ? (findTour(packageId) || {}).depart : TOURS[0].depart,
    adults: 2, children: 0, infants: 0, rooms: 1,
    travellers: [], extras: [], notes: '',
  };
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

const STEP_KEYS = ['book.step1', 'book.step2', 'book.step3', 'book.step4'];

function renderTrack() {
  $('#stepper').innerHTML = STEP_KEYS.map((k, i) => `
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

  if (state.step === 0) {
    body.innerHTML = `
      <div class="form">
        <label class="field"><span>${t('book.route')}</span>
          <select id="wPkg">
            ${TOURS.map((p) => `<option value="${p.id}"${p.id === d.packageId ? ' selected' : ''}>${esc(tx(p.name))} — ${usd(p.price)}</option>`).join('')}
          </select>
        </label>
        <label class="field"><span>${t('book.depart')}</span>
          <input id="wDepart" type="date" value="${d.depart}">
        </label>
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
              <label class="field"><span>${t('book.phone')}</span><input data-tr="${i}" data-k="phone" value="${esc(tr.phone)}" type="tel" dir="ltr"></label>
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
          return s ? `<li>${esc(tx(s.name))} — ${usd(s.price)}/${t('stays.night')}</li>` : '';
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
      </div>`;
    $('#btnNext').textContent = t('book.confirm');
    foot.hidden = false;
    $('#liveTotal').innerHTML = priceLine();
  }
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
    const need = el.dataset.k === 'name' || el.dataset.k === 'passport';
    const empty = !el.value.trim();
    el.classList.toggle('is-bad', need && empty);
    if (need && empty && !bad) bad = el;
  });
  if (bad) { bad.focus(); toast(t('book.required')); }
  return !bad;
}

function collectStep2() {
  state.draft.extras = $$('[data-extra]').filter((el) => el.checked).map((el) => el.dataset.extra);
}

function nextStep() {
  if (state.step === 0) collectStep0();
  if (state.step === 1) { collectStep1(); if (!validateStep1()) return; }
  if (state.step === 2) collectStep2();
  if (state.step === 3) { confirmBooking(); return; }
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

function confirmBooking() {
  const d = state.draft;
  const q = quote();
  const ref = 'SKN-' + Date.now().toString(36).slice(-6).toUpperCase();
  state.lastBooking = { ref, ...structuredClone(d), quote: q, stays: [...state.trip.stays], at: new Date().toISOString() };
  try {
    const all = JSON.parse(localStorage.getItem(LS.bookings) || '[]');
    all.push(state.lastBooking);
    localStorage.setItem(LS.bookings, JSON.stringify(all.slice(-40)));
  } catch { /* storage full or blocked — the ticket on screen is still valid */ }
  renderTicket();
}

function waMessage(b) {
  const p = findTour(b.packageId);
  const L = [];
  L.push(isAr() ? 'طلب جولة في إثيوبيا — سكينة' : 'Ethiopia tour request — Sekkenah');
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
  const p = findTour(b.packageId);
  renderTrack();
  $('#modalBody').innerHTML = `
    <div class="ticket" id="ticket">
      <div class="ticket__top">
        <span class="ticket__mark">سكينة</span>
        <span class="ticket__ref">${t('book.ref')} <b>${b.ref}</b></span>
      </div>
      <h3 class="ticket__title">${t('book.doneTitle')}</h3>
      <p class="ticket__body">${t('book.doneBody')}</p>
      <div class="review__rows">
        <div><span>${t('book.package')}</span><b>${esc(tx(p.name))}</b></div>
        <div><span>${t('book.depart')}</span><b>${fmtDate(b.depart)}</b></div>
        <div><span>${t('book.adults')}</span><b>${b.adults}${b.children ? ` + ${b.children}` : ''}${b.infants ? ` + ${b.infants}` : ''}</b></div>
        ${b.travellers.filter((x) => x.name).length ? `<div><span>${t('book.travellers')}</span><b>${b.travellers.filter((x) => x.name).map((x) => esc(x.name)).join(', ')}</b></div>` : ''}
        <div><span>${t('book.total')}</span><b>${usd(b.quote.total)}</b></div>
        <div><span>${t('book.deposit')}</span><b>${usd(b.quote.deposit)}</b></div>
      </div>
      <p class="ticket__foot">${t('book.summaryNote')}</p>
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

/* ───────────────────────────── misc UI ───────────────────────────── */

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
    const panel = !$('#modal').hidden ? $('#modal') : (!$('#drawer').hidden ? $('#drawer') : null);
    if (e.key === 'Escape') {
      if (!$('#modal').hidden) closeBooking();
      else if (!$('#drawer').hidden) closeDrawer();
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

/* ───────────────────────────── events ───────────────────────────── */

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

    const addStay = e.target.closest('[data-add-stay]');
    if (addStay) {
      const id = addStay.dataset.addStay;
      const i = state.trip.stays.indexOf(id);
      if (i >= 0) state.trip.stays.splice(i, 1); else state.trip.stays.push(id);
      renderStays();
      toast(i >= 0 ? (isAr() ? 'أُزيل من الرحلة' : 'Removed from trip') : t('stays.added'));
      return;
    }

    const bookCar = e.target.closest('[data-book-car]');
    if (bookCar) {
      const c = CARS.find((x) => x.id === bookCar.dataset.bookCar);
      if (c) window.open(waHref(`${t('cars.waIntro')}\n${tx(c.title)} — ${usd(c.price)} ${tx(c.unit)}`), '_blank', 'noopener');
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
    try {
      const all = JSON.parse(localStorage.getItem(LS.enquiry) || '[]');
      all.push(data);
      localStorage.setItem(LS.enquiry, JSON.stringify(all.slice(-50)));
    } catch { /* ignore */ }
    const text = isAr()
      ? `استفسار — ${data.name}\n${data.phone}\n${data.message}`
      : `Enquiry — ${data.name}\n${data.phone}\n${data.message}`;
    $('#enquiryWa').href = waHref(text);
    $('#enquiryDone').hidden = false;
    f.reset();
  });

  const head = $('#head');
  const onScroll = () => head.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ───────────────────────────── boot ───────────────────────────── */

function boot() {
  const q = new URLSearchParams(location.search).get('lang');
  let saved = null;
  try { saved = localStorage.getItem(LS.lang); } catch { /* ignore */ }
  // An explicit ?lang= beats the stored preference: a shared link must open in the
  // language it was shared in, or an Arabic recipient gets the English page.
  const guess = q || saved || (navigator.language || 'en').slice(0, 2);
  state.lang = guess === 'ar' ? 'ar' : 'en';

  // setLang() does the whole first paint, including the static copy, so a visitor whose
  // stored language is Arabic never sees one English frame before the swap.
  setLang(state.lang, { announce: false });
  bind();
  trackFocus();
  observe();
  document.body.classList.add('is-ready');
}

boot();
