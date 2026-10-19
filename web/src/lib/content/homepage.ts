import { strapiGet, mediaUrl, responsiveImage, type ResponsiveImage } from '../strapi';
import type { StrapiListResponse, StrapiSingleResponse } from '../strapi';
import type { LinkItem } from '../types';
import { renderArticle, excerpt } from '../article-text';
import { BLOCKS_POPULATE, toBlocks, type Block } from './landing';
import { CATEGORY_LABELS, type NewsCategory } from './news';
import { getAnnouncementFeed, type FeedItem } from './announcement-feed';

/**
 * The homepage, as configured in Strapi (Home – Page): the hero, then the
 * “Sections” dynamic zone in its order. Each section's content is resolved
 * here — highlights from News, notices from the announcement feed, events,
 * programmes, research, campus facilities, downloads — applying the
 * publication rules (published only, not expired, not hidden from the
 * homepage, pinned first). Every item also carries its expiry time so the
 * page can drop anything that expires between builds (see HomeRuntime).
 */

export type Background = 'white' | 'soft' | 'navy';
const NOW = () => new Date().toISOString();
const text = (s: string | null | undefined) => (s && s.trim() ? s.trim() : null);
const html = (md: string | null | undefined) => (md && md.trim() ? renderArticle(md).html : null);

// ---------------------------------------------------------------------------
// Labels

const LABEL_DEFAULTS = {
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
export type HomeLabels = typeof LABEL_DEFAULTS;

// ---------------------------------------------------------------------------
// Dates (Bhutan time)

const TZ = 'Asia/Thimphu';
export function fmtDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00+06:00` : iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { ...opts, timeZone: TZ });
}
export function fmtTime(iso: string | null | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ }).toLowerCase();
}
/** Start of today in Bhutan time, as an ISO string. */
function startOfTodayBhutan() {
  const ymd = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
  return new Date(`${ymd}T00:00:00+06:00`).toISOString();
}

// ---------------------------------------------------------------------------
// Section types

interface Base {
  key: string;
  heading: string | null;
  intro: string | null;
  background: Background;
  width: 'full' | 'half';
  anchor: string | null;
  button: { label: string; url: string } | null;
  empty_text: string | null;
}

export interface Highlight {
  id: number;
  href: string;
  title: string;
  summary: string;
  date: string;
  category: string | null;
  cover: ResponsiveImage | null;
  photos: number;
  has_video: boolean;
  pinned: boolean;
  expires: string | null;
}
export interface HomeEvent {
  id: number;
  href: string;
  title: string;
  summary: string;
  starts_at: string;
  ends_at: string | null;
  venue: string | null;
  category: string | null;
  image: ResponsiveImage | null;
  registration: string | null;
  featured: boolean;
  expires: string;
}
export interface Card {
  title: string;
  summary: string | null;
  image: ResponsiveImage | null;
  caption: string | null;
  category: string | null;
  date: string | null;
  href: string | null;
  link_label: string | null;
}
export type ProgrammeIcon = 'physics' | 'chemistry' | 'life' | 'maths' | 'data' | 'media' | 'economics' | 'politics' | 'book';
export interface ProgrammeCard { name: string; href: string; department: string | null; level: string | null; summary: string | null; image: ResponsiveImage | null; icon: ProgrammeIcon }
export interface CentreCard { name: string; href: string; summary: string | null }
export interface Stat { value: string; label: string; note: string | null; source: string | null }
export interface DocumentLink { title: string; url: string; ext: string | null; size: string | null; category: string | null }
export interface LinkCard { label: string; url: string; description: string | null }

export type Section =
  | (Base & { kind: 'highlights'; layout: 'feature' | 'grid'; items: Highlight[] })
  | (Base & { kind: 'notices'; items: FeedItem[] })
  | (Base & { kind: 'events'; items: HomeEvent[] })
  | (Base & { kind: 'introduction'; eyebrow: string | null; body_html: string | null; image: ResponsiveImage | null; links: LinkItem[] })
  | (Base & { kind: 'message'; name: string | null; role: string | null; message_html: string; photo: ResponsiveImage | null })
  | (Base & { kind: 'programmes'; items: ProgrammeCard[] })
  | (Base & { kind: 'research'; stories: Highlight[]; centres: CentreCard[]; cards: Card[] })
  | (Base & { kind: 'campus'; layout: 'mosaic' | 'grid'; items: Card[] })
  | (Base & { kind: 'stats'; items: Stat[] })
  | (Base & { kind: 'resources'; documents: DocumentLink[]; links: LinkCard[] })
  | (Base & { kind: 'link-cards'; cards: LinkCard[] })
  | (Base & { kind: 'blocks'; blocks: Block[] });

export interface Homepage {
  hero: {
    eyebrow: string | null;
    heading: string;
    statement: string | null;
    badge: string | null;
    buttons: LinkItem[];
    video_url: string | null;
    image: ResponsiveImage | null;
    overlay: 'light' | 'medium' | 'strong';
    align: 'left' | 'center';
    video_on_phones: boolean;
    ticker: { title: string; href: string; label: string; urgent: boolean }[];
  };
  sections: Section[];
  labels: HomeLabels;
  seo_title: string;
  seo_description: string | null;
}

// ---------------------------------------------------------------------------
// Fetching

const IDS = { fields: ['documentId'] };
const SECTIONS_POPULATE = {
  on: {
    ...BLOCKS_POPULATE.on,
    'home.highlights': { populate: { stories: IDS } },
    'home.notices': true,
    'home.events': true,
    'home.introduction': { populate: ['image', 'links'] },
    'home.message': { populate: ['photo'] },
    'home.programmes': { populate: { programmes: IDS } },
    'home.research': { populate: { stories: IDS, centres: IDS, cards: { populate: ['image'] } } },
    'home.campus': { populate: { facilities: IDS, cards: { populate: ['image'] } } },
    'home.stats': { populate: ['items'] },
    'home.resources': { populate: { documents: { populate: ['file'] }, links: true } },
    'home.link-cards': { populate: ['cards'] },
  },
};

const list = async (path: string, params: Record<string, unknown>) =>
  ((await strapiGet<StrapiListResponse<any>>(path, { pagination: { pageSize: 100 }, ...params }))?.data ?? []) as any[];
const docIds = (rel: any[] | null | undefined): string[] => (rel ?? []).map((r) => r?.documentId).filter(Boolean);
/** Keeps the order editors set on a relation. */
const inOrder = <T extends { documentId: string }>(rows: T[], ids: string[]) =>
  ids.map((id) => rows.find((r) => r.documentId === id)).filter((r): r is T => !!r);

// ---- News (highlights and research stories) ----
const NEWS_POPULATE = ['images', 'gallery', 'video_poster', 'video_file'];

function mapNews(row: any): Highlight & { documentId: string; featured: boolean } {
  const media = [...(row.images ?? []), ...(row.gallery ?? [])];
  const coverMedia = (row.images ?? [])[0] ?? row.video_poster ?? (row.gallery ?? [])[0] ?? null;
  return {
    id: row.id,
    documentId: row.documentId,
    href: `/news-notices/news/${row.id}`,
    title: row.title,
    summary: excerpt(row.summary || row.body, 170),
    date: row.date || row.publish_at || row.publishedAt,
    category: row.category ? (CATEGORY_LABELS[row.category as NewsCategory] ?? null) : null,
    cover: responsiveImage(coverMedia),
    photos: new Set(media.map((m: any) => m?.id)).size,
    has_video: !!(row.video_url || row.video_file),
    pinned: !!row.pinned,
    featured: !!row.featured,
    expires: row.expires_at ?? null,
  };
}

function eligibleNewsFilter() {
  const now = NOW();
  return {
    $and: [
      { $or: [{ show_on_homepage: { $null: true } }, { show_on_homepage: { $eq: true } }] },
      { $or: [{ archived: { $null: true } }, { archived: { $eq: false } }] },
      { $or: [{ expires_at: { $null: true } }, { expires_at: { $gt: now } }] },
      { $or: [{ publish_at: { $null: true } }, { publish_at: { $lte: now } }] },
    ],
  };
}

async function newsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const rows = await list('news-entries', { filters: { documentId: { $in: ids } }, populate: NEWS_POPULATE });
  return inOrder(rows.map(mapNews), ids);
}

async function resolveHighlights(s: any): Promise<Highlight[]> {
  const limit = s.limit || 5;
  const picked = await newsByIds(docIds(s.stories));
  if (s.selection === 'manual') return picked.slice(0, limit);
  const pool = (await list('news-entries', { filters: eligibleNewsFilter(), sort: ['date:desc', 'publishedAt:desc'], populate: NEWS_POPULATE, pagination: { pageSize: 60 } })).map(mapNews);
  const candidates = s.selection === 'featured_only' ? pool.filter((n) => n.featured || n.pinned) : pool;
  const pinned = candidates.filter((n) => n.pinned);
  const rest = candidates.filter((n) => !n.pinned);
  const seen = new Set<string>();
  return [...picked.map((p) => ({ ...p, pinned: true })), ...pinned, ...rest]
    .filter((n) => (seen.has(n.documentId) ? false : (seen.add(n.documentId), true)))
    .slice(0, limit);
}

// ---- Events ----
const EVENT_CATEGORY: Record<string, string> = {
  academic: 'Academic', conference: 'Conference', workshop: 'Workshop', seminar: 'Seminar', student_activity: 'Student Activity',
  sports: 'Sports', cultural: 'Cultural', public_lecture: 'Public Lecture', career: 'Careers', meeting: 'Meeting',
};
async function resolveEvents(s: any): Promise<HomeEvent[]> {
  const now = NOW();
  const rows = await list('events', {
    filters: {
      $and: [
        { $or: [{ ends_at: { $gte: now } }, { $and: [{ ends_at: { $null: true } }, { starts_at: { $gte: startOfTodayBhutan() } }] }] },
        { $or: [{ expires_at: { $null: true } }, { expires_at: { $gt: now } }] },
      ],
    },
    sort: ['starts_at:asc'],
    populate: ['image'],
    pagination: { pageSize: 50 },
  });
  const items: HomeEvent[] = rows.map((e) => ({
    id: e.id,
    href: `/news-notices/events/${e.id}`,
    title: e.title,
    summary: e.summary || excerpt(e.description, 140),
    starts_at: e.starts_at,
    ends_at: e.ends_at ?? null,
    venue: text(e.venue),
    category: EVENT_CATEGORY[e.category] ?? null,
    image: responsiveImage(e.image),
    registration: text(e.registration_link),
    featured: !!e.is_featured,
    expires: e.ends_at || new Date(new Date(e.starts_at).getTime() + 24 * 3600 * 1000).toISOString(),
  }));
  const ordered = s.featured_first ? [...items.filter((e) => e.featured), ...items.filter((e) => !e.featured)] : items;
  return ordered.slice(0, s.limit || 4);
}

// ---- Notices ----
let feedPromise: Promise<FeedItem[]> | null = null;
/** The current announcement feed (fetched once per page build). */
async function currentFeed() {
  feedPromise ??= getAnnouncementFeed();
  const now = Date.now();
  return (await feedPromise).filter((i) => i.status !== 'closed' && (!i.expires || Date.parse(i.expires) > now));
}
async function resolveNotices(s: any): Promise<FeedItem[]> {
  const feed = await currentFeed();
  const ordered = s.pinned_first !== false ? [...feed.filter((i) => i.pinned), ...feed.filter((i) => !i.pinned)] : feed;
  return ordered.slice(0, s.limit || 5);
}

// ---- Programmes ----
/** A discipline icon picked from the programme name (no extra field to fill). */
function iconFor(name: string): ProgrammeIcon {
  const n = name.toLowerCase();
  if (/physic/.test(n)) return 'physics';
  if (/chemi/.test(n)) return 'chemistry';
  if (/life|bio|environment/.test(n)) return 'life';
  if (/math|statist/.test(n)) return 'maths';
  if (/data|comput|information/.test(n)) return 'data';
  if (/communication|media|journal/.test(n)) return 'media';
  if (/econom/.test(n)) return 'economics';
  if (/politic|governance/.test(n)) return 'politics';
  return 'book';
}

const LEVEL: Record<string, string> = { undergraduate: 'Undergraduate', postgraduate: 'Postgraduate' };
async function resolveProgrammes(s: any): Promise<ProgrammeCard[]> {
  const ids = docIds(s.programmes);
  const rows = await list('programmes', {
    ...(ids.length ? { filters: { documentId: { $in: ids } } } : {}),
    sort: ['display_order:asc', 'programme_name:asc'],
    fields: ['programme_name', 'slug', 'level', 'degree_type', 'short_description', 'overview'],
    populate: { department: { fields: ['department_name'] }, hero_image: true },
  });
  const ordered = ids.length ? inOrder(rows, ids) : rows;
  return ordered.slice(0, s.limit || 8).map((p) => ({
    name: p.programme_name,
    href: `/academics/programmes/${p.slug}`,
    department: p.department?.department_name ?? null,
    level: [LEVEL[p.level], text(p.degree_type)].filter(Boolean).join(' · ') || null,
    summary: text(p.short_description) ?? (p.overview ? excerpt(p.overview, 140) : null),
    image: responsiveImage(p.hero_image),
    icon: iconFor(p.programme_name),
  }));
}

// ---- Cards ----
const cardOf = (c: any): Card => ({
  title: c.title,
  summary: text(c.summary),
  image: responsiveImage(c.image, c.image_alt),
  caption: text(c.caption),
  category: text(c.category),
  date: c.date ?? null,
  href: text(c.link_url),
  link_label: text(c.link_label),
});

async function resolveResearch(s: any) {
  const centreIds = docIds(s.centres);
  const [stories, centreRows] = await Promise.all([
    newsByIds(docIds(s.stories)),
    centreIds.length ? list('research-centres', { filters: { documentId: { $in: centreIds } }, fields: ['name', 'slug', 'description'] }) : Promise.resolve([]),
  ]);
  return {
    stories,
    centres: inOrder(centreRows, centreIds).map((c) => ({ name: c.name, href: `/research/centres/${c.slug}`, summary: c.description ? excerpt(c.description, 110) : null })),
    cards: (s.cards ?? []).filter((c: any) => c?.title).map(cardOf),
  };
}

async function resolveCampus(s: any): Promise<Card[]> {
  const ids = docIds(s.facilities);
  const rows = await list('facilities', {
    ...(ids.length ? { filters: { documentId: { $in: ids } } } : {}),
    sort: ['is_featured:desc', 'display_order:asc', 'name:asc'],
    fields: ['name', 'slug', 'summary', 'image_alt', 'display_mode', 'is_featured'],
    populate: ['main_image'],
  });
  const facilities = (ids.length ? inOrder(rows, ids) : rows.filter((f) => f.main_image)).map((f): Card => ({
    title: f.name,
    summary: f.summary ? excerpt(f.summary, 120) : null,
    image: responsiveImage(f.main_image, f.image_alt),
    caption: null,
    category: null,
    date: null,
    href: f.display_mode === 'page' ? `/about/campus-facilities/${f.slug}` : `/about/campus-facilities#${f.slug}`,
    link_label: null,
  }));
  const cards = (s.cards ?? []).filter((c: any) => c?.title).map(cardOf);
  return [...cards, ...facilities].slice(0, s.limit || 6);
}

const DOC_CATEGORY: Record<string, string> = { policy: 'Policy', form: 'Form', timetable: 'Timetable', guide: 'Guide', report: 'Report' };
const fileSize = (kb: number | null | undefined) => (kb ? (kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`) : null);

// ---------------------------------------------------------------------------

async function resolveSection(s: any, i: number): Promise<Section | null> {
  if (s.is_visible === false) return null;
  const base: Base = {
    key: `${s.__component}-${s.id ?? i}`,
    heading: text(s.heading),
    intro: text(s.intro),
    background: ['soft', 'navy'].includes(s.background) ? s.background : 'white',
    width: s.width === 'half' ? 'half' : 'full',
    anchor: text(s.anchor),
    button: s.button_label && s.button_url ? { label: s.button_label, url: s.button_url } : null,
    empty_text: text(s.empty_text),
  };
  switch (s.__component) {
    case 'home.highlights':
      return { ...base, kind: 'highlights', layout: s.layout === 'grid' ? 'grid' : 'feature', items: await resolveHighlights(s) };
    case 'home.notices':
      return { ...base, kind: 'notices', items: await resolveNotices(s) };
    case 'home.events':
      return { ...base, kind: 'events', items: await resolveEvents(s) };
    case 'home.introduction':
      return {
        ...base,
        kind: 'introduction',
        eyebrow: text(s.eyebrow),
        body_html: html(s.body),
        image: responsiveImage(s.image, s.image_alt),
        links: (s.links ?? []).filter((l: any) => l?.label && l?.url),
      };
    case 'home.message': {
      const message_html = html(s.message);
      if (!message_html) return null;
      return { ...base, kind: 'message', name: text(s.name), role: text(s.role), message_html, photo: responsiveImage(s.photo, s.photo_alt) };
    }
    case 'home.programmes':
      return { ...base, kind: 'programmes', items: await resolveProgrammes(s) };
    case 'home.research':
      return { ...base, kind: 'research', ...(await resolveResearch(s)) };
    case 'home.campus':
      return { ...base, kind: 'campus', layout: s.layout === 'grid' ? 'grid' : 'mosaic', items: await resolveCampus(s) };
    case 'home.stats': {
      const items = (s.items ?? []).filter((x: any) => x?.verified && x.value && x.label).map((x: any) => ({ value: x.value, label: x.label, note: text(x.note), source: text(x.source) }));
      return items.length ? { ...base, kind: 'stats', items } : null;
    }
    case 'home.resources':
      return {
        ...base,
        kind: 'resources',
        documents: (s.documents ?? [])
          .map((d: any): DocumentLink | null => {
            const url = mediaUrl(d.file);
            return url ? { title: d.title, url, ext: (d.file?.ext ?? '').replace('.', '').toUpperCase() || null, size: fileSize(d.file?.size), category: DOC_CATEGORY[d.category] ?? null } : null;
          })
          .filter(Boolean),
        links: (s.links ?? []).filter((l: any) => l?.label && l?.url).map((l: any) => ({ label: l.label, url: l.url, description: text(l.description) })),
      };
    case 'home.link-cards':
      return { ...base, kind: 'link-cards', cards: (s.cards ?? []).filter((l: any) => l?.label && l?.url).map((l: any) => ({ label: l.label, url: l.url, description: text(l.description) })) };
    default: {
      const blocks = toBlocks([s]);
      return blocks.length ? { ...base, kind: 'blocks', blocks } : null;
    }
  }
}

/** A section with nothing to show is dropped, unless it has an “empty” message. */
function hasContent(s: Section) {
  switch (s.kind) {
    case 'highlights':
    case 'notices':
    case 'events':
    case 'programmes':
    case 'campus':
      return s.items.length > 0 || !!s.empty_text;
    case 'research':
      return s.stories.length + s.centres.length + s.cards.length > 0;
    case 'resources':
      return s.documents.length + s.links.length > 0;
    case 'link-cards':
      return s.cards.length > 0;
    default:
      return true;
  }
}

export async function getHomepage(): Promise<Homepage> {
  const res = await strapiGet<StrapiSingleResponse<any>>('homepage', {
    populate: { hero_images: true, hero_video: true, hero_buttons: true, labels: true, sections: SECTIONS_POPULATE },
  });
  const row = res?.data ?? {};
  feedPromise = null;
  const sections = (await Promise.all(((row.sections ?? []) as any[]).map(resolveSection))).filter((s): s is Section => !!s && hasContent(s));
  return {
    hero: {
      eyebrow: text(row.hero_eyebrow),
      heading: row.hero_heading || 'Sherubtse College',
      statement: text(row.statement),
      badge: text(row.hero_badge),
      buttons: ((row.hero_buttons ?? []) as LinkItem[]).filter((b) => b?.label && b?.url).slice(0, 3),
      video_url: mediaUrl(row.hero_video),
      image: responsiveImage((row.hero_images ?? [])[0], row.hero_image_alt),
      overlay: ['light', 'strong'].includes(row.hero_overlay) ? row.hero_overlay : 'medium',
      align: row.hero_align === 'center' ? 'center' : 'left',
      video_on_phones: !!row.hero_video_on_phones,
      ticker: row.show_ticker === false ? [] : (await currentFeed()).slice(0, 8).map((i) => ({ title: i.title, href: i.href, label: i.label, urgent: i.tone === 'danger' })),
    },
    sections,
    labels: Object.fromEntries(Object.entries(LABEL_DEFAULTS).map(([k, v]) => [k, text(row.labels?.[k]) ?? v])) as HomeLabels,
    seo_title: row.seo_title || 'Home',
    seo_description: text(row.seo_description),
  };
}
