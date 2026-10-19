import { strapiGet, responsiveImage, type ResponsiveImage } from '../strapi';
import type { StrapiListResponse, StrapiSingleResponse } from '../strapi';
import type { LinkItem } from '../types';
import { excerpt } from '../article-text';
import { CATEGORY_LABELS, type NewsCategory } from './news';

/**
 * Research landing page (/research) and the projects list (/research/projects).
 * Edited in Strapi: Research – Overview (the page), Research – Centres,
 * Research – Projects, Contact – Offices (collaboration contact) and News
 * (research stories). Every section is optional — one with nothing published
 * is left out, never shown empty.
 */

const text = (s: string | null | undefined) => (s && s.trim() ? s.trim() : null);
const lines = (s: string | null | undefined) => (s ?? '').split(/\r?\n/).map((l) => l.replace(/^\s*[-*•]\s+/, '').trim()).filter(Boolean);

const LABEL_DEFAULTS = {
  explore_centre: 'Explore centre',
  themes: 'Research themes',
  pi: 'Principal investigator',
  co_investigators: 'Co-investigators',
  funding: 'Funding',
  period: 'Period',
  budget: 'Budget',
  status_ongoing: 'Ongoing',
  status_completed: 'Completed',
  status_unconfirmed: 'Status not confirmed',
  tab_ongoing: 'Ongoing',
  tab_completed: 'Completed',
  view_all_projects: 'View all research projects',
  documents: 'Documents',
  read_more: 'Read more',
  contact: 'Contact',
  deadline: 'Deadline',
  status_open: 'Open',
  status_closed: 'Closed',
  issn_print: 'Print ISSN',
  issn_online: 'Online ISSN',
  current_issue: 'Current issue',
  college_grants: 'College grants',
  university_grants: 'Royal University of Bhutan funding',
  on_this_page: 'On this page',
  listed_projects: 'listed projects',
  externally_funded: 'externally funded',
  all_news: 'All news',
  all_centres: 'All centres',
  all_funding: 'All funding',
  search_projects: 'Search projects, investigators or funders',
  no_results: 'No projects match these filters.',
  show_all: 'All',
};
export type ResearchLabels = typeof LABEL_DEFAULTS;

// ---------------------------------------------------------------------------
// Dates

export function fmtDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00+06:00` : iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { ...opts, timeZone: 'Asia/Thimphu' });
}
const todayYmd = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Thimphu' });

// ---------------------------------------------------------------------------
// Centres

export interface CentreCard {
  slug: string;
  name: string;
  acronym: string | null;
  summary: string | null;
  themes: string[];
  logo: ResponsiveImage | null;
  href: string;
  projects: number;
}

const mapCentre = (c: any): CentreCard => ({
  slug: c.slug,
  name: c.name,
  acronym: text(c.acronym),
  summary: text(c.summary) ?? (c.description ? excerpt(c.description, 180) : null),
  themes: lines(c.themes),
  logo: responsiveImage(c.logo, c.logo_alt),
  href: `/research/centres/${c.slug}`,
  projects: 0,
});

export async function getFeaturedCentres(): Promise<CentreCard[]> {
  const res = await strapiGet<StrapiListResponse<any>>('research-centres', {
    filters: { is_featured: { $eq: true } },
    fields: ['name', 'slug', 'acronym', 'summary', 'themes', 'description', 'logo_alt', 'display_order'],
    populate: ['logo'],
    sort: ['display_order:asc', 'name:asc'],
    pagination: { pageSize: 50 },
  });
  return ((res?.data ?? []) as any[]).map(mapCentre);
}

// ---------------------------------------------------------------------------
// Projects

export type ProjectStatus = 'ongoing' | 'completed' | 'unconfirmed';
export interface Project {
  id: number;
  title: string;
  centre: { name: string; acronym: string | null; href: string } | null;
  centre_label: string | null;
  pi: string | null;
  co_investigators: string | null;
  funding_type: 'college_grant' | 'national' | 'international';
  funding_source: string | null;
  budget: string | null;
  start: string | null;
  end: string | null;
  period: string | null;
  /** What the page shows: “ongoing” only when the dates still allow it. */
  status: ProjectStatus;
  summary: string | null;
  link: { url: string; label: string | null } | null;
  featured: boolean;
  order: number;
  sort_key: string;
}

/**
 * A project listed as ongoing is only shown as ongoing while its end date
 * (or the last year in its period) has not passed. Otherwise the listing
 * cannot be confirmed and a neutral status is shown.
 */
function statusOf(p: any): ProjectStatus {
  if (p.listed_status === 'completed') return 'completed';
  if (p.listed_status !== 'ongoing') return 'unconfirmed';
  const today = todayYmd();
  if (p.end_date) return p.end_date >= today ? 'ongoing' : 'unconfirmed';
  const years = String(p.period_label ?? '').match(/\b(19|20)\d{2}\b/g);
  if (years && years.length > 1) return Number(years[years.length - 1]) >= Number(today.slice(0, 4)) ? 'ongoing' : 'unconfirmed';
  return 'ongoing';
}

function periodOf(p: any): string | null {
  if (p.start_date && p.end_date) return `${fmtDate(p.start_date, { month: 'short', year: 'numeric' })} – ${fmtDate(p.end_date, { month: 'short', year: 'numeric' })}`;
  if (p.start_date) return `From ${fmtDate(p.start_date, { month: 'short', year: 'numeric' })}`;
  return text(p.period_label);
}

function mapProject(p: any): Project {
  const firstYear = (p.start_date ?? String(p.period_label ?? '').match(/\b(19|20)\d{2}\b/)?.[0] ?? '0000').slice(0, 4);
  return {
    id: p.id,
    title: String(p.title).replace(/\.$/, ''),
    centre: p.centre ? { name: p.centre.name, acronym: text(p.centre.acronym), href: `/research/centres/${p.centre.slug}` } : null,
    centre_label: text(p.centre_label),
    pi: text(p.principal_investigator),
    co_investigators: text(p.co_investigators),
    funding_type: p.funding_type ?? 'college_grant',
    funding_source: text(p.funding_source),
    budget: text(p.budget),
    start: p.start_date ?? null,
    end: p.end_date ?? null,
    period: periodOf(p),
    status: statusOf(p),
    summary: text(p.summary),
    link: p.link_url ? { url: p.link_url, label: text(p.link_label) } : null,
    featured: !!p.is_featured,
    order: p.display_order ?? 0,
    sort_key: `${p.start_date ?? `${firstYear}-01-01`}`,
  };
}

export async function getProjects(): Promise<Project[]> {
  const rows: any[] = [];
  for (let page = 1; page <= 10; page++) {
    const res = await strapiGet<StrapiListResponse<any>>('research-projects', {
      populate: { centre: { fields: ['name', 'slug', 'acronym'] } },
      sort: ['start_date:desc', 'title:asc'],
      pagination: { page, pageSize: 100 },
    });
    rows.push(...(res?.data ?? []));
    if (!res || (res.meta.pagination && page >= res.meta.pagination.pageCount)) break;
  }
  return rows
    .map(mapProject)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order || b.sort_key.localeCompare(a.sort_key));
}

export const FUNDING_LABEL: Record<Project['funding_type'], string> = {
  college_grant: 'College grant',
  national: 'National funding',
  international: 'International funding',
};

// ---------------------------------------------------------------------------
// The landing page

export interface DocLink { label: string; url: string; type: 'pdf' | 'docx' | 'page' | 'other'; external: boolean }
const docLinks = (rows: any[] | null | undefined): DocLink[] =>
  (rows ?? []).filter((d) => d?.label && d?.url).map((d) => ({ label: d.label, url: d.url, type: d.file_type ?? 'page', external: /^https?:\/\//i.test(d.url) }));

export interface Grant {
  name: string;
  acronym: string | null;
  level: 'college' | 'university' | 'external';
  description: string | null;
  focus: string[];
  status: 'open' | 'closed' | null;
  deadline: string | null;
  announcement: string | null;
  documents: DocLink[];
}
export interface Facility { name: string; summary: string; image: ResponsiveImage | null; centre: { name: string; href: string } | null; link: { url: string; label: string } | null }
export interface Policy { title: string; description: string | null; url: string; source: string | null; type: DocLink['type'] }
export interface NewsItem { id: number; title: string; date: string; summary: string; category: string | null; image: ResponsiveImage | null; href: string }
export interface QuickCard { label: string; url: string; description: string | null; icon: string }

export interface ResearchPage {
  eyebrow: string | null;
  heading: string;
  intro: string | null;
  hero_image: ResponsiveImage | null;
  buttons: LinkItem[];
  cards: QuickCard[];
  expertise: { heading: string; text: string | null; link: LinkItem } | null;
  centres: { heading: string; intro: string | null };
  projects: { heading: string; intro: string | null; limit: number };
  journal: {
    heading: string;
    intro: string | null;
    name: string;
    description: string | null;
    cover: ResponsiveImage | null;
    issn_print: string | null;
    issn_online: string | null;
    current_issue: string | null;
    current_issue_date: string | null;
    links: DocLink[];
    articles: { title: string; authors: string | null; url: string }[];
  } | null;
  grants: { heading: string; intro: string | null; items: Grant[] };
  facilities: { heading: string; intro: string | null; items: Facility[] };
  collaboration: { heading: string; text: string | null; office: { name: string; person: string | null; role: string | null; email: string | null; phone: string | null } | null } | null;
  policies: { heading: string; intro: string | null; items: Policy[] };
  news: { heading: string; intro: string | null; items: NewsItem[] };
  labels: ResearchLabels;
  seo_title: string | null;
  seo_description: string | null;
}

export async function getResearchPage(): Promise<ResearchPage> {
  const res = await strapiGet<StrapiSingleResponse<any>>('research-overview', {
    populate: {
      hero_image: true,
      hero_buttons: true,
      cards: true,
      expertise_link: true,
      journal: { populate: ['cover', 'links', 'articles'] },
      grants: { populate: ['documents'] },
      facilities: { populate: { image: true, centre: { fields: ['name', 'slug'] } } },
      collaboration_office: true,
      policies: true,
      news_stories: { populate: ['images', 'video_poster', 'gallery'] },
      labels: true,
      seo: true,
    },
  });
  const p = res?.data ?? {};
  const j = p.journal;
  const office = p.collaboration_office;
  const newsLimit = p.news_limit || 6;
  return {
    eyebrow: text(p.eyebrow),
    heading: p.heading || 'Research at Sherubtse',
    intro: text(p.intro),
    hero_image: responsiveImage(p.hero_image, p.hero_image_alt),
    buttons: ((p.hero_buttons ?? []) as LinkItem[]).filter((b) => b?.label && b?.url).slice(0, 3),
    cards: ((p.cards ?? []) as any[]).filter((c) => c?.label && c?.url).map((c) => ({ label: c.label, url: c.url, description: text(c.description), icon: c.icon || 'link' })),
    expertise: p.expertise_link?.url ? { heading: p.expertise_heading || 'Expertise Directory', text: text(p.expertise_text), link: p.expertise_link } : null,
    centres: { heading: p.centres_heading || 'Research Centres', intro: text(p.centres_intro) },
    projects: { heading: p.projects_heading || 'Research in Action', intro: text(p.projects_intro), limit: p.projects_limit || 6 },
    journal: j?.name
      ? {
          heading: p.journal_heading || 'Journals & Publications',
          intro: text(p.journal_intro),
          name: j.name,
          description: text(j.description),
          cover: responsiveImage(j.cover, j.cover_alt),
          issn_print: text(j.issn_print),
          issn_online: text(j.issn_online),
          current_issue: text(j.current_issue),
          current_issue_date: j.current_issue_date ?? null,
          links: docLinks(j.links),
          articles: (j.articles ?? []).filter((a: any) => a?.title && a?.url).map((a: any) => ({ title: a.title, authors: text(a.authors), url: a.url })),
        }
      : null,
    grants: {
      heading: p.grants_heading || 'Research Grants & Funding',
      intro: text(p.grants_intro),
      items: ((p.grants ?? []) as any[]).filter((g) => g?.name).map((g) => ({
        name: g.name,
        acronym: text(g.acronym),
        level: g.level ?? 'college',
        description: text(g.description),
        focus: lines(g.focus_areas),
        status: g.status === 'open' || g.status === 'closed' ? g.status : null,
        deadline: g.deadline ?? null,
        announcement: text(g.announcement_url),
        documents: docLinks(g.documents),
      })),
    },
    facilities: {
      heading: p.facilities_heading || 'Research Facilities',
      intro: text(p.facilities_intro),
      items: ((p.facilities ?? []) as any[]).filter((f) => f?.name && f?.summary).map((f) => ({
        name: f.name,
        summary: f.summary,
        image: responsiveImage(f.image, f.image_alt),
        centre: f.centre ? { name: f.centre.name, href: `/research/centres/${f.centre.slug}` } : null,
        link: f.link_url ? { url: f.link_url, label: f.link_label || f.link_url } : null,
      })),
    },
    collaboration: p.collaboration_heading || office
      ? {
          heading: p.collaboration_heading || 'Collaborate with us',
          text: text(p.collaboration_text),
          office: office
            ? { name: office.group_title, person: text(office.full_name), role: text(office.role_title), email: text(office.email), phone: text(office.phone) }
            : null,
        }
      : null,
    policies: {
      heading: p.policies_heading || 'Research Policies & Guidelines',
      intro: text(p.policies_intro),
      items: ((p.policies ?? []) as any[]).filter((x) => x?.title && x?.url).map((x) => ({ title: x.title, description: text(x.description), url: x.url, source: text(x.source), type: x.file_type ?? 'page' })),
    },
    news: {
      heading: p.news_heading || 'Research News & Opportunities',
      intro: text(p.news_intro),
      items: ((p.news_stories ?? []) as any[])
        .filter((n) => n?.title && !n.archived)
        .map((n) => ({
          id: n.id,
          title: n.title,
          date: n.date || n.publish_at || n.publishedAt,
          summary: excerpt(n.summary || n.body, 150),
          category: n.category ? (CATEGORY_LABELS[n.category as NewsCategory] ?? null) : null,
          image: responsiveImage((n.images ?? [])[0] ?? n.video_poster ?? (n.gallery ?? [])[0]),
          href: `/news-notices/news/${n.id}`,
        }))
        .sort((a, b) => String(b.date).localeCompare(String(a.date)))
        .slice(0, newsLimit),
    },
    labels: Object.fromEntries(Object.entries(LABEL_DEFAULTS).map(([k, v]) => [k, text(p.labels?.[k]) ?? v])) as ResearchLabels,
    seo_title: p.seo?.title ?? null,
    seo_description: p.seo?.description ?? null,
  };
}


