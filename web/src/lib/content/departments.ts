import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse } from '../strapi';

/** The richer, purpose-built "department" content type — distinct from the
 * generic Unit template (`units.ts`) that the Departments page used to run
 * on. That relation is empty for every academic unit right now, so this is
 * the one actually carrying department data (banner art, programmes, head
 * of department, faculty roster) for the site to show. */
export interface DepartmentProgramme {
  id: number;
  slug: string;
  programme_name: string;
  level: 'undergraduate' | 'postgraduate';
}

export interface Department {
  id: number;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  banner_url: string | null;
  logo_url: string | null;
  theme_color: string | null;
  display_order: number;
  head: { full_name: string; slug: string; position: string | null } | null;
  faculty_count: number;
  programmes: DepartmentProgramme[];
  updated_at: string;
}

function mapDepartment(row: any): Department {
  return {
    id: row.id,
    slug: row.slug,
    name: row.department_name,
    short_description: row.short_description ?? null,
    description: row.description ?? null,
    banner_url: mediaUrl(row.banner_image),
    logo_url: mediaUrl(row.department_logo),
    theme_color: row.theme_color ?? null,
    display_order: row.display_order ?? 0,
    head: row.head_of_department
      ? { full_name: row.head_of_department.full_name, slug: row.head_of_department.slug, position: row.head_of_department.position ?? null }
      : null,
    faculty_count: Array.isArray(row.faculty_members) ? row.faculty_members.length : 0,
    programmes: (row.programmes ?? []).map((p: any) => ({
      id: p.id,
      slug: p.slug,
      programme_name: p.programme_name,
      level: p.level,
    })),
    updated_at: row.updatedAt,
  };
}

const POPULATE = {
  banner_image: true,
  department_logo: true,
  head_of_department: { fields: ['full_name', 'slug', 'position'] },
  faculty_members: { fields: ['id'] },
  programmes: { fields: ['programme_name', 'slug', 'level'] },
};

export async function getDepartments(): Promise<Department[]> {
  const res = await strapiGet<StrapiListResponse<any>>('departments', {
    populate: POPULATE,
    sort: ['display_order:asc', 'department_name:asc'],
    pagination: { pageSize: 50 },
  });
  return (res?.data ?? []).map(mapDepartment);
}

export async function getDepartmentBySlug(slug: string): Promise<Department | null> {
  const res = await strapiGet<StrapiListResponse<any>>('departments', {
    filters: { slug: { $eq: slug } },
    populate: POPULATE,
    pagination: { pageSize: 1 },
  });
  const row = res?.data?.[0];
  return row ? mapDepartment(row) : null;
}
