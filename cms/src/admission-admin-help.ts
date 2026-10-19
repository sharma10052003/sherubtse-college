import type { Core } from '@strapi/strapi';
import { applyAdminHelp, type HelpMap } from './admin-help';

/** Admin labels and help text for the Admission types (see admin-help.ts). */

// The Bhutanese and International applicant types share every field.
const AUDIENCE_FIELDS: Record<string, string> = {
  card_title: 'Title of this group’s card on the /admissions page, e.g. “Bhutanese applicants”.',
  card_description: 'One or two sentences on the card, saying who this page is for.',
  intro: 'Short introduction at the top of this page.',
  key_facts: 'Up to 4 short facts shown at the top (e.g. “Applications open” — “1–15 March 2026”).',
  apply_intro: 'Text at the top of the “How to Apply” tab.',
  application_routes: 'One entry per way of applying. Each shows its dates, steps and an apply button.',
  required_documents: 'One document per line. Optional detail after a dash, e.g. “Passport — valid for the study duration”. Links: [text](https://…).',
  requirements_intro: 'Text at the top of the “Requirements” tab.',
  requirements: 'One entry per programme (or group of programmes).',
  fees_intro: 'Text at the top of the “Fees” tab, e.g. the academic year.',
  fees: 'One row per fee. Type amounts exactly as published, e.g. “Nu. 78,505”.',
  fees_note: 'Shown under the fee table, e.g. how fees are paid.',
  scholarships_intro: 'Text at the top of the “Scholarships” tab.',
  scholarships: 'One entry per scholarship. The tab is hidden when this is empty.',
  faqs: 'Questions and answers for the “FAQs” tab.',
  more_info: 'Extra titled blocks for the “More Info” tab (e.g. Visa, Accommodation).',
  contacts: 'Who applicants can contact, shown in the “Contact” tab.',
  links: 'Useful links and forms, shown in the “More Info” tab.',
};

const HELP: HelpMap = {
  'content_types::api::admissions-overview.admissions-overview': {
    fields: {
      eyebrow: 'Small label above the title.',
      heading: 'Page title (large heading at the top).',
      subtitle: 'One line under the title.',
      intro: 'Short introduction under the subtitle.',
      hero_image: 'Optional campus photo behind the heading. Leave empty for the navy design.',
      hero_image_alt: 'Describe the hero photo for screen readers.',
      choose_heading: 'Heading above the two applicant cards, e.g. “Who’s applying?”. The cards’ text is set in each applicant type.',
      choose_intro: 'Short line under that heading.',
      dates_heading: 'Heading above the key dates timeline.',
      dates_intro: 'Short line under the timeline heading.',
      key_dates: 'Dates on the timeline. Past dates are shown as passed automatically.',
      notices_heading: 'Heading above the latest admission notices (Notices with Category “Admissions”).',
      help_heading: 'Heading above the enquiry form.',
      help_intro: 'Short line above the enquiry form.',
      seo: 'Search-engine title, description and sharing image.',
      labels: 'Fixed words used on all Admissions pages: tab names, buttons and status badges.',
    },
  },
  'content_types::api::admission-bhutanese.admission-bhutanese': { fields: AUDIENCE_FIELDS },
  'content_types::api::admission-international-applicants.admission-international-applicants': { fields: AUDIENCE_FIELDS },
  'content_types::api::admission-enquiry-setting.admission-enquiry-setting': {
    fields: {
      enquiry_categories: 'Options in “Your question is about”, each with the email address that handles it.',
      default_recipient_email: 'Used when an option has no email address of its own.',
      consent_label: 'Text beside the required consent tick box.',
      confirmation_message: 'Shown only after the enquiry is saved.',
      privacy_policy_url: 'Link to the privacy policy, if the College has one.',
    },
  },
  'content_types::api::admission-enquiry.admission-enquiry': {
    mainField: 'full_name',
    fields: {
      routed_to: 'The email address this enquiry was assigned to.',
      reviewed: 'Tick once the enquiry has been answered.',
    },
  },
  'content_types::api::notice.notice': {
    fields: {
      category: 'Choose “Admissions” to show the notice on the Admissions pages.',
      admission_audience: 'Admission notices: who this is for. “all” shows it on both applicant pages.',
      summary: 'Short summary for lists.',
      publish_at: 'Publication date (not the application deadline).',
      application_opens: 'When applications open, if this notice announces an intake.',
      application_closes: 'Application deadline — separate from the publication date.',
      expires_at: 'After this date the notice moves to the archive.',
      is_archived: 'Move to the archive now, regardless of the expiry date.',
    },
  },
  'components::admission.enquiry-option': { fields: { recipient_email: 'Email address that handles this kind of question.' } },
  'components::admission-guide.fact': { mainField: 'label', fields: { label: 'e.g. “BSc programmes”.', value: 'e.g. “Apply 15 April – 5 May 2026”.' } },
  'components::admission-guide.route': {
    mainField: 'title',
    fields: {
      for_programmes: 'Which programmes this route is for, e.g. “Physics · Chemistry · Mathematics”.',
      opens_on: 'Date applications open (leave empty if not announced).',
      closes_on: 'Date applications close. The page shows “Open now”, “Opens soon” or “Closed” automatically.',
      steps: 'One step per line. Optional detail after a dash, e.g. “Apply online — Use the form below.” Links: [text](https://…).',
      portal_label: 'Button text, e.g. “Application form”.',
      portal_url: 'Button link: https://… or mailto:…',
    },
  },
  'components::admission-guide.requirement': {
    mainField: 'programme',
    fields: { minimum: 'Minimum results, as officially published.', selection: 'How applicants are selected.', seats: 'e.g. “30 government scholarship · 10 self-financed”.' },
  },
  'components::admission-guide.fee': { mainField: 'item', fields: { amount: 'As published, e.g. “Nu. 78,505” or “US$3,533”.', period: 'e.g. “per year”, “per month”, “once, at admission”.' } },
  'components::admission-guide.scholarship': {
    mainField: 'title',
    fields: { eligibility: 'One condition per line.', deadline: 'Last day to apply. Leave empty if there is none.', link_url: 'Form or details link: https://… or mailto:…' },
  },
  'components::admission-guide.faq': { mainField: 'question', fields: {} },
  'components::admission-guide.contact': { mainField: 'name', fields: { name: 'Person or office name.', role: 'What they help with.' } },
  'components::admission-guide.info': { mainField: 'title', fields: { body: 'Text. Use **bold**, lists and [links](https://…).' } },
  'components::admission-guide.key-date': {
    mainField: 'label',
    fields: { label: 'What happens on this date.', audience: 'Who it applies to. Each applicant page shows its own dates plus “all”.' },
  },
};

export async function applyAdmissionAdminHelp({ strapi }: { strapi: Core.Strapi }) {
  await applyAdminHelp({
    strapi,
    help: HELP,
    prefixes: ['content_types::api::admission', 'content_types::api::admissions-overview', 'components::admission.', 'components::admission-guide.'],
    storeKey: 'admission_main_fields_set',
  });
}
