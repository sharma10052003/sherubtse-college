import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const UID = 'api::alumni-registration.alumni-registration';

// One registration per email address. The public form shows a friendly
// "already registered" message for this specific error rather than
// creating a second record for the Alumni Office to de-duplicate.
export default factories.createCoreController(UID, ({ strapi }) => ({
  async create(ctx) {
    const email = String(ctx.request.body?.data?.email ?? '').trim().toLowerCase();
    if (email) {
      const existing = await strapi.documents(UID).findFirst({ filters: { email: { $eqi: email } } });
      if (existing) throw new errors.ApplicationError('already_registered');
    }
    return super.create(ctx);
  },
}));
