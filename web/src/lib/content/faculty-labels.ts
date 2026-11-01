// Wording of the Faculty page. Edited in Strapi: About – Faculty Page → Labels.
// These defaults match the Strapi seed (cms/src/seed-overview-labels.ts) and
// are used for any label the editors leave out. {count} is filled in by the page.
export const FACULTY_LABEL_DEFAULTS: Record<string, string> = {
  wall_label: 'Faculty of Sherubtse College',
  stat_faculty: 'Faculty members',
  stat_departments: 'Departments',
  stat_students: 'Students',
  stat_papers: 'Research papers',
  search_placeholder: 'Search by name, subject or position',
  search_label: 'Search faculty',
  all_label: 'All',
  sort_label: 'Sort by',
  sort_department: 'Department',
  sort_experience: 'Experience',
  sort_name: 'Name (A–Z)',
  sort_position: 'Position',
  view_label: 'View',
  view_grid: 'Cards',
  view_list: 'List',
  more_filters: 'More filters',
  fewer_filters: 'Fewer filters',
  position_label: 'Position',
  level_label: 'Highest qualification',
  level_phd: 'PhD',
  level_master: 'Master’s',
  level_bachelor: 'Bachelor’s',
  research_label: 'Research areas',
  random_label: 'Meet someone new',
  clear_label: 'Clear all',
  count_one: '{count} faculty member',
  count_many: '{count} faculty members',
  heads_eyebrow: 'Leadership',
  heads_heading: 'Department Heads',
  directory_eyebrow: 'Directory',
  directory_heading: 'All Faculty Members',
  department_page: 'Department page',
  profile_label: 'View profile',
  empty_message: 'No faculty members match these filters.',
  other_label: 'Other',
};

export type LabelFn = (key: string) => string;

export function makeLabels(custom?: Record<string, string> | null): LabelFn {
  return (key) => {
    const v = custom?.[key];
    return typeof v === 'string' && v.trim() ? v.trim() : (FACULTY_LABEL_DEFAULTS[key] ?? '');
  };
}
