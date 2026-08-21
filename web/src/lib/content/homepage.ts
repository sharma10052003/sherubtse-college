import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiSingleResponse } from '../strapi';
import type { LinkItem, StrapiMedia } from '../types';

export interface Homepage {
  statement?: string | null;
  hero_image_urls: string[];
  quick_links: LinkItem[];
  featured_selections: LinkItem[];
}

interface RawHomepage {
  statement?: string | null;
  hero_images?: StrapiMedia[] | null;
  quick_links: LinkItem[];
  featured_selections: LinkItem[];
}

const DEFAULTS: Homepage = {
  statement: null,
  hero_image_urls: [],
  quick_links: [],
  featured_selections: [],
};

export async function getHomepage(): Promise<Homepage> {
  const res = await strapiGet<StrapiSingleResponse<RawHomepage>>('homepage', {
    populate: ['hero_images', 'quick_links', 'featured_selections'],
  });
  const row = res?.data;
  if (!row) return DEFAULTS;

  return {
    statement: row.statement ?? null,
    hero_image_urls: (row.hero_images ?? []).map((m) => mediaUrl(m)).filter((u): u is string => !!u),
    quick_links: row.quick_links ?? [],
    featured_selections: row.featured_selections ?? [],
  };
}
