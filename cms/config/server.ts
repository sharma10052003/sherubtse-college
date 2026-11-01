import type { Core } from '@strapi/strapi';
import cronTasks from './cron-tasks';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Public address when Strapi sits behind nginx with HTTPS, e.g.
  // https://cms.sherubtse.edu.bt (see docs/DEPLOY-PROXMOX.md). Empty locally.
  url: env('PUBLIC_URL', ''),
  // Trust nginx's X-Forwarded-* headers, so admin logins work over HTTPS.
  proxy: { koa: env.bool('IS_PROXIED', false) },
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  cron: {
    enabled: env.bool('CRON_ENABLED', true),
    tasks: cronTasks,
  },
});

export default config;
