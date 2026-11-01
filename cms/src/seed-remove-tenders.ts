import type { Core } from '@strapi/strapi';

/**
 * The Tenders page was removed from the website. This tidies the records that mentioned it, once:
 *  - News & Notices – Overview: the "Tenders" box, the "open tenders" wording and the intro text;
 *  - News & Notices – News Page: the links band wording.
 * Nothing else is touched, and anything an editor has since changed is left alone.
 */
const KEY = { type: 'core', name: 'seeds', key: 'tenders_removed_version' } as const;

export async function removeTendersPage(strapi: Core.Strapi) {
  if ((Number(await strapi.store.get(KEY)) || 0) >= 1) return;

  const overview = strapi.documents('api::news-notices-overview.news-notices-overview' as any) as any;
  const row = await overview.findFirst({ populate: ['cards'] });
  if (row) {
    const data: Record<string, unknown> = {};
    const cards = (row.cards ?? []).filter((c: any) => !/\/news-notices\/tenders/.test(c.url ?? ''));
    if (cards.length !== (row.cards ?? []).length) data.cards = cards.map(({ id, ...c }: any) => c);
    if (typeof row.intro === 'string' && /tenders/i.test(row.intro)) {
      data.intro = row.intro.replace(/recruitment and tenders/i, 'and recruitment').replace(/,\s*and recruitment/i, ' and recruitment');
    }
    const labels = row.labels && typeof row.labels === 'object' ? { ...row.labels } : null;
    if (labels) {
      let changed = false;
      for (const k of ['live_tenders', 'meta_tenders', 'live_tenders_one']) if (k in labels) { delete (labels as any)[k]; changed = true; }
      if (changed) data.labels = labels;
    }
    if (Object.keys(data).length) {
      await overview.update({ documentId: row.documentId, data });
      try { await overview.publish({ documentId: row.documentId }); } catch { /* not draft & publish */ }
    }
  }

  const newsPage = strapi.documents('api::news-page.news-page' as any) as any;
  const np = await newsPage.findFirst();
  if (np?.labels && /tenders/i.test(String(np.labels.band_news_text ?? ''))) {
    await newsPage.update({ documentId: np.documentId, data: { labels: { ...np.labels, band_news_text: 'Notices and vacancies' } } });
  }
  await strapi.store.set({ ...KEY, value: 1 });
}
