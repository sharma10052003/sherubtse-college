import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse, StrapiSingleResponse } from '../strapi';
import type { StrapiMedia } from '../types';

/** Splits a comma-separated free-text field (research areas, teaching
 * subjects, languages) into trimmed, non-empty tags — same convention
 * the PHP prototype used (`stc_faculty_tags()`), since these are plain
 * text fields in Strapi, not a relation. */
function tags(csv?: string | null): string[] {
  if (!csv) return [];
  return csv
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export interface Department {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  theme_color: string | null;
  display_order: number;
  head_slug: string | null;
}

export interface FacultyCard {
  id: number;
  slug: string;
  full_name: string;
  position: string | null;
  department_name: string | null;
  department_slug: string | null;
  highest_qualification: string | null;
  specialization: string | null;
  research_areas: string[];
  photo_url: string | null;
  is_featured: boolean;
  sort_order: number;
}

export interface Publication {
  id: number;
  title: string;
  journal: string | null;
  authors: string | null;
  publication_year: number | null;
  doi: string | null;
  pdf_url: string | null;
  external_link: string | null;
}

export interface Award {
  id: number;
  award_name: string;
  description: string | null;
  year: number | null;
  certificate_url: string | null;
}

export interface FacultyDetail extends FacultyCard {
  cover_image_url: string | null;
  employee_id: string | null;
  short_biography: string | null;
  date_joined: string | null;
  university: string | null;
  teaching_subjects: string[];
  work_experience: string | null;
  languages: string[];
  college_email: string | null;
  phone_number: string | null;
  office_location: string | null;
  office_hours: string | null;
  google_maps_link: string | null;
  linkedin_url: string | null;
  google_scholar_url: string | null;
  researchgate_url: string | null;
  orcid_url: string | null;
  personal_website_url: string | null;
  conference_images: string[];
  research_photos: string[];
  department_event_photos: string[];
  workshop_photos: string[];
  publications: Publication[];
  awards: Award[];
}

export interface FacultySetting {
  card_style: 'rounded' | 'sharp' | 'bordered';
  animation_style: 'fade' | 'slide' | 'zoom' | 'none';
  cards_per_row: number;
  student_count: number;
  button_style: 'solid' | 'outline' | 'gradient';
  show_statistics: boolean;
  show_publications: boolean;
  show_awards: boolean;
  show_gallery: boolean;
  show_contact: boolean;
  show_office_hours: boolean;
  show_research: boolean;
  hero_background_url: string | null;
}

function mapDepartment(row: any): Department {
  return {
    id: row.id,
    name: row.department_name,
    slug: row.slug,
    logo_url: mediaUrl(row.department_logo),
    description: row.description ?? null,
    theme_color: row.theme_color ?? null,
    display_order: row.display_order ?? 0,
    head_slug: row.head_of_department?.slug ?? null,
  };
}

function mapCard(row: any): FacultyCard {
  return {
    id: row.id,
    slug: row.slug,
    full_name: row.full_name,
    position: row.position ?? null,
    department_name: row.department?.department_name ?? null,
    department_slug: row.department?.slug ?? null,
    highest_qualification: row.highest_qualification ?? null,
    specialization: row.specialization ?? null,
    research_areas: tags(row.research_areas),
    photo_url: mediaUrl(row.profile_picture),
    is_featured: !!row.is_featured,
    sort_order: row.sort_order ?? 0,
  };
}

function mediaUrls(media: StrapiMedia[] | null | undefined): string[] {
  return (media ?? []).map((m) => mediaUrl(m)).filter((u): u is string => !!u);
}

export async function getFacultySetting(): Promise<FacultySetting> {
  const res = await strapiGet<StrapiSingleResponse<any>>('faculty-setting', {
    populate: ['hero_background'],
  });
  const row = res?.data;
  return {
    card_style: row?.card_style ?? 'sharp',
    animation_style: row?.animation_style ?? 'fade',
    cards_per_row: row?.cards_per_row ?? 3,
    student_count: row?.student_count ?? 0,
    button_style: row?.button_style ?? 'solid',
    show_statistics: row?.show_statistics ?? true,
    show_publications: row?.show_publications ?? true,
    show_awards: row?.show_awards ?? true,
    show_gallery: row?.show_gallery ?? true,
    show_contact: row?.show_contact ?? true,
    show_office_hours: row?.show_office_hours ?? true,
    show_research: row?.show_research ?? true,
    hero_background_url: mediaUrl(row?.hero_background),
  };
}

export async function getDepartments(): Promise<Department[]> {
  const res = await strapiGet<StrapiListResponse<any>>('departments', {
    populate: ['department_logo', 'head_of_department'],
    sort: 'display_order:asc',
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map(mapDepartment);
}

/** All active faculty, for the directory grid + client-side filtering.
 * Fetched once and handed to the React island rather than re-queried
 * per filter change — 47 rows is nothing to ship as JSON, and it keeps
 * the directory fully working with JS off (Astro SSRs the island). */
export async function getFacultyDirectory(): Promise<FacultyCard[]> {
  const res = await strapiGet<StrapiListResponse<any>>('faculty-profiles', {
    filters: { employment_status: { $eq: 'active' } },
    populate: ['profile_picture', 'department'],
    sort: ['sort_order:asc', 'full_name:asc'],
    pagination: { pageSize: 200 },
  });
  return (res?.data ?? []).map(mapCard);
}

export async function getFacultyBySlug(slug: string): Promise<FacultyDetail | null> {
  const res = await strapiGet<StrapiListResponse<any>>('faculty-profiles', {
    filters: { slug: { $eq: slug } },
    populate: {
      profile_picture: true,
      cover_image: true,
      department: true,
      conference_images: true,
      research_photos: true,
      department_event_photos: true,
      workshop_photos: true,
      publications: true,
      awards: { populate: ['certificate'] },
    },
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;

  return {
    ...mapCard(row),
    cover_image_url: mediaUrl(row.cover_image),
    employee_id: row.employee_id ?? null,
    short_biography: row.short_biography ?? null,
    date_joined: row.date_joined ?? null,
    university: row.university ?? null,
    teaching_subjects: tags(row.teaching_subjects),
    work_experience: row.work_experience ?? null,
    languages: tags(row.languages),
    college_email: row.college_email ?? null,
    phone_number: row.phone_number ?? null,
    office_location: row.office_location ?? null,
    office_hours: row.office_hours ?? null,
    google_maps_link: row.google_maps_link ?? null,
    linkedin_url: row.linkedin_url ?? null,
    google_scholar_url: row.google_scholar_url ?? null,
    researchgate_url: row.researchgate_url ?? null,
    orcid_url: row.orcid_url ?? null,
    personal_website_url: row.personal_website_url ?? null,
    conference_images: mediaUrls(row.conference_images),
    research_photos: mediaUrls(row.research_photos),
    department_event_photos: mediaUrls(row.department_event_photos),
    workshop_photos: mediaUrls(row.workshop_photos),
    publications: (row.publications ?? []).map((p: any) => ({
      id: p.id,
      title: p.title,
      journal: p.journal ?? null,
      authors: p.authors ?? null,
      publication_year: p.publication_year ?? null,
      doi: p.doi ?? null,
      pdf_url: mediaUrl(p.pdf),
      external_link: p.external_link ?? null,
    })),
    awards: (row.awards ?? []).map((a: any) => ({
      id: a.id,
      award_name: a.award_name,
      description: a.description ?? null,
      year: a.year ?? null,
      certificate_url: mediaUrl(a.certificate),
    })),
  };
}

export async function getResearchPublicationCount(): Promise<number> {
  const res = await strapiGet<StrapiListResponse<any>>('research-publications', {
    fields: ['id'],
    pagination: { pageSize: 1 },
  });
  return res?.meta?.pagination?.total ?? 0;
}
