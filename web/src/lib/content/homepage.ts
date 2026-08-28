import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiSingleResponse } from '../strapi';
import type { LinkItem, StrapiMedia } from '../types';

export interface Homepage {
  hero_eyebrow?: string | null;
  hero_heading?: string | null;
  statement?: string | null;
  hero_badge?: string | null;
  hero_buttons: LinkItem[];
  hero_image_urls: string[];
  hero_video_url: string | null;
  quick_links: LinkItem[];
  featured_selections: LinkItem[];
  president_name?: string | null;
  president_title?: string | null;
  president_message?: string | null;
  president_photo_url: string | null;
}

interface RawHomepage {
  hero_eyebrow?: string | null;
  hero_heading?: string | null;
  statement?: string | null;
  hero_badge?: string | null;
  hero_buttons?: LinkItem[];
  hero_images?: StrapiMedia[] | null;
  hero_video?: StrapiMedia | null;
  quick_links: LinkItem[];
  featured_selections: LinkItem[];
  president_name?: string | null;
  president_title?: string | null;
  president_message?: string | null;
  president_photo?: StrapiMedia | null;
}

const DEFAULTS: Homepage = {
  hero_eyebrow: null,
  hero_heading: null,
  statement: null,
  hero_badge: null,
  hero_buttons: [],
  hero_image_urls: [],
  hero_video_url: null,
  quick_links: [],
  featured_selections: [],
  president_name: null,
  president_title: null,
  president_message: null,
  president_photo_url: null,
};

export async function getHomepage(): Promise<Homepage> {
  const res = await strapiGet<StrapiSingleResponse<RawHomepage>>('homepage', {
    populate: ['hero_images', 'hero_video', 'hero_buttons', 'quick_links', 'featured_selections', 'president_photo'],
  });
  const row = res?.data;
  if (!row) return DEFAULTS;

  return {
    // Hero eyebrow/heading/statement/badge/buttons — all editable from the
    // same Homepage section as the video itself, per direct request. Each
    // is independently optional so index.astro can fall back sensibly
    // (e.g. the existing default statement) rather than show blank gaps.
    hero_eyebrow: row.hero_eyebrow ?? null,
    hero_heading: row.hero_heading ?? null,
    statement: row.statement ?? null,
    hero_badge: row.hero_badge ?? null,
    hero_buttons: row.hero_buttons ?? [],
    hero_image_urls: (row.hero_images ?? []).map((m) => mediaUrl(m)).filter((u): u is string => !!u),
    // The video is desktop/tablet only — see index.astro's <source media="">
    // gate. Mobile visitors on real mobile data (the site's stated primary
    // persona) get the still image only; this URL is never fetched there.
    hero_video_url: mediaUrl(row.hero_video),
    quick_links: row.quick_links ?? [],
    featured_selections: row.featured_selections ?? [],
    // President's message — editable from the Homepage section in the
    // admin. Every field is optional and the section on the page doesn't
    // render at all unless a message is actually entered (same "behave as
    // if it doesn't exist" rule the person-directory photo/consent fields
    // already follow), so an empty homepage never shows a broken-looking
    // half section.
    president_name: row.president_name ?? null,
    president_title: row.president_title ?? null,
    president_message: row.president_message ?? null,
    president_photo_url: mediaUrl(row.president_photo),
  };
}
