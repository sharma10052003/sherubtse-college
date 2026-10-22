import type { Core } from '@strapi/strapi';

const UID = 'api::contact-page-content.contact-page-content';

/** Contact – Page → Labels & Messages. {count}, {shown}, {query} and {field} are filled in by the page. */
export const LABELS = {
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

const HELP_TOPICS = [
  { emoji: '🎓', label: 'Admissions & Programmes', office: 'Academic Affairs' },
  { emoji: '👥', label: 'Student Services', office: 'Student Affairs' },
  { emoji: '📝', label: 'Examination & Records', office: 'Examination & Records' },
  { emoji: '🔬', label: 'Research & Collaboration', office: 'Research & Industrial Linkages' },
  { emoji: '🗂️', label: 'Administration', office: 'Administration' },
  { emoji: '💻', label: 'ICT & Digital Services', office: 'ICT & Digital Services' },
  { emoji: '🏛️', label: 'General Institutional Matters', office: 'Office of the President' },
];

/**
 * Each seed version lists the wording for the fields it introduced, so admins
 * open a filled-in form. A version only fills fields that are empty.
 */
const VERSIONS: { fill: Record<string, unknown>; replace?: Record<string, [string, string]> }[] = [
  // v1 — the original page wording
  {
    fill: {
      page_title: 'Contact Us',
      seo_description:
        'Connect with Sherubtse College, Royal University of Bhutan. Find contact information for academic, student, administrative, research, examination, and ICT services.',
      hero_eyebrow: 'Get in Touch',
      hero_title: "Let's Connect",
      hero_subtitle:
        'Whether you are a prospective student, parent, researcher, alumni, partner, or member of the Sherubtse community, we are here to help you connect with the right office.',
      offices_heading: 'Find the Right Office',
      offices_intro: 'Every office at a glance — who to contact, what they handle, and how to reach them directly.',
      email_button_label: 'Email Us',
      call_button_label: 'Call Office',
      help_heading: 'How Can We Help?',
      help_intro: "Tell us what you need, and we'll point you to the right office.",
      help_topics: HELP_TOPICS,
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
      form_success_message: 'Thank you — your enquiry has been sent. The right office will be in touch soon.',
      form_error_message: 'Sorry, your enquiry could not be sent. Please try again, or email the College directly.',
      info_heading: 'Sherubtse College',
      info_subtitle: 'Royal University of Bhutan · Kanglung, Trashigang, Bhutan',
      map_heading: 'Find Us at Sherubtse',
      map_intro: 'Kanglung, Trashigang — the eastern hills of Bhutan.',
      map_place_name: 'Sherubtse College',
      directions_label: 'Get Directions',
      campus_map_label: 'View Campus Map',
      campus_map_url: 'https://finalmap.sherubtse.edu.bt/',
      ict_heading: 'Need Technical Assistance?',
      ict_text: 'Wi-Fi, college systems, student/staff accounts, the website, network access, or other ICT services.',
      ict_button_label: 'ICT Support',
      ict_button_link: 'mailto:ict.sherubtse@rub.edu.bt',
    },
  },
  // v2 — office-finder redesign: "Find the Right Office" becomes the hero,
  // the directory gets its own heading, plus search/quick-action/ICT copy.
  {
    replace: {
      hero_title: ["Let's Connect", 'Find the Right Office'],
      hero_subtitle: [
        'Whether you are a prospective student, parent, researcher, alumni, partner, or member of the Sherubtse community, we are here to help you connect with the right office.',
        'Every office at a glance — who to contact, what they handle, and how to reach them directly.',
      ],
      offices_heading: ['Find the Right Office', 'Every Office at a Glance'],
      offices_intro: [
        'Every office at a glance — who to contact, what they handle, and how to reach them directly.',
        'Email any office directly, or call where an office number is listed.',
      ],
      form_success_message: [
        'Thank you — your enquiry has been sent. The right office will be in touch soon.',
        'Thank you — your enquiry has been received by the College. The right office will get back to you by email.',
      ],
    },
    fill: {
      search_label: 'Search offices or services',
      search_placeholder: 'e.g. exams, Wi-Fi, admissions',
      search_empty_message: 'No office matches your search.',
      quick_find_title: 'Find an office',
      quick_find_text: 'Browse all seven offices',
      quick_enquiry_title: 'Send an enquiry',
      quick_enquiry_text: 'We’ll route it to the right office',
      quick_directions_title: 'Get directions',
      quick_directions_text: 'Kanglung, Trashigang',
      spotlight_enquiry_label: 'Start an enquiry',
      spotlight_other_office_label: 'Or choose an office directly',
      ict_email_subject: 'ICT Support Request',
      ict_card_button_label: 'Get Technical Assistance',
    },
  },
  // v3 — every remaining label and message on the page (Labels & Messages block)
  { fill: { labels: LABELS } },
];

const STORE = {

 type: 'core', name: 'seeds', key: 'contact_page_version' } as const;

const isEmpty = (v: unknown) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);

/**
 * Brings the Contact – Page entry up to the latest seed version, once.
 * Empty fields get the default wording; `replace` only swaps text that is
 * still exactly the previous default, so anything an admin wrote is kept,
 * and a field an admin clears stays cleared (a version never runs twice).
 */
export async function ensureContactPageContent({ strapi }: { strapi: Core.Strapi }) {
  const done = Number(await strapi.store.get(STORE)) || 0;
  if (done >= VERSIONS.length) return;

  const docs = strapi.documents(UID as any);
  const existing: any = await docs.findFirst({ locale: 'en', populate: ['help_topics', 'labels'] } as any);
  const pending = VERSIONS.slice(done);

  if (!existing) {
    const data: Record<string, unknown> = {};
    for (const v of VERSIONS) {
      Object.assign(data, v.fill);
      for (const [key, [, next]] of Object.entries(v.replace ?? {})) data[key] = next;
    }
    await docs.create({ locale: 'en', data } as any);
  } else {
    const changes: Record<string, unknown> = {};
    for (const v of pending) {
      for (const [key, value] of Object.entries(v.fill)) {
        if (isEmpty(existing[key]) && !(key in changes)) changes[key] = value;
      }
      for (const [key, [previous, next]] of Object.entries(v.replace ?? {})) {
        if ((changes[key] ?? existing[key]) === previous) changes[key] = next;
      }
    }
    if (Object.keys(changes).length > 0) {
      await docs.update({ documentId: existing.documentId, locale: 'en', data: changes } as any);
    }
  }

  await strapi.store.set({ ...STORE, value: VERSIONS.length });
}
