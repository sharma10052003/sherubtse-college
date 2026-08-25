import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export type DocumentCategory = 'policy' | 'form' | 'timetable' | 'guide' | 'report' | 'other';

export interface DocumentRecord {
  id: number;
  title: string;
  file_url: string | null;
  file_format?: string | null;
  file_size?: number | null;
  category?: DocumentCategory | null;
  version?: string | null;
  effective_date?: string | null;
  owning_unit_name?: string | null;
}

function mapDocument(row: any): DocumentRecord {
  const file = row.file ?? null;
  return {
    id: row.id,
    title: row.title,
    file_url: mediaUrl(file),
    file_format: file?.ext ? String(file.ext).replace('.', '').toUpperCase() : null,
    file_size: file?.size ?? null,
    category: row.category ?? null,
    version: row.version ?? null,
    effective_date: row.effective_date ?? null,
    owning_unit_name: row.owning_unit?.name ?? null,
  };
}

/** Current documents only (is_current: true) — the register visitors should see by default. */
export async function getCurrentDocuments(): Promise<DocumentRecord[]> {
  const res = await strapiGet<StrapiListResponse<any>>('documents', {
    filters: { is_current: { $eq: true } },
    populate: ['file', 'owning_unit'],
    sort: 'title:asc',
    pagination: { pageSize: 200 },
  });
  return (res?.data ?? []).map(mapDocument);
}
