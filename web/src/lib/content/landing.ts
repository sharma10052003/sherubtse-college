import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiSingleResponse } from '../strapi';

export interface LandingCard {
  label: string;
  url: string;
  description: string;
  icon?: string;
}

export type Block =
  | { kind: 'text'; heading: string | null; paragraphs: string[] }
  | { kind: 'image-text'; heading: string | null; paragraphs: string[]; image_url: string | null; image_alt: string; side: 'left' | 'right' }
  | { kind: 'cta'; heading: string; text: string | null; button_label: string | null; button_url: string | null };

export interface LandingPage {
  eyebrow: string | null;
  heading: string;
  intro: string;
  featured: boolean;
  cards: LandingCard[];
  blocks: Block[];
  seo_description: string | null;
}

/** Overview pages are single types named `<section>-overview`. Returns null when
 * Strapi is unreachable or the page hasn't been filled in, so the caller can
 * show a friendly message instead of a blank page. */
export type OverviewType =
  | 'about-overview'
  | 'academics-overview'
  | 'admissions-overview'
  | 'research-overview'
  | 'student-life-overview'
  | 'news-notices-overview';

const paragraphs = (text: string | null | undefined) =>
  (text ?? '')
    .split(/\n{2,}/)
    .map((p) => p.replace(/�/g, '').trim())
    .filter(Boolean);

export async function getLandingPage(type: OverviewType): Promise<LandingPage | null> {
  const res = await strapiGet<StrapiSingleResponse<any>>(type, {
    populate: {
      cards: true,
      seo: true,
      sections: {
        on: {
          'sections.rich-text': true,
          'sections.image-text': { populate: ['image'] },
          'sections.call-to-action': true,
        },
      },
    },
  });
  const row = res?.data;
  if (!row?.heading) return null;

  const blocks: Block[] = (row.sections ?? []).flatMap((s: any): Block[] => {
    switch (s.__component) {
      case 'sections.rich-text':
        return [{ kind: 'text', heading: s.heading ?? null, paragraphs: paragraphs(s.body) }];
      case 'sections.image-text':
        return [{
          kind: 'image-text',
          heading: s.heading ?? null,
          paragraphs: paragraphs(s.body),
          image_url: mediaUrl(s.image),
          image_alt: s.image_alt || s.image?.alternativeText || '',
          side: s.image_side === 'right' ? 'right' : 'left',
        }];
      case 'sections.call-to-action':
        return [{ kind: 'cta', heading: s.heading, text: s.text ?? null, button_label: s.button_label ?? null, button_url: s.button_url ?? null }];
      default:
        return [];
    }
  });

  return {
    eyebrow: row.eyebrow ?? null,
    heading: row.heading,
    intro: row.intro ?? '',
    featured: row.featured !== false,
    cards: (row.cards ?? []).map((c: any) => ({
      label: c.label,
      url: c.url,
      description: c.description ?? '',
      icon: c.icon || undefined,
    })),
    blocks,
    seo_description: row.seo?.description ?? null,
  };
}
