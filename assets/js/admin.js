/* Sekkenah office page.
 *
 * One page, five sections. It talks to the booking API with the staff key the office
 * holds. Nothing here is public: the bookings endpoint refuses anyone without the key,
 * and the catalogue write needs the same key. The published catalogue is read by the
 * site, so a price changed here is live after the next page load.
 *
 * Two people sign in: the manager, who also owns the website copy and the settings, and the
 * staff, who own the desk. The password is exchanged for a signed token that expires after
 * twelve hours; the token lives in sessionStorage, so closing the tab ends the session.
 */

const API = (document.querySelector('meta[name="sekkenah-api"]')?.content || '').replace(/\/+$/, '');
const SESSION_STORE = 'sekkenah.session.v2';
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
let role = '';
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
  if (res.status === 401) { signOut('The session ended. Sign in again.'); throw new Error('unauthorised'); }
  if (res.status === 403) { toast('That part belongs to the manager.', true); throw new Error('forbidden'); }
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
  role = '';
  try { sessionStorage.removeItem(SESSION_STORE); } catch { /* ignore */ }
  $('#shell').classList.remove('on');
  $('#gate').style.display = '';
  $('#gate-err').textContent = reason || '';
  $('#gate-user').value = '';
  $('#gate-pass').value = '';
  $('#who-role').textContent = '';
}

function currentTab() {
  const on = document.querySelector('nav.tabs button[aria-selected="true"]');
  return on ? on.dataset.tab : 'bookings';
}

/* What the staff desk may not see. The server refuses these anyway; hiding them stops a
 * person spending five minutes on a form that will be rejected at the end. */
function applyRole(value) {
  role = value === 'manager' ? 'manager' : 'staff';
  $('#who-role').textContent = role === 'manager' ? 'Manager' : 'Staff';
  for (const el of document.querySelectorAll('[data-manager]')) el.hidden = role !== 'manager';
  if (role !== 'manager' && ['edit', 'routes', 'lodges', 'trips', 'settings', 'history'].includes(currentTab())) {
    showTab('bookings');
  }
}

function showTab(name) {
  for (const b of document.querySelectorAll('nav.tabs button')) {
    b.setAttribute('aria-selected', String(b.dataset.tab === name));
  }
  for (const s of document.querySelectorAll('main > section')) {
    s.hidden = s.id !== 'tab-' + name;
  }
  if (name === 'edit') bindFrame();
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
      <div class="field">
        <label>&nbsp;</label>
        <button class="btn" type="button" id="d-delete" style="color:#8a2b2b">Delete forever</button>
      </div>
    </div>`;
  const row = document.querySelector(`tr[data-ref="${CSS.escape(ref)}"]`);
  if (row) row.after(wrap); else $('#bookings-body').append(wrap);

  $('#close-detail')?.addEventListener('click', () => {
    wrap.remove();
    row?.classList.remove('open');
  });
  // A traveller can ask for their details to be removed. This is the button that does it, and
  // it is deliberately separate from Cancel: cancelled bookings still keep passports for the
  // office record, deletion does not.
  $('#d-delete')?.addEventListener('click', async () => {
    if (!confirm(`Delete ${ref} and every passport in it? This cannot be undone.`)) return;
    const res3 = await call('/api/bookings/' + encodeURIComponent(ref), { method: 'DELETE' });
    if (res3.ok) {
      toast('Deleted for good.');
      wrap.remove();
      row?.classList.remove('open');
      await loadBookings();
    } else {
      toast('Could not delete that booking.', true);
    }
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
      text: catalogue.text || {},
      images: catalogue.images || {},
      note: 'Published from the office page',
    }),
  }).catch(() => null);
  buttons.forEach((b) => { b.disabled = false; });
  if (res && res.ok) {
    const body = await res.json().catch(() => ({}));
    $('#saved-at').textContent = body.updated_at ? 'Published ' + when(body.updated_at) : 'Published';
    toast('Published. The site shows it within a minute.');
    loadVersions();
    return true;
  }
  toast('Not published. Check the price and photo fields.', true);
  return false;
}

/* ---------- the website, editable in place ----------
 *
 * The tab shows the real page in an iframe, which is same origin, so this script can reach
 * into it. Every line of wording on that page already carries a data-i18n name, and the
 * Arabic version carries the same names, so a change is saved against that name rather than
 * against a position on a screen. Pictures are read from the catalogue instead: a tour card
 * knows its id, a film its place in the row.
 *
 * Nothing is written to the server until Save changes, and the old copy is kept by the same
 * snapshot that every publish makes, so History can put it back.
 */

const editor = {
  frame: null,
  pending: new Map(), // "lang|key" -> new wording, kept across a language switch
  fields: new Map(), // "catalogue path|lang" -> wording for tour, lodge, film and caption lines
  base: new Map(), // the wording that was there before this sitting first touched it
  pictures: 0,
  typing: false, // a line is open and has been changed, but not committed yet
  lang: 'en',
};

const editDirty = () => editor.pending.size + editor.fields.size + editor.pictures + (editor.typing ? 1 : 0);

function updateEditBar() {
  const n = editDirty();
  const el = $('#edit-dirty');
  if (!el) return;
  el.textContent = n ? `${n} unsaved change${n === 1 ? '' : 's'}` : 'No changes yet';
  el.classList.toggle('work', n > 0);
  $('#edit-save').disabled = !n;
}

function frameDoc() {
  if (!editor.frame) editor.frame = $('#edit-frame');
  return editor.frame && editor.frame.contentDocument;
}

/* The line of wording under the pointer, if there is one. Boxes are tested rather than the
 * elements the browser reports under the pointer, so wording that sits on a photograph is
 * found even when a veil or a wrapper is what the pointer technically touches. The smallest
 * box wins, which is the innermost line: a word inside a paragraph opens the paragraph, not
 * the section around it. */
const EDITABLE_SELECTOR = '[data-i18n],[data-edit],[data-edit-brand],[data-edit-phone]';

function editableAt(doc, x, y) {
  let best = null;
  let bestArea = Infinity;
  const win = doc.defaultView;
  for (const el of doc.querySelectorAll(EDITABLE_SELECTOR)) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
    if (el.closest('[hidden]')) continue;
    const cs = win.getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const area = r.width * r.height;
    if (area < bestArea) { best = el; bestArea = area; }
  }
  return best;
}

/* The picture under the pointer, if the pointer is on one. Anything that is a control, a line
 * of wording or a panel in front of the photograph stops the search, so a click in the empty
 * space of a section can never land on a picture that is not there. */
function mediaAt(doc, x, y) {
  const stack = doc.elementsFromPoint ? doc.elementsFromPoint(x, y) : [];
  for (const node of stack) {
    if (!node || !node.tagName) continue;
    const tag = node.tagName;
    if (tag === 'IMG' || tag === 'VIDEO') return mediaTarget(node);
    if (tag === 'A' || tag === 'BUTTON') {
      // The play triangle on a film is part of the frame, not page furniture, so a click on
      // the middle of a film still reaches the film. A control with wording of its own is
      // left alone: that wording is edited, and the control does not act in this preview.
      const box = node.closest && node.closest('[data-photo],[data-tour],[data-stay],[data-shot],.film');
      if (box && !node.textContent.trim()) return mediaTarget(box.querySelector('img,video') || node);
      return null;
    }
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return null;
    if (tag === 'FORM' || tag === 'HEADER' || tag === 'FOOTER' || tag === 'NAV') return null;
    if (node.ownerSVGElement || tag.toLowerCase() === 'svg') return null;
    if (hasOwnText(node)) return null;
  }
  return null;
}

function bindFrame() {
  const doc = frameDoc();
  if (!doc || !doc.body) return;
  if (doc.defaultView.__sekBound) return;
  doc.defaultView.__sekBound = true;

  const style = doc.createElement('style');
  style.textContent = `
    [data-i18n]:hover,[data-edit]:hover,[data-edit-brand]:hover,[data-edit-phone]:hover{outline:1px dashed #b8935a;outline-offset:3px;cursor:text}
    .sek-edit{outline:2px solid #b8935a !important;outline-offset:3px;background:rgba(184,147,90,.09)}
    [data-tour] .card__media:hover,[data-stay] .stay__media:hover,.film__frame:hover,[data-shot] figure:hover{outline:2px dashed #b8935a;outline-offset:-3px;cursor:copy}
  `;
  doc.head.appendChild(style);

  /* Text wins over pictures everywhere, and a picture only takes the click where the pointer
   * is really on it. A panel, a form, a menu or a control laid over a photograph is not a way
   * into that photograph, and neither is the empty part of a section. */
  doc.addEventListener('click', (e) => {
    // While a line is open for typing, let the browser place the caret and handle a
    // double click to select a word. Re-running the picker here would select all again.
    if (e.target.closest && e.target.closest('.sek-edit')) return;
    // The page is a preview, not a working website: no chip, drawer, lightbox or form may
    // act underneath the editor.
    e.preventDefault();
    e.stopPropagation();
    const line = editableAt(doc, e.clientX, e.clientY);
    if (line) { startEdit(line); return; }
    const picture = mediaAt(doc, e.clientX, e.clientY);
    if (picture) pickPicture(picture);
  }, true);

  doc.addEventListener('input', (e) => {
    if (!e.target.closest || !e.target.closest('.sek-edit')) return;
    editor.typing = true;
    updateEditBar();
  }, true);

  doc.addEventListener('keydown', (e) => {
    const el = e.target.closest && e.target.closest('.sek-edit');
    if (!el) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      el.textContent = el.dataset.sekDisplay || el.dataset.sekOriginal || '';
      delete el.dataset.sekDisplay;
      el.classList.remove('sek-edit');
      el.removeAttribute('contenteditable');
      editor.typing = false;
      updateEditBar();
      el.blur();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      el.blur();
    }
  }, true);

  doc.addEventListener('focusout', (e) => {
    const el = e.target.closest && e.target.closest('.sek-edit');
    if (el) commitEdit(el);
  }, true);

  doc.addEventListener('submit', (e) => e.preventDefault(), true);

  // The preview fetches the published catalogue, which does not know about lines changed
  // and pictures replaced in this sitting. Push the working copy in once it is ready.
  editor.pushToken = (editor.pushToken || 0) + 1;
  clearTimeout(editor.pushTimer);
  pushDraftToFrame(0, editor.pushToken);
}

function pushDraftToFrame(attempt = 0, token = editor.pushToken) {
  if (token !== editor.pushToken) return;
  const win = editor.frame && editor.frame.contentWindow;
  const ready = win && catalogue && win.document.body.classList.contains('is-ready')
    && typeof win.__sekApplyCatalogue === 'function';
  if (!ready) {
    if (attempt < 60) editor.pushTimer = setTimeout(() => pushDraftToFrame(attempt + 1, token), 150);
    return;
  }
  const text = {};
  for (const lang of ['en', 'ar']) text[lang] = { ...((catalogue.text || {})[lang] || {}) };
  for (const [composite, value] of editor.pending) {
    const cut = composite.indexOf('|');
    const lang = composite.slice(0, cut);
    text[lang] = text[lang] || {};
    text[lang][composite.slice(cut + 1)] = value;
  }
  const previewSeats = {};
  for (const { spec, value } of editor.fields.values()) {
    if (spec && isSeatField(spec)) previewSeats[spec.slice(spec.indexOf(':') + 1, spec.lastIndexOf(':'))] = value;
  }
  win.__sekApplyCatalogue({ ...catalogue, text, previewSeats });
}

/* The same line appears in the desktop and the mobile navigation; the same address appears
 * in the header and the footer. Repaint every copy as soon as one is committed. */
function repaintSame(el, value) {
  let selector = null;
  if (el.dataset.i18n) selector = `[data-i18n="${CSS.escape(el.dataset.i18n)}"]`;
  else if (el.dataset.editBrand) selector = `[data-edit-brand="${CSS.escape(el.dataset.editBrand)}"]`;
  else if (el.dataset.edit) selector = `[data-edit="${CSS.escape(el.dataset.edit)}"]`;
  if (!selector) return;
  el.ownerDocument.querySelectorAll(selector).forEach((other) => {
    if (other !== el && !other.classList.contains('sek-edit')) other.textContent = value;
  });
}

function finishOpenEdit() {
  const doc = frameDoc();
  const el = doc && doc.querySelector('.sek-edit');
  if (el) commitEdit(el);
}

function hasOwnText(node) {
  if (!node || node.nodeType !== 1) return false;
  for (const child of node.childNodes) {
    if (child.nodeType === 3 && child.textContent.trim()) return true;
  }
  return false;
}

function startEdit(el) {
  if (el.classList.contains('sek-edit')) return;
  const lang = el.ownerDocument.documentElement.lang === 'ar' ? 'ar' : 'en';
  const spec = el.dataset.edit;
  const target = spec ? fieldTarget(spec) : null;
  // Money, seats and dates are stored as values but painted with formatting: "$420",
  // "12 seats left", "13 Nov 2026". Open the raw value so the office edits a number or an
  // ISO date, then paint the formatted line back when it is committed.
  if (target && (isMoneyField(spec) || isSeatField(spec) || isDateField(spec))) {
    el.dataset.sekDisplay = el.textContent;
    el.textContent = String(fieldValue(target.item, target.field, lang) ?? '');
  } else {
    delete el.dataset.sekDisplay;
  }
  el.dataset.sekOriginal = el.textContent;
  el.classList.add('sek-edit');
  try { el.setAttribute('contenteditable', 'plaintext-only'); } catch { el.setAttribute('contenteditable', 'true'); }
  el.focus();
  const range = el.ownerDocument.createRange();
  range.selectNodeContents(el);
  const sel = el.ownerDocument.defaultView.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

/* A tour card, a lodge, a film or a still carries its wording in the catalogue rather than
 * in the interface dictionary, so an edit there is written back to the object the card was
 * rendered from. "tour:<id>:name" is the whole address; the id survives a filtered grid. */
function fieldTarget(spec) {
  if (!catalogue || !spec) return null;
  const cut = spec.indexOf(':');
  const kind = spec.slice(0, cut);
  const rest = spec.slice(cut + 1);
  const last = rest.lastIndexOf(':');
  const key = rest.slice(0, last);
  const field = rest.slice(last + 1);
  const settings = catalogue.settings || {};
  const byId = kind === 'tour' || kind === 'stay' || kind === 'service' || kind === 'car' || kind === 'region';
  const list = kind === 'tour' ? catalogue.tours
    : kind === 'stay' ? catalogue.stays
      : kind === 'film' ? catalogue.films
        : kind === 'shot' ? catalogue.shots
          : kind === 'service' ? settings.services
            : kind === 'car' ? settings.cars
              : kind === 'step' ? settings.steps
                : kind === 'faq' ? settings.faqs
                  : kind === 'region' ? settings.regions
                    : null;
  if (!Array.isArray(list)) return null;
  const item = byId ? list.find((x) => x.id === key) : list[Number(key)];
  return item ? { item, field } : null;
}

function brandTarget(key) {
  const brand = catalogue && catalogue.settings && catalogue.settings.brand;
  return brand && key ? brand : null;
}

function fieldValue(holder, field, lang) {
  const value = holder && holder[field];
  if (typeof value === 'string' || typeof value === 'number') return value;
  return (value && value[lang]) || '';
}

const isMoneyField = (spec) => /:price$/.test(spec || '');
const isSeatField = (spec) => /:seats$/.test(spec || '');
const isDateField = (spec) => /:depart$/.test(spec || '');

function numberFrom(text) {
  const match = String(text).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

function moneyText(value) {
  return '$' + Math.round(value).toLocaleString('en-US');
}

function numberInText(text, value) {
  return /\d/.test(text) ? text.replace(/\d[\d,]*/, String(value)) : String(value);
}

function isoDateFrom(text) {
  const raw = String(text).trim();
  const d = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(raw + 'T00:00:00') : new Date(raw);
  if (!d || Number.isNaN(d.getTime())) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dateText(iso, lang) {
  const d = new Date(iso + 'T00:00:00');
  try {
    return d.toLocaleDateString(lang === 'ar' ? 'ar-ET' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

function repaintPhones(index, value) {
  const doc = frameDoc();
  if (!doc) return;
  doc.querySelectorAll(`[data-edit-phone="${index}"]`).forEach((a) => {
    a.textContent = value;
    if (a.tagName === 'A') a.href = 'tel:' + value.replace(/[^\d+]/g, '');
  });
}

function commitEdit(el) {
  editor.typing = false;
  const lang = el.ownerDocument.documentElement.lang === 'ar' ? 'ar' : 'en';
  const originalText = el.dataset.sekOriginal || '';
  const displayBefore = el.dataset.sekDisplay || originalText;
  const before = originalText.replace(/\s+/g, ' ').trim();
  const after = el.textContent.replace(/\s+/g, ' ').trim();
  el.classList.remove('sek-edit');
  el.removeAttribute('contenteditable');

  const restore = () => {
    el.textContent = displayBefore;
    delete el.dataset.sekDisplay;
    updateEditBar();
  };
  const refuse = (message) => {
    restore();
    toast(message, true);
  };

  if (!after || after === before) { restore(); return; }

  const spec = el.dataset.edit;
  const phoneIndex = el.dataset.editPhone;
  const brandKey = el.dataset.editBrand;
  if (spec) {
    const target = fieldTarget(spec);
    if (!target) { refuse('That line could not be saved. Reload the office page and try again.'); return; }
    const { item, field } = target;
    let value = after;
    let display = after;

    if (isMoneyField(spec)) {
      const n = numberFrom(after);
      if (!Number.isFinite(n) || n < 0) { refuse('That price is not a number. Try 420.'); return; }
      value = Math.round(n);
      display = moneyText(value);
    } else if (isSeatField(spec)) {
      const n = numberFrom(after);
      if (!Number.isFinite(n) || n < 0) { refuse('That seat count is not a number. Try 12.'); return; }
      value = Math.round(n);
      display = numberInText(displayBefore, value);
    } else if (isDateField(spec)) {
      const iso = isoDateFrom(after);
      if (!iso) { refuse('That date could not be read. Use 2026-11-13.'); return; }
      value = iso;
      display = dateText(iso, lang);
    }

    const dirtyKey = spec + '|' + lang;
    if (!editor.base.has(dirtyKey)) editor.base.set(dirtyKey, fieldValue(item, field, lang));
    const current = item[field];
    if (typeof current === 'number' || typeof value === 'number') item[field] = value;
    else if (typeof current === 'string') item[field] = value;
    else {
      if (!current || typeof current !== 'object') item[field] = {};
      item[field][lang] = value;
    }
    if (String(value) === String(editor.base.get(dirtyKey))) editor.fields.delete(dirtyKey);
    else editor.fields.set(dirtyKey, { spec, lang, value });
    el.textContent = display;
    repaintSame(el, display);
  } else if (phoneIndex != null) {
    const brand = catalogue && catalogue.settings && catalogue.settings.brand;
    const phones = brand && brand.phones;
    const index = Number(phoneIndex);
    if (!Array.isArray(phones) || typeof phones[index] !== 'string') {
      refuse('The phone number could not be loaded. Reload the office page and try again.');
      return;
    }
    if (!/\d/.test(after)) { refuse('That does not look like a phone number.'); return; }
    const dirtyKey = 'phone:' + index;
    if (!editor.base.has(dirtyKey)) editor.base.set(dirtyKey, phones[index]);
    phones[index] = after;
    if (after === editor.base.get(dirtyKey)) editor.fields.delete(dirtyKey);
    else editor.fields.set(dirtyKey, { phone: index, value: after });
    repaintPhones(index, after);
  } else if (brandKey) {
    const brand = brandTarget(brandKey);
    if (!brand) { refuse('The site settings could not be loaded. Reload the office page and try again.'); return; }
    const dirtyKey = 'brand:' + brandKey + '|' + lang;
    if (!editor.base.has(dirtyKey)) editor.base.set(dirtyKey, fieldValue(brand, brandKey, lang));
    const value = brand[brandKey];
    if (typeof value === 'string') brand[brandKey] = after;
    else {
      if (!value || typeof value !== 'object') brand[brandKey] = {};
      brand[brandKey][lang] = after;
    }
    if (after === editor.base.get(dirtyKey)) editor.fields.delete(dirtyKey);
    else editor.fields.set(dirtyKey, { brand: brandKey, lang, value: after });
    el.textContent = after;
    repaintSame(el, after);
  } else {
    const dirtyKey = lang + '|' + el.dataset.i18n;
    if (!editor.base.has(dirtyKey)) editor.base.set(dirtyKey, before);
    if (after === editor.base.get(dirtyKey)) editor.pending.delete(dirtyKey);
    else editor.pending.set(dirtyKey, after);
    el.textContent = after;
    repaintSame(el, after);
  }
  delete el.dataset.sekDisplay;
  updateEditBar();
}

/* Which catalogue field an image belongs to. Returns null for pictures that are part of the
 * design rather than content, such as the small icons. */
function mediaTarget(media) {
  if (!media || typeof media.closest !== 'function') return null;
  const photo = media.closest('[data-photo]');
  // A photograph that fills a whole section behind the page content is replaced from the
  // button in the editor bar. Every click on that section belongs to the wording or the form
  // in front of it, so the picture is not reachable by clicking the page itself.
  if (photo) {
    if (photo.hasAttribute('data-photo-panel')) return null;
    return { kind: 'photo', key: photo.dataset.photo, el: media };
  }
  const tour = media.closest('[data-tour]');
  if (tour) return { kind: 'tour', id: tour.dataset.tour, el: media };
  const stay = media.closest('[data-stay]');
  if (stay) return { kind: 'stay', id: stay.dataset.stay, el: media };
  const film = media.closest('.film');
  if (film) {
    const row = [...film.parentElement.children].indexOf(film);
    return { kind: 'film', index: row, el: media };
  }
  const shot = media.closest('[data-shot]');
  if (shot) return { kind: 'shot', index: Number(shot.dataset.shot), el: media };
  return null;
}

let picker;
function pickPicture(target) {
  if (!picker) {
    picker = document.createElement('input');
    picker.type = 'file';
    picker.accept = 'image/jpeg,image/png,image/webp,image/avif';
    // A display:none input does not open the file chooser in some browsers, so it is kept
    // in the page but out of sight instead.
    picker.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0';
    document.body.appendChild(picker);
  }
  picker.onchange = async () => {
    const file = picker.files && picker.files[0];
    picker.value = '';
    if (!file) return;
    toast('Uploading ' + file.name + '…');
    const res = await call('/api/upload', {
      method: 'POST',
      headers: { 'content-type': file.type },
      body: file,
    }).catch(() => null);
    if (!res || !res.ok) {
      toast('That file was not accepted. Use a JPG, PNG, WebP or AVIF picture.', true);
      return;
    }
    const { url } = await res.json();
    applyPicture(target, url);
    toast('Picture replaced. Press Save changes to publish it.');
  };
  picker.click();
}

function applyPicture(target, url) {
  if (target.kind === 'photo') {
    catalogue.images = catalogue.images || {};
    catalogue.images[target.key] = url;
  } else if (target.kind === 'tour') {
    const t = (catalogue.tours || []).find((x) => x.id === target.id);
    if (t) t.image = url;
  } else if (target.kind === 'stay') {
    const s = (catalogue.stays || []).find((x) => x.id === target.id);
    if (s) s.image = url;
  } else if (target.kind === 'film') {
    const f = (catalogue.films || [])[target.index];
    if (f) f.poster = url;
  } else if (target.kind === 'shot') {
    const p = (catalogue.shots || [])[target.index];
    if (p) { p.src = url; p.big = url; }
  }
  if (target.el.tagName === 'VIDEO') target.el.setAttribute('poster', url);
  else target.el.src = url;
  editor.pictures += 1;
  updateEditBar();
}

function reloadFrame() {
  if (!editor.frame) editor.frame = $('#edit-frame');
  if (!editor.frame) return;
  const lang = editor.lang === 'ar' ? 'ar' : 'en';
  editor.frame.src = 'index.html?edit=1&lang=' + lang;
}

async function saveEditor() {
  finishOpenEdit();
  if (!editDirty()) return;
  catalogue.text = catalogue.text || {};
  for (const [composite, value] of editor.pending) {
    const cut = composite.indexOf('|');
    const lang = composite.slice(0, cut);
    const key = composite.slice(cut + 1);
    catalogue.text[lang] = catalogue.text[lang] || {};
    if (value) catalogue.text[lang][key] = value;
    else delete catalogue.text[lang][key];
  }
  const btn = $('#edit-save');
  btn.textContent = 'Saving…';
  const ok = await publish();
  btn.textContent = 'Save changes';
  if (!ok) return;
  editor.pending.clear();
  editor.fields.clear();
  editor.base.clear();
  editor.pictures = 0;
  updateEditBar();
  reloadFrame();
}

async function discardEditor() {
  finishOpenEdit();
  if (!editDirty()) { toast('Nothing to discard.'); return; }
  if (!confirm('Throw away the changes you have not saved?')) return;
  editor.pending.clear();
  editor.fields.clear();
  editor.base.clear();
  editor.pictures = 0;
  updateEditBar();
  await loadCatalogue();
  reloadFrame();
}

function showEditLang(lang) {
  finishOpenEdit();
  editor.lang = lang === 'ar' ? 'ar' : 'en';
  for (const b of document.querySelectorAll('[data-edit-lang]')) {
    b.setAttribute('aria-pressed', String(b.dataset.editLang === editor.lang));
  }
  reloadFrame();
}

function wireEditor() {
  const frame = $('#edit-frame');
  if (!frame) return;
  editor.frame = frame;
  frame.addEventListener('load', bindFrame);
  bindFrame();
  for (const b of document.querySelectorAll('[data-edit-lang]')) {
    b.addEventListener('click', () => showEditLang(b.dataset.editLang));
  }
  $('#edit-save').addEventListener('click', saveEditor);
  $('#edit-discard').addEventListener('click', discardEditor);
  // The top photograph sits under the headline, so a click on it usually lands on the words.
  // This button is the way to reach it without moving the text out of the way first.
  const heroBtn = $('#edit-hero');
  if (heroBtn) {
    heroBtn.addEventListener('click', () => {
      const doc = editor.frame && editor.frame.contentDocument;
      const el = doc && doc.querySelector('[data-photo="hero"]');
      pickPicture({ kind: 'photo', key: 'hero', el: el || document.createElement('img') });
    });
  }
  updateEditBar();
  window.addEventListener('beforeunload', (e) => {
    if (!editDirty()) return;
    e.preventDefault();
    e.returnValue = '';
  });
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
  applyRole(role);
  $('#gate').style.display = 'none';
  $('#shell').classList.add('on');
  await Promise.all([loadBookings(), loadEnquiries(), loadCatalogue()]);
}

async function boot() {
  if (!API) {
    $('#gate-err').textContent = 'This page has no API address configured.';
    return;
  }
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_STORE) || 'null');
    token = saved && saved.token ? saved.token : '';
    role = saved && saved.role ? saved.role : '';
  } catch { token = ''; role = ''; }

  $('#gate-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = $('#gate-user').value.trim();
    const password = $('#gate-pass').value;
    if (!user || !password) return;
    $('#gate-err').textContent = '';
    const res = await fetch(API + '/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ user, password }),
    }).catch(() => null);
    if (!res) { $('#gate-err').textContent = 'Could not reach the office server.'; return; }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      $('#gate-err').textContent = res.status === 429
        ? 'Too many attempts. Wait fifteen minutes.'
        : 'That user and password were refused.';
      return;
    }
    token = data.token;
    role = data.role;
    try { sessionStorage.setItem(SESSION_STORE, JSON.stringify({ token, role })); } catch { /* ignore */ }
    $('#gate-pass').value = '';
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
  wireEditor();

  if (token) {
    const res = await fetch(API + '/api/me', { headers: { authorization: `Bearer ${token}` } }).catch(() => null);
    if (res && res.ok) {
      const me = await res.json().catch(() => ({}));
      role = me.role || role;
      openOffice();
    } else {
      signOut(res && res.status === 401 ? 'The saved session expired. Sign in again.' : 'Could not reach the office server.');
    }
  }
}

boot();
