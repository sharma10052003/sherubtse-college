import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiSingleResponse } from '../strapi';
import type { LinkItem } from '../types';

export interface NavItem {
  label: string;
  url?: string | null;
  children: LinkItem[];
}

export interface Navigation {
  menu: NavItem[];
  logo_url: string | null;
  logo_alt: string;
  search_placeholder: string;
  menu_button_label: string;
}

/**
 * No hardcoded fallback for the menu itself (Phase 3.4) — navigation is
 * seeded in Strapi (decision 023), so an empty response means something is
 * actually wrong (Strapi down, the record cleared) and the menu should show
 * as empty rather than quietly substituting a plausible-looking fake one.
 * The small labels around it (logo alt, search placeholder, menu button) do
 * have neutral defaults, since a blank button label is worse than "Menu".
 */
export async function getNavigation(): Promise<Navigation> {
  const res = await strapiGet<StrapiSingleResponse<any>>('navigation', {
    populate: ['menu', 'menu.children', 'logo'],
  });
  const row = res?.data;
  return {
    menu: row?.menu ?? [],
    logo_url: mediaUrl(row?.logo),
    logo_alt: row?.logo_alt || 'Sherubtse College',
    search_placeholder: row?.search_placeholder || 'Search',
    menu_button_label: row?.menu_button_label || 'Menu',
  };
}
