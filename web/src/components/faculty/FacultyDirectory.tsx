import { useMemo, useState } from 'react';

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
}

export interface DepartmentOption {
  name: string;
  slug: string;
}

interface Props {
  people: FacultyCardData[];
  departments: DepartmentOption[];
  cardStyle: 'rounded' | 'sharp' | 'bordered';
  animationStyle: 'fade' | 'slide' | 'zoom' | 'none';
  cardsPerRow: number;
}

const ALL = '';

function distinct(values: (string | null)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort((a, b) => a.localeCompare(b));
}

function initials(name: string): string {
  const parts = name.replace(/^Dr\.?\s+/i, '').split(' ').filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

function FacultyCard({ person, animationStyle, delayIndex }: { person: FacultyCardData; animationStyle: string; delayIndex: number }) {
  return (
    <article className={`fd-card fd-anim-${animationStyle}`} style={{ animationDelay: `${(delayIndex % 9) * 50}ms` }}>
      {person.photo_url ? (
        <img src={person.photo_url} alt="" className="fd-card-photo" />
      ) : (
        <div className="fd-card-photo fd-card-photo-placeholder" aria-hidden="true">
          {initials(person.full_name)}
        </div>
      )}
      <div className="fd-card-body">
        <h3 className="fd-card-name">
          <a href={`/about/faculty/${person.slug}`}>{person.full_name}</a>
        </h3>
        {person.position && <p className="fd-card-position">{person.position}</p>}
        {person.department_name && <p className="fd-card-dept">{person.department_name}</p>}
        {person.highest_qualification && <p className="fd-card-qual">{person.highest_qualification}</p>}
        {person.research_areas.length > 0 && (
          <ul className="fd-card-tags">
            {person.research_areas.slice(0, 3).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        <a href={`/about/faculty/${person.slug}`} className="fd-card-link">
          View Profile <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

export default function FacultyDirectory({ people, departments, cardStyle, animationStyle, cardsPerRow }: Props) {
  const [q, setQ] = useState('');
  const [department, setDepartment] = useState(ALL);
  const [position, setPosition] = useState(ALL);
  const [qualification, setQualification] = useState(ALL);
  const [researchArea, setResearchArea] = useState(ALL);

  const positions = useMemo(() => distinct(people.map((p) => p.position)), [people]);
  const qualifications = useMemo(() => distinct(people.map((p) => p.highest_qualification)), [people]);
  const researchAreas = useMemo(() => distinct(people.flatMap((p) => p.research_areas)), [people]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return people.filter((p) => {
      if (needle) {
        const haystack = [p.full_name, p.position, p.specialization, p.research_areas.join(', ')]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if (department && p.department_slug !== department) return false;
      if (position && p.position !== position) return false;
      if (qualification && p.highest_qualification !== qualification) return false;
      if (researchArea && !p.research_areas.some((a) => a.toLowerCase().includes(researchArea.toLowerCase()))) return false;
      return true;
    });
  }, [people, q, department, position, qualification, researchArea]);

  const heads = filtered.filter((p) => p.is_featured);
  const rest = filtered.filter((p) => !p.is_featured);
  const groups = departments
    .map((d) => ({ department: d, members: rest.filter((p) => p.department_slug === d.slug) }))
    .filter((g) => g.members.length > 0);
  // Faculty not attached to any known department still needs to show up somewhere.
  const orphaned = rest.filter((p) => !departments.some((d) => d.slug === p.department_slug));

  const hasFilters = q || department || position || qualification || researchArea;
  const filterKey = `${q}|${department}|${position}|${qualification}|${researchArea}`;

  return (
    <div className="fd-root" data-card-style={cardStyle}>
      <div className="fd-filterbar">
        <div className="fd-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search faculty"
            aria-label="Search faculty"
          />
        </div>
        <select value={department} onChange={(e) => setDepartment(e.target.value)} aria-label="Filter by department">
          <option value={ALL}>All Departments</option>
          {departments.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
        <select value={position} onChange={(e) => setPosition(e.target.value)} aria-label="Filter by position">
          <option value={ALL}>All Positions</option>
          {positions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select value={qualification} onChange={(e) => setQualification(e.target.value)} aria-label="Filter by qualification">
          <option value={ALL}>All Qualifications</option>
          {qualifications.map((qq) => (
            <option key={qq} value={qq}>
              {qq}
            </option>
          ))}
        </select>
        <select value={researchArea} onChange={(e) => setResearchArea(e.target.value)} aria-label="Filter by research area">
          <option value={ALL}>All Research Areas</option>
          {researchAreas.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {heads.length > 0 && (
        <section className="fd-section" aria-labelledby="fd-leadership-heading">
          <p className="eyebrow">Leadership</p>
          <h2 id="fd-leadership-heading" className="h2">
            Department Heads
          </h2>
          <div className="fd-grid fd-grid-heads" style={{ ['--cards-per-row' as string]: Math.min(cardsPerRow, 3) }} key={`heads-${filterKey}`}>
            {heads.map((p, i) => (
              <FacultyCard key={p.id} person={p} animationStyle={animationStyle} delayIndex={i} />
            ))}
          </div>
        </section>
      )}

      <section className="fd-section" aria-labelledby="fd-directory-heading">
        <p className="eyebrow">Directory</p>
        <h2 id="fd-directory-heading" className="h2">
          All Faculty Members
        </h2>
        <p className="fd-count">
          {filtered.length} faculty member{filtered.length === 1 ? '' : 's'} found
          {hasFilters && (
            <button
              type="button"
              className="fd-clear"
              onClick={() => {
                setQ('');
                setDepartment(ALL);
                setPosition(ALL);
                setQualification(ALL);
                setResearchArea(ALL);
              }}
            >
              Clear filters
            </button>
          )}
        </p>

        {filtered.length === 0 && <p className="fd-empty">No faculty members match these filters.</p>}

        {groups.map((g) => (
          <div className="fd-dept-group" key={g.department.slug}>
            <h3 className="fd-dept-heading">
              <a href={`/academics/departments/${g.department.slug}`}>{g.department.name}</a>
            </h3>
            <div className="fd-grid" style={{ ['--cards-per-row' as string]: cardsPerRow }} key={`${g.department.slug}-${filterKey}`}>
              {g.members.map((p, i) => (
                <FacultyCard key={p.id} person={p} animationStyle={animationStyle} delayIndex={i} />
              ))}
            </div>
          </div>
        ))}

        {orphaned.length > 0 && (
          <div className="fd-dept-group">
            <h3 className="fd-dept-heading">Other</h3>
            <div className="fd-grid" style={{ ['--cards-per-row' as string]: cardsPerRow }} key={`other-${filterKey}`}>
              {orphaned.map((p, i) => (
                <FacultyCard key={p.id} person={p} animationStyle={animationStyle} delayIndex={i} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
