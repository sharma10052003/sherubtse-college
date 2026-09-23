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

export interface VacancyAnnouncementDetail extends VacancyAnnouncement {
  interview_time: string | null;
  interview_venue: string | null;
  additional_notes: string | null;
  position_openings: PositionOpening[];
  shortlisted_candidates: ShortlistRow[];
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
    deadline_or_interview_date: row.deadline_or_interview_date ?? null,
    description: row.description,
    attachment_url: mediaUrl(row.attachment),
    attachment_name: row.attachment?.name ?? null,
    status: row.posting_status === 'closed' ? 'closed' : 'open',
  };
}

/** All announcements, newest first — the /news-notices/announcements listing.
 * Only the light card fields; the detail-only fields (position tables,
 * shortlist rows) are fetched per-page by getVacancyAnnouncementBySlug. */
export async function getVacancyAnnouncements(): Promise<VacancyAnnouncement[]> {
  const res = await strapiGet<StrapiListResponse<any>>('vacancy-announcements', {
    populate: ['attachment'],
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
    populate: ['attachment', 'position_openings', 'shortlisted_candidates'],
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  if (!row) return null;
  return {
    ...mapAnnouncement(row),
    interview_time: row.interview_time ?? null,
    interview_venue: row.interview_venue ?? null,
    additional_notes: row.additional_notes ?? null,
    position_openings: (row.position_openings ?? []).map((p: any) => ({
      particular: p.particular ?? null,
      position_title: p.position_title,
      position_level: p.position_level ?? null,
      slots: p.slots ?? null,
      mode_of_employment: p.mode_of_employment ?? null,
      eligibility_criteria: p.eligibility_criteria ?? null,
    })),
    shortlisted_candidates: (row.shortlisted_candidates ?? []).map((c: any) => ({
      position_title: c.position_title,
      cid_number: c.cid_number ?? null,
      contact_number: c.contact_number ?? null,
      score: c.score ?? null,
      remarks: c.remarks ?? null,
    })),
  };
}
