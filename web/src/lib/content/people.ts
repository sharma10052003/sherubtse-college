import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export interface PersonCard {
  id: number;
  slug: string;
  full_name: string;
  honorific?: string | null;
  designation: string;
  unit_name?: string | null;
  photo_url: string | null;
}

export interface PersonDetail extends PersonCard {
  qualification?: string | null;
  bio?: string | null;
  specialisation: string[];
  email?: string | null;
  phone?: string | null;
  contact_consent: boolean;
  publications: { citation: string; year?: number | null; link?: string | null }[];
  employment_status: 'active' | 'on_leave' | 'departed';
}

function mapCard(row: any): PersonCard {
  return {
    id: row.id,
    slug: row.slug,
    full_name: row.full_name,
    honorific: row.honorific ?? null,
    designation: row.designation,
    unit_name: row.unit?.name ?? null,
    photo_url: mediaUrl(row.photo),
  };
}

/** People for a unit's page, head-first (Style Guide §07: "head listed first"). */
export async function getPeopleByUnit(unitSlug: string): Promise<PersonCard[]> {
  const res = await strapiGet<StrapiListResponse<any>>('people', {
    filters: { unit: { slug: { $eq: unitSlug } }, employment_status: { $eq: 'active' } },
    populate: ['photo', 'unit'],
    sort: 'full_name:asc',
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map(mapCard);
}

export async function getPersonBySlug(slug: string): Promise<PersonDetail | null> {
  const res = await strapiGet<StrapiListResponse<any>>('people', {
    filters: { slug: { $eq: slug } },
    populate: ['photo', 'unit', 'specialisation', 'publications'],
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;
  return {
    ...mapCard(row),
    qualification: row.qualification ?? null,
    bio: row.bio ?? null,
    specialisation: (row.specialisation ?? []).map((e: any) => e.name),
    email: row.contact_consent ? row.email ?? null : null,
    phone: row.contact_consent ? row.phone ?? null : null,
    contact_consent: !!row.contact_consent,
    publications: row.publications ?? [],
    employment_status: row.employment_status,
  };
}
