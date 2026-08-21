import { strapiGet } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export interface ContentPage {
  id: number;
  title: string;
  slug: string;
  body: string;
}

function mapPage(row: any): ContentPage {
  return { id: row.id, title: row.title, slug: row.slug, body: row.body };
}

export async function getAllPageSlugs(): Promise<string[]> {
  const res = await strapiGet<StrapiListResponse<{ slug: string }>>('pages', {
    fields: ['slug'],
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map((r) => r.slug);
}

export async function getPageBySlug(slug: string): Promise<ContentPage | null> {
  const res = await strapiGet<StrapiListResponse<any>>('pages', {
    filters: { slug: { $eq: slug } },
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  return row ? mapPage(row) : null;
}
