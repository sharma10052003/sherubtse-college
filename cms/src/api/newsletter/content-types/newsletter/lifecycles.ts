import { requireAltText } from '../../../../utils/require-alt-text';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default {
  async beforeCreate(event: any) {
    await requireAltText(event.params.data, ['cover_image']);

    // Slug is derived from edition+year (e.g. "summer-2026"), not
    // title — every edition shares the same title ("The Tower"), so a
    // title-derived slug would just be title-2, title-3, ... instead
    // of the readable /newsletter/summer-2026/ shape the brief asks for.
    if (!event.params.data.slug && event.params.data.edition && event.params.data.year) {
      const base = slugify(`${event.params.data.edition}-${event.params.data.year}`);
      let candidate = base;
      let suffix = 2;
      while (await strapi.db.query('api::newsletter.newsletter').findOne({ where: { slug: candidate } })) {
        candidate = `${base}-${suffix}`;
        suffix += 1;
      }
      event.params.data.slug = candidate;
    }
    if (!event.params.data.last_reviewed) {
      event.params.data.last_reviewed = new Date().toISOString().slice(0, 10);
    }
  },
  async beforeUpdate(event: any) {
    await requireAltText(event.params.data, ['cover_image']);
  },
};
