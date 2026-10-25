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
    gallery: ['assets/img/g-tour-rift-lakes-1.jpg', 'assets/img/g-tour-rift-lakes-2.jpg'],
    getting: { en: 'Three hours south of Addis on asphalt, or a stop on the way to Hawassa.', ar: 'ثلاث ساعات جنوب أديس على طريق معبّد، أو محطة في طريقك إلى هواسا.' },
    story: {
      en: 'The Rift Valley is where Addis goes to breathe. The road drops off the escarpment at Adama and the air changes: warmer, heavier, full of birds. Ziway is the first stop, a shallow lake with islands of pelicans and a boat that takes you out to them; Abijatta-Shalla next door is a soda lake ringed white at the edges, with hot springs steaming on the shore. Langano, the only Rift lake people swim in, is where the day ends.',
      ar: 'الوادي المتصدّع هو المكان الذي يذهب إليه أهل أديس ليتنفّسوا. ينزل الطريق من الحافة عند أدما فيتغيّر الهواء: أدفأ وأثقل ومليء بالطيور. زيواي أول محطة، بحيرة ضحلة فيها جزر للبجعات وقارب يأخذك إليها؛ وأبيجاتا-شالا المجاورة بحيرة صودا بإطار أبيض وينابيع ساخنة تتصاعد من ضفتها. ولانغانو، البحيرة الوحيدة التي يسبح فيها الناس، هي نهاية اليوم.',
    },
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
    gallery: ['assets/img/g-tour-hawassa-1.jpg', 'assets/img/g-tour-hawassa-2.jpg'],
    getting: { en: 'Four to five hours by road, or a one-hour flight.', ar: 'أربع إلى خمس ساعات بالطريق، أو رحلة طيران ساعة.' },
    story: {
      en: 'Hawassa is a working lake: the fish market at Amora Gedel is loud, wet and worth the walk, with pelicans waiting for what the boats throw back. Above it, Tabor Hill gives the whole crater-shaped town and the lake in one view. Wondo Genet, half an hour further, is the other Ethiopia — hot springs under a canopy of wild fig, where the water comes out of the ground at forty degrees and the forest is full of monkeys.',
      ar: 'هواسا بحيرة عاملة: سوق السمك في أمورا غيديل صاخب ومبلّل ويستحق المشي، والبجعات تنتظر ما تعيده القوارب. وفوقه يمنحك تل تابور البلدة كلها والبحيرة في مشهد واحد. وووندو جينيت، على نصف ساعة، هي إثيوبيا الأخرى: ينابيع ساخنة تحت ظل التين البري، والماء يخرج من الأرض بحرارة أربعين درجة، والغابة مليئة بالقرود.',
    },
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
    gallery: ['assets/img/g-tour-bishoftu-1.jpg', 'assets/img/g-tour-bishoftu-2.jpg'],
    getting: { en: 'One hour east of Addis: an easy morning, or a whole day by the water.', ar: 'ساعة شرق أديس: صباح خفيف، أو يوم كامل على الماء.' },
    story: {
      en: 'An hour out of Addis the land suddenly has holes in it. Bishoftu — Debre Zeit to anyone over forty — sits among seven crater lakes, and the walk around Hora, the one with the rim path and the old fig trees, takes about an hour. Babogaya is where people go for a long lunch by the water. It is the easiest day out of the city, and the one locals actually take.',
      ar: 'على بعد ساعة من أديس تصبح الأرض مثقوبة. بيشوفتو — أو دبري زيت لمن تجاوز الأربعين — تقع بين سبع بحيرات فوهية، والطواف حول هورا، ذات الممر الجبلي وأشجار التين العتيقة، يستغرق ساعة. وبابوغايا مكان الغداء الطويل على الماء. إنها أسهل رحلة يوم من المدينة، والرحلة التي يأخذها أهلها فعلًا.',
    },
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
    gallery: ['assets/img/g-tour-arba-minch-1.jpg', 'assets/img/g-tour-arba-minch-2.jpg'],
    getting: { en: 'One hour by air, or a full day’s drive south.', ar: 'ساعة بالطائرة، أو يوم كامل بالطريق جنوبًا.' },
    story: {
      en: 'Arba Minch means forty springs, and the town sits on a ridge between two of the Rift\u2019s great lakes — Abaya and Chamo. Chamo is the one with the crocodiles: a boat out to the \u201ccrocodile market\u201d where dozens lie on the bank, and hippos in the shallows. Across the water, Nech Sar is a dry plain where zebra and gazelle graze under the escarpment, and the Dorze villages on the ridge above weave tall huts from bamboo.',
      ar: 'أربا منش تعني أربعين نبعًا، والبلدة على حافة بين بحيرتين من كبريات بحيرات الوادي: أبيا وتشامو. وتشامو هي بحيرة التماسيح: قارب إلى «سوق التماسيح» حيث ترقد العشرات على الضفة، وأفراس النهر في المياه الضحلة. وعلى الجانب الآخر، نيش سار سهل جاف ترعى فيه الحمير الوحشية والغزلان تحت الجرف، وقرى دورزي على الحافة تنسج أكواخًا عالية من البامبو.',
    },
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
    gallery: ['assets/img/stay-wonchi.jpg'],
    getting: { en: 'Three hours west of Addis, with the last stretch on a crater track.', ar: 'ثلاث ساعات غرب أديس، والمقطع الأخير على مسار الفوهة.' },
    story: {
      en: 'Wonchi is a crater lake at 3,380 metres, the highest in Ethiopia, reached by a road that turns off between Ambo and Weliso. You walk or ride a horse down the rim — the drop is steep enough to make the lake look painted — and at the bottom there is a monastery on an island, hot springs, and a waterfall that feeds the crater. Cold at night, green all year.',
      ar: 'ونتشي بحيرة فوهية على ارتفاع ٣٣٨٠ مترًا، أعلى بحيرة في إثيوبيا، تصل إليها من طريق يتفرّع بين أمبو وويليسو. تنزل الحافة سيرًا أو على دابة — الانحدار حاد لدرجة تجعل البحيرة تبدو مرسومة — وفي القاع دير على جزيرة وينابيع ساخنة وشلال يغذّي الفوهة. بارد ليلًا، وأخضر طوال السنة.',
    },
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
    gallery: ['assets/img/g-tour-omo-1.jpg', 'assets/img/g-tour-omo-2.jpg'],
    getting: { en: 'One hour’s flight to Jinka, then four days of 4×4.', ar: 'ساعة طيران إلى جينكا، ثم أربعة أيام بدفع رباعي.' },
    story: {
      en: 'South Omo is the most photographed and least understood corner of Ethiopia. Jinka is the gateway, with a museum that explains the groups of the valley before you meet them; Turmi is the Hamer country, where the market is the week\u2019s real event; Omorate is a river crossing to the other bank. The road is rough, the days are long, and the guide matters more here than anywhere else on this list.',
      ar: 'جنوب أومو أكثر بقاع إثيوبيا تصويرًا وأقلها فهمًا. جينكا البوابة، وفيها متحف يشرح مجتمعات الوادي قبل أن تلتقيها؛ وتورمي أرض الهامر حيث السوق هو حدث الأسبوع؛ وأوموراتي معبر نهري إلى الضفة الأخرى. الطريق وعر والأيام طويلة، والمرشد هنا أهم من أي مكان آخر في هذه القائمة.',
    },
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
    gallery: ['assets/img/g-tour-harar-1.jpg', 'assets/img/g-tour-harar-2.jpg'],
    getting: { en: 'One hour’s flight to Dire Dawa, then an hour by road.', ar: 'ساعة طيران إلى ديري داوا، ثم ساعة بالطريق.' },
    story: {
      en: 'Harar is a walled city of 82 mosques and a hundred shrines, and it feels like neither a museum nor a ruin. Inside the Jugol the streets are too narrow for cars, the houses have walls of plates and baskets, and the old gates still divide the quarters. At dusk, outside the wall, a man feeds the hyenas by hand — a nightly ritual, not a show invented for visitors.',
      ar: 'هرر مدينة مسوّرة فيها ٨٢ مسجدًا ومئة مقام، وهي ليست متحفًا ولا أطلالًا. داخل جوغول الأزقة أضيق من أن تمرّ بها سيارة، وبيوت جدرانها أطباق وسلال، والأبواب القديمة لا تزال تفصل الحارات. وعند الغروب خارج السور يطعم رجل الضباع بيده — طقس ليلي، لا عرض اخترع للزوّار.',
    },
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
    gallery: ['assets/img/g-tour-sof-omar-1.jpg', 'assets/img/g-tour-sof-omar-2.jpg'],
    getting: { en: 'One hour’s flight to Robe, then two hours by road through Goba.', ar: 'ساعة طيران إلى روبي، ثم ساعتان بالطريق عبر غوبا.' },
    story: {
      en: 'The Web river has cut fifteen kilometres of passage through limestone, and the result is the largest cave system in Ethiopia — chambers the size of halls, a river you cross on foot, and shrines cut into the rock where pilgrims still come. It is a holy place before it is a sight, so the walk is quiet and the guide sets the pace.',
      ar: 'شقّ نهر ويب خمسة عشر كيلومترًا من الممرات في الحجر الجيري، فخرج أكبر نظام كهوف في إثيوبيا — قاعات بحجم الصالات، ونهر تعبره سيرًا، ومقامات منحوتة في الصخر لا يزال الحجاج يأتون إليها. المكان مقدّس قبل أن يكون معلمًا، لذا تكون المسيرة هادئة والمرشد هو من يضبط إيقاعها.',
    },
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
    gallery: ['assets/img/g-tour-lalibela-1.jpg', 'assets/img/g-tour-lalibela-2.jpg'],
    getting: { en: 'One hour’s flight from Addis, or two days by road through Dessie.', ar: 'ساعة طيران من أديس، أو يومان بالطريق عبر ديسي.' },
    story: {
      en: 'Eleven churches, cut downwards into the rock in the twelfth century, each one a single piece of stone with a trench around it. You arrive expecting a monument and find a working church: priests in white, a drum at dawn, pilgrims asleep against the walls of Bete Giyorgis. The town around it is small and quiet, and two days is enough to see it without hurrying.',
      ar: 'إحدى عشرة كنيسة منحوتة إلى الأسفل في الصخر في القرن الثاني عشر، كل واحدة من حجر واحد وحولها خندقها. تصل متوقعًا نصبًا فتجد كنيسة عاملة: كهنة بالبياض، وطبل عند الفجر، وحجاج نائمون عند جدران بيتي جيورجيس. والبلدة حولها صغيرة هادئة، ويومان يكفيان لرؤيتها دون عجلة.',
    },
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
    gallery: ['assets/img/g-tour-simien-1.jpg', 'assets/img/g-tour-simien-2.jpg'],
    getting: { en: 'One hour’s flight to Gondar, then two to three hours by road to Debark.', ar: 'ساعة طيران إلى غوندار، ثم ساعتان إلى ثلاث بالطريق إلى دبارك.' },
    story: {
      en: 'The Simien escarpment is a wall of rock a kilometre high, and the walk along the top of it is the reason people come. Gelada monkeys — the only primates that graze — sit in troops of hundreds on the plateau, unbothered by walkers. The track from Sankaber to Geech to Chenek is four days at a walking pace, with lodges and camps between; Ras Dejen, Ethiopia\u2019s highest point, is the optional fifth.',
      ar: 'جرف سِميِن حائط صخري بارتفاع كيلومتر، والمشي على أعلاه هو سبب مجيء الناس. قردة الجلادا — الرئيسيات الوحيدة التي ترعى — تجلس في قطعان بمئات على الهضبة، لا تهتم بالمشاة. ومسار سانكابر إلى جيتش إلى تشينيك أربعة أيام بوتيرة مشي، بين نزل ومخيمات؛ وراس ديجن، أعلى قمة في إثيوبيا، هو اليوم الخامس الاختياري.',
    },
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
    gallery: ['assets/img/g-tour-bale-1.jpg', 'assets/img/g-tour-bale-2.jpg'],
    getting: { en: 'One hour’s flight to Robe, then an hour to Dinsho.', ar: 'ساعة طيران إلى روبي، ثم ساعة إلى دينشو.' },
    story: {
      en: 'Bale is where Ethiopia turns alpine: the Sanetti plateau at four thousand metres, giant lobelia like something from another age, and the Ethiopian wolf — the rarest canid in the world — hunting mole rats at dawn. The road over Sanetti is the highest in Africa. On the far side, the Harenna forest drops into cloud, and the lodge at the edge of it has eleven rooms and no neighbours.',
      ar: 'بالي حيث تصير إثيوبيا ألبية: هضبة سانيتي على أربعة آلاف متر، ولوبيليا عملاقة كأنها من زمن آخر، والذئب الإثيوبي — أندر الكلبيات في العالم — يصطاد صباحًا. والطريق فوق سانيتي أعلى طريق في إفريقيا. وعلى الجانب الآخر تنحدر غابة هارينا في السحاب، والنزل عند طرفها أحد عشر غرفة بلا جيران.',
    },
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
    gallery: ['assets/img/g-tour-danakil-1.jpg', 'assets/img/g-tour-danakil-2.jpg'],
    getting: { en: 'One hour’s flight to Semera, then 4×4 with permits and escort.', ar: 'ساعة طيران إلى سيميرا، ثم دفع رباعي مع تصاريح ومرافقة.' },
    story: {
      en: 'The Danakil is the hottest place on earth that people live in. From Semera the road drops below sea level onto a salt plain that stretches to the horizon, where caravans still cut salt blocks by hand and load them onto camels. Dallol is a field of sulphur and acid pools in green, yellow and rust; Lake Afrera is salt and hot springs. It is not a comfortable four days, and that is the point.',
      ar: 'الدناكل أحرّ مكان يسكنه الناس على الأرض. من سيميرا ينزل الطريق تحت سطح البحر إلى سهل ملح يمتد إلى الأفق، حيث لا تزال القوافل تقطع الملح باليد وتحمّله على الجمال. ودالول حقل كبريت وبرك حمضية بالأخضر والأصفر والصدئي؛ وبحيرة أفريرا ملح وينابيع ساخنة. ليست أربعة أيام مريحة، وهذا هو المقصود.',
    },
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
    gallery: ['assets/img/g-tour-gondar-1.jpg', 'assets/img/g-tour-gondar-2.jpg'],
    getting: { en: 'One hour’s flight to Bahir Dar; Gondar is three hours by road from there.', ar: 'ساعة طيران إلى بحر دار؛ وغوندار على ثلاث ساعات بالطريق منها.' },
    story: {
      en: 'Gondar was the capital of Ethiopia for two centuries, and Fasil Ghebbi — the castle compound — is what is left of that: stone halls, a bathing pool the size of a lake, and walls you can walk. Debre Berhan Selassie has a ceiling of painted faces, hundreds of them, each one different. An hour away, Lake Tana\u2019s monasteries sit on islands reached by papyrus boat, and the Blue Nile falls at Tis Issat.',
      ar: 'كانت غوندار عاصمة إثيوبيا قرنين، وفاسيل غيبي — مجمع القلاع — ما بقي من ذلك: قاعات حجرية، وحوض بحجم بحيرة، وأسوار يمكنك المشي عليها. وفي دبرا برهان سيلاسي سقف من وجوه مرسومة، مئات، كل واحد مختلف. وعلى بعد ساعة، أديرة بحيرة تانا على جزر تصل إليها بقارب من البردي، وشلالات النيل الأزرق في تيس إيسات.',
    },
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
    gallery: ['assets/img/g-tour-axum-1.jpg', 'assets/img/g-tour-axum-2.jpg'],
    getting: { en: 'An hour and twenty minutes by air from Addis.', ar: 'ساعة وعشرون دقيقة بالطائرة من أديس.' },
    story: {
      en: 'Axum was a trading empire before most of Europe had cities, and the stelae field is its signature: granite obelisks up to 24 metres, carved as single blocks, marking tombs below. The church of St Mary of Zion is the holiest in Ethiopia and, by its own account, holds the Ark of the Covenant in a chapel no one may enter. The Queen of Sheba\u2019s bath is a stone pool outside town.',
      ar: 'كانت أكسوم إمبراطورية تجارية قبل أن تعرف أوروبا مدنًا، وحقل المسلات توقيعها: مسلات من الجرانيت حتى ٢٤ مترًا، منحوتة من كتلة واحدة، وتحت كل منها مقبرة. وكنيسة مريم صهيون أقدس كنيسة في إثيوبيا، وبحسب روايتها تحفظ تابوت العهد في هيكل لا يدخله أحد. وحمّام ملكة سبأ حوض حجري خارج البلدة.',
    },
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
  { id: 'sabana-langano', area: { en: 'Lake Langano shore', ar: 'ضفة بحيرة لانغانو' }, name: { en: 'Sabana Beach Resort', ar: 'منتجع سابانا بيتش' }, stars: 4, price: 95, image: 'assets/img/stay-langano-sabana.jpg',
    gallery: ['assets/img/g-sabana-langano-1.jpg'],
    near: { en: 'Three hours from Addis', ar: 'ثلاث ساعات من أديس' },
    note: { en: 'Beach, pool, breakfast', ar: 'شاطئ ومسبح وإفطار' },
    story: {
      en: 'The western shore of Langano, where the water is the colour of tea and the beach is soft enough to walk barefoot. Sabana is the biggest of the lake places, with a lawn running down to the water — and Langano is the only Rift lake in Ethiopia you can swim in.',
      ar: 'الضفة الغربية لبحيرة لانغانو، حيث لون الماء كلون الشاي والرمل ناعم يمشي عليه المرء حافيًا. سابانا أكبر أماكن البحيرة، بحديقة تنحدر إلى الماء — ولانغانو هي البحيرة الوحيدة في الوادي المتصدّع التي يمكن السباحة فيها.',
    } },
  { id: 'bishangari', area: { en: 'Eastern shore, Bishangari', ar: 'الضفة الشرقية، بيشانغاري' }, name: { en: 'Bishangari Lodge', ar: 'نزل بيشانغاري' }, stars: 4, price: 120, image: 'assets/img/stay-langano-bishangari.jpg',
    gallery: ['assets/img/g-bishangari-1.jpg'],
    near: { en: 'Three and a half hours from Addis, the last hour on a forest track', ar: 'ثلاث ساعات ونصف من أديس، والساعة الأخيرة على مسار غابة' },
    note: { en: 'Forest lodge, full board', ar: 'نزل في الغابة، إقامة كاملة' },
    story: {
      en: 'The eastern shore is the quiet side: a lodge under old figs, with the lake in front and the Bishangari forest behind. Solar-powered and deliberately low-key — the birds start before your alarm does. It suits the end of a lakes trip rather than the first night.',
      ar: 'الضفة الشرقية هي الجانب الهادئ: نزل تحت أشجار تين عتيقة، البحيرة أمامه وغابة بيشانغاري خلفه. يعمل بالطاقة الشمسية ومتواضع عن قصد — الطيور تبدأ قبل منبّهك. يناسب آخر رحلة البحيرات لا ليلتها الأولى.',
    } },
  { id: 'haile-hawassa', area: { en: 'Lake Hawassa waterfront', ar: 'واجهة بحيرة هواسا' }, name: { en: 'Haile Resort Hawassa', ar: 'منتجع هايلي هواسا' }, stars: 4, price: 110, image: 'assets/img/stay-hawassa.jpg',
    gallery: ['assets/img/g-haile-hawassa-1.jpg'],
    near: { en: 'Four to five hours by road, or an hour by air', ar: 'أربع إلى خمس ساعات بالطريق، أو ساعة بالطائرة' },
    note: { en: 'Pool, lakeside lawn', ar: 'مسبح وحديقة على البحيرة' },
    story: {
      en: 'On the Hawassa waterfront, a short walk from the fish market and a short drive from the town. The lawn runs to the lake, the pool faces it, and the marabou storks walk around as if they own the place.',
      ar: 'على واجهة بحيرة هواسا، على مسافة قصيرة من سوق السمك ومن البلدة. الحديقة تمتد إلى البحيرة والمسبح يواجهها، وطيور المارابو تتمشى كأنها صاحبة المكان.',
    } },
  { id: 'kuriftu-bishoftu', area: { en: 'Lake Bishoftu rim', ar: 'حافة بحيرة بيشوفتو' }, name: { en: 'Kuriftu Resort & Spa Bishoftu', ar: 'منتجع كوريفتو وسبا بيشوفتو' }, stars: 5, price: 140, image: 'assets/img/stay-bishoftu.jpg',
    gallery: ['assets/img/g-kuriftu-bishoftu-1.jpg'],
    near: { en: 'One hour from Addis', ar: 'ساعة من أديس' },
    note: { en: 'Spa, water park, breakfast', ar: 'سبا ومدينة مائية وإفطار' },
    story: {
      en: 'Kuriftu’s first resort, on the rim of one of Bishoftu’s crater lakes, with a spa, a pool and the water park next door. The closest proper resort to Addis: an hour out, and it feels like another climate.',
      ar: 'أول منتجعات كوريفتو، على حافة إحدى بحيرات بيشوفتو الفوهية، مع سبا ومسبح والمدينة المائية المجاورة. أقرب منتجع حقيقي إلى أديس: ساعة واحدة، ويبدو المناخ مختلفًا.',
    } },
  { id: 'haile-arba-minch', area: { en: 'Above Lake Chamo', ar: 'فوق بحيرة تشامو' }, name: { en: 'Haile Resort Arba Minch', ar: 'منتجع هايلي أربا منش' }, stars: 4, price: 105, image: 'assets/img/stay-arba-minch.jpg',
    gallery: ['assets/img/g-haile-arba-minch-1.jpg'],
    near: { en: 'One hour’s flight, or a day’s drive', ar: 'ساعة بالطائرة، أو يوم بالطريق' },
    note: { en: 'Pool, lake view', ar: 'مسبح وإطلالة على البحيرة' },
    story: {
      en: 'Above Lake Chamo, on the ridge the town is built on. The pool looks over the water and the forest, and the boats for the crocodile market leave from below the hotel.',
      ar: 'فوق بحيرة تشامو، على الحافة التي بُنيت عليها البلدة. المسبح يطل على الماء والغابة، وقوارب سوق التماسيح تنطلق من أسفل الفندق.',
    } },
  { id: 'kuriftu-tana', area: { en: 'Lake Tana shore, Bahir Dar', ar: 'ضفة بحيرة تانا، بحر دار' }, name: { en: 'Kuriftu Resort & Spa Lake Tana', ar: 'منتجع كوريفتو وسبا بحيرة تانا' }, stars: 5, price: 130, image: 'assets/img/stay-bahir-dar.jpg',
    gallery: ['assets/img/g-kuriftu-tana-1.jpg'],
    near: { en: 'One hour’s flight to Bahir Dar', ar: 'ساعة طيران إلى بحر دار' },
    note: { en: 'Lake view, spa', ar: 'إطلالة على البحيرة وسبا' },
    story: {
      en: 'On the shore at Bahir Dar, with the lake on one side and the town on the other. Papyrus boats go past the lawn in the morning, and the island monasteries are an hour out by boat.',
      ar: 'على الضفة في بحر دار، البحيرة من جهة والبلدة من أخرى. قوارب البردي تمر أمام الحديقة صباحًا، وأديرة الجزر على بعد ساعة بالقارب.',
    } },
  { id: 'wonchi-eco', area: { en: 'Crater rim, Wonchi', ar: 'حافة الفوهة، ونتشي' }, name: { en: 'Wonchi Eco Lodge', ar: 'نزل ونتشي البيئي' }, stars: 4, price: 100, image: 'assets/img/stay-wonchi.jpg',
    gallery: ['assets/img/tour-wonchi.jpg'],
    near: { en: 'Three hours from Addis', ar: 'ثلاث ساعات من أديس' },
    note: { en: 'Crater view, dinner and breakfast', ar: 'إطلالة على الفوهة، عشاء وإفطار' },
    story: {
      en: 'On the crater rim at 3,380 metres, where the lake sits in the bowl below and the temperature drops ten degrees after sunset. Wood fires, no mains power, and the walk down to the monastery starts at the gate.',
      ar: 'على حافة الفوهة بارتفاع ٣٣٨٠ مترًا، حيث تستقر البحيرة في القاع وتنخفض الحرارة عشر درجات بعد الغروب. نيران حطب، ولا كهرباء من الشبكة، ومسار النزول إلى الدير يبدأ من البوابة.',
    } },
  { id: 'bale-lodge', area: { en: 'Harenna Forest, Bale', ar: 'غابة هارينا، بالي' }, name: { en: 'Bale Mountain Lodge', ar: 'نزل جبال بالي' }, stars: 4, price: 180, image: 'assets/img/stay-bale.jpg',
    gallery: ['assets/img/g-bale-lodge-1.jpg'],
    near: { en: 'One hour’s flight to Robe, then two hours by road', ar: 'ساعة طيران إلى روبي، ثم ساعتان بالطريق' },
    note: { en: 'Eleven rooms, forest wilderness', ar: 'إحدى عشرة غرفة وسط غابة برية' },
    story: {
      en: 'Eleven rooms at the edge of the Harenna forest, on the far side of the Sanetti plateau. Built for the wolf and the forest rather than for a lobby: fires, a small bar, and a guide who takes you out at dawn.',
      ar: 'إحدى عشرة غرفة عند طرف غابة هارينا، على الجانب الآخر من هضبة سانيتي. بُنيت من أجل الذئب والغابة لا من أجل بهو: نيران وبار صغير ومرشد يصحبك عند الفجر.',
    } },
  {
    id: 'kuriftu-entoto',
    area: { en: 'Entoto forest, above Addis', ar: 'غابة إنتوتو، فوق أديس' },
    name: { en: 'Kuriftu Resort & Spa Entoto', ar: 'منتجع كوريفتو وسبا إنتوتو' },
    stars: 5, price: 150, image: 'assets/img/g-kuriftu-entoto-1.jpg',
    gallery: [],
    near: { en: 'Twenty minutes from Bole airport', ar: 'عشرون دقيقة من مطار بولي' },
    note: { en: 'Forest, spa, city view', ar: 'غابة وسبا وإطلالة على المدينة' },
    story: {
      en: 'Kuriftu’s city resort, up in the eucalyptus of Entoto with Addis laid out below. The shortest way to start or end a trip: twenty minutes from the airport, cold air, and a spa between the flights.',
      ar: 'منتجع كوريفتو في المدينة، بين أشجار الكافور في إنتوتو وأديس ممددة تحته. أقصر طريقة لبدء الرحلة أو إنهائها: عشرون دقيقة من المطار، وهواء بارد، وسبا بين الرحلتين.',
    },
  },
  {
    id: 'kuriftu-awash',
    area: { en: 'Above Awash Falls', ar: 'فوق شلالات أواش' },
    name: { en: 'Kuriftu Resort & Spa Awash Falls', ar: 'منتجع كوريفتو وسبا شلالات أواش' },
    stars: 5, price: 120, image: 'assets/img/g-kuriftu-awash-1.jpg',
    gallery: [],
    near: { en: 'Three hours east of Addis, in Awash National Park', ar: 'ثلاث ساعات شرق أديس، في منتزه أواش الوطني' },
    note: { en: 'Cliffside rooms, falls view', ar: 'غرف على الحافة وإطلالة على الشلال' },
    story: {
      en: 'On the cliff above the Awash river where it goes over the falls, inside Awash National Park. A stop on the road east to Harar or Dire Dawa: the park is full of oryx and kudu, and the water is loud all night.',
      ar: 'على الجرف فوق نهر أواش عند الشلالات، داخل منتزه أواش الوطني. محطة على الطريق شرقًا إلى هرر أو ديري داوا: المنتزه مليء بالمها والكودو، وصوت الماء لا يهدأ طوال الليل.',
    },
  },
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
