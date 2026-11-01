// Wording of the Programmes listing page. Edited in Strapi: Academics – Programmes Page →
// Labels. These defaults match the Strapi seed (cms/src/seed-overview-labels.ts) and fill in
// anything left out. {count} is filled in by the page.
export const PROGRAMMES_HERO_DEFAULTS = {
  hero_eyebrow: 'Academics',
  hero_heading: 'Programmes',
  hero_intro: 'Undergraduate degrees across the sciences, data and the social sciences.',
};

export const PROGRAMMES_LABEL_DEFAULTS: Record<string, string> = {
  tiles_label: 'Departments',
  stat_programmes: 'Programmes',
  stat_departments: 'Departments',
  tile_open: 'Show these programmes',
  search_label: 'Search programmes',
  search_placeholder: 'Search programmes',
  all_label: 'All',
  level_undergraduate: 'Undergraduate',
  level_postgraduate: 'Postgraduate',
  view_label: 'View',
  view_cards: 'Cards',
  view_list: 'List',
  count_one: '{count} programme',
  count_many: '{count} programmes',
  empty_message: 'No programme matches your search.',
  clear_label: 'Show all programmes',
  open_label: 'View programme',
  quick_label: 'Quick view',
  quick_close: 'Close',
  quick_prev: 'Previous',
  quick_next: 'Next',
  quick_page: 'Go to programme page',
  fact_award: 'Award',
  fact_duration: 'Duration',
  fact_department: 'Department',
  fact_level: 'Level',
  fact_seats: 'Seats',
  fact_fee: 'Annual fee',
  fact_intake: 'Admissions',
  intake_open: 'Admissions open',
  intake_closed: 'Admissions closed',
  intake_waitlist: 'Waitlist only',
  cta_heading: 'Ready to apply?',
  cta_text: 'See the entry requirements, key dates and how to apply.',
  cta_button: 'Go to Admissions',
  cta_second: 'Ask the admissions team',
};

export type ProgrammesLabelFn = (key: string) => string;

export function makeProgrammesLabels(custom?: Record<string, string> | null): ProgrammesLabelFn {
  return (key) => {
    const v = custom?.[key];
    return typeof v === 'string' && v.trim() ? v.trim() : (PROGRAMMES_LABEL_DEFAULTS[key] ?? '');
  };
}
