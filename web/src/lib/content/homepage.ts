import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiSingleResponse } from '../strapi';
import type { LinkItem } from '../types';
import { BLOCKS_POPULATE, toBlocks, type Block, type LandingCard } from './landing';

export interface Homepage {
  hero_eyebrow: string | null;
  hero_heading: string | null;
  statement: string | null;
  hero_badge: string | null;
  hero_buttons: LinkItem[];
  hero_image_urls: string[];
  hero_video_url: string | null;
  quick_links: LinkItem[];
  president_name: string | null;
  president_title: string | null;
  president_message: string | null;
  president_photo_url: string | null;
  president_heading: string;
  seo_title: string;
  seo_description: string | null;
  announcements_heading: string;
  announcements_link_label: string;
  announcements_empty_text: string;
  events_heading: string;
  events_link_label: string;
  events_empty_text: string;
  explore_heading: string | null;
  explore_button_label: string;
  explore_cards: LandingCard[];
  blocks: Block[];
}

/** Neutral fallbacks only for the short labels around the content — the real
 * wording is edited in Strapi (Home – Page). */
const DEFAULTS: Homepage = {
  hero_eyebrow: null,
  hero_heading: null,
  statement: null,
  hero_badge: null,
  hero_buttons: [],
  hero_image_urls: [],
  hero_video_url: null,
  quick_links: [],
  president_name: null,
  president_title: null,
  president_message: null,
  president_photo_url: null,
  president_heading: 'A Message from the President',
  seo_title: 'Home',
  seo_description: null,
  announcements_heading: 'Announcements',
  announcements_link_label: 'All announcements',
  announcements_empty_text: '',
  events_heading: 'Events',
  events_link_label: 'Full calendar',
  events_empty_text: '',
  explore_heading: null,
  explore_button_label: 'Learn more',
  explore_cards: [],
  blocks: [],
};

export async function getHomepage(): Promise<Homepage> {
  const res = await strapiGet<StrapiSingleResponse<any>>('homepage', {
    populate: {
      hero_images: true,
      hero_video: true,
      hero_buttons: true,
      quick_links: true,
      president_photo: true,
      explore_cards: true,
      sections: BLOCKS_POPULATE,
    },
  });
  const row = res?.data;
  if (!row) return DEFAULTS;

  return {
    // Every hero field is independently optional so index.astro can skip
    // whatever an editor leaves blank instead of showing gaps.
    hero_eyebrow: row.hero_eyebrow ?? null,
    hero_heading: row.hero_heading ?? null,
    statement: row.statement ?? null,
    hero_badge: row.hero_badge ?? null,
    hero_buttons: row.hero_buttons ?? [],
    hero_image_urls: (row.hero_images ?? []).map((m: any) => mediaUrl(m)).filter((u: string | null): u is string => !!u),
    // Desktop/tablet only — see index.astro's gate; phones on mobile data
    // never fetch it.
    hero_video_url: mediaUrl(row.hero_video),
    quick_links: row.quick_links ?? [],
    // The president block only renders when a message has been entered.
    president_name: row.president_name ?? null,
    president_title: row.president_title ?? null,
    president_message: row.president_message ?? null,
    president_photo_url: mediaUrl(row.president_photo),
    president_heading: row.president_heading || DEFAULTS.president_heading,
    seo_title: row.seo_title || DEFAULTS.seo_title,
    seo_description: row.seo_description ?? null,
    announcements_heading: row.announcements_heading || DEFAULTS.announcements_heading,
    announcements_link_label: row.announcements_link_label || DEFAULTS.announcements_link_label,
    announcements_empty_text: row.announcements_empty_text ?? '',
    events_heading: row.events_heading || DEFAULTS.events_heading,
    events_link_label: row.events_link_label || DEFAULTS.events_link_label,
    events_empty_text: row.events_empty_text ?? '',
    explore_heading: row.explore_heading ?? null,
    explore_button_label: row.explore_button_label || DEFAULTS.explore_button_label,
    explore_cards: (row.explore_cards ?? []).map((c: any) => ({ label: c.label, url: c.url, description: c.description ?? '' })),
    blocks: toBlocks(row.sections),
  };
}
