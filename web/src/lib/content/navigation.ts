import { strapiGet } from '../strapi';
import type { StrapiSingleResponse } from '../strapi';
import type { LinkItem } from '../types';

export interface NavItem {
  label: string;
  url?: string | null;
  children: LinkItem[];
}

export interface Navigation {
  menu: NavItem[];
}

/**
 * No hardcoded fallback (Phase 3.4) — navigation is seeded in Strapi now
 * (decision 023), so an empty response means something is actually wrong
 * (Strapi down, the record cleared) and the menu should show as empty
 * rather than quietly substituting a plausible-looking fake one. A fake
 * fallback here would hide exactly the failure this step exists to surface.
 */
export async function getNavigation(): Promise<Navigation> {
  const res = await strapiGet<StrapiSingleResponse<Navigation>>('navigation', {
    populate: ['menu', 'menu.children'],
  });
  return { menu: res?.data?.menu ?? [] };
}
