#!/usr/bin/env node
/**
 * One-time seed for the `navigation` single type — the 6-item structure
 * from Stack, Structure & Wireframes §03, second-level items included
 * (they render on each section-landing page, not in a dropdown — see
 * §07's Stanford-derived rule).
 *
 * Usage:
 *   STRAPI_MIGRATION_TOKEN=<full-access token> node scripts/seed-navigation.js
 *
 * Requires a "Full access" API token (Settings -> API Tokens in Strapi
 * admin) — the site's normal read-only token cannot write. Delete the
 * token again once this has run, same pattern as migrate.js.
 */
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const TOKEN = process.env.STRAPI_MIGRATION_TOKEN;

if (!TOKEN) {
  console.error('Set STRAPI_MIGRATION_TOKEN to a Full-access API token first.');
  process.exit(1);
}

const menu = [
  {
    label: 'About', url: '/about',
    children: [
      { label: 'About the College', url: '/about' },
      { label: 'Vision, Mission & Values', url: '/about/vision-mission' },
      { label: 'Leadership & Management', url: '/about/leadership' },
      { label: 'Administrative Units', url: '/about/units' },
      { label: 'Campus & Facilities', url: '/about/campus' },
      { label: 'Affiliation & Accreditation', url: '/about/affiliation' },
      { label: 'How to Reach Kanglung', url: '/about/directions' },
    ],
  },
  {
    label: 'Academics', url: '/academics',
    children: [
      { label: 'Academics Overview', url: '/academics' },
      { label: 'Departments', url: '/academics/departments' },
      { label: 'Programmes', url: '/academics/programmes' },
      { label: 'Academic Calendar', url: '/academics/calendar' },
      { label: 'Examinations & Assessment', url: '/academics/examinations' },
      { label: 'Academic Regulations', url: '/academics/regulations' },
      { label: 'Library', url: 'https://library.sherubtse.edu.bt' },
    ],
  },
  {
    label: 'Admissions', url: '/admissions',
    children: [
      { label: 'How to Apply', url: '/admissions/apply' },
      { label: 'Entry Requirements', url: '/admissions/requirements' },
      { label: 'Fees & Financial Information', url: '/admissions/fees' },
      { label: 'Scholarships & Financial Support', url: '/admissions/scholarships' },
      { label: 'Admission Notices', url: '/admissions/notices' },
      { label: 'Frequently Asked Questions', url: '/admissions/faq' },
    ],
  },
  {
    label: 'Research', url: '/research',
    children: [
      { label: 'Research at Sherubtse', url: '/research' },
      { label: 'Expertise Directory', url: '/research/expertise' },
      { label: 'Research Centres', url: '/research/centres' },
      { label: 'Journals & Publications', url: '/research/journals' },
      { label: 'Grants & Funding', url: '/research/grants' },
      { label: 'Research Ethics', url: '/research/ethics' },
    ],
  },
  {
    label: 'Student Life', url: '/student-life',
    children: [
      { label: 'Life at Sherubtse', url: '/student-life' },
      { label: 'Student Services & Counselling', url: '/student-life/services' },
      { label: 'Hostels & Residence', url: '/student-life/hostels' },
      { label: 'Clubs & Societies', url: '/student-life/clubs' },
      { label: 'Sports & Recreation', url: '/student-life/sports' },
      { label: 'Student Handbook', url: '/student-life/handbook' },
      { label: 'Alumni', url: '/student-life/alumni' },
    ],
  },
  {
    label: 'News & Notices', url: '/news-notices',
    children: [
      { label: 'Announcements', url: '/news-notices/announcements' },
      { label: 'News', url: '/news-notices/news' },
      { label: 'Events', url: '/news-notices/events' },
      { label: 'Recruitment', url: '/news-notices/recruitment' },
      { label: 'Tenders', url: '/news-notices/tenders' },
      { label: 'Downloads & Forms', url: '/news-notices/downloads' },
      { label: 'Archive', url: '/news-notices/archive' },
    ],
  },
];

async function main() {
  const res = await fetch(`${STRAPI_URL}/api/navigation`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ data: { menu } }),
  });
  const body = await res.json();
  if (!res.ok) {
    console.error('Failed:', res.status, JSON.stringify(body, null, 2));
    process.exit(1);
  }
  console.log('Navigation seeded:', res.status);
}

main();
