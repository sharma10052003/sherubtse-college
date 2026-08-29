import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export type Edition = 'spring' | 'summer' | 'autumn' | 'winter';

export const EDITION_LABELS: Record<Edition, string> = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
};

export interface NewsletterCard {
  id: number;
  slug: string;
  title: string;
  edition: Edition;
  year: number;
  publication_date: string | null;
  description: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  topics: string[];
  view_count: number;
  download_count: number;
}

export interface NewsletterDetail extends NewsletterCard {
  documentId: string;
  closing_message: string | null;
  pdf_url: string | null;
  pdf_filename: string | null;
}

function mapCard(row: any): NewsletterCard {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    edition: row.edition,
    year: row.year,
    publication_date: row.publication_date ?? null,
    description: row.description ?? null,
    cover_image_url: mediaUrl(row.cover_image),
    is_featured: !!row.is_featured,
    topics: (row.topics ?? []).map((t: any) => t.name),
    view_count: row.view_count ?? 0,
    download_count: row.download_count ?? 0,
  };
}

/** Editorial order: newest edition first. Editions within a year sort
 * Autumn > Summer > Spring > Winter by calendar month, matching how a
 * reader thinks about "the latest one" rather than alphabetically. */
const EDITION_RANK: Record<Edition, number> = { winter: 0, spring: 1, summer: 2, autumn: 3 };
function sortNewest(a: NewsletterCard, b: NewsletterCard): number {
  if (a.year !== b.year) return b.year - a.year;
  return EDITION_RANK[b.edition] - EDITION_RANK[a.edition];
}

export async function getNewsletters(): Promise<NewsletterCard[]> {
  const res = await strapiGet<StrapiListResponse<any>>('newsletters', {
    populate: ['cover_image', 'topics'],
    sort: ['year:desc'],
    pagination: { pageSize: 200 },
  });
  return (res?.data ?? []).map(mapCard).sort(sortNewest);
}

export async function getFeaturedNewsletter(): Promise<NewsletterCard | null> {
  const all = await getNewsletters();
  return all.find((n) => n.is_featured) ?? all[0] ?? null;
}

export async function getNewsletterBySlug(slug: string): Promise<NewsletterDetail | null> {
  const res = await strapiGet<StrapiListResponse<any>>('newsletters', {
    filters: { slug: { $eq: slug } },
    populate: ['cover_image', 'topics', 'pdf'],
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;
  return {
    ...mapCard(row),
    documentId: row.documentId,
    closing_message: row.closing_message ?? null,
    pdf_url: mediaUrl(row.pdf),
    pdf_filename: row.pdf?.name ?? null,
  };
}

export interface NewsletterStats {
  totalEditions: number;
  totalYears: number;
}

export async function getNewsletterStats(): Promise<NewsletterStats> {
  const all = await getNewsletters();
  return {
    totalEditions: all.length,
    totalYears: new Set(all.map((n) => n.year)).size,
  };
}

/** Same year first, then the most recent others — "Explore More
 * Editions" on a detail page, capped to 4, excluding the current one. */
export async function getRelatedNewsletters(current: NewsletterCard, limit = 4): Promise<NewsletterCard[]> {
  const all = await getNewsletters();
  const others = all.filter((n) => n.slug !== current.slug);
  const sameYear = others.filter((n) => n.year === current.year);
  const rest = others.filter((n) => n.year !== current.year);
  return [...sameYear, ...rest].slice(0, limit);
}
