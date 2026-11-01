import fs from 'fs';
import path from 'path';
import type { Core } from '@strapi/strapi';

/**
 * Newsletter – Editions: brings the newsletters published on the College's previous website
 * (www.sherubtse.edu.bt) into Strapi, with a cover taken from each PDF's first page, and
 * adds the cover to the Summer 2026 edition. The wording of each description is taken from
 * the newsletter itself — nothing else is added. Seeded once; after that, edit in Strapi.
 *
 * The PDFs and covers are read from cms/seed-assets/newsletters/ (they are uploaded to the
 * media library on the first run, after which that folder is no longer needed).
 */
const UID = 'api::newsletter.newsletter';
const KEY = { type: 'core', name: 'seeds', key: 'newsletter_archive_version' } as const;
const ASSETS = path.join(process.cwd(), 'seed-assets', 'newsletters');

type Entry = {
  slug: string;
  title: string;
  edition?: 'spring' | 'summer' | 'autumn' | 'winter';
  issue_label: string;
  year: number;
  publication_date?: string;
  description: string;
  unit: string;
  display_order: number;
};

const ENTRIES: Entry[] = [
  {
    slug: 'spring-2026',
    title: 'The Tower',
    edition: 'spring',
    issue_label: 'Spring Edition 2026 · Volume XI, Issue I',
    year: 2026,
    description: 'The Spring Edition 2026 of The Tower, the Sherubtse College newsletter, published since 2012.',
    unit: 'office-of-the-president',
    display_order: 1,
  },
  {
    slug: 'ssan-september-2026',
    title: 'SSAN Monthly Newsletter',
    issue_label: 'September 2026',
    year: 2026,
    publication_date: '2026-09-01',
    description:
      'The monthly newsletter of the Sherubtse Student Assistance Network (SSAN). This issue covers the Basic Counselling & Mindfulness Workshop (Batch VI) and the Happiness Hackathon 2026, held to mark World Suicide Prevention Day.',
    unit: 'student-affairs',
    display_order: 2,
  },
  {
    slug: 'ssan-august-2026',
    title: 'SSAN Monthly Newsletter',
    issue_label: 'August 2026',
    year: 2026,
    publication_date: '2026-08-01',
    description:
      'The monthly newsletter of the Sherubtse Student Assistance Network (SSAN). This issue reports the official opening of the Happiness and Wellbeing Centre at Sherubtse College on 3 August 2026, along with the Companion Tree and the Ambition Tree.',
    unit: 'student-affairs',
    display_order: 3,
  },
  {
    slug: 'valley-of-happiness-issue-3',
    title: 'Valley of Happiness',
    issue_label: '3rd Issue · 2022',
    year: 2022,
    description:
      'The Bartsham Student Engagement Program field report: 18 students of the Sherubtse organic farming society, with one staff coordinator, took part in a community engagement programme initiated collaboratively with the JICA partnership programme.',
    unit: 'student-affairs',
    display_order: 4,
  },
  {
    slug: 'hwc-august-2021',
    title: 'HWC Newsletter',
    issue_label: 'August 2021',
    year: 2021,
    publication_date: '2021-08-01',
    description:
      'The Happiness & Wellbeing Centre newsletter for August 2021: Sherubtse’s Shared Shelf, the monsoon football tournament, the Kiddie Dance class and the Basic Counselling Skills course.',
    unit: 'student-affairs',
    display_order: 5,
  },
  {
    slug: 'hwc-2021',
    title: 'HWC Newsletter',
    issue_label: '2021',
    year: 2021,
    description:
      'The Happiness & Wellbeing Centre newsletter for 2021: the services the Centre offers, the water dispenser, printing and photocopying, the Space for Growth and Discovery room, the reading corner and mental health.',
    unit: 'student-affairs',
    display_order: 6,
  },
];

async function upload(strapi: Core.Strapi, file: string, name: string, mimetype: string, alt?: string): Promise<number | null> {
  if (!fs.existsSync(file)) return null;
  const svc = strapi.plugin('upload').service('upload');
  const [done] = await svc.upload({
    data: { fileInfo: { name, alternativeText: alt ?? null } },
    files: { filepath: file, originalFilename: name, mimetype, size: fs.statSync(file).size },
  });
  return done?.id ?? null;
}

export async function ensureNewsletterArchive(strapi: Core.Strapi) {
  if ((Number(await strapi.store.get(KEY)) || 0) >= 1) return;
  const docs = strapi.documents(UID as any) as any;
  const units = strapi.documents('api::unit.unit' as any) as any;
  const today = new Date().toISOString().slice(0, 10);

  for (const e of ENTRIES) {
    const exists = await docs.findFirst({ filters: { slug: { $eq: e.slug } } });
    if (exists) continue;
    const unit = await units.findFirst({ filters: { slug: { $eq: e.unit } } });
    if (!unit) continue;
    const label = `${e.title} — ${e.issue_label}`;
    const pdf = await upload(strapi, path.join(ASSETS, 'pdf', `${e.slug}.pdf`), `${e.slug}.pdf`, 'application/pdf');
    const cover = await upload(strapi, path.join(ASSETS, 'cover', `${e.slug}.jpg`), `${e.slug}-cover.jpg`, 'image/jpeg', `Cover of ${label}`);
    if (!pdf) continue;
    const created = await docs.create({
      data: {
        title: e.title,
        slug: e.slug,
        edition: e.edition ?? null,
        issue_label: e.issue_label,
        year: e.year,
        publication_date: e.publication_date ?? null,
        description: e.description,
        pdf,
        cover_image: cover,
        owning_unit: unit.documentId,
        last_reviewed: today,
        is_featured: false,
        display_order: e.display_order,
      },
    });
    await docs.publish({ documentId: created.documentId });
  }

  // The Summer 2026 edition was added without a cover; give it the one from its first page.
  const summer = await docs.findFirst({ filters: { slug: { $eq: 'summer-2026' } }, populate: ['cover_image'] });
  if (summer) {
    const patch: Record<string, unknown> = {};
    if (!summer.cover_image) {
      const id = await upload(strapi, path.join(ASSETS, 'cover', 'summer-2026.jpg'), 'summer-2026-cover.jpg', 'image/jpeg', 'Cover of The Tower — Summer Edition 2026');
      if (id) patch.cover_image = id;
    }
    if (!summer.issue_label) patch.issue_label = 'Summer Edition 2026 · Volume XI, Issue II';
    if (Object.keys(patch).length) {
      await docs.update({ documentId: summer.documentId, data: patch });
      await docs.publish({ documentId: summer.documentId });
    }
  }
  await strapi.store.set({ ...KEY, value: 1 });
}

/** Newsletter – Page: created once with the wording the page would otherwise hold in its code. */
export const NEWSLETTERS_HERO = {
  hero_eyebrow: 'News & Notices',
  hero_heading: 'Newsletters',
  hero_intro: 'Read the College’s newsletters page by page, right here — or download the PDF to keep.',
};

export const NEWSLETTERS_LABELS: Record<string, string> = {
  stat_issues: 'Issues',
  stat_publications: 'Publications',
  stat_years: 'Years',
  read_latest: 'Read the latest issue',
  browse: 'Browse all newsletters',
  continue_label: 'Continue reading',
  continue_page: 'Page {n}',
  latest_badge: 'Latest',
  library_heading: 'The newsletter library',
  library_intro: 'Every newsletter published by the College. Pick a publication or a year, or search for a topic.',
  search_label: 'Search newsletters',
  search_placeholder: 'Search by name, issue or topic',
  all_label: 'All',
  year_all: 'All years',
  year_label: 'Year',
  sort_label: 'Order',
  sort_newest: 'Newest first',
  sort_oldest: 'Oldest first',
  view_shelf: 'Shelf',
  view_list: 'List',
  count_one: '{count} issue',
  count_many: '{count} issues',
  empty_message: 'No newsletter matches your search.',
  clear_label: 'Show all newsletters',
  surprise: 'Surprise me',
  read_label: 'Read',
  details_label: 'Details',
  download_label: 'Download PDF',
  external_label: 'Open',
  tip_text: 'Tip: in the reader, use the arrow keys to turn pages and press L to have a page read aloud.',
  detail_about: 'About this issue',
  detail_topics: 'Inside this issue',
  detail_more: 'More from this publication',
  detail_other: 'Other newsletters',
  detail_newer: 'Newer issue',
  detail_older: 'Older issue',
  detail_published_by: 'Published by',
  detail_share: 'Share',
  detail_copy: 'Copy link',
  detail_copied: 'Link copied',
  detail_read: 'Read this issue',
};

export async function ensureNewslettersPage(strapi: Core.Strapi) {
  const key = { type: 'core', name: 'seeds', key: 'newsletters_page_version' } as const;
  if ((Number(await strapi.store.get(key)) || 0) >= 1) return;
  const docs = strapi.documents('api::newsletters-page.newsletters-page' as any) as any;
  const existing = await docs.findFirst();
  if (!existing) {
    await docs.create({ data: { ...NEWSLETTERS_HERO, labels: NEWSLETTERS_LABELS } });
  } else {
    const current = existing.labels && typeof existing.labels === 'object' ? existing.labels : {};
    await docs.update({ documentId: existing.documentId, data: { labels: { ...NEWSLETTERS_LABELS, ...current } } });
  }
  await strapi.store.set({ ...key, value: 1 });
}
