import type { Core } from '@strapi/strapi';
import { applyAdminHelp, type HelpMap } from './admin-help';

/**
 * Research landing page (/research): one-time starting content and admin help.
 *
 * Sources (read 18 Oct 2026):
 *   www.sherubtse.edu.bt/res/  (centres, facilities, projects; updated 23 Jul 2026)
 *   www.sherubtse.edu.bt/annual-college-research-grant/  (ACRG; 20 May 2026)
 *   www.sherubtse.edu.bt/annual-college-research-grant-acrg/  (ACRG reports; 3 Jan 2024)
 *   www.sherubtse.edu.bt/sherubtse-thorim-lobra-research-grant/  (STLRG; 20 May 2026)
 *   www.sherubtse.edu.bt/centre-for-*  (centre profiles; 8 Nov 2024)
 *   jr.sherubtse.edu.bt  (Sherub Doenme, Vol. 19, published 26 May 2026)
 *   www.rub.edu.bt/research/, /aurg/, /ref/  (RUB research support and grants)
 * Projects are imported separately from the official projects table.
 * Runs once per SEED_VERSION and only fills fields that are still empty.
 */

const SEED_VERSION = 2;
const STORE = { type: 'core', name: 'seeds', key: 'research_version' } as const;
const OVERVIEW = 'api::research-overview.research-overview';
const CENTRE = 'api::research-centre.research-centre';

const isEmpty = (v: unknown) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
const JR = 'https://jr.sherubtse.edu.bt/index.php/sd';
const UP = 'https://www.sherubtse.edu.bt/wp-content/uploads';
const RUB = 'https://www.rub.edu.bt/wp-content/uploads/2026/07';

export async function ensureResearchContent({ strapi }: { strapi: Core.Strapi }) {
  const done = Number(await strapi.store.get(STORE)) || 0;
  if (done < SEED_VERSION) {
    await seed(strapi);
    await strapi.store.set({ ...STORE, value: SEED_VERSION });
  }
  await applyAdminHelp({
    strapi,
    help: HELP,
    prefixes: ['content_types::api::research-overview', 'content_types::api::research-project', 'components::research.'],
    storeKey: 'research_main_fields_set',
  });
}

async function seed(strapi: Core.Strapi) {
  const docs = (uid: string) => strapi.documents(uid as any) as any;

  // ---- Centres: only the three with current official profiles are featured ----
  const CENTRES: Record<string, any> = {
    'centre-for-science-and-environmental-research': {
      acronym: 'CSER',
      summary: 'Builds research capacity in environmental science, provides environmental data and water-quality analysis, and shares findings with policy-making bodies.',
      themes: 'Hydrological studies\nFreshwater ecology\nAir pollution\nWetland ecosystem services',
      display_order: 1,
    },
    'centre-for-population-and-development-studies': {
      acronym: 'CPDS',
      summary: 'Interdisciplinary research on population change, socio-economic development and human health, aimed at informing social, economic and development policy.',
      themes: 'Population, development & health\nEconomic growth and poverty\nSocial change and development\nPolicy and programme evaluation\nGovernance',
      display_order: 2,
    },
    'centre-for-climate-change-and-spatial-information': {
      acronym: 'CCCSI',
      summary: 'Collects, creates and shares spatial data and information, and conducts research on climate change, resources and socio-economic development.',
      themes: 'Land use and land cover\nCryosphere\nDisaster\nSustainable development\nUrbanisation, migration and demographic transition\nGeospatial techniques',
      display_order: 3,
    },
  };
  for (const [slug, fill] of Object.entries(CENTRES)) {
    const c = await docs(CENTRE).findFirst({ status: 'draft', filters: { slug } });
    if (!c) continue;
    const data: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fill)) if (isEmpty(c[k]) || (k === 'display_order' && !c[k])) data[k] = v;
    if (!c.is_featured) data.is_featured = true;
    if (Object.keys(data).length) {
      await docs(CENTRE).update({ documentId: c.documentId, data });
      await docs(CENTRE).publish({ documentId: c.documentId });
    }
  }
  const cser = (await docs(CENTRE).findFirst({ status: 'published', filters: { slug: 'centre-for-science-and-environmental-research' } }))?.documentId;

  // ---- Landing page ----
  const page = await docs(OVERVIEW).findFirst({ populate: '*' });
  if (!page) return;
  const file = async (name: string) => strapi.db.query('plugin::upload.file').findOne({ where: { name } });
  const hero = await file('sherubtse-news-physics-without-frontiers-group.jpg');
  const office = await docs('api::contact-person.contact-person').findFirst({ status: 'published', filters: { group_title: { $eqi: 'Research & Industrial Linkages' } } });
  const stories: string[] = [];
  for (const title of [
    'CERN Science Workshop Inspires Sherubtse College Physics Students',
    'Workshop on Generative Artificial Intelligence in Teaching and Learning',
    'Training Workshop on Grant Proposal Writing',
    'Sherubtse College Hosts Research Workshop and Guest Lectures on AI, Financial Literacy, and Socio-Political Theories',
    'Workshop on Symmetries, Data Science and AI for Physicists',
  ]) {
    const n = await docs('api::news.news').findFirst({ status: 'published', filters: { title: { $eq: title } } });
    if (n) stories.push(n.documentId);
  }

  const DATA: Record<string, unknown> = {
    heading: 'Research at Sherubtse',
    intro: 'Research at Sherubtse College advances knowledge, encourages interdisciplinary collaboration, and addresses issues relevant to Bhutan and the wider world. Through academic inquiry, research partnerships, and practical investigation, the College supports evidence-based understanding and meaningful contributions to society.',
    ...(hero ? { hero_image: hero.id, hero_image_alt: hero.alternativeText || '' } : {}),
    hero_buttons: [
      { label: 'Explore Research Centres', url: '#centres' },
      { label: 'Discover Research Projects', url: '#projects' },
      { label: 'Browse Publications', url: '#journal' },
    ],
    expertise_heading: 'Expertise Directory',
    expertise_text: 'Find Sherubtse faculty by name, department, specialisation or research area.',
    expertise_link: { label: 'Search the directory', url: '/about/faculty' },
    centres_heading: 'Research Centres & Expertise',
    centres_intro: 'The College’s research centres, each with its own focus areas.',
    projects_heading: 'Research in Action',
    projects_intro: 'Projects funded through the Annual College Research Grant and by national and international partners, as listed by the College.',
    journal_heading: 'Journals & Publications',
    journal: {
      name: 'Sherub Doenme: The Research Journal of Sherubtse College',
      description: 'Sherub Doenme is Sherubtse College’s open-access, peer-reviewed research journal. Published annually in print and online, it features original research papers, review articles, and short communications across the natural and social sciences.',
      issn_print: '1027-0922',
      issn_online: '2308-5452',
      current_issue: 'Vol. 19 (2026)',
      current_issue_date: '2026-05-26',
      links: [
        { label: 'Read the journal', url: JR, file_type: 'page' },
        { label: 'Current issue', url: `${JR}/issue/current`, file_type: 'page' },
        { label: 'Aims and scope', url: `${JR}/aimsscope`, file_type: 'page' },
        { label: 'Manuscript guidelines', url: `${JR}/MS`, file_type: 'page' },
        { label: 'Make a submission', url: `${JR}/about/submissions`, file_type: 'page' },
        { label: 'Published issues', url: `${JR}/issue/archive`, file_type: 'page' },
      ],
      articles: [
        { title: 'Assessment of Forest Health Using Epiphytic Lichen Diversity Across Different Forest Ecosystems in Chhoekhor Gewog, Bumthang District, Bhutan', authors: 'Pema Choyang, Nythri Tshering', url: `${JR}/article/view/188` },
        { title: 'Comparative Forecasting of Bhutanese Stock Using Statistical, Machine Learning, and Deep Learning Models', authors: 'Ugyen Samdrup Tshering', url: `${JR}/article/view/173` },
        { title: 'Generative AI at Sherubtse College: Innovation vs. Academic Integrity', authors: 'Pranita Homagai', url: `${JR}/article/view/158` },
        { title: 'Unlocking Digital Resilience: A Feasibility Study on Open-Source Software Adoption at the Royal University of Bhutan', authors: 'Younten Tshering, Tashi Tobgay, Tashi Yangchen, Tashi Wangchuk, Karma Jigme Wangchuk', url: `${JR}/article/view/176` },
        { title: 'Ecological Consciousness in Joy Harjo’s Poet Warrior: Activism and Pedagogy', authors: 'Sangay Choden, Meredith E. Abarca', url: `${JR}/article/view/183` },
        { title: 'The Morung System: Naga Traditional Education and its Present Status', authors: 'Adangla Changkija, Temjennaro Jamir', url: `${JR}/article/view/192` },
      ],
    },
    grants_heading: 'Research Grants & Funding',
    grants_intro: 'College research grants with their official forms, and Royal University of Bhutan funding. Calls for proposals are announced in News & Notices.',
    grants: [
      {
        name: 'Annual College Research Grant', acronym: 'ACRG', level: 'college',
        description: 'Supports faculty research through the College’s Annual College Research Fund and encourages the development of research skills, collaboration, and scholarly output.',
        documents: [
          { label: 'ACRG guidelines', url: `${UP}/2024/11/ACRG-Guidelines_Sherubtse-College-compressed.pdf`, file_type: 'pdf' },
          { label: 'Application form', url: `${UP}/2024/11/Annual-College-Research-Grant-ACRG-Application-Form.docx`, file_type: 'docx' },
          { label: 'Proposal evaluation form', url: `${UP}/2024/11/Research-Proposal-Evaluation-Form-ACRG.docx`, file_type: 'docx' },
          { label: 'Progress report form', url: `${UP}/2024/11/Progress-Report-Form-ACRG.docx`, file_type: 'docx' },
          { label: 'Project completion report form', url: `${UP}/2024/11/Project-Completion-Report-Form-ACRG.docx`, file_type: 'docx' },
          { label: 'Final project report structure', url: `${UP}/2024/11/Final-Project-Report-Structure.docx`, file_type: 'docx' },
          { label: 'Recommendation for grant application', url: `${UP}/2026/05/Recommendation-for-Grant-Application_Master-Copy.docx`, file_type: 'docx' },
          { label: 'ACRG report 2018–2019', url: `${UP}/2024/01/ARCG-2018-2019-Report_compressed-1.pdf`, file_type: 'pdf' },
          { label: 'ACRG report 2019–2020', url: `${UP}/2024/01/ARCG-2019-2020-Report_compressed.pdf`, file_type: 'pdf' },
          { label: 'ACRG report 2020–2021', url: `${UP}/2024/01/ACRG-2020-2021-report_compressed.pdf`, file_type: 'pdf' },
          { label: 'GoI-PTA research project reports', url: `${UP}/2024/01/Research-Project-Reports-GOI-PTA_compressed-compressed.pdf`, file_type: 'pdf' },
        ],
      },
      {
        name: 'Sherubtse Thorim Lobdra Research Grant', acronym: 'STLRG', level: 'college',
        description: 'Supports collaborative research and innovation in designated priority areas, including data analytics, digital literacy, project management, green economics, and STEM education.',
        focus_areas: 'Big Data technologies\nData modelling and analytics\nBusiness intelligence\nRisk management\nDigital literacy\nProject management\nGreen economics\nSTEM education',
        documents: [
          { label: 'STLRG guidelines (2025)', url: `${UP}/2025/08/Sherubtse-Thorim-Lobdra-Research-Grant-Guidelines-Final-2025.pdf`, file_type: 'pdf' },
          { label: 'Application form', url: `${UP}/2025/07/Annexure-I_Sherubtse-Thorim-Lobdra-Research-Grantt-Application-Form.docx`, file_type: 'docx' },
          { label: 'Evaluation form', url: `${UP}/2025/07/Annexure-II_Sherubtse-Thorim-Lobdra-Research-Grant-Evaluation-form.docx`, file_type: 'docx' },
          { label: 'Progress report form', url: `${UP}/2025/07/Progress-Report-Form-Sherubtse-Thorim-Lobdra-Research-Grant.docx`, file_type: 'docx' },
          { label: 'Final project report structure', url: `${UP}/2025/07/Final-Project-Report-Structure.docx`, file_type: 'docx' },
          { label: 'Recommendation for grant application', url: `${UP}/2026/05/Recommendation-for-Grant-Application_Master-Copy.docx`, file_type: 'docx' },
        ],
      },
      {
        name: 'Annual University Research Grant', acronym: 'AURG', level: 'university',
        description: 'A competitive Royal University of Bhutan grant, administered annually by the Department of Academic Affairs and Research and awarded through merit-based, peer-reviewed processes.',
        documents: [
          { label: 'AURG page (RUB)', url: 'https://www.rub.edu.bt/aurg/', file_type: 'page' },
          { label: 'AURG 2026', url: `${RUB}/ANNUAL-UNIVERSITY-RESEARCH-GRANT-2026.docx`, file_type: 'docx' },
          { label: 'Application form', url: `${RUB}/Annexure-1-AURG-APPLICATION-FORM-2022-1.docx`, file_type: 'docx' },
          { label: 'Evaluation form', url: `${RUB}/Annexure-2-AURG-EVALUATION-FORM-2022-1.docx`, file_type: 'docx' },
          { label: 'Project completion form', url: `${RUB}/Annexure-4-5-AURG-COMPLETION-FORM-2022-1.docx`, file_type: 'docx' },
        ],
      },
      {
        name: 'Research Endowment Fund', acronym: 'REF', level: 'university',
        description: 'A fund approved by the Royal Government of Bhutan, with the Royal University of Bhutan as interim Secretariat. Research themes are announced each year by the REF Board.',
        documents: [
          { label: 'REF page (RUB)', url: 'https://www.rub.edu.bt/ref/', file_type: 'page' },
          { label: 'REF implementation guidelines 2024', url: `${RUB}/REF-Implementation-Guidelines-2024.docx`, file_type: 'docx' },
        ],
      },
    ],
    facilities_heading: 'Research Facilities & Collaboration',
    facilities_intro: 'Research instruments and facilities documented at the Centre for Science and Environmental Research.',
    facilities: [
      { name: 'Water Chemistry Laboratory', summary: 'Monitors pH, dissolved oxygen and nutrients in surface and groundwater, and analyses pollutants such as heavy metals, pesticides and microplastics.' },
      { name: 'Stable isotope analyser (Picarro L2130-i)', summary: 'δ¹⁸O and δ²H analysis for tracing water sources, precipitation patterns, groundwater recharge and evapotranspiration.' },
      { name: 'Ion chromatography (Metrohm 930 Compact IC)', summary: 'Measures cations and anions such as calcium, nitrate and sulfate, for research on groundwater contamination, wastewater treatment and nutrient cycling.' },
      { name: 'Molecular biology and microbiology equipment', summary: 'A benchtop centrifuge, gel electrophoresis, a laminar airflow cabinet, an autoclave, hot air ovens and a stereo zoom microscope for molecular, cell and microbiological work.' },
      { name: 'Weather station', summary: 'Records temperature, humidity, pressure, wind, rainfall and solar radiation, supporting climate, agricultural and environmental research.' },
      { name: 'GIS and remote sensing', summary: 'Collects, analyses and visualises spatial data and satellite imagery to track land-use change, climate impacts, natural disasters and water resources.' },
    ].map((f) => ({ ...f, ...(cser ? { centre: cser } : {}), link_label: 'Centre for Science & Environmental Research' })),
    collaboration_heading: 'Collaborate with us',
    collaboration_text: 'Researchers and institutions interested in joint research or partnerships with Sherubtse College can contact the Office of the Dean of Research and Industrial Linkages.',
    ...(office ? { collaboration_office: office.documentId } : {}),
    policies_heading: 'Research Policies & Guidelines',
    policies_intro: 'Official guidance for research, grants and publication.',
    policies: [
      { title: 'Research support and ethics clearance (RUB)', description: 'The Royal University of Bhutan provides research policy guidance and facilitates proposal reviews, ethics clearances, training and mentorship.', url: 'https://www.rub.edu.bt/research/', source: 'Royal University of Bhutan', file_type: 'page' },
      { title: 'Sherub Doenme publication policies', description: 'Peer review (double-blind), copyright and conflict-of-interest policies for the College journal.', url: `${JR}/policy`, source: 'Sherub Doenme', file_type: 'page' },
      { title: 'Manuscript guidelines', description: 'How to prepare a manuscript, including the cover letter, copyright transfer, conflict-of-interest and ethical compliance forms.', url: `${JR}/MS`, source: 'Sherub Doenme', file_type: 'page' },
      { title: 'ACRG guidelines', description: 'Rules for applying for, running and reporting on an Annual College Research Grant.', url: `${UP}/2024/11/ACRG-Guidelines_Sherubtse-College-compressed.pdf`, source: 'Sherubtse College', file_type: 'pdf' },
      { title: 'STLRG guidelines (2025)', description: 'Guidelines for the Sherubtse Thorim Lobdra Research Grant.', url: `${UP}/2025/08/Sherubtse-Thorim-Lobdra-Research-Grant-Guidelines-Final-2025.pdf`, source: 'Sherubtse College', file_type: 'pdf' },
      { title: 'REF implementation guidelines 2024', description: 'How Research Endowment Fund proposals are submitted, evaluated and reported.', url: `${RUB}/REF-Implementation-Guidelines-2024.docx`, source: 'Royal University of Bhutan', file_type: 'docx' },
    ],
    news_heading: 'Research News & Opportunities',
    news_intro: 'Workshops, seminars and research activities at the College.',
    news_stories: stories,
    labels: LABELS,
    seo: { title: 'Research', description: 'Research at Sherubtse College: research centres, projects, the Sherub Doenme journal, research grants, facilities and guidelines.' },
  };

  const changes: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(DATA)) if (isEmpty(page[k])) changes[k] = v;
  // Labels added in later versions.
  if (page.labels) {
    const missing = Object.entries(LABELS).filter(([k]) => isEmpty(page.labels[k]));
    if (missing.length) changes.labels = { ...page.labels, ...Object.fromEntries(missing) };
  }
  // The old placeholder title and the five cards that pointed at pages that never existed.
  if (page.heading === 'Research') changes.heading = DATA.heading;
  const deadCards = ['/research/expertise', '/research/journals', '/research/grants', '/research/ethics'];
  if ((page.cards ?? []).some((c: any) => deadCards.includes(c.url))) changes.cards = CARDS;
  if (page.intro === 'Centres, grants, journals and the staff expertise behind Sherubtse’s research output.') changes.intro = DATA.intro;
  if (Object.keys(changes).length) await docs(OVERVIEW).update({ documentId: page.documentId, data: changes });
}

const CARDS = [
  { label: 'Research Centres', url: '#centres', description: 'Three centres for environmental, population and development, and spatial research.', icon: 'centres' },
  { label: 'Research Projects', url: '#projects', description: 'College-funded and externally funded projects by Sherubtse researchers.', icon: 'projects' },
  { label: 'Journals & Publications', url: '#journal', description: 'Sherub Doenme, the College’s open-access, peer-reviewed journal.', icon: 'journal' },
  { label: 'Grants & Funding', url: '#grants', description: 'ACRG and STLRG guidelines and forms, and RUB research funding.', icon: 'grants' },
  { label: 'Research Facilities', url: '#facilities', description: 'Laboratories, instruments and spatial-data facilities.', icon: 'facilities' },
  { label: 'Policies & Guidelines', url: '#policies', description: 'Ethics clearance, publication policies and grant guidelines.', icon: 'policies' },
  { label: 'News', url: '#news', description: 'Research workshops, seminars and activities.', icon: 'news' },
];

const LABELS = {
  explore_centre: 'Explore centre',
  themes: 'Research themes',
  pi: 'Principal investigator',
  co_investigators: 'Co-investigators',
  funding: 'Funding',
  period: 'Period',
  budget: 'Budget',
  status_ongoing: 'Ongoing',
  status_completed: 'Completed',
  status_unconfirmed: 'Status not confirmed',
  tab_ongoing: 'Ongoing',
  tab_completed: 'Completed',
  view_all_projects: 'View all research projects',
  documents: 'Documents',
  read_more: 'Read more',
  contact: 'Contact',
  deadline: 'Deadline',
  status_open: 'Open',
  status_closed: 'Closed',
  issn_print: 'Print ISSN',
  issn_online: 'Online ISSN',
  current_issue: 'Current issue',
  college_grants: 'College grants',
  university_grants: 'Royal University of Bhutan funding',
  on_this_page: 'On this page',
  listed_projects: 'listed projects',
  externally_funded: 'externally funded',
  all_news: 'All news',
  all_centres: 'All centres',
  all_funding: 'All funding',
  search_projects: 'Search projects, investigators or funders',
  no_results: 'No projects match these filters.',
  show_all: 'All',
};

const HELP: HelpMap = {
  'content_types::api::research-overview.research-overview': {
    fields: {
      heading: 'Page title, e.g. “Research at Sherubtse”.',
      intro: 'Introduction under the title (two or three sentences).',
      hero_image: 'A campus or research photograph.',
      hero_image_alt: 'Describe the photograph for screen readers.',
      hero_buttons: 'Up to three buttons. Use #centres, #projects, #journal, #grants, #facilities, #policies or #news to jump to a section.',
      cards: 'Quick links under the hero. Every card needs a working link (a #section or a page).',
      expertise_link: 'Where the Expertise Directory banner goes (the faculty directory). Leave empty to hide the banner.',
      projects_limit: 'How many projects to show in each tab. All projects are on /research/projects.',
      journal: 'The College journal: description, ISSNs, current issue, links and a few current articles.',
      grants: 'Research grants with their official documents. Set “Status” to open/closed only with an official announcement.',
      facilities: 'Documented laboratories and equipment only.',
      collaboration_office: 'Office shown in the collaboration box (from Contact – Offices).',
      policies: 'Only documents with a genuine official source.',
      news_stories: 'Research stories from News, in this order. Leave empty to hide the section.',
      labels: 'Small fixed words on the Research pages.',
    },
  },
  'content_types::api::research-centre.research-centre': {
    fields: {
      acronym: 'e.g. “CSER”.',
      summary: 'One or two sentences for the Research page card.',
      themes: 'Research themes, one per line.',
      logo: 'Centre logo or a photograph.',
      is_featured: 'Show on the Research page (only centres with a current official profile).',
      display_order: 'Lower numbers appear first.',
    },
  },
  'content_types::api::research-project.research-project': {
    mainField: 'title',
    fields: {
      centre: 'Research centre (leave empty if the centre has no profile, and type its name in “Centre label”).',
      centre_label: 'Only when the centre is not in Research – Centres, e.g. “CAHR”.',
      funding_type: 'College grant (ACRG/STLRG), national or international funding.',
      funding_source: 'As published, e.g. “ACRG”, “BTFEC”, “Erasmus”.',
      budget: 'As published, e.g. “Nu. 175,450”.',
      period_label: 'Only when exact dates are not known, e.g. “2021–2027”.',
      listed_status: 'Status as listed by the College. A project listed as ongoing whose end date has passed is shown as “Status not confirmed”.',
      summary: 'Short factual summary (optional).',
      is_featured: 'Show first on the Research page.',
      source_note: 'Where this record comes from (not shown).',
    },
  },
  'components::research.grant': {
    mainField: 'name',
    fields: { status: '“not_shown” unless an official announcement says the call is open or closed.', deadline: 'Only from an official announcement.', announcement_url: 'Link to that announcement.', focus_areas: 'One per line.' },
  },
  'components::research.facility': { mainField: 'name', fields: { summary: 'One or two sentences on what it supports.' } },
  'components::research.resource': { mainField: 'title', fields: { source: 'e.g. “Royal University of Bhutan”.' } },
  'components::research.doc-link': { mainField: 'label', fields: {} },
  'components::research.journal-article': { mainField: 'title', fields: {} },
};
