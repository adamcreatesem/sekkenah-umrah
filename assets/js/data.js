/* Sekkenah — catalogue data. Ethiopia only.
 *
 * Everything a visitor can book lives here so the page, the region filter, the detail
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
  email: 'hello@sekkenah.com',
  address: {
    en: 'Jemo Michael, Megfira Mall, 4th floor, Addis Ababa',
    ar: 'جيمو ميخائيل، مجمع مغفيرا، الطابق الرابع، أديس أبابا',
  },
  mapQuery: 'XP9C%2BQG9%2C%20Addis%20Ababa',
  // Indicative only. The invoice is always struck in ETB at the day's rate.
  etbPerUsd: 156,
};

/* Regions are the filter axis: every route belongs to exactly one, and the chip row is
 * generated from this list rather than from the tours, so an empty region still reads
 * as a place rather than as a bug. */
export const REGIONS = [
  { id: 'rift', label: { en: 'Rift Valley & lakes', ar: 'الوادي المتصدّع والبحيرات' } },
  { id: 'north', label: { en: 'Historic north', ar: 'الشمال التاريخي' } },
  { id: 'south', label: { en: 'South & east', ar: 'الجنوب والشرق' } },
  { id: 'wild', label: { en: 'Wild Ethiopia', ar: 'إثيوبيا البرية' } },
];

export const LEVELS = {
  easy: { en: 'Easy', ar: 'سهل' },
  moderate: { en: 'Moderate', ar: 'متوسط' },
  demanding: { en: 'Demanding', ar: 'شاق' },
};

/* A route is priced per person and includes the car, the driver and the guide; the
 * itinerary is written out day by day rather than generated, because a tour is not a
 * nights-split of two cities. `bestMonths` drives the month filter and is the honest
 * axis for private departures — the date is yours, the season is the country's. */
export const TOURS = [
  {
    id: 'tour-rift-lakes',
    name: { en: 'Rift Valley Lakes', ar: 'بحيرات الوادي المتصدّع' },
    tag: { en: 'Lakes & resorts', ar: 'بحيرات ومنتجعات' },
    region: 'rift', level: 'easy', days: 3, nights: 2, price: 420, seats: 12,
    depart: '2026-11-13', bestMonths: [10, 11, 12, 1, 2, 3],
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
    region: 'rift', level: 'easy', days: 2, nights: 1, price: 340, seats: 14,
    depart: '2026-11-21', bestMonths: [10, 11, 12, 1, 2, 3],
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
    region: 'rift', level: 'easy', days: 1, nights: 0, price: 120, seats: 8,
    depart: '2026-11-08', bestMonths: [10, 11, 12, 1, 2, 3, 4, 5],
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
    region: 'rift', level: 'easy', days: 3, nights: 2, price: 560, seats: 10,
    depart: '2026-11-27', bestMonths: [10, 11, 12, 1, 2, 3],
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
    tag: { en: 'Crater & hot springs', ar: 'فوهة وينابيع ساخنة' },
    region: 'rift', level: 'moderate', days: 2, nights: 1, price: 290, seats: 10,
    depart: '2026-11-15', bestMonths: [9, 10, 11, 12, 1, 2, 3, 4],
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
    region: 'south', level: 'moderate', days: 5, nights: 4, price: 980, seats: 6,
    depart: '2026-12-04', bestMonths: [9, 10, 11, 12, 1, 2, 3],
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
    region: 'south', level: 'easy', days: 2, nights: 1, price: 360, seats: 12,
    depart: '2026-11-14', bestMonths: [10, 11, 12, 1, 2, 3],
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
    region: 'south', level: 'moderate', days: 2, nights: 1, price: 390, seats: 8,
    depart: '2026-12-11', bestMonths: [10, 11, 12, 1, 2, 3],
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
    region: 'north', level: 'easy', days: 3, nights: 2, price: 520, seats: 12,
    depart: '2026-11-14', bestMonths: [10, 11, 12, 1, 2, 3],
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
    region: 'north', level: 'demanding', days: 4, nights: 3, price: 690, seats: 10,
    depart: '2026-11-27', bestMonths: [10, 11, 12, 1, 2, 3],
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
    region: 'wild', level: 'moderate', days: 3, nights: 2, price: 480, seats: 12,
    depart: '2026-12-04', bestMonths: [11, 12, 1, 2, 3],
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
    region: 'wild', level: 'demanding', days: 4, nights: 3, price: 820, seats: 8,
    depart: '2026-12-11', bestMonths: [11, 12, 1, 2],
    image: 'assets/img/tour-danakil.jpg',
    blurb: {
      en: 'Sulphur terraces at Dallol, the salt flats at Assale, and the caravans that still cut the salt by hand.',
      ar: 'مدرجات الكبريت في دالول، ومسطحات الملح في أسالي، والقوافل التي لا تزال تقطع الملح باليد.',
    },
    includes: [
      { en: 'Return flights Addis – Semera', ar: 'تذاكر طيران ذهابًا وإيابًا أديس – سيميرا' },
      { en: '4×4, driver and cook', ar: 'سيارة دفع رباعي وسائق وطاهٍ' },
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
    region: 'north', level: 'easy', days: 3, nights: 2, price: 560, seats: 14,
    depart: '2026-11-20', bestMonths: [10, 11, 12, 1, 2, 3],
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
    region: 'north', level: 'easy', days: 2, nights: 1, price: 380, seats: 16,
    depart: '2026-11-07', bestMonths: [10, 11, 12, 1, 2, 3],
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

/* Ethiopian lodges and resorts. The badge is a place on the map rather than a distance,
 * and the rate is per room per night. Draft figures, confirmed when the room is held. */
export const STAYS = [
  { id: 'sabana-langano', area: { en: 'Lake Langano shore', ar: 'ضفة بحيرة لانغانو' }, name: { en: 'Sabana Beach Resort', ar: 'منتجع سابانا بيتش' }, stars: 4, price: 95, image: 'assets/img/stay-langano-sabana.jpg', note: { en: 'Beach, pool, breakfast', ar: 'شاطئ ومسبح وإفطار' } },
  { id: 'bishangari', area: { en: 'Eastern shore, Bishangari', ar: 'الضفة الشرقية، بيشانغاري' }, name: { en: 'Bishangari Lodge', ar: 'نزل بيشانغاري' }, stars: 4, price: 120, image: 'assets/img/stay-langano-bishangari.jpg', note: { en: 'Forest lodge, full board', ar: 'نزل في الغابة، إقامة كاملة' } },
  { id: 'haile-hawassa', area: { en: 'Lake Hawassa waterfront', ar: 'واجهة بحيرة هواسا' }, name: { en: 'Haile Resort Hawassa', ar: 'منتجع هايلي هواسا' }, stars: 4, price: 110, image: 'assets/img/stay-hawassa.jpg', note: { en: 'Pool, lakeside lawn', ar: 'مسبح وحديقة على البحيرة' } },
  { id: 'kuriftu-bishoftu', area: { en: 'Lake Bishoftu rim', ar: 'حافة بحيرة بيشوفتو' }, name: { en: 'Kuriftu Resort & Spa Bishoftu', ar: 'منتجع كوريفتو وسبا بيشوفتو' }, stars: 5, price: 140, image: 'assets/img/stay-bishoftu.jpg', note: { en: 'Spa, water park, breakfast', ar: 'سبا ومدينة مائية وإفطار' } },
  { id: 'haile-arba-minch', area: { en: 'Above Lake Chamo', ar: 'فوق بحيرة تشامو' }, name: { en: 'Haile Resort Arba Minch', ar: 'منتجع هايلي أربا منش' }, stars: 4, price: 105, image: 'assets/img/stay-arba-minch.jpg', note: { en: 'Pool, lake view', ar: 'مسبح وإطلالة على البحيرة' } },
  { id: 'kuriftu-tana', area: { en: 'Lake Tana shore, Bahir Dar', ar: 'ضفة بحيرة تانا، بحر دار' }, name: { en: 'Kuriftu Resort & Spa Lake Tana', ar: 'منتجع كوريفتو وسبا بحيرة تانا' }, stars: 5, price: 130, image: 'assets/img/stay-bahir-dar.jpg', note: { en: 'Lake view, spa', ar: 'إطلالة على البحيرة وسبا' } },
  { id: 'wonchi-eco', area: { en: 'Crater rim, Wonchi', ar: 'حافة الفوهة، ونتشي' }, name: { en: 'Wonchi Eco Lodge', ar: 'نزل ونتشي البيئي' }, stars: 4, price: 100, image: 'assets/img/stay-wonchi.jpg', note: { en: 'Crater view, dinner and breakfast', ar: 'إطلالة على الفوهة، عشاء وإفطار' } },
  { id: 'bale-lodge', area: { en: 'Harenna Forest, Bale', ar: 'غابة هارينا، بالي' }, name: { en: 'Bale Mountain Lodge', ar: 'نزل جبال بالي' }, stars: 4, price: 180, image: 'assets/img/stay-bale.jpg', note: { en: 'Eleven rooms, forest wilderness', ar: 'إحدى عشرة غرفة وسط غابة برية' } },
];

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
  { id: 'routes', icon: 'route', title: { en: 'Routes & itineraries', ar: 'المسارات والبرامج' }, body: { en: 'A written day-by-day with the driving hours on it, built around your dates rather than a brochure.', ar: 'برنامج مكتوب يومًا بيوم مع ساعات القيادة، يُبنى على تواريخك لا على كتيّب.' } },
  { id: 'flights', icon: 'plane', title: { en: 'Domestic flights', ar: 'الطيران الداخلي' }, body: { en: 'Ethiopian Airlines seats to Lalibela, Gondar, Axum, Arba Minch, Jinka and Semera, held with the route.', ar: 'مقاعد الخطوط الإثيوبية إلى لاليبيلا وغوندار وأكسوم وأربا منش وجينكا وسيميرا، تُحجز مع المسار.' } },
  { id: 'cars', icon: 'car', title: { en: 'Cars & drivers', ar: 'سيارات وسائقون' }, body: { en: 'Our own vehicles and drivers: saloon for the city, 4×4 for the south and the Danakil road.', ar: 'سياراتنا وسائقونا: صالون للمدينة، ودفع رباعي للجنوب وطريق الدناكل.' } },
  { id: 'lodges', icon: 'bed', title: { en: 'Lodges & camps', ar: 'النزل والمخيمات' }, body: { en: 'Rooms on the lakes, in the Harenna forest and on the crater rim — booked under your name.', ar: 'غرف على البحيرات، وفي غابة هارينا، وعلى حافة الفوهة — تُحجز باسمك.' } },
  { id: 'permits', icon: 'shield', title: { en: 'Permits & scouts', ar: 'التصاريح والمرافقون' }, body: { en: 'Park fees, scouting and the Danakil escort arranged before you land, not at the gate.', ar: 'رسوم المنتزهات والمرافقة الأمنية في الدناكل تُرتَّب قبل وصولك، لا عند البوابة.' } },
  { id: 'guides', icon: 'users', title: { en: 'Guides & languages', ar: 'المرشدون واللغات' }, body: { en: 'Amharic, Afaan Oromo, English and Arabic — the same guide for the whole route.', ar: 'الأمهرية والأورومية والإنجليزية والعربية — والمرشد نفسه طوال المسار.' } },
  { id: 'groups', icon: 'flag', title: { en: 'Groups & companies', ar: 'المجموعات والشركات' }, body: { en: 'Family reunions, film crews and company retreats, priced as one booking with one invoice.', ar: 'لقاءات العائلة وفرق التصوير ورحلات الشركات، بسعر حجز واحد وفاتورة واحدة.' } },
  { id: 'support', icon: 'phone', title: { en: 'On-trip support', ar: 'الدعم أثناء الرحلة' }, body: { en: 'A number that answers while you are on the road, in your language, not an inbox.', ar: 'رقم يُجيب أثناء وجودك على الطريق، بلغتك، لا صندوق بريد.' } },
];

export const STEPS = [
  { title: { en: 'Tell us the dates', ar: 'أخبرنا بالتواريخ' }, body: { en: 'The route you like, or just the days you have and what you want to see.', ar: 'المسار الذي يعجبك، أو فقط الأيام المتاحة وما تريد رؤيته.' } },
  { title: { en: 'A written plan', ar: 'خطة مكتوبة' }, body: { en: 'Driving hours, lodges, what is included and a price per person — before you pay anything.', ar: 'ساعات القيادة والنزل وما يشمله السعر وسعر للشخص — قبل أن تدفع شيئًا.' } },
  { title: { en: 'Deposit and permits', ar: 'الدفعة والتصاريح' }, body: { en: 'Thirty per cent holds the car and the rooms; park permits and scouts are filed in your name.', ar: 'ثلاثون بالمئة تحجز السيارة والغرف؛ وتُستخرج تصاريح المنتزهات والمرافقين باسمك.' } },
  { title: { en: 'Flights and rooms', ar: 'الطيران والغرف' }, body: { en: 'Domestic seats and the lodges are held and confirmed in writing.', ar: 'تُحجز المقاعد الداخلية والنزل وتُؤكَّد كتابيًا.' } },
  { title: { en: 'On the road', ar: 'على الطريق' }, body: { en: 'Driver and guide at your hotel in Addis, and the same two people to the last day.', ar: 'السائق والمرشد عند فندقك في أديس، والشخصان نفسهما حتى اليوم الأخير.' } },
  { title: { en: 'Back in Addis', ar: 'العودة إلى أديس' }, body: { en: 'Airport drop, photographs from the trip, and the office still answering.', ar: 'توصيل المطار، وصور من الرحلة، والمكتب لا يزال يجيب.' } },
];

export const FAQS = [
  { q: { en: 'What does the price include?', ar: 'ماذا يشمل السعر؟' }, a: { en: 'The car or the domestic flights named on the route, the driver, the guide, park and site fees, and the lodges listed under “what is included”. Meals are named per route — most are breakfast only, the treks are full board.', ar: 'السيارة أو الرحلات الداخلية المذكورة في المسار، والسائق، والمرشد، ورسوم المنتزهات والمواقع، والنزل المذكورة في «ما يشمله السعر». الوجبات مذكورة لكل مسار — معظمها إفطار فقط، والمشي الجبلي بإقامة كاملة.' } },
  { q: { en: 'Do we travel with strangers?', ar: 'هل نسافر مع غرباء؟' }, a: { en: 'No. Every route on this page is a private departure: your group, your car, your guide. The seat count is how many places we can run on that date, not how many strangers join you.', ar: 'لا. كل مسار في هذه الصفحة انطلاقة خاصة: مجموعتك وسيارتك ومرشدك. عدد المقاعد هو عدد الأماكن التي نستطيع تشغيلها في ذلك التاريخ، لا عدد الغرباء الذين ينضمون إليك.' } },
  { q: { en: 'Do we drive or fly?', ar: 'هل نسافر بالسيارة أم بالطائرة؟' }, a: { en: 'Both, depending on the route. The Rift Valley and Bishoftu are road trips from Addis; Lalibela, Gondar, Axum, Arba Minch, Jinka and Semera start with a domestic flight. Driving hours are written into the plan so nothing is hidden in “transfer”.', ar: 'كلاهما، حسب المسار. الوادي المتصدّع وبيشوفتو رحلات برية من أديس؛ ولاليبيلا وغوندار وأكسوم وأربا منش وجينكا وسيميرا تبدأ برحلة داخلية. ساعات القيادة مكتوبة في الخطة حتى لا يختفي شيء تحت كلمة «تنقلات».' } },
  { q: { en: 'What deposit do you ask for?', ar: 'كم تطلبون مقدمًا؟' }, a: { en: 'Thirty per cent of the total holds the car and the rooms and starts the permits. The balance is due seven days before departure. Nothing is charged on this website.', ar: 'ثلاثون بالمئة من الإجمالي تحجز السيارة والغرف وتبدأ التصاريح. ويُسدَّد الباقي قبل سبعة أيام من الانطلاق. لا يُخصم شيء من هذا الموقع.' } },
  { q: { en: 'When is the best time to come?', ar: 'ما أفضل وقت للزيارة؟' }, a: { en: 'The dry season, October to March, for most of the country. The Danakil is only sensible between November and February; the Omo and the south are good from September. Each route card lists its own months.', ar: 'الموسم الجاف، من أكتوبر إلى مارس، لمعظم البلاد. والدناكل لا يُنصح به إلا بين نوفمبر وفبراير؛ والجنوب وأومو جيدان من سبتمبر. كل بطاقة مسار تذكر أشهرها.' } },
  { q: { en: 'Can children come?', ar: 'هل يمكن أن يأتي الأطفال؟' }, a: { en: 'Yes on the road routes and the short flights — the lakes, Harar, Lalibela, Gondar and Axum all work with children. Not on the Simien trek or the Danakil, where the days are long and the altitude or the heat is the point.', ar: 'نعم في المسارات البرية والرحلات القصيرة — البحيرات وهرر ولاليبيلا وغوندار وأكسوم تناسب الأطفال. لا في مشي سِميِن ولا في الدناكل، حيث الأيام طويلة والارتفاع أو الحرارة هي جوهر الرحلة.' } },
  { q: { en: 'Can you build a route for us?', ar: 'هل تبنيون لنا مسارًا خاصًا؟' }, a: { en: 'That is most of what we do. Send the dates, how many are travelling and the two or three places you will not skip; the office writes the route and sends a price, usually within a day.', ar: 'هذا معظم عملنا. أرسل التواريخ وعدد المسافرين والمكانين أو الثلاثة التي لا تريد تفويتها؛ ويكتب المكتب المسار ويرسل السعر، عادة في خلال يوم.' } },
];

export const EXTRAS = [
  { id: 'transfer', price: 30, unit: 'booking', name: { en: 'Airport pickup and drop-off', ar: 'الاستقبال والتوصيل من المطار' } },
  { id: 'insurance', price: 28, unit: 'person', name: { en: 'Travel insurance', ar: 'تأمين السفر' } },
  { id: 'single', price: 180, unit: 'booking', name: { en: 'Single room supplement', ar: 'إضافة الغرفة الفردية' } },
  { id: 'private', price: 95, unit: 'booking', name: { en: 'Private vehicle, no sharing', ar: 'سيارة خاصة بلا مشاركة' } },
];
