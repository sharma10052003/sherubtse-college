// Wording of the Examinations page. Edited in Strapi: Academics – Examinations Page → Labels.
// These defaults match the Strapi seed (cms/src/seed-overview-labels.ts) and fill in anything
// left out. {count}, {n} and {date} are filled in by the page.
export const EXAMINATIONS_HERO_DEFAULTS = {
  hero_eyebrow: 'Academics',
  hero_heading: 'Examinations & Records',
  hero_intro: 'Timetables, results, notices and guidelines from the Examination & Records Office, and how to request your academic records.',
};

export const EXAMINATIONS_LABEL_DEFAULTS: Record<string, string> = {
  stat_documents: 'Documents',
  stat_notices: 'Latest notices',
  stat_dates: 'Upcoming dates',
  next_label: 'Next on the calendar',
  next_none: 'No exam dates are scheduled yet.',
  days_many: '{n} days to go',
  days_one: '1 day to go',
  days_today: 'Today',
  days_ongoing: 'Happening now',
  days_past: 'Completed',
  next_calendar: 'See the full calendar',
  nav_latest: 'Latest',
  nav_dates: 'Key dates',
  nav_library: 'Documents & results',
  nav_records: 'Records & certificates',
  nav_contact: 'Contact',
  latest_heading: 'Latest exam news & notices',
  latest_intro: 'The newest announcements about examinations and results.',
  latest_empty: 'No examination notices have been published yet.',
  latest_read: 'Read more',
  dates_heading: 'Examination calendar',
  dates_intro: 'Examination and results dates from the academic calendar.',
  dates_empty: 'No examination dates have been added to the academic calendar yet.',
  dates_recent: 'Recently',
  dates_all: 'Full academic calendar',
  library_heading: 'Documents & results',
  library_intro: 'Timetables, results, circulars and guidelines. Use the filters to find what you need.',
  search_label: 'Search documents',
  search_placeholder: 'Search by title, session or programme',
  filter_all: 'All',
  session_label: 'Session',
  session_all: 'All sessions',
  count_one: '{count} document',
  count_many: '{count} documents',
  empty_filtered: 'No document matches your search.',
  empty_all: 'Examination documents will appear here once the Examination & Records Office publishes them.',
  clear_label: 'Clear filters',
  open_label: 'Open',
  download_label: 'Download',
  applies_label: 'Applies to',
  kind_timetable: 'Timetable',
  kind_result: 'Result',
  kind_notice: 'Notice',
  kind_circular: 'Circular',
  kind_guideline: 'Guideline',
  kind_form: 'Form',
  kind_record: 'Records',
  cal_examination: 'Examination',
  cal_results: 'Results',
  cal_more: 'Dates',
  records_heading: 'Records & certificates',
  records_intro: 'What the Examination & Records Office provides, as published by the College.',
  handles_heading: 'The office looks after',
  contact_heading: 'Contact the Examination & Records Office',
  contact_email: 'Email the office',
  contact_phone: 'Call',
  contact_location: 'Find the office',
  feed_keywords: 'exam, result, mark sheet, transcript, timetable, assessment',
};

export type ExaminationsLabelFn = (key: string) => string;

export function makeExaminationsLabels(custom?: Record<string, string> | null): ExaminationsLabelFn {
  return (key) => {
    const v = custom?.[key];
    return typeof v === 'string' && v.trim() ? v.trim() : (EXAMINATIONS_LABEL_DEFAULTS[key] ?? '');
  };
}
