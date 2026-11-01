// Wording of the Administrative Units page. Edited in Strapi: About –
// Administrative Units: Page Settings → Labels. These defaults match the Strapi
// seed (cms/src/seed-overview-labels.ts) and fill in anything left out.
// {count} is filled in by the page.
export const UNITS_LABEL_DEFAULTS: Record<string, string> = {
  all_label: 'All',
  search_label: 'Search offices, units and people',
  search_placeholder: 'Search offices, units and people',
  count_one: '{count} office or unit',
  count_many: '{count} offices and units',
  clear_label: 'Clear search',
  open_label: 'Explore',
  stat_total: 'Offices and units',
  stat_areas: 'Areas of work',
  group_admin: 'Administrative offices',
  group_academic: 'Academic departments',
  group_research: 'Research centres',
  group_services: 'Library, labs and services',
  group_student: 'Student bodies',
  members_label: '{count} faculty members',
  head_label: 'Head',
  department_head: 'Head of Department',
  clubs_title: 'Clubs and societies',
  clubs_text: 'Student clubs and societies that run under the Student Association.',
  clubs_count: '{count} clubs',
};

export type UnitsLabelFn = (key: string) => string;

export function makeUnitsLabels(custom?: Record<string, string> | null): UnitsLabelFn {
  return (key) => {
    const v = custom?.[key];
    return typeof v === 'string' && v.trim() ? v.trim() : (UNITS_LABEL_DEFAULTS[key] ?? '');
  };
}
