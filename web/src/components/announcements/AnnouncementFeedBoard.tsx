import { useMemo, useState } from 'react';
import type { FeedGroup, FeedItem } from '../../lib/content/announcement-feed';

interface Props {
  items: FeedItem[];
  groupLabels: Record<FeedGroup, string>;
}

const GROUPS: FeedGroup[] = ['vacancies', 'important', 'general'];
const NEW_WITHIN_DAYS = 7;
const SOON_WITHIN_DAYS = 5;

const GROUP_ICONS: Record<FeedGroup, string> = {
  vacancies: '<rect x="3" y="7" width="18" height="13"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
  important: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  general: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
};

function Icon({ path, width = 2 }: { path: string; width?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: path }} />
  );
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((a.setHours(0, 0, 0, 0) - b.setHours(0, 0, 0, 0)) / 86400000);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function relativeTime(iso: string): string {
  const days = daysBetween(new Date(), new Date(iso));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days > 0 && days < 30) return `${days} days ago`;
  const months = Math.round(days / 30.44);
  if (days > 0 && months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.round(days / 365.25);
  if (days > 0) return `${years} year${years === 1 ? '' : 's'} ago`;
  return formatDate(iso);
}

function Badges({ item }: { item: FeedItem }) {
  const isNew = daysBetween(new Date(), new Date(item.date)) <= NEW_WITHIN_DAYS;
  return (
    <>
      <span className={`an-badge an-tone-${item.tone}`}>{item.label}</span>
      {item.group === 'vacancies' && <span className="an-badge an-badge-kind">Vacancy</span>}
      {isNew && <span className="an-badge an-badge-new">New</span>}
    </>
  );
}

function DeadlinePill({ item }: { item: FeedItem }) {
  if (!item.deadline) return null;
  const days = daysBetween(new Date(item.deadline), new Date());
  const isSoon = item.status === 'open' && days >= 0 && days <= SOON_WITHIN_DAYS;
  return (
    <span className={`an-pill${isSoon ? ' an-pill-soon' : ''}`}>
      {item.deadline_label}: {formatDate(item.deadline)}
      {isSoon && <> &middot; {days === 0 ? 'today' : `${days}d left`}</>}
    </span>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  return (
    <article className={`an-card an-card-${item.tone}`}>
      <div className="an-card-top">
        <span className="an-icon">
          <Icon path={GROUP_ICONS[item.group]} />
        </span>
        <div className="an-badge-row">
          <Badges item={item} />
        </div>
        {item.status && <span className={`an-status an-status-${item.status}`}>{item.status === 'open' ? 'Open' : 'Closed'}</span>}
      </div>
      <h3 className="an-card-title">
        <a href={item.href}>{item.title}</a>
      </h3>
      {item.meta && <p className="an-position">{item.meta}</p>}
      {item.summary && <p className="an-summary">{item.summary}</p>}
      <p className="an-dates">
        Posted {formatDate(item.date)} <span className="an-relative">({relativeTime(item.date)})</span>
      </p>
      <div className="an-card-footer">
        <div className="an-footer-tags">
          <DeadlinePill item={item} />
          {item.has_attachment && <span className="an-pill an-pill-file">PDF</span>}
        </div>
        <a href={item.href} className="btn btn-secondary an-view">
          {item.group === 'vacancies' ? 'View vacancy' : 'Read more'} <span className="an-view-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

function SpotlightCard({ item }: { item: FeedItem }) {
  return (
    <article className={`an-spotlight an-card-${item.tone}`}>
      <span className="an-spotlight-tag">Latest Announcement</span>
      <div className="an-spotlight-icon">
        <Icon path={GROUP_ICONS[item.group]} width={1.6} />
      </div>
      <div className="an-spotlight-body">
        <div className="an-badge-row">
          <Badges item={item} />
          {item.status && <span className={`an-status an-status-${item.status}`}>{item.status === 'open' ? 'Open' : 'Closed'}</span>}
        </div>
        <h2 className="an-spotlight-title">
          <a href={item.href}>{item.title}</a>
        </h2>
        {item.meta && <p className="an-spotlight-position">{item.meta}</p>}
        {item.summary && <p className="an-spotlight-desc">{item.summary}</p>}
        <div className="an-spotlight-footer">
          <p className="an-dates">
            Posted {formatDate(item.date)} <span className="an-relative">({relativeTime(item.date)})</span>
          </p>
          <DeadlinePill item={item} />
        </div>
        <a href={item.href} className="btn btn-primary an-view">
          {item.group === 'vacancies' ? 'View vacancy' : 'Read more'} <span className="an-view-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

export default function AnnouncementFeedBoard({ items, groupLabels }: Props) {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState<FeedGroup | ''>('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  const counts = useMemo(() => {
    const c: Record<FeedGroup, number> = { vacancies: 0, important: 0, general: 0 };
    for (const i of items) c[i.group]++;
    return c;
  }, [items]);

  const newest = items[0];
  const showSpotlight = !q && !group && sort === 'newest' && !!newest;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = items.filter((i) => {
      if (showSpotlight && i.key === newest?.key) return false;
      if (group && i.group !== group) return false;
      if (needle && ![i.title, i.label, i.meta, i.summary].filter(Boolean).join(' ').toLowerCase().includes(needle)) return false;
      return true;
    });
    return sort === 'oldest' ? [...list].reverse() : list;
  }, [items, q, group, sort, showSpotlight, newest]);

  const hasFilters = q || group || sort !== 'newest';

  if (items.length === 0) {
    return <p className="an-empty">There are no current announcements. Please check back soon.</p>;
  }

  return (
    <div className="an-board">
      <div className="an-tiles an-tiles-4">
        <button type="button" className={`an-tile${!group ? ' is-active' : ''}`} aria-pressed={!group} onClick={() => setGroup('')}>
          <span className="an-tile-num">{items.length}</span>
          <span className="an-tile-label">All</span>
        </button>
        {GROUPS.map((g) => (
          <button
            type="button"
            key={g}
            className={`an-tile an-tile-${g}${group === g ? ' is-active' : ''}`}
            aria-pressed={group === g}
            onClick={() => setGroup((cur) => (cur === g ? '' : g))}
            disabled={!counts[g]}
          >
            <span className="an-tile-icon">
              <Icon path={GROUP_ICONS[g]} />
            </span>
            <span className="an-tile-num">{counts[g]}</span>
            <span className="an-tile-label">{groupLabels[g]}</span>
          </button>
        ))}
      </div>

      {showSpotlight && <SpotlightCard item={newest} />}

      <div className="an-filterbar">
        <div className="an-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search announcements" aria-label="Search announcements" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')} aria-label="Sort by">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        {hasFilters && (
          <button type="button" className="an-clear" onClick={() => { setQ(''); setGroup(''); setSort('newest'); }}>
            Clear filters
          </button>
        )}
      </div>

      <p className="an-count" aria-live="polite">
        {filtered.length} announcement{filtered.length === 1 ? '' : 's'}
        {showSpotlight ? ' below the latest' : ' found'}
      </p>

      {filtered.length === 0 ? (
        <p className="an-empty">{showSpotlight ? 'Nothing else to show yet.' : 'No announcements match these filters.'}</p>
      ) : (
        <div className="an-grid">
          {filtered.map((item) => (
            <FeedCard key={item.key} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
