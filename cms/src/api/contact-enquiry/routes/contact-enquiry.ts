import { factories } from '@strapi/strapi';

// Public "Have a Question?" form on the Contact page — honeypot, rate limit
// and only the fields the form has (office_email is set by the controller).
export default factories.createCoreRouter('api::contact-enquiry.contact-enquiry', {
  config: {
    create: {
      policies: [
        {
          name: 'global::public-form-guard',
          config: {
            fields: ['full_name', 'email', 'phone', 'subject', 'department', 'message'],
            lowercase: ['email'],
          },
        },
      ],
    },
  },
});
