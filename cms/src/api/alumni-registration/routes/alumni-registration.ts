import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::alumni-registration.alumni-registration', {
  config: {
    create: {
      policies: [
        {
          name: 'global::public-form-guard',
          config: {
            fields: [
              'full_name', 'email', 'phone', 'programme', 'graduation_year', 'academic_period',
              'organization', 'designation', 'industry', 'country', 'city', 'interests', 'consent_directory',
            ],
            lowercase: ['email'],
          },
        },
      ],
    },
  },
});
