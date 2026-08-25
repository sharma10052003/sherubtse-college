import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiSingleResponse } from '../strapi';
import type { LinkItem, StrapiMedia } from '../types';

export interface Homepage {
  statement?: string | null;
  hero_image_urls: string[];
  hero_video_url: string | null;
  quick_links: LinkItem[];
  featured_selections: LinkItem[];
}

interface RawHomepage {
  statement?: string | null;
  hero_images?: StrapiMedia[] | null;
  hero_video?: StrapiMedia | null;
  quick_links: LinkItem[];
  featured_selections: LinkItem[];
}

const DEFAULTS: Homepage = {
  statement: null,
  hero_image_urls: [],
  hero_video_url: null,
  quick_links: [],
  featured_selections: [],
};

export async function getHomepage(): Promise<Homepage> {
  const res = await strapiGet<StrapiSingleResponse<RawHomepage>>('homepage', {
    populate: ['hero_images', 'hero_video', 'quick_links', 'featured_selections'],
  });
  const row = res?.data;
  if (!row) return DEFAULTS;

  return {
    statement: row.statement ?? null,
    hero_image_urls: (row.hero_images ?? []).map((m) => mediaUrl(m)).filter((u): u is string => !!u),
    // The video is desktop/tablet only — see index.astro's <source media="">
    // gate. Mobile visitors on real mobile data (the site's stated primary
    // persona) get the still image only; this URL is never fetched there.
    hero_video_url: mediaUrl(row.hero_video),
    quick_links: row.quick_links ?? [],
    featured_selections: row.featured_selections ?? [],
  };
}
