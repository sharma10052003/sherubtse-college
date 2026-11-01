import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export type OpenTo = 'public' | 'students' | 'staff' | 'invited';

export const OPEN_TO_LABELS: Record<OpenTo, string> = {
  public: 'Open to the Public',
  students: 'Students Only',
  staff: 'Staff Only',
  invited: 'Invitation Only',
};

export interface EventItem {
  id: number;
  title: string;
  description?: string | null;
  starts_at: string;
  ends_at?: string | null;
  venue?: string | null;
  open_to?: OpenTo | null;
  open_to_label: string | null;
  registration_link?: string | null;
  image_url: string | null;
  summary: string | null;
  /** One of the event types set in Strapi (academic, sports, cultural …). */
  category: string;
  featured: boolean;
  unit_name: string | null;
  is_past: boolean;
  /** After the event: the News story with its photos. */
  photo_story: { title: string; href: string } | null;
}

function mapEvent(row: any): EventItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    starts_at: row.starts_at,
    ends_at: row.ends_at ?? null,
    venue: row.venue ?? null,
    open_to: row.open_to ?? null,
    open_to_label: row.open_to ? OPEN_TO_LABELS[row.open_to as OpenTo] : null,
    registration_link: row.registration_link ?? null,
    image_url: mediaUrl(row.image),
    summary: row.summary ?? null,
    category: row.category ?? 'other',
    featured: !!row.is_featured,
    unit_name: row.owning_unit?.name ?? null,
    is_past: new Date(row.ends_at ?? row.starts_at).getTime() < Date.now(),
    photo_story: row.photo_story?.id ? { title: row.photo_story.title, href: `/news-notices/news/${row.photo_story.id}` } : null,
  };
}

const POPULATE = ['image', 'owning_unit'];

/** Upcoming events, soonest first — homepage "what's on". */
export async function getUpcomingEvents(limit = 4): Promise<EventItem[]> {
  const res = await strapiGet<StrapiListResponse<any>>('events', {
    filters: { starts_at: { $gte: new Date().toISOString() } },
    populate: POPULATE,
    sort: 'starts_at:asc',
    pagination: { pageSize: limit },
  });
  return (res?.data ?? []).map(mapEvent);
}

/** Every event, upcoming first (soonest first), past events after (most
 * recently past first) — the /news-notices/events mosaic. */
export async function getAllEvents(): Promise<EventItem[]> {
  const res = await strapiGet<StrapiListResponse<any>>('events', {
    populate: { image: true, owning_unit: true, photo_story: { fields: ['title'] } },
    sort: 'starts_at:asc',
    pagination: { pageSize: 200 },
  });
  const all = (res?.data ?? []).map(mapEvent);
  const upcoming = all.filter((e) => !e.is_past);
  const past = all.filter((e) => e.is_past).reverse();
  return [...upcoming, ...past];
}

export async function getAllEventIds(): Promise<number[]> {
  const res = await strapiGet<StrapiListResponse<{ id: number }>>('events', {
    fields: [],
    pagination: { pageSize: 500 },
  });
  return (res?.data ?? []).map((r) => r.id);
}

export async function getEventById(id: number): Promise<EventItem | null> {
  const res = await strapiGet<StrapiListResponse<any>>('events', {
    filters: { id: { $eq: id } },
    populate: { image: true, owning_unit: true, photo_story: { fields: ['title'] } },
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  return row ? mapEvent(row) : null;
}

export interface EventsPage {
  hero_eyebrow: string | null;
  hero_heading: string | null;
  hero_intro: string | null;
  labels: Record<string, string>;
}

/** Hero text and wording of the Events page (Strapi → News & Notices – Events Page). */
export async function getEventsPage(): Promise<EventsPage> {
  const res = await strapiGet<{ data: any }>('events-page', {});
  const p = res?.data ?? null;
  return {
    hero_eyebrow: p?.hero_eyebrow ?? null,
    hero_heading: p?.hero_heading ?? null,
    hero_intro: p?.hero_intro ?? null,
    labels: p?.labels && typeof p.labels === 'object' ? p.labels : {},
  };
}

export interface EventSession {
  time: string | null;
  title: string;
  description: string | null;
  venue: string | null;
}
export interface EventGuest {
  name: string;
  role: string | null;
  note: string | null;
  photo_url: string | null;
}
export interface EventDetail extends EventItem {
  gallery: { url: string; alt: string }[];
  programme: EventSession[];
  guests: EventGuest[];
  video_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

/** One event with everything the event page can show: the full story, programme, guests, photos, video and contacts. */
export async function getEventDetail(id: number): Promise<EventDetail | null> {
  const res = await strapiGet<StrapiListResponse<any>>('events', {
    filters: { id: { $eq: id } },
    populate: { image: true, owning_unit: true, photo_story: { fields: ['title'] }, gallery: true, programme: true, guests: { populate: ['photo'] } },
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;
  return {
    ...mapEvent(row),
    gallery: (row.gallery ?? [])
      .map((m: any) => ({ url: mediaUrl(m), alt: (m?.alternativeText || m?.caption || '').trim() }))
      .filter((g: { url: string | null }) => !!g.url) as { url: string; alt: string }[],
    programme: (row.programme ?? []).filter((p: any) => p?.title).map((p: any) => ({ time: p.time || null, title: p.title, description: p.description || null, venue: p.venue || null })),
    guests: (row.guests ?? []).filter((g: any) => g?.name).map((g: any) => ({ name: g.name, role: g.role || null, note: g.note || null, photo_url: mediaUrl(g.photo) })),
    video_url: row.video_url || null,
    contact_email: row.contact_email || null,
    contact_phone: row.contact_phone || null,
  };
}
