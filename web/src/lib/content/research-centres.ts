import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';
import type { UnitLike } from './unit-like';

export async function getResearchCentreBySlug(slug: string): Promise<UnitLike | null> {
  const res = await strapiGet<StrapiListResponse<any>>('research-centres', {
    filters: { slug: { $eq: slug } },
    populate: ['lead', 'members', 'focus_areas'],
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;
  return {
    kind: 'research_centre',
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? null,
    photo_url: null,
    head: row.lead ? { full_name: row.lead.full_name, slug: row.lead.slug } : null,
    contact: null,
    last_reviewed: row.last_reviewed,
  };
}
