import { useMemo, useState } from 'react';

export interface NewsletterCardData {
  id: number;
  slug: string;
  title: string;
  edition: 'spring' | 'summer' | 'autumn' | 'winter';
  year: number;
  publication_date: string | null;
  description: string | null;
  cover_image_url: string | null;
  topics: string[];
}

const EDITION_LABELS: Record<string, string> = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' };
const ALL = '';

function initials(title: string): string {
  const parts = title.split(' ').filter(Boolean);
  const base = parts.length > 1 ? parts.map((w) => w[0]).slice(0, 2).join('') : title.slice(0, 2);
  return base.toUpperCase();
}

function NewsletterCard({ item }: { item: NewsletterCardData }) {
  return (
    <article className="nl-card">
      {item.cover_image_url ? (
        <img src={item.cover_image_url} alt="" className="nl-card-cover" />
      ) : (
        <div className="nl-card-cover nl-card-cover-placeholder" aria-hidden="true">
          <span>{initials(item.title)}</span>
          <span className="nl-card-cover-sub">
            {EDITION_LABELS[item.edition]} {item.year}
          </span>
        </div>
      )}
      <div className="nl-card-body">
        <h3>{item.title}</h3>
        <p className="nl-card-edition">
          {EDITION_LABELS[item.edition]} Edition {item.year}
        </p>
        {item.description && <p className="nl-card-desc">{item.description}</p>}
        <div className="nl-card-actions">
          <a href={`/newsletter/${item.slug}`} className="btn btn-secondary">
            View Details
          </a>
        </div>
      </div>
    </article>
  );
}

export default function NewsletterArchive({ items }: { items: NewsletterCardData[] }) {
  const [q, setQ] = useState('');
  const [year, setYear] = useState(ALL);
  const [edition, setEdition] = useState(ALL);

  const years = useMemo(() => Array.from(new Set(items.map((n) => n.year))).sort((a, b) => b - a), [items]);
  const editions = useMemo(() => Array.from(new Set(items.map((n) => n.edition))), [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((n) => {
      if (needle) {
        const haystack = [n.title, EDITION_LABELS[n.edition], String(n.year), n.description, ...n.topics]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if (year && String(n.year) !== year) return false;
      if (edition && n.edition !== edition) return false;
      return true;
    });
  }, [items, q, year, edition]);

  const hasFilters = q || year || edition;

  return (
    <div className="nl-archive">
      <div className="nl-filterbar">
        <div className="nl-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search newsletters" aria-label="Search newsletters" />
        </div>
        <select value={year} onChange={(e) => setYear(e.target.value)} aria-label="Filter by year">
          <option value={ALL}>All Years</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
        <select value={edition} onChange={(e) => setEdition(e.target.value)} aria-label="Filter by edition">
          <option value={ALL}>All Editions</option>
          {editions.map((e) => (
            <option key={e} value={e}>
              {EDITION_LABELS[e]}
            </option>
          ))}
        </select>
        {hasFilters && (
          <button
            type="button"
            className="nl-clear"
            onClick={() => {
              setQ('');
              setYear(ALL);
              setEdition(ALL);
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="nl-count">
        {filtered.length} edition{filtered.length === 1 ? '' : 's'} found
      </p>

      {filtered.length === 0 ? (
        <p className="nl-empty">No newsletters match these filters.</p>
      ) : (
        <div className="nl-grid">
          {filtered.map((item) => (
            <NewsletterCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
