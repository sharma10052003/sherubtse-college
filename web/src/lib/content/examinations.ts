// Everything the Examinations page (academics/examinations) shows, gathered from Strapi:
//  - the page's hero text and wording (Academics – Examinations Page);
//  - the documents and notices the exam office publishes (Examinations – Documents & Notices),
//    plus any documents attached to the Examination & Records unit;
//  - exam-related announcements, notices and news, picked by the keywords in the page's labels;
//  - examination and results dates from the academic calendar;
//  - services, responsibilities and contact details from the Examination & Records unit.
import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';
import { getAnnouncementFeed } from './announcement-feed';
import { getAllNews } from './news';
import { getCalendarEntries } from './calendar-entries';
import type { CalendarEntry } from './calendar-entries';
import { getAdminUnitBySlug } from './units';
import type { AdminUnit } from './units';

export type ExamKind = 'timetable' | 'result' | 'notice' | 'circular' | 'guideline' | 'form' | 'record';
export const EXAM_KINDS: ExamKind[] = ['timetable', 'result', 'notice', 'circular', 'guideline', 'form', 'record'];
/** Kinds that are announcements rather than files to look up — they also lead the page's "Latest" block. */
const NEWS_KINDS: ExamKind[] = ['notice', 'circular', 'result'];

export interface ExamDoc {
  key: string;
  title: string;
  kind: ExamKind;
  session: string | null;
  date: string | null;
  summary: string | null;
  applies_to: string | null;
  url: string | null;
  ext: string | null;
  external: boolean;
  featured: boolean;
}

export interface LatestItem {
  key: string;
  title: string;
  summary: string;
  date: string;
  label: string;
  href: string | null;
  external: boolean;
}

export interface ExaminationsPage {
  hero_eyebrow: string | null;
  hero_heading: string | null;
  hero_intro: string | null;
  labels: Record<string, string>;
}

export async function getExaminationsPage(): Promise<ExaminationsPage> {
  const res = await strapiGet<{ data: any }>('examinations-page', {});
  const p = res?.data ?? null;
  return {
    hero_eyebrow: p?.hero_eyebrow ?? null,
    hero_heading: p?.hero_heading ?? null,
    hero_intro: p?.hero_intro ?? null,
    labels: p?.labels && typeof p.labels === 'object' ? p.labels : {},
  };
}

function mapResource(row: any): ExamDoc {
  const file = row.file ?? null;
  const fileUrl = mediaUrl(file);
  const url = fileUrl || row.external_url || null;
  return {
    key: `r-${row.id}`,
    title: row.title,
    kind: (EXAM_KINDS as string[]).includes(row.kind) ? row.kind : 'notice',
    session: row.session || null,
    date: row.published_on || null,
    summary: row.summary || null,
    applies_to: row.applies_to || null,
    url,
    ext: file?.ext ? String(file.ext).replace('.', '').toUpperCase() : null,
    external: !fileUrl && !!row.external_url,
    featured: !!row.is_featured,
  };
}

/** Published exam documents and notices — featured first, then newest. */
export async function getExamDocs(): Promise<ExamDoc[]> {
  const res = await strapiGet<StrapiListResponse<any>>('exam-resources', {
    populate: ['file'],
    sort: ['is_featured:desc', 'display_order:asc', 'published_on:desc', 'createdAt:desc'],
    pagination: { pageSize: 300 },
  });
  return (res?.data ?? []).map(mapResource);
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Words that mark an announcement or news item as exam-related (a comma-separated label in Strapi). */
export function keywordMatcher(csv: string): (text: string) => boolean {
  const words = csv.split(',').map((w) => w.trim()).filter(Boolean);
  if (!words.length) return () => false;
  const re = new RegExp(`\\b(?:${words.map(escapeRe).join('|')})`, 'i');
  return (text) => re.test(text);
}

export interface ExamCalendarItem extends CalendarEntry {
  /** Whole days from today (Bhutan time) to the start: negative once started. */
  days_to_start: number;
  days_to_end: number;
}

const todayInBhutan = () => new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 10);
const dayNumber = (iso: string) => Math.floor(Date.parse(`${iso.slice(0, 10)}T00:00:00Z`) / 86400000);

export async function getExamCalendar(): Promise<{ upcoming: ExamCalendarItem[]; recent: ExamCalendarItem[] }> {
  const all = await getCalendarEntries();
  const today = dayNumber(todayInBhutan());
  const mapped = all
    .filter((e) => e.category === 'examination' || e.category === 'results')
    .map((e) => ({ ...e, days_to_start: dayNumber(e.starts_on) - today, days_to_end: dayNumber(e.ends_on || e.starts_on) - today }));
  return {
    upcoming: mapped.filter((e) => e.days_to_end >= 0).sort((a, b) => a.starts_on.localeCompare(b.starts_on)),
    recent: mapped.filter((e) => e.days_to_end < 0).sort((a, b) => b.starts_on.localeCompare(a.starts_on)).slice(0, 4),
  };
}

/** Exam-related announcements, notices and news, newest first. Vacancies are never included. */
export async function getExamFeed(keywords: string, docs: ExamDoc[]): Promise<LatestItem[]> {
  const match = keywordMatcher(keywords);
  const [feed, news] = await Promise.all([getAnnouncementFeed(), getAllNews()]);
  const fromFeed: LatestItem[] = feed
    .filter((f) => f.group !== 'vacancies' && (f.label === 'Results' || match(`${f.title} ${f.label}`)))
    .map((f) => ({ key: f.key, title: f.title, summary: f.summary, date: f.date, label: f.label, href: f.href, external: false }));
  const fromNews: LatestItem[] = news
    .filter((n) => !n.archived && match(`${n.title} ${n.tags.join(' ')}`))
    .map((n) => ({ key: `n-${n.id}`, title: n.title, summary: n.summary, date: n.date, label: n.category_label, href: `/news-notices/news/${n.id}`, external: false }));
  const fromDocs: LatestItem[] = docs
    .filter((d) => NEWS_KINDS.includes(d.kind) && d.date)
    .map((d) => ({ key: d.key, title: d.title, summary: d.summary ?? '', date: d.date as string, label: d.kind, href: d.url, external: d.external }));
  return [...fromFeed, ...fromNews, ...fromDocs].sort((a, b) => b.date.localeCompare(a.date));
}

export const EXAM_UNIT_SLUG = 'examination-and-records';

export async function getExamUnit(): Promise<AdminUnit | null> {
  return getAdminUnitBySlug(EXAM_UNIT_SLUG);
}

/** Documents attached to the Examination & Records unit, shown beside the exam documents. */
export function unitDocs(unit: AdminUnit | null): ExamDoc[] {
  return (unit?.documents ?? []).map((d, i) => ({
    key: `u-${i}`,
    title: d.label,
    kind: 'record' as ExamKind,
    session: null,
    date: null,
    summary: null,
    applies_to: null,
    url: d.url,
    ext: d.ext,
    external: false,
    featured: false,
  }));
}
