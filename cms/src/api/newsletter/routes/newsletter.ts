import { factories } from '@strapi/strapi';

const defaultRouter = factories.createCoreRouter('api::newsletter.newsletter');

// Standard Strapi pattern for adding custom routes alongside the
// default CRUD set (rather than replacing it) — see the "Extending
// core routers" doc. The two extra routes below are intentionally
// `auth: false`: they do nothing but increment a single counter field
// on an already-published entry (no read, no write to anything else,
// no PII), so they skip the Users-Permissions layer entirely rather
// than needing a Public-role grant like the write-capable forms do.
const extraRoutes = [
  {
    method: 'POST',
    path: '/newsletters/:id/track-view',
    handler: 'newsletter.trackView',
    config: { auth: false },
  },
  {
    method: 'POST',
    path: '/newsletters/:id/track-download',
    handler: 'newsletter.trackDownload',
    config: { auth: false },
  },
];

export default {
  get prefix() {
    return (defaultRouter as any).prefix;
  },
  get routes() {
    return [...(defaultRouter as any).routes, ...extraRoutes];
  },
};
