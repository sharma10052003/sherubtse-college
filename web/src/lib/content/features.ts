import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export interface FeatureCard {
  id: number;
  slug: string;
  title: string;
  standfirst: string;
  hero_image_url: string | null;
  theme?: string | null;
}

export interface FeatureDetail extends FeatureCard {
  body: string;
  author_name: string;
  reading_time: number;
  related_people: { full_name: string; slug: string; photo_url: string | null }[];
  related_units: { name: string; slug: string }[];
}

function mapCard(row: any): FeatureCard {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    standfirst: row.standfirst,
    hero_image_url: mediaUrl(row.hero_image),
    theme: row.theme ?? null,
  };
}

function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200)); // 200 wpm, "calculated at build" per Stack doc §07
}

export async function getFeatures(): Promise<FeatureCard[]> {
  const res = await strapiGet<StrapiListResponse<any>>('features', {
    populate: ['hero_image'],
    sort: 'publishedAt:desc',
    pagination: { pageSize: 50 },
  });
  return (res?.data ?? []).map(mapCard);
}

export async function getFeatureBySlug(slug: string): Promise<FeatureDetail | null> {
  const res = await strapiGet<StrapiListResponse<any>>('features', {
    filters: { slug: { $eq: slug } },
    populate: ['hero_image', 'author', 'related_people', 'related_people.photo', 'related_units'],
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;
  return {
    ...mapCard(row),
    body: row.body,
    author_name: row.author?.full_name ?? row.author_name ?? 'Sherubtse College',
    reading_time: readingTime(row.body),
    // decision 006: same consent gate as people.ts's mapCard — a related
    // person's portrait here must not bypass the check just because it's
    // reached through a different relation.
    related_people: (row.related_people ?? []).map((p: any) => ({ full_name: p.full_name, slug: p.slug, photo_url: p.photo_consent ? mediaUrl(p.photo) : null })),
    related_units: (row.related_units ?? []).map((u: any) => ({ name: u.name, slug: u.slug })),
  };
}
