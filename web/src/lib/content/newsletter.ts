import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';

// Every newsletter the College publishes — The Tower, student-network and centre newsletters,
// older issues brought over from the previous website — kept in Strapi → Newsletter – Editions.
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
  /** The publication's name, e.g. "The Tower". Issues with the same name form one series. */
  title: string;
  edition: Edition | null;
  /** What to show as the issue, e.g. "Spring Edition 2026" or "August 2026". */
  issue_label: string;
  year: number;
  publication_date: string | null;
  description: string | null;
  cover_image_url: string | null;
  pdf_url: string | null;
  external_url: string | null;
  is_featured: boolean;
  topics: string[];
  unit_name: string | null;
  view_count: number;
  download_count: number;
}

export interface NewsletterDetail extends NewsletterCard {
  documentId: string;
  closing_message: string | null;
  pdf_filename: string | null;
}

/** Approximate date used only to put issues in order when no exact date was entered. */
const EDITION_MONTH: Record<Edition, string> = { winter: '01', spring: '03', summer: '06', autumn: '09' };
const sortKey = (n: NewsletterCard) =>
  n.publication_date ?? `${n.year}-${n.edition ? EDITION_MONTH[n.edition] : '01'}-01`;

function mapCard(row: any): NewsletterCard {
  const edition: Edition | null = row.edition && row.edition in EDITION_LABELS ? row.edition : null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    edition,
    issue_label: row.issue_label || (edition ? `${EDITION_LABELS[edition]} Edition ${row.year}` : String(row.year)),
    year: row.year,
    publication_date: row.publication_date ?? null,
    description: row.description ?? null,
    cover_image_url: mediaUrl(row.cover_image),
    pdf_url: mediaUrl(row.pdf),
    external_url: row.external_url || null,
    is_featured: !!row.is_featured,
    topics: (row.topics ?? []).map((t: any) => t.name),
    unit_name: row.owning_unit?.name ?? null,
    view_count: row.view_count ?? 0,
    download_count: row.download_count ?? 0,
  };
}

/** Newest first. */
function sortNewest(a: NewsletterCard, b: NewsletterCard): number {
  return sortKey(b).localeCompare(sortKey(a)) || a.title.localeCompare(b.title);
}

export async function getNewsletters(): Promise<NewsletterCard[]> {
  const res = await strapiGet<StrapiListResponse<any>>('newsletters', {
    populate: ['cover_image', 'pdf', 'topics', 'owning_unit'],
    sort: ['year:desc'],
    pagination: { pageSize: 300 },
  });
  return (res?.data ?? []).map(mapCard).sort(sortNewest);
}

/** The ticked "featured" issue, else the newest one. */
export async function getFeaturedNewsletter(): Promise<NewsletterCard | null> {
  const all = await getNewsletters();
  return all.find((n) => n.is_featured) ?? all[0] ?? null;
}

export async function getNewsletterBySlug(slug: string): Promise<NewsletterDetail | null> {
  const res = await strapiGet<StrapiListResponse<any>>('newsletters', {
    filters: { slug: { $eq: slug } },
    populate: ['cover_image', 'topics', 'pdf', 'owning_unit'],
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;
  return {
    ...mapCard(row),
    documentId: row.documentId,
    closing_message: row.closing_message ?? null,
    pdf_filename: row.pdf?.name ?? null,
  };
}

export interface NewsletterStats {
  totalEditions: number;
  totalYears: number;
  totalSeries: number;
}

export function statsOf(all: NewsletterCard[]): NewsletterStats {
  return {
    totalEditions: all.length,
    totalYears: new Set(all.map((n) => n.year)).size,
    totalSeries: new Set(all.map((n) => n.title)).size,
  };
}

/** Other issues of the same publication first, then the newest others — capped. */
export async function getRelatedNewsletters(current: NewsletterCard, limit = 4): Promise<NewsletterCard[]> {
  const others = (await getNewsletters()).filter((n) => n.slug !== current.slug);
  const sameSeries = others.filter((n) => n.title === current.title);
  const rest = others.filter((n) => n.title !== current.title);
  return [...sameSeries, ...rest].slice(0, limit);
}

/** Neighbours in the same publication, for "previous / next issue". */
export async function getNeighbours(current: NewsletterCard): Promise<{ newer: NewsletterCard | null; older: NewsletterCard | null }> {
  const series = (await getNewsletters()).filter((n) => n.title === current.title);
  const i = series.findIndex((n) => n.slug === current.slug);
  return { newer: i > 0 ? series[i - 1] : null, older: i >= 0 && i < series.length - 1 ? series[i + 1] : null };
}

export interface NewslettersPage {
  hero_eyebrow: string | null;
  hero_heading: string | null;
  hero_intro: string | null;
  labels: Record<string, string>;
}

export async function getNewslettersPage(): Promise<NewslettersPage> {
  const res = await strapiGet<{ data: any }>('newsletters-page', {});
  const p = res?.data ?? null;
  return {
    hero_eyebrow: p?.hero_eyebrow ?? null,
    hero_heading: p?.hero_heading ?? null,
    hero_intro: p?.hero_intro ?? null,
    labels: p?.labels && typeof p.labels === 'object' ? p.labels : {},
  };
}
