import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse, StrapiSingleResponse } from '../strapi';

export interface HelpTopic {
  emoji: string | null;
  label: string;
  office: string;
}

// Mirrors LABELS in cms/src/seed-contact-page.ts.
const LABEL_DEFAULTS = {
  directory_eyebrow: 'Office Directory',
  finder_eyebrow: 'Office Finder',
  spotlight_kicker: 'Selected office',
  email_label: 'Email',
  telephone_label: 'Telephone',
  info_eyebrow: 'Main College Contact',
  address_label: 'Address',
  phone_label: 'Phone',
  hours_label: 'Office Hours',
  not_confirmed_text: 'To be confirmed',
  copy_address_label: 'Copy address',
  copied_label: 'Address copied',
  location_eyebrow: 'Campus Location',
  directions_note: 'Route planning on Google Maps',
  campus_map_note: "The College's own campus map",
  map_caption: 'Illustration — not to scale. Use the links for the exact location.',
  map_pin_label: 'Kanglung',
  ict_eyebrow: 'ICT & Digital Services',
  quick_actions_label: 'Quick actions',
  search_clear_label: 'Clear search',
  search_count_text: '{count} offices in the directory',
  search_match_text: '{shown} of {count} offices match “{query}”',
  search_empty_hint: "Try another word, or send a general enquiry and we'll pass it to the right office.",
  search_reset_label: 'Show all offices',
  form_details_legend: 'Your details',
  form_enquiry_legend: 'Your enquiry',
  form_required_note: 'Required field',
  form_optional_text: '(optional)',
  form_sending_message: 'Sending your enquiry…',
  form_fix_message: 'Please fix the highlighted fields and try again.',
  validation_required: 'Please enter your {field}.',
  validation_department: 'Please choose a department.',
  validation_email: 'Please enter a valid email address, e.g. name@example.com.',
  rate_limit_message: 'Too many enquiries from this connection. Please try again in a few minutes.',
};

export type ContactLabels = typeof LABEL_DEFAULTS;

export interface ContactPageContent {
  labels: ContactLabels;
  page_title: string;
  seo_description: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  search_label: string;
  search_placeholder: string | null;
  search_empty_message: string;
  quick_find_title: string;
  quick_find_text: string | null;
  quick_enquiry_title: string;
  quick_enquiry_text: string | null;
  quick_directions_title: string;
  quick_directions_text: string | null;
  offices_heading: string;
  offices_intro: string | null;
  email_button_label: string;
  call_button_label: string;
  help_heading: string;
  help_intro: string | null;
  help_topics: HelpTopic[];
  spotlight_enquiry_label: string;
  spotlight_other_office_label: string | null;
  enquiry_heading: string;
  enquiry_intro: string | null;
  form_name_label: string;
  form_email_label: string;
  form_phone_label: string;
  form_department_label: string;
  form_department_placeholder: string;
  form_other_department: string | null;
  form_subject_label: string;
  form_message_label: string;
  form_submit_label: string;
  form_success_message: string;
  form_error_message: string;
  info_heading: string;
  info_subtitle: string | null;
  office_hours: string | null;
  general_email: string | null;
  general_phone: string | null;
  map_heading: string;
  map_intro: string | null;
  map_place_name: string;
  directions_label: string;
  map_url: string | null;
  campus_map_label: string;
  campus_map_url: string | null;
  ict_heading: string | null;
  ict_text: string | null;
  ict_button_label: string;
  ict_button_link: string | null;
  ict_email_subject: string | null;
  ict_card_button_label: string;
}

export interface ContactOffice {
  id: number;
  group_title: string;
  group_description: string | null;
  group_icon: string | null;
  group_order: number;
  full_name: string | null;
  role_title: string | null;
  email: string | null;
  phone: string | null;
  office_location: string | null;
  photo_url: string | null;
}

// Mirrors cms/src/seed-contact-page.ts — used in full only while Strapi is
// unreachable, and for headings/labels left blank in "Contact – Page".
const DEFAULTS: ContactPageContent = {
  labels: LABEL_DEFAULTS,
  page_title: 'Contact Us',
  seo_description:
    'Connect with Sherubtse College, Royal University of Bhutan. Find contact information for academic, student, administrative, research, examination, and ICT services.',
  hero_eyebrow: 'Get in Touch',
  hero_title: 'Find the Right Office',
  hero_subtitle: 'Every office at a glance — who to contact, what they handle, and how to reach them directly.',
  hero_image_url: null,
  search_label: 'Search offices or services',
  search_placeholder: 'e.g. exams, Wi-Fi, admissions',
  search_empty_message: 'No office matches your search.',
  quick_find_title: 'Find an office',
  quick_find_text: 'Browse all seven offices',
  quick_enquiry_title: 'Send an enquiry',
  quick_enquiry_text: 'We’ll route it to the right office',
  quick_directions_title: 'Get directions',
  quick_directions_text: 'Kanglung, Trashigang',
  offices_heading: 'Every Office at a Glance',
  offices_intro: 'Email any office directly, or call where an office number is listed.',
  email_button_label: 'Email Us',
  call_button_label: 'Call Office',
  help_heading: 'How Can We Help?',
  help_intro: "Tell us what you need, and we'll point you to the right office.",
  help_topics: [
    { emoji: '🎓', label: 'Admissions & Programmes', office: 'Academic Affairs' },
    { emoji: '👥', label: 'Student Services', office: 'Student Affairs' },
    { emoji: '📝', label: 'Examination & Records', office: 'Examination & Records' },
    { emoji: '🔬', label: 'Research & Collaboration', office: 'Research & Industrial Linkages' },
    { emoji: '🗂️', label: 'Administration', office: 'Administration' },
    { emoji: '💻', label: 'ICT & Digital Services', office: 'ICT & Digital Services' },
    { emoji: '🏛️', label: 'General Institutional Matters', office: 'Office of the President' },
  ],
  spotlight_enquiry_label: 'Start an enquiry',
  spotlight_other_office_label: 'Or choose an office directly',
  enquiry_heading: 'Have a Question?',
  enquiry_intro: 'Send us a general enquiry and the right office will get back to you.',
  form_name_label: 'Full Name',
  form_email_label: 'Email Address',
  form_phone_label: 'Phone Number',
  form_department_label: 'Select Department',
  form_department_placeholder: 'Choose a department…',
  form_other_department: 'Other / Not Sure',
  form_subject_label: 'Subject',
  form_message_label: 'Message',
  form_submit_label: 'Submit Enquiry',
  form_success_message:
    'Thank you — your enquiry has been received by the College. The right office will get back to you by email.',
  form_error_message: 'Sorry, your enquiry could not be sent. Please try again, or email the College directly.',
  info_heading: 'Sherubtse College',
  info_subtitle: 'Royal University of Bhutan · Kanglung, Trashigang, Bhutan',
  office_hours: null,
  general_email: null,
  general_phone: null,
  map_heading: 'Find Us at Sherubtse',
  map_intro: 'Kanglung, Trashigang — the eastern hills of Bhutan.',
  map_place_name: 'Sherubtse College',
  directions_label: 'Get Directions',
  map_url: null,
  campus_map_label: 'View Campus Map',
  campus_map_url: 'https://finalmap.sherubtse.edu.bt/',
  ict_heading: 'Need Technical Assistance?',
  ict_text: 'Wi-Fi, college systems, student/staff accounts, the website, network access, or other ICT services.',
  ict_button_label: 'ICT Support',
  ict_button_link: 'mailto:ict.sherubtse@rub.edu.bt',
  ict_email_subject: 'ICT Support Request',
  ict_card_button_label: 'Get Technical Assistance',
};

/** Headings and button/field labels can't be blank — an empty one falls back to the default wording. */
const LABEL_KEYS = new Set<string>([
  'page_title', 'seo_description', 'hero_eyebrow', 'hero_title', 'offices_heading', 'email_button_label',
  'call_button_label', 'help_heading', 'enquiry_heading', 'form_name_label', 'form_email_label',
  'form_phone_label', 'form_department_label', 'form_department_placeholder', 'form_subject_label',
  'form_message_label', 'form_submit_label', 'form_success_message', 'form_error_message', 'info_heading',
  'map_heading', 'map_place_name', 'directions_label', 'campus_map_label', 'ict_button_label',
  'search_label', 'search_empty_message', 'quick_find_title', 'quick_enquiry_title', 'quick_directions_title',
  'spotlight_enquiry_label', 'ict_card_button_label',
]);

const text = (v: unknown): string | null => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null);

export async function getContactPageContent(): Promise<ContactPageContent> {
  const res = await strapiGet<StrapiSingleResponse<any>>('contact-page-content', { populate: ['help_topics', 'hero_image', 'labels'] });
  const row = res?.data;
  if (!row) return DEFAULTS;

  // Everything that isn't a heading or label is shown exactly as entered, so
  // a blank intro, link or contact detail is hidden (or "To be confirmed")
  // rather than silently replaced with old wording.
  const content: Record<string, unknown> = {};
  for (const key of Object.keys(DEFAULTS) as (keyof ContactPageContent)[]) {
    if (key === 'help_topics' || key === 'hero_image_url' || key === 'labels') continue;
    content[key] = text(row[key]) ?? (LABEL_KEYS.has(key) ? DEFAULTS[key] : null);
  }
  content.hero_image_url = mediaUrl(row.hero_image);
  // A blank label falls back to its default wording rather than disappearing.
  const labels: Record<string, string> = { ...LABEL_DEFAULTS };
  for (const key of Object.keys(LABEL_DEFAULTS)) labels[key] = text(row.labels?.[key]) ?? labels[key];
  content.labels = labels;
  content.help_topics = (row.help_topics ?? [])
    .map((t: any) => ({ emoji: text(t.emoji), label: text(t.label), office: text(t.office) }))
    .filter((t: any) => t.label && t.office);
  return content as unknown as ContactPageContent;
}

/** The office cards for "Find the Right Office" and the "How Can We Help?"
 * category lookup both read from this same list — one real source of contact
 * data, grouped by `group_title`, rather than two separate content sets. */
export async function getContactOffices(): Promise<ContactOffice[]> {
  const res = await strapiGet<StrapiListResponse<any>>('contact-people', {
    populate: ['photo'],
    sort: ['group_order:asc', 'display_order:asc'],
    pagination: { pageSize: 100 },
  });
  return (res?.data ?? []).map((row: any) => ({
    id: row.id,
    group_title: row.group_title,
    group_description: row.group_description ?? null,
    group_icon: row.group_icon ?? null,
    group_order: row.group_order ?? 0,
    full_name: row.full_name ?? null,
    role_title: row.role_title ?? null,
    email: row.email ?? null,
    phone: row.phone ?? null,
    office_location: row.office_location ?? null,
    photo_url: mediaUrl(row.photo),
  }));
}
