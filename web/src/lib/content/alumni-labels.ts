// Wording of the Alumni overview and its sub-pages (navigation, topic cards,
// page titles). Edited in Strapi: Alumni – Page → Labels. These defaults match
// the Strapi seed (cms/src/seed-overview-labels.ts) and fill in anything left
// out. {count} is filled in by the page.
export const ALUMNI_LABEL_DEFAULTS: Record<string, string> = {
  eyebrow: 'Alumni',
  nav_label: 'Alumni sections',
  nav_overview: 'Overview',
  nav_stories: 'Stories',
  nav_events: 'Events',
  nav_give_back: 'Give back',
  nav_network: 'Around the world',
  nav_highlights: 'Achievements',
  nav_register: 'Join',
  hub_eyebrow: 'Explore',
  hub_heading: 'Everything for Sherubtse alumni',
  hub_intro: 'Choose a topic. Each one has its own page.',
  open_label: 'Open',
  stories_title: 'Alumni stories',
  stories_text: 'Journeys worth sharing, from graduates of Sherubtse.',
  share_title: 'Share your story',
  share_text: 'Tell the story of your Sherubtse journey. The Alumni Office reviews every story before it is published.',
  events_title: 'Alumni events',
  events_text: 'Reunions, talks and gatherings.',
  give_back_title: 'Give back',
  give_back_text: 'Mentor students, speak to a class or support today’s Sherubtseans.',
  network_title: 'Around the world',
  network_text: 'Where Sherubtse graduates live and work.',
  highlights_title: 'Achievements and gallery',
  highlights_text: 'What alumni have achieved, and photographs from the Sherubtse years.',
  register_title: 'Join the community',
  register_text: 'Register with the Alumni Office to stay in touch.',
  meta_stories: '{count} stories',
  meta_events: '{count} upcoming',
  meta_chapters: '{count} chapters',
  foot_text: 'Questions about alumni matters?',
  foot_button: 'Contact the Alumni Office',
  foot_back: 'Back to Alumni',
};

export type AlumniLabelFn = (key: string) => string;

export function makeAlumniLabels(custom?: Record<string, string> | null): AlumniLabelFn {
  return (key) => {
    const v = custom?.[key];
    return typeof v === 'string' && v.trim() ? v.trim() : (ALUMNI_LABEL_DEFAULTS[key] ?? '');
  };
}
