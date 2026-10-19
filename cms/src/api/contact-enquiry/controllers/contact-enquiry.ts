import { factories } from '@strapi/strapi';

const OFFICE_UID = 'api::contact-person.contact-person';

// Records which office the enquiry is for: the chosen department is matched
// to a published Contact – Offices entry and that office's email is stored
// on the enquiry, so staff can filter or forward by office. Anything else
// ("Other / Not Sure") is left unassigned for the general office to triage.
// The response is reduced to an acknowledgement so the public endpoint
// never echoes stored personal details back.
export default factories.createCoreController('api::contact-enquiry.contact-enquiry', ({ strapi }) => ({
  async create(ctx) {
    const data = ctx.request.body?.data ?? {};
    const department = typeof data.department === 'string' ? data.department.trim() : '';
    data.office_email = null;
    if (department) {
      const office: any = await strapi.documents(OFFICE_UID as any).findFirst({
        filters: { group_title: { $eqi: department } },
        status: 'published',
        sort: ['display_order:asc'],
      } as any);
      data.office_email = office?.email ?? null;
    }
    ctx.request.body.data = data;

    await super.create(ctx);
    ctx.status = 201;
    ctx.body = { data: { received: true } };
  },
}));
