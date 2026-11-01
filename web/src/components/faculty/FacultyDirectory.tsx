// Faculty directory (React island, server-rendered so it also works without JS).
// A sticky rounded toolbar (search, department chips, sort, cards/list, more
// filters, "meet someone new"), a Department Heads spotlight, then everyone
// grouped by department — or flat when sorted by name or position. Filters live
// in the address bar (?q=&dept=&pos=&level=&area=&sort=&view=) so a view can be
// shared. All wording comes from Strapi (About – Faculty Page → Labels).
// Styles: styles/faculty-directory.css (.fx).
import { useEffect, useMemo, useRef, useState } from 'react';
import { makeLabels } from '../../lib/content/faculty-labels';

export interface FacultyCardData {
  id: number;
  slug: string;
  full_name: string;
  position: string | null;
  department_name: string | null;
  department_slug: string | null;
  highest_qualification: string | null;
  specialization: string | null;
  research_areas: string[];
  photo_url: string | null;
  is_featured: boolean;
  sort_order: number;
  date_joined: string | null;
}

export interface DepartmentOption {
  name: string;
  slug: string;
}

interface Props {
  people: FacultyCardData[];
  departments: DepartmentOption[];
  labels?: Record<string, string>;
  animationStyle: 'fade' | 'slide' | 'zoom' | 'none';
}

type Sort = 'department' | 'experience' | 'name' | 'position';
type View = 'grid' | 'list';
type Level = 'phd' | 'master' | 'bachelor' | 'other';

const LEVELS: Level[] = ['phd', 'master', 'bachelor', 'other'];

/** Degree level, read from the qualification text ("M.Sc. Physics" → master). */
function levelOf(q: string | null): Level | null {
  if (!q) return null;
  if (/\bph\.?\s?d\b/i.test(q)) return 'phd';
  if (/^m(aster|\.?\s?(sc|a|tech|phil|com|ed|ba)\b)/i.test(q.trim())) return 'master';
  if (/^(bachelor|b\.?\s?(sc|a|ed|tech|com)\b)/i.test(q.trim())) return 'bachelor';
  return 'other';
}

function rank(position: string | null): number {
  const p = (position ?? '').toLowerCase();
  if (/associate prof/.test(p)) return 1;
  if (/assistant prof/.test(p)) return 2;
  if (/^prof/.test(p)) return 0;
  if (/hod|head/.test(p)) return 3;
  if (/associate lect/.test(p)) return 5;
  if (/assistant lect/.test(p)) return 6;
  if (/lect/.test(p)) return 4;
  return 7;
}

function initials(name: string): string {
  const parts = name.replace(/^Dr\.?\s+/i, '').split(' ').filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

const byName = (a: FacultyCardData, b: FacultyCardData) =>
  a.full_name.replace(/^Dr\.?\s+/i, '').localeCompare(b.full_name.replace(/^Dr\.?\s+/i, ''));

/** Most experienced first: the order set in Strapi (Faculty Profiles → Sort order,
 * 1 = most senior), then the earlier joining date, then name. */
const bySeniority = (a: FacultyCardData, b: FacultyCardData) =>
  (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
  (a.date_joined && b.date_joined ? a.date_joined.localeCompare(b.date_joined) : a.date_joined ? -1 : b.date_joined ? 1 : 0) ||
  byName(a, b);

const arrow = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function Chip({ on, onClick, children, count }: { on: boolean; onClick: () => void; children: React.ReactNode; count?: number }) {
  return (
    <button type="button" className={`fx-chip${on ? ' is-on' : ''}`} aria-pressed={on} onClick={onClick}>
      {children}
      {count !== undefined && <span className="fx-chip-n">{count}</span>}
    </button>
  );
}

interface CardProps {
  person: FacultyCardData;
  index: number;
  anim: string;
  showDept: boolean;
  head?: boolean;
  picked: boolean;
  profileLabel: string;
}

function Card({ person: p, index, anim, showDept, head, picked, profileLabel }: CardProps) {
  const lvl = levelOf(p.highest_qualification);
  return (
    <article
      id={`fx-p-${p.id}`}
      className={`fx-card fx-a-${anim}${head ? ' fx-card--head' : ''}${picked ? ' is-picked' : ''}`}
      style={{ ['--i' as string]: Math.min(index, 14) }}
      data-level={lvl ?? undefined}
    >
      <div className="fx-photo">
        {p.photo_url ? (
          <img src={p.photo_url} alt="" loading="lazy" decoding="async" width={441} height={566} />
        ) : (
          <span className="fx-initials" aria-hidden="true">{initials(p.full_name)}</span>
        )}
        {p.specialization && (
          <div className="fx-peek" aria-hidden="true">
            <p>{p.specialization}</p>
          </div>
        )}
      </div>
      <div className="fx-body">
        {p.position && <p className="fx-position">{p.position}</p>}
        <h3 className="fx-name">
          <a href={`/about/faculty/${p.slug}`}>{p.full_name}</a>
        </h3>
        {showDept && p.department_name && <p className="fx-dept">{p.department_name}</p>}
        {p.highest_qualification && <p className="fx-qual">{p.highest_qualification}</p>}
        {p.research_areas.length > 0 && (
          <ul className="fx-tags">
            {p.research_areas.slice(0, 3).map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
        <span className="fx-go">
          {profileLabel} {arrow}
        </span>
      </div>
    </article>
  );
}

export default function FacultyDirectory({ people, departments, labels, animationStyle }: Props) {
  const t = useMemo(() => makeLabels(labels), [labels]);

  const [q, setQ] = useState('');
  const [dept, setDept] = useState('');
  const [pos, setPos] = useState('');
  const [level, setLevel] = useState<Level | ''>('');
  const [area, setArea] = useState('');
  const [sort, setSort] = useState<Sort>('department');
  const [view, setView] = useState<View>('grid');
  const [more, setMore] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Read the address bar once after mount (not during render: keeps SSR and hydration identical).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const d = sp.get('dept') ?? '';
    const l = sp.get('level') ?? '';
    const s = sp.get('sort');
    const v = sp.get('view');
    setQ(sp.get('q') ?? '');
    if (departments.some((x) => x.slug === d)) setDept(d);
    setPos(sp.get('pos') ?? '');
    if (LEVELS.includes(l as Level)) setLevel(l as Level);
    setArea(sp.get('area') ?? '');
    if (s === 'name' || s === 'position' || s === 'experience') setSort(s);
    if (v === 'list') setView('list');
    if (sp.get('pos') || l || sp.get('area')) setMore(true);
    setReady(true);
  }, [departments]);

  // Keep the address bar in step with the filters.
  useEffect(() => {
    if (!ready) return;
    const sp = new URLSearchParams();
    if (q.trim()) sp.set('q', q.trim());
    if (dept) sp.set('dept', dept);
    if (pos) sp.set('pos', pos);
    if (level) sp.set('level', level);
    if (area) sp.set('area', area);
    if (sort !== 'department') sp.set('sort', sort);
    if (view !== 'grid') sp.set('view', view);
    const qs = sp.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash);
  }, [ready, q, dept, pos, level, area, sort, view]);

  // "/" jumps to the search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const positions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of people) if (p.position) counts.set(p.position, (counts.get(p.position) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]));
  }, [people]);
  const levels = useMemo(() => LEVELS.filter((l) => people.some((p) => levelOf(p.highest_qualification) === l)), [people]);
  const areas = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of people) for (const a of p.research_areas) counts.set(a, (counts.get(a) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [people]);

  const needle = q.trim().toLowerCase();
  const matches = (p: FacultyCardData, skipDept: boolean) => {
    if (needle) {
      const hay = [p.full_name, p.position, p.specialization, p.highest_qualification, p.department_name, p.research_areas.join(' ')]
        .filter(Boolean).join(' ').toLowerCase();
      if (!needle.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    if (!skipDept && dept && p.department_slug !== dept) return false;
    if (pos && p.position !== pos) return false;
    if (level && levelOf(p.highest_qualification) !== level) return false;
    if (area && !p.research_areas.includes(area)) return false;
    return true;
  };

  const filtered = useMemo(() => people.filter((p) => matches(p, false)), [people, needle, dept, pos, level, area]); // eslint-disable-line react-hooks/exhaustive-deps
  const deptCounts = useMemo(() => {
    const m = new Map<string, number>();
    let all = 0;
    for (const p of people) {
      if (!matches(p, true)) continue;
      all++;
      if (p.department_slug) m.set(p.department_slug, (m.get(p.department_slug) ?? 0) + 1);
    }
    return { all, m };
  }, [people, needle, pos, level, area]); // eslint-disable-line react-hooks/exhaustive-deps

  const heads = filtered.filter((p) => p.is_featured).sort(bySeniority);
  const rest = filtered.filter((p) => !p.is_featured);
  const flat = useMemo(() => {
    const list = [...rest];
    if (sort === 'position') list.sort((a, b) => rank(a.position) - rank(b.position) || bySeniority(a, b));
    else if (sort === 'name') list.sort(byName);
    else list.sort(bySeniority);
    return list;
  }, [rest, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const groups = departments
    .map((d) => ({ d, members: rest.filter((p) => p.department_slug === d.slug).sort(bySeniority) }))
    .filter((g) => g.members.length > 0);
  const orphaned = rest.filter((p) => !departments.some((d) => d.slug === p.department_slug)).sort(bySeniority);

  const activeChips: { key: string; text: string; clear: () => void }[] = [];
  if (q.trim()) activeChips.push({ key: 'q', text: `“${q.trim()}”`, clear: () => setQ('') });
  if (dept) activeChips.push({ key: 'dept', text: departments.find((d) => d.slug === dept)?.name ?? dept, clear: () => setDept('') });
  if (pos) activeChips.push({ key: 'pos', text: pos, clear: () => setPos('') });
  if (level) activeChips.push({ key: 'level', text: t(`level_${level}`) || t('other_label'), clear: () => setLevel('') });
  if (area) activeChips.push({ key: 'area', text: area, clear: () => setArea('') });
  const clearAll = () => { setQ(''); setDept(''); setPos(''); setLevel(''); setArea(''); };

  const countText = (filtered.length === 1 ? t('count_one') : t('count_many')).replace('{count}', String(filtered.length));
  const filterKey = `${needle}|${dept}|${pos}|${level}|${area}|${sort}|${view}`;
  // Grouped by department only when nothing is filtered; any search or filter shows everyone together.
  const grouped = sort === 'department' && activeChips.length === 0;

  const surprise = () => {
    if (filtered.length === 0) return;
    const p = filtered[Math.floor(Math.random() * filtered.length)];
    setPicked(p.id);
    const el = document.getElementById(`fx-p-${p.id}`);
    el?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    window.setTimeout(() => setPicked((cur) => (cur === p.id ? null : cur)), 2600);
  };

  const renderCards = (list: FacultyCardData[], showDept: boolean, head = false) =>
    list.map((p, i) => (
      <Card key={p.id} person={p} index={i} anim={animationStyle} showDept={showDept} head={head} picked={picked === p.id} profileLabel={t('profile_label')} />
    ));

  const levelText = (l: Level) => (l === 'other' ? t('other_label') : t(`level_${l}`));

  return (
    <div className="fx-dir" id="directory" data-view={view}>
      {/* ---------- Toolbar ---------- */}
      <div className="fx-bar">
        <div className="fx-bar-row">
          <label className="fx-search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('search_placeholder')}
              aria-label={t('search_label')}
              autoComplete="off"
            />
            <kbd aria-hidden="true">/</kbd>
          </label>

          <label className="fx-select">
            <span>{t('sort_label')}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="department">{t('sort_department')}</option>
              <option value="experience">{t('sort_experience')}</option>
              <option value="name">{t('sort_name')}</option>
              <option value="position">{t('sort_position')}</option>
            </select>
          </label>

          <div className="fx-toggle" role="group" aria-label={t('view_label')}>
            <button type="button" className={view === 'grid' ? 'is-on' : ''} aria-pressed={view === 'grid'} onClick={() => setView('grid')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>
              <span>{t('view_grid')}</span>
            </button>
            <button type="button" className={view === 'list' ? 'is-on' : ''} aria-pressed={view === 'list'} onClick={() => setView('list')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><rect x="3" y="4" width="18" height="4" rx="2" /><rect x="3" y="10" width="18" height="4" rx="2" /><rect x="3" y="16" width="18" height="4" rx="2" /></svg>
              <span>{t('view_list')}</span>
            </button>
          </div>

          <button type="button" className={`fx-btn${more ? ' is-on' : ''}`} aria-expanded={more} aria-controls="fx-more" onClick={() => setMore((m) => !m)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
            {more ? t('fewer_filters') : t('more_filters')}
          </button>

          <button type="button" className="fx-btn fx-btn--gold" onClick={surprise} disabled={filtered.length === 0}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" /></svg>
            {t('random_label')}
          </button>
        </div>

        <div className="fx-chips" role="group" aria-label={t('sort_department')}>
          <Chip on={dept === ''} onClick={() => setDept('')} count={deptCounts.all}>{t('all_label')}</Chip>
          {departments.map((d) => (
            <Chip key={d.slug} on={dept === d.slug} onClick={() => setDept(dept === d.slug ? '' : d.slug)} count={deptCounts.m.get(d.slug) ?? 0}>
              {d.name}
            </Chip>
          ))}
        </div>
      </div>

      {more && (
        <div className="fx-more" id="fx-more">
          {positions.length > 1 && (
            <div className="fx-more-row">
              <p className="fx-more-label">{t('position_label')}</p>
              <div className="fx-chips fx-chips--wrap">
                {positions.map(([name, n]) => (
                  <Chip key={name} on={pos === name} onClick={() => setPos(pos === name ? '' : name)} count={n}>{name}</Chip>
                ))}
              </div>
            </div>
          )}
          {levels.length > 1 && (
            <div className="fx-more-row">
              <p className="fx-more-label">{t('level_label')}</p>
              <div className="fx-chips fx-chips--wrap">
                {levels.map((l) => (
                  <Chip key={l} on={level === l} onClick={() => setLevel(level === l ? '' : l)} count={people.filter((p) => levelOf(p.highest_qualification) === l).length}>
                    {levelText(l)}
                  </Chip>
                ))}
              </div>
            </div>
          )}
          {areas.length > 0 && (
            <div className="fx-more-row">
              <p className="fx-more-label">{t('research_label')}</p>
              <div className="fx-chips fx-chips--wrap">
                {areas.map(([name, n]) => (
                  <Chip key={name} on={area === name} onClick={() => setArea(area === name ? '' : name)} count={n}>{name}</Chip>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="fx-status">
        <p role="status" aria-live="polite" className="fx-count">{countText}</p>
        {activeChips.length > 0 && (
          <ul className="fx-active">
            {activeChips.map((c) => (
              <li key={c.key}>
                <button type="button" onClick={c.clear} aria-label={`${c.text} ×`}>
                  {c.text} <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
            <li><button type="button" className="fx-clear" onClick={clearAll}>{t('clear_label')}</button></li>
          </ul>
        )}
      </div>

      {/* ---------- Department heads ---------- */}
      {heads.length > 0 && (
        <section className="fx-section fx-heads" aria-labelledby="fx-heads-h">
          <header className="fx-sec-head">
            <p className="fx-eyebrow">{t('heads_eyebrow')}</p>
            <h2 id="fx-heads-h" className="fx-h2">{t('heads_heading')}</h2>
          </header>
          <div className={`fx-grid fx-grid--heads`} key={`h-${filterKey}`}>
            {renderCards(heads, true, true)}
          </div>
        </section>
      )}

      {/* ---------- Everyone else ---------- */}
      {rest.length > 0 && (
        <section className="fx-section" aria-labelledby="fx-all-h">
          <header className="fx-sec-head">
            <p className="fx-eyebrow">{t('directory_eyebrow')}</p>
            <h2 id="fx-all-h" className="fx-h2">{t('directory_heading')}</h2>
          </header>

          {grouped ? (
            <>
              {groups.map((g) => (
                <div className="fx-group" key={g.d.slug}>
                  <header className="fx-group-head">
                    <h3>{g.d.name}</h3>
                    <p className="fx-group-n">{g.members.length}</p>
                    <a href={`/academics/departments/${g.d.slug}`}>{t('department_page')} {arrow}</a>
                  </header>
                  <div className="fx-grid" key={`${g.d.slug}-${filterKey}`}>{renderCards(g.members, false)}</div>
                </div>
              ))}
              {orphaned.length > 0 && (
                <div className="fx-group">
                  <header className="fx-group-head"><h3>{t('other_label')}</h3><p className="fx-group-n">{orphaned.length}</p></header>
                  <div className="fx-grid" key={`o-${filterKey}`}>{renderCards(orphaned, false)}</div>
                </div>
              )}
            </>
          ) : (
            <div className="fx-grid fx-grid--flat" key={`f-${filterKey}`}>{renderCards(flat, true)}</div>
          )}
        </section>
      )}

      {filtered.length === 0 && (
        <div className="fx-empty">
          <span className="fx-empty-mark" aria-hidden="true">?</span>
          <p>{t('empty_message')}</p>
          <button type="button" className="fx-btn fx-btn--gold" onClick={clearAll}>{t('clear_label')}</button>
        </div>
      )}
    </div>
  );
}
