import { strapiGet } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export type CalendarCategory = 'registration' | 'examination' | 'results' | 'fee' | 'holiday' | 'convocation';

export interface CalendarEntry {
  id: number;
  title: string;
  category: CalendarCategory;
  starts_on: string;
  ends_on?: string | null;
}

function mapEntry(row: any): CalendarEntry {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    starts_on: row.starts_on,
    ends_on: row.ends_on ?? null,
  };
}

export async function getCalendarEntries(): Promise<CalendarEntry[]> {
  const res = await strapiGet<StrapiListResponse<any>>('calendar-entries', {
    sort: 'starts_on:asc',
    pagination: { pageSize: 300 },
  });
  return (res?.data ?? []).map(mapEntry);
}
