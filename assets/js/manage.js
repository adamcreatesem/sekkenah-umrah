/* The page a traveller comes back to. It is deliberately not part of the booking wizard:
 * weeks later the tab is long gone, and all they have is the reference in the confirmation
 * email. Reference plus the phone number they booked with is enough to find it and, if they
 * need to, call it off. */

const meta = document.querySelector('meta[name="sekkenah-api"]');
const API = (meta && meta.content ? meta.content : '').replace(/\/+$/, '');

const STR = {
  en: {
    title: 'Your booking',
    sub: 'Enter the reference from your confirmation and the phone number you booked with. You can see where the booking stands, and cancel it if your plans changed.',
    ref: 'Reference',
    phone: 'Phone number used to book',
    find: 'Find my booking',
    looking: 'Looking…',
    note: 'Nothing is charged online. A cancellation here releases the request and the places. Any deposit already paid is discussed with the office.',
    cancel: 'Cancel this booking',
    cancelling: 'Cancelling…',
    back: 'Back to the website',
    call: 'Rather speak to someone? Call',
    route: 'Route',
    lodge: 'Lodge',
    date: 'Date',
    nights: 'Nights',
    party: 'Party',
    total: 'Total quoted',
    deposit: 'Deposit to hold',
    booked: 'Requested on',
    adults: 'adult(s)',
    children: 'child(ren)',
    infants: 'infant(s)',
    notGiven: 'Not stated',
    notFound: 'We could not find a booking with that reference and phone number. Check the reference on your confirmation, or call the office.',
    needPhone: 'Please enter the phone number you booked with.',
    cannot: 'This booking can no longer be cancelled here. Call the office and we will sort it out.',
    done: 'Cancelled. Nothing was charged. The office will see it on their page.',
    already: 'This booking was already cancelled.',
    ask: 'Cancel this booking? Nothing will be charged, and the office will see it on their page.',
    offline: 'We could not reach the office just now. Try again in a moment, or call the office.',
    slow: 'Too many wrong tries. Wait fifteen minutes, or call the office and we will find it for you.',
    status: { new: 'New request', confirmed: 'Confirmed', deposit: 'Deposit received', travelled: 'Travelled', cancelled: 'Cancelled' },
  },
  ar: {
    title: 'حجزك',
    sub: 'أدخل الرقم المرجعي من رسالة التأكيد ورقم الهاتف الذي حجزت به. يمكنك معرفة حالة الحجز وإلغاؤه إذا تغيّرت خططك.',
    ref: 'الرقم المرجعي',
    phone: 'رقم الهاتف المستخدم في الحجز',
    find: 'ابحث عن حجزي',
    looking: 'جارٍ البحث…',
    note: 'لا يُخصم أي مبلغ عبر الموقع. الإلغاء هنا يحرّر الطلب والمقاعد. أي دفعة دُفعت تُناقش مع المكتب.',
    cancel: 'ألغِ هذا الحجز',
    cancelling: 'جارٍ الإلغاء…',
    back: 'العودة إلى الموقع',
    call: 'تفضّل التحدث إلى أحدهم؟ اتصل على',
    route: 'المسار',
    lodge: 'النزل',
    date: 'التاريخ',
    nights: 'الليالي',
    party: 'المجموعة',
    total: 'الإجمالي المقدّر',
    deposit: 'الدفعة المطلوبة',
    booked: 'تاريخ الطلب',
    adults: 'بالغ',
    children: 'طفل',
    infants: 'رضيع',
    notGiven: 'غير مذكور',
    notFound: 'لم نجد حجزًا بهذا الرقم وهذا الهاتف. تحقّق من الرقم في رسالة التأكيد، أو اتصل بالمكتب.',
    needPhone: 'يرجى إدخال رقم الهاتف الذي حجزت به.',
    cannot: 'لم يعد بالإمكان إلغاء هذا الحجز من هنا. اتصل بالمكتب وسنرتّب الأمر.',
    done: 'أُلغي الحجز. لم يُخصم أي مبلغ، وأُبلغ المكتب.',
    already: 'هذا الحجز ملغى بالفعل.',
    ask: 'هل تريد إلغاء هذا الحجز؟ لن يُخصم أي مبلغ، وسيراه المكتب في صفحته.',
    offline: 'تعذّر الوصول إلى المكتب الآن. حاول بعد قليل، أو اتصل بالمكتب.',
    status: { new: 'طلب جديد', confirmed: 'مؤكد', deposit: 'وصلت الدفعة', travelled: 'سافر', cancelled: 'ملغى' },
  },
};

let lang = 'en';
const $ = (s) => document.querySelector(s);
const s = (k) => STR[lang][k];
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let current = null;

function paint() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = s('title') + ' · Sekkenah';
  document.querySelectorAll('[data-m]').forEach((el) => {
    const text = s(el.dataset.m);
    if (text) el.textContent = text;
  });
  $('#mng-lang').textContent = lang === 'ar' ? 'English' : 'العربية';
  $('#mng-status').textContent = current ? s('status')[current.status] || current.status : '';
  if (current) fill(current);
}

function money(n) {
  return '$' + Math.round(Number(n) || 0).toLocaleString('en-US');
}

function dateText(value) {
  if (!value) return s('notGiven');
  const d = new Date(String(value).length <= 10 ? value + 'T00:00:00' : value);
  if (Number.isNaN(d.getTime())) return esc(value);
  return d.toLocaleDateString(lang === 'ar' ? 'ar-ET' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function party(b) {
  const bits = [b.adults + ' ' + s('adults')];
  if (b.children) bits.push(b.children + ' ' + s('children'));
  if (b.infants) bits.push(b.infants + ' ' + s('infants'));
  return bits.join(' · ');
}

function fill(b) {
  $('#mng-found').hidden = false;
  $('#mng-heading').textContent = b.ref;
  $('#mng-status').dataset.s = b.status;
  $('#mng-status').textContent = s('status')[b.status] || b.status;
  const rows = [];
  if (b.mode === 'stay') {
    rows.push([s('lodge'), b.stay_name || s('notGiven')]);
    rows.push([s('date'), dateText(b.check_in)]);
    if (b.nights) rows.push([s('nights'), b.nights + ' · ' + (b.rooms || 1)]);
  } else {
    rows.push([s('route'), b.tour_name || s('notGiven')]);
    rows.push([s('date'), dateText(b.depart)]);
  }
  rows.push([s('party'), party(b)]);
  rows.push([s('total'), money(b.total)]);
  rows.push([s('deposit'), money(b.deposit)]);
  rows.push([s('booked'), dateText(b.created_at)]);
  $('#mng-rows').innerHTML = rows.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('');

  const cancellable = ['new', 'confirmed', 'deposit'].includes(b.status);
  const btn = $('#mng-cancel');
  btn.hidden = !cancellable;
  btn.disabled = false;
  btn.textContent = s('cancel');
}

function say(message, tone) {
  const el = $('#mng-msg');
  el.textContent = message;
  el.dataset.tone = tone || '';
  el.hidden = false;
}

async function ask(path, body) {
  const res = await fetch(API + path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

$('#mng-find').addEventListener('submit', async (e) => {
  e.preventDefault();
  const ref = $('#mng-ref').value.trim().toUpperCase();
  const phone = $('#mng-phone').value.trim();
  $('#mng-msg').hidden = true;
  if (!phone) { say(s('needPhone')); return; }
  if (!ref) { $('#mng-ref').focus(); return; }
  const btn = $('#mng-submit');
  btn.disabled = true;
  btn.textContent = s('looking');
  try {
    const { status, data } = await ask(`/api/bookings/${encodeURIComponent(ref)}/lookup`, { phone });
    if (status === 200 && data.ok) {
      current = data.booking;
      fill(current);
      paint();
      $('#mng-found').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (status === 400) {
      say(s('needPhone'));
    } else if (status === 429) {
      say(s('slow'));
    } else if (status === 404) {
      $('#mng-found').hidden = true;
      current = null;
      say(s('notFound'));
    } else {
      say(s('offline'));
    }
  } catch {
    say(s('offline'));
  } finally {
    btn.disabled = false;
    btn.textContent = s('find');
  }
});

$('#mng-cancel').addEventListener('click', async () => {
  if (!current) return;
  if (!confirm(s('ask'))) return;
  const btn = $('#mng-cancel');
  btn.disabled = true;
  btn.textContent = s('cancelling');
  try {
    const { status, data } = await ask(`/api/bookings/${encodeURIComponent(current.ref)}/cancel`, {
      phone: $('#mng-phone').value.trim(),
    });
    if (status === 200 && data.ok) {
      current.status = 'cancelled';
      fill(current);
      say(data.already ? s('already') : s('done'), 'ok');
    } else if (status === 409) {
      current.status = data.status || current.status;
      fill(current);
      say(s('cannot'));
    } else if (status === 429) {
      say(s('slow'));
    } else if (status === 404) {
      say(s('notFound'));
    } else {
      say(s('offline'));
    }
  } catch {
    say(s('offline'));
  } finally {
    btn.disabled = false;
    btn.textContent = s('cancel');
  }
});

$('#mng-lang').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  paint();
  const msg = $('#mng-msg');
  if (!msg.hidden) msg.hidden = true;
});

const prefill = new URLSearchParams(location.search).get('ref');
if (prefill) {
  $('#mng-ref').value = prefill.toUpperCase();
  $('#mng-phone').focus();
}
paint();
