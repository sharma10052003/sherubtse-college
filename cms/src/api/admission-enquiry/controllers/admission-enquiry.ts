import { factories } from '@strapi/strapi';

const SETTINGS = 'api::admission-enquiry-setting.admission-enquiry-setting';

// Assigns each enquiry to the email address set for its enquiry option in
// Admission – Enquiry Form Settings (falling back to the form's default
// address). The address is stored in the private `routed_to` field — never
// returned by the API — and the public response is a bare acknowledgement,
// so routing and personal details are never echoed.
export default factories.createCoreController('api::admission-enquiry.admission-enquiry', ({ strapi }) => ({
  async create(ctx) {
    const data = ctx.request.body?.data ?? {};
    const category = typeof data.enquiry_category === 'string' ? data.enquiry_category.trim().toLowerCase() : '';

    const settings: any = await strapi.documents(SETTINGS as any).findFirst({ populate: ['enquiry_categories'] } as any);
    const option = (settings?.enquiry_categories ?? []).find((o: any) => String(o.label ?? '').trim().toLowerCase() === category);
    data.routed_to = option?.recipient_email || settings?.default_recipient_email || null;
    ctx.request.body.data = data;

    await super.create(ctx);
    ctx.status = 201;
    ctx.body = { data: { received: true } };
  },
}));
