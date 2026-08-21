import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse, StrapiSingleResponse } from '../strapi';
import type { ContactBlock, StrapiMedia } from '../types';

export type UnitKind = 'academic' | 'administrative' | 'research_centre' | 'student_body';

export interface Unit {
  id: number;
  documentId: string;
  name: string;
  short_name?: string | null;
  slug: string;
  kind: UnitKind;
  description?: string | null;
  head?: { full_name: string; slug: string } | null;
  content_owner?: { full_name: string } | null;
  contact?: ContactBlock | null;
  photo_url: string | null;
  last_reviewed: string;
}

function mapUnit(row: any): Unit {
  return {
    id: row.id,
    documentId: row.documentId,
    name: row.name,
    short_name: row.short_name ?? null,
    slug: row.slug,
    kind: row.kind,
    description: row.description ?? null,
    head: row.head ?? null,
    content_owner: row.content_owner ?? null,
    contact: row.contact ?? null,
    photo_url: mediaUrl(row.photo),
    last_reviewed: row.last_reviewed,
  };
}

export async function getUnits(kind?: UnitKind): Promise<Unit[]> {
  const res = await strapiGet<StrapiListResponse<any>>('units', {
    filters: kind ? { kind: { $eq: kind } } : undefined,
    populate: ['photo', 'head', 'content_owner', 'contact'],
    sort: 'name:asc',
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map(mapUnit);
}

export async function getUnitBySlug(slug: string): Promise<Unit | null> {
  const res = await strapiGet<StrapiListResponse<any>>('units', {
    filters: { slug: { $eq: slug } },
    populate: ['photo', 'head', 'content_owner', 'contact'],
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  return row ? mapUnit(row) : null;
}
