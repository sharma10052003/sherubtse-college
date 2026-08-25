import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export interface NewsItem {
  id: number;
  title: string;
  body: string;
  date: string;
  unit_name?: string | null;
  image_url: string | null;
  tags: string[];
}

function mapNews(row: any): NewsItem {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    date: row.date,
    unit_name: row.unit?.name ?? null,
    image_url: mediaUrl(row.images?.[0]),
    tags: (row.tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean),
  };
}

/** All news items, newest first — the /news-notices/news listing. */
export async function getAllNews(): Promise<NewsItem[]> {
  const res = await strapiGet<StrapiListResponse<any>>('news-entries', {
    populate: ['unit', 'images'],
    sort: 'date:desc',
    pagination: { pageSize: 200 },
  });
  return (res?.data ?? []).map(mapNews);
}

/** Most recent news items — for homepage/section-landing use. */
export async function getRecentNews(limit = 4): Promise<NewsItem[]> {
  const res = await strapiGet<StrapiListResponse<any>>('news-entries', {
    populate: ['unit', 'images'],
    sort: 'date:desc',
    pagination: { pageSize: limit },
  });
  return (res?.data ?? []).map(mapNews);
}

export async function getAllNewsIds(): Promise<number[]> {
  const res = await strapiGet<StrapiListResponse<{ id: number }>>('news-entries', {
    fields: [],
    pagination: { pageSize: 500 },
  });
  return (res?.data ?? []).map((r) => r.id);
}

export async function getNewsById(id: number): Promise<NewsItem | null> {
  const res = await strapiGet<{ data: any }>(`news-entries/${id}`, {
    populate: ['unit', 'images'],
  });
  return res?.data ? mapNews(res.data) : null;
}
