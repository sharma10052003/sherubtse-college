import type { Core } from '@strapi/strapi';
import { applyAdminHelp, type HelpMap } from './admin-help';

/**
 * Administrative Units (About → Administrative Units): one-time starter
 * content and admin help.
 *
 * The seven offices are the ones listed on the official Contact page
 * (www.sherubtse.edu.bt/contact-us, updated 23 July 2026) and already held
 * in Contact – Offices. Each unit links to its office record, so the head's
 * name, designation, email, phone and photo are kept in one place. The only
 * extra facts are from official pages: the DSA chairs the Games and Sports
 * Committee (Games & Sports page), DRIL helps international students with
 * visas (Fees & Financial Support page), the Exam Cell handles admission
 * result queries and document verification (2026 admission notices).
 * Runs once per SEED_VERSION; never overwrites anything already entered.
 */

const SEED_VERSION = 1;
const STORE = { type: 'core', name: 'seeds', key: 'units_version' } as const;
const UNIT = 'api::unit.unit';
const CAT = 'api::unit-category.unit-category';
const PAGE = 'api::units-page.units-page';
const OFFICE = 'api::contact-person.contact-person';

export async function ensureUnitsContent({ strapi }: { strapi: Core.Strapi }) {
  const done = Number(await strapi.store.get(STORE)) || 0;
  if (done < SEED_VERSION) {
    await seed(strapi);
    await strapi.store.set({ ...STORE, value: SEED_VERSION });
  }
  await applyAdminHelp({
    strapi,
    help: HELP,
    prefixes: ['content_types::api::unit-category', 'content_types::api::units-page', 'components::units.'],
    storeKey: 'units_main_fields_set',
  });
}

async function seed(strapi: Core.Strapi) {
  const docs = (uid: string) => strapi.documents(uid as any) as any;

  // ---- Categories (only those with real offices) ----
  let cats: any[] = await docs(CAT).findMany({});
  if (cats.length === 0) {
    const list = [
      ['Executive Leadership & Governance', 'executive-leadership', 'The College’s leadership and governance.'],
      ['Academic Administration', 'academic-administration', 'Programmes, curriculum, examinations and academic records.'],
      ['Research & Innovation', 'research-innovation', 'Research, grants and partnerships.'],
      ['Student Affairs & Support', 'student-affairs-support', 'Student welfare and campus life.'],
      ['Administration & General Services', 'administration', 'General administration and institutional operations.'],
      ['Information & Communication Technology', 'ict', 'Campus systems, networks and digital services.'],
    ];
    for (const [i, [name, slug, description]] of list.entries()) {
      await docs(CAT).create({ data: { name, slug, description, display_order: i + 1, is_active: true } });
    }
    cats = await docs(CAT).findMany({});
  }
  const cat = (slug: string) => cats.find((c) => c.slug === slug)?.documentId;
  const office = async (title: string) => (await docs(OFFICE).findFirst({ filters: { group_title: { $eqi: title } }, status: 'published' }))?.documentId;

  const units: any[] = [
    {
      slug: 'office-of-the-president', name: 'Office of the President', category: 'executive-leadership', office: 'Office of the President',
      summary: 'Executive leadership and overall governance of the College.', is_featured: true, display_order: 1,
    },
    {
      slug: 'academic-affairs', name: 'Academic Affairs', category: 'academic-administration', office: 'Academic Affairs',
      summary: 'Academic programmes, curriculum, and faculty affairs.', display_order: 2,
    },
    {
      slug: 'examination-and-records', name: 'Examination & Records', category: 'academic-administration', office: 'Examination & Records',
      summary: 'Examination administration and academic records.', display_order: 3,
      responsibilities: [
        { title: 'Examination administration' },
        { title: 'Academic records' },
        { title: 'Admission results', description: 'Answers queries about admission results; admission verification requires original documents.' },
      ],
    },
    {
      slug: 'office-of-research-and-industrial-linkages', name: 'Office of Research and Industrial Linkages', category: 'research-innovation', office: 'Research & Industrial Linkages',
      summary: 'Research initiatives, grants, and industry partnerships.', is_featured: true, display_order: 4,
      responsibilities: [
        { title: 'Research initiatives and grants' },
        { title: 'Industry partnerships' },
        { title: 'Research centres', description: 'Oversees the College’s research centres.' },
      ],
      services: [{ title: 'Visa assistance for international students', description: 'The Liaison Officer (lo.sherubtse@rub.edu.bt) can help with the visa application process.' }],
      links: [{ label: 'Research centres', url: '/research/centres' }],
    },
    {
      slug: 'student-affairs', name: 'Student Affairs', category: 'student-affairs-support', office: 'Student Affairs',
      summary: 'Student welfare, discipline, and campus life.', display_order: 5,
      responsibilities: [
        { title: 'Student welfare' },
        { title: 'Discipline' },
        { title: 'Campus life' },
        { title: 'Games and sports', description: 'The Dean of Student Affairs chairs the College’s Games and Sports Committee.' },
      ],
      location: 'Student Service Village',
      links: [{ label: 'Happiness & Well-being Center', url: '/about/campus-facilities/happiness-wellbeing-center' }],
    },
    {
      slug: 'administration', name: 'Administration', category: 'administration', office: 'Administration',
      summary: 'General administration and institutional operations.', display_order: 6,
    },
    {
      slug: 'ict-and-digital-services', name: 'ICT & Digital Services', category: 'ict', office: 'ICT & Digital Services',
      summary: 'Technical support for Wi-Fi, campus systems, and digital services.', display_order: 7,
      services: [{ title: 'ICT support', description: 'Wi-Fi, college systems, student and staff accounts, the website, network access and other ICT services.' }],
      links: [{ label: 'Get ICT support', url: '/about/contact#ict-support' }],
    },
  ];

  for (const u of units) {
    const existing = await docs(UNIT).findFirst({ filters: { slug: u.slug }, status: 'draft', populate: ['category', 'office', 'responsibilities', 'services', 'links'] });
    const officeId = await office(u.office);
    const fill: Record<string, unknown> = {};
    const setIfEmpty = (key: string, value: unknown) => {
      const current = existing?.[key];
      if (value !== undefined && (current === null || current === undefined || current === '' || (Array.isArray(current) && current.length === 0))) fill[key] = value;
    };
    setIfEmpty('summary', u.summary);
    setIfEmpty('category', cat(u.category));
    setIfEmpty('office', officeId);
    setIfEmpty('responsibilities', u.responsibilities);
    setIfEmpty('services', u.services);
    setIfEmpty('location', u.location);
    setIfEmpty('links', u.links);
    if (!existing || !existing.display_order) fill.display_order = u.display_order;
    if (u.is_featured && !existing?.is_featured) fill.is_featured = true;

    if (existing) {
      if (Object.keys(fill).length) {
        await docs(UNIT).update({ documentId: existing.documentId, data: fill });
        if (existing.publishedAt || (await docs(UNIT).findFirst({ filters: { slug: u.slug }, status: 'published' }))) {
          await docs(UNIT).publish({ documentId: existing.documentId });
        }
      }
    } else {
      await docs(UNIT).create({
        status: 'published',
        data: { name: u.name, slug: u.slug, kind: 'administrative', description: u.summary, last_reviewed: '2026-10-14', ...fill },
      });
    }
  }

  // ---- Page settings ----
  const page = await docs(PAGE).findFirst({ status: 'draft' });
  if (!page) {
    const created = await docs(PAGE).create({
      data: {
        eyebrow: 'About Sherubtse',
        title: 'Our Administrative Units',
        subtitle: 'The people, offices, and teams that drive Sherubtse College forward.',
        intro: 'From governance and academic administration to research, student affairs and digital services, these offices keep the College running — supporting teaching, research and the everyday life of every student and member of staff.',
        featured_heading: 'Leadership Offices',
        featured_intro: 'The offices that lead the College and its research.',
        directory_heading: 'All Administrative Units',
        directory_intro: 'Every administrative office of the College, with its head and contact details.',
        empty_message: 'Administrative units will be listed here soon.',
        seo: { title: 'Administrative Units', description: 'The administrative offices of Sherubtse College: leadership, academic affairs, examinations, research, student affairs, administration and ICT.' },
      },
    });
    await docs(PAGE).publish({ documentId: created.documentId });
  }
}

const HELP: HelpMap = {
  'content_types::api::unit.unit': {
    fields: {
      summary: 'One or two sentences for the directory card (300 characters max).',
      category: 'Directory category (About – Administrative Units: Categories).',
      office: 'Office in Contact – Offices. Its head, designation, email, phone and photo are used unless overridden below.',
      head_name: 'Only if different from the linked office’s contact person.',
      head_designation: 'Only if different from the linked office’s role title.',
      head_portrait: 'Official portrait of the current head (head and shoulders, 4:5). Leave empty to use the office photo or initials.',
      head_portrait_alt: 'e.g. “Portrait of Sonam Dendup, Dean of Academic Affairs”.',
      responsibilities: 'Key responsibilities — only verified ones.',
      services: 'Services the unit provides to students, staff or the public.',
      location: 'Office location, if verified.',
      display_order: 'Lower numbers appear first.',
      is_featured: 'Show in the large Leadership Offices section.',
    },
  },
  'content_types::api::unit-category.unit-category': {
    mainField: 'name',
    fields: { slug: 'Used in filter links. Do not change once in use.', is_active: 'Untick to hide this category.', display_order: 'Lower numbers appear first.' },
  },
  'content_types::api::units-page.units-page': {
    fields: {
      eyebrow: 'Small label above the heading.',
      hero_image: 'Optional campus photograph behind the heading.',
      featured_heading: 'Heading above the featured (leadership) offices.',
      directory_heading: 'Heading above the searchable directory.',
      empty_message: 'Shown when no administrative units are published.',
    },
  },
};
