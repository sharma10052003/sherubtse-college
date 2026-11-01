// Wording of the Academic Regulations page. Edited in Strapi: Academics – Regulations Page →
// Labels. These defaults match the Strapi seed (cms/src/seed-regulations.ts) and fill in anything
// left out. {count} is filled in by the page.
export const REGULATIONS_HERO_DEFAULTS = {
  hero_eyebrow: 'Academics',
  hero_heading: 'Academic Regulations',
  hero_intro:
    'This quick guide provides an overview of essential academic policies, procedures, and regulations for all students.',
};

export const REGULATIONS_LABEL_DEFAULTS: Record<string, string> = {
  figures_label: 'Key figures at a glance',
  index_label: 'In this guide',
  search_label: 'Search the regulations',
  search_placeholder: 'Search, e.g. attendance, appeal, fee',
  count_one: '{count} rule',
  count_many: '{count} rules',
  empty_message: 'No rule matches your search.',
  clear_label: 'Show all rules',
  topic_count: '{count} rules',
  wheel_heading: 'The full regulations',
  wheel_text: 'This guide is a summary. The complete rules are in the Wheel of Academic Law.',
  wheel_button: 'Open the Wheel of Academic Law',
  contact_heading: 'Questions about a rule?',
  contact_text: 'The Examination & Records Office can help.',
  contact_button: 'Examinations & Records',
  contact_url: '/academics/examinations',
};

export type RegulationsLabelFn = (key: string) => string;

export function makeRegulationsLabels(custom?: Record<string, string> | null): RegulationsLabelFn {
  return (key) => {
    const v = custom?.[key];
    return typeof v === 'string' && v.trim() ? v.trim() : (REGULATIONS_LABEL_DEFAULTS[key] ?? '');
  };
}
