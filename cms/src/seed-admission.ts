import type { Core } from '@strapi/strapi';

/**
 * Admissions content. The Admissions section is edited in four places:
 *   Admission – Page Settings            the /admissions landing page
 *   Admission – Bhutanese Applicants     /admissions/bhutanese
 *   Admission – International Applicants /admissions/international
 *   Admission – Enquiry Form Settings    the enquiry form
 * plus Notices with Category “Admissions” for admission notices.
 *
 * Every fact below is from the official College pages (read 14 Oct 2026):
 *   www.sherubtse.edu.bt/admission/                       2026 admission notice
 *   www.sherubtse.edu.bt/tuition-fee/                     fees 2026–27
 *   www.sherubtse.edu.bt/eligibility-application-process/ international applicants
 *   www.sherubtse.edu.bt/accommodation/                   residences
 * Runs once per SEED_VERSION and only fills fields that are still empty, so
 * nothing staff have entered is ever overwritten.
 */

const SEED_VERSION = 3;
const STORE = { type: 'core', name: 'seeds', key: 'admission_version' } as const;

const UID = {
  page: 'api::admissions-overview.admissions-overview',
  bhutanese: 'api::admission-bhutanese.admission-bhutanese',
  international: 'api::admission-international-applicants.admission-international-applicants',
  enquiry: 'api::admission-enquiry-setting.admission-enquiry-setting',
  notice: 'api::notice.notice',
} as const;

const ADMISSION_EMAIL = 'admission.sherubtse@rub.edu.bt';

const SRC = {
  admission: 'https://www.sherubtse.edu.bt/admission/',
  intl: 'https://www.sherubtse.edu.bt/eligibility-application-process/',
};
const LINKS = {
  applyBachelor: 'https://forms.gle/HJuwndZcCHVUDK689',
  dvtCheck: 'https://script.google.com/macros/s/AKfycbwdIKjouIVgwOumduL5bX4a77G12_oAsuyGKFNWYORHcdq6XC5fo-rrh6Izw0AQiI_z/exec',
  leadershipForm: 'https://drive.google.com/file/d/1qe_uuJkdjvo0ZqQ4opab0UvznvtMQ6ne/view?usp=sharing',
  annexA: 'https://www.rub.edu.bt/wp-content/uploads/2024/06/Annexure-A-International-Student-Application-Form-for-Award-Bearing-Programme.docx',
  annexB: 'https://www.rub.edu.bt/wp-content/uploads/2024/06/Annexure-B-Semester-Abroad-Application-Form.docx',
  annexC: 'https://www.rub.edu.bt/wp-content/uploads/2024/06/Annexure-C-Short-Term-Study-Abroad-Application-Form.docx',
  annexD: 'https://www.rub.edu.bt/wp-content/uploads/2024/06/Annexure-D-Reference-Report-Form-for-Masters-and-PhD-students.docx',
  annexE: 'https://www.rub.edu.bt/wp-content/uploads/2024/06/Annexure-E-Statement-of-Purpose.docx',
  rubIntl: 'https://www.rub.edu.bt/index.php/international-relations/',
  handbook: 'https://www.sherubtse.edu.bt/wp-content/uploads/2024/07/Student-Handbook_2024-2025-1.pdf',
};

const isEmpty = (v: unknown) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
const lines = (...l: string[]) => l.join('\n');

export async function ensureAdmissionContent({ strapi }: { strapi: Core.Strapi }) {
  const done = Number(await strapi.store.get(STORE)) || 0;
  if (done >= SEED_VERSION) return;
  const docs = (uid: string) => strapi.documents(uid as any) as any;

  // Fill empty fields of a single type; publish it when it has draft & publish.
  const fillSingle = async (uid: string, data: Record<string, unknown>, publish: boolean) => {
    const existing = await docs(uid).findFirst({ status: 'draft', populate: '*' });
    if (!existing) {
      const created = await docs(uid).create({ data });
      if (publish) await docs(uid).publish({ documentId: created.documentId });
      return;
    }
    const changes: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) if (isEmpty(existing[k])) changes[k] = v;
    if (Object.keys(changes).length === 0) return;
    await docs(uid).update({ documentId: existing.documentId, data: changes });
    if (publish) await docs(uid).publish({ documentId: existing.documentId });
  };

  await fillSingle(UID.bhutanese, BHUTANESE, true);
  await fillSingle(UID.international, INTERNATIONAL, true);
  await fillSingle(UID.page, PAGE, false);

  // ---- Enquiry form: every option goes to the Admission Committee ----
  const settings = await docs(UID.enquiry).findFirst({ populate: ['enquiry_categories'] });
  if (settings) {
    const options = (settings.enquiry_categories ?? []).map(({ id, label, recipient_email }: any) => ({ id, label, recipient_email: recipient_email || ADMISSION_EMAIL }));
    await docs(UID.enquiry).update({
      documentId: settings.documentId,
      data: { enquiry_categories: options, ...(settings.default_recipient_email ? {} : { default_recipient_email: ADMISSION_EMAIL }) },
    });
  }

  // ---- Admission notices that apply to only one group of applicants ----
  const audienceByTitle: Record<string, 'bhutanese' | 'international'> = {
    'Admission into Sherubtse programmes for the Academic Year 2026': 'bhutanese',
    'Second round admissions: BSc in Mathematics (self-financed)': 'bhutanese',
  };
  for (const [title, audience] of Object.entries(audienceByTitle)) {
    for (const status of ['draft', 'published'] as const) {
      const n = await docs(UID.notice).findFirst({ filters: { title: { $eq: title } }, status });
      if (n && (!n.admission_audience || n.admission_audience === 'all')) {
        await strapi.db.query(UID.notice as any).update({ where: { id: n.id }, data: { admission_audience: audience } });
      }
    }
  }

  await strapi.store.set({ ...STORE, value: SEED_VERSION });
}

// ---------------------------------------------------------------------------

const PAGE = {
  subtitle: 'For Bhutanese and international applicants.',
  choose_heading: 'Who’s applying?',
  choose_intro: 'Choose your page — it has everything you need to apply, in one place.',
  dates_heading: 'Key dates — 2026 intake',
  dates_intro: 'Dates for the next intake are announced in Admission Notices.',
  key_dates: [
    { date: '2026-03-01', label: 'Online applications open for Economics & Political Science, Digital Communication & Project Management, and Data Science & Data Analytics', audience: 'bhutanese' },
    { date: '2026-03-15', label: 'Applications close for these three Bachelor programmes', audience: 'bhutanese' },
    { date: '2026-04-15', label: 'Central online application opens for the BSc programmes', audience: 'bhutanese' },
    { date: '2026-04-25', label: 'Special Scholarship in Leadership: last day to apply', audience: 'bhutanese' },
    { date: '2026-04-28', label: 'Data Visualisation Test (DVT)', audience: 'bhutanese' },
    { date: '2026-05-01', label: 'Selection and confirmation by phone (Bachelor programmes)', audience: 'bhutanese' },
    { date: '2026-05-05', label: 'Central online application closes for the BSc programmes', audience: 'bhutanese' },
    { date: '2026-05-29', label: 'Admitted lists published for all programmes', audience: 'all' },
  ],
  notices_heading: 'Admission notices',
  help_heading: 'Still have a question?',
  help_intro: 'Send it to the Admissions team and they will reply by email.',
  labels: {
    card_button: 'See how to apply',
    switch_label: 'Applying as someone else?',
    tab_apply: 'How to Apply',
    tab_requirements: 'Requirements',
    tab_fees: 'Fees',
    tab_scholarships: 'Scholarships',
    tab_notices: 'Notices',
    tab_faqs: 'FAQs',
    tab_more: 'More Info',
    tab_contact: 'Contact',
    documents_heading: 'Documents you need',
    status_open: 'Open now',
    status_upcoming: 'Opens soon',
    status_closed: 'Closed',
    deadline_label: 'Apply by',
    minimum_label: 'Minimum',
    selection_label: 'Selection',
    seats_label: 'Seats',
    links_heading: 'Useful links & forms',
    notices_empty: 'There are no current admission notices.',
    notices_past: 'Past notices',
    notices_all: 'All announcements',
    ask_button: 'Ask a question',
    filter_all: 'Everyone',
    date_next: 'Next',
    date_passed: 'Passed',
    faq_expand: 'Open all',
    faq_collapse: 'Close all',
  },
  seo: {
    title: 'Admissions',
    description: 'How to apply to Sherubtse College — separate guides for Bhutanese and international applicants, with dates, entry requirements, fees and scholarships.',
  },
};

const bachelorSelection =
  'Merit-ranked on subject ability rating points (Maths/B.Maths 5, English 3, Dzongkha 3, any 2 other subjects 1). Shortlisted applicants sit the Data Visualisation Test; final selection is on the DVT merit ranking.';

const BHUTANESE = {
  card_title: 'Bhutanese applicants',
  card_description: 'Class XII graduates applying to an undergraduate programme: dates, entry requirements, fees and scholarships.',
  intro: 'Everything Class XII graduates need to apply to Sherubtse College: when and how to apply, the results you need, what it costs and the scholarships available.',
  key_facts: [
    { label: 'Bachelor programmes (EPS, DCPM, DSDA)', value: 'Apply 1–15 March 2026' },
    { label: 'BSc programmes', value: 'Apply 15 April – 5 May 2026' },
    { label: 'Government scholarship seats', value: '240 in 2026' },
    { label: 'Self-financed tuition', value: 'From Nu. 78,505 a year' },
  ],
  apply_intro: 'There are two ways to apply, depending on the programme. The dates below are for the 2026 intake; dates for the next intake are announced in **Admission Notices**.',
  application_routes: [
    {
      title: 'Bachelor programmes',
      for_programmes: 'Economics & Political Science · Digital Communication & Project Management · Data Science & Data Analytics',
      description: 'Apply directly to the College online. The Office of the Vice Chancellor announces the online application links.',
      opens_on: '2026-03-01',
      closes_on: '2026-03-15',
      steps: lines(
        'Apply online — Apply directly to the College during the application window.',
        'Shortlisting — Eligible applicants are merit-ranked on subject ability rating points: Maths/B.Maths 5, English 3, Dzongkha 3, any 2 other subjects 1.',
        `Check your DVT eligibility — The list of candidates eligible for the Data Visualisation Test is published online. [Check your eligibility](${LINKS.dvtCheck})`,
        'Sit the Data Visualisation Test — Held on 28 April 2026.',
        'Final selection — Based on the DVT merit ranking. Results go to your registered email; selection and confirmation are done by phone.',
      ),
      portal_label: 'Application form',
      portal_url: LINKS.applyBachelor,
    },
    {
      title: 'BSc programmes',
      for_programmes: 'Physics · Chemistry · Mathematics · Life Science',
      description: 'Apply through the central online application.',
      opens_on: '2026-04-15',
      closes_on: '2026-05-05',
      steps: lines(
        'Apply through the central online application — 15 April to 5 May 2026.',
        'Merit ranking — Applicants are ranked on the subject ability rating points for their chosen programme (see Requirements).',
        'Admitted list — The admitted list for each programme is published on the College website.',
      ),
    },
  ],
  requirements_intro: 'The minimum Class XII results for each programme, how applicants are selected, and the seats for 2026.',
  requirements: [
    { programme: 'Bachelor of Economics and Political Science', minimum: 'Class XII pass with at least 50% in Maths/B.Maths.', selection: bachelorSelection, seats: '30 government scholarship · 10 self-financed' },
    { programme: 'Bachelor of Digital Communication and Project Management', minimum: 'Class XII pass with at least 50% in Maths/B.Maths.', selection: bachelorSelection, seats: '30 government scholarship · 10 self-financed' },
    { programme: 'Bachelor of Data Science and Data Analytics', minimum: 'Class XII pass with at least 50% in Maths/B.Maths.', selection: bachelorSelection, seats: '60 government scholarship · 10 self-financed' },
    { programme: 'BSc in Life Science', minimum: 'Class XII science pass with at least 55% in Biology and 45% in Chemistry.', selection: 'Ability rating points: Biology 5, Chemistry 4, Physics 3, English 3, any 1 other subject 1.', seats: '30 government scholarship · 5 self-financed' },
    { programme: 'BSc in Mathematics', minimum: 'Class XII science pass with at least 55% in Maths and 45% each in Chemistry and Physics.', selection: 'Ability rating points: Mathematics 5, Physics 4, Chemistry 3, English 2, any 1 other subject 1.', seats: '30 government scholarship · 5 self-financed' },
    { programme: 'BSc in Chemistry', minimum: 'Class XII science pass with at least 55% in Chemistry and 45% each in Physics and Maths.', selection: 'Ability rating points: Chemistry 5, Physics 4, Mathematics 3, English 2, any 1 other subject 1.', seats: '30 government scholarship · 5 self-financed' },
    { programme: 'BSc in Physics', minimum: 'Class XII science pass with at least 55% in Physics and 45% each in Maths and Chemistry.', selection: 'Ability rating points: Physics 5, Maths 4, Chemistry 3, English 2, any 1 other subject 1.', seats: '30 government scholarship · 5 self-financed' },
  ],
  fees_intro: 'Tuition for the Academic Year 2026–2027, per year.',
  fees: [
    { item: 'Tuition — Arts & Humanities (self-financed)', amount: 'Nu. 78,505', period: 'per year', note: 'Rises 2% a year; excludes hostel rent and mess fees.' },
    { item: 'Tuition — Science (self-financed)', amount: 'Nu. 97,256', period: 'per year', note: 'Rises 2% a year; excludes hostel rent and mess fees.' },
    { item: 'Tuition — Arts & Humanities (government scholarship)', amount: 'Nu. 105,441', period: 'per year', note: 'FY 2026–27 rate of Nu. 103,374 plus 2% increment.' },
    { item: 'Tuition — Science (government scholarship)', amount: 'Nu. 123,465', period: 'per year', note: 'FY 2026–27 rate of Nu. 121,044 plus 2% increment.' },
    { item: 'Security deposit', amount: 'Nu. 5,000', period: 'once, at admission', note: 'Paid by all students. Failure to report or withdrawal will result in penalties.' },
    { item: 'Mess — self-financed students in centrally catered halls', amount: 'Nu. 2,250', period: 'per month', note: 'All Year 1 students live in centrally catered halls, with meals from the common mess.' },
  ],
  fees_note: 'Self-financed tuition is paid annually in **two instalments of 50%** at the beginning of each semester.',
  scholarships: [
    {
      title: 'Special Scholarship in Leadership',
      summary: 'Six scholarships for the 2026 intake: 2 for Bachelor programmes and 4 for BSc programmes.',
      eligibility: lines('Be a regular student in 2025.', 'Have served as School Captain in the academic year 2025.', 'Meet the minimum criteria for the programme.'),
      how_to_apply: `Email ${ADMISSION_EMAIL} with the Leadership Scholarship Form. Merit ranking is on the aggregate of four subjects (English plus three best subjects) for BSc programmes, and on the Data Visualisation Test for Bachelor programmes.`,
      deadline: '2026-04-25',
      link_label: 'Leadership Scholarship Form',
      link_url: LINKS.leadershipForm,
    },
    {
      title: 'Government scholarship',
      summary: 'Every programme has government scholarship seats — 240 in total for 2026 (see Requirements for each programme).',
      eligibility: 'Seats are allocated through the admission process.',
      how_to_apply: 'Students on government scholarship receive a monthly stipend of Nu. 2,500, of which Nu. 250 is deducted as rent. In centrally catered halls (all Year 1 students) no stipend is paid: Nu. 2,250 covers meals and running the mess. In self-catering halls (after Year 1) students are paid Nu. 2,250 and manage their own meals.',
    },
  ],
  faqs: [
    { question: 'When can I apply?', answer: 'For the 2026 intake, the Bachelor programmes (Economics & Political Science, Digital Communication & Project Management, Data Science & Data Analytics) took applications from 1 to 15 March, and the BSc programmes from 15 April to 5 May. Dates for the next intake are announced in Admission Notices.' },
    { question: 'What is the Data Visualisation Test (DVT)?', answer: 'Applicants to the three Bachelor programmes are first merit-ranked on subject ability rating points. Shortlisted applicants then sit the DVT, and the final selection is based on the DVT merit ranking. In 2026 the DVT was held on 28 April.' },
    { question: 'How much is tuition for self-financed students?', answer: 'For 2026–2027: Arts & Humanities Nu. 78,505 and Science Nu. 97,256 a year, rising 2% a year and excluding hostel rent and mess fees. It is paid in two instalments of 50% at the start of each semester.' },
    { question: 'Is there a security deposit?', answer: 'Yes. All students pay Nu. 5,000 during admission. Failure to report or withdrawal will result in penalties.' },
    { question: 'Where will I live?', answer: 'Sherubtse has 20 on-campus residences (10 for female and 10 for male students) with free unlimited Wi-Fi. All Year 1 students live in centrally catered halls with meals from the common mess; after Year 1, students move to self-catering halls.' },
    { question: 'Is there a second round of admissions?', answer: `The College periodically opens a second round of fully self-funded admissions to the BSc in Mathematics for Class XII graduates. Email ${ADMISSION_EMAIL} or call the registration desk on +975 17743555.` },
  ],
  more_info: [
    {
      title: 'Second round admissions',
      body: `Sherubtse College periodically opens a second round of admissions on a full self-funded basis for Class XII graduates for the **BSc in Mathematics**.\n\nApply by email to ${ADMISSION_EMAIL}, or contact the registration desk on +975 17743555. Attach your high school academic transcripts, character certificate and citizenship identity card.`,
    },
    {
      title: 'Admission results and verification',
      body: 'Admission results are published as Admission Notices and sent to your registered email. Results are final and no appeals are entertained. **Admission verification requires original documents.** For queries, contact the Exam Cell.',
    },
  ],
  contacts: [
    { name: 'College Admission Committee', role: 'Applications and admission enquiries', email: ADMISSION_EMAIL, note: 'Including the Leadership Scholarship and second-round admissions.' },
    { name: 'Sonam Dendup', role: 'Dean of Academic Affairs', email: 'daa.sherubtse@rub.edu.bt', phone: '+975 4 535143' },
    { name: 'Exam Cell (Examination & Records)', role: 'Admission results and document verification', email: 'records.sherubtse@rub.edu.bt', phone: '+975 4 535341', note: 'Registration desk: +975 17743555.' },
  ],
  links: [
    { label: 'Browse our programmes', url: '/academics/programmes' },
    { label: 'Academic calendar', url: '/academics/calendar' },
    { label: 'Student Handbook 2024–2025', url: LINKS.handbook },
    { label: 'Official 2026 admission notice', url: SRC.admission },
  ],
};

const INTERNATIONAL = {
  card_title: 'International applicants',
  card_description: 'Applicants from outside Bhutan, including SAARC countries: how to apply, documents, fees and visa help.',
  intro: 'Sherubtse College welcomes international students to its undergraduate programmes. Here is how to apply, what to send, what it costs and who can help with your visa.',
  key_facts: [
    { label: 'How to apply', value: 'Email the Admission Committee' },
    { label: 'Application review', value: 'About one week' },
    { label: 'Tuition — SAARC students', value: 'From Nu. 158,162 a year' },
    { label: 'Tuition — other countries', value: 'From Nu. 316,324 a year' },
  ],
  apply_intro: lines(
    'The application window depends on the programme:',
    '',
    '- **Economics & Political Science, Digital Communication & Project Management, Data Science & Data Analytics:** applications open in March — see Admission Notices for the current year’s dates.',
    '- **All other programmes:** January to the end of June.',
  ),
  application_routes: [
    {
      title: 'Apply to the College Admission Committee',
      for_programmes: 'All undergraduate programmes, Semester Abroad and Short-Term Study Abroad',
      description: 'Send your application form and documents by email.',
      steps: lines(
        `Send your application — Email ${ADMISSION_EMAIL} with your application form and the documents listed below.`,
        'Review — The College Admission Committee reviews your application in about one week.',
        'Decision — You are notified of your application status.',
      ),
      portal_label: 'Email the Admission Committee',
      portal_url: `mailto:${ADMISSION_EMAIL}`,
    },
  ],
  required_documents: lines(
    `Application form — [Annexure A](${LINKS.annexA}) (award-bearing programmes), [Annexure B](${LINKS.annexB}) (Semester Abroad) or [Annexure C](${LINKS.annexC}) (Short-Term Study Abroad)`,
    `Letters of recommendation — from academic or professional references ([Annexure D](${LINKS.annexD}))`,
    `Statement of Purpose — [Annexure E](${LINKS.annexE})`,
    'Passport — valid for the study duration',
    'Valid travel and medical insurance',
    'Academic transcripts and certificates — verified by the awarding institution, in English or with official English translations',
    'English language test scores — only if the medium of instruction at your previous school was not English',
    'Passport-sized photograph',
    'Proof of financial means',
  ),
  requirements_intro: 'To be eligible for admission, international students must have completed secondary education at a recognised institution, have a strong academic record, and be proficient in English.',
  requirements: [
    {
      programme: 'All undergraduate programmes',
      minimum: 'Secondary education completed at a recognised institution, with a strong academic record.',
      selection: 'If the medium of instruction at your previous school was not English, you may need to submit English language test scores. Transcripts and certificates must be verified by the awarding institution and be in English or officially translated.',
    },
  ],
  fees_intro: 'Tuition for the Academic Year 2026–2027.',
  fees: [
    { item: 'Tuition — Arts & Humanities (SAARC students)', amount: 'Nu. 158,162', period: 'per year', note: '1.5 times the government scholarship rate.' },
    { item: 'Tuition — Science (SAARC students)', amount: 'Nu. 185,198', period: 'per year', note: '1.5 times the government scholarship rate.' },
    { item: 'Tuition — Arts & Humanities (other countries)', amount: 'Nu. 316,324', period: 'per year', note: 'Three times the government scholarship rate.' },
    { item: 'Tuition — Science (other countries)', amount: 'Nu. 370,396', period: 'per year', note: 'Three times the government scholarship rate.' },
    { item: 'Semester Abroad / Visiting Research Student (under 6 months)', amount: 'US$3,533' },
    { item: 'Short-term study abroad, 1–3 weeks', amount: 'US$2,208' },
    { item: 'Short-term study abroad, 3–6 weeks', amount: 'US$2,781' },
    { item: 'Security deposit', amount: 'Nu. 5,000', period: 'once, at admission', note: 'Paid by all students.' },
  ],
  fees_note: 'Rates follow the RUB Tuition Fee Policy and Guidelines 2025.',
  faqs: [
    { question: 'How do I apply?', answer: `Email your application form and documents to the College Admission Committee at ${ADMISSION_EMAIL}. The committee reviews applications in about one week and notifies you of your status.` },
    { question: 'Which application form do I use?', answer: 'Annexure A for award-bearing (degree) programmes, Annexure B for Semester Abroad, and Annexure C for Short-Term Study Abroad. All are Royal University of Bhutan forms — see the Documents section of How to Apply.' },
    { question: 'Do I need an English test?', answer: 'Only if the medium of instruction at your previous school was not English — then you may need to submit English language test scores.' },
    { question: 'What tuition do international students pay?', answer: 'For undergraduate programmes in 2026–27: SAARC students pay Nu. 158,162 (Arts & Humanities) or Nu. 185,198 (Science) a year; students from other countries pay Nu. 316,324 or Nu. 370,396.' },
    { question: 'Can the College help with my visa?', answer: 'Yes. The Office of the Dean of Research and Industrial Linkages (DRIL) helps with the visa application. Contact the Liaison Officer at lo.sherubtse@rub.edu.bt.' },
    { question: 'Where will I live?', answer: 'Sherubtse has 20 on-campus residences (10 for female and 10 for male students) with free unlimited Wi-Fi.' },
  ],
  more_info: [
    {
      title: 'Visa',
      body: `The Office of the Dean of Research and Industrial Linkages (DRIL) can help you with the visa application process. Contact the Liaison Officer at **lo.sherubtse@rub.edu.bt**, or see [RUB International Relations](${LINKS.rubIntl}).`,
    },
    {
      title: 'Accommodation and student life',
      body: `Sherubtse has 20 on-campus residences (10 female and 10 male) with free unlimited Wi-Fi. The College also offers a Happiness & Well-being Center, student organisations and clubs, and sports and recreational facilities. See the [Student Handbook](${LINKS.handbook}) for a full overview of student life.`,
    },
  ],
  contacts: [
    { name: 'College Admission Committee', role: 'Applications and admission enquiries', email: ADMISSION_EMAIL },
    { name: 'Liaison Officer', role: 'Office of the Dean of Research & Industrial Linkages', email: 'lo.sherubtse@rub.edu.bt', note: 'Help with the visa application process.' },
  ],
  links: [
    { label: 'Application form — award-bearing programmes (Annexure A)', url: LINKS.annexA },
    { label: 'Application form — Semester Abroad (Annexure B)', url: LINKS.annexB },
    { label: 'Application form — Short-Term Study Abroad (Annexure C)', url: LINKS.annexC },
    { label: 'Reference report form (Annexure D)', url: LINKS.annexD },
    { label: 'Statement of Purpose (Annexure E)', url: LINKS.annexE },
    { label: 'RUB International Relations', url: LINKS.rubIntl },
    { label: 'Eligibility & application process (official page)', url: SRC.intl },
  ],
};
