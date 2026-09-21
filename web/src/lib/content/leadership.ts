import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse, StrapiSingleResponse } from '../strapi';

export interface AboutPage {
  heading: string;
  intro: string;
  contact_note: string;
  seo_description: string | null;
}

export interface Leader {
  id: number;
  name: string;
  role_title: string;
  category: 'president' | 'dean';
  photo_url: string | null;
  photo_width: number | null;
  photo_height: number | null;
  initials: string;
  alt: string;
}

/** Editors sometimes paste from Word/the old site, where a dash arrives as a
 * replacement character. Turn a stray one between spaces back into a dash. */
function clean(text: string | null | undefined): string {
  return (text ?? '').replace(/\s�\s/g, ' – ').replace(/�/g, '').trim();
}

const DEFAULT_PAGE: AboutPage = {
  heading: 'About the College',
  intro: '',
  contact_note: 'For contact details for each office, see the Contact page.',
  seo_description: null,
};

export async function getAboutPage(): Promise<AboutPage> {
  const res = await strapiGet<StrapiSingleResponse<any>>('about-page');
  const row = res?.data;
  if (!row) return DEFAULT_PAGE;
  return {
    heading: clean(row.heading) || DEFAULT_PAGE.heading,
    intro: clean(row.intro),
    contact_note: clean(row.contact_note) || DEFAULT_PAGE.contact_note,
    seo_description: clean(row.seo_description) || null,
  };
}

function initialsOf(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2)).toUpperCase();
}

/** Active leaders only, President first, then by display_order. Returns [] if
 * Strapi is unreachable so the page can show its friendly fallback. */
export async function getLeaders(): Promise<Leader[]> {
  const res = await strapiGet<StrapiListResponse<any>>('leadership-members', {
    filters: { active: { $eq: true } },
    populate: ['photo'],
    sort: ['display_order:asc', 'full_name:asc'],
    pagination: { pageSize: 50 },
  });
  const leaders = (res?.data ?? []).map((row: any): Leader => {
    const name = [clean(row.honorific), clean(row.full_name)].filter(Boolean).join(' ');
    const role = clean(row.role_title);
    return {
      id: row.id,
      name,
      role_title: role,
      category: row.category === 'president' ? 'president' : 'dean',
      photo_url: mediaUrl(row.photo),
      photo_width: row.photo?.width ?? null,
      photo_height: row.photo?.height ?? null,
      initials: initialsOf(clean(row.full_name)),
      alt: row.photo?.alternativeText || `Portrait of ${name}, ${role}`,
    };
  });
  return leaders.sort((a, b) => Number(b.category === 'president') - Number(a.category === 'president'));
}
