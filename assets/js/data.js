/* Sekkenah — catalogue data.
 *
 * Everything a visitor can book lives here so the page, the filter row, the detail
 * drawer and the booking wizard all read from one source. Prices are DRAFT figures for
 * this preview: the client's real inventory and rates replace this file wholesale.
 * Bilingual fields are always { en, ar } so a language switch never leaves half a card
 * in the other language.
 */

export const BRAND = {
  name: { en: 'Sekkenah', ar: 'سكينة' },
  legal: { en: 'Sekkenah Tour & Travel', ar: 'سكينة للسياحة والسفر' },
  phones: ['+251 95 960 7070', '+251 95 960 8080'],
  whatsapp: '251959607070',
  telegram: 'sekkenahumrah',
  email: 'hello@sekkenah.com',
  address: {
    en: 'Jemo Michael, Megfira Mall, 4th floor, Addis Ababa',
    ar: 'جيمو ميخائيل، مجمع مغفيرا، الطابق الرابع، أديس أبابا',
  },
  mapQuery: 'XP9C%2BQG9%2C%20Addis%20Ababa',
  social: {
    tiktok: 'https://www.tiktok.com/@sekkenah.umra.serv',
    instagram: 'https://www.instagram.com/sekinah.umrah/',
  },
  // Indicative only. The invoice is always struck in ETB at the day's rate.
  etbPerUsd: 156,
};

export const JOURNEYS = [
  {
    id: 'rihla-11',
    name: { en: 'Rihla Umrah', ar: 'رحلة العمرة' },
    tag: { en: 'Signature', ar: 'الرحلة المميّزة' },
    type: 'umrah',
    nights: 11, makkah: 7, madinah: 4,
    tier: '4★',
    hotel: { en: 'Haram-adjacent 4-star hotels', ar: 'فنادق أربع نجوم قريبة من الحرم' },
    price: 1850,
    seats: 14,
    depart: '2026-11-02',
    months: [11, 12],
    image: 'assets/img/kaaba-card.jpg',
    blurb: {
      en: 'Our flagship round: seven nights in Makkah, four in Madinah, hotels within walking distance and a guide with the group from Addis.',
      ar: 'رحلتنا الأساسية: سبع ليالٍ في مكة وأربع في المدينة، فنادق على مسافة قريبة سيرًا، ومرشد مع المجموعة من أديس أبابا.',
    },
    includes: [
      { en: 'Return airfare Addis Ababa – Jeddah', ar: 'تذاكر طيران ذهابًا وإيابًا أديس أبابا – جدة' },
      { en: 'Umrah visa and processing', ar: 'تأشيرة العمرة وإجراءاتها' },
      { en: '7 nights Makkah, 4 nights Madinah', ar: '٧ ليالٍ مكة و٤ ليالٍ المدينة' },
      { en: 'Airport and inter-city transfers', ar: 'التنقلات من المطار وبين المدينتين' },
      { en: 'Guided ziyarah in both cities', ar: 'زيارة الأماكن المقدسة في المدينتين' },
      { en: 'Group guide in Amharic', ar: 'مرشد للمجموعة باللغة الأمهرية' },
    ],
  },
  {
    id: 'family-10',
    name: { en: 'Family Umrah', ar: 'عمرة العائلة' },
    tag: { en: 'For families', ar: 'للعائلات' },
    type: 'family',
    nights: 10, makkah: 6, madinah: 4,
    tier: '4★',
    hotel: { en: 'Family rooms, 4-star', ar: 'غرف عائلية، أربع نجوم' },
    price: 1650,
    seats: 22,
    depart: '2026-12-18',
    months: [12, 1],
    image: 'assets/img/crowd-gold.jpg',
    blurb: {
      en: 'Built around family rooms and a slower pace: shorter walking days, meals at the hotel, and a guide who keeps the group together.',
      ar: 'مصمّمة حول الغرف العائلية ووتيرة أهدأ: أيام تنقّل أقصر، ووجبات في الفندق، ومرشد يحافظ على المجموعة معًا.',
    },
    includes: [
      { en: 'Return airfare Addis Ababa – Jeddah', ar: 'تذاكر طيران ذهابًا وإيابًا أديس أبابا – جدة' },
      { en: 'Umrah visa for every traveller', ar: 'تأشيرة العمرة لكل مسافر' },
      { en: 'Quad and triple family rooms', ar: 'غرف عائلية رباعية وثلاثية' },
      { en: 'Half-board meal plan', ar: 'نظام إقامة مع وجبتين' },
      { en: 'Child seats on transfers', ar: 'مقاعد أطفال في التنقلات' },
      { en: 'Group guide in Amharic and Afaan Oromo', ar: 'مرشد باللغتين الأمهرية والأورومية' },
    ],
  },
  {
    id: 'ramadan-10',
    name: { en: 'Ramadan — Last Ten', ar: 'رمضان — العشر الأواخر' },
    tag: { en: 'Ramadan', ar: 'رمضان' },
    type: 'ramadan',
    nights: 12, makkah: 8, madinah: 4,
    tier: '4★ superior',
    hotel: { en: 'Walking distance, iftar at the hotel', ar: 'على مسافة قريبة، إفطار في الفندق' },
    price: 2450,
    seats: 9,
    depart: '2027-03-08',
    months: [3],
    image: 'assets/img/arcade.jpg',
    blurb: {
      en: 'The last ten nights in Makkah, with suhoor and iftar arranged and the group seated together for qiyam.',
      ar: 'العشر الأواخر في مكة، مع ترتيب السحور والإفطار وجلوس المجموعة معًا للقيام.',
    },
    includes: [
      { en: 'Return airfare Addis Ababa – Jeddah', ar: 'تذاكر طيران ذهابًا وإيابًا أديس أبابا – جدة' },
      { en: 'Umrah visa and processing', ar: 'تأشيرة العمرة وإجراءاتها' },
      { en: 'Suhoor and iftar daily', ar: 'السحور والإفطار يوميًا' },
      { en: '8 nights Makkah, 4 nights Madinah', ar: '٨ ليالٍ مكة و٤ ليالٍ المدينة' },
      { en: 'Guided qiyam and ziyarah', ar: 'قيام وزيارة بإرشاد' },
      { en: 'Group guide in Amharic', ar: 'مرشد للمجموعة باللغة الأمهرية' },
    ],
  },
  {
    id: 'oromo-11',
    name: { en: 'Afaan Oromo Group', ar: 'مجموعة بالأورومية' },
    tag: { en: 'With a scholar', ar: 'مع شيخ' },
    type: 'group',
    nights: 11, makkah: 7, madinah: 4,
    tier: '4★',
    hotel: { en: '4-star, Haram-adjacent', ar: 'أربع نجوم قرب الحرم' },
    price: 1980,
    seats: 18,
    depart: '2026-11-21',
    months: [11, 12],
    image: 'assets/img/canopy.jpg',
    blurb: {
      en: 'Every lesson, every instruction and every ziyarah in Afaan Oromo, led by a scholar who travels with the group.',
      ar: 'كل درس وكل إرشاد وكل زيارة بالأورومية، بقيادة شيخ يسافر مع المجموعة.',
    },
    includes: [
      { en: 'Return airfare Addis Ababa – Jeddah', ar: 'تذاكر طيران ذهابًا وإيابًا أديس أبابا – جدة' },
      { en: 'Umrah visa and processing', ar: 'تأشيرة العمرة وإجراءاتها' },
      { en: 'Scholar travelling with the group', ar: 'شيخ يسافر مع المجموعة' },
      { en: 'Daily lessons in Afaan Oromo', ar: 'دروس يومية بالأورومية' },
      { en: 'Departure from Adama available', ar: 'إمكانية الانطلاق من أداما' },
      { en: 'Guided ziyarah in both cities', ar: 'زيارة الأماكن المقدسة في المدينتين' },
    ],
  },
  {
    id: 'visa-year',
    name: { en: 'One-Year Umrah Visa', ar: 'تأشيرة عمرة لسنة' },
    tag: { en: 'Visa only', ar: 'التأشيرة فقط' },
    type: 'visa',
    nights: 0, makkah: 0, madinah: 0,
    tier: 'Documents',
    hotel: { en: 'No hotel included', ar: 'دون فندق' },
    price: 340,
    seats: 40,
    depart: '2026-11-01',
    months: [11, 12, 1, 2],
    image: 'assets/img/kaaba-day.jpg',
    blurb: {
      en: 'A twelve-month multiple-entry Umrah visa, processed in our office. Travel whenever you like, for as long as the visa allows.',
      ar: 'تأشيرة عمرة متعددة الدخول لمدة اثني عشر شهرًا، تُنجَز في مكتبنا. سافر متى شئت ضمن مدة التأشيرة.',
    },
    includes: [
      { en: 'Visa application and submission', ar: 'تقديم الطلب وإرساله' },
      { en: 'Insurance included', ar: 'التأمين مشمول' },
      { en: 'Document checklist and review', ar: 'قائمة المستندات ومراجعتها' },
      { en: 'Status updates by phone', ar: 'تحديثات الحالة هاتفيًا' },
    ],
  },
  {
    id: 'premium-8',
    name: { en: 'Haram View — Premium', ar: 'إطلالة على الحرم — بريميوم' },
    tag: { en: '5-star', ar: 'خمس نجوم' },
    type: 'umrah',
    nights: 8, makkah: 5, madinah: 3,
    tier: '5★',
    hotel: { en: '5-star with Haram view', ar: 'خمس نجوم بإطلالة على الحرم' },
    price: 3200,
    seats: 6,
    depart: '2026-12-05',
    months: [12, 1],
    image: 'assets/img/dome.jpg',
    blurb: {
      en: 'The short, quiet version: five nights facing the Haram, three beside the Prophet’s Mosque, private transfers throughout.',
      ar: 'النسخة القصيرة والهادئة: خمس ليالٍ مطلة على الحرم، وثلاث بجوار المسجد النبوي، وتنقلات خاصة طوال الرحلة.',
    },
    includes: [
      { en: 'Return airfare, business class option', ar: 'تذاكر ذهابًا وإيابًا، مع خيار درجة الأعمال' },
      { en: 'Umrah visa and processing', ar: 'تأشيرة العمرة وإجراءاتها' },
      { en: 'Haram-view rooms', ar: 'غرف بإطلالة على الحرم' },
      { en: 'Private car and driver', ar: 'سيارة وسائق خاص' },
      { en: 'Private ziyarah with a guide', ar: 'زيارة خاصة مع مرشد' },
      { en: 'Breakfast daily', ar: 'إفطار يومي' },
    ],
  },
];

/* Ethiopia tours. Same shape as a journey so the drawer, the wizard and the WhatsApp
 * message all handle them without a second code path; the only differences are an
 * explicit itinerary (a tour is not a nights-split of two cities) and a day count. */
export const TOURS = [
  {
    id: 'tour-rift-lakes',
    name: { en: 'Rift Valley Lakes', ar: 'بحيرات الوادي المتصدّع' },
    tag: { en: 'Lakes & resorts', ar: 'بحيرات ومنتجعات' },
    type: 'tour', days: 3, nights: 2, price: 420, seats: 12, depart: '2026-11-13',
    image: 'assets/img/tour-rift-lakes.jpg',
    blurb: {
      en: 'Ziway, Abijatta-Shalla and Langano in one run south: boat to the bird islands, the hot springs on the Shalla shore, and a swim in the one Rift lake that is safe to swim in.',
      ar: 'زيواي وأبيجاتا-شالا ولانغانو في رحلة واحدة جنوبًا: قارب إلى جزر الطيور، والينابيع الساخنة على ضفة شالا، وسباحة في البحيرة الوحيدة الآمنة للسباحة في الوادي المتصدّع.',
    },
    includes: [
      { en: 'Car, driver and guide from Addis', ar: 'سيارة وسائق ومرشد من أديس' },
      { en: 'Two nights in a lakeside lodge', ar: 'ليلتان في نزل على البحيرة' },
      { en: 'Boat trip on Lake Ziway', ar: 'رحلة قارب في بحيرة زيواي' },
      { en: 'Abijatta-Shalla park fees', ar: 'رسوم منتزه أبيجاتا-شالا' },
      { en: 'Breakfast daily', ar: 'إفطار يومي' },
    ],
    daysList: [
      { t: { en: 'Addis → Ziway → Langano', ar: 'أديس ← زيواي ← لانغانو' }, b: { en: 'Drive down the Rift, boat out to the bird islands on Ziway, then on to Langano for the night.', ar: 'القيادة جنوبًا في الوادي، وقارب إلى جزر الطيور في زيواي، ثم إلى لانغانو للمبيت.' } },
      { t: { en: 'Abijatta-Shalla', ar: 'أبيجاتا-شالا' }, b: { en: 'Morning at the hot springs and the flamingo flats, afternoon free on the lake.', ar: 'صباح في الينابيع الساخنة ومسطحات الفلامنغو، وبعد ظهر حر على البحيرة.' } },
      { t: { en: 'Langano → Addis', ar: 'لانغانو ← أديس' }, b: { en: 'A swim before breakfast, then the drive back through Ziway.', ar: 'سباحة قبل الإفطار، ثم العودة عبر زيواي.' } },
    ],
  },
  {
    id: 'tour-hawassa',
    name: { en: 'Hawassa & Wondo Genet', ar: 'هواسا وووندو جينيت' },
    tag: { en: 'Lakes & resorts', ar: 'بحيرات ومنتجعات' },
    type: 'tour', days: 2, nights: 1, price: 340, seats: 14, depart: '2026-11-21',
    image: 'assets/img/tour-hawassa.jpg',
    blurb: {
      en: 'The fish market at Amora Gedel, the view from Tabor Hill, and the hot springs at Wondo Genet under the forest canopy.',
      ar: 'سوق السمك في أمورا غيديل، والإطلالة من تل تابور، والينابيع الساخنة في ووندو جينيت تحت ظل الغابة.',
    },
    includes: [
      { en: 'Road transfer Addis – Hawassa', ar: 'نقل بري أديس – هواسا' },
      { en: 'One night in a lakeside hotel', ar: 'ليلة في فندق على البحيرة' },
      { en: 'Boat trip on Lake Hawassa', ar: 'رحلة قارب في بحيرة هواسا' },
      { en: 'Wondo Genet entry and guide', ar: 'دخول ووندو جينيت والمرشد' },
      { en: 'Breakfast daily', ar: 'إفطار يومي' },
    ],
    daysList: [
      { t: { en: 'Addis → Hawassa', ar: 'أديس ← هواسا' }, b: { en: 'Drive south through Ziway, then the fish market at Amora Gedel and Tabor Hill before sunset.', ar: 'القيادة جنوبًا عبر زيواي، ثم سوق السمك في أمورا غيديل وتل تابور قبل الغروب.' } },
      { t: { en: 'Wondo Genet, then home', ar: 'ووندو جينيت ثم العودة' }, b: { en: 'Morning in the hot springs and the forest, afternoon drive back to Addis.', ar: 'صباح في الينابيع الساخنة والغابة، وقيادة بعد الظهر إلى أديس.' } },
    ],
  },
  {
    id: 'tour-bishoftu',
    name: { en: 'Bishoftu Crater Lakes', ar: 'بحيرات بيشوفتو الفوهية' },
    tag: { en: 'Day trip', ar: 'رحلة يوم' },
    type: 'tour', days: 1, nights: 0, price: 120, seats: 8, depart: '2026-11-08',
    image: 'assets/img/tour-bishoftu.jpg',
    blurb: {
      en: 'A string of crater lakes an hour from Addis: the rim walk at Hora, a boat on Bishoftu, and lunch by the water.',
      ar: 'سلسلة بحيرات فوهية على بعد ساعة من أديس: المشي على حافة هورا، وقارب في بيشوفتو، وغداء بجوار الماء.',
    },
    includes: [
      { en: 'Car and driver from Addis', ar: 'سيارة وسائق من أديس' },
      { en: 'Local guide', ar: 'مرشد محلي' },
      { en: 'Lake entries', ar: 'رسوم دخول البحيرات' },
      { en: 'Lunch by the lake', ar: 'غداء على البحيرة' },
    ],
    daysList: [
      { t: { en: 'Addis → Bishoftu → Addis', ar: 'أديس ← بيشوفتو ← أديس' }, b: { en: 'Morning drive out, the crater rim at Hora, a boat on Bishoftu and a long lunch, back before dark.', ar: 'قيادة صباحية، وحافة الفوهة في هورا، وقارب في بيشوفتو وغداء طويل، والعودة قبل الغروب.' } },
    ],
  },
  {
    id: 'tour-arba-minch',
    name: { en: 'Arba Minch & Nech Sar', ar: 'أربا منش ونيش سار' },
    tag: { en: 'Lakes & wildlife', ar: 'بحيرات وحياة برية' },
    type: 'tour', days: 3, nights: 2, price: 560, seats: 10, depart: '2026-11-27',
    image: 'assets/img/tour-arba-minch.jpg',
    blurb: {
      en: 'Lake Chamo by boat for the crocodile market and the hippos, the plains and Forty Springs of Nech Sar, and a Dorze village on the ridge above.',
      ar: 'بحيرة تشامو بالقارب لسوق التماسيح والبراري وأربعين نبعًا في نيش سار، وقرية دورزي على الحافة فوق.',
    },
    includes: [
      { en: 'Return flights Addis – Arba Minch', ar: 'تذاكر طيران ذهابًا وإيابًا أديس – أربا منش' },
      { en: 'Two nights, breakfast included', ar: 'ليلتان مع الإفطار' },
      { en: 'Boat trip on Lake Chamo', ar: 'رحلة قارب في بحيرة تشامو' },
      { en: 'Nech Sar fees and scout', ar: 'رسوم نيش سار والمرافق' },
      { en: 'Dorze village visit', ar: 'زيارة قرية دورزي' },
    ],
    daysList: [
      { t: { en: 'Addis → Arba Minch', ar: 'أديس ← أربا منش' }, b: { en: 'Morning flight, check in, and the lake shore in the afternoon.', ar: 'رحلة صباحية، تسجيل الوصول، وضفة البحيرة بعد الظهر.' } },
      { t: { en: 'Chamo and Nech Sar', ar: 'تشامو ونيش سار' }, b: { en: 'Boat to the crocodile market and the hippo pods, then the park plains and the Forty Springs.', ar: 'قارب إلى سوق التماسيح ومجموعات أفراس النهر، ثم سهول المنتزه وأربعون نبعًا.' } },
      { t: { en: 'Dorze, then home', ar: 'دورزي ثم العودة' }, b: { en: 'The Dorze village and its weaving, then the afternoon flight.', ar: 'قرية دورزي ونسيجها، ثم رحلة بعد الظهر.' } },
    ],
  },
  {
    id: 'tour-wonchi',
    name: { en: 'Wonchi Crater Lake', ar: 'بحيرة ونتشي الفوهية' },
    tag: { en: 'Lakes & resorts', ar: 'بحيرات ومنتجعات' },
    type: 'tour', days: 2, nights: 1, price: 290, seats: 10, depart: '2026-11-15',
    image: 'assets/img/tour-wonchi.jpg',
    blurb: {
      en: 'A crater lake at 3,380 m between Ambo and Weliso: walk or ride down the rim, boat to the island monastery, and the hot springs and waterfalls on the crater floor.',
      ar: 'بحيرة فوهية على ارتفاع ٣٣٨٠ م بين أمبو وويليسو: نزول على الحافة سيرًا أو على الدابة، وقارب إلى دير الجزيرة، وينابيع ساخنة وشلالات في قاع الفوهة.',
    },
    includes: [
      { en: 'Car and driver from Addis', ar: 'سيارة وسائق من أديس' },
      { en: 'One night at the eco lodge', ar: 'ليلة في النزل البيئي' },
      { en: 'Boat to the island monastery', ar: 'قارب إلى دير الجزيرة' },
      { en: 'Guide and crater entry', ar: 'مرشد ودخول الفوهة' },
      { en: 'Dinner and breakfast', ar: 'عشاء وإفطار' },
    ],
    daysList: [
      { t: { en: 'Addis → Wonchi', ar: 'أديس ← ونتشي' }, b: { en: 'Drive west through Ambo, then down the crater rim to the lodge for the night.', ar: 'القيادة غربًا عبر أمبو، ثم النزول على حافة الفوهة إلى النزل للمبيت.' } },
      { t: { en: 'The crater floor, then home', ar: 'قاع الفوهة ثم العودة' }, b: { en: 'Boat to the island monastery, the hot springs and the waterfall, then the drive back.', ar: 'قارب إلى دير الجزيرة، والينابيع الساخنة والشلال، ثم العودة.' } },
    ],
  },
  {
    id: 'tour-omo',
    name: { en: 'Omo Valley', ar: 'وادي أومو' },
    tag: { en: 'Culture', ar: 'ثقافة' },
    type: 'tour', days: 5, nights: 4, price: 980, seats: 6, depart: '2026-12-04',
    image: 'assets/img/tour-omo.jpg',
    blurb: {
      en: 'The South Omo road — Jinka, Turmi and Omorate — with a local guide, a 4×4, and the market days if the dates fall right.',
      ar: 'طريق جنوب أومو — جينكا وتورمي وأوموراتي — مع مرشد محلي وسيارة دفع رباعي وأيام الأسواق إن وافقت التواريخ.',
    },
    includes: [
      { en: 'Return flights Addis – Jinka', ar: 'تذاكر طيران ذهابًا وإيابًا أديس – جينكا' },
      { en: '4×4 with driver throughout', ar: 'دفع رباعي مع سائق طوال الرحلة' },
      { en: 'Local guide and translator', ar: 'مرشد محلي ومترجم' },
      { en: 'Four nights in lodges', ar: 'أربع ليالٍ في النزل' },
      { en: 'Park and village fees', ar: 'رسوم المنتزهات والقرى' },
    ],
    daysList: [
      { t: { en: 'Addis → Jinka', ar: 'أديس ← جينكا' }, b: { en: 'Morning flight south, then the Jinka museum and the market if it is a market day.', ar: 'رحلة صباحية جنوبًا، ثم متحف جينكا والسوق إن كان يوم سوق.' } },
      { t: { en: 'Jinka → Turmi', ar: 'جينكا ← تورمي' }, b: { en: 'Down through Key Afer and the Hamer country to Turmi.', ar: 'النزول عبر كي أفر وأرض الهامر إلى تورمي.' } },
      { t: { en: 'Turmi and Omorate', ar: 'تورمي وأوموراتي' }, b: { en: 'The Omo river crossing at Omorate, back for the market or the evening at the lodge.', ar: 'عبور نهر أومو في أوموراتي، والعودة للسوق أو للمساء في النزل.' } },
      { t: { en: 'Karo and the river', ar: 'كارو والنهر' }, b: { en: 'Up to the Karo villages above the Omo, and the view over the bend.', ar: 'الصعود إلى قرى كارو فوق أومو، والإطلالة على المنحنى.' } },
      { t: { en: 'Back to Addis', ar: 'العودة إلى أديس' }, b: { en: 'Drive to Jinka for the afternoon flight.', ar: 'القيادة إلى جينكا لرحلة بعد الظهر.' } },
    ],
  },
  {
    id: 'tour-harar',
    name: { en: 'Harar', ar: 'هرر' },
    tag: { en: 'Culture', ar: 'ثقافة' },
    type: 'tour', days: 2, nights: 1, price: 360, seats: 12, depart: '2026-11-14',
    image: 'assets/img/tour-harar.jpg',
    blurb: {
      en: 'Inside the Jugol wall: the markets and the shrines, the old houses with their walls of plates, and the hyena feeding at dusk outside the gate.',
      ar: 'داخل سور جوغول: الأسواق والمقامات، والبيوت القديمة بجدرانها المزينة بالأطباق، وإطعام الضباع عند الغروب خارج الباب.',
    },
    includes: [
      { en: 'Return flights Addis – Dire Dawa', ar: 'تذاكر طيران ذهابًا وإيابًا أديس – ديري داوا' },
      { en: 'Road transfer to Harar', ar: 'نقل بري إلى هرر' },
      { en: 'One night inside the wall', ar: 'ليلة داخل السور' },
      { en: 'Guide and site entries', ar: 'مرشد ودخول المواقع' },
      { en: 'Breakfast daily', ar: 'إفطار يومي' },
    ],
    daysList: [
      { t: { en: 'Addis → Dire Dawa → Harar', ar: 'أديس ← ديري داوا ← هرر' }, b: { en: 'Morning flight, the road up to Harar, and the old city on foot before the hyena feeding at dusk.', ar: 'رحلة صباحية، والطريق إلى هرر، والمدينة القديمة سيرًا قبل إطعام الضباع عند الغروب.' } },
      { t: { en: 'Markets, then home', ar: 'الأسواق ثم العودة' }, b: { en: 'The spice market and the shrines in the morning, then the afternoon flight from Dire Dawa.', ar: 'سوق البهارات والمقامات في الصباح، ثم رحلة بعد الظهر من ديري داوا.' } },
    ],
  },
  {
    id: 'tour-sof-omar',
    name: { en: 'Sof Omar Caves', ar: 'كهوف سوف عمر' },
    tag: { en: 'Caves & pilgrimage', ar: 'كهوف وزيارة' },
    type: 'tour', days: 2, nights: 1, price: 390, seats: 8, depart: '2026-12-11',
    image: 'assets/img/tour-sof-omar.jpg',
    blurb: {
      en: 'The Web river cutting fifteen kilometres through limestone, and the shrines cut into the chambers — a pilgrimage site long before it was a tour.',
      ar: 'نهر ويب يشق خمسة عشر كيلومترًا في الحجر الجيري، ومقامات منحوتة في القاعات — موقع زيارة قبل أن يصير مقصدًا سياحيًا بزمن طويل.',
    },
    includes: [
      { en: 'Return flights Addis – Robe', ar: 'تذاكر طيران ذهابًا وإيابًا أديس – روبي' },
      { en: '4×4 to the caves and back', ar: 'دفع رباعي إلى الكهوف والعودة' },
      { en: 'One night in Goba', ar: 'ليلة في غوبا' },
      { en: 'Guide, lamps and entry', ar: 'مرشد ومصابيح ودخول' },
    ],
    daysList: [
      { t: { en: 'Addis → Robe → Sof Omar', ar: 'أديس ← روبي ← سوف عمر' }, b: { en: 'Morning flight, then the road south to the cave mouth and the first chambers before dark.', ar: 'رحلة صباحية، ثم الطريق جنوبًا إلى فم الكهف وأول القاعات قبل حلول الظلام.' } },
      { t: { en: 'Goba, then home', ar: 'غوبا ثم العودة' }, b: { en: 'The underground river in the morning, then back through Goba for the afternoon flight.', ar: 'النهر الجوفي في الصباح، ثم العودة عبر غوبا لرحلة بعد الظهر.' } },
    ],
  },
  {
    id: 'tour-lalibela',
    name: { en: 'Lalibela', ar: 'لاليبيلا' },
    tag: { en: 'Heritage', ar: 'تراث' },
    type: 'tour', days: 3, nights: 2, price: 520, seats: 12, depart: '2026-11-14',
    image: 'assets/img/tour-lalibela.jpg',
    blurb: {
      en: 'Eleven churches cut down into the rock in the twelfth century, and the quiet hill town around them.',
      ar: 'إحدى عشرة كنيسة منحوتة في الصخر في القرن الثاني عشر، والبلدة الهادئة على التل حولها.',
    },
    includes: [
      { en: 'Return flights Addis Ababa – Lalibela', ar: 'تذاكر طيران ذهابًا وإيابًا أديس أبابا – لاليبيلا' },
      { en: 'Two nights, breakfast included', ar: 'ليلتان مع الإفطار' },
      { en: 'Guide and all church entries', ar: 'مرشد ودخول جميع الكنائس' },
      { en: 'Airport transfers', ar: 'التنقلات من المطار' },
    ],
    daysList: [
      { t: { en: 'Addis → Lalibela', ar: 'أديس ← لاليبيلا' }, b: { en: 'Morning flight, check in, and the northern cluster of churches before sunset.', ar: 'رحلة صباحية، تسجيل الوصول، ومجموعة الكنائس الشمالية قبل الغروب.' } },
      { t: { en: 'Bete Giyorgis and the mule path', ar: 'بيتي جيورجيس ودرب البغال' }, b: { en: 'The cross-shaped church in its pit, then the trail up to Asheton Maryam.', ar: 'الكنيسة الصليبية في حفرتها، ثم الدرب إلى أشيتون مريم.' } },
      { t: { en: 'Market, then the flight home', ar: 'السوق ثم العودة' }, b: { en: 'The Saturday market if the dates line up, and the afternoon flight back.', ar: 'سوق السبت إن وافقت التواريخ، ورحلة العودة بعد الظهر.' } },
    ],
  },
  {
    id: 'tour-simien',
    name: { en: 'Simien Mountains', ar: 'جبال سِميِن' },
    tag: { en: 'Trekking', ar: 'مشي جبلي' },
    type: 'tour', days: 4, nights: 3, price: 690, seats: 10, depart: '2026-11-27',
    image: 'assets/img/tour-simien.jpg',
    blurb: {
      en: 'The escarpment above Gondar, gelada monkeys in the morning, and walks between the lodges.',
      ar: 'الجرف فوق غوندار، وقرد الجلادا في الصباح، ومسيرات بين المخيمات.',
    },
    includes: [
      { en: 'Return flights and road transfer to Debark', ar: 'تذاكر طيران ونقل بري إلى دبارك' },
      { en: 'Three nights in lodges and camps', ar: 'ثلاث ليالٍ في النزل والمخيمات' },
      { en: 'Park permits and scout', ar: 'تصاريح المنتزه والمرافق' },
      { en: 'All meals on the trek', ar: 'جميع الوجبات أثناء المشي' },
    ],
    daysList: [
      { t: { en: 'Gondar → Debark', ar: 'غوندار ← دبارك' }, b: { en: 'Fly north, drive up to the park gate, walk to Sankaber.', ar: 'الطيران شمالًا، ثم القيادة إلى بوابة المنتزه، والمشي إلى سانكابر.' } },
      { t: { en: 'Sankaber → Geech', ar: 'سانكابر ← جيتش' }, b: { en: 'Six hours along the escarpment, gelada troops on the way.', ar: 'ست ساعات على طول الجرف، مع قطعان الجلادا في الطريق.' } },
      { t: { en: 'Geech to Imet Gogo', ar: 'جيتش إلى إيميت غوغو' }, b: { en: 'The viewpoint at 3,926 m, back to Geech for the night.', ar: 'المطل على ارتفاع ٣٩٢٦ م، ثم العودة إلى جيتش للمبيت.' } },
      { t: { en: 'Down and back to Addis', ar: 'النزول والعودة' }, b: { en: 'Walk out to Chenek, drive to Gondar, evening flight.', ar: 'المشي إلى تشينيك، والقيادة إلى غوندار، ورحلة مسائية.' } },
    ],
  },
  {
    id: 'tour-bale',
    name: { en: 'Bale Mountains', ar: 'جبال بالي' },
    tag: { en: 'Wildlife', ar: 'حياة برية' },
    type: 'tour', days: 3, nights: 2, price: 480, seats: 12, depart: '2026-12-04',
    image: 'assets/img/tour-bale.jpg',
    blurb: {
      en: 'The Sanetti plateau by road, Ethiopian wolves at dawn, and the Harenna forest on the far side.',
      ar: 'هضبة سانيتي بالطريق، والذئب الإثيوبي عند الفجر، وغابة هارينا على الجانب الآخر.',
    },
    includes: [
      { en: 'Return flights Addis – Robe', ar: 'تذاكر طيران ذهابًا وإيابًا أديس – روبي' },
      { en: 'Two nights in Dinsho', ar: 'ليلتان في دينشو' },
      { en: 'Park fees and guide', ar: 'رسوم المنتزه والمرشد' },
      { en: 'Full board', ar: 'إقامة كاملة' },
    ],
    daysList: [
      { t: { en: 'Addis → Dinsho', ar: 'أديس ← دينشو' }, b: { en: 'Flight to Robe, drive to the park headquarters, afternoon walk.', ar: 'الطيران إلى روبي، والقيادة إلى مقر المنتزه، ثم مسيرة بعد الظهر.' } },
      { t: { en: 'Sanetti plateau', ar: 'هضبة سانيتي' }, b: { en: 'The highest road in Africa, wolves and giant lobelia, then Harenna forest.', ar: 'أعلى طريق في إفريقيا، والذئاب واللوبيليا العمالقة، ثم غابة هارينا.' } },
      { t: { en: 'Back to Addis', ar: 'العودة إلى أديس' }, b: { en: 'Morning at the hot springs, afternoon flight.', ar: 'صباح في الينابيع الساخنة، ورحلة بعد الظهر.' } },
    ],
  },
  {
    id: 'tour-danakil',
    name: { en: 'Danakil Depression', ar: 'منخفض الدناكل' },
    tag: { en: 'Expedition', ar: 'رحلة استكشافية' },
    type: 'tour', days: 4, nights: 3, price: 820, seats: 8, depart: '2026-12-11',
    image: 'assets/img/tour-danakil.jpg',
    blurb: {
      en: 'Sulphur terraces at Dallol, the salt flats at Assale, and the caravans that still cut the salt by hand.',
      ar: 'مدرجات الكبريت في دالول، ومسطحات الملح في أسالي، والقوافل التي لا تزال تقطع الملح باليد.',
    },
    includes: [
      { en: 'Return flights Addis – Semera', ar: 'تذاكر طيران ذهابًا وإيابًا أديس – سيميرا' },
      { en: '4x4, driver and cook', ar: 'سيارة دفع رباعي وسائق وطاهٍ' },
      { en: 'Permits and police escort', ar: 'التصاريح والمرافقة الأمنية' },
      { en: 'Camping equipment and all meals', ar: 'معدات التخييم وجميع الوجبات' },
    ],
    daysList: [
      { t: { en: 'Addis → Semera → Hamedela', ar: 'أديس ← سيميرا ← حامديلا' }, b: { en: 'Flight, then the drive down onto the salt plain before dark.', ar: 'الطيران، ثم النزول إلى سهل الملح قبل حلول الظلام.' } },
      { t: { en: 'Dallol', ar: 'دالول' }, b: { en: 'The sulphur springs at first light, then the salt caravans at Assale.', ar: 'ينابيع الكبريت مع أول الضوء، ثم قوافل الملح في أسالي.' } },
      { t: { en: 'Lake Afrera', ar: 'بحيرة أفريرا' }, b: { en: 'The salt lake and its hot springs, a night at the camp.', ar: 'بحيرة الملح وينابيعها الساخنة، وليلة في المخيم.' } },
      { t: { en: 'Back north', ar: 'العودة شمالًا' }, b: { en: 'Drive out to Semera and the evening flight.', ar: 'القيادة إلى سيميرا ورحلة المساء.' } },
    ],
  },
  {
    id: 'tour-gondar',
    name: { en: 'Gondar & Lake Tana', ar: 'غوندار وبحيرة تانا' },
    tag: { en: 'History', ar: 'تاريخ' },
    type: 'tour', days: 3, nights: 2, price: 560, seats: 14, depart: '2026-11-20',
    image: 'assets/img/tour-gondar.jpg',
    blurb: {
      en: 'The castle compound at Fasil Ghebbi, the painted ceiling at Debre Berhan Selassie, and the island monasteries by boat.',
      ar: 'مجمع القلاع في فاسيل غيبي، والسقف المرسوم في دبرا برهان سيلاسي، وأديرة الجزر بالقارب.',
    },
    includes: [
      { en: 'Return flights Addis – Bahir Dar', ar: 'تذاكر طيران ذهابًا وإيابًا أديس – بحر دار' },
      { en: 'Two nights on the lake shore', ar: 'ليلتان على ضفة البحيرة' },
      { en: 'Boat to the monasteries', ar: 'قارب إلى الأديرة' },
      { en: 'Guide and all entries', ar: 'مرشد وجميع الرسوم' },
    ],
    daysList: [
      { t: { en: 'Addis → Bahir Dar', ar: 'أديس ← بحر دار' }, b: { en: 'Morning flight, the Blue Nile falls in the afternoon.', ar: 'رحلة صباحية، وشلالات النيل الأزرق بعد الظهر.' } },
      { t: { en: 'The island monasteries', ar: 'أديرة الجزر' }, b: { en: 'Boat across the lake to Ura Kidane Mehret and Azwa Maryam.', ar: 'قارب عبر البحيرة إلى أورا كيداني مهرت وأزوا مريم.' } },
      { t: { en: 'Gondar, then home', ar: 'غوندار ثم العودة' }, b: { en: 'Drive to Gondar for Fasil Ghebbi and Debre Berhan Selassie, evening flight.', ar: 'القيادة إلى غوندار لفاسيل غيبي ودبرا برهان سيلاسي، ورحلة مسائية.' } },
    ],
  },
  {
    id: 'tour-axum',
    name: { en: 'Axum', ar: 'أكسوم' },
    tag: { en: 'Short break', ar: 'إقامة قصيرة' },
    type: 'tour', days: 2, nights: 1, price: 380, seats: 16, depart: '2026-11-07',
    image: 'assets/img/tour-axum.jpg',
    blurb: {
      en: 'The stelae field, the Queen of Sheba’s bath and the church that claims the Ark.',
      ar: 'حقل المسلات، وحمّام ملكة سبأ، والكنيسة التي تقول إنها تحفظ التابوت.',
    },
    includes: [
      { en: 'Return flights Addis – Axum', ar: 'تذاكر طيران ذهابًا وإيابًا أديس – أكسوم' },
      { en: 'One night, breakfast included', ar: 'ليلة واحدة مع الإفطار' },
      { en: 'Guide and site entries', ar: 'مرشد ودخول المواقع' },
      { en: 'Airport transfers', ar: 'التنقلات من المطار' },
    ],
    daysList: [
      { t: { en: 'Addis → Axum', ar: 'أديس ← أكسوم' }, b: { en: 'Morning flight, the stelae field and the tombs beneath them.', ar: 'رحلة صباحية، وحقل المسلات والمقابر تحتها.' } },
      { t: { en: 'Churches, then home', ar: 'الكنائس ثم العودة' }, b: { en: 'St Mary of Zion and the Queen of Sheba’s bath, then the afternoon flight.', ar: 'كنيسة مريم صهيون وحمّام ملكة سبأ، ثم رحلة بعد الظهر.' } },
    ],
  },
];

export const ALL_TRIPS = [...JOURNEYS, ...TOURS];

export const HOTELS = [
  { id: 'safa-royal', city: 'makkah', name: { en: 'Safa Royal Makkah', ar: 'صفا رويال مكة' }, stars: 5, meters: 350, price: 210, image: 'assets/img/towers.jpg', note: { en: 'Haram view, breakfast', ar: 'إطلالة على الحرم، إفطار' } },
  { id: 'ajyad-grand', city: 'makkah', name: { en: 'Ajyad Grand', ar: 'أجياد جراند' }, stars: 4, meters: 700, price: 128, image: 'assets/img/kaaba-night.jpg', note: { en: 'Family rooms, 24h shuttle', ar: 'غرف عائلية، نقل على مدار الساعة' } },
  { id: 'jabal-omar', city: 'makkah', name: { en: 'Jabal Omar Suites', ar: 'أجنحة جبل عمر' }, stars: 4, meters: 550, price: 155, image: 'assets/img/arcade.jpg', note: { en: 'Apartments with kitchenette', ar: 'شقق بمطبخ صغير' } },
  { id: 'marwa-res', city: 'makkah', name: { en: 'Al Marwa Residence', ar: 'المروة ريزيدنس' }, stars: 3, meters: 900, price: 78, image: 'assets/img/kaaba-day.jpg', note: { en: 'Best value, quad rooms', ar: 'أفضل قيمة، غرف رباعية' } },
  { id: 'anwar-madinah', city: 'madinah', name: { en: 'Anwar Al Madinah', ar: 'أنوار المدينة' }, stars: 5, meters: 150, price: 185, image: 'assets/img/dome.jpg', note: { en: 'Facing the Prophet’s Mosque', ar: 'مقابل المسجد النبوي' } },
  { id: 'markaziyah', city: 'madinah', name: { en: 'Markaziyah Court', ar: 'المركزية كورت' }, stars: 4, meters: 300, price: 110, image: 'assets/img/piazza.jpg', note: { en: 'Central, walk to the gates', ar: 'مركزي، على مسافة قريبة من الأبواب' } },
  { id: 'quba-gate', city: 'madinah', name: { en: 'Quba Gate Hotel', ar: 'فندق باب قباء' }, stars: 4, meters: 450, price: 96, image: 'assets/img/canopy.jpg', note: { en: 'Quiet side, large rooms', ar: 'جهة هادئة، غرف واسعة' } },
  { id: 'shuhada', city: 'madinah', name: { en: 'Sayed Al Shuhada Suites', ar: 'أجنحة سيد الشهداء' }, stars: 3, meters: 800, price: 62, image: 'assets/img/colonnade.jpg', note: { en: 'Suites for families', ar: 'أجنحة للعائلات' } },
];

/* Ethiopian lodges and resorts. Same card shape as the Haram hotels, but the badge is a
 * place on the map rather than a distance in metres, and the rate is per room per night.
 * Draft figures, like everything else on this preview, confirmed when the room is held. */
export const STAYS = [
  { id: 'sabana-langano', city: 'langano', area: { en: 'Lake Langano shore', ar: 'ضفة بحيرة لانغانو' }, name: { en: 'Sabana Beach Resort', ar: 'منتجع سابانا بيتش' }, stars: 4, price: 95, image: 'assets/img/stay-langano-sabana.jpg', note: { en: 'Beach, pool, breakfast', ar: 'شاطئ ومسبح وإفطار' } },
  { id: 'bishangari', city: 'langano', area: { en: 'Eastern shore, Bishangari', ar: 'الضفة الشرقية، بيشانغاري' }, name: { en: 'Bishangari Lodge', ar: 'نزل بيشانغاري' }, stars: 4, price: 120, image: 'assets/img/stay-langano-bishangari.jpg', note: { en: 'Forest lodge, full board', ar: 'نزل في الغابة، إقامة كاملة' } },
  { id: 'haile-hawassa', city: 'hawassa', area: { en: 'Lake Hawassa waterfront', ar: 'واجهة بحيرة هواسا' }, name: { en: 'Haile Resort Hawassa', ar: 'منتجع هايلي هواسا' }, stars: 4, price: 110, image: 'assets/img/stay-hawassa.jpg', note: { en: 'Pool, lakeside lawn', ar: 'مسبح وحديقة على البحيرة' } },
  { id: 'kuriftu-bishoftu', city: 'bishoftu', area: { en: 'Lake Bishoftu rim', ar: 'حافة بحيرة بيشوفتو' }, name: { en: 'Kuriftu Resort & Spa Bishoftu', ar: 'منتجع كوريفتو وسبا بيشوفتو' }, stars: 5, price: 140, image: 'assets/img/stay-bishoftu.jpg', note: { en: 'Spa, water park, breakfast', ar: 'سبا ومدينة مائية وإفطار' } },
  { id: 'haile-arba-minch', city: 'arba-minch', area: { en: 'Above Lake Chamo', ar: 'فوق بحيرة تشامو' }, name: { en: 'Haile Resort Arba Minch', ar: 'منتجع هايلي أربا منش' }, stars: 4, price: 105, image: 'assets/img/stay-arba-minch.jpg', note: { en: 'Pool, lake view', ar: 'مسبح وإطلالة على البحيرة' } },
  { id: 'kuriftu-tana', city: 'bahir-dar', area: { en: 'Lake Tana shore, Bahir Dar', ar: 'ضفة بحيرة تانا، بحر دار' }, name: { en: 'Kuriftu Resort & Spa Lake Tana', ar: 'منتجع كوريفتو وسبا بحيرة تانا' }, stars: 5, price: 130, image: 'assets/img/stay-bahir-dar.jpg', note: { en: 'Lake view, spa', ar: 'إطلالة على البحيرة وسبا' } },
  { id: 'wonchi-eco', city: 'wonchi', area: { en: 'Crater rim, Wonchi', ar: 'حافة الفوهة، ونتشي' }, name: { en: 'Wonchi Eco Lodge', ar: 'نزل ونتشي البيئي' }, stars: 4, price: 100, image: 'assets/img/stay-wonchi.jpg', note: { en: 'Crater view, dinner and breakfast', ar: 'إطلالة على الفوهة، عشاء وإفطار' } },
  { id: 'bale-lodge', city: 'bale', area: { en: 'Harenna Forest, Bale', ar: 'غابة هارينا، بالي' }, name: { en: 'Bale Mountain Lodge', ar: 'نزل جبال بالي' }, stars: 4, price: 180, image: 'assets/img/stay-bale.jpg', note: { en: 'Eleven rooms, forest wilderness', ar: 'إحدى عشرة غرفة وسط غابة برية' } },
];

/* One lookup for pricing: the wizard should not care whether a room is in Makkah or on
 * the Langano shore when it adds the nights up. */
export const ALL_HOTELS = [...HOTELS, ...STAYS];

/* Cars and drivers. Reserved over WhatsApp because a vehicle needs a route and a date
 * before it needs a price; the card carries the rate so the conversation starts from a
 * number rather than from nothing. */
export const CARS = [
  { id: 'car-airport', icon: 'car', price: 18, unit: { en: 'per car', ar: 'للسيارة' }, title: { en: 'Airport transfer', ar: 'توصيل المطار' }, body: { en: 'Bole to any address in Addis, car and driver, flight tracked so a delay costs you nothing.', ar: 'من بولي إلى أي عنوان في أديس، سيارة وسائق، مع متابعة الرحلة حتى لا يكلفك التأخير شيئًا.' } },
  { id: 'car-day', icon: 'car', price: 70, unit: { en: 'per day', ar: 'لليوم' }, title: { en: 'Car with driver, full day', ar: 'سيارة مع سائق، يوم كامل' }, body: { en: 'Up to four passengers in and around Addis, eight hours, fuel included.', ar: 'حتى أربعة مسافرين في أديس وحولها، ثماني ساعات، والوقود مشمول.' } },
  { id: 'car-4x4', icon: 'car', price: 140, unit: { en: 'per day', ar: 'لليوم' }, title: { en: '4×4 with driver', ar: 'دفع رباعي مع سائق' }, body: { en: 'For the Rift Valley, Bale and the Omo road: five seats, roof rack, driver who knows the track.', ar: 'للوادي المتصدّع وبالي وطريق أومو: خمسة مقاعد وحمالة سقف وسائق يعرف الطريق.' } },
  { id: 'car-minibus', icon: 'users', price: 190, unit: { en: 'per day', ar: 'لليوم' }, title: { en: 'Minibus with driver', ar: 'حافلة صغيرة مع سائق' }, body: { en: 'Twelve seats for family groups and company trips, with the luggage inside rather than on the roof.', ar: 'اثنا عشر مقعدًا لمجموعات العائلة ورحلات الشركات، والأمتعة في الداخل لا على السقف.' } },
];

export const SERVICES = [
  { id: 'visa', icon: 'passport', title: { en: 'Umrah & Hajj visas', ar: 'تأشيرات العمرة والحج' }, body: { en: 'One-year multiple-entry visas, processed in the office, with the insurance and document review included.', ar: 'تأشيرات متعددة الدخول لسنة، تُنجَز في المكتب، مع التأمين ومراجعة المستندات.' } },
  { id: 'flights', icon: 'plane', title: { en: 'Air tickets', ar: 'تذاكر الطيران' }, body: { en: 'Ethiopian Airlines and Gulf carriers, group fares held for confirmed bookings.', ar: 'الخطوط الإثيوبية وناقلات الخليج، بأسعار مجموعات مثبّتة للحجوزات المؤكدة.' } },
  { id: 'hotels', icon: 'bed', title: { en: 'Hotels near the Haram', ar: 'فنادق قرب الحرم' }, body: { en: 'Makkah and Madinah rooms we have walked to ourselves, from three to five stars.', ar: 'غرف في مكة والمدينة سِرنا إليها بأنفسنا، من ثلاث إلى خمس نجوم.' } },
  { id: 'transfers', icon: 'car', title: { en: 'Transfers', ar: 'التنقلات' }, body: { en: 'Jeddah and Madinah airports, Makkah–Madinah runs, and private cars on request.', ar: 'مطارا جدة والمدينة، وتنقلات مكة–المدينة، وسيارات خاصة عند الطلب.' } },
  { id: 'ziyarah', icon: 'arch', title: { en: 'Ziyarah tours', ar: 'جولات الزيارة' }, body: { en: 'Guided visits to the sites in both cities, in Amharic, Afaan Oromo or Arabic.', ar: 'زيارات مرشدة للمعالم في المدينتين، بالأمهرية أو الأورومية أو العربية.' } },
  { id: 'groups', icon: 'users', title: { en: 'Group departures', ar: 'رحلات المجموعات' }, body: { en: 'Monthly rounds with a scholar, a guide and a fixed price agreed before you pay.', ar: 'رحلات شهرية مع شيخ ومرشد وسعر ثابت يُتفق عليه قبل الدفع.' } },
  { id: 'insurance', icon: 'shield', title: { en: 'Travel insurance', ar: 'تأمين السفر' }, body: { en: 'Cover arranged with the visa, extended for longer stays on request.', ar: 'تأمين يُرتَّب مع التأشيرة، ويمكن تمديده للإقامات الأطول عند الطلب.' } },
  { id: 'support', icon: 'phone', title: { en: 'On-trip support', ar: 'دعم أثناء الرحلة' }, body: { en: 'A number that answers while you are there, in your language, not an inbox.', ar: 'رقم يُجيب أثناء وجودك هناك، بلغتك، لا صندوق بريد.' } },
];

export const STEPS = [
  { title: { en: 'Choose your round', ar: 'اختر رحلتك' }, body: { en: 'Pick a departure, or tell us the dates you want.', ar: 'اختر موعدًا للانطلاق، أو أخبرنا بالتواريخ التي تريدها.' } },
  { title: { en: 'Send your documents', ar: 'أرسل مستنداتك' }, body: { en: 'Passport, photo and the form. We check them before they are submitted.', ar: 'الجواز والصورة والنموذج. نراجعها قبل إرسالها.' } },
  { title: { en: 'Visa and confirmation', ar: 'التأشيرة والتأكيد' }, body: { en: 'The visa is issued and your rooms are held under your name.', ar: 'تُصدَر التأشيرة وتُحجَز غرفك باسمك.' } },
  { title: { en: 'Briefing', ar: 'التحضير' }, body: { en: 'A group briefing on what to pack, what to expect and where to meet.', ar: 'لقاء تحضيري عن ما تحمله وما تتوقعه ومكان اللقاء.' } },
  { title: { en: 'Travel', ar: 'السفر' }, body: { en: 'We meet you at the airport and stay reachable the whole way.', ar: 'نلتقي بك في المطار ونبقى على تواصل طوال الطريق.' } },
  { title: { en: 'Return', ar: 'العودة' }, body: { en: 'Transfers back, and your documents returned with you.', ar: 'التنقلات للعودة، ومستنداتك تُعاد معك.' } },
];

export const FAQS = [
  { q: { en: 'What documents do I need for an Umrah visa?', ar: 'ما المستندات المطلوبة لتأشيرة العمرة؟' }, a: { en: 'A passport valid for at least six months, one recent white-background photograph, and a completed application. We prepare the rest, including the insurance that comes with the visa.', ar: 'جواز سفر صالح لستة أشهر على الأقل، وصورة حديثة بخلفية بيضاء، وطلب مكتمل. نتولى الباقي، بما فيه التأمين المرافق للتأشيرة.' } },
  { q: { en: 'Do women need a mahram?', ar: 'هل تحتاج المرأة إلى محرم؟' }, a: { en: 'Women travelling for Umrah no longer need a male guardian on the visa itself, but Saudi rules change. We confirm the current requirement for your dates in writing before you pay.', ar: 'لم تعد المرأة تحتاج إلى محرم في التأشيرة نفسها، لكن الأنظمة السعودية تتغير. نؤكد لك الشرط الساري في تواريخك كتابيًا قبل الدفع.' } },
  { q: { en: 'How much deposit holds a seat?', ar: 'كم يبلغ مبلغ الحجز المبدئي؟' }, a: { en: 'Thirty per cent of the package price holds your seat and starts the visa. The balance is due fourteen days before departure.', ar: 'ثلاثون بالمئة من سعر الرحلة تحجز مقعدك وتبدأ التأشيرة. يُسدَّد الباقي قبل أربعة عشر يومًا من السفر.' } },
  { q: { en: 'Can I book hotels without a package?', ar: 'هل يمكنني حجز الفندق فقط دون باقة؟' }, a: { en: 'Yes. Hotel-only bookings are confirmed within one working day, and you can add transfers or ziyarah separately.', ar: 'نعم. تُؤكَّد حجوزات الفندق فقط خلال يوم عمل واحد، ويمكنك إضافة التنقلات أو الزيارة بشكل منفصل.' } },
  { q: { en: 'What if my visa is refused?', ar: 'ماذا لو رُفضت التأشيرة؟' }, a: { en: 'The visa fee is not refundable once submitted. The rest of your payment is returned, or moved to another departure, whichever you prefer.', ar: 'رسم التأشيرة غير قابل للاسترداد بعد التقديم. أما بقية المبلغ فتُعاد إليك أو تُحوَّل إلى رحلة أخرى، كما تفضّل.' } },
  { q: { en: 'Do you guide in Afaan Oromo?', ar: 'هل ترشدون بالأورومية؟' }, a: { en: 'Yes. One round each month travels with a scholar who teaches and guides in Afaan Oromo, and departures from Adama are available.', ar: 'نعم. رحلة كل شهر مع شيخ يدرّس ويرشد بالأورومية، وتتوفر انطلاقات من أداما.' } },
  { q: { en: 'How far are the hotels from the Haram?', ar: 'ما مدى بُعد الفنادق عن الحرم؟' }, a: { en: 'Every hotel in this list is one we have walked from the Haram ourselves. The distance shown is door to gate, not as the crow flies.', ar: 'كل فندق في هذه القائمة سِرنا إليه من الحرم بأنفسنا. المسافة المعروضة من الباب إلى الباب، لا خطًا مستقيمًا.' } },
];

export const EXTRAS = [
  { id: 'transfer', price: 45, unit: 'person', name: { en: 'Airport & inter-city transfers', ar: 'التنقلات من المطار وبين المدينتين' } },
  { id: 'ziyarah', price: 35, unit: 'person', name: { en: 'Guided ziyarah tour', ar: 'جولة زيارة مرشدة' } },
  { id: 'insurance', price: 28, unit: 'person', name: { en: 'Extended travel insurance', ar: 'تأمين سفر ممتد' } },
  { id: 'sim', price: 15, unit: 'person', name: { en: 'Saudi SIM card, delivered on arrival', ar: 'شريحة سعودية تُسلَّم عند الوصول' } },
  { id: 'wheelchair', price: 60, unit: 'booking', name: { en: 'Wheelchair assistance', ar: 'مساعدة بالكرسي المتحرك' } },
];

export const ROOM_TYPES = [
  { id: 'quad', label: { en: 'Quad', ar: 'رباعية' }, factor: 0.88 },
  { id: 'triple', label: { en: 'Triple', ar: 'ثلاثية' }, factor: 0.94 },
  { id: 'double', label: { en: 'Double', ar: 'مزدوجة' }, factor: 1.0 },
  { id: 'single', label: { en: 'Single', ar: 'فردية' }, factor: 1.22 },
];
