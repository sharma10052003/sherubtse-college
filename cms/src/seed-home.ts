import type { Core } from '@strapi/strapi';
import { applyAdminHelp, type HelpMap } from './admin-help';

/**
 * Home – Page: one-time setup of the homepage section builder, plus admin
 * help for the homepage, News highlights and Events.
 *
 * The starting sections reuse the homepage's existing wording (headings,
 * link labels, the three “Explore” cards) and content already in the CMS:
 * News stories, Events, Notices, Programmes, Research Centres, Campus
 * Facilities, Downloads and campus photographs from the Media Library. The
 * three figures in Facts & Figures are from official pages: 7 undergraduate
 * programmes (2026 admission notice, www.sherubtse.edu.bt/admission/),
 * 4 research centres (Research – Centres) and 20 on-campus residences
 * (www.sherubtse.edu.bt/accommodation/). Runs once per SEED_VERSION and
 * never overwrites anything already entered.
 */

const SEED_VERSION = 2;
const STORE = { type: 'core', name: 'seeds', key: 'home_version' } as const;
const HOME = 'api::homepage.homepage';

const isEmpty = (v: unknown) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);

export async function ensureHomeContent({ strapi }: { strapi: Core.Strapi }) {
  const done = Number(await strapi.store.get(STORE)) || 0;
  if (done < SEED_VERSION) {
    await seed(strapi);
    await strapi.store.set({ ...STORE, value: SEED_VERSION });
  }
  await applyAdminHelp({
    strapi,
    help: HELP,
    prefixes: ['content_types::api::homepage', 'components::home.'],
    storeKey: 'home_main_fields_set',
  });
}

async function seed(strapi: Core.Strapi) {
  const docs = (uid: string) => strapi.documents(uid as any) as any;
  const page = await docs(HOME).findFirst({ status: 'draft', populate: '*' });
  if (!page) return;

  const ids = async (uid: string, field: string, values: string[]) => {
    const out: string[] = [];
    for (const v of values) {
      const row = await docs(uid).findFirst({ status: 'published', filters: { [field]: { $eq: v } } });
      if (row) out.push(row.documentId);
    }
    return out;
  };
  const file = async (name: string) => strapi.db.query('plugin::upload.file').findOne({ where: { name } });

  const campus = await file('sherubtse-campus-kanglung.jpg');
  const residence = await file('sherubtse-mph-residence-hall.jpg');

  const data: Record<string, unknown> = {};
  if (isEmpty(page.hero_images) && campus) {
    data.hero_images = [campus.id];
    if (!page.hero_image_alt) data.hero_image_alt = campus.alternativeText || 'The Sherubtse College campus in Kanglung';
  }
  const buttons: any[] = page.hero_buttons ?? [];
  if (buttons.length > 0 && buttons.length < 3 && !buttons.some((b) => b.url === '/about')) {
    data.hero_buttons = [...buttons.map(({ id, label, url }: any) => ({ id, label, url })), { label: 'Discover Sherubtse', url: '/about' }];
  }
  // Fill any label still empty (new labels are added in later versions).
  const labels: Record<string, unknown> = { ...(page.labels ?? {}) };
  const missing = Object.entries(LABELS).filter(([k]) => isEmpty(labels[k]));
  if (missing.length) data.labels = { ...labels, ...Object.fromEntries(missing) };

  if (isEmpty(page.sections)) {
    const research = await ids('api::news.news', 'title', [
      'CERN Science Workshop Inspires Sherubtse College Physics Students',
      'Training Workshop on Grant Proposal Writing',
      'Sherubtse College Signs MoU with Perfect Group Company to Strengthen Academia-Industry Linkages',
    ]);
    const centres = (await docs('api::research-centre.research-centre').findMany({ status: 'published', sort: ['name:asc'] })).map((c: any) => c.documentId);
    const documents = await ids('api::document.document', 'title', [
      'Student Handbook 2025–2026 (Non-Academic)',
      'RUB Student Code of Conduct (July 2022)',
      'The Wheel of Academic Law',
      'College Organogram',
    ]);

    data.sections = [
      {
        __component: 'home.highlights',
        heading: 'Latest Highlights',
        intro: 'Celebrations, workshops, visits and achievements from around the College.',
        selection: 'latest',
        limit: 5,
        layout: 'feature',
        button_label: 'All news',
        button_url: '/news-notices/news',
        empty_text: 'New highlights will appear here soon.',
      },
      {
        __component: 'home.notices',
        heading: 'Current announcements',
        width: 'half',
        limit: 5,
        pinned_first: true,
        button_label: 'All announcements',
        button_url: '/news-notices/announcements',
        empty_text: 'No current announcements.',
      },
      {
        __component: 'home.events',
        heading: 'What’s on',
        width: 'half',
        limit: 4,
        button_label: 'Full calendar',
        button_url: '/news-notices/events',
        empty_text: 'No upcoming events.',
      },
      {
        __component: 'home.introduction',
        eyebrow: 'About Sherubtse',
        heading: 'Bhutan’s first college',
        background: 'soft',
        body: (await docs('api::about-overview.about-overview').findFirst({ status: 'published' }))?.intro || '',
        ...(residence ? { image: residence.id, image_alt: residence.alternativeText || '' } : {}),
        links: [
          { label: 'About the College', url: '/about' },
          { label: 'Our history', url: '/about/history' },
          { label: 'Vision, mission & values', url: '/about/vision-mission-core-values' },
        ],
      },
      {
        __component: 'home.programmes',
        heading: 'Study at Sherubtse',
        intro: 'Undergraduate programmes in the arts, humanities and sciences.',
        limit: 8,
        button_label: 'All programmes',
        button_url: '/academics/programmes',
      },
      {
        __component: 'home.research',
        heading: 'Research & Innovation',
        intro: 'Research centres, workshops and partnerships that connect the College with Bhutan and the world.',
        background: 'navy',
        stories: research,
        centres,
        button_label: 'Explore research',
        button_url: '/research',
      },
      {
        __component: 'home.campus',
        heading: 'Student Life & Campus',
        intro: 'Learning, sport, well-being and community on our hillside campus in Kanglung.',
        layout: 'mosaic',
        limit: 6,
        button_label: 'Campus facilities',
        button_url: '/about/campus-facilities',
      },
      {
        __component: 'home.stats',
        heading: 'Sherubtse at a glance',
        background: 'soft',
        items: [
          { value: '7', label: 'Undergraduate programmes', source: 'Admission notice 2026, www.sherubtse.edu.bt/admission/', verified: true },
          { value: '4', label: 'Research centres', source: 'Research – Centres', verified: true },
          { value: '20', label: 'On-campus residences', note: '10 for female and 10 for male students', source: 'www.sherubtse.edu.bt/accommodation/', verified: true },
        ],
      },
      {
        __component: 'home.resources',
        heading: 'Resources',
        intro: 'Official documents and useful links for students and staff.',
        documents,
        links: [
          { label: 'Academic calendar', url: '/academics/calendar', description: 'Semester dates and key academic deadlines.' },
          { label: 'Downloads & forms', url: '/news-notices/downloads', description: 'Every official form, guide and policy.' },
        ],
        button_label: 'All downloads',
        button_url: '/news-notices/downloads',
      },
      {
        __component: 'home.message',
        heading: 'A Message from the President',
        background: 'soft',
      },
      {
        __component: 'home.link-cards',
        heading: 'Explore',
        is_visible: false,
        cards: [
          { label: 'Academics', url: '/academics', description: 'Departments, programmes and the academic calendar.' },
          { label: 'Admissions', url: '/admissions', description: 'Entry requirements, dates, fees and how to apply.' },
          { label: 'Research', url: '/research', description: 'Centres, grants, journals and staff expertise.' },
        ],
      },
    ];
  }

  if (Object.keys(data).length === 0) return;
  await docs(HOME).update({ documentId: page.documentId, data });
  await docs(HOME).publish({ documentId: page.documentId });
}

const LABELS = {
  read_more: 'Read more',
  view_photos: 'View photos',
  photos_count: '{n} photos',
  pinned: 'Pinned',
  featured: 'Featured',
  deadline: 'Deadline',
  closes_soon: 'Closes soon',
  closed: 'Closed',
  today: 'Today',
  register: 'Register',
  all_day: 'All day',
  pause_video: 'Pause background video',
  play_video: 'Play background video',
  open_programme: 'View programme',
  download: 'Download',
  visit: 'Visit',
  source: 'Source',
  ticker_label: 'Latest',
  swipe_hint: 'Swipe for more',
};

const SECTION: Record<string, string> = {
  heading: 'Section heading.',
  intro: 'Short text under the heading.',
  is_visible: 'Untick to hide this section without deleting it.',
  background: 'Section background colour.',
  width: '“half”: two half-width sections placed next to each other sit side by side on large screens.',
  anchor: 'Optional link name, e.g. “highlights” for /#highlights. Lower-case letters, numbers and dashes.',
  button_label: 'Optional button under the section, e.g. “All news”.',
  button_url: 'Where the button goes, e.g. /news-notices/news.',
  limit: 'Most items to show.',
  empty_text: 'Shown when there is nothing to show. Leave empty to hide the section instead.',
};
const section = (extra: Record<string, string> = {}, mainField?: string) => ({ ...(mainField ? { mainField } : {}), fields: { ...SECTION, ...extra } });

const HELP: HelpMap = {
  'content_types::api::homepage.homepage': {
    fields: {
      hero_eyebrow: 'Small line above the headline, e.g. “Royal University of Bhutan”.',
      hero_heading: 'The headline.',
      statement: 'One or two sentences under the headline.',
      hero_badge: 'Optional small badge, e.g. a historical fact.',
      hero_buttons: 'Up to three buttons. The first is the main (gold) button.',
      hero_video: 'Background video (MP4, muted, about 10–30 seconds, ideally under 8 MB).',
      hero_images: 'Background photo. Shown before the video plays, on phones, and when visitors prefer less motion. Only the first is used.',
      hero_image_alt: 'Describe the background photo for screen readers.',
      hero_overlay: 'How much the background is darkened behind the text.',
      hero_align: 'Text position.',
      hero_video_on_phones: 'Also play the video on phones (uses mobile data). Off by default.',
      show_ticker: 'Show the scrolling line of the latest notices along the bottom of the hero.',
      sections: 'The homepage below the hero. Add a section, drag to reorder, or untick “Is visible” to hide one.',
      labels: 'Small fixed words used across the homepage.',
    },
  },
  'components::home.highlights': section({
    selection: '“latest”: newest stories. “featured_only”: newest stories ticked “Featured”. “manual”: only the stories picked below, in that order.',
    stories: 'Stories to pin at the front (or, in “manual”, the only stories shown). Drag to reorder.',
    layout: '“feature”: one large story with smaller ones beside it. “grid”: equal cards.',
  }, 'heading'),
  'components::home.notices': section({ pinned_first: 'Show notices ticked “Is featured” first.' }, 'heading'),
  'components::home.events': section({ featured_first: 'Show events ticked “Is featured” first.' }, 'heading'),
  'components::home.introduction': section({ body: 'A short introduction — two or three sentences work best.', image: 'A campus photograph.', image_alt: 'Describe the photograph.', links: 'Links under the text.' }, 'heading'),
  'components::home.message': section({ message: 'The message. The section stays hidden until this is filled in.', photo_alt: 'e.g. “Portrait of the President”.' }, 'heading'),
  'components::home.programmes': section({ programmes: 'Pick programmes to show them in this order. Leave empty to show every programme.' }, 'heading'),
  'components::home.research': section({ stories: 'Research stories from News, in this order.', centres: 'Research centres to list.', cards: 'Extra cards, e.g. a publication or grant.' }, 'heading'),
  'components::home.campus': section({ facilities: 'Campus facilities to show. Leave empty to show featured facilities first.', cards: 'Your own picture cards (photo, title, caption and link). Shown before the facilities.', layout: '“mosaic”: varied tile sizes. “grid”: equal tiles.' }, 'heading'),
  'components::home.stats': section({ items: 'Only figures ticked “Verified” are shown; the section hides itself when there are none.' }, 'heading'),
  'components::home.resources': section({ documents: 'Downloads to feature (from News & Notices – Downloads & Forms).', links: 'Other links, e.g. the academic calendar.' }, 'heading'),
  'components::home.link-cards': section({}, 'heading'),
  'components::home.card': {
    mainField: 'title',
    fields: { image: 'Photograph for the card.', image_alt: 'Describe the photograph for screen readers.', caption: 'Optional caption or photo credit.', category: 'Small label, e.g. “Publication”.', link_url: 'Page or https:// link.' },
  },
  'components::home.stat': {
    mainField: 'label',
    fields: { value: 'e.g. “20”.', label: 'e.g. “On-campus residences”.', note: 'Optional short explanation.', source: 'Where this figure comes from (shown to visitors).', verified: 'Tick only once the figure has been checked against an official source.' },
  },
  'content_types::api::news.news': {
    fields: {
      images: 'Photos. The first is the cover image on the homepage and in lists. Add alt text to each photo in the Media Library.',
      gallery: 'Extra photos shown in the story’s photo gallery.',
      featured: 'Feature on the homepage (used when Latest Highlights is set to “featured_only”).',
      pinned: 'Keep at the front of Latest Highlights even when newer stories are published.',
      show_on_homepage: 'Untick to keep this story off the homepage (it stays in News).',
      photo_credit: 'Photographer or source, shown with the photos.',
      expires_at: 'Optional: after this date the story leaves the homepage (it stays in News).',
    },
  },
  'content_types::api::event.event': {
    fields: {
      summary: 'One or two sentences for the homepage and lists.',
      category: 'Type of event.',
      is_featured: 'Show first on the homepage (when “Featured first” is ticked there).',
      image: 'Poster or photo.',
      photo_story: 'After the event: the News story with its photos. Linked from the event page.',
      starts_at: 'Start date and time (Bhutan time).',
      ends_at: 'End date and time. The event leaves “Upcoming” after this.',
    },
  },
};
