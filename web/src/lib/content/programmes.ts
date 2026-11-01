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
  overview?: string | null;
  department_name?: string | null;
  department_slug?: string | null;
  annual_fee?: number | null;
  intake_status?: 'open' | 'closed' | 'waitlist' | null;
  seats?: string | null;
  hero_image_url: string | null;
}

export interface ProgrammeDetail extends ProgrammeCard {
  about?: string | null;
  highlights?: string | null;
  key_skills?: string | null;
  teaching_assessment?: string | null;
  resources?: string | null;
  seats?: string | null;
  contact_email?: string | null;
  contact_note?: string | null;
  testimonials: { quote: string; name: string; detail: string | null }[];
  seo_title?: string | null;
  seo_description?: string | null;
  objectives?: string | null;
  learning_outcomes?: string | null;
  admission_requirements?: string | null;
  career_opportunities?: string | null;
  further_study?: string | null;
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
    overview: row.overview ?? null,
    department_name: row.department?.department_name ?? null,
    department_slug: row.department?.slug ?? null,
    annual_fee: row.annual_fee ?? null,
    intake_status: row.intake_status ?? null,
    seats: row.seats ?? null,
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
    populate: ['hero_image', 'department', 'curriculum', 'faqs', 'coordinator', 'testimonials'],
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;
  return {
    ...mapCard(row),
    about: row.about ?? null,
    highlights: row.highlights ?? null,
    key_skills: row.key_skills ?? null,
    teaching_assessment: row.teaching_assessment ?? null,
    resources: row.resources ?? null,
    seats: row.seats ?? null,
    contact_email: row.contact_email ?? null,
    contact_note: row.contact_note ?? null,
    testimonials: (row.testimonials ?? []).filter((t: any) => t?.quote && t?.name).map((t: any) => ({ quote: t.quote, name: t.name, detail: t.detail ?? null })),
    seo_title: row.seo_title ?? null,
    seo_description: row.seo_description ?? null,
    objectives: row.objectives ?? null,
    learning_outcomes: row.learning_outcomes ?? null,
    admission_requirements: row.admission_requirements ?? null,
    career_opportunities: row.career_opportunities ?? null,
    further_study: row.further_study ?? null,
    curriculum: row.curriculum ?? [],
    faqs: row.faqs ?? [],
    coordinator: row.coordinator ?? null,
  };
}

export interface ProgrammesPage {
  hero_eyebrow: string | null;
  hero_heading: string | null;
  hero_intro: string | null;
  labels: Record<string, string>;
}

/** Hero text and wording of the Programmes listing page (Academics – Programmes Page). */
export async function getProgrammesPage(): Promise<ProgrammesPage> {
  const res = await strapiGet<{ data: any }>('programmes-page', {});
  const p = res?.data ?? null;
  return {
    hero_eyebrow: p?.hero_eyebrow ?? null,
    hero_heading: p?.hero_heading ?? null,
    hero_intro: p?.hero_intro ?? null,
    labels: p?.labels && typeof p.labels === 'object' ? p.labels : {},
  };
}
