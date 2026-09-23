import type { Core } from '@strapi/strapi';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uniqueSlug(strapi: Core.Strapi, base: string, ignoreId?: number): Promise<string> {
  let slug = base || 'announcement';
  let n = 1;
  while (true) {
    const existing = await strapi.db.query('api::vacancy-announcement.vacancy-announcement').findOne({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    if (!data.slug && data.title) {
      data.slug = await uniqueSlug(strapi, slugify(data.title));
    }
    if (!data.date_posted) {
      data.date_posted = new Date().toISOString().slice(0, 10);
    }
  },
  async beforeUpdate(event: any) {
    const { data, where } = event.params;
    if (data.title && !data.slug) {
      data.slug = await uniqueSlug(strapi, slugify(data.title), where?.id);
    }
  },
};
