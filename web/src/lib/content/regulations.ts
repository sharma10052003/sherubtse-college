// The Academic Regulations page: hero text, key figures, regulation topics and wording, all from
// Strapi → Academics – Regulations Page. Nothing is written in the page itself.
import { strapiGet, mediaUrl } from '../strapi';

export interface Rule {
  title: string;
  text: string | null;
  highlight: string | null;
}
export interface Topic {
  key: string;
  title: string;
  icon: string;
  intro: string | null;
  items: Rule[];
}
export interface RegulationsPage {
  hero_eyebrow: string | null;
  hero_heading: string | null;
  hero_intro: string | null;
  key_figures: Rule[];
  topics: Topic[];
  source_note: string | null;
  wheel_label: string | null;
  wheel_url: string | null;
  labels: Record<string, string>;
}

const rule = (r: any): Rule => ({ title: r.title, text: r.text || null, highlight: r.highlight || null });

export async function getRegulationsPage(): Promise<RegulationsPage> {
  const res = await strapiGet<{ data: any }>('regulations-page', { populate: { key_figures: true, topics: { populate: { items: true } } } });
  const p = res?.data ?? null;
  const wheel = p?.wheel_url ? (String(p.wheel_url).startsWith('/') ? mediaUrl({ url: p.wheel_url }) : String(p.wheel_url)) : null;
  return {
    hero_eyebrow: p?.hero_eyebrow ?? null,
    hero_heading: p?.hero_heading ?? null,
    hero_intro: p?.hero_intro ?? null,
    key_figures: (p?.key_figures ?? []).filter((r: any) => r?.title).map(rule),
    topics: (p?.topics ?? [])
      .filter((t: any) => t?.title && t?.key)
      .map((t: any) => ({ key: String(t.key), title: t.title, icon: t.icon || 'book', intro: t.intro || null, items: (t.items ?? []).filter((r: any) => r?.title).map(rule) })),
    source_note: p?.source_note ?? null,
    wheel_label: p?.wheel_label ?? null,
    wheel_url: wheel,
    labels: p?.labels && typeof p.labels === 'object' ? p.labels : {},
  };
}
