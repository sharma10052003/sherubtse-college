import { strapiGet, mediaUrl } from '../strapi';

export type MissionTheme = 'learning' | 'research';
export type ValueIcon = 'professionalism' | 'innovation' | 'learning' | 'ownership' | 'community' | 'excellence';

export interface MissionItem {
  title: string;
  statement: string;
  theme: MissionTheme;
}

export interface CoreValue {
  name: string;
  description: string;
  icon: ValueIcon;
}

export interface VisionMissionPage {
  hero_eyebrow: string;
  hero_heading: string;
  hero_intro: string;
  hero_image_url: string | null;
  vision_statement: string;
  vision_highlights: string[];
  missions: MissionItem[];
  core_values: CoreValue[];
  closing_note: string;
  seo_description: string | null;
}

// The approved wording, used whenever the CMS entry is missing or a field
// is left blank — the page must never show a half-empty statement.
const FALLBACK: VisionMissionPage = {
  hero_eyebrow: 'WHO WE ARE',
  hero_heading: 'Vision, Mission & Core Values',
  hero_intro: 'Inspiring knowledge, nurturing values, and shaping a better future through Liberal Arts and Sciences.',
  hero_image_url: null,
  vision_statement: 'An internationally recognized institute in Liberal Arts and Sciences with an emphasis on GNH value based learning.',
  vision_highlights: ['internationally recognized', 'Liberal Arts and Sciences', 'GNH value based learning'],
  missions: [
    {
      title: 'Inspired Learning',
      statement: 'To provide GNH inspired quality tertiary education in Liberal Arts and Sciences.',
      theme: 'learning',
    },
    {
      title: 'Knowledge for Society',
      statement: 'To contribute to the development of knowledge-based society through knowledge creation, sharing and advocacy.',
      theme: 'research',
    },
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
  seo_description: null,
};

const ICONS: ValueIcon[] = ['professionalism', 'innovation', 'learning', 'ownership', 'community', 'excellence'];

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export async function getVisionMissionPage(): Promise<VisionMissionPage> {
  const res = await strapiGet<{ data: any }>('vision-mission-page', {
    populate: ['hero_image', 'missions', 'core_values'],
  });
  const row = res?.data;
  if (!row) return FALLBACK;

  const highlights = typeof row.vision_highlights === 'string'
    ? row.vision_highlights.split('\n').map((s: string) => s.trim()).filter(Boolean)
    : [];
  const missions: MissionItem[] = (row.missions ?? [])
    .filter((m: any) => m?.statement)
    .map((m: any) => ({ title: text(m.title, ''), statement: m.statement.trim(), theme: m.theme === 'research' ? 'research' : 'learning' }));
  const values: CoreValue[] = (row.core_values ?? [])
    .filter((v: any) => v?.name)
    .map((v: any, i: number) => ({
      name: v.name.trim(),
      description: text(v.description, ''),
      icon: ICONS.includes(v.icon) ? v.icon : ICONS[i % ICONS.length],
    }));

  return {
    hero_eyebrow: text(row.hero_eyebrow, FALLBACK.hero_eyebrow),
    hero_heading: text(row.hero_heading, FALLBACK.hero_heading),
    hero_intro: text(row.hero_intro, FALLBACK.hero_intro),
    hero_image_url: mediaUrl(row.hero_image),
    vision_statement: text(row.vision_statement, FALLBACK.vision_statement),
    vision_highlights: highlights.length ? highlights : FALLBACK.vision_highlights,
    missions: missions.length ? missions : FALLBACK.missions,
    core_values: values.length ? values : FALLBACK.core_values,
    closing_note: text(row.closing_note, FALLBACK.closing_note),
    seo_description: row.seo_description ?? null,
  };
}
