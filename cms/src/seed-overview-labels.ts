import type { Core } from '@strapi/strapi';
import { applyAdminHelp, type HelpMap } from './admin-help';

/**
 * Overview pages → Labels: the small wording around the landing pages' facts,
 * live figures and boxes (About and Academics). {count} is filled in by the
 * website from live Strapi data, so it never goes stale. Each type's labels
 * are added once; any label an admin edits is kept.
 */
export const ABOUT_LABELS = {
  founded_label: 'Founded',
  founded_value: '1968',
  campus_label: 'Campus',
  campus_value: 'Kanglung, Trashigang',
  affiliation_label: 'Affiliation',
  affiliation_value: 'Royal University of Bhutan',
  years_label: 'Years of academic legacy',
  stat_faculty: 'Faculty members',
  stat_programmes: 'Programmes',
  stat_facilities: 'Campus facilities',
  stat_units: 'Offices',
  meta_faculty: '{count} faculty profiles',
  meta_facilities: '{count} facilities',
  meta_units: '{count} offices',
  meta_history: 'Since 1968',
  explore_label: 'Explore',
};

export const ACADEMICS_LABELS = {
  showcase_heading: 'Our programmes',
  showcase_all: 'See all programmes',
  departments_heading: 'Explore by department',
  department_programmes: '{count} programmes',
  department_faculty: '{count} faculty',
  stat_departments: 'Departments',
  stat_programmes: 'Programmes',
  stat_faculty: 'Faculty members',
  stat_dates: 'Upcoming dates',
  calendar_heading: 'Coming up on the academic calendar',
  calendar_all: 'Full calendar',
  meta_departments: '{count} departments',
  meta_programmes: '{count} programmes',
  meta_calendar: '{count} upcoming dates',
  explore_label: 'Explore',
};

export const NEWS_NOTICES_LABELS = {
  top_stories: 'Top stories',
  read_story: 'Read the story',
  all_news: 'All news',
  pause_stories: 'Pause stories',
  play_stories: 'Play stories',
  board_heading: 'Notice board',
  board_intro: 'The latest announcements, vacancies and results.',
  board_all: 'All announcements',
  board_empty: 'There are no current notices.',
  pinned_label: 'Pinned',
  closes_label: 'Closes',
  live_notices: '{count} current notices',
  live_vacancies: '{count} open vacancies',
  live_downloads: '{count} forms & documents',
  meta_announcements: '{count} current',
  meta_news: '{count} stories',
  meta_recruitment: '{count} open',
  meta_downloads: '{count} documents',
  explore_label: 'Explore',
  // Used when the count is exactly 1.
  live_notices_one: '1 current notice',
  live_vacancies_one: '1 open vacancy',
  live_downloads_one: '1 form or document',
  meta_news_one: '1 story',
  meta_downloads_one: '1 document',
};

/** About – The College (leadership page): wording around the President and the Deans. */
export const ABOUT_COLLEGE_LABELS = {
  president_heading: 'President',
  deans_heading: 'Deans',
  directors_heading: 'Directors and heads',
  team_heading: 'The leadership team',
  team_intro: 'The President and the Deans guide the College’s academic programmes, student life, research and partnerships.',
  contact_label: 'Contact office',
  meet_label: 'Meet the team',
  more_heading: 'Continue exploring',
  initials_label: 'Portrait of {name}',
};

/** About – History Page: the small wording around the sections. {count} and {year} are filled in automatically. */
export const HISTORY_LABELS = {
  years_label: '{count} years of learning',
  since_label: 'Since {year}',
  scroll_label: 'Read our story',
  nav_label: 'Chapters',
  nav_story: 'Founding',
  nav_people: 'The founders',
  nav_timeline: 'Milestones',
  nav_gallery: 'Gallery',
  nav_motto: 'Motto',
  nav_legacy: 'Legacy',
  nav_traditions: 'Traditions',
  nav_video: 'Documentary',
  story_eyebrow: 'Founding Story',
  story_heading: 'How It Began',
  king_eyebrow: 'Vision of the Third King',
  king_heading: 'His Majesty Jigme Dorji Wangchuck',
  mackey_eyebrow: 'Founding Principal',
  timeline_eyebrow: 'Historical Timeline',
  timeline_heading: 'Milestones',
  gallery_eyebrow: 'Heritage Gallery',
  gallery_heading: 'Moments from Our History',
  gallery_all: 'All',
  gallery_filter_label: 'Filter photos by category',
  motto_eyebrow: 'Motto & Identity',
  meaning_label: 'What it means',
  emblem_label: 'The Emblem',
  values_label: 'Our Values',
  legacy_eyebrow: 'Legacy & Achievements',
  legacy_heading: 'Our Legacy',
  traditions_eyebrow: 'Traditions & Culture',
  traditions_heading: 'Living Traditions',
  video_eyebrow: 'Documentary',
  video_heading: 'Watch Our Story',
  brochure_heading: 'Download the Heritage Brochure',
  brochure_text: 'A printable keepsake of Sherubtse College’s history, milestones and legacy.',
  brochure_button: 'Download Brochure',
};

/** About – Faculty Page: the wording of the directory. {count} is filled in automatically. */
export const FACULTY_LABELS = {
  wall_label: 'Faculty of Sherubtse College',
  stat_faculty: 'Faculty members',
  stat_departments: 'Departments',
  stat_students: 'Students',
  stat_papers: 'Research papers',
  search_placeholder: 'Search by name, subject or position',
  search_label: 'Search faculty',
  all_label: 'All',
  sort_label: 'Sort by',
  sort_department: 'Department',
  sort_experience: 'Experience',
  sort_name: 'Name (A–Z)',
  sort_position: 'Position',
  view_label: 'View',
  view_grid: 'Cards',
  view_list: 'List',
  more_filters: 'More filters',
  fewer_filters: 'Fewer filters',
  position_label: 'Position',
  level_label: 'Highest qualification',
  level_phd: 'PhD',
  level_master: 'Master’s',
  level_bachelor: 'Bachelor’s',
  research_label: 'Research areas',
  random_label: 'Meet someone new',
  clear_label: 'Clear all',
  count_one: '{count} faculty member',
  count_many: '{count} faculty members',
  heads_eyebrow: 'Leadership',
  heads_heading: 'Department Heads',
  directory_eyebrow: 'Directory',
  directory_heading: 'All Faculty Members',
  department_page: 'Department page',
  profile_label: 'View profile',
  empty_message: 'No faculty members match these filters.',
  other_label: 'Other',
};
/** Alumni – Page: navigation, topic cards and sub-page titles. {count} is filled in automatically. */
export const ALUMNI_LABELS = {
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

/** About – Administrative Units: group names and the small wording. {count} is filled in automatically. */
export const UNITS_LABELS = {
  all_label: 'All',
  search_label: 'Search offices, units and people',
  search_placeholder: 'Search offices, units and people',
  count_one: '{count} office or unit',
  count_many: '{count} offices and units',
  clear_label: 'Clear search',
  open_label: 'Explore',
  stat_total: 'Offices and units',
  stat_areas: 'Areas of work',
  group_admin: 'Administrative offices',
  group_academic: 'Academic departments',
  group_research: 'Research centres',
  group_services: 'Library, labs and services',
  group_student: 'Student bodies',
  members_label: '{count} faculty members',
  head_label: 'Head',
  department_head: 'Head of Department',
  clubs_title: 'Clubs and societies',
  clubs_text: 'Student clubs and societies that run under the Student Association.',
  clubs_count: '{count} clubs',
};

/** Academics – Departments Page: hero text and wording. {count} is filled in automatically. */
export const DEPARTMENTS_HERO = {
  hero_eyebrow: 'Academics',
  hero_heading: 'Explore Our Departments',
  hero_intro: 'Three departments carry Sherubtse College’s undergraduate teaching, each with its own faculty, programmes and academic character. Start with the department closest to what you want to study.',
};
export const DEPARTMENTS_LABELS = {
  orbit_label: 'Departments of Sherubtse College',
  stat_departments: 'Academic departments',
  stat_programmes: 'Programmes',
  stat_faculty: 'Faculty members',
  stat_years: 'Years since founding, 1968',
  panels_eyebrow: 'The departments',
  panels_heading: 'Our {count} departments',
  panels_hint: 'Hover over a department, or tap it on a phone, to open it.',
  heads_eyebrow: 'Leadership',
  heads_heading: 'Heads of department',
  head_role: 'Head of Department',
  profile_label: 'View profile',
  programmes_eyebrow: 'Programmes',
  programmes_heading: 'Find your programme',
  programmes_intro: 'Every programme sits inside one of the departments above.',
  search_label: 'Search programmes',
  search_placeholder: 'Search programmes',
  all_label: 'All',
  level_undergraduate: 'Undergraduate',
  level_postgraduate: 'Postgraduate',
  count_one: '{count} programme',
  count_many: '{count} programmes',
  empty_message: 'No programme matches your search.',
  clear_label: 'Show all programmes',
  open_label: 'View programme',
  more_heading: 'Keep exploring',
  student_title: 'Learning beyond the classroom',
  student_text: 'Clubs, field visits, campus events and residential life on the Kanglung hillside shape students as much as any lecture hall does.',
  student_button: 'Discover student life',
  research_title: 'Research and innovation',
  research_text: 'Research centres, grants and publications at Sherubtse College.',
  research_button: 'Visit Research',
  admissions_title: 'Apply to Sherubtse',
  admissions_text: 'Entry requirements, dates and how to apply.',
  admissions_button: 'Go to Admissions',
  dd_nav_label: 'Department sections',
  dd_nav_about: 'About',
  dd_nav_programmes: 'Programmes',
  dd_nav_head: 'Head',
  dd_nav_faculty: 'Faculty',
  dd_nav_notices: 'Notices',
  dd_hero_programmes: 'See the programmes',
  dd_hero_faculty: 'Meet the faculty',
  dd_faculty_fact: '{count} faculty members',
  dd_about_heading: 'About the department',
  dd_vision: 'Vision',
  dd_mission: 'Mission',
  dd_programmes_eyebrow: 'Programmes',
  dd_programmes_heading: 'Programmes offered',
  dd_programmes_intro: 'Choose a programme to see what you will study, how you are assessed and how to apply.',
  dd_open_label: 'View programme',
  dd_head_eyebrow: 'Leadership',
  dd_head_heading: 'Head of department',
  dd_faculty_eyebrow: 'Faculty',
  dd_faculty_heading: 'Meet the faculty',
  dd_faculty_intro: 'Everyone who teaches in the department, with their qualification.',
  dd_search_placeholder: 'Search faculty',
  dd_faculty_one: '{count} faculty member',
  dd_faculty_many: '{count} faculty members',
  dd_profile_label: 'View profile',
  dd_directory_link: 'Full faculty directory',
  dd_notices_eyebrow: 'Updates',
  dd_notices_heading: 'Notices',
  dd_apply_heading: 'Ready to study here?',
  dd_apply_text: 'See how to apply, the entry requirements and the key dates.',
  dd_apply_button: 'How to apply',
  dd_other_heading: 'Other departments',
  pg_fact_award: 'Award',
  pg_fact_duration: 'Duration',
  pg_fact_department: 'Department',
  pg_fact_level: 'Level',
  pg_fact_seats: 'Seats',
  pg_fact_intake: 'Intake',
  pg_fact_fee: 'Annual fee',
  pg_apply: 'Apply now',
  pg_email: 'Email admissions',
  pg_nav_label: 'On this page',
  pg_glance: 'At a glance',
  pg_overview: 'Overview',
  pg_about: 'Who the programme is for',
  pg_highlights: 'Programme highlights',
  pg_outcomes: 'Learning outcomes',
  pg_skills: 'Key skills',
  pg_curriculum: 'Curriculum',
  pg_teaching: 'Teaching and assessment',
  pg_resources: 'Resources and facilities',
  pg_careers: 'Careers',
  pg_further: 'Further study',
  pg_entry: 'Entry requirements',
  pg_testimonials: 'Student voices',
  pg_faqs: 'Questions answered',
  pg_contact: 'Contact',
  pg_related: 'More in this department',
  pg_coordinator: 'Coordinator',
  pg_head: 'Head of department',
  pg_all_programmes: 'All programmes',
  pg_admissions_link: 'Full admissions guide',
};

/** Academics – Programmes Page: hero text and wording. {count} is filled in automatically. */
export const PROGRAMMES_HERO = {
  hero_eyebrow: 'Academics',
  hero_heading: 'Programmes',
  hero_intro: 'Undergraduate degrees across the sciences, data and the social sciences.',
};
export const PROGRAMMES_LABELS = {
  tiles_label: 'Departments',
  stat_programmes: 'Programmes',
  stat_departments: 'Departments',
  tile_open: 'Show these programmes',
  search_label: 'Search programmes',
  search_placeholder: 'Search programmes',
  all_label: 'All',
  level_undergraduate: 'Undergraduate',
  level_postgraduate: 'Postgraduate',
  view_label: 'View',
  view_cards: 'Cards',
  view_list: 'List',
  count_one: '{count} programme',
  count_many: '{count} programmes',
  empty_message: 'No programme matches your search.',
  clear_label: 'Show all programmes',
  open_label: 'View programme',
  quick_label: 'Quick view',
  quick_close: 'Close',
  quick_prev: 'Previous',
  quick_next: 'Next',
  quick_page: 'Go to programme page',
  fact_award: 'Award',
  fact_duration: 'Duration',
  fact_department: 'Department',
  fact_level: 'Level',
  fact_seats: 'Seats',
  fact_fee: 'Annual fee',
  fact_intake: 'Admissions',
  intake_open: 'Admissions open',
  intake_closed: 'Admissions closed',
  intake_waitlist: 'Waitlist only',
  cta_heading: 'Ready to apply?',
  cta_text: 'See the entry requirements, key dates and how to apply.',
  cta_button: 'Go to Admissions',
  cta_second: 'Ask the admissions team',
};

const FACULTY_HERO = {
  hero_eyebrow: 'Sherubtse College',
  hero_heading: 'Our Faculty',
  hero_intro: 'Meet the scholars, mentors and researchers shaping Bhutan’s oldest seat of higher learning, across every department, from the humanities to the sciences.',
};

const TYPES = [
  {
    uid: 'api::about-overview.about-overview',
    labels: ABOUT_LABELS,
    store: 'about_overview_labels_version',
    version: 1,
    help: 'Wording on the About page: the three facts beside the photos, the names of the live figures, and the small notes on boxes. {count} is filled in automatically. Edit the text after each colon only.',
  },
  {
    uid: 'api::academics-overview.academics-overview',
    labels: ACADEMICS_LABELS,
    store: 'academics_overview_labels_version',
    version: 1,
    help: 'Wording on the Academics page: the programme showcase, department cards, live figures, calendar strip and the small notes on boxes. {count} is filled in automatically. Edit the text after each colon only.',
  },
  {
    uid: 'api::faculty-setting.faculty-setting',
    labels: FACULTY_LABELS,
    store: 'faculty_labels_version',
    version: 2,
    help: 'The wording of the Faculty directory: search box, sort and view buttons, filters, headings and counts. {count} is filled in automatically. Edit the text after each colon only.',
  },
  {
    uid: 'api::alumni-setting.alumni-setting',
    labels: ALUMNI_LABELS,
    store: 'alumni_labels_version',
    version: 1,
    help: 'The wording of the Alumni overview and its pages: the navigation bar, the topic cards, and each page title and short description. {count} is filled in automatically. Edit the text after each colon only.',
  },
  {
    uid: 'api::history-content.history-content',
    labels: HISTORY_LABELS,
    store: 'history_labels_version',
    version: 1,
    help: 'The headings and small wording on the History page (chapter names, section titles, button text). {count} and {year} are filled in automatically. Edit the text after each colon only.',
  },
  {
    uid: 'api::about-page.about-page',
    labels: ABOUT_COLLEGE_LABELS,
    store: 'about_college_labels_version',
    version: 1,
    help: 'Wording on the About the College page: the group headings, the buttons and the “continue exploring” heading. {name} is filled in automatically. Edit the text after each colon only.',
  },
  {
    uid: 'api::news-notices-overview.news-notices-overview',
    labels: NEWS_NOTICES_LABELS,
    store: 'news_notices_overview_labels_version',
    version: 2,
    help: 'Wording on the News & Notices page: top stories, the notice board, the live chips and the small notes on boxes. {count} is filled in automatically. Edit the text after each colon only.',
  },
];

/** Admission – Page Settings → Labels: wording for the landing page's finder and status card. */
export const ADMISSION_PAGE_LABELS = {
  finder_heading: 'Find what you need',
  finder_intro: 'Choose who is applying, then pick a topic.',
  finder_applicant: 'I am applying as',
  next_date_heading: 'Next key date',
  days_to_go: '{count} days to go',
  day_to_go: '1 day to go',
  today_label: 'Today',
  latest_notice_heading: 'Latest admission notice',
  jump_dates: 'Key dates',
};
const ADMISSION_STORE = { type: 'core', name: 'seeds', key: 'admission_page_labels_version' } as const;

/** Fills the new label fields once; wording staff already changed is left alone. */
async function ensureAdmissionPageLabels(strapi: Core.Strapi) {
  if ((Number(await strapi.store.get(ADMISSION_STORE)) || 0) >= 1) return;
  const docs = strapi.documents('api::admissions-overview.admissions-overview' as any) as any;
  const page = await docs.findFirst({ populate: ['labels'] });
  if (page) {
    const current = page.labels ?? {};
    const missing = Object.fromEntries(Object.entries(ADMISSION_PAGE_LABELS).filter(([k]) => !current[k]));
    if (Object.keys(missing).length) {
      const { id: _id, ...rest } = current;
      await docs.update({ documentId: page.documentId, data: { labels: { ...rest, ...missing } } });
    }
  }
  await strapi.store.set({ ...ADMISSION_STORE, value: 1 });
}

/** Student Life – Overview: wording, hero buttons and starter hero photos. */
export const STUDENT_LIFE_LABELS = {
  clubs_count: '{count} clubs & societies',
  ribbon_label: 'Clubs & societies',
  clubs_heading: 'Find your club',
  clubs_intro: 'Student-run clubs, units, societies and forums. Pick an interest to narrow the list.',
  clubs_filter_all: 'All',
  clubs_all_link: 'See all clubs & societies',
  meta_clubs: '{count} clubs',
  photo_prev: 'Previous photo',
  photo_next: 'Next photo',
  photo_pause: 'Pause photos',
  photo_play: 'Play photos',
  explore_label: 'Explore',
};
const STUDENT_LIFE_BUTTONS = [
  { label: 'Find your club', url: '#clubs' },
  { label: 'Student support', url: '/about/campus-facilities/happiness-wellbeing-center' },
];
// Real College photos already in the Media Library (staff can replace them).
const STUDENT_LIFE_PHOTOS = [
  'sherubtse-news-coronation-anniversary-dance',
  'sherubtse-chancellors-cup-champions',
  'sherubtse-mph-residence-hall',
  'sherubtse-football-fair-play-lineup',
  'sherubtse-campus-kanglung',
  'sherubtse-basketball-court-clock-tower',
];
const STUDENT_LIFE_STORE = { type: 'core', name: 'seeds', key: 'student_life_overview_version' } as const;

/** About – The College: the small “Leadership” label above the title. */
async function ensureAboutCollegeEyebrow(strapi: Core.Strapi) {
  const key = { type: 'core', name: 'seeds', key: 'about_college_eyebrow_version' } as const;
  if ((Number(await strapi.store.get(key)) || 0) >= 1) return;
  const docs = strapi.documents('api::about-page.about-page' as any) as any;
  const page = await docs.findFirst();
  if (page && !page.eyebrow) await docs.update({ documentId: page.documentId, data: { eyebrow: 'Leadership' } });
  await strapi.store.set({ ...key, value: 1 });
}

/**
 * About – Administrative Units: the wording (Labels), a directory heading that
 * matches what the page now lists (offices, departments, centres, services and
 * student bodies), and the Deans' offices marked as Leadership Offices. Runs once;
 * a heading or flag the editors changed before is left alone.
 */
async function ensureUnitsDirectory(strapi: Core.Strapi) {
  const key = { type: 'core', name: 'seeds', key: 'units_directory_version' } as const;
  if ((Number(await strapi.store.get(key)) || 0) >= 1) return;
  const pages = strapi.documents('api::units-page.units-page' as any) as any;
  const page = await pages.findFirst({ status: 'draft' });
  if (page) {
    const current = page.labels && typeof page.labels === 'object' ? page.labels : {};
    const data: Record<string, unknown> = { labels: { ...UNITS_LABELS, ...current } };
    if (page.directory_heading === 'All Administrative Units') data.directory_heading = 'Offices, departments and centres';
    if (page.directory_intro === 'Every administrative office of the College, with its head and contact details.') {
      data.directory_intro = 'Every administrative office, academic department, research centre, service and student body of the College, with its head and contact details.';
    }
    await pages.update({ documentId: page.documentId, data });
    await pages.publish({ documentId: page.documentId });
  }
  const units = strapi.documents('api::unit.unit' as any) as any;
  for (const slug of ['academic-affairs', 'student-affairs']) {
    const u = await units.findFirst({ filters: { slug }, status: 'draft' });
    if (u && !u.is_featured) {
      await units.update({ documentId: u.documentId, data: { is_featured: true } });
      await units.publish({ documentId: u.documentId });
    }
  }
  await strapi.store.set({ ...key, value: 1 });
}

export const EXAMINATIONS_HERO = {
  hero_eyebrow: 'Academics',
  hero_heading: 'Examinations & Records',
  hero_intro: 'Timetables, results, notices and guidelines from the Examination & Records Office, and how to request your academic records.',
};

export const EXAMINATIONS_LABELS: Record<string, string> = {
  stat_documents: 'Documents',
  stat_notices: 'Latest notices',
  stat_dates: 'Upcoming dates',
  next_label: 'Next on the calendar',
  next_none: 'No exam dates are scheduled yet.',
  days_many: '{n} days to go',
  days_one: '1 day to go',
  days_today: 'Today',
  days_ongoing: 'Happening now',
  days_past: 'Completed',
  next_calendar: 'See the full calendar',
  nav_latest: 'Latest',
  nav_dates: 'Key dates',
  nav_library: 'Documents & results',
  nav_records: 'Records & certificates',
  nav_contact: 'Contact',
  latest_heading: 'Latest exam news & notices',
  latest_intro: 'The newest announcements about examinations and results.',
  latest_empty: 'No examination notices have been published yet.',
  latest_read: 'Read more',
  dates_heading: 'Examination calendar',
  dates_intro: 'Examination and results dates from the academic calendar.',
  dates_empty: 'No examination dates have been added to the academic calendar yet.',
  dates_recent: 'Recently',
  dates_all: 'Full academic calendar',
  library_heading: 'Documents & results',
  library_intro: 'Timetables, results, circulars and guidelines. Use the filters to find what you need.',
  search_label: 'Search documents',
  search_placeholder: 'Search by title, session or programme',
  filter_all: 'All',
  session_label: 'Session',
  session_all: 'All sessions',
  count_one: '{count} document',
  count_many: '{count} documents',
  empty_filtered: 'No document matches your search.',
  empty_all: 'Examination documents will appear here once the Examination & Records Office publishes them.',
  clear_label: 'Clear filters',
  open_label: 'Open',
  download_label: 'Download',
  applies_label: 'Applies to',
  kind_timetable: 'Timetable',
  kind_result: 'Result',
  kind_notice: 'Notice',
  kind_circular: 'Circular',
  kind_guideline: 'Guideline',
  kind_form: 'Form',
  kind_record: 'Records',
  cal_examination: 'Examination',
  cal_results: 'Results',
  cal_more: 'Dates',
  records_heading: 'Records & certificates',
  records_intro: 'What the Examination & Records Office provides, as published by the College.',
  handles_heading: 'The office looks after',
  contact_heading: 'Contact the Examination & Records Office',
  contact_email: 'Email the office',
  contact_phone: 'Call',
  contact_location: 'Find the office',
  feed_keywords: 'exam, result, mark sheet, transcript, timetable, assessment',
};

/** Academics – Examinations Page: created once with the wording the page would otherwise hold in its code. */
async function ensureExaminationsPage(strapi: Core.Strapi) {
  const key = { type: 'core', name: 'seeds', key: 'examinations_page_version' } as const;
  if ((Number(await strapi.store.get(key)) || 0) >= 2) return;
  const docs = strapi.documents('api::examinations-page.examinations-page' as any) as any;
  const existing = await docs.findFirst();
  if (!existing) {
    await docs.create({ data: { ...EXAMINATIONS_HERO, labels: EXAMINATIONS_LABELS } });
  } else {
    const current = existing.labels && typeof existing.labels === 'object' ? existing.labels : {};
    await docs.update({ documentId: existing.documentId, data: { labels: { ...EXAMINATIONS_LABELS, ...current } } });
  }
  await strapi.store.set({ ...key, value: 2 });
}

/** Academics – Programmes Page: created once with the wording the page used to hold in its code. */
async function ensureProgrammesPage(strapi: Core.Strapi) {
  const key = { type: 'core', name: 'seeds', key: 'programmes_page_version' } as const;
  if ((Number(await strapi.store.get(key)) || 0) >= 1) return;
  const docs = strapi.documents('api::programmes-page.programmes-page' as any) as any;
  const existing = await docs.findFirst();
  if (!existing) {
    await docs.create({ data: { ...PROGRAMMES_HERO, labels: PROGRAMMES_LABELS } });
  } else {
    const current = existing.labels && typeof existing.labels === 'object' ? existing.labels : {};
    await docs.update({ documentId: existing.documentId, data: { labels: { ...PROGRAMMES_LABELS, ...current } } });
  }
  await strapi.store.set({ ...key, value: 1 });
}

/** Academics – Departments Page: created once with the wording the page used to hold in its code. */
async function ensureDepartmentsPage(strapi: Core.Strapi) {
  const key = { type: 'core', name: 'seeds', key: 'departments_page_version' } as const;
  if ((Number(await strapi.store.get(key)) || 0) >= 2) return;
  const docs = strapi.documents('api::departments-page.departments-page' as any) as any;
  const existing = await docs.findFirst();
  if (!existing) {
    await docs.create({ data: { ...DEPARTMENTS_HERO, labels: DEPARTMENTS_LABELS } });
  } else {
    const current = existing.labels && typeof existing.labels === 'object' ? existing.labels : {};
    await docs.update({ documentId: existing.documentId, data: { labels: { ...DEPARTMENTS_LABELS, ...current } } });
  }
  await strapi.store.set({ ...key, value: 2 });
}

/** About – Faculty Page: the hero text, filled in once where empty. */
async function ensureFacultyHero(strapi: Core.Strapi) {
  const key = { type: 'core', name: 'seeds', key: 'faculty_hero_version' } as const;
  if ((Number(await strapi.store.get(key)) || 0) >= 1) return;
  const docs = strapi.documents('api::faculty-setting.faculty-setting' as any) as any;
  const page = await docs.findFirst();
  if (page) {
    const data: Record<string, string> = {};
    for (const [k, v] of Object.entries(FACULTY_HERO)) if (!page[k]) data[k] = v;
    if (Object.keys(data).length) await docs.update({ documentId: page.documentId, data });
  }
  await strapi.store.set({ ...key, value: 1 });
}

async function ensureStudentLifeContent(strapi: Core.Strapi) {
  if ((Number(await strapi.store.get(STUDENT_LIFE_STORE)) || 0) >= 1) return;
  const docs = strapi.documents('api::student-life-overview.student-life-overview' as any) as any;
  const page = await docs.findFirst({ populate: ['hero_photos', 'hero_buttons'] });
  if (page) {
    const data: Record<string, unknown> = {};
    const current = page.labels && typeof page.labels === 'object' ? page.labels : {};
    const merged = { ...STUDENT_LIFE_LABELS, ...current };
    if (Object.keys(merged).length > Object.keys(current).length) data.labels = merged;
    if (!page.hero_buttons?.length) data.hero_buttons = STUDENT_LIFE_BUTTONS;
    if (!page.hero_photos?.length) {
      const files: { id: number; name: string }[] = await strapi.db.query('plugin::upload.file').findMany({
        where: { name: { $startsWith: 'sherubtse-' } },
        select: ['id', 'name'],
      });
      const ids = STUDENT_LIFE_PHOTOS.map((n) => files.find((f) => f.name.replace(/\.[a-z]+$/i, '') === n)?.id).filter(Boolean);
      if (ids.length) data.hero_photos = ids;
    }
    if (Object.keys(data).length) await docs.update({ documentId: page.documentId, data });
  }
  await strapi.store.set({ ...STUDENT_LIFE_STORE, value: 1 });
}

/** Global – Footer: the two headings added with the footer redesign. */
const FOOTER_STORE = { type: 'core', name: 'seeds', key: 'footer_labels_version' } as const;
async function ensureFooterLabels(strapi: Core.Strapi) {
  if ((Number(await strapi.store.get(FOOTER_STORE)) || 0) >= 1) return;
  const docs = strapi.documents('api::footer.footer' as any) as any;
  const footer = await docs.findFirst();
  if (footer) {
    const data: Record<string, string> = {};
    if (!footer.services_heading) data.services_heading = 'Online services';
    if (!footer.directions_label) data.directions_label = 'View on Google Maps';
    if (Object.keys(data).length) await docs.update({ documentId: footer.documentId, data });
  }
  await strapi.store.set({ ...FOOTER_STORE, value: 1 });
}

export async function ensureOverviewLabels({ strapi }: { strapi: Core.Strapi }) {
  await ensureAdmissionPageLabels(strapi);
  await ensureFooterLabels(strapi);
  await ensureStudentLifeContent(strapi);
  await ensureAboutCollegeEyebrow(strapi);
  await ensureFacultyHero(strapi);
  await ensureUnitsDirectory(strapi);
  await ensureDepartmentsPage(strapi);
  await ensureProgrammesPage(strapi);
  await ensureExaminationsPage(strapi);
  const help: HelpMap = {};
  for (const t of TYPES) {
    help[`content_types::${t.uid}`] = { fields: { labels: t.help } };
    const STORE = { type: 'core', name: 'seeds', key: t.store } as const;
    const done = Number(await strapi.store.get(STORE)) || 0;
    if (done >= t.version) continue;
    const docs = strapi.documents(t.uid as any);
    const existing: any = await docs.findFirst();
    if (existing) {
      const current = existing.labels && typeof existing.labels === 'object' ? existing.labels : {};
      const merged = { ...t.labels, ...current };
      if (Object.keys(merged).length > Object.keys(current).length) {
        await docs.update({ documentId: existing.documentId, data: { labels: merged } } as any);
      }
    }
    await strapi.store.set({ ...STORE, value: t.version });
  }
  help['content_types::api::examinations-page.examinations-page'] = {
    fields: {
      hero_eyebrow: 'Small label above the page title.',
      hero_heading: 'The page title.',
      hero_intro: 'The paragraph under the title.',
      labels: 'Wording of the Examinations page: headings, filters, buttons and the kinds of document. {count}, {n} and {date} are filled in automatically. “feed_keywords” is a comma-separated list: any announcement or news item whose title or tags contain one of these words also appears under “Latest exam news & notices”. Edit the text after each colon only. The documents themselves are edited under Examinations – Documents & Notices; the services and contact details come from the Examination & Records unit under Administrative Units.',
    },
  };
  help['content_types::api::newsletters-page.newsletters-page'] = {
    fields: {
      hero_eyebrow: 'Small label above the page title.',
      hero_heading: 'The page title.',
      hero_intro: 'The paragraph under the title.',
      labels: 'Wording of the Newsletter page and of each newsletter’s page: figures, search, filters, buttons and short notes. {count}, {n} and {total} are filled in automatically. Edit the text after each colon only. The newsletters themselves are edited under Newsletter – Editions.',
    },
  };
  help['content_types::api::news-page.news-page'] = {
    fields: {
      hero_eyebrow: 'Small label above the page title.',
      hero_heading: 'The page title.',
      hero_intro: 'The paragraph under the title.',
      labels: 'Wording of the News page: figures, filters, view names, badges, the photo wall and the links at the bottom. {count} and {n} are filled in automatically. Edit the text after each colon only. The stories themselves are edited under News & Notices – News.',
    },
  };
  help['content_types::api::event.event'] = {
    fields: {
      summary: 'One or two sentences. Shown as the large opening line on the event page and on the Events page.',
      description: 'The story of the event. Separate paragraphs with a blank line; use ** around words to make them bold; add pictures with the Photos field below instead of in the text.',
      category: 'The kind of event (cultural, sports, public lecture …). Used for the label on the card.',
      image: 'The big picture across the top of the event page. Without one, a designed navy banner with the date is used.',
      gallery: 'Any number of pictures — before or after the event. They appear as a photo gallery with a full-screen viewer.',
      programme: 'The running order: a time (e.g. “9:00 am”), a title and a short description for each item.',
      guests: 'Chief guest, speakers, performers. A name, their role, an optional note and a portrait photo.',
      video_url: 'A YouTube or Vimeo link, shown as a video on the page (e.g. the recording after the event).',
      contact_email: 'Where people should write about this event (optional).',
      contact_phone: 'A phone number for this event (optional).',
      registration_link: 'A web address people use to sign up. A “Register” button appears until the event has taken place.',
      photo_story: 'After the event, link the News story that has its photos.',
      is_featured: 'Tick to highlight this event.',
    },
  };
  help['content_types::api::events-page.events-page'] = {
    fields: {
      hero_eyebrow: 'Small label above the page title.',
      hero_heading: 'The page title.',
      hero_intro: 'The paragraph under the title.',
      labels: 'Wording of the Events page: the countdown, filters, view names, the calendar, buttons and the names of the event types and audiences. {count} and {n} are filled in automatically. Edit the text after each colon only. The events themselves are edited under News & Notices – Events.',
    },
  };
  help['content_types::api::newsletter.newsletter'] = {
    fields: {
      title: 'The name of the publication, e.g. “The Tower” or “SSAN Monthly Newsletter”. Editions with the same name are grouped together on the Newsletter page.',
      slug: 'The web address part, e.g. spring-2026. Lower-case, no spaces.',
      edition: 'Spring, summer, autumn or winter. Leave empty for monthly or one-off newsletters.',
      issue_label: 'What to show as the issue, e.g. “Spring Edition 2026”, “August 2026” or “3rd Issue · 2022”.',
      year: 'The year of the issue. Used for the year filter and for ordering.',
      publication_date: 'Optional. Used only to order issues within a year; it is not shown.',
      description: 'A few sentences about what is in this issue.',
      cover_image: 'The cover. Export the first page of the PDF as an image. If left empty the page shows a coloured cover with the title.',
      pdf: 'The newsletter as a PDF. Readers can read it page by page on the website.',
      external_url: 'Use instead of a PDF when the newsletter is published elsewhere (a web address).',
      topics: 'Subjects covered. Shown as filters on the Newsletter page.',
      is_featured: 'Tick to put this issue first in the large “latest” spot. Otherwise the newest issue is used.',
      display_order: 'Smaller numbers first among issues of the same date.',
      owning_unit: 'The office or body that publishes it.',
    },
  };
  help['content_types::api::regulations-page.regulations-page'] = {
    fields: {
      hero_eyebrow: 'Small label above the page title.',
      hero_heading: 'The page title.',
      hero_intro: 'The paragraph under the title.',
      key_figures: 'The big numbers at the top. “Highlight” is the figure itself (e.g. 90%), Title says what it is, Text is the small note. Keep these in step with the topics below.',
      topics: 'One block per subject (Attendance, Appeals …). “Key” is the short web address part (no spaces, e.g. attendance). “Icon” is one of: people, shield, journal, study, clock, heart, access, search, external, book. Each rule has a title, its wording, and an optional Highlight (a figure such as 90% or Nu. 500). This page is a summary of the College’s Student Academic Guide: change a rule only when the College has changed it.',
      source_note: 'The note under the topics saying where the summary comes from.',
      wheel_label: 'Name of the full regulations document.',
      wheel_url: 'Link to the full regulations (the Wheel of Academic Law). Use an uploaded file’s link or a web address.',
      labels: 'Wording of the page: search box, buttons, the “full regulations” and contact blocks. {count} is filled in automatically. Edit the text after each colon only.',
    },
  };
  help['content_types::api::exam-resource.exam-resource'] = {
    fields: {
      title: 'e.g. “Semester-end examination timetable, Autumn 2026”.',
      kind: 'What it is. Decides the filter it appears under and its label.',
      session: 'The semester or academic year, e.g. “Autumn 2026”. Used for the Session filter.',
      published_on: 'The date to show on the card. Newest are listed first.',
      summary: 'One or two sentences shown on the card (optional).',
      file: 'Upload the PDF or document. Leave empty for a plain notice, or use External link instead.',
      external_url: 'A link to a page elsewhere (used when there is no uploaded file).',
      applies_to: 'Who it is for, e.g. “All programmes” or “BSc Chemistry, Year 2”.',
      is_featured: 'Tick to list it before the others.',
      display_order: 'Smaller numbers first among featured items.',
    },
  };
  help['content_types::api::programmes-page.programmes-page'] = {
    fields: {
      hero_eyebrow: 'Small label above the page title.',
      hero_heading: 'The page title.',
      hero_intro: 'The paragraph under the title.',
      labels: 'Wording of the Programmes page: figures, search box, filters, buttons, the quick-view panel and the apply band at the bottom. {count} is filled in automatically. Edit the text after each colon only. The programmes themselves are edited under Programmes.',
    },
  };
  help['content_types::api::programme.programme'] = {
    fields: {
      degree_type: 'The award, as the College names it, e.g. “BSc in Chemistry”. Shown as “Award” on the programme page.',
      duration: 'e.g. “4 years (8 semesters), full-time”.',
      short_description: 'One or two sentences. Shown on cards and in search results.',
      overview: 'The main description. Separate paragraphs with a blank line.',
      about: 'Who the programme is for. Start a line with “- ” to make a bullet.',
      highlights: 'What makes the programme distinctive. One “- ” bullet per line.',
      learning_outcomes: 'What graduates will be able to do. One “- ” bullet per line.',
      key_skills: 'One “- ” bullet per line.',
      curriculum: 'One block per year (or semester). Label e.g. “Year 1 – Foundations”; Courses is free text.',
      teaching_assessment: 'How students learn and are assessed. Blank line between paragraphs.',
      resources: 'Laboratories, studios and other facilities. “- ” for bullets.',
      admission_requirements: 'Entry requirements. These should match the Admissions guide.',
      seats: 'e.g. “30 government scholarship · 5 self-financed”. Should match the Admissions guide.',
      career_opportunities: 'Where graduates work. “- ” for bullets.',
      further_study: 'Postgraduate paths.',
      testimonials: 'Quotes from students or graduates, with the name and a short detail such as “Class of 2024”.',
      contact_email: 'Where applicants should write about this programme.',
      contact_note: 'Anything else about who to contact (optional).',
    },
  };
  help['content_types::api::departments-page.departments-page'] = {
    fields: {
      hero_eyebrow: 'Small label above the page title.',
      hero_heading: 'The page title.',
      hero_intro: 'The paragraph under the title.',
      labels: 'Wording of the Departments page and of every department and programme page (headings, buttons, small labels; keys starting dd_ are the department page, pg_ the programme page). {count} is filled in automatically. Edit the text after each colon only. The departments themselves are edited under Departments.',
    },
  };
  help['content_types::api::units-page.units-page'] = {
    fields: {
      labels: 'Group names and small wording of the Administrative Units page (filter names, search box, counts, button). {count} is filled in automatically. Edit the text after each colon only.',
      featured_heading: 'Heading above the leadership offices (units marked “Featured” in Administrative Units).',
      directory_heading: 'Heading above the directory of every office, department, centre, service and student body.',
    },
  };
  help['content_types::api::faculty-profile.faculty-profile'] = {
    fields: {
      sort_order: 'Seniority on the Faculty page: 1 is shown first (most experienced), then 2, 3 and so on. People with the same number are ordered by joining date, then by name.',
    },
  };
  help['content_types::api::faculty-setting.faculty-setting'] = {
    fields: {
      hero_eyebrow: 'Small label above the page title.',
      hero_heading: 'The page title.',
      hero_intro: 'The paragraph under the title.',
      card_style: 'No longer used: every card is rounded in the redesigned directory.',
      cards_per_row: 'No longer used: the grid fits as many cards as the screen allows.',
      button_style: 'No longer used on the directory page.',
      student_count: 'Shown as “Students” in the figures at the top. Leave 0 to hide it.',
      animation_style: 'How the faculty cards appear: fade, slide, zoom, or none.',
      labels: 'Wording of the directory (search box, filters, sort, headings, counts). {count} is filled in automatically. Edit the text after each colon only.',
    },
  };
  help['content_types::api::leadership-member.leadership-member'] = {
    fields: {
      category: 'President is shown first in the large spotlight; Deans in the team row; Directors in a third group. Use Display order to arrange people within a group.',
      bio: 'Optional. Two or three sentences shown under the name. Leave empty to show just the name and role.',
      office_url: 'Optional. Where “Contact office” goes for this person, e.g. /about/units/academic-affairs. Empty = the Contact page.',
      photo: 'A portrait works best, taller than wide (about 4:5). Add alternative text describing the photo for screen-reader users.',
    },
  };
  help['content_types::api::student-life-overview.student-life-overview'] = {
    fields: {
      hero_photos: 'Photos that fan out and shuffle in the top section. Best 3–6 landscape photos of student life. Each photo’s “alternative text” is read out to screen-reader users.',
      hero_buttons: 'Buttons under the intro, e.g. “Find your club” → #clubs.',
      hero_slide_seconds: 'How many seconds each photo in the top stack stays before the next one swings in (1–15). Smaller is faster. It pauses while a visitor hovers over the photos.',
      labels: 'Small wording on the Student Life page (club ribbon, “Find your club”, photo controls, box notes). {count} is filled in automatically. Edit the text after each colon only.',
    },
  };
  await applyAdminHelp({ strapi, help, prefixes: [], storeKey: 'overview_labels_main_fields_set' });
}
