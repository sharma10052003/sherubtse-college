// Shared helpers for the Alumni overview and its sub-pages.
import { getAlumniSetting, getAlumniGallery, getAlumniAchievements } from './alumni';

export const INTERESTS = ['Mentorship', 'Guest Lectures', 'Career Support', 'Internship Opportunities', 'Alumni Events', 'Volunteering', 'Supporting Students'];
export const COUNTRIES = [
  'Bhutan', 'India', 'Nepal', 'Bangladesh', 'Sri Lanka', 'Maldives', 'Thailand', 'Singapore', 'Malaysia', 'Japan',
  'South Korea', 'China', 'Australia', 'New Zealand', 'United States', 'Canada', 'United Kingdom', 'Ireland',
  'Germany', 'Netherlands', 'Switzerland', 'Austria', 'Denmark', 'Norway', 'Sweden', 'Finland', 'France', 'Belgium',
  'Italy', 'Spain', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Saudi Arabia', 'Oman', 'Philippines', 'Indonesia', 'Vietnam',
];
export const INDUSTRIES = [
  'Civil Service', 'Education', 'Health', 'Banking & Finance', 'Information Technology', 'Agriculture & Livestock',
  'Tourism & Hospitality', 'Energy & Hydropower', 'Research & Academia', 'Media & Communications', 'NGO / Civil Society',
  'Private Business', 'Armed Forces & Police', 'Law & Justice', 'Engineering & Construction', 'Other',
];

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
export function initials(name: string) {
  return name
    .replace(/^Dasho\s+|^Dr\.?\s+/gi, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export const ICONS: Record<string, string> = {
  cap: '<path d="M12 3 2 8l10 5 10-5-10-5z" /><path d="M6 10.5v5.5c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" />',
  people: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />',
  shield: '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" />',
  compass: '<circle cx="12" cy="12" r="10" /><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />',
  book: '<path d="M3 5.5c2.7-1 5.7-1 9 1 3.3-2 6.3-2 9-1V19c-2.7-1-5.7-1-9 1-3.3-2-6.3-2-9-1V5.5z" /><path d="M12 6.5V20" />',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />',
  globe: '<circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" />',
  pin: '<path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />',
  pen: '<path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />',
  mail: '<rect x="2" y="4" width="20" height="16" rx="3" /><path d="m2 7 10 6 10-6" />',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z" />',
  person: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />',
  trophy: '<path d="M8 4h8v6a4 4 0 0 1-8 0z" /><path d="M8 5H4v2a4 4 0 0 0 4 4M16 5h4v2a4 4 0 0 1-4 4" /><path d="M12 14v4M8 21h8" />',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6" />',
};
export const CONTACT_ICON: Record<string, string> = { phone: 'phone', email: 'mail', person: 'person', address: 'pin' };

export const icon = (name: string, size = 24) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ICONS.star}</svg>`;

export interface AlumniSection {
  key: 'overview' | 'stories' | 'share' | 'events' | 'give_back' | 'network' | 'highlights' | 'register';
  href: string;
  icon: string;
  /** Appears in the navigation bar (the "share" page is reached from Stories instead). */
  inNav: boolean;
}

/** The alumni pages that exist right now: events and highlights drop out when
 * the editors switch them off or there is nothing published to show. */
export async function getAlumniSections(): Promise<AlumniSection[]> {
  const [settings, gallery, achievements] = await Promise.all([
    getAlumniSetting(),
    getAlumniGallery().catch(() => []),
    getAlumniAchievements().catch(() => []),
  ]);
  const base = '/about/alumni';
  const hasHighlights = (settings.show_gallery && gallery.length > 0) || (settings.show_achievements && achievements.length > 0);
  const all: (AlumniSection | null)[] = [
    { key: 'overview', href: base, icon: 'cap', inNav: true },
    { key: 'stories', href: `${base}/stories`, icon: 'book', inNav: true },
    { key: 'share', href: `${base}/share-your-story`, icon: 'pen', inNav: false },
    settings.show_events ? { key: 'events', href: `${base}/events`, icon: 'calendar', inNav: true } : null,
    { key: 'give_back', href: `${base}/give-back`, icon: 'heart', inNav: true },
    { key: 'network', href: `${base}/network`, icon: 'globe', inNav: true },
    hasHighlights ? { key: 'highlights', href: `${base}/highlights`, icon: 'trophy', inNav: true } : null,
    { key: 'register', href: `${base}/register`, icon: 'people', inNav: true },
  ];
  return all.filter((s): s is AlumniSection => !!s);
}
