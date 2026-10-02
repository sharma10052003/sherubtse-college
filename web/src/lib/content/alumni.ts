import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse, StrapiSingleResponse } from '../strapi';

export interface AlumniSetting {
  hero_background_url: string | null;
  years_of_legacy: number | null;
  countries_represented: number | null;
  total_alumni_override: number | null;
  show_statistics: boolean;
  show_events: boolean;
  show_gallery: boolean;
  show_achievements: boolean;
  show_chapters: boolean;
  show_newsletter: boolean;
}

export interface AlumniCard {
  id: number;
  slug: string;
  full_name: string;
  current_role: string | null;
  excerpt: string | null;
  article_title: string | null;
  category: string | null;
  graduation_year: number | null;
  photo_url: string | null;
  is_featured: boolean;
}

export interface AlumniDetail extends AlumniCard {
  programme: string | null;
  organization: string | null;
  story: string | null;
  publishedAt: string | null;
}

export interface AlumniEvent {
  id: number;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  venue: string | null;
  registration_link: string | null;
  image_url: string | null;
  is_past: boolean;
}

export interface AlumniChapter {
  id: number;
  name: string;
  country: string;
  description: string | null;
  contact_email: string | null;
  logo_url: string | null;
}

export interface AlumniAchievement {
  id: number;
  alumni_name: string;
  title: string;
  description: string | null;
  category: string;
  year: number | null;
}

export interface AlumniGalleryImage {
  id: number;
  image_url: string;
  caption: string | null;
  category: string;
}

export const ALUMNI_CATEGORY_LABELS: Record<string, string> = {
  sherubtse_journey: 'Sherubtse Journey',
  career_journey: 'Career Journey',
  student_memories: 'Student Memories',
  leadership: 'Leadership',
  entrepreneurship: 'Entrepreneurship',
  research: 'Research',
  community_service: 'Community Service',
  international_journey: 'International Journey',
};

export const ACHIEVEMENT_CATEGORY_LABELS: Record<string, string> = {
  award: 'Award',
  leadership: 'Leadership',
  research: 'Research',
  publication: 'Publication',
  entrepreneurship: 'Entrepreneurship',
  community_service: 'Community Service',
  international: 'International',
  professional_recognition: 'Professional Recognition',
};

export const GALLERY_CATEGORY_LABELS: Record<string, string> = {
  old_sherubtse: 'Old Sherubtse',
  campus_memories: 'Campus Memories',
  student_life: 'Student Life',
  graduation: 'Graduation',
  alumni_reunions: 'Alumni Reunions',
  college_events: 'College Events',
  historical_moments: 'Historical Moments',
};

function mapCard(row: any): AlumniCard {
  return {
    id: row.id,
    slug: row.slug,
    full_name: row.full_name,
    current_role: row.current_role ?? null,
    excerpt: row.excerpt ?? null,
    article_title: row.article_title ?? null,
    category: row.category ?? null,
    graduation_year: row.graduation_year ?? null,
    photo_url: mediaUrl(row.photo),
    is_featured: !!row.is_featured,
  };
}

export async function getAlumniSetting(): Promise<AlumniSetting> {
  const res = await strapiGet<StrapiSingleResponse<any>>('alumni-setting', {
    populate: ['hero_background'],
  });
  const row = res?.data;
  return {
    hero_background_url: mediaUrl(row?.hero_background),
    years_of_legacy: row?.years_of_legacy ?? null,
    countries_represented: row?.countries_represented ?? null,
    total_alumni_override: row?.total_alumni_override ?? null,
    show_statistics: row?.show_statistics ?? true,
    show_events: row?.show_events ?? true,
    show_gallery: row?.show_gallery ?? true,
    show_achievements: row?.show_achievements ?? true,
    show_chapters: row?.show_chapters ?? true,
    show_newsletter: row?.show_newsletter ?? true,
  };
}

export interface SectionCopy {
  eyebrow: string;
  heading: string;
  intro: string;
  paragraphs: string[];
  tagline: string;
  button_label: string;
  secondary_button_label: string;
}
export interface MattersCard { icon: string; title: string; text: string }
export interface AlumniContactItem { kind: string; label: string; link: string | null }

/** Every piece of wording on the Alumni page except the form field labels,
 * all edited in Strapi under Alumni – Page. Missing values come back empty so
 * the template simply omits them instead of showing placeholder text. */
export interface AlumniCopy {
  seo_description: string | null;
  hero: SectionCopy;
  about: SectionCopy;
  matters: SectionCopy;
  matters_cards: MattersCard[];
  distinguished: SectionCopy;
  stories: SectionCopy;
  story_form: SectionCopy;
  events: SectionCopy;
  mentorship: SectionCopy;
  global_reach: SectionCopy;
  gallery: SectionCopy;
  achievements: SectionCopy;
  register: SectionCopy;
  newsletter: SectionCopy;
  contact: SectionCopy;
  contact_items: AlumniContactItem[];
  labels: Record<'total_alumni' | 'years' | 'countries' | 'stories' | 'alumni' | 'chapters' | 'upcoming_events' | 'past_events' | 'gallery_all', string>;
  texts: Record<'stories_empty' | 'upcoming_empty' | 'past_empty' | 'story_consent' | 'story_success' | 'register_consent' | 'register_success' | 'newsletter_placeholder' | 'newsletter_success' | 'newsletter_already' | 'error', string>;
}

const clean = (t: unknown) => (typeof t === 'string' ? t.replace(/�/g, '').trim() : '');
const sc = (c: any): SectionCopy => ({
  eyebrow: clean(c?.eyebrow),
  heading: clean(c?.heading),
  intro: clean(c?.intro),
  paragraphs: clean(c?.body).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
  tagline: clean(c?.tagline),
  button_label: clean(c?.button_label),
  secondary_button_label: clean(c?.secondary_button_label),
});

export async function getAlumniCopy(): Promise<AlumniCopy> {
  const res = await strapiGet<StrapiSingleResponse<any>>('alumni-setting', {
    populate: ['hero', 'about', 'matters', 'matters_cards', 'distinguished', 'stories', 'story_form', 'events', 'mentorship', 'global_reach', 'gallery', 'achievements', 'register', 'newsletter', 'contact', 'contact_items'],
  });
  const r = res?.data ?? {};
  return {
    seo_description: clean(r.seo_description) || null,
    hero: sc(r.hero), about: sc(r.about), matters: sc(r.matters),
    matters_cards: (r.matters_cards ?? []).map((c: any) => ({ icon: c.icon ?? 'star', title: clean(c.title), text: clean(c.text) })),
    distinguished: sc(r.distinguished), stories: sc(r.stories), story_form: sc(r.story_form), events: sc(r.events),
    mentorship: sc(r.mentorship), global_reach: sc(r.global_reach), gallery: sc(r.gallery), achievements: sc(r.achievements),
    register: sc(r.register), newsletter: sc(r.newsletter), contact: sc(r.contact),
    contact_items: (r.contact_items ?? []).map((c: any) => ({ kind: c.kind, label: clean(c.label), link: c.link || null })),
    labels: {
      total_alumni: clean(r.label_total_alumni), years: clean(r.label_years), countries: clean(r.label_countries),
      stories: clean(r.label_stories), alumni: clean(r.label_alumni), chapters: clean(r.label_chapters),
      upcoming_events: clean(r.label_upcoming_events), past_events: clean(r.label_past_events), gallery_all: clean(r.label_gallery_all),
    },
    texts: {
      stories_empty: clean(r.stories_empty_text), upcoming_empty: clean(r.upcoming_empty_text), past_empty: clean(r.past_empty_text),
      story_consent: clean(r.story_consent_text), story_success: clean(r.story_success_message),
      register_consent: clean(r.register_consent_text), register_success: clean(r.register_success_message),
      newsletter_placeholder: clean(r.newsletter_placeholder), newsletter_success: clean(r.newsletter_success_message),
      newsletter_already: clean(r.newsletter_already_message), error: clean(r.error_message),
    },
  };
}

export async function getDistinguishedAlumni(): Promise<AlumniCard[]> {
  const res = await strapiGet<StrapiListResponse<any>>('alumnis', {
    filters: { is_featured: { $eq: true } },
    populate: ['photo'],
    sort: 'full_name:asc',
    pagination: { pageSize: 50 },
  });
  return (res?.data ?? []).map(mapCard);
}

/** Non-featured alumni who've written a story, for the "Alumni Stories" grid — featured
 * profiles get their own Distinguished Alumni spotlight above, so they're excluded here
 * to avoid showing the same four people twice. */
export async function getAlumniStories(pageSize = 50): Promise<AlumniCard[]> {
  const res = await strapiGet<StrapiListResponse<any>>('alumnis', {
    filters: { is_featured: { $eq: false }, article_title: { $notNull: true } },
    populate: ['photo'],
    sort: 'publishedAt:desc',
    pagination: { pageSize },
  });
  return (res?.data ?? []).map(mapCard);
}

export async function getAlumniBySlug(slug: string): Promise<AlumniDetail | null> {
  const res = await strapiGet<StrapiListResponse<any>>('alumnis', {
    filters: { slug: { $eq: slug } },
    populate: ['photo'],
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;
  return {
    ...mapCard(row),
    programme: row.programme ?? null,
    organization: row.organization ?? null,
    story: row.story ?? null,
    publishedAt: row.publishedAt ?? null,
  };
}

export async function getAlumniCount(): Promise<number> {
  const res = await strapiGet<StrapiListResponse<any>>('alumnis', {
    fields: ['id'],
    pagination: { pageSize: 1 },
  });
  return res?.meta?.pagination?.total ?? 0;
}

/** Alumni events reuse the shared `event` content type (same one the homepage "What's
 * on" strip and academic calendar use), scoped to the Alumni Office's unit — no
 * duplicate alumni-specific schema needed just to add an image field. */
export async function getAlumniEvents(): Promise<AlumniEvent[]> {
  const res = await strapiGet<StrapiListResponse<any>>('events', {
    filters: { owning_unit: { slug: { $eq: 'office-of-research-and-industrial-linkages' } } },
    populate: ['image'],
    sort: 'starts_at:asc',
    pagination: { pageSize: 100 },
  });
  const now = Date.now();
  return (res?.data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    starts_at: row.starts_at,
    ends_at: row.ends_at ?? null,
    venue: row.venue ?? null,
    registration_link: row.registration_link ?? null,
    image_url: mediaUrl(row.image),
    is_past: new Date(row.starts_at).getTime() < now,
  }));
}

export async function getAlumniChapters(): Promise<AlumniChapter[]> {
  const res = await strapiGet<StrapiListResponse<any>>('alumni-chapters', {
    populate: ['logo'],
    sort: ['sort_order:asc', 'name:asc'],
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    country: row.country,
    description: row.description ?? null,
    contact_email: row.contact_email ?? null,
    logo_url: mediaUrl(row.logo),
  }));
}

export async function getAlumniAchievements(): Promise<AlumniAchievement[]> {
  const res = await strapiGet<StrapiListResponse<any>>('alumni-achievements', {
    sort: ['year:desc'],
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map((row: any) => ({
    id: row.id,
    alumni_name: row.alumni_name,
    title: row.title,
    description: row.description ?? null,
    category: row.category,
    year: row.year ?? null,
  }));
}

export async function getAlumniGallery(): Promise<AlumniGalleryImage[]> {
  const res = await strapiGet<StrapiListResponse<any>>('alumni-gallery-images', {
    populate: ['image'],
    sort: ['sort_order:asc'],
    pagination: { pageSize: 200 },
  });
  return (res?.data ?? [])
    .map((row: any) => ({
      id: row.id,
      image_url: mediaUrl(row.image),
      caption: row.caption ?? null,
      category: row.category ?? 'campus_memories',
    }))
    .filter((img): img is AlumniGalleryImage => !!img.image_url);
}

export async function getAlumniChapterCount(): Promise<number> {
  const res = await strapiGet<StrapiListResponse<any>>('alumni-chapters', {
    fields: ['id'],
    pagination: { pageSize: 1 },
  });
  return res?.meta?.pagination?.total ?? 0;
}
