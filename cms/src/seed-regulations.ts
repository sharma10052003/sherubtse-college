import type { Core } from '@strapi/strapi';

/**
 * Academics – Regulations Page. The content below is the College's own "Student Academic Guide"
 * (https://www.sherubtse.edu.bt/academic-guide/), kept to its wording — nothing is added.
 * For complete details the Guide itself refers students to the Wheel of Academic Law, which
 * the page links to. Seeded once; after that everything is edited in Strapi.
 */
const UID = 'api::regulations-page.regulations-page';
const VERSION_KEY = { type: 'core', name: 'seeds', key: 'regulations_page_version' } as const;

export const REGULATIONS_HERO = {
  hero_eyebrow: 'Academics',
  hero_heading: 'Academic Regulations',
  hero_intro:
    'This quick guide provides an overview of essential academic policies, procedures, and regulations for all students. Students are expected to familiarize themselves with these regulations to ensure academic success and compliance with the standards.',
};

export const REGULATIONS_SOURCE_NOTE =
  'This is a summary of the College’s Student Academic Guide. For complete details, refer to the Wheel of Academic Law.';

type Rule = { title: string; text?: string; highlight?: string };
type Topic = { key: string; title: string; icon: string; intro?: string; items: Rule[] };

export const KEY_FIGURES: Rule[] = [
  { highlight: '90%', title: 'Minimum attendance', text: 'Relaxed to 80% only for valid extenuating circumstances or official assignments.' },
  { highlight: '50%', title: 'Usual pass mark', text: 'Students may be required to pass each component separately.' },
  { highlight: '5', title: 'Modules per semester', text: 'With a maximum of 7 modules.' },
  { highlight: '14 days', title: 'To apply for a recheck or appeal', text: 'From the day results are declared or the decision is announced.' },
];

export const TOPICS: Topic[] = [
  {
    key: 'structure',
    title: 'Academic structure',
    icon: 'people',
    intro: 'The academic structure ensures clear responsibilities at all levels.',
    items: [
      { title: 'Dean of Academic Affairs', text: 'Oversees all academic functions.' },
      { title: 'Heads of Department (HoDs)', text: 'Manage staffing and HR.' },
      { title: 'Programme Leaders', text: 'Ensure academic health of programmes.' },
      { title: 'Semester Guides', text: 'Support student cohorts.' },
      { title: 'Module Tutors', text: 'Teach and assess modules.' },
    ],
  },
  {
    key: 'decision-bodies',
    title: 'Decision-making bodies',
    icon: 'shield',
    intro: 'The College has key academic decision-making bodies to ensure quality and fairness.',
    items: [
      { title: 'College Academic Committee (CAC)', text: 'Oversees academic standards & policies.' },
      { title: 'Programme Committee', text: 'Monitors academic health, regular programme activities.' },
      { title: 'Programme Board of Examiners', text: 'Oversees assessment standards, fairness, consistency, and outcomes.' },
    ],
  },
  {
    key: 'registration',
    title: 'Registration and module enrolment',
    icon: 'journal',
    items: [
      { title: 'Semester registration', text: 'All students must register at the start of each semester based on their academic progress and programme requirements. Non-registered students will not be assessed for progression.' },
      { title: 'Module load limits', highlight: '5 · max 7', text: 'Students take 5 modules per semester, with a maximum of 7 modules.' },
      { title: 'Repeat module', text: 'Students repeating failed modules must register at the beginning and make full payment for each repeat at the time of registration.' },
      { title: 'Self-funding students', text: 'Students on self-funding must pay tuition fees before their registration is considered complete.' },
    ],
  },
  {
    key: 'assessment',
    title: 'Assessment regulations',
    icon: 'study',
    items: [
      { title: 'Types of assessment', text: 'Modules use a mix of continuous assessment (assignments, tests, presentations, practicals) and final exams. Assessment design aligns with learning outcomes.' },
      { title: 'Weighting & pass marks', highlight: '50%', text: 'Assessment weights and criteria are shared at the start of the semester. The usual pass mark is 50%, and students may be required to pass each component separately.' },
      { title: 'Deadlines & extensions', text: 'All continuous assessments must be submitted on time. Extensions may be granted only for valid reasons. Late submissions may be penalized or rejected.' },
      { title: 'Reassessment', highlight: 'Capped at 50%', text: 'Reassessment is allowed if failing up to two modules in SEE. Only the failed component is reassessed, and total marks are capped at 50%.' },
    ],
  },
  {
    key: 'examination-rules',
    title: 'Examination rules',
    icon: 'clock',
    items: [
      { title: 'Exam conduct', highlight: '15 min early', text: 'Arrive 15 minutes early. No communication, mobile phones, or unauthorized materials in the exam hall.' },
      { title: 'Late arrival & absence', highlight: '30 min', text: 'Entry not allowed after 30 minutes. Absence requires valid medical/documentary evidence and inform Programme Leader within 24 hours after missing the exam in writing.' },
      { title: 'Cheating & misconduct', text: 'Any breach of exam rules may result in annulment of all exams in the semester.' },
      { title: 'Deferred exams', text: 'Permitted only for illness or serious circumstances with official documentation and inform Programme Leader in writing.' },
    ],
  },
  {
    key: 'academic-dishonesty',
    title: 'Academic dishonesty',
    icon: 'heart',
    items: [
      { title: 'Be honest', text: 'Cheating, plagiarism, collusion, falsifying data, or submitting others’ work as your own is strictly prohibited.' },
      { title: 'Types of academic dishonesty', text: 'Includes collusion, commissioning, duplication, false declaration, data falsification, and plagiarism.' },
      { title: 'Acknowledge sources', text: 'Always credit any ideas, text, images, or data taken from others, whether published or unpublished.' },
      { title: 'Penalties', text: 'Minor cases may get mark deductions; major or repeated offences can lead to a zero or more serious disciplinary action.' },
    ],
  },
  {
    key: 'attendance',
    title: 'Attendance',
    icon: 'access',
    items: [
      { title: 'Requirements', highlight: '90%', text: 'Maintain a minimum of 90% attendance, with a relaxation up to 80% only for valid extenuating circumstances or official assignments.' },
      { title: 'Attendance shortfall', text: 'Those who don’t meet the requirement fail the module and must repeat it with full attendance next time.' },
    ],
  },
  {
    key: 'recheck',
    title: 'Recheck and re-evaluation',
    icon: 'search',
    items: [
      { title: 'Recheck of scripts', highlight: 'Nu. 200', text: 'Ensures all answers marked and counted; Nu. 200 per module (refundable if error found).' },
      { title: 'Re-evaluation of scripts', highlight: 'Nu. 500', text: 'Done by second marker; average of first and second marking is final. Fee Nu. 500 per module (non-refundable).' },
      { title: 'Where to apply', highlight: '14 days', text: 'Submit applications in writing to the Programme Leader within 14 days of the results being declared.' },
    ],
  },
  {
    key: 'appeals',
    title: 'Appeals',
    icon: 'external',
    items: [
      { title: 'Right to appeal', highlight: '14 days', text: 'Students can appeal Programme Board of Examiners’ decisions to the University Academic Appeals Committee within 14 days of the decision being announced.' },
      { title: 'Grounds of appeal', text: 'Include illness or other factors affecting performance, ignored extenuating circumstances, errors in exam conduct, substantial misjudgment, or administrative/assessment irregularities.' },
      { title: 'Supporting documentation', text: 'Appeals must include evidence like medical certificates, tutor reports, or other relevant documents.' },
      { title: 'Fee requirement', highlight: 'Nu. 1000', text: 'A non-refundable fee of Nu 1000 is required when submitting an appeal.' },
    ],
  },
];

/** Wording around the page (hero tiles, search, buttons). Edited under Labels. */
export const REGULATIONS_LABELS: Record<string, string> = {
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

export async function ensureRegulationsPage(strapi: Core.Strapi) {
  if ((Number(await strapi.store.get(VERSION_KEY)) || 0) >= 1) return;
  const docs = strapi.documents(UID as any) as any;
  const existing = await docs.findFirst();

  // Use the Wheel of Academic Law already uploaded under Documents, if there is one.
  const wheelDoc: any = await (strapi.documents('api::document.document' as any) as any)
    .findFirst({ filters: { title: { $containsi: 'Wheel of Academic Law' } }, populate: ['file'] })
    .catch(() => null);
  const wheelUrl = wheelDoc?.file?.url || 'https://www.sherubtse.edu.bt/wp-content/uploads/2024/01/The-Wheel-of-Academic-Law.pdf';

  const data = {
    ...REGULATIONS_HERO,
    key_figures: KEY_FIGURES,
    topics: TOPICS.map((t) => ({ ...t })),
    source_note: REGULATIONS_SOURCE_NOTE,
    wheel_label: 'The Wheel of Academic Law',
    wheel_url: wheelUrl,
    labels: REGULATIONS_LABELS,
  };
  if (!existing) {
    const created = await docs.create({ data });
    void created;
  } else {
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      const cur = existing[k];
      const empty = cur == null || cur === '' || (Array.isArray(cur) && cur.length === 0);
      if (empty) patch[k] = v;
    }
    if (Object.keys(patch).length) await docs.update({ documentId: existing.documentId, data: patch });
  }
  await strapi.store.set({ ...VERSION_KEY, value: 1 });
}
