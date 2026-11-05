/* Sekkenah, past trips: the client's own film and photographs.
 *
 * Kept out of data.js on purpose. data.js is generated from the portal by
 * tools/sync-content.mjs, so anything hand-written in it is lost on the next publish.
 * This file is written by hand and only ever describes what we shot ourselves.
 *
 * One film per place, and one photograph per moment. That is the whole rule here:
 * the combined 30 s cut of both places lived on this page next to its own two halves,
 * and the crater appeared twice. The master is still in
 * freelance/clients/sekkenah-umrah/content-tour-2026-10-30/out/ if a single reel is
 * ever wanted instead; the site shows the two halves, so each place appears once.
 *
 * Frames 2, 4 and 6 are the near-duplicates of what is in the gallery; they are used in
 * the Wonchi route and lodge drawers instead, so no picture is repeated on the page.
 *
 * Files: assets/video/ holds the web encodes (H.264, faststart, 1080x1920) and their
 * posters; assets/img/own-tour-N-45.jpg is the 4:5 tile and -wide.jpg the 16:9 frame
 * the lightbox opens.
 */

export const FILMS = [
  {
    id: 'wonchi',
    src: 'assets/video/wonchi-15s.mp4',
    poster: 'assets/video/wonchi-15s.jpg',
    len: '0:15',
    name: { en: 'Wonchi crater', ar: 'فوهة ونتشي' },
    note: {
      en: 'The lake, the lodge on the rim, the terraces, and the walk down to the water.',
      ar: 'البحيرة، والنزل على الحافة، والمدرّجات، والنزول إلى الماء.',
    },
  },
  {
    id: 'butajira',
    src: 'assets/video/butajira-13s.mp4',
    poster: 'assets/video/butajira-13s.jpg',
    len: '0:12',
    name: { en: 'The road to Butajira', ar: 'الطريق إلى بوتاجيرا' },
    note: {
      en: 'The mountains on the way out, the arrivals plaza, and the guide on the ground.',
      ar: 'الجبال في الطريق، وساحة الوصول، والمرشد في الميدان.',
    },
  },
];

/* Eight frames, eight different moments: departure, the team, a rest, the ride, the
 * falls, the route being explained, the view, and a face. Captions are what the
 * photograph actually shows, read off the contact sheet frame by frame. */
export const SHOTS = [
  {
    src: 'assets/img/own-tour-1-45.jpg', big: 'assets/img/own-tour-1-wide.jpg',
    cap: { en: 'The Sekkenah banner, out on the crater rim', ar: 'راية سكينة على حافة الفوهة' },
  },
  {
    src: 'assets/img/own-tour-3-45.jpg', big: 'assets/img/own-tour-3-wide.jpg',
    cap: { en: 'Two guides and the van, start of the trip', ar: 'مرشدان والسيارة في بداية الرحلة' },
  },
  {
    src: 'assets/img/own-tour-5-45.jpg', big: 'assets/img/own-tour-5-wide.jpg',
    cap: { en: 'A water break on the way down', ar: 'استراحة ماء في النزول' },
  },
  {
    src: 'assets/img/own-tour-7-45.jpg', big: 'assets/img/own-tour-7-wide.jpg',
    cap: { en: 'On horseback down the crater rim', ar: 'على الدابة نزولًا من حافة الفوهة' },
  },
  {
    src: 'assets/img/own-tour-8-45.jpg', big: 'assets/img/own-tour-8-wide.jpg',
    cap: { en: 'At the falls below the rim', ar: 'عند الشلال تحت الحافة' },
  },
  {
    src: 'assets/img/own-tour-9-45.jpg', big: 'assets/img/own-tour-9-wide.jpg',
    cap: { en: 'A guide pointing out the route across the valley', ar: 'المرشد يشرح المسار عبر الوادي' },
  },
  {
    src: 'assets/img/own-tour-10-45.jpg', big: 'assets/img/own-tour-10-wide.jpg',
    cap: { en: 'Looking out over the crater from the rim', ar: 'إطلالة على الفوهة من الحافة' },
  },
  {
    src: 'assets/img/own-tour-11-45.jpg', big: 'assets/img/own-tour-11-wide.jpg',
    cap: { en: 'The last frame of the day, at the falls', ar: 'آخر لقطة في اليوم، عند الشلال' },
  },
];
