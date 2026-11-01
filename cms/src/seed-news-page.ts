import type { Core } from '@strapi/strapi';

/** News & Notices – News Page: created once with the wording the page would otherwise hold in its code. */
export const NEWS_PAGE_HERO = {
  hero_eyebrow: 'News & Notices',
  hero_heading: 'News',
  hero_intro: 'Every story from Sherubtse College — campus life, academics, research, achievements and events — in one place.',
};

export const NEWS_PAGE_LABELS: Record<string, string> = {
  stat_stories: 'Stories',
  stat_photos: 'Photos',
  stat_categories: 'Categories',
  stat_years: 'Years',
  spotlight_label: 'In the spotlight',
  read_story: 'Read the story',
  spotlight_prev: 'Previous story',
  spotlight_next: 'Next story',
  spotlight_pause: 'Pause',
  spotlight_play: 'Play',
  board_heading: 'Every story',
  board_intro: 'All the news the College has published, newest first. Narrow it by category or year, or search.',
  all_label: 'All stories',
  search_label: 'Search the news',
  search_placeholder: 'Search by title, topic or tag',
  year_label: 'Year',
  year_all: 'All years',
  sort_label: 'Order',
  sort_newest: 'Newest first',
  sort_oldest: 'Oldest first',
  view_label: 'View',
  view_cards: 'Cards',
  view_list: 'List',
  view_timeline: 'Timeline',
  archive_toggle: 'Include the archive',
  archive_badge: 'Archive',
  photos_badge: '{n} photos',
  video_badge: 'Video',
  count_one: '{count} story',
  count_many: '{count} stories',
  empty_message: 'No story matches these filters.',
  clear_label: 'Clear filters',
  card_read: 'Read',
  wall_eyebrow: 'The Photo Wall',
  wall_heading: 'In Pictures',
  wall_more: 'Show more photos',
  wall_left: '{n} left',
  layout_mosaic: 'Mosaic',
  layout_grid: 'Grid',
  band_heading: 'More from Sherubtse',
  band_news_text: 'Notices and vacancies',
  band_news_button: 'Announcements',
  band_news_url: '/news-notices/announcements',
  band_letter_text: 'The College newsletters, page by page',
  band_letter_button: 'Newsletters',
  band_letter_url: '/newsletter',
  band_events_text: 'What is happening on campus',
  band_events_button: 'Events',
  band_events_url: '/news-notices/events',
};

export async function ensureNewsPage(strapi: Core.Strapi) {
  const key = { type: 'core', name: 'seeds', key: 'news_page_version' } as const;
  if ((Number(await strapi.store.get(key)) || 0) >= 1) return;
  const docs = strapi.documents('api::news-page.news-page' as any) as any;
  const existing = await docs.findFirst();
  if (!existing) {
    await docs.create({ data: { ...NEWS_PAGE_HERO, labels: NEWS_PAGE_LABELS } });
  } else {
    const current = existing.labels && typeof existing.labels === 'object' ? existing.labels : {};
    await docs.update({ documentId: existing.documentId, data: { labels: { ...NEWS_PAGE_LABELS, ...current } } });
  }
  await strapi.store.set({ ...key, value: 1 });
}
