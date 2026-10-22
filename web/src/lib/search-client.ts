/**
 * Browser side of the site search: loads /search-index.json once and ranks
 * entries for a query. Shared by the header search and the /search page.
 * Matching ignores case, accents and punctuation (“wi-fi” finds “WiFi”), and
 * every word of the query must appear somewhere in an entry; if nothing
 * matches all words, entries matching any word are shown instead.
 */
import type { SearchEntry } from './search-index';

export type { SearchEntry };
export interface SearchResult extends SearchEntry { score: number }

let indexPromise: Promise<SearchEntry[]> | null = null;
export function loadIndex(): Promise<SearchEntry[]> {
  indexPromise ??= fetch('/search-index.json')
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => {
      indexPromise = null;
      return [];
    });
  return indexPromise;
}

export const fold = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ༀ-࿿]+/g, ' ').trim();

const STOP = new Set(['the', 'a', 'an', 'of', 'and', 'in', 'to', 'for', 'at', 'on', 'is']);
export const termsOf = (q: string) => {
  const all = fold(q).split(' ').filter(Boolean);
  const useful = all.filter((t) => !STOP.has(t));
  return useful.length ? useful : all;
};

interface Prepared { e: SearchEntry; t: string; d: string; x: string; k: string; tw: string[]; c: string }
const cache = new WeakMap<SearchEntry[], Prepared[]>();
const prepare = (index: SearchEntry[]) => {
  let p = cache.get(index);
  if (!p) {
    p = index.map((e) => {
      const t = fold(e.t);
      const d = fold(e.d ?? '');
      const x = fold(e.x ?? '');
      // Space-free copy, so “wifi” also finds “Wi-Fi” and “ebooks” finds “e-books”.
      return { e, t, d, x, k: fold(e.k), tw: t.split(' '), c: `${t} ${d} ${x}`.replace(/ /g, '') };
    });
    cache.set(index, p);
  }
  return p;
};

function scoreTerm(p: Prepared, term: string): number {
  let s = 0;
  if (p.t === term) s += 30;
  if (p.tw.includes(term)) s += 14;
  else if (p.tw.some((w) => w.startsWith(term))) s += 10;
  else if (p.t.includes(term)) s += 6;
  if (p.k === term || p.k.startsWith(term)) s += 4;
  if (p.x.includes(term)) s += 3;
  if (p.d.includes(term)) s += 2;
  if (s === 0 && term.length > 2 && p.c.includes(term)) s += 2;
  return s;
}

/** Main pages and programmes before news and notices that merely mention a word. */
const KIND_BOOST: Record<string, number> = { Page: 6, Programme: 6, Facility: 4, Office: 4, Department: 4, Club: 3, Download: 3, People: 2, Research: 1 };

export function search(index: SearchEntry[], query: string, kind?: string): SearchResult[] {
  const terms = termsOf(query);
  if (!terms.length) return [];
  const phrase = fold(query);
  const prepared = prepare(index).filter((p) => !kind || p.e.k === kind);
  const rank = (requireAll: boolean) =>
    prepared
      .map((p) => {
        const parts = terms.map((t) => scoreTerm(p, t));
        if (requireAll ? parts.some((s) => s === 0) : parts.every((s) => s === 0)) return null;
        let score = parts.reduce((a, b) => a + b, 0);
        if (terms.length > 1 && p.t.includes(phrase)) score += 20;
        score += KIND_BOOST[p.e.k] ?? 0;
        // Titles that are mostly the query (e.g. “BSc Physics” for “physics”) rank first.
        const inTitle = terms.filter((t) => p.t.includes(t)).length;
        if (inTitle) score += Math.round((10 * inTitle) / p.tw.length);
        return { ...p.e, score };
      })
      .filter((r): r is SearchResult => !!r)
      .sort((a, b) => b.score - a.score || (b.y ?? '').localeCompare(a.y ?? '') || a.t.localeCompare(b.t));
  const all = rank(true);
  return all.length ? all : rank(false);
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Escapes text and wraps query words in <mark>. */
export function highlight(text: string, query: string): string {
  const safe = esc(text ?? '');
  const terms = termsOf(query).filter((t) => t.length > 1).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!terms.length) return safe;
  return safe.replace(new RegExp(`(${terms.join('|')})`, 'gi'), '<mark>$1</mark>');
}
