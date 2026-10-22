import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::newsletter-subscriber.newsletter-subscriber', {
  config: {
    create: {
      policies: [
        {
          name: 'global::public-form-guard',
          config: { fields: ['email', 'consent'], lowercase: ['email'] },
        },
      ],
    },
  },
});
