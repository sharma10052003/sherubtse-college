import { strapiGet } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export interface EventItem {
  id: number;
  title: string;
  description?: string | null;
  starts_at: string;
  ends_at?: string | null;
  venue?: string | null;
  open_to?: 'public' | 'students' | 'staff' | 'invited' | null;
  registration_link?: string | null;
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
    registration_link: row.registration_link ?? null,
  };
}

/** Upcoming events, soonest first — homepage "what's on". */
export async function getUpcomingEvents(limit = 4): Promise<EventItem[]> {
  const res = await strapiGet<StrapiListResponse<any>>('events', {
    filters: { starts_at: { $gte: new Date().toISOString() } },
    sort: 'starts_at:asc',
    pagination: { pageSize: limit },
  });
  return (res?.data ?? []).map(mapEvent);
}

/** All events, soonest first — the /news-notices/events listing. */
export async function getAllEvents(): Promise<EventItem[]> {
  const res = await strapiGet<StrapiListResponse<any>>('events', {
    sort: 'starts_at:desc',
    pagination: { pageSize: 200 },
  });
  return (res?.data ?? []).map(mapEvent);
}

export async function getAllEventIds(): Promise<number[]> {
  const res = await strapiGet<StrapiListResponse<{ id: number }>>('events', {
    fields: [],
    pagination: { pageSize: 500 },
  });
  return (res?.data ?? []).map((r) => r.id);
}

export async function getEventById(id: number): Promise<EventItem | null> {
  const res = await strapiGet<{ data: any }>(`events/${id}`);
  return res?.data ? mapEvent(res.data) : null;
}
