import { factories } from '@strapi/strapi';

// Public Admissions enquiry form — honeypot, rate limit, consent required and
// only the form's own fields (routed_to and reviewed are set by staff/code).
export default factories.createCoreRouter('api::admission-enquiry.admission-enquiry', {
  config: {
    create: {
      policies: [
        {
          name: 'global::public-form-guard',
          config: {
            fields: ['full_name', 'email', 'phone', 'applicant_category', 'programme', 'enquiry_category', 'message', 'consent'],
            requireTrue: ['consent'],
            lowercase: ['email'],
          },
        },
      ],
    },
  },
});
