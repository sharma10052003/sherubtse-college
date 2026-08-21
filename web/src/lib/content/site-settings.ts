import { strapiGet } from '../strapi';
import type { StrapiSingleResponse } from '../strapi';
import type { LinkGroup, LinkItem } from '../types';

export interface SiteSettings {
  address?: string | null;
  phones?: string[] | null;
  official_emails?: string[] | null;
  footer_link_groups: LinkGroup[];
  subdomain_links: LinkItem[];
}

const DEFAULTS: SiteSettings = {
  address: null,
  phones: [],
  official_emails: [],
  footer_link_groups: [],
  subdomain_links: [],
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await strapiGet<StrapiSingleResponse<SiteSettings>>('site-settings', {
    populate: ['footer_link_groups', 'footer_link_groups.links', 'subdomain_links'],
  });
  return res?.data ?? DEFAULTS;
}
