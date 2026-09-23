import { useMemo, useState } from 'react';
import { typeIcon as icon } from '../../lib/content/announcement-icons';

export interface AnnouncementCardData {
  id: number;
  slug: string;
  title: string;
  type: string;
  type_label: string;
  position_name: string | null;
  date_posted: string;
  deadline_or_interview_date: string | null;
  description: string;
  status: 'open' | 'closed';
  attachment_url: string | null;
}

interface Props {
  items: AnnouncementCardData[];
  typeOptions: { value: string; label: string }[];
}

const ALL = '';
const NEW_WITHIN_DAYS = 7;
const SOON_WITHIN_DAYS = 5;

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
  if (days > 0 && days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.round(days / 30.44);
  if (days > 0 && months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.round(days / 365.25);
  if (days > 0) return `${years} year${years === 1 ? '' : 's'} ago`;
  return formatDate(iso);
}

function excerpt(text: string, n = 160) {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n).replace(/\s+\S*$/, '')}…` : t;
}

function DeadlinePill({ item }: { item: AnnouncementCardData }) {
  if (!item.deadline_or_interview_date) return null;
  const days = daysBetween(new Date(item.deadline_or_interview_date), new Date());
  const isSoon = item.status === 'open' && days >= 0 && days <= SOON_WITHIN_DAYS;
  return (
    <span className={`an-pill${isSoon ? ' an-pill-soon' : ''}`}>
      {item.type === 'shortlisted_viva' || item.type === 'shortlisted_written' ? 'Interview' : 'Deadline'}: {formatDate(item.deadline_or_interview_date)}
      {isSoon && <> &middot; {days === 0 ? 'today' : `${days}d left`}</>}
    </span>
  );
}

function AnnouncementCard({ item }: { item: AnnouncementCardData }) {
  const isNew = item.status === 'open' && daysBetween(new Date(), new Date(item.date_posted)) <= NEW_WITHIN_DAYS;

  return (
    <article className="an-card">
      <div className="an-card-top">
        <span className="an-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: icon(item.type) }} />
        </span>
        <div className="an-badge-row">
          <span className={`an-badge an-badge-${item.type}`}>{item.type_label}</span>
          {isNew && <span className="an-badge an-badge-new">New</span>}
        </div>
        <span className={`an-status an-status-${item.status}`}>{item.status === 'open' ? 'Open' : 'Closed'}</span>
      </div>

      <h3 className="an-card-title">
        <a href={`/news-notices/announcements/${item.slug}`}>{item.title}</a>
      </h3>
      {item.position_name && <p className="an-position">{item.position_name}</p>}

      <p className="an-dates">
        Posted {formatDate(item.date_posted)} <span className="an-relative">({relativeTime(item.date_posted)})</span>
      </p>

      <div className="an-card-footer">
        <div className="an-footer-tags">
          <DeadlinePill item={item} />
          {item.attachment_url && (
            <span className="an-pill an-pill-file">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 0 1 4.24 4.24l-9.2 9.19a1 1 0 0 1-1.41-1.41l8.49-8.49"/></svg>
              PDF
            </span>
          )}
        </div>
        <a href={`/news-notices/announcements/${item.slug}`} className="btn btn-secondary an-view">
          View <span className="an-view-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

function SpotlightCard({ item }: { item: AnnouncementCardData }) {
  return (
    <article className="an-spotlight">
      <span className="an-spotlight-tag">Latest Posting</span>
      <div className="an-spotlight-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: icon(item.type) }} />
      </div>
      <div className="an-spotlight-body">
        <div className="an-badge-row">
          <span className={`an-badge an-badge-${item.type}`}>{item.type_label}</span>
          <span className={`an-status an-status-${item.status}`}>{item.status === 'open' ? 'Open' : 'Closed'}</span>
        </div>
        <h2 className="an-spotlight-title">
          <a href={`/news-notices/announcements/${item.slug}`}>{item.title}</a>
        </h2>
        {item.position_name && <p className="an-spotlight-position">{item.position_name}</p>}
        <p className="an-spotlight-desc">{excerpt(item.description, 200)}</p>
        <div className="an-spotlight-footer">
          <p className="an-dates">
            Posted {formatDate(item.date_posted)} <span className="an-relative">({relativeTime(item.date_posted)})</span>
          </p>
          <DeadlinePill item={item} />
        </div>
        <a href={`/news-notices/announcements/${item.slug}`} className="btn btn-primary an-view">
          View Details <span className="an-view-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

type SortKey = 'newest' | 'oldest' | 'deadline';

export default function AnnouncementsBoard({ items, typeOptions }: Props) {
  const [q, setQ] = useState('');
  const [type, setType] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [sort, setSort] = useState<SortKey>('newest');

  const openCount = items.filter((a) => a.status === 'open').length;
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of items) counts[a.type] = (counts[a.type] ?? 0) + 1;
    return counts;
  }, [items]);

  const newest = useMemo(() => [...items].sort((a, b) => b.date_posted.localeCompare(a.date_posted))[0], [items]);
  const showSpotlight = !q && !type && !status && sort === 'newest' && !!newest;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = items.filter((a) => {
      if (showSpotlight && a.id === newest?.id) return false;
      if (type && a.type !== type) return false;
      if (status && a.status !== status) return false;
      if (needle) {
        const haystack = [a.title, a.position_name, a.type_label].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === 'oldest') return a.date_posted.localeCompare(b.date_posted);
      if (sort === 'deadline') {
        if (!a.deadline_or_interview_date) return 1;
        if (!b.deadline_or_interview_date) return -1;
        return a.deadline_or_interview_date.localeCompare(b.deadline_or_interview_date);
      }
      return b.date_posted.localeCompare(a.date_posted);
    });
    return list;
  }, [items, q, type, status, sort, showSpotlight, newest]);

  const hasFilters = q || type || status || sort !== 'newest';

  function toggleType(value: string) {
    setType((cur) => (cur === value ? ALL : value));
  }
  function toggleStatus(value: string) {
    setStatus((cur) => (cur === value ? ALL : value));
  }

  return (
    <div className="an-board">
      {/* Clickable stat tiles double as the type/status filter — a live count
          of what's actually posted, not a static summary line. */}
      <div className="an-tiles">
        <button type="button" className={`an-tile${!type && !status ? ' is-active' : ''}`} onClick={() => { setType(ALL); setStatus(ALL); }}>
          <span className="an-tile-num">{items.length}</span>
          <span className="an-tile-label">All</span>
        </button>
        <button type="button" className={`an-tile an-tile-open${status === 'open' ? ' is-active' : ''}`} onClick={() => toggleStatus('open')}>
          <span className="an-tile-num">{openCount}</span>
          <span className="an-tile-label">Open Now</span>
        </button>
        {typeOptions.map((t) => (
          <button
            type="button"
            key={t.value}
            className={`an-tile${type === t.value ? ' is-active' : ''}`}
            onClick={() => toggleType(t.value)}
            disabled={!typeCounts[t.value]}
          >
            <span className="an-tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: icon(t.value) }} />
            </span>
            <span className="an-tile-num">{typeCounts[t.value] ?? 0}</span>
            <span className="an-tile-label">{t.label}</span>
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
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search announcements"
            aria-label="Search announcements"
          />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort by">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="deadline">Deadline soonest</option>
        </select>
        {hasFilters && (
          <button
            type="button"
            className="an-clear"
            onClick={() => {
              setQ('');
              setType(ALL);
              setStatus(ALL);
              setSort('newest');
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="an-count">
        {filtered.length} announcement{filtered.length === 1 ? '' : 's'}
        {showSpotlight ? ' below the latest posting' : ' found'}
      </p>

      {filtered.length === 0 ? (
        <p className="an-empty">No announcements match these filters.</p>
      ) : (
        <div className="an-grid">
          {filtered.map((item) => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
