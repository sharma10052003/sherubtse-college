import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';
import type { UnitLike } from './unit-like';

export async function getClubBySlug(slug: string): Promise<UnitLike | null> {
  const res = await strapiGet<StrapiListResponse<any>>('clubs', {
    filters: { slug: { $eq: slug } },
    populate: ['coordinator', 'images'],
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;
  return {
    kind: 'club',
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? null,
    photo_url: mediaUrl(row.images?.[0] ?? null),
    head: row.coordinator ? { full_name: row.coordinator.full_name, slug: row.coordinator.slug } : null,
    contact: null,
    last_reviewed: row.last_reviewed,
  };
}
