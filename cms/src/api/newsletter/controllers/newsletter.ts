import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
  /** Bumps view_count by 1 and returns nothing but the new count —
   * deliberately not the full document_manager `update` action, so a
   * public caller can never touch any other field. */
  async trackView(ctx) {
    const { id } = ctx.params;
    const entry = await strapi.db.query('api::newsletter.newsletter').findOne({ where: { documentId: id, publishedAt: { $notNull: true } } });
    if (!entry) return ctx.notFound();
    const updated = await strapi.db.query('api::newsletter.newsletter').update({
      where: { id: entry.id },
      data: { view_count: (entry.view_count ?? 0) + 1 },
    });
    ctx.body = { view_count: updated.view_count };
  },

  async trackDownload(ctx) {
    const { id } = ctx.params;
    const entry = await strapi.db.query('api::newsletter.newsletter').findOne({ where: { documentId: id, publishedAt: { $notNull: true } } });
    if (!entry) return ctx.notFound();
    const updated = await strapi.db.query('api::newsletter.newsletter').update({
      where: { id: entry.id },
      data: { download_count: (entry.download_count ?? 0) + 1 },
    });
    ctx.body = { download_count: updated.download_count };
  },
}));
