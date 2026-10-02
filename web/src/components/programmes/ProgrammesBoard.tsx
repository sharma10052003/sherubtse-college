import { useState } from 'react';

export interface ProgrammeCardData {
  id: number;
  slug: string;
  programme_name: string;
  level: 'undergraduate' | 'postgraduate';
  degree_type: string | null;
  duration: string | null;
  short_description: string | null;
  overview: string | null;
  department_name: string | null;
  department_slug: string | null;
  annual_fee: number | null;
  intake_status: 'open' | 'closed' | 'waitlist' | null;
}

interface Props {
  items: ProgrammeCardData[];
}

const INTAKE_LABELS: Record<string, string> = {
  open: 'Admissions Open',
  closed: 'Admissions Closed',
  waitlist: 'Waitlist Only',
};

function formatFee(fee: number | null) {
  return fee != null ? `Nu. ${fee.toLocaleString()}` : '—';
}

function DeptTag({ p }: { p: ProgrammeCardData }) {
  return <span className="prog-tag">{p.department_name ?? 'General'}</span>;
}

export default function ProgrammesBoard({ items }: Props) {
  const [openId, setOpenId] = useState<number | null>(null);

  const current = openId != null ? items.find((p) => p.id === openId) ?? null : null;
  const navIdx = current ? items.findIndex((p) => p.id === current.id) : -1;
  function step(delta: number) {
    if (navIdx === -1 || items.length === 0) return;
    const next = items[(navIdx + delta + items.length) % items.length];
    setOpenId(next.id);
  }

  return (
    <div className="prog-board">
      <div className="prog-grid">
        {items.map((p) => (
          <article key={p.id} className="prog-card">
            <DeptTag p={p} />
            <h2 className="prog-card-title">{p.programme_name}</h2>
            <p className="prog-card-desc">
              {p.short_description ?? (p.level === 'undergraduate' ? 'Undergraduate programme' : 'Postgraduate programme')}
            </p>
            <div className="prog-card-actions">
              <a href={`/academics/programmes/${p.slug}`} className="prog-link">View programme</a>
              <button type="button" className="prog-quickbtn" onClick={() => setOpenId(p.id)}>Quick view</button>
            </div>
          </article>
        ))}
      </div>

      {current && (
        <div className="prog-drawer-overlay">
          <button type="button" className="prog-drawer-scrim" aria-label="Close quick view" onClick={() => setOpenId(null)} />
          <aside role="dialog" aria-modal="true" aria-labelledby="prog-qv-title" className="prog-drawer">
            <div className="prog-drawer-head">
              <DeptTag p={current} />
              <button type="button" className="prog-drawer-close" aria-label="Close quick view" onClick={() => setOpenId(null)}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0d1b4b" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
              </button>
            </div>

            <h2 id="prog-qv-title" className="prog-drawer-title">{current.programme_name}</h2>
            {(current.overview || current.short_description) && <p className="prog-drawer-overview">{current.overview ?? current.short_description}</p>}

            <dl className="prog-facts">
              <div><dt>Award</dt><dd>{current.degree_type ?? '—'}</dd></div>
              <div><dt>Duration</dt><dd>{current.duration ?? '—'}</dd></div>
              <div><dt>Annual Fee</dt><dd>{formatFee(current.annual_fee)}</dd></div>
              <div><dt>Admissions</dt><dd>{current.intake_status ? INTAKE_LABELS[current.intake_status] : '—'}</dd></div>
            </dl>

            <div className="prog-drawer-cta">
              <a href={`/academics/programmes/${current.slug}`} className="btn btn-primary">Go to programme page</a>
            </div>

            {items.length > 1 && (
              <div className="prog-drawer-nav">
                <button type="button" onClick={() => step(-1)} aria-label="Previous programme">‹ Previous</button>
                <span>{navIdx + 1} of {items.length}</span>
                <button type="button" onClick={() => step(1)} aria-label="Next programme">Next ›</button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
