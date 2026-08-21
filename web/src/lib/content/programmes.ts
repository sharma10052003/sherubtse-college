import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export interface ProgrammeCard {
  id: number;
  slug: string;
  programme_name: string;
  level: 'undergraduate' | 'postgraduate';
  degree_type?: string | null;
  duration?: string | null;
  short_description?: string | null;
  department_name?: string | null;
  hero_image_url: string | null;
}

export interface ProgrammeDetail extends ProgrammeCard {
  overview?: string | null;
  about?: string | null;
  objectives?: string | null;
  learning_outcomes?: string | null;
  admission_requirements?: string | null;
  career_opportunities?: string | null;
  further_study?: string | null;
  annual_fee?: number | null;
  intake_status?: 'open' | 'closed' | 'waitlist' | null;
  curriculum: { label: string; courses: string }[];
  faqs: { question: string; answer: string }[];
  coordinator?: { full_name: string; slug: string } | null;
}

function mapCard(row: any): ProgrammeCard {
  return {
    id: row.id,
    slug: row.slug,
    programme_name: row.programme_name,
    level: row.level,
    degree_type: row.degree_type ?? null,
    duration: row.duration ?? null,
    short_description: row.short_description ?? null,
    department_name: row.department?.department_name ?? null,
    hero_image_url: mediaUrl(row.hero_image),
  };
}

export async function getProgrammes(): Promise<ProgrammeCard[]> {
  const res = await strapiGet<StrapiListResponse<any>>('programmes', {
    populate: ['hero_image', 'department'],
    sort: ['display_order:asc', 'programme_name:asc'],
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map(mapCard);
}

/** Programmes belonging to a Unit (kind: academic) — the "Programmes offered" block. */
export async function getProgrammesByUnit(unitSlug: string): Promise<ProgrammeCard[]> {
  const res = await strapiGet<StrapiListResponse<any>>('programmes', {
    filters: { unit: { slug: { $eq: unitSlug } } },
    populate: ['hero_image', 'department'],
    sort: ['display_order:asc', 'programme_name:asc'],
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map(mapCard);
}

export async function getProgrammeBySlug(slug: string): Promise<ProgrammeDetail | null> {
  const res = await strapiGet<StrapiListResponse<any>>('programmes', {
    filters: { slug: { $eq: slug } },
    populate: ['hero_image', 'department', 'curriculum', 'faqs', 'coordinator'],
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;
  return {
    ...mapCard(row),
    overview: row.overview ?? null,
    about: row.about ?? null,
    objectives: row.objectives ?? null,
    learning_outcomes: row.learning_outcomes ?? null,
    admission_requirements: row.admission_requirements ?? null,
    career_opportunities: row.career_opportunities ?? null,
    further_study: row.further_study ?? null,
    annual_fee: row.annual_fee ?? null,
    intake_status: row.intake_status ?? null,
    curriculum: row.curriculum ?? [],
    faqs: row.faqs ?? [],
    coordinator: row.coordinator ?? null,
  };
}
