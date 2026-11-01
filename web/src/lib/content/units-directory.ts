import { strapiGet } from '../strapi';
import type { StrapiListResponse } from '../strapi';
import { getAdminUnits, getUnits } from './units';
import type { AdminUnit } from './units';
import { getDepartments, getFacultyDirectory } from './faculty';
import { getFacilitiesData } from './facilities';
import { summaryFrom } from './facilities-showcase';

/**
 * Everything the Administrative Units page lists, gathered from the records the
 * College already keeps in Strapi so nothing is typed twice and nothing is
 * invented: administrative offices (About → Administrative Units), academic
 * departments (with their head from Faculty Profiles), research centres, the
 * library, laboratories and health / well-being services (Campus Facilities),
 * and the student bodies and clubs. Add or edit a record in its own place and
 * it appears here.
 */

export type GroupKey = 'admin' | 'academic' | 'research' | 'services' | 'student';
export const GROUP_ORDER: GroupKey[] = ['admin', 'academic', 'research', 'services', 'student'];
export const GROUP_ICON: Record<GroupKey, string> = {
  admin: 'building',
  academic: 'cap',
  research: 'flask',
  services: 'heart',
  student: 'people',
};

export interface OrgEntry {
  key: string;
  group: GroupKey;
  /** Small label on the card (the unit's category, or the kind of record). */
  tag: string | null;
  name: string;
  summary: string | null;
  href: string;
  head_name: string | null;
  head_role: string | null;
  portrait: { url: string; alt: string } | null;
  initials: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  /** A figure shown on the card, such as the faculty of a department. */
  stat: { kind: 'faculty' | 'clubs'; n: number } | null;
}

const initialsOf = (s: string) =>
  s
    .replace(/&/g, ' ')
    .replace(/\b(office|of|the|and|department|centre|dr|dasho|mr|ms)\b\.?/gi, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

const clip = (text: string | null | undefined, max = 170): string | null => {
  const t = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!t) return null;
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, '') + '…' : t;
};

const adminEntry = (u: AdminUnit): OrgEntry => ({
  key: `admin-${u.slug}`,
  group: 'admin',
  tag: u.category?.name ?? null,
  name: u.name,
  summary: u.summary,
  href: `/about/units/${u.slug}`,
  head_name: u.head_name,
  head_role: u.head_designation,
  portrait: u.portrait ? { url: u.portrait.url, alt: u.portrait.alt } : null,
  initials: u.initials,
  email: u.email,
  phone: u.phone,
  location: u.location,
  stat: null,
});

/** Library-type and health-type facilities count as services of the College. */
const SERVICE_CATEGORIES = ['library-learning', 'health-wellbeing'];

/** Where each student body goes: the sports unit is covered by the sports facilities. */
const STUDENT_HREF: Record<string, string> = {
  'games-and-sports': '/about/campus-facilities?category=sports-recreation#facilities',
};

export async function getOrganisation() {
  const [adminUnits, departments, people, facilities, studentBodies, centreRes, clubRes] = await Promise.all([
    getAdminUnits(),
    getDepartments().catch(() => []),
    getFacultyDirectory().catch(() => []),
    getFacilitiesData().catch(() => null),
    getUnits('student_body').catch(() => []),
    strapiGet<StrapiListResponse<any>>('research-centres', { fields: ['name', 'slug', 'description'], sort: 'name:asc', pagination: { pageSize: 100 } }).catch(() => null),
    strapiGet<StrapiListResponse<any>>('clubs', { fields: ['id'], pagination: { pageSize: 1 } }).catch(() => null),
  ]);

  // Leadership offices: the units marked "Featured"; the one in Executive Leadership sits at the top.
  const featured = adminUnits.filter((u) => u.featured);
  const top = featured.find((u) => u.category?.slug === 'executive-leadership') ?? null;
  const leadership = { top, others: featured.filter((u) => u !== top) };

  const entries: OrgEntry[] = [];

  // 1. Every administrative office (the leadership offices are shown above as well, so the
  //    directory is a complete list and a search finds them).
  adminUnits.forEach((u) => entries.push(adminEntry(u)));

  // 2. Academic departments, each with its head and faculty count.
  for (const d of departments) {
    const members = people.filter((p) => p.department_slug === d.slug);
    const head = members.find((p) => p.is_featured) ?? null;
    entries.push({
      key: `dept-${d.slug}`,
      group: 'academic',
      tag: null,
      name: d.name,
      summary: clip(d.description),
      href: `/academics/departments/${d.slug}`,
      head_name: head?.full_name ?? null,
      head_role: head ? 'department_head' : null,
      portrait: head?.photo_url ? { url: head.photo_url, alt: `Portrait of ${head.full_name}` } : null,
      initials: initialsOf(head?.full_name ?? d.name),
      email: null,
      phone: null,
      location: null,
      stat: members.length ? { kind: 'faculty', n: members.length } : null,
    });
  }

  // 3. Research centres.
  for (const c of centreRes?.data ?? []) {
    entries.push({
      key: `centre-${c.slug}`,
      group: 'research',
      tag: null,
      name: c.name,
      summary: clip(c.description, 150),
      href: `/research/centres/${c.slug}`,
      head_name: null,
      head_role: null,
      portrait: null,
      initials: initialsOf(c.name),
      email: null,
      phone: null,
      location: null,
      stat: null,
    });
  }

  // 4. Library, laboratories and health / well-being services (Campus Facilities).
  if (facilities) {
    const lab = facilities.page.laboratories;
    for (const f of facilities.facilities) {
      if (!f.categories.some((c) => SERVICE_CATEGORIES.includes(c.slug))) continue;
      entries.push({
        key: `service-${f.slug}`,
        group: 'services',
        tag: f.categories[0]?.name ?? null,
        name: f.name,
        summary: clip(f.summary),
        href: f.display_mode === 'page' ? `/about/campus-facilities/${f.slug}` : `/about/campus-facilities#${f.slug}`,
        head_name: f.contact?.person ? f.contact.person.split(' — ')[0] : null,
        head_role: f.contact?.person?.includes(' — ') ? f.contact.person.split(' — ')[1] : null,
        portrait: null,
        initials: initialsOf(f.name),
        email: f.contact?.email ?? null,
        phone: f.contact?.phone ?? null,
        location: f.location || f.building || null,
        stat: null,
      });
    }
    if (lab && lab.intro_html) {
      entries.push({
        key: 'service-laboratories',
        group: 'services',
        tag: facilities.allCategories.find((c) => /lab/i.test(c.slug))?.name ?? null,
        name: lab.heading || 'Laboratories',
        summary: clip(summaryFrom(lab.intro_html)),
        href: '/about/campus-facilities#laboratories',
        head_name: null,
        head_role: null,
        portrait: null,
        initials: initialsOf(lab.heading || 'Laboratories'),
        email: null,
        phone: null,
        location: null,
        stat: null,
      });
    }
  }

  // 5. Student bodies and the clubs under them.
  for (const s of studentBodies) {
    entries.push({
      key: `student-${s.slug}`,
      group: 'student',
      tag: null,
      name: s.name,
      summary: clip(s.description),
      href: STUDENT_HREF[s.slug] ?? '/student-life',
      head_name: s.head?.full_name ?? null,
      head_role: null,
      portrait: s.photo_url ? { url: s.photo_url, alt: '' } : null,
      initials: initialsOf(s.name),
      email: s.contact?.email ?? null,
      phone: s.contact?.phone ?? null,
      location: s.contact?.office ?? null,
      stat: null,
    });
  }
  const clubCount = clubRes?.meta?.pagination?.total ?? 0;
  if (clubCount > 0) {
    entries.push({
      key: 'student-clubs',
      group: 'student',
      tag: null,
      name: '', // filled from the labels by the page (clubs_title)
      summary: null,
      href: '/student-life/clubs',
      head_name: null,
      head_role: null,
      portrait: null,
      initials: 'C',
      email: null,
      phone: null,
      location: null,
      stat: { kind: 'clubs', n: clubCount },
    });
  }

  return { leadership, entries };
}
