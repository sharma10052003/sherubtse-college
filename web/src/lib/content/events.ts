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
  is_past: boolean;
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
    is_past: new Date(row.ends_at ?? row.starts_at).getTime() < Date.now(),
  };
}

const POPULATE = ['image'];

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
    populate: POPULATE,
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
    populate: POPULATE,
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  return row ? mapEvent(row) : null;
}
