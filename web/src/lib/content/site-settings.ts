import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiSingleResponse } from '../strapi';
import type { LinkGroup, LinkItem } from '../types';

export interface SiteSettings {
  site_name: string;
  address?: string | null;
  phones?: string[] | null;
  official_emails?: string[] | null;
  subdomain_links: LinkItem[];
  default_meta_description: string | null;
  social_links: { platform: string; url: string }[];
}

export interface FooterContent {
  tagline: string | null;
  motto: string | null;
  link_groups: LinkGroup[];
  map_label: string | null;
  map_url: string | null;
  map_image_url: string | null;
  contact_heading: string;
  copyright_text: string;
  bottom_links: LinkItem[];
}

const SETTINGS_DEFAULTS: SiteSettings = {
  site_name: 'Sherubtse College',
  address: null,
  phones: [],
  official_emails: [],
  subdomain_links: [],
  default_meta_description: null,
  social_links: [],
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await strapiGet<StrapiSingleResponse<any>>('site-settings', {
    populate: ['subdomain_links', 'social_links'],
  });
  const row = res?.data;
  if (!row) return SETTINGS_DEFAULTS;
  return {
    site_name: row.site_name || SETTINGS_DEFAULTS.site_name,
    address: row.address ?? null,
    phones: row.phones ?? [],
    official_emails: row.official_emails ?? [],
    subdomain_links: row.subdomain_links ?? [],
    default_meta_description: row.default_meta_description ?? null,
    social_links: row.social_links ?? [],
  };
}

const FOOTER_DEFAULTS: FooterContent = {
  tagline: null,
  motto: null,
  link_groups: [],
  map_label: null,
  map_url: null,
  map_image_url: null,
  contact_heading: 'Contact',
  copyright_text: 'Sherubtse College, Royal University of Bhutan.',
  bottom_links: [],
};

export async function getFooter(): Promise<FooterContent> {
  const res = await strapiGet<StrapiSingleResponse<any>>('footer', {
    populate: { link_groups: { populate: ['links'] }, bottom_links: true, map_image: true },
  });
  const row = res?.data;
  if (!row) return FOOTER_DEFAULTS;
  return {
    tagline: row.tagline ?? null,
    motto: row.motto ?? null,
    link_groups: row.link_groups ?? [],
    map_label: row.map_label ?? null,
    map_url: row.map_url ?? null,
    map_image_url: mediaUrl(row.map_image),
    contact_heading: row.contact_heading || FOOTER_DEFAULTS.contact_heading,
    copyright_text: row.copyright_text || FOOTER_DEFAULTS.copyright_text,
    bottom_links: row.bottom_links ?? [],
  };
}
