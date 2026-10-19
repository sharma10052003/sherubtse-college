import type { Core } from '@strapi/strapi';
import { applyAdminHelp, type HelpMap } from './admin-help';

/**
 * Campus Facilities (About → Campus Facilities): one-time starter content and
 * admin help text.
 *
 * Starter content uses only the supplied Library and Laboratories text and
 * facts published on www.sherubtse.edu.bt (Games & Sports, Accommodation,
 * Happiness & Well-being Center, Health Unit, E-Books and Journals pages,
 * read 14 Oct 2026). No photographs are added — real campus photos are
 * uploaded by staff. Runs once per SEED_VERSION; only fills empty content.
 */

const SEED_VERSION = 2;
const STORE = { type: 'core', name: 'seeds', key: 'facilities_version' } as const;

const UID = {
  page: 'api::facilities-page.facilities-page',
  category: 'api::facility-category.facility-category',
  facility: 'api::facility.facility',
  link: 'api::facility-quick-link.facility-quick-link',
} as const;

const LIBRARY_TEXT =
  'The Sherubtse College Library is the largest and oldest academic library in Bhutan, offering a wealth of resources to support student and faculty research: a comprehensive collection of books and journals, e-books and online resources, dedicated study spaces, and a journal and reference section.';
const LAB_TEXT =
  'The College maintains state-of-the-art laboratory facilities designed to foster hands-on learning, scientific inquiry, and practical experimentation across disciplines: modern scientific equipment and tools for practical coursework, safe, supervised environments for advanced research and experiments, and resources tailored to the sciences, technology, and specialized academic programmes.';

const LINKS = {
  proquest: 'https://ebookcentral.proquest.com/auth/lib/sherubtsebt/login.action?returnURL=https%3A%2F%2Febookcentral.proquest.com%2Flib%2Fsherubtsebt%2Fhome.action',
  jstor: 'https://www.jstor.org/',
  vle: 'https://vle.sherubtse.edu.bt/',
  campusConnect: 'https://campusconnect.sherubtse.edu.bt/',
  campusMap: 'https://finalmap.sherubtse.edu.bt/',
  handbook: 'https://www.sherubtse.edu.bt/wp-content/uploads/2025/07/Student-Handbook-2025-2026-non-Academic.pdf',
  library: 'https://library.sherubtse.edu.bt/',
  labs: 'https://lab.sherubtse.edu.bt/',
  hwcBrochure: 'https://www.sherubtse.edu.bt/wp-content/uploads/2024/10/Sherubtse_HWC_Brochure_2024.pdf',
  hwcPlatform: 'https://sc.emcwub.pce.edu.bt/',
};

export async function ensureFacilitiesContent({ strapi }: { strapi: Core.Strapi }) {
  const done = Number(await strapi.store.get(STORE)) || 0;
  if (done < 1) await seed(strapi);
  if (done < 2) await editorialUpgrade(strapi);
  if (done < SEED_VERSION) await strapi.store.set({ ...STORE, value: SEED_VERSION });
  await applyAdminHelp({ strapi, help: HELP, prefixes: ['content_types::api::facilit', 'components::facilities.'], storeKey: 'facilities_main_fields_set' });
}

async function seed(strapi: Core.Strapi) {
  const docs = (uid: string) => strapi.documents(uid as any) as any;

  // ---- Categories (only ones with verified facilities) ----
  let categories: any[] = await docs(UID.category).findMany({});
  if (categories.length === 0) {
    const seed = [
      ['Library & Learning', 'library-learning', 'book', 'The College library and digital learning resources.'],
      ['Laboratories & Research', 'laboratories-research', 'flask', 'Laboratory facilities for practical learning and research.'],
      ['Sports & Recreation', 'sports-recreation', 'sport', 'Grounds, courts and indoor facilities for games and sports.'],
      ['Student Living', 'student-living', 'home', 'On-campus residences.'],
      ['Health & Well-being', 'health-wellbeing', 'heart', 'Counselling and health support on campus.'],
    ];
    for (const [i, [name, slug, icon, description]] of seed.entries()) {
      await docs(UID.category).create({ data: { name, slug, icon, description, display_order: i + 1, is_active: true } });
    }
    categories = await docs(UID.category).findMany({});
  }
  const cat = (slug: string) => categories.find((c) => c.slug === slug)?.documentId;

  // ---- Facilities ----
  const existing = await docs(UID.facility).findMany({ status: 'draft' });
  if (existing.length === 0) {
    const studentAffairs = (await docs('api::contact-person.contact-person').findFirst({ filters: { group_title: { $eqi: 'Student Affairs' } }, status: 'published' }))?.documentId;
    const facilities: any[] = [
      {
        name: 'Sherubtse College Library', slug: 'library', categories: [cat('library-learning')], display_mode: 'page', is_featured: true, display_order: 1,
        summary: 'The largest and oldest academic library in Bhutan.',
        content: `${LIBRARY_TEXT}\n\nSherubtse subscribes to ProQuest Ebook Central for e-books, and to JSTOR and EBSCOhost for online academic journals.`,
        features: [
          { title: 'Books & Journals', description: 'Academic reading and research resources.', icon: 'book' },
          { title: 'Digital Resources', description: 'E-books and online resources.', icon: 'screen' },
          { title: 'Study Spaces', description: 'Dedicated spaces for focused learning.', icon: 'study' },
          { title: 'Journal & Reference Section', description: 'Resources supporting academic research.', icon: 'journal' },
        ],
        links: [{ label: 'ProQuest Ebook Central', url: LINKS.proquest }, { label: 'JSTOR', url: LINKS.jstor }],
      },
      {
        name: 'Football Ground', slug: 'football-ground', categories: [cat('sports-recreation')], display_order: 10,
        summary: 'An international-size football ground with astro turf, also used for major College celebrations.',
        content: 'The College has an international size football ground with astro turf. Besides football matches, the ground is used for the celebration of major events.',
      },
      {
        name: 'Basketball Courts', slug: 'basketball-courts', categories: [cat('sports-recreation')], display_order: 11,
        summary: 'Two courts — one near the clock tower and one on Campus II.',
        content: 'The College has two basketball courts on campus — one located near the clock tower and the other on Campus II.',
        location: 'Near the clock tower, and on Campus II',
        access_conditions: 'Accessible to all of the Sherubtse family for practice and matches, except on Mondays (maintenance day).',
      },
      {
        name: 'Multipurpose Hall', slug: 'multipurpose-hall', categories: [cat('sports-recreation')], display_order: 12,
        summary: 'Three badminton courts and two table tennis tables, with the gymnasium inside.',
        content: 'The Multipurpose Hall has 3 badminton courts and 2 table tennis tables. The College gymnasium is located inside the hall.',
        features: [
          { title: 'Badminton', description: 'Three badminton courts.', icon: 'sport' },
          { title: 'Table tennis', description: 'Two table tennis tables.', icon: 'sport' },
        ],
      },
      {
        name: 'Gymnasium', slug: 'gymnasium', categories: [cat('sports-recreation')], display_order: 13,
        summary: 'An indoor gym with basic facilities for bodybuilding and other exercises.',
        content: 'The College has an indoor gymnasium located inside the Multipurpose Hall. It has basic facilities for bodybuilding and other exercises. A student trainer, supervised by the College coach, looks after the gym.',
        location: 'Inside the Multipurpose Hall',
      },
      {
        name: 'Courts, Futsal Ground & Archery Range', slug: 'courts-futsal-archery', categories: [cat('sports-recreation')], display_order: 14,
        summary: 'A volleyball court, a tennis court, a futsal ground and an archery range, plus snooker and indoor games.',
        content: 'The College also has a volleyball court near the College football field, one tennis court, one futsal ground and an archery range. In 2017 the College also established snooker and other indoor games.',
      },
      {
        name: 'Student Residences', slug: 'student-residences', categories: [cat('student-living')], display_order: 20,
        summary: '20 on-campus residences — 10 for female and 10 for male students — with free unlimited Wi-Fi.',
        content: [
          'Sherubtse has 20 on-campus residential accommodations (10 female residences and 10 male residences) with free unlimited Wi-Fi facilities.',
          '',
          '**Centrally catered residence halls.** There are three centrally catered residence halls for female students and two for male students, with meals from the common mess. All Year 1 students are allocated centrally catered residence halls during their first year.',
          '',
          '**Self-catering residence halls.** All students who have completed Year 1 are allocated self-catering residence halls. There are sixteen: 8 for male students and 8 for female students. Students manage their own meals.',
        ].join('\n'),
        features: [
          { title: 'Free Wi-Fi', description: 'Unlimited Wi-Fi in all residences.', icon: 'wifi' },
          { title: 'Year 1 halls', description: 'Centrally catered, with meals from the common mess.', icon: 'home' },
          { title: 'Self-catering halls', description: 'For students after Year 1.', icon: 'home' },
        ],
        links: [{ label: 'Accommodation and fees (Admissions)', url: '/admissions#fees' }],
      },
      {
        name: 'Happiness & Well-being Center', slug: 'happiness-wellbeing-center', categories: [cat('health-wellbeing')], display_mode: 'page', display_order: 30,
        summary: 'Counselling services for students and staff, established in February 2016.',
        content: [
          'The Happiness and Well-being Center (HWC) is the College’s counselling service center, run by well-trained co-counsellors. It was established in February 2016 to provide counselling services to students and staff of the College.',
          '',
          '**Vision.** To promote an on-campus culture of wellness that ensures happiness, psychological well-being and lifelong success.',
          '',
          '**Mission.** To create and provide an environment that fosters students’ growth, development and psychological well-being through counselling services and awareness programmes.',
        ].join('\n'),
        features: [
          { title: 'One-to-one counselling', icon: 'people' },
          { title: 'Group counselling', icon: 'people' },
          { title: 'Mindfulness and yoga', icon: 'heart' },
          { title: 'Stress and time management', icon: 'clock' },
          { title: 'Self-awareness and self-leadership', icon: 'star' },
          { title: 'Monthly newsletter', icon: 'journal' },
        ],
        location: 'Student Service Village, top floor, above the office of the DSA (rear of the cafeteria road)',
        building: 'Student Service Village',
        contact: studentAffairs,
        links: [
          { label: 'HWC brochure (PDF)', url: LINKS.hwcBrochure },
          { label: 'HWC digital platform (online counselling)', url: LINKS.hwcPlatform },
        ],
      },
      {
        name: 'Health Unit', slug: 'health-unit', categories: [cat('health-wellbeing')], display_order: 31,
        summary: 'A health room where students and staff can get basic medicines, first aid and simple check-ups.',
        content:
          'The Sherubtse Health Unit is a health room on campus where students and staff can get necessary medicines and items such as bandages, contraceptives and first-aid kits, a check-up such as blood pressure, or advice when they are not feeling well. It also provides health-related awareness to students and the Kanglung community.',
        location: 'Health room, Student Service Village',
        building: 'Student Service Village',
      },
    ];
    for (const f of facilities) {
      const data = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== undefined));
      if (Array.isArray(data.categories)) data.categories = data.categories.filter(Boolean);
      await docs(UID.facility).create({ data, status: 'published' });
    }
  }

  // ---- Quick links (official destinations) ----
  const links = await docs(UID.link).findMany({});
  if (links.length === 0) {
    const seed: any[] = [
      ['ProQuest Ebook Central', 'E-books from the College’s ebook provider.', LINKS.proquest, 'screen', true],
      ['JSTOR', 'Academic journal articles, books and primary sources.', LINKS.jstor, 'journal', true],
      ['Virtual Learning Environment (VLE)', 'Online learning for Sherubtse courses.', LINKS.vle, 'screen', true],
      ['Campus Connect', 'The College’s online student services.', LINKS.campusConnect, 'link', true],
      ['Campus map', 'The College’s own interactive campus map.', LINKS.campusMap, 'pin', true],
      ['Student Handbook 2025–2026', 'Student life, rules and services.', LINKS.handbook, 'book', true],
      ['ICT support', 'Wi-Fi, accounts and other ICT services.', '/about/contact#ict-support', 'wifi', true],
      // Listed on the official site, but these addresses did not resolve when
      // checked — switched off until ICT confirms them.
      ['Library catalogue', 'The College library website.', LINKS.library, 'book', false],
      ['Laboratories website', 'The College laboratories website.', LINKS.labs, 'flask', false],
    ];
    for (const [i, [label, description, url, icon, active]] of seed.entries()) {
      await docs(UID.link).create({ data: { label, description, url, icon, link_type: url.startsWith('/') ? 'internal' : 'external', display_order: i + 1, is_active: active } });
    }
  }

  // ---- Page settings ----
  const page = await docs(UID.page).findFirst({ status: 'draft' });
  if (!page) {
    const created = await docs(UID.page).create({
      data: {
        title: 'Campus Facilities',
        eyebrow: 'Life on Campus',
        intro: 'Explore the learning spaces, research resources, and campus facilities that support academic excellence, discovery, and student life at Sherubtse College.',
        quick_nav: [
          { label: 'Library', target: '#library', is_visible: true },
          { label: 'Laboratories', target: '#laboratories', is_visible: true },
          // No verified records yet — shown once staff add them.
          { label: 'Learning & Research Spaces', target: '?category=library-learning#facilities', is_visible: false },
          { label: 'Student Facilities', target: '?category=student-living#facilities', is_visible: true },
          { label: 'Explore All Facilities', target: '#facilities', is_visible: true },
        ],
        library: {
          heading: 'Sherubtse College Library',
          intro: LIBRARY_TEXT,
          image_position: 'left',
          features: [
            { title: 'Books & Journals', description: 'Academic reading and research resources.', icon: 'book' },
            { title: 'Digital Resources', description: 'E-books and online resources.', icon: 'screen' },
            { title: 'Study Spaces', description: 'Dedicated spaces for focused learning.', icon: 'study' },
            { title: 'Journal & Reference Section', description: 'Resources supporting academic research.', icon: 'journal' },
          ],
          more_heading: 'Online resources',
          more_content:
            'Sherubtse has selected ProQuest Ebook Central as a key ebook provider, and subscribes to JSTOR and EBSCOhost for online academic journals. JSTOR provides access to more than 12 million academic journal articles, books and primary sources in 75 disciplines.',
          links: [{ label: 'ProQuest Ebook Central', url: LINKS.proquest }, { label: 'JSTOR', url: LINKS.jstor }],
        },
        laboratories: {
          heading: 'Laboratories',
          intro: LAB_TEXT,
          image_position: 'right',
          features: [
            { title: 'Practical Learning', description: 'Equipment and tools supporting hands-on coursework.', icon: 'tools' },
            { title: 'Scientific Inquiry', description: 'Environments that encourage investigation and discovery.', icon: 'microscope' },
            { title: 'Research & Experimentation', description: 'Supervised spaces for practical experiments.', icon: 'shield' },
            { title: 'Discipline-Specific Resources', description: 'Facilities supporting relevant scientific, technological, and specialised academic programmes.', icon: 'atom' },
          ],
        },
        messages: {
          no_facilities: 'Facility details are being added. Please check back soon.',
          no_filter_results: 'No facilities match your search. Try another word or category.',
          no_gallery: 'Campus photographs will be added soon.',
          no_lab_profiles: '',
        },
        sections: [
          { __component: 'facilities.section-index', heading: 'Facility Index', anchor: 'index', is_visible: true, columns: 'three' },
          { __component: 'facilities.section-library', heading: 'Library', anchor: 'library', background: 'white', is_visible: true },
          {
            __component: 'facilities.section-laboratories', heading: 'Laboratories', anchor: 'laboratories', background: 'navy', is_visible: true,
            ...(cat('laboratories-research') ? { profiles_category: cat('laboratories-research') } : {}),
          },
          {
            __component: 'facilities.section-directory', heading: 'Explore Campus Facilities', intro: 'Spaces for study, sport, living and well-being across the Kanglung campus.',
            anchor: 'facilities', background: 'soft', is_visible: true, columns: 'three', card_style: 'image_top', show_search: true, show_filters: true,
          },
          { __component: 'facilities.section-gallery', heading: 'Campus Gallery', anchor: 'gallery', background: 'white', is_visible: true, layout: 'mosaic', show_filters: true, limit: 24 },
          { __component: 'facilities.section-links', heading: 'Useful Links', anchor: 'links', background: 'soft', is_visible: true, columns: 'four' },
        ],
        seo: {
          title: 'Campus Facilities',
          description: 'The library, laboratories, sports grounds, residences and well-being services at Sherubtse College, Kanglung.',
        },
      },
    });
    await docs(UID.page).publish({ documentId: created.documentId });
  }

}

/**
 * v2 — editorial redesign: adds the "Life on Campus" label, links the Library
 * feature to the Library facility (its details then expand in place and it
 * isn't repeated as a story), and puts the Facility Index first. Sections and
 * the Library block are rebuilt from their current saved values, so anything
 * an admin already changed is kept.
 */
async function editorialUpgrade(strapi: Core.Strapi) {
  const docs = (uid: string) => strapi.documents(uid as any) as any;
  const page = await docs(UID.page).findFirst({
    status: 'draft',
    populate: {
      library: { populate: { image: true, gallery: true, features: true, links: true, documents: { populate: ['file'] }, facility: true } },
      sections: { on: {
        'facilities.section-index': { populate: '*' },
        'facilities.section-library': { populate: '*' },
        'facilities.section-laboratories': { populate: ['profiles_category'] },
        'facilities.section-directory': { populate: '*' },
        'facilities.section-gallery': { populate: '*' },
        'facilities.section-links': { populate: '*' },
        'sections.rich-text': { populate: '*' },
        'sections.image-text': { populate: ['image'] },
        'sections.call-to-action': { populate: '*' },
      } },
    },
  });
  if (!page) return;
  const changes: Record<string, unknown> = {};
  if (!page.eyebrow) changes.eyebrow = 'Life on Campus';

  const libraryFacility = await docs(UID.facility).findFirst({ filters: { slug: 'library' }, status: 'draft' });
  const lib = page.library;
  if (lib && !lib.facility && libraryFacility) {
    const strip = ({ id, ...rest }: any) => ({ id, ...rest });
    changes.library = {
      id: lib.id,
      label: lib.label ?? null,
      heading: lib.heading,
      intro: lib.intro,
      image: lib.image?.id ?? null,
      image_alt: lib.image_alt,
      image_position: lib.image_position,
      features: (lib.features ?? []).map(strip),
      more_heading: lib.more_heading,
      more_content: lib.more_content,
      gallery: (lib.gallery ?? []).map((m: any) => m.id),
      links: (lib.links ?? []).map(strip),
      documents: (lib.documents ?? []).map((d: any) => ({ id: d.id, label: d.label, file: d.file?.id ?? null })),
      facility: libraryFacility.documentId,
    };
  }

  const sections: any[] = page.sections ?? [];
  if (!sections.some((s) => s.__component === 'facilities.section-index')) {
    const keep = sections.map((s) => {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(s)) {
        if (v && typeof v === 'object' && !Array.isArray(v) && (v as any).documentId) out[k] = (v as any).documentId;
        else if (Array.isArray(v) && v[0]?.documentId) out[k] = v.map((x: any) => x.documentId);
        else if (Array.isArray(v) && v[0]?.mime) out[k] = v.map((x: any) => x.id);
        else if (v && typeof v === 'object' && (v as any).mime) out[k] = (v as any).id;
        else out[k] = v;
      }
      return out;
    });
    changes.sections = [{ __component: 'facilities.section-index', heading: 'Facility Index', anchor: 'index', is_visible: true, columns: 'three' }, ...keep];
  }

  if (Object.keys(changes).length) {
    await docs(UID.page).update({ documentId: page.documentId, data: changes });
    await docs(UID.page).publish({ documentId: page.documentId });
  }
}

// ---------------------------------------------------------------- admin help

const SECTION: Record<string, string> = {
  heading: 'Section heading.',
  intro: 'Short text under the heading.',
  anchor: 'Link name for this section, e.g. “library” for #library. Letters, numbers and dashes only.',
  background: 'Section background.',
  is_visible: 'Untick to hide this section without deleting it.',
};
const HELP: HelpMap = {
  'content_types::api::facilities-page.facilities-page': {
    fields: {
      eyebrow: 'Small label above the heading, e.g. “Life on Campus”.',
      hero_caption: 'Caption under the opening photo.',
      title: 'Page heading.',
      intro: 'Text under the heading.',
      hero_images: 'One photo, or several to show as a slow slideshow. Use real Sherubtse photographs only.',
      hero_image_alt: 'Describe the hero photo for screen readers.',
      quick_nav: 'Links under the heading. Untick “Is visible” to hide one.',
      library: 'The Library feature: text, photo, feature cards, more information, links and documents.',
      laboratories: 'The Laboratories feature. Individual laboratory profiles are Facilities in the chosen category.',
      messages: 'Text shown when a section has nothing to show.',
      sections: 'The page, top to bottom. Add, drag to reorder, or untick “Is visible” to hide a section.',
      seo: 'Search-engine title, description and sharing image.',
    },
  },
  'content_types::api::facility-category.facility-category': {
    mainField: 'name',
    fields: {
      slug: 'Used in filter links (?category=slug). Do not change once in use.',
      display_order: 'Lower numbers appear first.',
      is_active: 'Untick to hide this category and its filter.',
    },
  },
  'content_types::api::facility.facility': {
    mainField: 'name',
    fields: {
      slug: 'Web address of the facility page (/about/campus-facilities/slug).',
      categories: 'One or more categories.',
      summary: 'One or two sentences for the card (280 characters max).',
      content: 'Overview and purpose. Only confirmed information.',
      main_image: 'Card and header photo. Use a real Sherubtse photograph.',
      image_alt: 'Describe the main photo for screen readers.',
      images: 'More photographs, shown in the detail view.',
      features: 'Resources and services, as short highlight cards.',
      uses: 'Academic or student uses, if useful.',
      location: 'Only if verified.',
      opening_hours: 'Only if confirmed.',
      access_conditions: 'Who may use it and when, if confirmed.',
      accessibility: 'Accessibility information, if verified.',
      policies: 'Relevant rules or guidelines.',
      department: 'Responsible unit or department (optional).',
      contact: 'Office to contact, from Contact – Offices.',
      contact_note: 'Short note shown with the contact, e.g. “Book through the DSA office”.',
      display_mode: 'Page: own web page, linked from its story. Panel: details expand inside its story. Card only: summary only.',
      is_featured: 'Show first in the directory.',
      display_order: 'Lower numbers appear first.',
    },
  },
  'content_types::api::facility-gallery-image.facility-gallery-image': {
    mainField: 'caption',
    fields: {
      alt_text: 'Describe the photo for screen readers (required).',
      category: 'Used for the gallery filters.',
      facility: 'Also show this photo on the facility’s detail view (optional).',
      is_featured: 'Show larger in the gallery.',
      display_order: 'Lower numbers appear first.',
    },
  },
  'content_types::api::facility-quick-link.facility-quick-link': {
    mainField: 'label',
    fields: {
      url: 'Page address (e.g. /about/contact) or full https:// link. Check it works before activating.',
      link_type: 'External links open in a new tab.',
      is_active: 'Untick to hide the link.',
    },
  },
  'components::facilities.feature-block': {
    fields: {
      label: 'Small label beside the running number, e.g. “Feature”. Leave empty for “Feature”.',
      image_position: 'Which side the photo sits on, on wide screens.',
      facility: 'Facility record whose details expand under this feature (it is then not repeated as a story).',
      more_heading: 'Heading for the expandable “more information” part.',
      more_content: 'Extra information, shown when a visitor expands it.',
      gallery: 'A few extra photos shown as a strip.',
      documents: 'Official guides or documents to download.',
    },
  },
  'components::facilities.nav-link': { fields: { target: '#library, #laboratories, #facilities, ?category=slug#facilities, or a page address.' } },
  'components::facilities.section-index': { fields: { ...SECTION, columns: 'Columns of index entries on wide screens.' } },
  'components::facilities.section-library': { fields: { ...SECTION } },
  'components::facilities.section-laboratories': { fields: { ...SECTION, profiles_category: 'Facilities in this category appear as laboratory profiles.' } },
  'components::facilities.section-directory': { fields: { ...SECTION, layout: 'Alternating: photos switch sides story by story. List: compact rows.', expand_label: 'Wording of the button that reveals a facility’s details.', show_search: 'Not used in the editorial design.', show_filters: 'Not used in the editorial design.', columns: 'Not used in the editorial design.', card_style: 'Not used in the editorial design.' } },
  'components::facilities.section-gallery': { fields: { ...SECTION, layout: 'Even grid, or a mosaic with featured photos larger.', limit: 'Maximum number of photos shown.' } },
  'components::facilities.section-links': { fields: { ...SECTION, columns: 'Cards per row on wide screens.' } },
};
