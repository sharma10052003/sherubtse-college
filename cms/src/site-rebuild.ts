import type { Core } from '@strapi/strapi';

/**
 * Keeps the static website up to date. The website is built from Strapi
 * content, so a change only reaches visitors after a rebuild. When
 * SITE_REBUILD_WEBHOOK_URL is set (the build hook of the hosting provider or
 * CI job that runs `npm run build` in web/), this:
 *
 *  - calls it after content is created, updated, published, unpublished or
 *    deleted — debounced, so publishing ten items triggers one build,
 *    REBUILD_DEBOUNCE_SECONDS (default 60) after the last change;
 *  - calls it once a night (00:05 Bhutan time, see config/cron-tasks.ts),
 *    so date-based content — expired notices, past events — rolls over even
 *    when nobody edits anything.
 *
 * Without the variable it does nothing (local development).
 */

// Public form submissions never change what the website shows.
const IGNORED = new Set([
  'api::admission-enquiry.admission-enquiry',
  'api::contact-enquiry.contact-enquiry',
  'api::alumni-registration.alumni-registration',
  'api::newsletter-subscriber.newsletter-subscriber',
]);

let timer: NodeJS.Timeout | null = null;

export async function triggerSiteRebuild(strapi: Core.Strapi, reason: string) {
  const url = process.env.SITE_REBUILD_WEBHOOK_URL;
  if (!url) return;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'strapi', reason, at: new Date().toISOString() }),
    });
    strapi.log.info(`[site-rebuild] ${reason} -> ${res.status}`);
  } catch (err) {
    strapi.log.warn(`[site-rebuild] ${reason} failed: ${err instanceof Error ? err.message : err}`);
  }
}

export function registerSiteRebuild({ strapi }: { strapi: Core.Strapi }) {
  if (!process.env.SITE_REBUILD_WEBHOOK_URL) return;
  const delay = (Number(process.env.REBUILD_DEBOUNCE_SECONDS) || 60) * 1000;
  const schedule = (event: any) => {
    const uid: string = event?.model?.uid ?? '';
    if (!(uid.startsWith('api::') || uid === 'plugin::upload.file') || IGNORED.has(uid)) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      void triggerSiteRebuild(strapi, `content changed (${uid})`);
    }, delay);
  };
  strapi.db.lifecycles.subscribe({
    afterCreate: schedule,
    afterUpdate: schedule,
    afterDelete: schedule,
    afterCreateMany: schedule,
    afterUpdateMany: schedule,
    afterDeleteMany: schedule,
  });
  strapi.log.info(`[site-rebuild] enabled (debounce ${delay / 1000}s)`);
}
