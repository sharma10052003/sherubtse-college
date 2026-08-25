import { strapiGet } from '../strapi';
import type { StrapiListResponse } from '../strapi';

export type RecruitmentStage = 'advertised' | 'shortlisted_written' | 'shortlisted_viva' | 'result_declared' | 'closed_unfilled';

const STAGE_LABEL: Record<RecruitmentStage, string> = {
  advertised: 'Advertised',
  shortlisted_written: 'Shortlisted — written',
  shortlisted_viva: 'Shortlisted — viva',
  result_declared: 'Result declared',
  closed_unfilled: 'Closed — unfilled',
};

export interface RecruitmentPost {
  id: number;
  title: string;
  reference_no?: string | null;
  owning_unit_name?: string | null;
  employment_type?: string | null;
  stage: RecruitmentStage;
  stage_label: string;
  closing_date?: string | null;
  apply_url?: string | null;
  stage_documents: { stage: string; label: string; file_url: string | null; date_posted?: string | null }[];
}

function mapRecruitment(row: any): RecruitmentPost {
  return {
    id: row.id,
    title: row.post_title,
    reference_no: row.reference_no ?? null,
    owning_unit_name: row.owning_unit?.name ?? null,
    employment_type: row.employment_type ?? null,
    stage: row.stage,
    stage_label: STAGE_LABEL[row.stage as RecruitmentStage] ?? row.stage,
    closing_date: row.closing_date ?? null,
    apply_url: row.apply_url ?? null,
    stage_documents: (row.stage_documents ?? []).map((d: any) => ({
      stage: d.stage,
      label: d.label,
      file_url: d.file?.url ?? null,
      date_posted: d.date_posted ?? null,
    })),
  };
}

/** Open (not yet closed) recruitment posts — the default listing view. */
export async function getOpenRecruitment(): Promise<RecruitmentPost[]> {
  const res = await strapiGet<StrapiListResponse<any>>('recruitments', {
    filters: { stage: { $ne: 'closed_unfilled' } },
    populate: ['owning_unit'],
    sort: 'closing_date:asc',
    pagination: { pageSize: 200 },
  });
  return (res?.data ?? []).map(mapRecruitment);
}

export async function getAllRecruitmentIds(): Promise<number[]> {
  const res = await strapiGet<StrapiListResponse<{ id: number }>>('recruitments', {
    fields: [],
    pagination: { pageSize: 500 },
  });
  return (res?.data ?? []).map((r) => r.id);
}

export async function getRecruitmentById(id: number): Promise<RecruitmentPost | null> {
  const res = await strapiGet<{ data: any }>(`recruitments/${id}`, {
    populate: ['owning_unit', 'stage_documents', 'stage_documents.file'],
  });
  return res?.data ? mapRecruitment(res.data) : null;
}
