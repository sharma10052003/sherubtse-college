import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse, StrapiSingleResponse } from '../strapi';
import type { ContactBlock, StrapiMedia } from '../types';
import { renderArticle } from '../article-text';

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

// ---------------------------------------------------------------------------
// Administrative Units page (about/units) — the richer view of administrative
// units. A unit links to its office in Contact – Offices, which supplies the
// head's name, designation, email, phone and photo unless the unit overrides
// them, so a change of head is made once, in one place.


export interface UnitCategory {
  slug: string;
  name: string;
  description: string | null;
}
export interface AdminUnit {
  slug: string;
  name: string;
  summary: string | null;
  description_html: string | null;
  category: UnitCategory | null;
  head_name: string | null;
  head_designation: string | null;
  portrait: { url: string; alt: string; width: number | null; height: number | null } | null;
  initials: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  hours: string | null;
  responsibilities: { title: string; description: string | null }[];
  services: { title: string; description: string | null }[];
  links: { label: string; url: string; external: boolean }[];
  documents: { label: string; url: string; ext: string | null }[];
  featured: boolean;
  order: number;
}

const initialsOf = (s: string) =>
  s
    .replace(/&/g, ' ')
    .replace(/\b(office|of|the|and)\b/gi, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

const ADMIN_POPULATE = {
  category: true,
  office: { populate: ['photo'] },
  head: { populate: ['photo'] },
  head_portrait: true,
  contact: true,
  responsibilities: true,
  services: true,
  links: true,
  documents: { populate: ['file'] },
};

function mapAdminUnit(row: any): AdminUnit {
  const office = row.office ?? null;
  const person = row.head ?? null;
  const headName = row.head_name || office?.full_name || person?.full_name || null;
  const designation = row.head_designation || office?.role_title || person?.designation || null;
  const portraitMedia = row.head_portrait || office?.photo || person?.photo || null;
  const portraitUrl = mediaUrl(portraitMedia);
  const points = (rows: any[] | null | undefined) => (rows ?? []).filter((p) => p?.title).map((p) => ({ title: p.title, description: p.description ?? null }));
  return {
    slug: row.slug,
    name: row.name,
    summary: row.summary ?? null,
    description_html: row.description && row.description.trim() !== (row.summary ?? '').trim() ? renderArticle(row.description).html : null,
    category: row.category ? { slug: row.category.slug, name: row.category.name, description: row.category.description ?? null } : null,
    head_name: headName,
    head_designation: designation,
    portrait: portraitUrl
      ? {
          url: portraitUrl,
          alt: row.head_portrait_alt || (headName ? `Portrait of ${headName}${designation ? `, ${designation}` : ''}` : ''),
          width: portraitMedia?.width ?? null,
          height: portraitMedia?.height ?? null,
        }
      : null,
    initials: initialsOf(headName && /\s/.test(headName) ? headName : row.short_name || row.name),
    email: row.contact?.email || office?.email || null,
    phone: row.contact?.phone || office?.phone || null,
    location: row.location || row.contact?.office || office?.office_location || null,
    hours: row.contact?.hours || null,
    responsibilities: points(row.responsibilities),
    services: points(row.services),
    links: (row.links ?? []).filter((l: any) => l?.label && l?.url).map((l: any) => ({ label: l.label, url: l.url, external: /^https?:\/\//i.test(l.url) })),
    documents: (row.documents ?? [])
      .map((d: any) => {
        const url = mediaUrl(d?.file);
        return url ? { label: d.label || d.file?.name || 'Download', url, ext: (d.file?.ext ?? '').replace('.', '').toUpperCase() || null } : null;
      })
      .filter(Boolean),
    featured: !!row.is_featured,
    order: row.display_order ?? 0,
  };
}

export async function getAdminUnits(): Promise<AdminUnit[]> {
  const res = await strapiGet<StrapiListResponse<any>>('units', {
    filters: { kind: { $eq: 'administrative' } },
    populate: ADMIN_POPULATE,
    sort: ['display_order:asc', 'name:asc'],
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map(mapAdminUnit);
}

export async function getAdminUnitBySlug(slug: string): Promise<AdminUnit | null> {
  const res = await strapiGet<StrapiListResponse<any>>('units', {
    filters: { slug: { $eq: slug }, kind: { $eq: 'administrative' } },
    populate: ADMIN_POPULATE,
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  return row ? mapAdminUnit(row) : null;
}

export interface UnitsPage {
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  intro: string | null;
  hero_image: { url: string; alt: string } | null;
  featured_heading: string;
  featured_intro: string | null;
  directory_heading: string;
  directory_intro: string | null;
  empty_message: string;
  seo_title: string | null;
  seo_description: string | null;
}

export async function getUnitsPage(): Promise<UnitsPage> {
  const res = await strapiGet<StrapiSingleResponse<any>>('units-page', { populate: ['hero_image', 'seo'] });
  const p = res?.data ?? null;
  const heroUrl = mediaUrl(p?.hero_image);
  return {
    eyebrow: p?.eyebrow ?? 'About Sherubtse',
    title: p?.title || 'Our Administrative Units',
    subtitle: p?.subtitle ?? null,
    intro: p?.intro ?? null,
    hero_image: heroUrl ? { url: heroUrl, alt: p?.hero_image_alt ?? '' } : null,
    featured_heading: p?.featured_heading || 'Leadership Offices',
    featured_intro: p?.featured_intro ?? null,
    directory_heading: p?.directory_heading || 'All Administrative Units',
    directory_intro: p?.directory_intro ?? null,
    empty_message: p?.empty_message || 'Administrative units will be listed here soon.',
    seo_title: p?.seo?.title ?? null,
    seo_description: p?.seo?.description ?? null,
  };
}

export async function getUnitCategories(): Promise<UnitCategory[]> {
  const res = await strapiGet<StrapiListResponse<any>>('unit-categories', {
    filters: { is_active: { $eq: true } },
    sort: ['display_order:asc', 'name:asc'],
    pagination: { pageSize: 50 },
  });
  return (res?.data ?? []).map((c: any) => ({ slug: c.slug, name: c.name, description: c.description ?? null }));
}
