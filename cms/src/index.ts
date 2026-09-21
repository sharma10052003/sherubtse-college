import type { Core } from '@strapi/strapi';
import registerFacultyImport from './faculty-import';

/**
 * The Alumni and Contact pages have public-facing forms (submit a
 * story, register as alumni, subscribe to the newsletter, send a
 * general enquiry). Every other content type on this site is
 * read-only from the public internet — writes only ever happen from
 * the admin panel with a staff login. These are the sole, deliberate
 * exception, and even they only get `create`: no
 * `find`/`findOne`/`update`/`delete`, so a public request can add a
 * new draft but can never read, change, or delete anyone else's
 * submission. Granted here (idempotently, safe to run on every boot)
 * rather than by clicking through the admin UI, so the permission set
 * is version-controlled and survives a fresh database rather than
 * living only in one admin's browser session.
 */
const PUBLIC_CREATE_ACTIONS = [
  'api::alumni.alumni.create',
  'api::alumni-registration.alumni-registration.create',
  'api::newsletter-subscriber.newsletter-subscriber.create',
  'api::contact-enquiry.contact-enquiry.create',
  // Needed so the story-submission and registration forms can attach
  // a photo — scoped to upload only, not to browsing the media library.
  'plugin::upload.content-api.upload',
];

async function grantPublicCreatePermissions({ strapi }: { strapi: Core.Strapi }) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (!publicRole) return;

  for (const action of PUBLIC_CREATE_ACTIONS) {
    const existing = await strapi.query('plugin::users-permissions.permission').findOne({
      where: { role: publicRole.id, action },
    });
    if (!existing) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    registerFacultyImport({ strapi });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPublicCreatePermissions({ strapi });
  },
};
