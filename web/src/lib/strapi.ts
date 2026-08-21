/**
 * strapi.ts — build-time-only Strapi REST client. Plays the same role
 * `includes/strapi-client.php` plays for the PHP site: the one place that
 * talks to Strapi, never throws, and never runs anywhere but here.
 *
 * Astro's static output means this module only ever executes during
 * `astro build` / `astro dev` (Node), never in the browser — so
 * STRAPI_API_TOKEN never reaches a client bundle. That's what makes
 * "Strapi is never exposed to the public internet" true by construction
 * rather than by discipline (Build Brief §01).
 */
import qs from 'qs';

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN || '';

export interface StrapiListResponse<T> {
  data: T[];
  meta: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
}

export interface StrapiSingleResponse<T> {
  data: T | null;
  meta: Record<string, unknown>;
}

/**
 * Fetches one path from Strapi. Never throws — returns null on any
 * failure (network error, timeout, non-2xx) so a page can fall back to an
 * empty state instead of failing the whole build, matching this
 * project's site-wide resilience convention.
 */
export async function strapiGet<T>(path: string, params?: Record<string, unknown>): Promise<T | null> {
  const query = params ? qs.stringify(params, { encodeValuesOnly: true }) : '';
  const url = `${STRAPI_URL}/api/${path}${query ? `?${query}` : ''}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn(`[strapi] ${path} -> ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[strapi] ${path} failed:`, err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Resolves a Strapi media object's absolute URL, or null if there isn't one. */
export function mediaUrl(media: { url?: string } | null | undefined): string | null {
  if (!media?.url) return null;
  return media.url.startsWith('http') ? media.url : `${STRAPI_URL}${media.url}`;
}
