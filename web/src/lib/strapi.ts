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

export interface ResponsiveImage {
  src: string;
  srcset: string | null;
  width: number | null;
  height: number | null;
  alt: string;
}

/**
 * An image with a srcset built from the sizes Strapi generates on upload
 * (small 500px, medium 750px, large 1000px) plus the original, so browsers
 * download only the size they need. Alt text: the given text, else the
 * Media Library's alternative text.
 */
export function responsiveImage(media: any, alt?: string | null): ResponsiveImage | null {
  const src = mediaUrl(media);
  if (!src || (media?.mime && !String(media.mime).startsWith('image/'))) return null;
  const sizes = Object.values<any>(media.formats ?? {})
    .filter((f) => f?.url && f.width && !/^thumbnail/.test(f.name ?? ''))
    .map((f) => ({ url: mediaUrl(f)!, width: f.width as number }));
  if (media.width) sizes.push({ url: src, width: media.width });
  const unique = [...new Map(sizes.sort((a, b) => a.width - b.width).map((s) => [s.width, s])).values()];
  return {
    src: unique.find((s) => s.width >= 1000)?.url ?? src,
    srcset: unique.length > 1 ? unique.map((s) => `${s.url} ${s.width}w`).join(', ') : null,
    width: media.width ?? null,
    height: media.height ?? null,
    alt: (alt ?? media.alternativeText ?? '').trim(),
  };
}
