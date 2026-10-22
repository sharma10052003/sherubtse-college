import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../lib/search-index';

// The site search index (see lib/search-index.ts). Written as a static file
// at build time; generated on request in `astro dev`.
export const GET: APIRoute = async () => {
  const entries = await buildSearchIndex();
  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
