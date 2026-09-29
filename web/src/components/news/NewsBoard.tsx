import { useMemo, useRef, useState } from 'react';

export interface NewsCardData {
  id: number;
  title: string;
  summary: string;
  date: string;
  year: number;
  category: string;
  category_label: string;
  template: string;
  image_url: string | null;
  images: string[];
  gallery: string[];
  tags: string[];
  video_url: string | null;
  video_poster_url: string | null;
  archived: boolean;
}

interface Props {
  items: NewsCardData[];
  categoryOptions: { value: string; label: string }[];
}

const ALL = '';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function monthLabel(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { month: 'long' });
}

function excerpt(text: string | null | undefined, n = 140) {
  const t = (text ?? '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n).replace(/\s+\S*$/, '')}…` : t;
}

// Scroll-reveal: a shared IntersectionObserver hands every card the same
// one-line-per-card treatment as it enters view, then lets go of it — no
// re-triggering, no per-card observer instances. Cards already inside the
// viewport at mount fire immediately (IntersectionObserver's first
// callback), and prefers-reduced-motion is handled purely in CSS so
// nothing ever depends on this running to become visible.
function useReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  return function revealRef(el: HTMLElement | null) {
    if (!el || el.classList.contains('is-visible')) return;
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observerRef.current?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
      );
    }
    observerRef.current.observe(el);
  };
}

function Kicker({ item }: { item: NewsCardData }) {
  return <span className={`news-kicker news-kicker-${item.category}`}>{item.category_label}</span>;
}

function NewsCard({ item, revealRef }: { item: NewsCardData; revealRef: (el: HTMLElement | null) => void }) {
  const href = `/news-notices/news/${item.id}`;

  if (item.template === 'featured') {
    return (
      <article ref={revealRef} className="news-card news-card--featured reveal">
        <a href={href} className="news-card-media">
          {item.image_url ? <img src={item.image_url} alt="" loading="lazy" /> : <div className="news-card-media-fallback" aria-hidden="true" />}
          <span className="news-card-scrim" aria-hidden="true" />
        </a>
        <div className="news-card-body">
          <Kicker item={item} />
          <h2 className="news-card-title"><a href={href}>{item.title}</a></h2>
          <p className="news-card-summary">{excerpt(item.summary, 200)}</p>
          <p className="news-card-date">{formatDate(item.date)}</p>
        </div>
      </article>
    );
  }

  if (item.template === 'magazine') {
    return (
      <article ref={revealRef} className="news-card news-card--magazine reveal">
        <span className="news-card-quotemark" aria-hidden="true">&#8220;</span>
        <Kicker item={item} />
        <h2 className="news-card-title news-card-title-serif"><a href={href}>{item.title}</a></h2>
        <p className="news-card-summary news-card-standfirst">{excerpt(item.summary, 220)}</p>
        <p className="news-card-date">{formatDate(item.date)}</p>
      </article>
    );
  }

  if (item.template === 'split') {
    return (
      <article ref={revealRef} className="news-card news-card--split reveal">
        <a href={href} className="news-card-media">
          {item.image_url ? <img src={item.image_url} alt="" loading="lazy" /> : <div className="news-card-media-fallback" aria-hidden="true" />}
        </a>
        <div className="news-card-body">
          <Kicker item={item} />
          <h2 className="news-card-title"><a href={href}>{item.title}</a></h2>
          <p className="news-card-summary">{excerpt(item.summary, 160)}</p>
          <p className="news-card-date">{formatDate(item.date)}</p>
        </div>
      </article>
    );
  }

  if (item.template === 'video') {
    return (
      <article ref={revealRef} className="news-card news-card--video reveal">
        <a href={href} className="news-card-media">
          {(item.video_poster_url ?? item.image_url) ? (
            <img src={item.video_poster_url ?? item.image_url ?? ''} alt="" loading="lazy" />
          ) : (
            <div className="news-card-media-fallback" aria-hidden="true" />
          )}
          <span className="news-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span className="news-badge-pill">Watch</span>
        </a>
        <div className="news-card-body">
          <Kicker item={item} />
          <h3 className="news-card-title"><a href={href}>{item.title}</a></h3>
          <p className="news-card-date">{formatDate(item.date)}</p>
        </div>
      </article>
    );
  }

  if (item.template === 'gallery') {
    const shots = item.gallery.length > 0 ? item.gallery : item.images;
    return (
      <article ref={revealRef} className="news-card news-card--gallery reveal">
        <a href={href} className="news-card-mosaic">
          {shots.slice(0, 4).map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" />
          ))}
          {shots.length === 0 && <div className="news-card-media-fallback" aria-hidden="true" />}
          {shots.length > 4 && <span className="news-badge-pill news-badge-count">+{shots.length - 4} photos</span>}
        </a>
        <div className="news-card-body">
          <Kicker item={item} />
          <h3 className="news-card-title"><a href={href}>{item.title}</a></h3>
          <p className="news-card-date">{formatDate(item.date)}</p>
        </div>
      </article>
    );
  }

  if (item.template === 'photo_story') {
    return (
      <article ref={revealRef} className="news-card news-card--photo reveal">
        <a href={href} className="news-card-media">
          {item.image_url ? <img src={item.image_url} alt="" loading="lazy" /> : <div className="news-card-media-fallback" aria-hidden="true" />}
          <span className="news-card-scrim" aria-hidden="true" />
          <div className="news-card-overlay">
            <Kicker item={item} />
            <h3 className="news-card-title news-card-title-on-photo"><a href={href}>{item.title}</a></h3>
            <p className="news-card-date news-card-date-on-photo">{formatDate(item.date)}</p>
          </div>
        </a>
      </article>
    );
  }

  // standard
  return (
    <article ref={revealRef} className="news-card news-card--standard reveal">
      <a href={href} className="news-card-media">
        {item.image_url ? <img src={item.image_url} alt="" loading="lazy" /> : <div className="news-card-media-fallback" aria-hidden="true" />}
      </a>
      <div className="news-card-body">
        <Kicker item={item} />
        <h3 className="news-card-title"><a href={href}>{item.title}</a></h3>
        <p className="news-card-summary">{excerpt(item.summary, 120)}</p>
        <p className="news-card-date">{formatDate(item.date)}</p>
      </div>
    </article>
  );
}

type SortKey = 'newest' | 'oldest';

export default function NewsBoard({ items, categoryOptions }: Props) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState(ALL);
  const [sort, setSort] = useState<SortKey>('newest');
  const [archiveYear, setArchiveYear] = useState<number | null>(null);
  const revealRef = useReveal();

  const live = useMemo(() => items.filter((i) => !i.archived), [items]);
  const archived = useMemo(() => items.filter((i) => i.archived), [items]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const i of live) counts[i.category] = (counts[i.category] ?? 0) + 1;
    return counts;
  }, [live]);

  const archiveByYear = useMemo(() => {
    const groups = new Map<number, NewsCardData[]>();
    for (const i of archived) {
      if (!groups.has(i.year)) groups.set(i.year, []);
      groups.get(i.year)!.push(i);
    }
    return [...groups.entries()].sort((a, b) => b[0] - a[0]);
  }, [archived]);

  const needle = q.trim().toLowerCase();
  function matches(i: NewsCardData) {
    if (category && i.category !== category) return false;
    if (!needle) return true;
    const haystack = [i.title, i.summary, i.category_label, ...i.tags].join(' ').toLowerCase();
    return haystack.includes(needle);
  }

  const filteredLive = useMemo(() => {
    return live.filter(matches).sort((a, b) => (sort === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, q, category, sort]);

  const filteredArchiveYears = useMemo(() => {
    return archiveByYear.map(([year, rows]) => [year, rows.filter(matches)] as [number, NewsCardData[]]).filter(([, rows]) => rows.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archiveByYear, q, category]);

  const activeArchiveRows = archiveYear != null ? (filteredArchiveYears.find(([y]) => y === archiveYear)?.[1] ?? []) : [];
  const hasFilters = q || category || sort !== 'newest';

  return (
    <div className="news-board">
      <nav className="news-tabs" aria-label="Filter by category">
        <button type="button" className={`news-tab${!category ? ' is-active' : ''}`} onClick={() => setCategory(ALL)}>
          All Stories <span className="news-tab-count">{live.length}</span>
        </button>
        {categoryOptions.map((c) => (
          <button
            type="button"
            key={c.value}
            className={`news-tab${category === c.value ? ' is-active' : ''}`}
            onClick={() => setCategory((cur) => (cur === c.value ? ALL : c.value))}
            disabled={!categoryCounts[c.value]}
          >
            {c.label} <span className="news-tab-count">{categoryCounts[c.value] ?? 0}</span>
          </button>
        ))}
      </nav>

      <div className="news-filterbar">
        <div className="news-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search news" aria-label="Search news" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort by">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        {hasFilters && (
          <button
            type="button"
            className="news-clear"
            onClick={() => {
              setQ('');
              setCategory(ALL);
              setSort('newest');
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="news-count">
        {filteredLive.length} stor{filteredLive.length === 1 ? 'y' : 'ies'} found
      </p>

      {filteredLive.length === 0 ? (
        <p className="news-empty">No stories match these filters.</p>
      ) : (
        <div className="news-grid">
          {filteredLive.map((item) => (
            <NewsCard key={item.id} item={item} revealRef={revealRef} />
          ))}
        </div>
      )}

      {filteredArchiveYears.length > 0 && (
        <section className="news-archive" aria-label="News archive">
          <div className="news-archive-head">
            <p className="eyebrow">The Archive</p>
            <h2 className="h2">Revisit Earlier Stories</h2>
            <p className="small">Older news the college has published, kept on record and searchable above.</p>
          </div>

          <div className="news-timeline" role="tablist" aria-label="Archive year">
            {filteredArchiveYears.map(([year, rows]) => (
              <button
                type="button"
                key={year}
                role="tab"
                aria-selected={archiveYear === year}
                className={`news-timeline-year${archiveYear === year ? ' is-active' : ''}`}
                onClick={() => setArchiveYear((cur) => (cur === year ? null : year))}
              >
                <span className="news-timeline-year-num">{year}</span>
                <span className="news-timeline-year-count">{rows.length} stor{rows.length === 1 ? 'y' : 'ies'}</span>
              </button>
            ))}
          </div>

          {archiveYear != null && (
            <ul className="news-archive-list">
              {activeArchiveRows.map((r) => (
                <li key={r.id} className="news-archive-row">
                  <span className="news-archive-month">{monthLabel(r.date)}</span>
                  <a href={`/news-notices/news/${r.id}`} className="news-archive-title">{r.title}</a>
                  <span className="news-kicker">{r.category_label}</span>
                  <span className="news-archive-date">{formatDate(r.date)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
