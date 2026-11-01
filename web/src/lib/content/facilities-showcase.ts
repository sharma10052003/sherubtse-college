import type { Category, Facility, FacilitiesPage, FeatureBlock, GalleryImage, Image, Section } from './facilities';

/**
 * Turns the Campus Facilities content (page settings, the Library and
 * Laboratories blocks, facility records and the gallery) into what the
 * "campus explorer" shows: one list of showcase items, hero slides and a tile
 * per facility category. Nothing is invented: an item without a photograph
 * simply has no image and is drawn as an icon panel.
 */

export interface ShowItem {
  key: string;
  name: string;
  categories: Category[];
  summary: string | null;
  image: Image | null;
  location: string | null;
  /** The facility's own page, when its Display mode in Strapi is "Page". */
  href: string | null;
  /** Opens the details dialog. */
  hasDetails: boolean;
  facility: Facility | null;
  block: FeatureBlock | null;
  icon: string;
}

export interface Slide {
  url: string;
  alt: string;
  caption: string | null;
}

export interface CategoryTile {
  category: Category;
  count: number;
  image: Image | null;
}

/** First sentence of rich text, kept short enough for a panel. */
export function summaryFrom(html: string | null | undefined): string | null {
  const text = (html ?? '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  let cut = text;
  const colon = text.indexOf(':');
  if (colon > 40 && colon < 260) cut = text.slice(0, colon);
  else {
    const stop = text.search(/[.!?](\s|$)/);
    if (stop > 40) cut = text.slice(0, stop);
  }
  if (cut.length > 220) cut = cut.slice(0, 220).replace(/\s+\S*$/, '') + '…';
  return /[.!?…]$/.test(cut) ? cut : `${cut}.`;
}

const uniqueImages = (list: (Image | null | undefined)[]): Image[] => {
  const seen = new Set<string>();
  const out: Image[] = [];
  for (const im of list) {
    if (im && !seen.has(im.url)) {
      seen.add(im.url);
      out.push(im);
    }
  }
  return out;
};

interface Args {
  page: FacilitiesPage;
  categories: Category[];
  facilities: Facility[];
  gallery: GalleryImage[];
  sections: Section[];
}

export function buildShowcase({ page, categories, facilities, gallery, sections }: Args) {
  const bySlug = (slug: string | null | undefined) => (slug ? facilities.find((f) => f.slug === slug) ?? null : null);
  const photosOf = (slug: string) => gallery.filter((g) => g.facility_slug === slug).map((g) => g.image);

  const linked = new Set([page.library?.facility_slug, page.laboratories?.facility_slug].filter(Boolean));
  const labSection = sections.find((s) => s.kind === 'laboratories');
  const labCategory =
    categories.find((c) => c.slug === labSection?.profiles_category) ?? categories.find((c) => /lab/i.test(c.slug)) ?? null;

  const items: ShowItem[] = [];

  const blockItem = (key: 'library' | 'laboratories', b: FeatureBlock, fallbackName: string, fallbackIcon: string): ShowItem => {
    const facility = bySlug(b.facility_slug);
    const cats = facility?.categories.length ? facility.categories : key === 'laboratories' && labCategory ? [labCategory] : [];
    return {
      key,
      name: b.heading || facility?.name || fallbackName,
      categories: cats,
      summary: facility?.summary || summaryFrom(b.intro_html),
      image:
        b.image ?? b.gallery[0] ?? facility?.main_image ?? facility?.images[0] ?? photosOf(b.facility_slug ?? '')[0] ?? null,
      location: facility?.location || facility?.building || null,
      href: facility?.display_mode === 'page' ? `/about/campus-facilities/${facility.slug}` : null,
      hasDetails: true,
      facility,
      block: b,
      icon: cats[0]?.icon ?? fallbackIcon,
    };
  };

  for (const s of sections) {
    if (s.kind === 'library' && page.library) items.push(blockItem('library', page.library, 'Library', 'book'));
    else if (s.kind === 'laboratories' && page.laboratories) items.push(blockItem('laboratories', page.laboratories, 'Laboratories', 'flask'));
    else if (s.kind === 'directory') {
      for (const f of facilities) {
        if (linked.has(f.slug) || f.display_mode === 'card_only') continue;
        items.push({
          key: f.slug,
          name: f.name,
          categories: f.categories,
          summary: f.summary,
          image: f.main_image ?? f.images[0] ?? photosOf(f.slug)[0] ?? null,
          location: f.location || f.building || null,
          href: f.display_mode === 'page' ? `/about/campus-facilities/${f.slug}` : null,
          hasDetails: f.display_mode === 'panel',
          facility: f,
          block: null,
          icon: f.categories[0]?.icon ?? 'building',
        });
      }
    }
  }

  const tiles: CategoryTile[] = categories
    .map((category) => {
      const inCat = items.filter((i) => i.categories.some((c) => c.slug === category.slug));
      return { category, count: inCat.length, image: inCat.find((i) => i.image)?.image ?? null };
    })
    .filter((t) => t.count > 0);

  // Hero: the page's own photographs first, then the sharpest others, wide ones only.
  const slides: Slide[] = [];
  const seen = new Set<string>();
  const addSlide = (im: Image | null | undefined, caption: string | null, force = false) => {
    if (!im || seen.has(im.url) || slides.length >= 5) return;
    if (!force && (im.width ?? 0) < 1800) return;
    seen.add(im.url);
    slides.push({ url: im.url, alt: im.alt, caption: caption || im.alt || null });
  };
  page.hero_images.forEach((im, i) => addSlide(im, i === 0 ? page.hero_caption : null, true));
  [...gallery].sort((a, b) => Number(b.featured) - Number(a.featured)).forEach((g) => addSlide(g.image, g.caption));
  items.forEach((i) => addSlide(i.image, i.name));
  uniqueImages(items.flatMap((i) => i.block?.gallery ?? [])).forEach((im) => addSlide(im, null));

  return { items, tiles, slides };
}
