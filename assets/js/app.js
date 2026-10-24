/* Sekkenah — interface behaviour.
 *
 * Everything renders from data.js, so a language switch is a re-render rather than a
 * patch-up of half the page. The one piece of real state is the booking draft, which is
 * kept in memory while the wizard is open and written to localStorage only once the
 * visitor confirms - a half-finished booking should not survive a reload as if it were
 * a reservation.
 */
import { BRAND, JOURNEYS, TOURS, ALL_TRIPS, HOTELS, SERVICES, STEPS, FAQS, EXTRAS, ROOM_TYPES } from './data.js';
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
const findTrip = (id) => ALL_TRIPS.find((x) => x.id === id);

const state = {
  lang: 'en',
  filter: 'all',
  city: 'makkah',
  openPackage: null,
  trip: { hotels: [] },
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
  document.title = t('meta.title');
  $('meta[name="description"]').setAttribute('content', t('meta.desc'));

  renderAll();
  paintHijri();
  paintLinks();
  if (announce) $('#langBtn').setAttribute('aria-label', t('nav.langLabel'));
}

/* ───────────────────────────── catalogue ───────────────────────────── */

const cardMeta = (p) => (p.nights
  ? `<span>${p.nights} ${t('journeys.nights')}</span><span class="dot">·</span><span>${p.makkah} / ${p.madinah}</span>`
  : `<span>${t('journeys.visa')}</span>`);

function journeyCard(p) {
  const seatsLow = p.seats <= 10;
  return `
  <article class="card" data-pkg="${p.id}">
    <div class="card__media">
      <img src="${p.image}" alt="${esc(tx(p.name))}" loading="lazy" decoding="async" width="1100" height="1375">
      <span class="card__tag">${esc(tx(p.tag))}</span>
      <span class="card__seats${seatsLow ? ' is-low' : ''}">${p.seats} ${t('journeys.seats')}</span>
    </div>
    <div class="card__body">
      <div class="card__meta">${cardMeta(p)}</div>
      <h3 class="card__title">${esc(tx(p.name))}</h3>
      <p class="card__blurb">${esc(tx(p.blurb))}</p>
      <div class="card__foot">
        <span class="price"><small>${t('journeys.from')}</small><b>${usd(p.price)}</b><small>${t('journeys.perPerson')}</small></span>
        <button class="btn btn--line btn--sm" type="button" data-open-pkg="${p.id}">${t('journeys.view')}</button>
      </div>
      <p class="card__date">${t('journeys.departs')} <b>${fmtDate(p.depart)}</b> · ${p.tier}</p>
    </div>
  </article>`;
}

function tourCard(p) {
  return `
  <article class="card card--tour" data-pkg="${p.id}">
    <div class="card__media">
      <img src="${p.image}" alt="${esc(tx(p.name))}" loading="lazy" decoding="async" width="1400" height="1050">
      <span class="card__tag">${esc(tx(p.tag))}</span>
      <span class="card__seats${p.seats <= 10 ? ' is-low' : ''}">${p.seats} ${t('journeys.seats')}</span>
    </div>
    <div class="card__body">
      <div class="card__meta"><span>${p.days} ${t('tours.days')}</span><span class="dot">·</span><span>${p.nights} ${p.nights === 1 ? t('tours.night') : t('journeys.nights')}</span></div>
      <h3 class="card__title">${esc(tx(p.name))}</h3>
      <p class="card__blurb">${esc(tx(p.blurb))}</p>
      <div class="card__foot">
        <span class="price"><small>${t('journeys.from')}</small><b>${usd(p.price)}</b><small>${t('journeys.perPerson')}</small></span>
        <button class="btn btn--line btn--sm" type="button" data-open-pkg="${p.id}">${t('tours.view')}</button>
      </div>
      <p class="card__date">${t('journeys.departs')} <b>${fmtDate(p.depart)}</b></p>
    </div>
  </article>`;
}

function hotelCard(h) {
  const added = state.trip.hotels.includes(h.id);
  return `
  <article class="hotel">
    <div class="hotel__media">
      <img src="${h.image}" alt="${esc(tx(h.name))}" loading="lazy" decoding="async" width="1100" height="1375">
      <span class="hotel__dist">${h.meters} m ${t('hotels.toHaram')}</span>
    </div>
    <div class="hotel__body">
      <div class="hotel__stars" aria-label="${h.stars} ${t('hotels.stars')}">${'★'.repeat(h.stars)}<span>${'★'.repeat(5 - h.stars)}</span></div>
      <h3 class="hotel__name">${esc(tx(h.name))}</h3>
      <p class="hotel__note">${esc(tx(h.note))}</p>
      <div class="hotel__foot">
        <span class="price"><b>${usd(h.price)}</b><small>/${t('hotels.night')}</small></span>
        <button class="btn btn--line btn--sm${added ? ' is-added' : ''}" type="button" data-add-hotel="${h.id}">
          ${added ? t('hotels.added') : t('hotels.add')}
        </button>
      </div>
    </div>
  </article>`;
}

function serviceCard(s) {
  return `
  <article class="service">
    <span class="service__icon">${ICONS[s.icon] || ICONS.arch}</span>
    <h3 class="h3">${esc(tx(s.title))}</h3>
    <p>${esc(tx(s.body))}</p>
  </article>`;
}

const ICONS = {
  passport: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="2.5" width="16" height="19" rx="2"/><circle cx="12" cy="10" r="3.2"/><path d="M8.5 17.5h7"/></svg>',
  plane: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13.5 21 4l-4.5 17-3.5-6.5L3 13.5Z"/><path d="M13 14.5 21 4"/></svg>',
  bed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18v-7h18v7M3 18h18M6 11V7h5v4"/><path d="M15 11V8h3a2 2 0 0 1 2 2v1"/></svg>',
  car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16h16M5 16v2M19 16v2"/><path d="M4.5 16l1.6-5.2A2 2 0 0 1 8 9.3h8a2 2 0 0 1 1.9 1.5L19.5 16"/><circle cx="7.5" cy="16" r="1.4"/><circle cx="16.5" cy="16" r="1.4"/></svg>',
  arch: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10a8 8 0 0 1 16 0v10"/><path d="M9 20v-9a3 3 0 0 1 6 0v9"/></svg>',
  users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3 3 0 0 1 0 5.6M17.5 19a5.4 5.4 0 0 0-1.2-3.4"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5.5c0 4.5-3 7.6-7 9.5-4-1.9-7-5-7-9.5V6l7-3Z"/><path d="M9 12l2.2 2.2L15.5 10"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/></svg>',
};

function renderJourneys() {
  const grid = $('#journeyGrid');
  const list = state.filter === 'all' ? JOURNEYS : JOURNEYS.filter((p) => p.type === state.filter);
  grid.innerHTML = list.map(journeyCard).join('');
  $('#journeyEmpty').hidden = list.length > 0;
  observe(grid);
}

function renderFilters() {
  const keys = ['all', 'umrah', 'family', 'ramadan', 'group', 'visa'];
  $('#filters').innerHTML = keys.map((k) => `
    <button class="chip${state.filter === k ? ' is-on' : ''}" type="button"
      aria-pressed="${state.filter === k}" data-filter="${k}">${t('journeys.' + k)}</button>`).join('');
}

function renderHotels() {
  const list = HOTELS.filter((h) => h.city === state.city);
  $('#hotelGrid').innerHTML = list.map(hotelCard).join('');
  $$('#hotelTabs .tab').forEach((b) => {
    const on = b.dataset.city === state.city;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  observe($('#hotelGrid'));
}

function renderTours() {
  const grid = $('#tourGrid');
  if (!grid) return;
  grid.innerHTML = TOURS.map(tourCard).join('');
  observe(grid);
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
  const months = new Set(JOURNEYS.flatMap((p) => p.months));
  const sel = $('#fMonth');
  const keep = sel.value;
  sel.innerHTML = `<option value="">${t('search.anyMonth')}</option>` +
    [...months].sort((a, b) => a - b).map((m) => `<option value="${m}">${MONTHS[state.lang][m - 1]}</option>`).join('');
  sel.value = keep;
}

function renderAll() {
  renderFilters();
  renderJourneys();
  renderTours();
  renderHotels();
  renderSteps();
  renderServices();
  renderFaq();
  renderMonths();
  $('#year').textContent = new Date().getFullYear();
  if (state.openPackage) openPackage(state.openPackage, { keepFocus: true });
  if (!$('#modal').hidden) renderStep();
}

/* ───────────────────────────── dates ───────────────────────────── */

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  const opts = { day: 'numeric', month: 'short', year: 'numeric' };
  try { return d.toLocaleDateString(isAr() ? 'ar-ET' : 'en-GB', opts); }
  catch { return d.toDateString(); }
}

function fmtHijri(date = new Date()) {
  try {
    return new Intl.DateTimeFormat(isAr() ? 'ar-SA-u-ca-islamic-umalqura' : 'en-GB-u-ca-islamic-umalqura',
      { day: 'numeric', month: 'long', year: 'numeric' }).format(date).replace(/\s*AH$|\s*هـ$/, '');
  } catch { return ''; }
}

function paintHijri() {
  const h = fmtHijri();
  $('#hijri').textContent = h;
  $('#hijriHero').textContent = h;
}

/* ───────────────────────────── links ───────────────────────────── */

const waHref = (text) => `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;

function paintLinks() {
  $('#heroWa').href = waHref(isAr() ? 'السلام عليكم، أرغب في الاستفسار عن رحلات العمرة.' : 'Assalamu alaikum, I would like to ask about your Umrah journeys.');
  $('#waBtn').href = waHref(isAr() ? 'السلام عليكم، لدي استفسار عن العمرة.' : 'Assalamu alaikum, I have an enquiry about Umrah.');
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

function openPackage(id, { keepFocus = false } = {}) {
  const p = findTrip(id);
  if (!p) return;
  if (!keepFocus) lastFocus = document.activeElement;
  state.openPackage = id;

  $('#drawerKicker').textContent = p.tier ? `${tx(p.tag)} · ${p.tier}` : tx(p.tag);
  const nights = p.type === 'tour'
    ? `<div class="dstat"><b>${p.days}</b><span>${t('tours.days')}</span></div>
       <div class="dstat"><b>${p.nights}</b><span>${p.nights === 1 ? t('tours.night') : t('journeys.nights')}</span></div>`
    : p.nights
      ? `<div class="dstat"><b>${p.nights}</b><span>${t('journeys.nights')}</span></div>
         <div class="dstat"><b>${p.makkah} / ${p.madinah}</b><span>${t('journeys.split')}</span></div>`
      : `<div class="dstat"><b>12</b><span>${t('visa.months')}</span></div>`;
  const days = p.daysList ? p.daysList.map((d, i) => ({ day: i + 1, title: d.t, body: d.b })) : itinerary(p);

  $('#drawerBody').innerHTML = `
    <figure class="drawer__fig"><img src="${p.image}" alt="${esc(tx(p.name))}" width="1100" height="1375"></figure>
    <h2 class="drawer__title" id="drawerTitle">${esc(tx(p.name))}</h2>
    <div class="drawer__stats">${nights}
      <div class="dstat"><b>${usd(p.price)}</b><span>${t('journeys.perPerson')}</span></div>
      <div class="dstat"><b>${p.seats}</b><span>${t('journeys.seats')}</span></div>
    </div>
    <p class="drawer__blurb">${esc(tx(p.blurb))}</p>

    <h3 class="drawer__h">${t('pkg.included')}</h3>
    <ul class="ticks">${p.includes.map((i) => `<li>${esc(tx(i))}</li>`).join('')}</ul>

    ${days.length ? `<h3 class="drawer__h">${t('pkg.itinerary')}</h3><ol class="itin">${days.map((d) => `
      <li><span class="itin__d">${t('pkg.day')} ${d.day}</span><b>${esc(tx(d.title))}</b><span>${esc(tx(d.body))}</span></li>`).join('')}</ol>` : ''}

    <dl class="drawer__facts">
      <div><dt>${t('pkg.depart')}</dt><dd>${fmtDate(p.depart)}</dd></div>
      ${p.hotel ? `<div><dt>${t('journeys.hotel')}</dt><dd>${esc(tx(p.hotel))}</dd></div>` : ''}
    </dl>
    <p class="drawer__note">${t('pkg.priceNote')}</p>
    <button class="btn btn--solid drawer__cta" type="button" data-book-from="${p.id}">${t('pkg.choose')}</button>
  `;

  $('#drawer').hidden = false;
  $('#scrim').hidden = false;
  document.body.classList.add('is-locked');
  requestAnimationFrame(() => $('#drawer').classList.add('is-on'));
  $('#drawer .x').focus();
}

/* The itinerary is generated from the nights split rather than written out six times;
   a day-by-day list that disagrees with the package's own night count is the kind of
   detail that makes a site look assembled rather than designed. */
function itinerary(p) {
  const days = [];
  const mk = (n, title, body) => ({ day: n, title, body });
  let d = 1;
  days.push(mk(d++, { en: 'Depart Addis Ababa', ar: 'المغادرة من أديس أبابا' },
    { en: 'Group meets at Bole, flies to Jeddah, transfer to Makkah and the first Umrah with the guide.', ar: 'تلتقي المجموعة في بولي، وتطير إلى جدة، ثم تنتقل إلى مكة وتؤدي أول عمرة مع المرشد.' }));
  for (let i = 1; i <= p.makkah; i++) {
    days.push(mk(d++, { en: `Makkah — day ${i}`, ar: `مكة — اليوم ${i}` },
      { en: i === 1 ? 'Rest, then tawaf at a quieter hour. Ziyarah briefing after Isha.' : 'Free days for worship, with the guide available at the hotel desk each morning.', ar: i === 1 ? 'راحة، ثم طواف في ساعة أهدأ. لقاء تعريفي بالزيارة بعد العشاء.' : 'أيام حرة للعبادة، والمرشد متاح في مكتب الفندق كل صباح.' }));
  }
  days.push(mk(d++, { en: 'Makkah → Madinah', ar: 'مكة ← المدينة' },
    { en: 'Morning transfer, check in, and the first prayer at the Prophet’s Mosque.', ar: 'تنقل صباحي، تسجيل الوصول، وأول صلاة في المسجد النبوي.' }));
  for (let i = 1; i < p.madinah; i++) {
    days.push(mk(d++, { en: `Madinah — day ${i}`, ar: `المدينة — اليوم ${i}` },
      { en: i === 1 ? 'Guided ziyarah: Quba, Uhud and the Qiblatain.' : 'Free days, with a group lesson each evening.', ar: i === 1 ? 'زيارة مرشدة: قباء وأحد والقبلتين.' : 'أيام حرة، مع درس للمجموعة كل مساء.' }));
  }
  days.push(mk(d++, { en: 'Return', ar: 'العودة' },
    { en: 'Transfer to Madinah airport and the flight back to Addis Ababa.', ar: 'التنقل إلى مطار المدينة والطيران عائدًا إلى أديس أبابا.' }));
  return days;
}

function closeDrawer() {
  const d = $('#drawer');
  if (d.hidden) return;
  d.classList.remove('is-on');
  $('#scrim').hidden = true;
  document.body.classList.remove('is-locked');
  state.openPackage = null;
  setTimeout(() => { d.hidden = true; }, 260);
  if (lastFocus) lastFocus.focus();
}

/* ───────────────────────────── pricing ───────────────────────────── */

function roomFactor(id) {
  return (ROOM_TYPES.find((r) => r.id === id) || ROOM_TYPES[2]).factor;
}

function quote(d = state.draft) {
  if (!d) return { base: 0, extras: 0, hotels: 0, total: 0, deposit: 0, balance: 0 };
  const p = findTrip(d.packageId);
  const nights = p ? p.nights : 0;
  const pax = d.adults + d.children * 0.7 + d.infants * 0.12;
  const base = p ? p.price * pax * roomFactor(d.roomType) : 0;
  const extras = EXTRAS.filter((e) => d.extras.includes(e.id))
    .reduce((n, e) => n + e.price * (e.unit === 'person' ? d.adults + d.children : 1), 0);
  const hotels = state.trip.hotels
    .map((id) => HOTELS.find((h) => h.id === id))
    .filter(Boolean)
    .reduce((n, h) => n + h.price * Math.max(nights, 1) * Math.max(d.rooms, 1), 0);
  const total = base + extras + hotels;
  return { base, extras, hotels, total, deposit: total * 0.3, balance: total * 0.7 };
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
    packageId: packageId || (JOURNEYS[0] && JOURNEYS[0].id),
    depart: packageId ? (findTrip(packageId) || {}).depart : JOURNEYS[0].depart,
    adults: 2, children: 0, infants: 0, rooms: 1, roomType: 'double',
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
        <label class="field"><span>${t('book.journey')}</span>
          <select id="wPkg">
            <optgroup label="${t('nav.journeys')}">${JOURNEYS.map((p) => `<option value="${p.id}"${p.id === d.packageId ? ' selected' : ''}>${esc(tx(p.name))} — ${usd(p.price)}</option>`).join('')}</optgroup>
            <optgroup label="${t('nav.tours')}">${TOURS.map((p) => `<option value="${p.id}"${p.id === d.packageId ? ' selected' : ''}>${esc(tx(p.name))} — ${usd(p.price)}</option>`).join('')}</optgroup>
          </select>
        </label>
        <label class="field"><span>${t('book.depart')}</span>
          <input id="wDepart" type="date" value="${d.depart}">
        </label>
        <div class="row">
          ${numField('adults', t('book.adults'), d.adults, 1, 12)}
          ${numField('children', t('book.children'), d.children, 0, 10)}
          ${numField('infants', t('book.infants'), d.infants, 0, 6)}
          ${numField('rooms', t('book.rooms'), d.rooms, 1, 6)}
        </div>
        <label class="field"><span>${t('book.roomType')}</span>
          <select id="wRoom">${ROOM_TYPES.map((r) => `<option value="${r.id}"${r.id === d.roomType ? ' selected' : ''}>${esc(tx(r.label))}</option>`).join('')}</select>
        </label>
        <p class="form__note">${t('pkg.priceNote')}</p>
      </div>`;
    $('#btnNext').textContent = t('book.next');
    foot.hidden = true;
    $('#liveTotal').innerHTML = priceLine();
    return;
  }

  if (state.step === 1) {
    if (!d.travellers.length) d.travellers = Array.from({ length: d.adults + d.children + d.infants }, () => ({ name: '', passport: '', phone: '', email: '' }));
    while (d.travellers.length < d.adults + d.children + d.infants) d.travellers.push({ name: '', passport: '', phone: '', email: '' });
    d.travellers.length = d.adults + d.children + d.infants;
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
    const pax = d.adults + d.children;
    body.innerHTML = `
      <div class="form">
        <div class="extras">
          ${EXTRAS.map((e) => `
            <label class="check">
              <input type="checkbox" data-extra="${e.id}"${d.extras.includes(e.id) ? ' checked' : ''}>
              <span class="check__box" aria-hidden="true"></span>
              <span class="check__t">${esc(tx(e.name))}</span>
              <span class="check__p">${usd(e.price)}${e.unit === 'person' ? ` × ${pax}` : ''}</span>
            </label>`).join('')}
        </div>
        ${state.trip.hotels.length ? `<h3 class="drawer__h">${t('hotels.title')}</h3>
        <ul class="ticks">${state.trip.hotels.map((id) => {
          const h = HOTELS.find((x) => x.id === id);
          return h ? `<li>${esc(tx(h.name))} — ${usd(h.price)}/${t('hotels.night')}</li>` : '';
        }).join('')}</ul>` : ''}
      </div>`;
    $('#btnNext').textContent = t('book.next');
    foot.hidden = false;
    return;
  }

  if (state.step === 3) {
    const p = findTrip(d.packageId);
    const q = quote();
    body.innerHTML = `
      <div class="review">
        <div class="review__rows">
          <div><span>${t('book.package')}</span><b>${esc(tx(p.name))}</b></div>
          <div><span>${t('book.depart')}</span><b>${fmtDate(d.depart)}</b></div>
          <div><span>${t('book.adults')}</span><b>${d.adults}</b></div>
          ${d.children ? `<div><span>${t('book.children')}</span><b>${d.children}</b></div>` : ''}
          ${d.infants ? `<div><span>${t('book.infants')}</span><b>${d.infants}</b></div>` : ''}
          <div><span>${t('book.rooms')}</span><b>${d.rooms} · ${esc(tx((ROOM_TYPES.find((r) => r.id === d.roomType) || {}).label))}</b></div>
          ${d.travellers.filter((x) => x.name).map((x, i) => `<div><span>${t('book.traveller')} ${i + 1}</span><b>${esc(x.name)}</b></div>`).join('')}
        </div>
        <div class="totals">
          <div><span>${t('book.subtotal')}</span><b>${usd(q.base)}</b></div>
          ${q.extras ? `<div><span>${t('book.extras')}</span><b>${usd(q.extras)}</b></div>` : ''}
          ${q.hotels ? `<div><span>${t('hotels.title')}</span><b>${usd(q.hotels)}</b></div>` : ''}
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
      <button type="button" data-nudge="${id}" data-dir="-1" aria-label="-">−</button>
      <input id="w-${id}" type="number" value="${val}" min="${min}" max="${max}" inputmode="numeric">
      <button type="button" data-nudge="${id}" data-dir="1" aria-label="+">+</button>
    </span></label>`;
}

function collectStep0() {
  const d = state.draft;
  d.packageId = $('#wPkg').value;
  d.depart = $('#wDepart').value;
  d.adults = clamp(parseInt($('#w-adults').value, 10) || 1, 1, 12);
  d.children = clamp(parseInt($('#w-children').value, 10) || 0, 0, 10);
  d.infants = clamp(parseInt($('#w-infants').value, 10) || 0, 0, 6);
  d.rooms = clamp(parseInt($('#w-rooms').value, 10) || 1, 1, 6);
  d.roomType = $('#wRoom').value;
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

function collectStep2() {
  state.draft.extras = $$('[data-extra]').filter((el) => el.checked).map((el) => el.dataset.extra);
}

function confirmBooking() {
  const d = state.draft;
  const q = quote();
  const ref = 'SKN-' + Date.now().toString(36).slice(-6).toUpperCase();
  state.lastBooking = { ref, ...structuredClone(d), quote: q, hotels: [...state.trip.hotels], at: new Date().toISOString() };
  try {
    const all = JSON.parse(localStorage.getItem(LS.bookings) || '[]');
    all.push(state.lastBooking);
    localStorage.setItem(LS.bookings, JSON.stringify(all.slice(-40)));
  } catch { /* storage full or blocked - the ticket on screen is still valid */ }
  renderTicket();
}

function waMessage(b) {
  const p = findTrip(b.packageId);
  const L = [];
  L.push(isAr() ? 'طلب حجز عمرة — سكينة' : 'Umrah booking request — Sekkenah');
  L.push(`${t('book.ref')}: ${b.ref}`);
  L.push(`${t('book.package')}: ${tx(p.name)} (${fmtDate(b.depart)})`);
  L.push(`${t('book.adults')}: ${b.adults}  ${t('book.children')}: ${b.children}  ${t('book.infants')}: ${b.infants}`);
  L.push(`${t('book.rooms')}: ${b.rooms} × ${tx((ROOM_TYPES.find((r) => r.id === b.roomType) || {}).label)}`);
  if (b.travellers.length) L.push(`${t('book.travellers')}: ` + b.travellers.map((x) => x.name).filter(Boolean).join(', '));
  if (b.extras.length) L.push(`${t('book.extras')}: ` + b.extras.map((id) => tx((EXTRAS.find((e) => e.id === id) || {}).name)).join(', '));
  L.push(`${t('book.total')}: ${usd(b.quote.total)} (~ETB ${etb(b.quote.total)})`);
  L.push(`${t('book.deposit')}: ${usd(b.quote.deposit)}`);
  return L.join('\n');
}

function renderTicket() {
  const b = state.lastBooking;
  const p = findTrip(b.packageId);
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

  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    state.filter = b.dataset.filter;
    renderFilters();
    renderJourneys();
  });

  $('#hotelTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-city]');
    if (!b) return;
    state.city = b.dataset.city;
    renderHotels();
  });

  document.addEventListener('click', (e) => {
    const openPkgBtn = e.target.closest('[data-open-pkg]');
    if (openPkgBtn) { openPackage(openPkgBtn.dataset.openPkg); return; }

    const addHotel = e.target.closest('[data-add-hotel]');
    if (addHotel) {
      const id = addHotel.dataset.addHotel;
      const i = state.trip.hotels.indexOf(id);
      if (i >= 0) state.trip.hotels.splice(i, 1); else state.trip.hotels.push(id);
      renderHotels();
      toast(i >= 0 ? (isAr() ? 'أُزيل من الرحلة' : 'Removed from trip') : t('hotels.added'));
      return;
    }

    if (e.target.closest('[data-close-drawer]') || e.target.id === 'scrim') { closeDrawer(); return; }
    if (e.target.closest('[data-close-modal]')) { closeBooking(); return; }
    if (e.target.closest('[data-open-book]')) {
      closeDrawer();
      openBooking(state.openPackage || null);
      return;
    }
    const fromPkg = e.target.closest('[data-book-from]');
    if (fromPkg) { closeDrawer(); openBooking(fromPkg.dataset.bookFrom); return; }
  });

  $('#modal').addEventListener('change', (e) => {
    if (e.target.id === 'wPkg') {
      state.draft.packageId = e.target.value;
      const p = findTrip(e.target.value);
      if (p) { state.draft.depart = p.depart; $('#wDepart').value = p.depart; }
      $('#liveTotal').innerHTML = priceLine();
    }
    if (e.target.id === 'wRoom') { state.draft.roomType = e.target.value; $('#liveTotal').innerHTML = priceLine(); }
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
    const type = $('#fJourney').value;
    const month = Number($('#fMonth').value) || 0;
    const pax = Number($('#fPax').value) || 1;
    state.filter = type || 'all';
    const list = JOURNEYS.filter((p) => (!type || p.type === type) && (!month || p.months.includes(month)) && p.seats >= pax);
    renderFilters();
    $('#journeyGrid').innerHTML = list.map(journeyCard).join('');
    $('#journeyEmpty').hidden = list.length > 0;
    const status = $('#searchStatus');
    status.textContent = list.length ? `${list.length} ${t('search.results')}` : t('search.none');
    observe($('#journeyGrid'));
    document.getElementById('journeys').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
