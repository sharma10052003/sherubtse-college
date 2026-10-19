import type { Core } from '@strapi/strapi';

const UID = 'api::vision-mission-page.vision-mission-page';

/**
 * Creates the Vision, Mission & Core Values entry with the approved wording
 * the first time Strapi boots with this content type, so admins open a
 * filled-in form rather than an empty one. Never overwrites an existing
 * entry — once it exists, the admin panel is the only place it changes.
 */
export async function ensureVisionMissionPage({ strapi }: { strapi: Core.Strapi }) {
  const existing = await strapi.documents(UID as any).findFirst();
  if (existing) return;

  await strapi.documents(UID as any).create({
    data: {
      hero_eyebrow: 'WHO WE ARE',
      hero_heading: 'Vision, Mission & Core Values',
      hero_intro: 'Inspiring knowledge, nurturing values, and shaping a better future through Liberal Arts and Sciences.',
      vision_statement: 'An internationally recognized institute in Liberal Arts and Sciences with an emphasis on GNH value based learning.',
      vision_highlights: 'internationally recognized\nLiberal Arts and Sciences\nGNH value based learning',
      missions: [
        { title: 'Inspired Learning', statement: 'To provide GNH inspired quality tertiary education in Liberal Arts and Sciences.', theme: 'learning' },
        { title: 'Knowledge for Society', statement: 'To contribute to the development of knowledge-based society through knowledge creation, sharing and advocacy.', theme: 'research' },
      ],
      core_values: [
        { name: 'Professionalism', icon: 'professionalism', description: 'Integrity, responsibility and ethical conduct in everything we teach, study and serve.' },
        { name: 'Innovation', icon: 'innovation', description: 'Creative thinking and fresh approaches to the challenges facing Bhutan and the wider world.' },
        { name: 'Passion for Learning', icon: 'learning', description: 'Curiosity, exploration and a lifelong love of learning, inside and beyond the classroom.' },
        { name: 'Sense of ownership', icon: 'ownership', description: 'Accountability, commitment and stewardship of our college, our work and our shared future.' },
        { name: 'Community Services', icon: 'community', description: 'Service, collaboration and a positive contribution to the communities around us.' },
        { name: 'Academic Excellence', icon: 'excellence', description: 'Quality education, critical inquiry and continuous improvement in teaching and research.' },
      ],
      closing_note:
        'Our vision sets where we are headed, our mission is how we get there, and our core values guide every step — together, in the spirit of Gross National Happiness.',
      seo_description: 'The vision, mission and core values of Sherubtse College, Royal University of Bhutan.',
    } as any,
  });
}
