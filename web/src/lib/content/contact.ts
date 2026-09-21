import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse, StrapiSingleResponse } from '../strapi';

export interface ContactPageContent {
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string | null;
  office_hours: string | null;
  general_email: string | null;
  general_phone: string | null;
  map_url: string | null;
}

export interface ContactOffice {
  id: number;
  group_title: string;
  group_description: string | null;
  group_icon: string | null;
  group_order: number;
  full_name: string | null;
  role_title: string | null;
  email: string | null;
  phone: string | null;
  office_location: string | null;
  photo_url: string | null;
}

const HERO_DEFAULTS: ContactPageContent = {
  hero_eyebrow: 'Get in Touch',
  hero_title: "Let's Connect",
  hero_subtitle:
    'Whether you are a prospective student, parent, researcher, alumni, partner, or member of the Sherubtse community, we are here to help you connect with the right office.',
  office_hours: null,
  general_email: null,
  general_phone: null,
  map_url: null,
};

export async function getContactPageContent(): Promise<ContactPageContent> {
  const res = await strapiGet<StrapiSingleResponse<any>>('contact-page-content');
  const row = res?.data;
  if (!row) return HERO_DEFAULTS;
  return {
    hero_eyebrow: row.hero_eyebrow ?? HERO_DEFAULTS.hero_eyebrow,
    hero_title: row.hero_title ?? HERO_DEFAULTS.hero_title,
    hero_subtitle: row.hero_subtitle ?? HERO_DEFAULTS.hero_subtitle,
    office_hours: row.office_hours ?? null,
    general_email: row.general_email ?? null,
    general_phone: row.general_phone ?? null,
    map_url: row.map_url ?? null,
  };
}

/** The 7 office cards for "Find the Right Office" and the "How Can We Help?"
 * category lookup both read from this same list — one real source of contact
 * data, grouped by `group_title`, rather than two separate content sets. */
export async function getContactOffices(): Promise<ContactOffice[]> {
  const res = await strapiGet<StrapiListResponse<any>>('contact-people', {
    populate: ['photo'],
    sort: ['group_order:asc', 'display_order:asc'],
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map((row: any) => ({
    id: row.id,
    group_title: row.group_title,
    group_description: row.group_description ?? null,
    group_icon: row.group_icon ?? null,
    group_order: row.group_order ?? 0,
    full_name: row.full_name ?? null,
    role_title: row.role_title ?? null,
    email: row.email ?? null,
    phone: row.phone ?? null,
    office_location: row.office_location ?? null,
    photo_url: mediaUrl(row.photo),
  }));
}
