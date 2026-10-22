import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse, StrapiSingleResponse } from '../strapi';
import { renderArticle } from '../article-text';

/**
 * Campus Facilities (About → Campus Facilities in Strapi). Only published
 * records are returned (the REST default), so drafts never reach the page.
 */

const html = (md: string | null | undefined) => (md && md.trim() ? renderArticle(md).html : null);
const anchorOf = (v: string | null | undefined) => {
  const a = (v ?? '').trim().replace(/^#/, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
  return a || null;
};

export interface Image {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}
export interface LinkItem {
  label: string;
  url: string;
  external: boolean;
}
export interface FileItem {
  label: string;
  url: string;
  ext: string | null;
}
export interface Feature {
  title: string;
  description: string | null;
  icon: string;
}
export interface Category {
  slug: string;
  name: string;
  description: string | null;
  icon: string;
}

const img = (m: any, alt = ''): Image | null => {
  const url = mediaUrl(m);
  return url ? { url, alt: alt || m?.alternativeText || '', width: m?.width ?? null, height: m?.height ?? null } : null;
};
const links = (rows: any[] | null | undefined): LinkItem[] =>
  (rows ?? []).filter((l) => l?.label && l?.url).map((l) => ({ label: l.label, url: l.url, external: /^https?:\/\//i.test(l.url) }));
const files = (rows: any[] | null | undefined): FileItem[] =>
  (rows ?? [])
    .map((a) => {
      const url = mediaUrl(a?.file);
      return url ? { label: a.label || a.file?.name || 'Download', url, ext: (a.file?.ext ?? '').replace('.', '').toUpperCase() || null } : null;
    })
    .filter((f): f is FileItem => !!f);
const features = (rows: any[] | null | undefined): Feature[] =>
  (rows ?? []).filter((f) => f?.title).map((f) => ({ title: f.title, description: f.description ?? null, icon: f.icon ?? 'star' }));

export interface FeatureBlock {
  label: string | null;
  facility_slug: string | null;
  heading: string | null;
  intro_html: string | null;
  image: Image | null;
  image_position: 'left' | 'right';
  features: Feature[];
  more_heading: string | null;
  more_html: string | null;
  gallery: Image[];
  links: LinkItem[];
  documents: FileItem[];
}
const block = (b: any): FeatureBlock | null =>
  b
    ? {
        label: b.label ?? null,
        facility_slug: b.facility?.slug ?? null,
        heading: b.heading ?? null,
        intro_html: html(b.intro),
        image: img(b.image, b.image_alt ?? ''),
        image_position: b.image_position === 'right' ? 'right' : 'left',
        features: features(b.features),
        more_heading: b.more_heading ?? null,
        more_html: html(b.more_content),
        gallery: (b.gallery ?? []).map((m: any) => img(m)).filter(Boolean),
        links: links(b.links),
        documents: files(b.documents),
      }
    : null;

export type SectionKind = 'index' | 'library' | 'laboratories' | 'directory' | 'gallery' | 'links' | 'rich-text' | 'image-text' | 'cta';
export interface Section {
  kind: SectionKind;
  key: string;
  anchor: string | null;
  heading: string | null;
  intro: string | null;
  background: 'white' | 'soft' | 'navy';
  profiles_category?: string | null;
  columns?: 'two' | 'three' | 'four';
  expand_label?: string;
  card_style?: 'image_top' | 'image_left';
  show_search?: boolean;
  show_filters?: boolean;
  layout?: 'grid' | 'mosaic' | 'image_left' | 'image_right' | 'alternating' | 'list';
  limit?: number;
  body_html?: string | null;
  image?: Image | null;
  button?: LinkItem | null;
}
const KIND: Record<string, SectionKind> = {
  'facilities.section-index': 'index',
  'facilities.section-library': 'library',
  'facilities.section-laboratories': 'laboratories',
  'facilities.section-directory': 'directory',
  'facilities.section-gallery': 'gallery',
  'facilities.section-links': 'links',
  'sections.rich-text': 'rich-text',
  'sections.image-text': 'image-text',
  'sections.call-to-action': 'cta',
};
function mapSection(row: any, i: number): Section | null {
  const kind = KIND[row.__component];
  if (!kind || row.is_visible === false) return null;
  const base: Section = {
    kind,
    key: `${kind}-${i}`,
    anchor: anchorOf(row.anchor),
    heading: row.heading ?? null,
    intro: row.intro ?? row.text ?? null,
    background: ['soft', 'navy'].includes(row.background) ? row.background : 'white',
  };
  switch (kind) {
    case 'index':
      return { ...base, columns: row.columns === 'two' ? 'two' : 'three' };
    case 'laboratories':
      return { ...base, profiles_category: row.profiles_category?.slug ?? null };
    case 'directory':
      return {
        ...base,
        columns: row.columns === 'four' ? 'four' : 'three',
        card_style: row.card_style === 'image_left' ? 'image_left' : 'image_top',
        show_search: row.show_search !== false,
        show_filters: row.show_filters !== false,
        layout: row.layout === 'list' ? 'list' : 'alternating',
        expand_label: row.expand_label || 'Explore facility details',
      };
    case 'gallery':
      return { ...base, layout: row.layout === 'grid' ? 'grid' : 'mosaic', show_filters: row.show_filters !== false, limit: Math.max(1, Number(row.limit) || 24) };
    case 'links':
      return { ...base, columns: row.columns === 'three' ? 'three' : 'four' };
    case 'rich-text':
      return { ...base, body_html: html(row.body) };
    case 'image-text':
      return { ...base, body_html: html(row.body), image: img(row.image, row.image_alt ?? ''), layout: row.image_side === 'left' ? 'image_left' : 'image_right' };
    case 'cta':
      return { ...base, button: row.button_label && row.button_url ? { label: row.button_label, url: row.button_url, external: /^https?:/i.test(row.button_url) } : null };
    default:
      return base;
  }
}

export interface FacilitiesPage {
  eyebrow: string | null;
  hero_caption: string | null;
  title: string;
  intro: string | null;
  hero_images: Image[];
  quick_nav: { label: string; target: string }[];
  library: FeatureBlock | null;
  laboratories: FeatureBlock | null;
  messages: { no_facilities: string; no_filter_results: string; no_gallery: string; no_lab_profiles: string };
  sections: Section[];
  seo_title: string | null;
  seo_description: string | null;
}

export interface Facility {
  id: number;
  slug: string;
  name: string;
  categories: Category[];
  summary: string | null;
  content_html: string | null;
  main_image: Image | null;
  images: Image[];
  features: Feature[];
  uses_html: string | null;
  location: string | null;
  building: string | null;
  opening_hours: string | null;
  access_conditions: string | null;
  accessibility: string | null;
  policies_html: string | null;
  department: string | null;
  contact: { office: string | null; person: string | null; email: string | null; phone: string | null; note: string | null } | null;
  links: LinkItem[];
  documents: FileItem[];
  display_mode: 'page' | 'panel' | 'card_only';
  featured: boolean;
}

export interface GalleryImage {
  id: number;
  image: Image;
  caption: string | null;
  category: Category | null;
  facility_slug: string | null;
  featured: boolean;
}

export interface QuickLink {
  label: string;
  description: string | null;
  url: string;
  icon: string;
  external: boolean;
}

const mapCategory = (c: any): Category => ({ slug: c.slug, name: c.name, description: c.description ?? null, icon: c.icon ?? 'star' });

const FACILITY_POPULATE = {
  categories: true,
  main_image: true,
  images: true,
  features: true,
  department: { fields: ['name'] },
  contact: true,
  links: true,
  documents: { populate: ['file'] },
};

function mapFacility(f: any): Facility {
  const contact = f.contact || f.contact_note
    ? {
        office: f.contact?.group_title ?? null,
        person: [f.contact?.full_name, f.contact?.role_title].filter(Boolean).join(' — ') || null,
        email: f.contact?.email ?? null,
        phone: f.contact?.phone ?? null,
        note: f.contact_note ?? null,
      }
    : null;
  return {
    id: f.id,
    slug: f.slug,
    name: f.name,
    categories: (f.categories ?? []).map(mapCategory),
    summary: f.summary ?? null,
    content_html: html(f.content),
    main_image: img(f.main_image, f.image_alt ?? ''),
    images: (f.images ?? []).map((m: any) => img(m)).filter(Boolean),
    features: features(f.features),
    uses_html: html(f.uses),
    location: f.location ?? null,
    building: f.building ?? null,
    opening_hours: f.opening_hours ?? null,
    access_conditions: f.access_conditions ?? null,
    accessibility: f.accessibility ?? null,
    policies_html: html(f.policies),
    department: f.department?.name ?? null,
    contact,
    links: links(f.links),
    documents: files(f.documents),
    display_mode: ['page', 'card_only'].includes(f.display_mode) ? f.display_mode : 'panel',
    featured: !!f.is_featured,
  };
}

const list = async (path: string, params: Record<string, unknown>) =>
  ((await strapiGet<StrapiListResponse<any>>(path, { pagination: { pageSize: 200 }, ...params }))?.data ?? []) as any[];

export async function getFacilities(): Promise<Facility[]> {
  const rows = await list('facilities', { sort: ['is_featured:desc', 'display_order:asc', 'name:asc'], populate: FACILITY_POPULATE });
  return rows.map(mapFacility);
}

export async function getFacilityBySlug(slug: string): Promise<Facility | null> {
  const rows = await list('facilities', { filters: { slug: { $eq: slug } }, populate: FACILITY_POPULATE });
  return rows[0] ? mapFacility(rows[0]) : null;
}

export async function getFacilitiesData() {
  const [pageRes, categoryRows, facilities, galleryRows, linkRows] = await Promise.all([
    strapiGet<StrapiSingleResponse<any>>('facilities-page', {
      populate: {
        hero_images: true,
        quick_nav: true,
        library: { populate: { image: true, features: true, gallery: true, links: true, documents: { populate: ['file'] }, facility: { fields: ['slug'] } } },
        laboratories: { populate: { image: true, features: true, gallery: true, links: true, documents: { populate: ['file'] }, facility: { fields: ['slug'] } } },
        messages: true,
        seo: true,
        sections: {
          on: {
            'facilities.section-index': { populate: '*' },
            'facilities.section-library': { populate: '*' },
            'facilities.section-laboratories': { populate: ['profiles_category'] },
            'facilities.section-directory': { populate: '*' },
            'facilities.section-gallery': { populate: '*' },
            'facilities.section-links': { populate: '*' },
            'sections.rich-text': { populate: '*' },
            'sections.image-text': { populate: ['image'] },
            'sections.call-to-action': { populate: '*' },
          },
        },
      },
    }),
    list('facility-categories', { filters: { is_active: { $eq: true } }, sort: ['display_order:asc', 'name:asc'] }),
    getFacilities(),
    list('facility-gallery-images', { sort: ['is_featured:desc', 'display_order:asc'], populate: { image: true, category: true, facility: { fields: ['slug'] } } }),
    list('facility-quick-links', { filters: { is_active: { $eq: true } }, sort: ['display_order:asc'] }),
  ]);
  const p = pageRes?.data ?? null;
  const activeCategories = categoryRows.map(mapCategory);
  const activeSlugs = new Set(activeCategories.map((c) => c.slug));
  // Facilities keep only categories that are active.
  for (const f of facilities) f.categories = f.categories.filter((c) => activeSlugs.has(c.slug));

  const page: FacilitiesPage = {
    eyebrow: p?.eyebrow ?? null,
    hero_caption: p?.hero_caption ?? null,
    title: p?.title || 'Campus Facilities',
    intro: p?.intro ?? null,
    hero_images: (p?.hero_images ?? []).map((m: any) => img(m, p?.hero_image_alt ?? '')).filter(Boolean),
    quick_nav: (p?.quick_nav ?? []).filter((n: any) => n?.label && n?.target && n.is_visible !== false).map((n: any) => ({ label: n.label, target: n.target })),
    library: block(p?.library),
    laboratories: block(p?.laboratories),
    messages: {
      no_facilities: p?.messages?.no_facilities || 'Facility details are being added. Please check back soon.',
      no_filter_results: p?.messages?.no_filter_results || 'No facilities match your search. Try another word or category.',
      no_gallery: p?.messages?.no_gallery ?? '',
      no_lab_profiles: p?.messages?.no_lab_profiles ?? '',
    },
    sections: ((p?.sections ?? []) as any[]).map(mapSection).filter((s): s is Section => !!s),
    seo_title: p?.seo?.title ?? null,
    seo_description: p?.seo?.description ?? null,
  };

  const gallery: GalleryImage[] = galleryRows
    .map((g) => {
      const image = img(g.image, g.alt_text ?? '');
      return image
        ? { id: g.id, image, caption: g.caption ?? null, category: g.category && activeSlugs.has(g.category.slug) ? mapCategory(g.category) : null, facility_slug: g.facility?.slug ?? null, featured: !!g.is_featured }
        : null;
    })
    .filter((g): g is GalleryImage => !!g);

  // Only categories that actually have published facilities or photos.
  const used = new Set([...facilities.flatMap((f) => f.categories.map((c) => c.slug)), ...gallery.map((g) => g.category?.slug).filter(Boolean)]);
  const categories = activeCategories.filter((c) => used.has(c.slug));

  return {
    ok: !!p,
    page,
    categories,
    facilities,
    gallery,
    quickLinks: linkRows.map((l) => ({ label: l.label, description: l.description ?? null, url: l.url, icon: l.icon ?? 'link', external: l.link_type === 'external' || /^https?:\/\//i.test(l.url) })) as QuickLink[],
  };
}
