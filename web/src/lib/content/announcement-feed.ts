import { strapiGet } from '../strapi';
import type { StrapiListResponse } from '../strapi';
import { getVacancyAnnouncements } from './vacancy-announcements';
import { getAllCurrentNotices } from './notices';
import type { NoticeCategory } from './notices';

/**
 * The Announcements page (and the homepage "Announcements" box) show one
 * combined, newest-first feed of everything the College announces:
 *  - recruitment postings from "News & Notices – Recruitment (Vacancies)" —
 *    the same records the Recruitment page lists, so a vacancy is entered
 *    once and appears in both places, linking to its Recruitment page;
 *  - short announcements from "News & Notices – Announcements" (general,
 *    warning and urgent notices), active and inside their start/end dates;
 *  - notices from "News & Notices – Notices" except tenders, which have
 *    their own page.
 */

export type FeedGroup = 'vacancies' | 'important' | 'general';
export type FeedTone = 'normal' | 'success' | 'warning' | 'danger';

export interface FeedItem {
  key: string;
  href: string;
  title: string;
  summary: string;
  date: string;
  group: FeedGroup;
  label: string;
  tone: FeedTone;
  /** Vacancies only. */
  status: 'open' | 'closed' | null;
  deadline: string | null;
  deadline_label: string | null;
  meta: string | null;
  has_attachment: boolean;
  /** Pinned by an editor (notices ticked “Is featured”). */
  pinned: boolean;
  /** After this moment the item is no longer current (homepage drops it). */
  expires: string | null;
}

export const GROUP_LABELS: Record<FeedGroup, string> = {
  vacancies: 'Vacancies',
  important: 'Important',
  general: 'General Notices',
};

const CATEGORY_LABELS: Record<NoticeCategory, string> = {
  admissions: 'Admissions',
  registration: 'Registration',
  results: 'Results',
  fees: 'Fees',
  tender: 'Tender',
  general: 'General Notice',
};

/** Prefix that marks an "Announcements"-type entry in /news-notices/announcements/a-<id>. */
export const ENTRY_PREFIX = 'a-';

type EntryType = 'info' | 'success' | 'warning' | 'danger' | 'primary';
const ENTRY_LABELS: Record<EntryType, string> = {
  info: 'General Notice',
  primary: 'General Notice',
  success: 'General Notice',
  warning: 'Warning',
  danger: 'Urgent',
};

export interface AnnouncementEntry {
  id: number;
  title: string;
  content: string;
  type: EntryType;
  label: string;
  link_url: string | null;
  link_text: string | null;
  date: string;
  end_date: string | null;
  priority: number;
}

/** Strips markdown/HTML so a summary reads as plain text. */
function plain(text: string | null | undefined, n = 180): string {
  const t = (text ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|-]{1,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return t.length > n ? `${t.slice(0, n).replace(/\s+\S*$/, '')}…` : t;
}

function mapEntry(row: any): AnnouncementEntry {
  const type: EntryType = (row.announcement_type as EntryType) in ENTRY_LABELS ? row.announcement_type : 'info';
  return {
    id: row.id,
    title: row.title,
    content: row.content ?? '',
    type,
    label: ENTRY_LABELS[type],
    link_url: row.link_url || null,
    link_text: row.link_text || null,
    date: row.start_date || row.createdAt,
    end_date: row.end_date || null,
    priority: row.priority ?? 0,
  };
}

function isLive(row: any, now = Date.now()) {
  if (row.is_active === false) return false;
  if (row.start_date && Date.parse(row.start_date) > now) return false;
  if (row.end_date && Date.parse(row.end_date) <= now) return false;
  return true;
}

/** Active "Announcements"-type entries inside their start/end window. */
export async function getAnnouncementEntries(): Promise<AnnouncementEntry[]> {
  const res = await strapiGet<StrapiListResponse<any>>('announcements', {
    filters: { is_active: { $eq: true } },
    sort: ['priority:desc', 'start_date:desc'],
    pagination: { pageSize: 200 },
  });
  return (res?.data ?? []).filter((row: any) => isLive(row)).map(mapEntry);
}

export async function getAnnouncementEntryById(id: number): Promise<AnnouncementEntry | null> {
  const res = await strapiGet<StrapiListResponse<any>>('announcements', {
    filters: { id: { $eq: id } },
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  return row ? mapEntry(row) : null;
}

/** “2026-11-30” → the end of that day in Bhutan time (UTC+6). */
const endOfDay = (date: string | null) => (date ? `${date.slice(0, 10)}T23:59:59+06:00` : null);

export async function getAnnouncementFeed(): Promise<FeedItem[]> {
  const [vacancies, entries, notices] = await Promise.all([
    getVacancyAnnouncements(),
    getAnnouncementEntries(),
    getAllCurrentNotices(),
  ]);

  const items: FeedItem[] = [
    ...vacancies.map((v): FeedItem => ({
      key: `v-${v.id}`,
      href: `/news-notices/recruitment/${v.slug}`,
      title: v.title,
      summary: plain(v.description),
      date: v.date_posted,
      group: 'vacancies',
      label: v.type_label,
      tone: 'normal',
      status: v.status,
      deadline: v.deadline_or_interview_date,
      deadline_label:
        v.type === 'shortlisted_written' || v.type === 'shortlisted_viva'
          ? 'Interview'
          : v.type === 'selection_result'
            ? 'Result'
            : 'Deadline',
      meta: v.position_name,
      has_attachment: Boolean(v.attachment_url),
      pinned: false,
      expires: v.type === 'vacancy_announcement' || v.type === 're_vacancy_announcement' ? endOfDay(v.deadline_or_interview_date) : null,
    })),
    ...entries.map((e): FeedItem => ({
      key: `a-${e.id}`,
      href: `/news-notices/announcements/${ENTRY_PREFIX}${e.id}`,
      title: e.title,
      summary: plain(e.content),
      date: e.date,
      group: e.type === 'warning' || e.type === 'danger' ? 'important' : 'general',
      label: e.label,
      tone: e.type === 'warning' || e.type === 'danger' ? e.type : e.type === 'success' ? 'success' : 'normal',
      status: null,
      deadline: null,
      deadline_label: null,
      meta: null,
      has_attachment: false,
      pinned: false,
      expires: e.end_date,
    })),
    ...notices
      .filter((n) => n.category !== 'tender')
      .map((n): FeedItem => ({
        key: `n-${n.id}`,
        href: `/news-notices/announcements/${n.id}`,
        title: n.title,
        summary: plain(n.body),
        date: n.publish_at,
        group: n.urgency === 'urgent' ? 'important' : 'general',
        label: n.urgency === 'urgent' ? 'Urgent' : (CATEGORY_LABELS[n.category] ?? 'Notice'),
        tone: n.urgency === 'urgent' ? 'danger' : 'normal',
        status: null,
        deadline: null,
        deadline_label: null,
        meta: n.owning_unit_name ?? null,
        has_attachment: false,
        pinned: n.is_featured,
        expires: n.expires_at ?? null,
      })),
  ];

  return items.filter((i) => i.date).sort((a, b) => b.date.localeCompare(a.date));
}
