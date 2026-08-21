import { strapiGet } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export type NoticeCategory = 'admissions' | 'registration' | 'results' | 'fees' | 'tender' | 'general';

export interface Notice {
  id: number;
  slug?: string; // notice has no slug field in Track A schema — using id-based routing until one is added
  title: string;
  body: string;
  category: NoticeCategory;
  owning_unit_name?: string | null;
  publish_at: string;
  expires_at: string;
  urgency: 'normal' | 'urgent';
  attachments: { label: string; file_url: string | null }[];
}

function mapNotice(row: any): Notice {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category,
    owning_unit_name: row.owning_unit?.name ?? null,
    publish_at: row.publish_at,
    expires_at: row.expires_at,
    urgency: row.urgency ?? 'normal',
    attachments: (row.attachments ?? []).map((a: any) => ({ label: a.label, file_url: a.file?.url ?? null })),
  };
}

/** Unexpired notices, newest first — the homepage/listing default view. */
export async function getCurrentNotices(limit = 6): Promise<Notice[]> {
  const res = await strapiGet<StrapiListResponse<any>>('notices', {
    filters: { expires_at: { $gt: new Date().toISOString() } },
    populate: ['owning_unit', 'attachments', 'attachments.file'],
    sort: 'publish_at:desc',
    pagination: { pageSize: limit },
  });
  return (res?.data ?? []).map(mapNotice);
}

export async function getNoticesByUnit(unitSlug: string, limit = 10): Promise<Notice[]> {
  const res = await strapiGet<StrapiListResponse<any>>('notices', {
    filters: {
      owning_unit: { slug: { $eq: unitSlug } },
      expires_at: { $gt: new Date().toISOString() },
    },
    populate: ['owning_unit'],
    sort: 'publish_at:desc',
    pagination: { pageSize: limit },
  });
  return (res?.data ?? []).map(mapNotice);
}

/** All unexpired notices, for the /news-notices/announcements listing. */
export async function getAllCurrentNotices(): Promise<Notice[]> {
  const res = await strapiGet<StrapiListResponse<any>>('notices', {
    filters: { expires_at: { $gt: new Date().toISOString() } },
    populate: ['owning_unit'],
    sort: 'publish_at:desc',
    pagination: { pageSize: 200 },
  });
  return (res?.data ?? []).map(mapNotice);
}

/** Expired notices — Style Guide §06: "never deleted", reachable via the archive link. */
export async function getArchivedNotices(): Promise<Notice[]> {
  const res = await strapiGet<StrapiListResponse<any>>('notices', {
    filters: { expires_at: { $lte: new Date().toISOString() } },
    populate: ['owning_unit'],
    sort: 'publish_at:desc',
    pagination: { pageSize: 200 },
  });
  return (res?.data ?? []).map(mapNotice);
}

/** All notice ids — used by getStaticPaths for the Article route. */
export async function getAllNoticeIds(): Promise<number[]> {
  const res = await strapiGet<StrapiListResponse<{ id: number }>>('notices', {
    fields: [],
    pagination: { pageSize: 500 },
  });
  return (res?.data ?? []).map((r) => r.id);
}

export async function getNoticeById(id: number): Promise<Notice | null> {
  const res = await strapiGet<{ data: any }>(`notices/${id}`, {
    populate: ['owning_unit', 'attachments', 'attachments.file'],
  });
  return res?.data ? mapNotice(res.data) : null;
}
