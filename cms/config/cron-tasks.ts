import { triggerSiteRebuild } from '../src/site-rebuild';

/**
 * Nightly rebuild so date-based content (expired notices, past events,
 * scheduled stories) rolls over on the website without anyone editing.
 * Does nothing unless SITE_REBUILD_WEBHOOK_URL is set (see src/site-rebuild.ts).
 */
export default {
  nightlyRebuild: {
    task: async ({ strapi }: { strapi: any }) => {
      await triggerSiteRebuild(strapi, 'nightly rebuild');
    },
    options: {
      rule: '5 0 * * *',
      tz: 'Asia/Thimphu',
    },
  },
};
