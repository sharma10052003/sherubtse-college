// What the assistant knows: the text of the built website, nothing else.
// Reads every published page in the site folder (the same HTML visitors
// get), keeps the main content, splits it into short passages, and finds the
// passages that best match a question (BM25 keyword ranking). Downloads and
// the college's online systems come from the site search index.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fold, isSafeUrl } from '../web/src/lib/chat-guard.mjs';

const CHUNK = 900; // characters per passage
const SKIP = new Set(['search', '404', '500']);

// Words that carry no meaning for matching.
const STOP = new Set(
  'a an the of and or in on at to for from by with about into is are was were be been being do does did can could would should will shall may might must i me my we our you your he she it its they them their this that these those there here what whats which who whom whose where when why how please tell show give find get know want need looking look any some all more most other info information details detail sherubtse college la'.split(' '),
);
// Same meaning, written differently on the site.
const SAME = {
  course: 'programme', courses: 'programme', program: 'programme', programs: 'programme', programmes: 'programme', degree: 'programme', degrees: 'programme',
  hostel: 'residence', hostels: 'residence', residences: 'residence', dorm: 'residence', dormitory: 'residence',
  fee: 'fees', tuition: 'fees', cost: 'fees', costs: 'fees',
  job: 'vacancy', jobs: 'vacancy', vacancies: 'vacancy', recruitment: 'vacancy',
  exam: 'examination', exams: 'examination', examinations: 'examination',
  phone: 'contact', telephone: 'contact', email: 'contact', mail: 'contact',
  principal: 'president',
  apply: 'admission', application: 'admission', admissions: 'admission', enrol: 'admission', enroll: 'admission',
  lab: 'laboratory', labs: 'laboratory', laboratories: 'laboratory', laboratory: 'laboratory',
  applying: 'admission', applied: 'admission',
  // “When was it started?” — the site says founded / established / inaugurated.
  start: 'found', began: 'found', begin: 'found', begun: 'found', establish: 'found', establishment: 'found',
  inaugurat: 'found', inception: 'found', old: 'found',
  hour: 'timing', time: 'timing', open: 'timing', close: 'timing', opening: 'timing',
};

/** A light English stemmer: started → start, facilities → facility, teaching → teach. */
function stem(w) {
  if (SAME[w]) return SAME[w];
  if (w.length > 5 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 5 && w.endsWith('ed')) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

/** Words of a text, normalised for matching. */
export function terms(text) {
  return fold(text)
    .split(' ')
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem)
    .map((w) => SAME[w] ?? w);
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', middot: '·', rarr: '→' };
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);

/** The readable main text of a built page. */
function pageText(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
  return decode(
    main
      .replace(/<(script|style|svg|noscript|template|iframe|form|button)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<nav[^>]*aria-label="Breadcrumb"[\s\S]*?<\/nav>/gi, ' ')
      .replace(/<(br|\/p|\/li|\/h[1-6]|\/div|\/section|\/article|\/tr|\/dd|\/dt|\/blockquote)[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t ]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/** Passages of about CHUNK characters, split at line ends. */
function split(text) {
  const out = [];
  let cur = '';
  for (const line of text.split('\n')) {
    if (cur && cur.length + line.length > CHUNK) {
      out.push(cur);
      cur = '';
    }
    cur += (cur ? '\n' : '') + (line.length > CHUNK * 1.5 ? line.slice(0, CHUNK * 1.5) : line);
  }
  if (cur.trim().length > 40) out.push(cur);
  return out;
}

async function* pages(dir, base = '') {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('_') || (base === '' && SKIP.has(entry.name))) continue;
      yield* pages(path.join(dir, entry.name), `${base}/${entry.name}`);
    } else if (entry.name === 'index.html') {
      yield { file: path.join(dir, entry.name), url: base || '/' };
    }
  }
}

/** Builds the passage list from the site folder. */
export async function loadKnowledge(siteDir) {
  const docs = [];
  for await (const { file, url } of pages(siteDir)) {
    if (!isSafeUrl(url)) continue;
    const html = await fs.readFile(file, 'utf8');
    if (/http-equiv=["']refresh/i.test(html)) continue; // old-site redirects
    const title = decode(html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? url).replace(/\s+[—–-]\s+Sherubtse College$/, '').trim();
    if (/^(404|500)\b|not found/i.test(title)) continue; // error pages are not content
    for (const text of split(pageText(html))) docs.push({ url, title, text });
  }
  // Downloads and the college's online systems (only in the search index).
  try {
    const index = JSON.parse(await fs.readFile(path.join(siteDir, 'search-index.json'), 'utf8'));
    for (const e of index) {
      if (/^https?:\/\//i.test(e.u) && isSafeUrl(e.u)) docs.push({ url: e.u, title: e.t, text: [e.t, e.k, e.d].filter(Boolean).join('. ') });
    }
  } catch {}

  // BM25 statistics. Title words count twice, and also earn a bonus below.
  const df = new Map();
  for (const d of docs) {
    d.titleTerms = new Set(terms(d.title));
    d.terms = terms(`${d.title} ${d.title} ${d.text}`);
    d.tf = new Map();
    for (const t of d.terms) d.tf.set(t, (d.tf.get(t) ?? 0) + 1);
    for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const avg = docs.reduce((n, d) => n + d.terms.length, 0) / Math.max(1, docs.length);
  return { docs, df, avg, pages: new Set(docs.map((d) => d.url)).size };
}

/**
 * The best passages for a question: at most `limit`, two per page, within
 * `budget` characters. Empty when nothing on the website matches.
 */
export function retrieve(kb, question, { limit = 6, budget = 6500 } = {}) {
  const q = [...new Set(terms(question))];
  if (!q.length) return [];
  const N = kb.docs.length;
  const k1 = 1.2;
  const b = 0.75;
  const scored = [];
  for (const d of kb.docs) {
    let s = 0;
    let hits = 0;
    for (const t of q) {
      const f = d.tf.get(t);
      if (!f) continue;
      hits++;
      const n = kb.df.get(t) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      s += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.terms.length) / kb.avg)));
      // A page named after the topic (“Office of the President”) beats pages that merely mention it.
      if (d.titleTerms.has(t)) s += idf * 1.5;
    }
    if (s > 0) scored.push({ d, s: s * (1 + hits / q.length) });
  }
  scored.sort((a, b2) => b2.s - a.s);
  const out = [];
  const perPage = new Map();
  let used = 0;
  for (const { d } of scored) {
    if (out.length >= limit) break;
    if ((perPage.get(d.url) ?? 0) >= 2) continue;
    if (used + d.text.length > budget && out.length) continue;
    out.push(d);
    used += d.text.length;
    perPage.set(d.url, (perPage.get(d.url) ?? 0) + 1);
  }
  return out;
}

/** The College's main pages, for questions whose words match nothing in particular. */
const CORE = ['/about/about-the-college', '/about/history', '/about', '/', '/admissions', '/about/contact'];
export function corePassages(kb, { budget = 6500 } = {}) {
  const out = [];
  let used = 0;
  for (const url of CORE) {
    const d = kb.docs.find((x) => x.url === url);
    if (!d || used + d.text.length > budget) continue;
    out.push(d);
    used += d.text.length;
  }
  return out;
}
