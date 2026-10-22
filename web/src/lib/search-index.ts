/**
 * Site search index, built from the same Strapi content the pages use, so it
 * is always as fresh as the site itself and works in `astro dev` as well as
 * in the built site. Served as /search-index.json (pages/search-index.json.ts)
 * and searched in the browser by the header search and the /search page.
 */
import { excerpt } from './article-text';
import { getAllNews } from './content/news';
import { getAllEvents } from './content/events';
import { getAnnouncementFeed } from './content/announcement-feed';
import { getProgrammes } from './content/programmes';
import { getFacilities } from './content/facilities';
import { getAdminUnits } from './content/units';
import { getFacultyDirectory } from './content/faculty';
import { getDepartments } from './content/departments';
import { getCurrentDocuments } from './content/documents';
import { getFeaturedCentres, getProjects } from './content/research';
import { getAllPageSlugs, getPageBySlug } from './content/pages';
import { strapiGet, type StrapiListResponse } from './strapi';

export type SearchKind =
  | 'Page' | 'News' | 'Notice' | 'Event' | 'Programme' | 'Department' | 'People'
  | 'Facility' | 'Office' | 'Club' | 'Research' | 'Download';

export interface SearchEntry {
  /** Title */ t: string;
  /** URL */ u: string;
  /** Kind */ k: SearchKind;
  /** Short description */ d: string;
  /** Extra searchable words (not shown) */ x?: string;
  /** Date, for sorting ties (YYYY-MM-DD) */ y?: string;
}

const clip = (s: string | null | undefined, n = 180) => excerpt(s ?? '', n);
/** HTML to plain text, capped, for hidden search words. */
const plain = (html: string | null | undefined, n = 1200) => (html ?? '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, n);

/** The main section pages, so “admissions”, “fees” or “contact” always find them. */
const PAGES: SearchEntry[] = [
  { t: 'About Sherubtse College', u: '/about', k: 'Page', d: 'History, vision and mission, leadership, campus and offices.', x: 'about college overview' },
  { t: 'History', u: '/about/history', k: 'Page', d: 'The story of Sherubtse College since its founding.', x: 'history heritage founded 1968' },
  { t: 'Vision, Mission & Core Values', u: '/about/vision-mission-core-values', k: 'Page', d: 'What the College stands for.', x: 'vision mission values' },
  { t: 'Campus Facilities', u: '/about/campus-facilities', k: 'Page', d: 'Library, laboratories, sports grounds, residences and student services.', x: 'campus facilities library lab sports hostel residence' },
  { t: 'Administrative Units', u: '/about/units', k: 'Page', d: 'The College offices and who leads them.', x: 'offices units administration' },
  { t: 'Faculty', u: '/about/faculty', k: 'Page', d: 'Search faculty by name, department, specialisation or research area.', x: 'faculty staff lecturers teachers expertise directory' },
  { t: 'Alumni', u: '/about/alumni', k: 'Page', d: 'Distinguished alumni, stories and how to stay connected.', x: 'alumni graduates' },
  { t: 'Contact Us', u: '/about/contact', k: 'Page', d: 'Phone numbers, emails and offices to contact.', x: 'contact phone email address location map' },
  { t: 'Academics', u: '/academics', k: 'Page', d: 'Departments, programmes and the academic calendar.', x: 'academics study' },
  { t: 'Programmes', u: '/academics/programmes', k: 'Page', d: 'Every undergraduate programme the College offers.', x: 'programmes courses degrees bachelor bsc' },
  { t: 'Departments', u: '/academics/departments', k: 'Page', d: 'The College’s academic departments.', x: 'departments' },
  { t: 'Academic Calendar', u: '/academics/calendar', k: 'Page', d: 'Semester dates and key academic deadlines.', x: 'calendar semester dates holidays exams schedule' },
  { t: 'Admissions', u: '/admissions', k: 'Page', d: 'How to apply — for Bhutanese and international applicants.', x: 'admission apply application enrol' },
  { t: 'Admissions — Bhutanese applicants', u: '/admissions/bhutanese', k: 'Page', d: 'Dates, entry requirements, fees and scholarships for Class XII graduates.', x: 'admission apply requirements fees scholarship tuition dvt class xii bhutanese' },
  { t: 'Admissions — International applicants', u: '/admissions/international', k: 'Page', d: 'How to apply from outside Bhutan, documents, fees and visa help.', x: 'admission international apply visa saarc fees documents' },
  { t: 'Research', u: '/research', k: 'Page', d: 'Research centres, projects, the Sherub Doenme journal, grants and facilities.', x: 'research journal sherub doenme grants acrg stlrg publications' },
  { t: 'Research Projects', u: '/research/projects', k: 'Page', d: 'Every research project listed by the College.', x: 'research projects' },
  { t: 'Student Life', u: '/student-life', k: 'Page', d: 'Services, residences, clubs, sport and student organisations.', x: 'student life services hostel sports' },
  { t: 'Clubs & Societies', u: '/student-life/clubs', k: 'Page', d: 'Student-run clubs, units, forums and societies.', x: 'clubs societies fina' },
  { t: 'News & Notices', u: '/news-notices', k: 'Page', d: 'News, announcements, events, recruitment and downloads.', x: 'news notices' },
  { t: 'News', u: '/news-notices/news', k: 'Page', d: 'Stories from around the College.', x: 'news stories' },
  { t: 'Announcements', u: '/news-notices/announcements', k: 'Page', d: 'Current notices, vacancies and announcements.', x: 'announcements notices' },
  { t: 'Events', u: '/news-notices/events', k: 'Page', d: 'Upcoming and past College events.', x: 'events calendar' },
  { t: 'Recruitment', u: '/news-notices/recruitment', k: 'Page', d: 'Vacancies, shortlists and selection results.', x: 'recruitment vacancy jobs careers employment' },
  { t: 'Tenders', u: '/news-notices/tenders', k: 'Page', d: 'Tender and procurement notices.', x: 'tender procurement' },
  { t: 'Downloads & Forms', u: '/news-notices/downloads', k: 'Page', d: 'Official forms, guides and policies.', x: 'downloads forms documents policies handbook' },
];

export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const settle = <T,>(p: Promise<T>, fallback: T) => p.catch(() => fallback);
  const [news, events, feed, programmes, facilities, units, faculty, departments, documents, centres, projects, pageSlugs, clubsRes] = await Promise.all([
    settle(getAllNews(), []),
    settle(getAllEvents(), []),
    settle(getAnnouncementFeed(), []),
    settle(getProgrammes(), []),
    settle(getFacilities(), []),
    settle(getAdminUnits(), []),
    settle(getFacultyDirectory(), []),
    settle(getDepartments(), []),
    settle(getCurrentDocuments(), []),
    settle(getFeaturedCentres(), []),
    settle(getProjects(), []),
    settle(getAllPageSlugs(), []),
    strapiGet<StrapiListResponse<any>>('clubs', { fields: ['name', 'slug', 'category', 'description'], pagination: { pageSize: 200 } }),
  ]);
  const cmsPages = await Promise.all(
    pageSlugs
      .filter((s) => !['vision-mission-core-values', 'contact', 'campus-facilities'].includes(s))
      .map((s) => settle(getPageBySlug(s), null)),
  );

  const entries: SearchEntry[] = [
    ...PAGES,
    ...cmsPages.filter(Boolean).map((p) => ({ t: p!.title, u: `/about/${p!.slug}`, k: 'Page' as const, d: clip(p!.body) })),
    ...news.map((n) => ({ t: n.title, u: `/news-notices/news/${n.id}`, k: 'News' as const, d: clip(n.summary || n.body), x: n.category_label, y: n.date })),
    ...feed.map((f) => ({ t: f.title, u: f.href, k: 'Notice' as const, d: clip(f.summary), x: [f.label, f.meta].filter(Boolean).join(' '), y: f.date?.slice(0, 10) })),
    ...events.map((e) => ({ t: e.title, u: `/news-notices/events/${e.id}`, k: 'Event' as const, d: clip(e.description), x: e.venue ?? '', y: e.starts_at?.slice(0, 10) })),
    ...programmes.map((p) => ({ t: p.programme_name, u: `/academics/programmes/${p.slug}`, k: 'Programme' as const, d: clip(p.short_description || p.overview), x: [p.department_name, p.degree_type, p.level].filter(Boolean).join(' ') })),
    ...departments.map((d) => ({ t: d.name, u: `/academics/departments/${d.slug}`, k: 'Department' as const, d: clip(d.short_description || d.description) })),
    ...faculty.map((f) => ({ t: f.full_name, u: `/about/faculty/${f.slug}`, k: 'People' as const, d: [f.position, f.department_name].filter(Boolean).join(' · '), x: [f.specialization, f.highest_qualification, ...f.research_areas].filter(Boolean).join(' ') })),
    ...facilities.map((f: any) => ({ t: f.name, u: f.display_mode === 'page' ? `/about/campus-facilities/${f.slug}` : `/about/campus-facilities#facility-${f.slug}`, k: 'Facility' as const, d: clip(f.summary), x: [(f.categories ?? []).map((c: any) => c.name).join(' '), f.location, plain(f.content_html), plain(f.uses_html), (f.features ?? []).map((x: any) => x.title).join(' ')].filter(Boolean).join(' ') })),
    ...units.map((u) => ({ t: u.name, u: `/about/units/${u.slug}`, k: 'Office' as const, d: clip(u.summary), x: [u.head_name, u.head_designation, u.email, u.category?.name, ...u.responsibilities.map((r) => r.title), ...u.services.map((s) => s.title)].filter(Boolean).join(' ') })),
    ...((clubsRes?.data ?? []) as any[]).map((c) => ({ t: c.name, u: `/student-life/clubs/${c.slug}`, k: 'Club' as const, d: clip(c.description), x: c.category ?? '' })),
    ...centres.map((c) => ({ t: c.name, u: c.href, k: 'Research' as const, d: clip(c.summary), x: [c.acronym, ...c.themes].filter(Boolean).join(' ') })),
    ...projects.map((p) => ({ t: p.title, u: '/research/projects', k: 'Research' as const, d: [p.pi, p.period, p.funding_source].filter(Boolean).join(' · '), x: [p.co_investigators, p.centre?.acronym, p.centre_label].filter(Boolean).join(' '), y: p.start ?? undefined })),
    ...documents.filter((d) => d.file_url).map((d) => ({ t: d.title, u: d.file_url!, k: 'Download' as const, d: [d.category, d.file_format?.toUpperCase(), d.owning_unit_name].filter(Boolean).join(' · '), x: 'form download document' })),
  ];

  // Drop empties and exact duplicates (same title and URL).
  const seen = new Set<string>();
  return entries
    .filter((e) => e.t && e.u)
    .map((e) => ({ ...e, t: String(e.t).trim(), d: (e.d ?? '').trim(), x: e.x?.trim() || undefined, y: e.y || undefined }))
    .filter((e) => (seen.has(`${e.t}|${e.u}`) ? false : (seen.add(`${e.t}|${e.u}`), true)));
}
