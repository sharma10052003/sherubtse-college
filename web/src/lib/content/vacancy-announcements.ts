import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export type AnnouncementType =
  | 'vacancy_announcement'
  | 're_vacancy_announcement'
  | 'shortlisted_written'
  | 'shortlisted_viva'
  | 'selection_result'
  | 'general_notice';

export const TYPE_LABELS: Record<AnnouncementType, string> = {
  vacancy_announcement: 'Vacancy Announcement',
  re_vacancy_announcement: 'Re-Vacancy Announcement',
  shortlisted_written: 'Shortlisted (Written)',
  shortlisted_viva: 'Shortlisted (Viva-Voce)',
  selection_result: 'Selection Result',
  general_notice: 'General Notice',
};

export interface VacancyAnnouncement {
  id: number;
  slug: string;
  title: string;
  type: AnnouncementType;
  type_label: string;
  position_name: string | null;
  date_posted: string;
  /** The date relevant to wherever this posting currently stands — the
   * application deadline while it's still advertised, the written-exam
   * date once shortlisted for it, the viva date, or the result date.
   * Computed, not stored: see `relevantDate` below. */
  deadline_or_interview_date: string | null;
  description: string;
  attachment_url: string | null;
  attachment_name: string | null;
  status: 'open' | 'closed';
}

export interface PositionOpening {
  particular: string | null;
  position_title: string;
  position_level: string | null;
  slots: number | null;
  mode_of_employment: string | null;
  eligibility_criteria: string | null;
}

export interface ShortlistRow {
  position_title: string;
  cid_number: string | null;
  contact_number: string | null;
  score: string | null;
  remarks: string | null;
}

/** One stage of the recruitment pipeline — its own date/time/venue and its
 * own candidate list, all living on the *same* announcement record. This
 * is the fix for the thing that was actually broken before: shortlisting
 * for the written exam, then for the viva, then declaring a result used
 * to mean three separate records with no memory of each other, so opening
 * the "final result" page lost the written-exam shortlist entirely. Now
 * one record accumulates all three as the process moves forward. */
export interface AnnouncementStage {
  date: string | null;
  time: string | null;
  venue: string | null;
  candidates: ShortlistRow[];
}

export interface VacancyAnnouncementDetail extends VacancyAnnouncement {
  application_deadline: string | null;
  additional_notes: string | null;
  position_openings: PositionOpening[];
  written_exam: AnnouncementStage;
  viva: AnnouncementStage;
  result: { date: string | null; candidates: ShortlistRow[] };
}

/** The single date worth showing on a card/hero for wherever this posting
 * currently stands — not every date it's ever had. */
function relevantDate(row: any): string | null {
  switch (row.type as AnnouncementType) {
    case 'vacancy_announcement':
    case 're_vacancy_announcement':
      return row.application_deadline ?? null;
    case 'shortlisted_written':
      return row.written_exam_date ?? null;
    case 'shortlisted_viva':
      return row.viva_date ?? null;
    case 'selection_result':
      return row.result_date ?? null;
    default:
      return null;
  }
}

function mapAnnouncement(row: any): VacancyAnnouncement {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type,
    type_label: TYPE_LABELS[row.type as AnnouncementType] ?? row.type,
    position_name: row.position_name ?? null,
    date_posted: row.date_posted,
    deadline_or_interview_date: relevantDate(row),
    description: row.description,
    attachment_url: mediaUrl(row.attachment),
    attachment_name: row.attachment?.name ?? null,
    status: row.posting_status === 'closed' ? 'closed' : 'open',
  };
}

function mapShortlist(rows: any[] | null | undefined): ShortlistRow[] {
  return (rows ?? []).map((c: any) => ({
    position_title: c.position_title,
    cid_number: c.cid_number ?? null,
    contact_number: c.contact_number ?? null,
    score: c.score ?? null,
    remarks: c.remarks ?? null,
  }));
}

/** All announcements, newest first — the /news-notices/announcements listing.
 * Only the light card fields; the detail-only fields (position tables,
 * shortlist rows) are fetched per-page by getVacancyAnnouncementBySlug. */
export async function getVacancyAnnouncements(): Promise<VacancyAnnouncement[]> {
  const res = await strapiGet<StrapiListResponse<any>>('vacancy-announcements', {
    populate: ['attachment'],
    fields: ['title', 'slug', 'type', 'position_name', 'date_posted', 'description', 'posting_status', 'application_deadline', 'written_exam_date', 'viva_date', 'result_date'],
    sort: 'date_posted:desc',
    pagination: { pageSize: 200 },
  });
  return (res?.data ?? []).map(mapAnnouncement);
}

export async function getVacancyAnnouncementSlugs(): Promise<string[]> {
  const res = await strapiGet<StrapiListResponse<{ slug: string }>>('vacancy-announcements', {
    fields: ['slug'],
    pagination: { pageSize: 500 },
  });
  return (res?.data ?? []).map((r) => r.slug);
}

export async function getVacancyAnnouncementBySlug(slug: string): Promise<VacancyAnnouncementDetail | null> {
  const res = await strapiGet<StrapiListResponse<any>>('vacancy-announcements', {
    filters: { slug: { $eq: slug } },
    populate: ['attachment', 'position_openings', 'written_exam_shortlist', 'viva_shortlist', 'final_selected'],
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;
  return {
    ...mapAnnouncement(row),
    application_deadline: row.application_deadline ?? null,
    additional_notes: row.additional_notes ?? null,
    position_openings: (row.position_openings ?? []).map((p: any) => ({
      particular: p.particular ?? null,
      position_title: p.position_title,
      position_level: p.position_level ?? null,
      slots: p.slots ?? null,
      mode_of_employment: p.mode_of_employment ?? null,
      eligibility_criteria: p.eligibility_criteria ?? null,
    })),
    written_exam: {
      date: row.written_exam_date ?? null,
      time: row.written_exam_time ?? null,
      venue: row.written_exam_venue ?? null,
      candidates: mapShortlist(row.written_exam_shortlist),
    },
    viva: {
      date: row.viva_date ?? null,
      time: row.viva_time ?? null,
      venue: row.viva_venue ?? null,
      candidates: mapShortlist(row.viva_shortlist),
    },
    result: {
      date: row.result_date ?? null,
      candidates: mapShortlist(row.final_selected),
    },
  };
}
