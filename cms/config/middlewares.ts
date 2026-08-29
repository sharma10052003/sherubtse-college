import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      // Strapi's default frame-ancestors is 'self' only, which blocks
      // the Newsletter page's PDF <iframe> reader — that PDF is served
      // from this Strapi origin but embedded on the Astro frontend's
      // origin (a different port in dev, a different subdomain in
      // production). FRONTEND_URL lets the allowed origin travel with
      // the environment instead of being hardcoded to localhost.
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'frame-ancestors': ["'self'", process.env.FRONTEND_URL || 'http://localhost:4321'],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
