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
 * Fallback matches the Stack, Structure & Wireframes §03 structure exactly
 * — used only if Strapi is unreachable or the single type is still empty,
 * so the site never renders with no navigation at all. The real content
 * lives in Strapi once seeded (see cms/scripts/seed-navigation.js).
 */
const FALLBACK: Navigation = {
  menu: [
    { label: 'About', url: '/about', children: [] },
    { label: 'Academics', url: '/academics', children: [] },
    { label: 'Admissions', url: '/admissions', children: [] },
    { label: 'Research', url: '/research', children: [] },
    { label: 'Student Life', url: '/student-life', children: [] },
    { label: 'News & Notices', url: '/news-notices', children: [] },
  ],
};

export async function getNavigation(): Promise<Navigation> {
  const res = await strapiGet<StrapiSingleResponse<Navigation>>('navigation', {
    populate: ['menu', 'menu.children'],
  });
  const menu = res?.data?.menu;
  return menu && menu.length ? { menu } : FALLBACK;
}
