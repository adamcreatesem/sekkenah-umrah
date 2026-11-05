/* Sekkenah office page.
 *
 * One page, five sections. It talks to the booking API with the staff key the office
 * holds. Nothing here is public: the bookings endpoint refuses anyone without the key,
 * and the catalogue write needs the same key. The published catalogue is read by the
 * site, so a price changed here is live after the next page load.
 *
 * The key lives in sessionStorage, so closing the tab ends the session.
 */

const API = (document.querySelector('meta[name="sekkenah-api"]')?.content || '').replace(/\/+$/, '');
const KEY_STORE = 'sekkenah.staff.key';
const STATUSES = ['new', 'confirmed', 'deposit', 'travelled', 'cancelled'];
const STATUS_LABEL = { new: 'New', confirmed: 'Confirmed', deposit: 'Deposit paid', travelled: 'Travelled', cancelled: 'Cancelled' };

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('en-US');
const when = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

let token = '';
let catalogue = null;
let bookings = [];
let enquiries = [];
let versions = [];

/* ---------- transport ---------- */

async function call(path, options = {}) {
  const res = await fetch(API + path, {
    ...options,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
  if (res.status === 401) { signOut('The key was refused.'); throw new Error('unauthorised'); }
  return res;
}

/* ---------- chrome ---------- */

let toastTimer;
function toast(message, bad = false) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.toggle('bad', bad);
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 3200);
}

function signOut(reason) {
  token = '';
  try { sessionStorage.removeItem(KEY_STORE); } catch { /* ignore */ }
  $('#shell').classList.remove('on');
  $('#gate').style.display = '';
  $('#gate-err').textContent = reason || '';
  $('#key').value = '';
}

function showTab(name) {
  for (const b of document.querySelectorAll('nav.tabs button')) {
    b.setAttribute('aria-selected', String(b.dataset.tab === name));
  }
  for (const s of document.querySelectorAll('main > section')) {
    s.hidden = s.id !== 'tab-' + name;
  }
}

/* ---------- bookings ---------- */

function renderBookings() {
  const body = $('#bookings-body');
  $('#c-bookings').textContent = bookings.length ? String(bookings.length) : '';
  if (!bookings.length) {
    body.innerHTML = '<p class="empty">No bookings yet. A request made on the website lands here within seconds.</p>';
    return;
  }
  body.innerHTML = `<table><thead><tr>
      <th>Reference</th><th>Received</th><th>Guest</th><th>What they booked</th><th>Party</th><th>Total</th><th>Status</th>
    </tr></thead><tbody>
    ${bookings.map((b) => `<tr data-ref="${esc(b.ref)}">
      <td data-l="Ref"><span class="ref">${esc(b.ref)}</span></td>
      <td data-l="Received"><span class="small">${esc(when(b.created_at))}</span></td>
      <td data-l="Guest">${esc(b.contact_name || '')}<div class="small">${esc(b.contact_phone || '')}</div></td>
      <td data-l="Booking">${esc(b.tour_name || b.stay_name || '')}<div class="small">${b.mode === 'stay' ? 'Lodge stay' : 'Route'}${b.depart ? ' · ' + esc(b.depart) : ''}${b.check_in ? ' · ' + esc(b.check_in) : ''}</div></td>
      <td data-l="Party"><span class="small">${b.adults} adult${b.adults === 1 ? '' : 's'}${b.children ? ', ' + b.children + ' child' + (b.children === 1 ? '' : 'ren') : ''}${b.infants ? ', ' + b.infants + ' infant' + (b.infants === 1 ? '' : 's') : ''}</span></td>
      <td data-l="Total">${money(b.total)}<div class="small">${money(b.deposit)} deposit</div></td>
      <td data-l="Status"><span class="pill ${esc(b.status)}">${esc(STATUS_LABEL[b.status] || b.status)}</span></td>
    </tr>`).join('')}
    </tbody></table>`;
}

async function openBooking(ref) {
  const res = await call('/api/bookings/' + encodeURIComponent(ref));
  if (!res.ok) { toast('Could not open that booking.', true); return; }
  const { booking: b } = await res.json();
  const host = $('#booking-detail');
  if (host) host.remove();
  const wrap = document.createElement('div');
  wrap.className = 'detail';
  wrap.id = 'booking-detail';
  wrap.innerHTML = `
    <div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap">
      <h3>${esc(b.ref)}</h3>
      <span class="pill ${esc(b.status)}">${esc(STATUS_LABEL[b.status] || b.status)}</span>
      <span class="muted" style="font-size:13px">${esc(when(b.created_at))}</span>
      <button class="btn ghost" type="button" id="close-detail" style="margin-inline-start:auto">Close</button>
    </div>
    <div class="grid2" style="margin-top:16px">
      <dl class="kv">
        <dt>Route</dt><dd>${esc(b.tour_name || b.stay_name || '')}</dd>
        <dt>${b.mode === 'stay' ? 'Check-in' : 'Departure'}</dt><dd>${esc(b.check_in || b.depart || 'not set')}</dd>
        <dt>Party</dt><dd>${b.adults} adult${b.adults === 1 ? '' : 's'}, ${b.children} child${b.children === 1 ? '' : 'ren'}, ${b.infants} infant${b.infants === 1 ? '' : 's'}${b.nights ? ', ' + b.nights + ' night' + (b.nights === 1 ? '' : 's') + ', ' + b.rooms + ' room' + (b.rooms === 1 ? '' : 's') : ''}</dd>
        <dt>Extras</dt><dd>${b.extras && b.extras.length ? esc(b.extras.join(', ')) : 'none'}</dd>
        <dt>Lead traveller</dt><dd>${esc(b.contact_name || '')}<div class="small">${esc(b.contact_phone || '')}${b.contact_email ? '<br>' + esc(b.contact_email) : ''}</div></dd>
      </dl>
      <dl class="kv">
        <dt>Quoted total</dt><dd>${money(b.quote?.total ?? b.total)}</dd>
        <dt>Deposit, 30%</dt><dd>${money(b.quote?.deposit ?? b.deposit)}</dd>
        <dt>Balance</dt><dd>${money(b.quote?.balance ?? 0)}</dd>
        <dt>Language</dt><dd>${b.lang === 'ar' ? 'Arabic' : 'English'}</dd>
        <dt>Notes from the guest</dt><dd>${b.notes ? esc(b.notes) : 'none'}</dd>
      </dl>
    </div>
    <h3 style="font-size:15px;margin:8px 0 2px">Travellers</h3>
    <table class="trav"><thead><tr><th>Name</th><th>Passport</th><th>Phone</th><th>Email</th></tr></thead><tbody>
      ${(b.travellers || []).map((t, i) => `<tr>
        <td>${esc(t.name || '')}${i === 0 ? ' <span class="muted" style="font-size:11px">lead</span>' : ''}</td>
        <td class="pp">${esc(t.passport || '')}</td>
        <td>${esc(t.phone || '')}</td>
        <td>${esc(t.email || '')}</td>
      </tr>`).join('') || '<tr><td colspan="4" class="muted">No travellers recorded.</td></tr>'}
    </tbody></table>
    <div class="fields" style="margin-top:18px">
      <div class="field">
        <label for="d-status">Status</label>
        <select id="d-status">${STATUSES.map((s) => `<option value="${s}"${s === b.status ? ' selected' : ''}>${STATUS_LABEL[s]}</option>`).join('')}</select>
      </div>
      <div class="field wide">
        <label for="d-note">Office note</label>
        <textarea id="d-note" placeholder="Called the guest, deposit due Tuesday.">${esc(b.office_note || '')}</textarea>
      </div>
      <div class="field">
        <label>&nbsp;</label>
        <button class="btn primary" type="button" id="d-save">Save this booking</button>
      </div>
      <div class="field">
        <label>&nbsp;</label>
        <a class="btn" href="https://wa.me/${esc(String(b.contact_phone || '').replace(/[^\d]/g, ''))}" target="_blank" rel="noopener" style="text-align:center">WhatsApp the guest</a>
      </div>
    </div>`;
  const row = document.querySelector(`tr[data-ref="${CSS.escape(ref)}"]`);
  if (row) row.after(wrap); else $('#bookings-body').append(wrap);

  $('#close-detail')?.addEventListener('click', () => {
    wrap.remove();
    row?.classList.remove('open');
  });
  $('#d-save')?.addEventListener('click', async () => {
    const btn = $('#d-save');
    btn.disabled = true;
    const res2 = await call('/api/bookings/' + encodeURIComponent(ref), {
      method: 'PATCH',
      body: JSON.stringify({ status: $('#d-status').value, note: $('#d-note').value }),
    });
    btn.disabled = false;
    if (res2.ok) {
      toast('Saved.');
      await loadBookings();
      wrap.remove();
    } else {
      toast('Could not save.', true);
    }
  });
  wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function loadBookings() {
  const res = await call('/api/bookings?limit=200');
  if (!res.ok) { toast('Could not load bookings.', true); return; }
  const data = await res.json();
  bookings = data.bookings || [];
  renderBookings();
}

/* ---------- enquiries ---------- */

function renderEnquiries() {
  $('#c-enquiries').textContent = enquiries.length ? String(enquiries.length) : '';
  const body = $('#enquiries-body');
  if (!enquiries.length) {
    body.innerHTML = '<p class="empty">No enquiries yet.</p>';
    return;
  }
  body.innerHTML = `<table><thead><tr><th>Received</th><th>Name</th><th>Phone</th><th>Message</th></tr></thead><tbody>
    ${enquiries.map((e) => `<tr>
      <td data-l="Received"><span class="small">${esc(when(e.created_at))}</span></td>
      <td data-l="Name">${esc(e.name)}</td>
      <td data-l="Phone"><a href="https://wa.me/${esc(String(e.phone || '').replace(/[^\d]/g, ''))}" target="_blank" rel="noopener">${esc(e.phone)}</a></td>
      <td data-l="Message" style="white-space:pre-wrap">${esc(e.message)}</td>
    </tr>`).join('')}</tbody></table>`;
}

async function loadEnquiries() {
  const res = await call('/api/enquiries');
  if (!res.ok) return;
  enquiries = (await res.json()).enquiries || [];
  renderEnquiries();
}

/* ---------- catalogue ---------- */

const setPath = (obj, path, value) => {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
  cur[parts[parts.length - 1]] = value;
};

function field(label, path, value, opts = {}) {
  const type = opts.type || 'text';
  const v = value ?? '';
  const wide = opts.wide ? ' wide' : '';
  if (type === 'textarea') {
    return `<div class="field${wide}"><label>${esc(label)}</label><textarea data-path="${esc(path)}">${esc(v)}</textarea></div>`;
  }
  if (type === 'select') {
    return `<div class="field${wide}"><label>${esc(label)}</label><select data-path="${esc(path)}">
      ${opts.options.map((o) => `<option value="${esc(o.value)}"${String(o.value) === String(v) ? ' selected' : ''}>${esc(o.label)}</option>`).join('')}
    </select></div>`;
  }
  const hint = opts.hint ? `<span class="muted" style="font-size:12px">${esc(opts.hint)}</span>` : '';
  return `<div class="field${wide}"><label>${esc(label)}</label><input type="${type}" data-path="${esc(path)}" value="${esc(v)}"${opts.step ? ` step="${opts.step}"` : ''}>${hint}</div>`;
}

function imageField(path, value, label = 'Photo') {
  return `<div class="field wide"><label>${esc(label)}</label>
    <div class="imgrow">
      <img class="thumb" src="${esc(value || '')}" alt="" loading="lazy" data-preview="${esc(path)}">
      <input data-path="${esc(path)}" value="${esc(value || '')}" spellcheck="false">
    </div>
    <span class="muted" style="font-size:12px">A path inside the site, like assets/img/tour-wonchi.jpg, or a full web address.</span>
  </div>`;
}

function videoField(path, value, posterPath, poster) {
  return `<div class="field wide"><label>Film (MP4 address)</label>
    <div class="imgrow">
      <img class="thumb" src="${esc(poster || '')}" alt="" loading="lazy" data-preview="${esc(posterPath)}">
      <input data-path="${esc(path)}" value="${esc(value || '')}" spellcheck="false" placeholder="assets/video/wonchi-15s.mp4">
    </div>
    <span class="muted" style="font-size:12px">The film that plays when a visitor presses play. It must be an MP4 that is already on the site, or a full web address to one. The picture you see here is the poster, the frame shown before play.</span>
  </div>`;
}

function renderRoutes() {
  const regions = catalogue.settings?.regions || [];
  $('#routes-body').innerHTML = catalogue.tours.map((t, i) => `
    <details class="card">
      <summary>
        <span class="name">${esc(t.name?.en || t.id)}</span>
        <span class="meta">${money(t.price)} · ${t.seats} seats · ${t.days} days</span>
      </summary>
      <div class="body">
        <div class="fields">
          ${field('Name, English', `tours.${i}.name.en`, t.name?.en)}
          ${field('Name, Arabic', `tours.${i}.name.ar`, t.name?.ar)}
          ${field('Card label', `tours.${i}.tag.en`, t.tag?.en)}
          ${field('Region', `tours.${i}.region`, t.region, { type: 'select', options: regions.map((r) => ({ value: r.id, label: r.label?.en || r.id })) })}
          ${field('Level', `tours.${i}.level`, t.level, { type: 'select', options: [{ value: 'easy', label: 'Easy' }, { value: 'moderate', label: 'Moderate' }, { value: 'demanding', label: 'Demanding' }] })}
          ${field('Price per person, USD', `tours.${i}.price`, t.price, { type: 'number' })}
          ${field('Seats', `tours.${i}.seats`, t.seats, { type: 'number' })}
          ${field('Days', `tours.${i}.days`, t.days, { type: 'number' })}
          ${field('Next departure', `tours.${i}.depart`, t.depart, { type: 'date' })}
          ${imageField(`tours.${i}.image`, t.image)}
          ${field('Card summary, English', `tours.${i}.blurb.en`, t.blurb?.en, { type: 'textarea', wide: true })}
          ${field('Card summary, Arabic', `tours.${i}.blurb.ar`, t.blurb?.ar, { type: 'textarea', wide: true })}
          ${field('The story, English', `tours.${i}.story.en`, t.story?.en, { type: 'textarea', wide: true })}
        </div>
        <p class="muted" style="font-size:12.5px;margin-top:12px">Day by day and the included list are edited in the content file for now. They change less often than prices.</p>
      </div>
    </details>`).join('');
}

function renderLodges() {
  $('#lodges-body').innerHTML = catalogue.stays.map((s, i) => `
    <details class="card">
      <summary>
        <span class="name">${esc(s.name?.en || s.id)}</span>
        <span class="meta">${money(s.price)} per room</span>
      </summary>
      <div class="body">
        <div class="fields">
          ${field('Name, English', `stays.${i}.name.en`, s.name?.en)}
          ${field('Name, Arabic', `stays.${i}.name.ar`, s.name?.ar)}
          ${field('Area', `stays.${i}.area.en`, s.area?.en)}
          ${field('Rate per room per night, USD', `stays.${i}.price`, s.price, { type: 'number' })}
          ${field('Stars', `stays.${i}.stars`, s.stars, { type: 'number' })}
          ${field('Distance', `stays.${i}.near.en`, s.near?.en)}
          ${field('What is included', `stays.${i}.note.en`, s.note?.en)}
          ${imageField(`stays.${i}.image`, s.image)}
          ${field('The story, English', `stays.${i}.story.en`, s.story?.en, { type: 'textarea', wide: true })}
        </div>
      </div>
    </details>`).join('');
}

function renderSettings() {
  const b = catalogue.settings?.brand || {};
  $('#settings-body').innerHTML = `<div class="card"><div class="body" style="border-top:0">
    <div class="fields">
      ${field('Phone one', 'settings.brand.phones.0', b.phones?.[0])}
      ${field('Phone two', 'settings.brand.phones.1', b.phones?.[1])}
      ${field('WhatsApp number, digits only', 'settings.brand.whatsapp', b.whatsapp)}
      ${field('Email', 'settings.brand.email', b.email)}
      ${field('Address, English', 'settings.brand.address.en', b.address?.en, { wide: true })}
      ${field('Address, Arabic', 'settings.brand.address.ar', b.address?.ar, { wide: true })}
      ${field('Birr per US dollar', 'settings.brand.etbPerUsd', b.etbPerUsd, { type: 'number', hint: 'Every price on the site is quoted in US dollars, because that is what the guest pays. This rate is only used for the approximate ETB figure shown beside the invoice and in the WhatsApp summary, for example 1 dollar = 154 birr. It is not a price and nothing is charged in birr.' })}
    </div>
  </div></div>`;
}

function renderTrips() {
  const films = catalogue.films || [];
  const shots = catalogue.shots || [];
  $('#trips-body').innerHTML = `
    <h3 class="sub">Films</h3>
    <p class="muted" style="font-size:13px;margin:-2px 0 12px">Each film on the Past trips strip. The address is where the file sits, so a new film is uploaded to the site folder first and then named here.</p>
    ${films.map((f, i) => `
      <details class="card">
        <summary>
          <span class="name">${esc(f.name?.en || f.id || 'Film')}</span>
          <span class="meta">${esc(f.len || '')} · ${esc(f.src || 'no film')}</span>
        </summary>
        <div class="body"><div class="fields">
          ${videoField(`films.${i}.src`, f.src, `films.${i}.poster`, f.poster)}
          ${imageField(`films.${i}.poster`, f.poster, 'Poster, the still shown before play')}
          ${field('Length, as shown on the card', `films.${i}.len`, f.len)}
          ${field('Name, English', `films.${i}.name.en`, f.name?.en)}
          ${field('Name, Arabic', `films.${i}.name.ar`, f.name?.ar)}
          ${field('Caption, English', `films.${i}.note.en`, f.note?.en, { type: 'textarea', wide: true })}
          ${field('Caption, Arabic', `films.${i}.note.ar`, f.note?.ar, { type: 'textarea', wide: true })}
        </div></div>
      </details>`).join('') || '<p class="empty">This catalogue has no films yet. Publish once from the current site copy to bring them in.</p>'}
    <h3 class="sub">Photographs</h3>
    <p class="muted" style="font-size:13px;margin:-2px 0 12px">The eight frames in the grid. The small file is the tile, the large file opens when a visitor clicks it.</p>
    ${shots.map((s, i) => `
      <details class="card">
        <summary>
          <span class="name">${esc(s.cap?.en || 'Photo ' + (i + 1))}</span>
          <span class="meta">${esc(s.src || '')}</span>
        </summary>
        <div class="body"><div class="fields">
          ${imageField(`shots.${i}.src`, s.src, 'Tile, the 4:5 photograph')}
          ${imageField(`shots.${i}.big`, s.big, 'Large file, opened on click')}
          ${field('Caption, English', `shots.${i}.cap.en`, s.cap?.en)}
          ${field('Caption, Arabic', `shots.${i}.cap.ar`, s.cap?.ar)}
        </div></div>
      </details>`).join('') || '<p class="empty">This catalogue has no photographs yet.</p>'}`;
}

function renderHistory() {
  const body = $('#history-body');
  if (!versions.length) {
    body.innerHTML = '<p class="empty">No history yet. The first publish after this was added stores the copy that was live at that moment, so there is always something to go back to.</p>';
    return;
  }
  body.innerHTML = `<table><thead><tr><th>#</th><th>Was live</th><th>Contents</th><th>Note</th><th></th></tr></thead><tbody>
    ${versions.map((v) => `<tr>
      <td data-l="Version"><span class="ref">${v.id}</span></td>
      <td data-l="Was live"><span class="small">${esc(when(v.created_at))}</span></td>
      <td data-l="Contents"><span class="small">${v.tours} routes · ${v.stays} lodges · ${Math.round(v.bytes / 1024)} KB</span></td>
      <td data-l="Note"><span class="small">${esc(v.note || '')}</span></td>
      <td data-l=""><button class="btn" type="button" data-restore="${v.id}">Put this back</button></td>
    </tr>`).join('')}
  </tbody></table>
  <p class="muted" style="font-size:12.5px;margin-top:10px">The last fifty publishes are kept. Putting one back publishes it again, so the site updates within a minute, and the copy you replace is itself kept, so a restore can be undone.</p>`;
}

async function loadVersions() {
  const res = await call('/api/content/versions');
  if (!res.ok) { toast('Could not load the history.', true); return; }
  versions = (await res.json()).versions || [];
  renderHistory();
}

async function restoreVersion(id) {
  const res = await call('/api/content/versions/' + Number(id) + '/restore', { method: 'POST', body: '{}' });
  if (!res.ok) { toast('Could not put that back.', true); return; }
  const data = await res.json().catch(() => ({}));
  toast('Put back. The site updates within a minute.');
  $('#saved-at').textContent = data.updated_at ? 'Published ' + when(data.updated_at) : 'Published';
  await Promise.all([loadCatalogue(), loadVersions()]);
}

async function loadCatalogue() {
  const res = await fetch(API + '/api/content', { headers: { accept: 'application/json' } }).catch(() => null);
  const data = res && res.ok ? await res.json().catch(() => null) : null;
  const shipped = await import('./data.js');
  const shippedTrips = await import('./trips.js');
  if (data?.content?.tours?.length) {
    catalogue = data.content;
    if (!Array.isArray(catalogue.films)) catalogue.films = shippedTrips.FILMS.map((f) => ({ ...f }));
    if (!Array.isArray(catalogue.shots)) catalogue.shots = shippedTrips.SHOTS.map((s) => ({ ...s }));
    $('#saved-at').textContent = data.updated_at ? 'Published ' + when(data.updated_at) : '';
  } else {
    catalogue = {
      tours: shipped.TOURS,
      stays: shipped.STAYS,
      films: shippedTrips.FILMS.map((f) => ({ ...f })),
      shots: shippedTrips.SHOTS.map((s) => ({ ...s })),
      settings: { brand: shipped.BRAND, regions: shipped.REGIONS, extras: shipped.EXTRAS, cars: shipped.CARS, services: shipped.SERVICES, steps: shipped.STEPS, faqs: shipped.FAQS },
    };
    $('#saved-at').textContent = 'Showing the shipped catalogue';
  }
  renderRoutes();
  renderLodges();
  renderSettings();
  renderTrips();
}

async function publish() {
  const buttons = [...document.querySelectorAll('[data-save="catalogue"]')];
  buttons.forEach((b) => { b.disabled = true; });
  const res = await call('/api/content', {
    method: 'PUT',
    body: JSON.stringify({
      tours: catalogue.tours,
      stays: catalogue.stays,
      settings: catalogue.settings,
      films: catalogue.films || [],
      shots: catalogue.shots || [],
      note: 'Published from the office page',
    }),
  }).catch(() => null);
  buttons.forEach((b) => { b.disabled = false; });
  if (res && res.ok) {
    const body = await res.json().catch(() => ({}));
    $('#saved-at').textContent = body.updated_at ? 'Published ' + when(body.updated_at) : 'Published';
    toast('Published. The site shows it within a minute.');
    loadVersions();
  } else {
    toast('Not published. Check the price and photo fields.', true);
  }
}

/* ---------- wiring ---------- */

function wireEditors() {
  document.addEventListener('input', (e) => {
    const el = e.target.closest('[data-path]');
    if (!el) return;
    let value = el.value;
    if (el.type === 'number') value = value === '' ? 0 : Number(value);
    setPath(catalogue, el.dataset.path, value);
    if (el.type === 'number' && /\.(price|seats)$/.test(el.dataset.path)) {
      const card = el.closest('details');
      const summary = card?.querySelector('summary .meta');
      const tour = catalogue.tours.find((t) => card?.querySelector('summary .name')?.textContent.trim() === (t.name?.en || t.id));
      if (summary && tour) summary.textContent = `${money(tour.price)} · ${tour.seats} seats · ${tour.days} days`;
    }
    const preview = document.querySelector(`[data-preview="${CSS.escape(el.dataset.path)}"]`);
    if (preview) preview.src = el.value;
  });
}

async function openOffice() {
  $('#gate').style.display = 'none';
  $('#shell').classList.add('on');
  await Promise.all([loadBookings(), loadEnquiries(), loadCatalogue()]);
}

async function boot() {
  if (!API) {
    $('#gate-err').textContent = 'This page has no API address configured.';
    return;
  }
  try { token = sessionStorage.getItem(KEY_STORE) || ''; } catch { token = ''; }

  $('#gate-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = $('#key').value.trim();
    if (!value) return;
    $('#gate-err').textContent = '';
    token = value;
    const res = await fetch(API + '/api/bookings?limit=1', { headers: { authorization: `Bearer ${value}` } }).catch(() => null);
    if (!res || !res.ok) {
      token = '';
      $('#gate-err').textContent = res && res.status === 401 ? 'That key was refused.' : 'Could not reach the office server.';
      return;
    }
    try { sessionStorage.setItem(KEY_STORE, value); } catch { /* ignore */ }
    openOffice();
  });

  $('#sign-out').addEventListener('click', () => signOut());
  $('#refresh').addEventListener('click', async () => { await loadBookings(); toast('Refreshed.'); });
  $('#csv').addEventListener('click', async () => {
    const res = await call('/api/bookings.csv');
    if (!res.ok) { toast('Could not download.', true); return; }
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sekkenah-bookings.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  $('#bookings-body').addEventListener('click', (e) => {
    const row = e.target.closest('tr[data-ref]');
    if (!row) return;
    document.querySelectorAll('tr.open').forEach((r) => r.classList.remove('open'));
    row.classList.add('open');
    openBooking(row.dataset.ref);
  });

  for (const b of document.querySelectorAll('nav.tabs button')) {
    b.addEventListener('click', () => {
      showTab(b.dataset.tab);
      if (b.dataset.tab === 'history') loadVersions();
    });
  }

  $('#history-refresh').addEventListener('click', async () => { await loadVersions(); toast('Refreshed.'); });

  $('#history-body').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-restore]');
    if (!btn) return;
    const id = Number(btn.dataset.restore);
    const v = versions.find((x) => x.id === id);
    const label = v ? when(v.created_at) : 'that version';
    if (!confirm(`Put back the copy that was live on ${label}? The site updates within a minute.`)) return;
    btn.disabled = true;
    await restoreVersion(id);
    btn.disabled = false;
  });
  for (const b of document.querySelectorAll('[data-save="catalogue"]')) {
    b.addEventListener('click', publish);
  }
  wireEditors();

  if (token) {
    const res = await fetch(API + '/api/bookings?limit=1', { headers: { authorization: `Bearer ${token}` } }).catch(() => null);
    if (res && res.ok) openOffice();
    else signOut(res && res.status === 401 ? 'The saved key was refused. Enter it again.' : 'Could not reach the office server.');
  }
}

boot();
