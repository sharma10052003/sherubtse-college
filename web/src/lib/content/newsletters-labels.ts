// Wording of the Newsletter page. Edited in Strapi: Newsletter – Page → Labels. These defaults
// match the Strapi seed (cms/src/seed-newsletters.ts) and fill in anything left out.
// {count}, {n} and {total} are filled in by the page.
export const NEWSLETTERS_HERO_DEFAULTS = {
  hero_eyebrow: 'News & Notices',
  hero_heading: 'Newsletters',
  hero_intro: 'Read the College’s newsletters page by page, right here — or download the PDF to keep.',
};

export const NEWSLETTERS_LABEL_DEFAULTS: Record<string, string> = {
  stat_issues: 'Issues',
  stat_publications: 'Publications',
  stat_years: 'Years',
  read_latest: 'Read the latest issue',
  browse: 'Browse all newsletters',
  continue_label: 'Continue reading',
  continue_page: 'Page {n}',
  latest_badge: 'Latest',
  library_heading: 'The newsletter library',
  library_intro: 'Every newsletter published by the College. Pick a publication or a year, or search for a topic.',
  search_label: 'Search newsletters',
  search_placeholder: 'Search by name, issue or topic',
  all_label: 'All',
  year_all: 'All years',
  year_label: 'Year',
  sort_label: 'Order',
  sort_newest: 'Newest first',
  sort_oldest: 'Oldest first',
  view_shelf: 'Shelf',
  view_list: 'List',
  count_one: '{count} issue',
  count_many: '{count} issues',
  empty_message: 'No newsletter matches your search.',
  clear_label: 'Show all newsletters',
  surprise: 'Surprise me',
  read_label: 'Read',
  details_label: 'Details',
  download_label: 'Download PDF',
  external_label: 'Open',
  tip_text: 'Tip: in the reader, use the arrow keys to turn pages and press L to have a page read aloud.',
  detail_about: 'About this issue',
  detail_topics: 'Inside this issue',
  detail_more: 'More from this publication',
  detail_other: 'Other newsletters',
  detail_newer: 'Newer issue',
  detail_older: 'Older issue',
  detail_published_by: 'Published by',
  detail_share: 'Share',
  detail_copy: 'Copy link',
  detail_copied: 'Link copied',
  detail_read: 'Read this issue',
};

export type NewslettersLabelFn = (key: string) => string;

export function makeNewslettersLabels(custom?: Record<string, string> | null): NewslettersLabelFn {
  return (key) => {
    const v = custom?.[key];
    return typeof v === 'string' && v.trim() ? v.trim() : (NEWSLETTERS_LABEL_DEFAULTS[key] ?? '');
  };
}
