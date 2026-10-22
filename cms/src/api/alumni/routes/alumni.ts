import { factories } from '@strapi/strapi';

// Public "Submit Your Story" form — only the fields that form has, consent
// required. Every create still lands as a draft (see lifecycles.ts).
export default factories.createCoreRouter('api::alumni.alumni', {
  config: {
    create: {
      policies: [
        {
          name: 'global::public-form-guard',
          config: {
            fields: ['full_name', 'email', 'graduation_year', 'programme', 'current_role', 'organization', 'article_title', 'story', 'category', 'consent'],
            requireTrue: ['consent'],
            lowercase: ['email'],
            forceDraft: true,
          },
        },
      ],
    },
  },
});
