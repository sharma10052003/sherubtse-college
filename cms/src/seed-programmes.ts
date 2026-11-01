import type { Core } from '@strapi/strapi';
import { PROGRAMME_SEED } from './seed-programme-data';

/**
 * Academics – Programmes: one-time content for the programme and department pages.
 *
 * 1. The College teaches ONE programme, the Bachelor of Economics and Political
 *    Science (its own website and the Admissions guide both say so), but Strapi
 *    held it as two: "Political Science" and "Economics". The Political Science
 *    record becomes the single programme (new name and address) and the Economics
 *    record is un-published (kept as a draft, nothing is deleted). Old addresses
 *    redirect (web/src/data/redirects.json).
 * 2. Empty programme fields are filled from the College's own programme pages
 *    (seed-programme-data.ts). Anything already entered is never overwritten.
 * 3. The three department descriptions are corrected to name the programmes each
 *    department actually teaches, unless staff have already changed them.
 * Runs once; after that everything is edited in Strapi.
 */

const STORE = { type: 'core', name: 'seeds', key: 'programme_content_version' } as const;
const VERSION = 1;
const PROGRAMME = 'api::programme.programme';
const DEPARTMENT = 'api::department.department';

const EPS_SLUG = 'economics-political-science';

const DEPARTMENT_TEXT: Record<string, { old: string; description: string; short: string }> = {
  'humanities-social-sciences': {
    old: 'Political Science, Digital Communication & Project Management, and Economics programmes.',
    description:
      'The Department of Humanities and Social Sciences teaches the Bachelor of Economics and Political Science and the Bachelor of Digital Communication and Project Management.',
    short: 'Economics, political science, digital communication and project management.',
  },
  'mathematical-data-sciences': {
    old: 'Bachelor of Data Science & Data Analytics, and BSc Mathematics programmes.',
    description: 'The Department of Mathematical and Data Sciences teaches the Bachelor of Data Science and Data Analytics and the BSc in Mathematics.',
    short: 'Data science, data analytics and mathematics.',
  },
  'natural-sciences': {
    old: 'BSc Life Science, BSc Chemistry, and BSc Physics programmes.',
    description: 'The Department of Natural Sciences teaches the BSc in Life Science, the BSc in Chemistry and the BSc in Physics.',
    short: 'Life science, chemistry and physics.',
  },
};

const blank = (v: unknown) => v == null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && v.length === 0);

export async function ensureProgrammeContent({ strapi }: { strapi: Core.Strapi }) {
  if ((Number(await strapi.store.get(STORE)) || 0) >= VERSION) return;
  const programmes = strapi.documents(PROGRAMME as any) as any;
  const departments = strapi.documents(DEPARTMENT as any) as any;

  // 1. Economics + Political Science are one programme.
  const ps = await programmes.findFirst({ filters: { slug: 'political-science' }, status: 'draft' });
  const eps = await programmes.findFirst({ filters: { slug: EPS_SLUG }, status: 'draft' });
  if (ps && !eps) {
    await programmes.update({
      documentId: ps.documentId,
      data: { programme_name: PROGRAMME_SEED[EPS_SLUG].programme_name, slug: EPS_SLUG },
    });
    await programmes.publish({ documentId: ps.documentId });
  }
  const economics = await programmes.findFirst({ filters: { slug: 'economics' }, status: 'draft' });
  if (economics) await programmes.unpublish({ documentId: economics.documentId });

  // 2. Fill empty programme fields from the College's own pages.
  const populate = { curriculum: true, testimonials: true };
  for (const [slug, seed] of Object.entries(PROGRAMME_SEED)) {
    const doc = await programmes.findFirst({ filters: { slug }, status: 'draft', populate });
    if (!doc) continue;
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(seed)) {
      if (key === 'programme_name') continue;
      if (blank(doc[key])) data[key] = value;
    }
    if (Object.keys(data).length === 0) continue;
    await programmes.update({ documentId: doc.documentId, data });
    await programmes.publish({ documentId: doc.documentId });
  }

  // 3. Department descriptions that name the programmes each one teaches.
  for (const [slug, text] of Object.entries(DEPARTMENT_TEXT)) {
    const dept = await departments.findFirst({ filters: { slug } });
    if (!dept) continue;
    const data: Record<string, unknown> = {};
    if (dept.description === text.old) data.description = text.description;
    if (blank(dept.short_description)) data.short_description = text.short;
    if (Object.keys(data).length) await departments.update({ documentId: dept.documentId, data });
  }

  await strapi.store.set({ ...STORE, value: VERSION });
}
