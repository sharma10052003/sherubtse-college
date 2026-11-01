import type { Core } from '@strapi/strapi';
import { applyAdminHelp, type HelpMap } from './admin-help';

/**
 * Two homepage spaces that sit beside the section list in Home – Page:
 *  - Home – King’s Birthday & Celebrations: a greeting section (before the President’s
 *    Message by default; an admin can move it after, to the top or to the bottom, switch it
 *    off, or schedule when it shows);
 *  - Home – Special Content: a flexible space for pictures, special greetings, announcements
 *    and celebrations — add, change, schedule or switch off items at any time.
 * Both are created once; after that everything is edited in Strapi.
 */
const CELEBRATION = 'api::home-celebration.home-celebration';
const SHOWCASE = 'api::home-showcase.home-showcase';
const KEY = { type: 'core', name: 'seeds', key: 'home_extras_version' } as const;

const HELP: HelpMap = {
  [`content_types::${CELEBRATION}`]: {
    fields: {
      is_visible: 'Switch the whole section on or off.',
      placement: 'Where it sits on the homepage: right after Latest Highlights, before or after the President’s Message, at the very top (under the hero) or at the bottom.',
      show_from: 'Optional. The section appears from this moment. Leave empty to show straight away.',
      show_until: 'Optional. The section disappears after this moment — handy for a birthday or festival.',
      theme: 'Royal = navy and gold, Gold = warm gold, Light = white.',
      eyebrow: 'A small line above the heading, e.g. “Celebrations”.',
      heading: 'The section title.',
      greeting: 'The big opening line of the greeting.',
      date_label: 'The occasion date as you want it shown, e.g. “21 February”. Optional.',
      message: 'The full wishes or message. Separate paragraphs with a blank line.',
      portrait: 'An official portrait or main picture. Optional.',
      portrait_alt: 'A short description of the picture, for screen readers.',
      gallery: 'Any number of pictures from the celebration. They play as a slideshow behind the greeting.',
      wishes: 'Short greetings from people, offices or groups — they appear as cards. Add as many as you like.',
      button_label: 'Optional button text, e.g. “Read more”.',
      button_url: 'Where the button goes.',
      anchor: 'Optional short name for a link straight to this section (lower-case, no spaces).',
    },
  },
  [`content_types::${SHOWCASE}`]: {
    fields: {
      is_visible: 'Switch the whole space on or off. It also hides itself when it has no active items.',
      placement: 'Where it sits: at the top, after Latest Highlights, before or after the President’s Message, or at the bottom.',
      background: 'The band colour behind the items.',
      eyebrow: 'A small line above the heading.',
      heading: 'The title of the space, e.g. “From the College”.',
      intro: 'One or two sentences under the title. Optional.',
      items: 'Each item is one picture, greeting, announcement or celebration. Add, reorder, switch off or schedule them.',
      anchor: 'Optional short name for a link straight to this section.',
    },
  },
  'components::home.showcase-item': {
    mainField: 'title',
    fields: {
      is_enabled: 'Untick to hide this item without deleting it.',
      kind: 'What it is. This changes the small label and the look.',
      title: 'A short heading. Optional for a plain picture.',
      text: 'The words. Optional.',
      image: 'A picture. Optional.',
      image_alt: 'A short description of the picture, for screen readers.',
      size: 'How much room it takes: small, medium, large, or wide (a full-width banner).',
      accent: 'The card colour: white, navy or gold.',
      link_label: 'Optional button text.',
      link_url: 'Where it goes. A web address, or a page such as /admissions.',
      start_at: 'Optional. The item appears from this moment.',
      end_at: 'Optional. The item disappears after this moment.',
    },
  },
  'components::home.wish': {
    mainField: 'from',
    fields: { from: 'Who the wish is from.', role: 'Their role or office. Optional.', text: 'The wish.' },
  },
};

export async function ensureHomeExtras(strapi: Core.Strapi) {
  if ((Number(await strapi.store.get(KEY)) || 0) < 1) {
    const cel = strapi.documents(CELEBRATION as any) as any;
    if (!(await cel.findFirst())) {
      await cel.create({
        data: {
          is_visible: true,
          placement: 'before_message',
          theme: 'royal',
          eyebrow: 'Celebrations',
          heading: 'His Majesty the King’s Birthday',
          greeting: 'With loyalty and gratitude, the Sherubtse College community offers its heartfelt birthday wishes to His Majesty the King.',
        },
      });
    }
    const show = strapi.documents(SHOWCASE as any) as any;
    if (!(await show.findFirst())) {
      await show.create({
        data: { is_visible: true, placement: 'after_highlights', background: 'soft', eyebrow: 'Special', heading: 'From the College', items: [] },
      });
    }
    await strapi.store.set({ ...KEY, value: 1 });
  }
  await applyAdminHelp({
    strapi,
    help: HELP,
    prefixes: ['content_types::api::home-celebration', 'content_types::api::home-showcase', 'components::home.showcase-item', 'components::home.wish'],
    storeKey: 'home_extras_main_fields_set',
  });
}

/**
 * The President's Message used to sit near the bottom of the Sections list. Moves it up, once,
 * to just after the announcements and events — so it (and the greeting placed before it) is seen
 * early. Both the draft and the published copy of Home – Page are updated. Anyone who has already
 * moved the message themselves is left alone (it only moves if it is still below the Introduction).
 */
export async function moveMessageUp(strapi: Core.Strapi) {
  const MOVED = { type: 'core', name: 'seeds', key: 'home_message_moved_version' } as const;
  if ((Number(await strapi.store.get(MOVED)) || 0) >= 1) return;
  const db = strapi.db.connection;
  const rows: any[] = await db('homepage_cmps').where({ field: 'sections' }).select('id', 'entity_id', 'component_type', 'order');
  const byEntity = new Map<number, any[]>();
  for (const r of rows) byEntity.set(r.entity_id, [...(byEntity.get(r.entity_id) ?? []), r]);
  for (const list of byEntity.values()) {
    list.sort((a, b) => a.order - b.order);
    const msg = list.findIndex((r) => r.component_type === 'home.message');
    const intro = list.findIndex((r) => r.component_type === 'home.introduction');
    if (msg < 0 || intro < 0 || msg < intro) continue;
    const [m] = list.splice(msg, 1);
    let at = -1;
    list.forEach((r, i) => { if (r.component_type === 'home.events' || r.component_type === 'home.notices') at = i; });
    list.splice(at >= 0 ? at + 1 : intro, 0, m);
    for (let i = 0; i < list.length; i++) await db('homepage_cmps').where({ id: list[i].id }).update({ order: i + 1 });
  }
  await strapi.store.set({ ...MOVED, value: 1 });
}

/**
 * Arranges the homepage once, so it reads: Latest Highlights → King’s Birthday & Celebrations →
 * College Introduction → President’s Message → Latest News & Announcements → the rest. Sets the
 * order of Home – Page → Sections (draft and published copies), names the merged feed section,
 * and puts the birthday greeting right after the highlights. Editors can change any of it afterwards.
 */
export async function arrangeHomepage(strapi: Core.Strapi) {
  const DONE = { type: 'core', name: 'seeds', key: 'home_arranged_version' } as const;
  if ((Number(await strapi.store.get(DONE)) || 0) >= 1) return;
  const db = strapi.db.connection;
  const WANT = ['home.highlights', 'home.introduction', 'home.message', 'home.notices', 'home.events', 'home.programmes', 'home.research', 'home.campus', 'home.stats', 'home.resources', 'home.link-cards'];
  const rows: any[] = await db('homepage_cmps').where({ field: 'sections' }).select('id', 'entity_id', 'component_type', 'order');
  const byEntity = new Map<number, any[]>();
  for (const r of rows) byEntity.set(r.entity_id, [...(byEntity.get(r.entity_id) ?? []), r]);
  for (const list of byEntity.values()) {
    const rank = (t: string) => { const i = WANT.indexOf(t); return i < 0 ? WANT.length : i; };
    list.sort((a, b) => rank(a.component_type) - rank(b.component_type) || a.order - b.order);
    for (let i = 0; i < list.length; i++) await db('homepage_cmps').where({ id: list[i].id }).update({ order: i + 1 });
  }
  await db('components_home_notices').where({ heading: 'Current announcements' }).update({
    heading: 'Latest News & Announcements',
    intro: 'News, announcements, vacancies and events from across the College.',
  });
  const cel = strapi.documents(CELEBRATION as any) as any;
  const c = await cel.findFirst();
  if (c && c.placement === 'before_message') await cel.update({ documentId: c.documentId, data: { placement: 'after_highlights' } });
  await strapi.store.set({ ...DONE, value: 1 });
}
