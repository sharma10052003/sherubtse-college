import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export type NewsTemplate = 'standard' | 'featured' | 'video' | 'photo_story' | 'split' | 'gallery' | 'magazine';
export type NewsCategory =
  | 'campus_life'
  | 'academics'
  | 'research'
  | 'achievements'
  | 'events'
  | 'sports'
  | 'administration'
  | 'general';

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  campus_life: 'Campus Life',
  academics: 'Academics',
  research: 'Research',
  achievements: 'Achievements',
  events: 'Events',
  sports: 'Sports',
  administration: 'Administration',
  general: 'General',
};

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  body: string;
  date: string;
  year: number;
  category: NewsCategory;
  category_label: string;
  template: NewsTemplate;
  unit_name: string | null;
  image_url: string | null;
  images: string[];
  gallery: string[];
  tags: string[];
  featured: boolean;
  pinned: boolean;
  hero_media_type: 'image' | 'video';
  /** Resolved playable video source — an external URL if the editor pasted
   * one, otherwise the uploaded file, whichever is set. Null when neither is. */
  video_url: string | null;
  video_poster_url: string | null;
  autoplay: boolean;
  archived: boolean;
}

// A published article can still carry a future `publish_at` — Strapi's own
// draftAndPublish flag only tracks draft vs. published, not *when* a
// published item should start appearing, so scheduling is layered on top
// here rather than in the CMS's publish action.
function isDue(row: any): boolean {
  return !row.publish_at || new Date(row.publish_at).getTime() <= Date.now();
}

function mapNews(row: any): NewsItem {
  const images = (row.images ?? []).map((m: any) => mediaUrl(m)).filter((u: string | null): u is string => !!u);
  const gallery = (row.gallery ?? []).map((m: any) => mediaUrl(m)).filter((u: string | null): u is string => !!u);
  const category: NewsCategory = row.category ?? 'general';
  return {
    id: row.id,
    title: row.title,
    summary: row.summary ?? '',
    body: row.body,
    date: row.date,
    year: new Date(row.date).getFullYear(),
    category,
    category_label: CATEGORY_LABELS[category] ?? category,
    template: row.template ?? 'standard',
    unit_name: row.unit?.name ?? row.owning_unit?.name ?? null,
    image_url: images[0] ?? mediaUrl(row.video_poster) ?? null,
    images,
    gallery,
    tags: (row.tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean),
    featured: !!row.featured,
    pinned: !!row.pinned,
    hero_media_type: row.hero_media_type === 'video' ? 'video' : 'image',
    video_url: row.video_url || mediaUrl(row.video_file),
    video_poster_url: mediaUrl(row.video_poster),
    autoplay: !!row.autoplay,
    archived: !!row.archived,
  };
}

const POPULATE = ['unit', 'owning_unit', 'images', 'gallery', 'video_file', 'video_poster'];

/** Every news item — current and archived alike, newest first. Archived
 * items are never dropped from this list (they stay searchable/reachable),
 * just filtered out of the live grid by the board component. */
export async function getAllNews(): Promise<NewsItem[]> {
  const res = await strapiGet<StrapiListResponse<any>>('news-entries', {
    populate: POPULATE,
    sort: 'date:desc',
    pagination: { pageSize: 500 },
  });
  return (res?.data ?? []).filter(isDue).map(mapNews);
}

/** Most recent, currently-live news items — for homepage/section-landing use. */
export async function getRecentNews(limit = 4): Promise<NewsItem[]> {
  const res = await strapiGet<StrapiListResponse<any>>('news-entries', {
    filters: { archived: { $eq: false } },
    populate: POPULATE,
    sort: 'date:desc',
    pagination: { pageSize: limit * 2 },
  });
  return (res?.data ?? []).filter(isDue).map(mapNews).slice(0, limit);
}

export async function getAllNewsIds(): Promise<number[]> {
  const res = await strapiGet<StrapiListResponse<{ id: number }>>('news-entries', {
    fields: [],
    pagination: { pageSize: 500 },
  });
  return (res?.data ?? []).map((r) => r.id);
}

// Strapi v5's single-entry REST route (`news-entries/:id`) expects the
// document's `documentId`, not the numeric `id` this site routes on — so
// this looks the row up by filter instead, the same way
// getVacancyAnnouncementBySlug does for its slug-based route.
export async function getNewsById(id: number): Promise<NewsItem | null> {
  const res = await strapiGet<StrapiListResponse<any>>('news-entries', {
    filters: { id: { $eq: id } },
    populate: POPULATE,
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  return row ? mapNews(row) : null;
}
