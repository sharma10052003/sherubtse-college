import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiSingleResponse, StrapiListResponse } from '../strapi';
import type { StrapiMedia } from '../types';

export interface HistoryContent {
  hero_title: string;
  hero_subtitle: string;
  hero_intro: string;
  hero_image_url: string | null;
  hero_image_position: 'top' | 'center' | 'bottom';
  founding_story: string;
  vision_king_text: string;
  king_photo_url: string | null;
  mackey_name: string;
  mackey_photo_url: string | null;
  mackey_bio: string;
  motto: string;
  motto_meaning: string | null;
  emblem_meaning: string | null;
  values_text: string | null;
  video_url: string | null;
  brochure_url: string | null;
  then_image_url: string | null;
  now_image_url: string | null;
}

export interface TimelineItem {
  id: number;
  year: string;
  event: string;
  description: string | null;
}

export interface LegacyItem {
  id: number;
  icon: string;
  text: string;
}

export interface TraditionItem {
  id: number;
  icon: string;
  title: string;
  description: string | null;
}

export type GalleryCategory = 'campus' | 'students' | 'construction' | 'events' | 'festivals' | 'graduation';

export interface GalleryImage {
  id: number;
  image_url: string | null;
  caption: string | null;
  category: GalleryCategory;
}

interface RawHistoryContent {
  hero_title: string;
  hero_subtitle: string;
  hero_intro: string;
  hero_image?: StrapiMedia | null;
  hero_image_position?: 'top' | 'center' | 'bottom';
  founding_story: string;
  vision_king_text: string;
  king_photo?: StrapiMedia | null;
  mackey_name: string;
  mackey_photo?: StrapiMedia | null;
  mackey_bio: string;
  motto: string;
  motto_meaning?: string | null;
  emblem_meaning?: string | null;
  values_text?: string | null;
  video_url?: string | null;
  brochure?: StrapiMedia | null;
  then_image?: StrapiMedia | null;
  now_image?: StrapiMedia | null;
}

/** Single "History Content" entry — the hero, founding story, Vision of
 * the Third King, Father Mackey, motto/identity, then/now, video and
 * brochure fields. Returns null if it hasn't been filled in yet, so the
 * page can render nothing rather than a half-empty layout. */
export async function getHistoryContent(): Promise<HistoryContent | null> {
  const res = await strapiGet<StrapiSingleResponse<RawHistoryContent>>('history-content', {
    populate: ['hero_image', 'king_photo', 'mackey_photo', 'brochure', 'then_image', 'now_image'],
  });
  const row = res?.data;
  if (!row || !row.hero_title) return null;

  return {
    hero_title: row.hero_title,
    hero_subtitle: row.hero_subtitle,
    hero_intro: row.hero_intro,
    hero_image_url: mediaUrl(row.hero_image),
    hero_image_position: row.hero_image_position ?? 'top',
    founding_story: row.founding_story,
    vision_king_text: row.vision_king_text,
    king_photo_url: mediaUrl(row.king_photo),
    mackey_name: row.mackey_name,
    mackey_photo_url: mediaUrl(row.mackey_photo),
    mackey_bio: row.mackey_bio,
    motto: row.motto,
    motto_meaning: row.motto_meaning ?? null,
    emblem_meaning: row.emblem_meaning ?? null,
    values_text: row.values_text ?? null,
    video_url: row.video_url ?? null,
    brochure_url: mediaUrl(row.brochure),
    then_image_url: mediaUrl(row.then_image),
    now_image_url: mediaUrl(row.now_image),
  };
}

export async function getHistoryTimeline(): Promise<TimelineItem[]> {
  const res = await strapiGet<StrapiListResponse<any>>('history-timeline-items', {
    sort: 'sort_order:asc',
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map((r) => ({ id: r.id, year: r.year, event: r.event, description: r.description ?? null }));
}

export async function getHistoryLegacyItems(): Promise<LegacyItem[]> {
  const res = await strapiGet<StrapiListResponse<any>>('history-legacy-items', {
    sort: 'sort_order:asc',
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map((r) => ({ id: r.id, icon: r.icon, text: r.text }));
}

export async function getHistoryTraditionItems(): Promise<TraditionItem[]> {
  const res = await strapiGet<StrapiListResponse<any>>('history-tradition-items', {
    sort: 'sort_order:asc',
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map((r) => ({ id: r.id, icon: r.icon, title: r.title, description: r.description ?? null }));
}

export async function getHistoryGalleryImages(): Promise<GalleryImage[]> {
  const res = await strapiGet<StrapiListResponse<any>>('history-gallery-images', {
    populate: ['image'],
    sort: 'sort_order:asc',
    pagination: { pageSize: 200 },
  });
  return (res?.data ?? []).map((r) => ({
    id: r.id,
    image_url: mediaUrl(r.image),
    caption: r.caption ?? null,
    category: (r.category ?? 'campus') as GalleryCategory,
  }));
}

// The real seeded data (from the PHP prototype's Strapi content) stores
// Bootstrap Icons class names (e.g. "bi-trophy") rather than raw SVG —
// this site uses inline SVG everywhere else (search, bottom tabs, footer
// contact icons), not an icon font, so this maps the known names onto
// equivalent inline paths instead of pulling in a whole new font/CSS
// dependency for a handful of icons. Unmapped names fall back to a plain
// circle rather than breaking.
const ICON_PATHS: Record<string, string> = {
  'bi-patch-check-fill': '<path d="M12 2l2.4 1.6 2.8-.3 1 2.6 2.6 1-.3 2.8L22 12l-1.6 2.4.3 2.8-2.6 1-1 2.6-2.8-.3L12 22l-2.4-1.6-2.8.3-1-2.6-2.6-1 .3-2.8L2 12l1.6-2.4-.3-2.8 2.6-1 1-2.6 2.8.3z"/><path d="M8.5 12l2.5 2.5 5-5"/>',
  'bi-bank': '<path d="M3 21h18"/><path d="M4 21V10"/><path d="M20 21V10"/><path d="M2 10l10-6 10 6"/><path d="M8 21v-7"/><path d="M12 21v-7"/><path d="M16 21v-7"/>',
  'bi-mortarboard-fill': '<path d="M12 4L2 9l10 5 10-5-10-5z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/><path d="M22 9v6"/>',
  'bi-globe-asia-australia': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
  'bi-brightness-high': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  'bi-stars': '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  'bi-book': '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5v15A2.5 2.5 0 0 0 6.5 23H20"/>',
  'bi-trophy': '<path d="M8 4h8v6a4 4 0 0 1-8 0z"/><path d="M8 5H4v2a4 4 0 0 0 4 4"/><path d="M16 5h4v2a4 4 0 0 1-4 4"/><path d="M12 14v4"/><path d="M8 22h8"/><path d="M9 18h6l1 4H8z"/>',
  'bi-hand-thumbs-up': '<path d="M7 22V11l4-8 1 1v6h6a2 2 0 0 1 2 2l-1.5 8a2 2 0 0 1-2 2H10a3 3 0 0 1-3-3z"/><path d="M7 11H4v11h3"/>',
};
const DEFAULT_ICON = '<circle cx="12" cy="12" r="8"/>';

/** Renders a known Bootstrap-Icons class name (as stored in the seeded
 * data) to inline SVG path content, matching this site's icon
 * convention everywhere else. Falls back to a plain circle for any
 * name not in the map, rather than rendering nothing. */
export function iconPaths(iconClass: string): string {
  return ICON_PATHS[iconClass] ?? DEFAULT_ICON;
}

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  campus: 'Campus',
  students: 'First Students',
  construction: 'Construction',
  events: 'Events',
  festivals: 'Festivals',
  graduation: 'Graduation',
};
