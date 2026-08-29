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
    await requireAltText(event.params.data, ['photo', 'supporting_images']);

    // The `slug` uid field only auto-derives from full_name through
    // the admin UI's own "generate" button — a raw API create (the
    // public submission form) needs it generated here instead, same
    // collision-suffixing approach faculty-import.ts already uses for
    // bulk-imported faculty slugs.
    if (!event.params.data.slug && event.params.data.full_name) {
      const base = slugify(event.params.data.full_name);
      let candidate = base;
      let suffix = 2;
      while (await strapi.db.query('api::alumni.alumni').findOne({ where: { slug: candidate } })) {
        candidate = `${base}-${suffix}`;
        suffix += 1;
      }
      event.params.data.slug = candidate;
    }

    // The public "Submit Your Story" form has no reason to know about
    // internal unit ownership or review scheduling, and the Public
    // role's create permission can't set relation fields anyway — so
    // a submission with no owning_unit gets the Alumni Office's real
    // unit (Research and Industrial Linkages, matching the published
    // Alumni contact section) rather than failing validation.
    if (!event.params.data.owning_unit) {
      const alumniUnit = await strapi.db.query('api::unit.unit').findOne({
        where: { slug: 'office-of-research-and-industrial-linkages' },
      });
      if (alumniUnit) event.params.data.owning_unit = alumniUnit.id;
    }
    if (!event.params.data.last_reviewed) {
      event.params.data.last_reviewed = new Date().toISOString().slice(0, 10);
    }

    // Every create lands as a draft, full stop — including from the
    // admin panel. That's already normal admin-panel behaviour (you
    // always hit "Publish" as its own step), so this changes nothing
    // for staff; what it guarantees is that the public "Submit Your
    // Story" form (Public role, create-only) can never publish an
    // entry directly no matter what the request body contains.
    event.params.data.publishedAt = null;
  },
  async beforeUpdate(event: any) {
    await requireAltText(event.params.data, ['photo', 'supporting_images']);
  },
};
