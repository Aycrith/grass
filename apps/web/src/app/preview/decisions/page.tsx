/* eslint-disable react/no-unescaped-entities */
/**
 * /preview/decisions — Decision Log index.
 *
 * Lists all ratified decisions (D-0001..0007) + 5 pending decisions
 * awaiting steward action. Hardcoded table, not markdown, because the
 * decision log lives in state/ledger.yaml which isn't a single markdown
 * file renderable in this context.
 */

export const metadata = {
  title: 'Preview — Decision Log',
  robots: { index: false, follow: false },
};

const RATIFIED_DECISIONS = [
  {
    id: 'D-0001',
    title: 'Pilot Exception (charter amendment)',
    date: '2026-07-10',
    status: 'ratified',
    summary: 'When phase exit blocks Mission 1 for >14 days, Pilot Exception may invoke with (a) Decision Template entry, (b) risk-register entry, (c) explicit rollback path, (d) state-ledger pending_phase_exit, (e) charter-amendment review within 30 days.',
    source: 'constitution/charter-amendments/pilot-exception.md',
  },
  {
    id: 'D-0002',
    title: 'Tech stack primary',
    date: '2026-07-10',
    status: 'ratified',
    summary: 'Next.js 15 + Supabase Postgres + Stripe + Vercel + Jobber (Months 0-6). Infra ceiling: $200/mo through Month 6.',
    source: 'CLAUDE.md → Tech stack section',
  },
  {
    id: 'D-0003',
    title: 'Mission 1 service area',
    date: '2026-07-10',
    status: 'ratified',
    summary: 'Largo, FL 33771 + adjacent ZIPs (33770, 33778, 33773, 33774, 33756). First legal service line: landscaping WITHOUT fertilization/irrigation/pest until respective licenses acquired.',
    source: 'state/ledger.yaml → OBJ-M2-004 service_area_rationale',
  },
  {
    id: 'D-0004',
    title: 'Solo-founder / lean operating model',
    date: '2026-07-10',
    status: 'ratified',
    summary: '$200/mo infra ceiling through Month 6; no new hires in Year 1. Forces architectural discipline and closes over-engineering escape hatches.',
    source: 'CLAUDE.md → Mission 1 / state/ledger.yaml → deferred_cash_constrained',
  },
  {
    id: 'D-0005',
    title: 'Hybrid Strangler-Fig sequencing',
    date: '2026-07-10',
    status: 'ratified',
    summary: 'Org skeleton grows in parallel with landscaping MVP; abstraction happens on second use, not first. Revenue-positive by Week 3; OS validated by real use.',
    source: 'research/distribution/brand-name-brainstorm.md',
  },
  {
    id: 'D-0006',
    title: 'Brand brainstorm (data-driven)',
    date: '2026-07-10',
    status: 'ratified',
    summary: 'Data-driven analysis of 17 candidates → LargoLawn.pro selected (9.3/10 score).',
    source: 'research/distribution/brand-name-brainstorm.md',
  },
  {
    id: 'D-0007',
    title: 'Brand ratification: LargoLawn.pro',
    date: '2026-07-10',
    status: 'ratified',
    summary: 'Steward override of data pick: LargoLawn.pro (was LargoLandscape.pro). Brand preferenence + Year-1 service reality (mowing-heavy) trumped landscape positioning. Year-2 rebrand documented as fallback ($4.99 + 5 min).',
    source: 'drafts/brand/names-and-decision-matrix.md + brand/guidelines.md',
  },
];

const PENDING_DECISIONS = [
  {
    id: 'P-0001',
    title: 'Domain purchase ($4.99/yr)',
    detail: 'Register largolawn.pro on Vercel or Cloudflare Registrar. Steward clicks. Auto-renew ON (mandatory).',
    block: '—',
    cost: '$4.99 one-time + $4.99/yr auto-renew',
  },
  {
    id: 'P-0002',
    title: 'GBP address strategy',
    detail: 'Service-Area Business (SAB) hides address vs. visible address. SAB recommended (no customer visits to home office; mobile-only operating model). Slight ~5-10% local-pack ranking penalty.',
    block: 'Affects citation NAP consistency',
    cost: '$0',
  },
  {
    id: 'P-0003',
    title: 'Entity choice (at $500 cash gate)',
    detail: 'FL LLC vs. sole proprietor. LLC costs $125 to form + $92 BTR + $30/yr renewals. Sole prop zero cost. Recommend: stay sole prop for first 10 paying customers; convert to LLC at Month 6+ when revenue crosses $2K/mo.',
    block: 'Triggers OBJ-M2-001',
    cost: '$0 (sole prop) or $125 (LLC)',
  },
  {
    id: 'P-0004',
    title: 'Insurance broker selection (at $2,500 cash gate)',
    detail: '3 broker quotes collected at OBJ-M2-003 reactivation. Steward picks based on coverage + price. Recommended: bind at minimum $1M GL.',
    block: 'Triggers OBJ-M2-003',
    cost: '$2,500-4,600/yr',
  },
  {
    id: 'P-0005',
    title: 'Pilot outreach script authorization',
    detail: 'First 5 paid pilots will come from personal-network text + free credits. Steward composes the personal-network outreach text (5 neighbors). Ad campaigns run on free credits with my autonomous management.',
    block: 'Triggers OBJ-M2-006 → first lead → first paid pilot',
    cost: '$0',
  },
];

export default function PreviewDecisions() {
  return (
    <>
      <h1>Decision Log</h1>
      <div className="preview-callout">
        Every irreversible decision gets a Decision Template entry. The 7 ratified decisions
        below form the foundation of Mission 1; the 5 pending decisions are queued and waiting
        on your action.
      </div>

      <h2>Ratified ({RATIFIED_DECISIONS.length})</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Date</th>
            <th>Status</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {RATIFIED_DECISIONS.map((d) => (
            <tr key={d.id}>
              <td>
                <code>{d.id}</code>
              </td>
              <td>
                <strong>{d.title}</strong>
                <br />
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>{d.summary}</span>
              </td>
              <td>{d.date}</td>
              <td>
                <span
                  style={{
                    background: 'var(--ll-green)',
                    color: 'white',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}
                >
                  {d.status}
                </span>
              </td>
              <td>
                <code style={{ fontSize: '0.75rem' }}>{d.source}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Pending — waiting on your action ({PENDING_DECISIONS.length})</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Detail</th>
            <th>Triggers</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {PENDING_DECISIONS.map((d) => (
            <tr key={d.id}>
              <td>
                <code>{d.id}</code>
              </td>
              <td>
                <strong>{d.title}</strong>
              </td>
              <td style={{ fontSize: '0.9rem' }}>{d.detail}</td>
              <td style={{ fontSize: '0.9rem', color: 'var(--gray-700)' }}>{d.block}</td>
              <td>{d.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Order in which pending decisions need to fire</h2>
      <ol>
        <li>
          <strong>P-0001 (domain purchase)</strong> — unblocks everything. $4.99. You click. I
          update the codebase to point at the real domain.
        </li>
        <li>
          <strong>P-0002 (GBP address strategy)</strong> — choose SAB or visible. SAB recommended.
          If visible: requires having a real commercial address.
        </li>
        <li>
          <strong>P-0005 (pilot outreach script)</strong> — authorize your personal-network
          outreach + free-credit ads. Triggers first paid pilot.
        </li>
        <li>
          <strong>P-0003 (entity choice)</strong> — wait until $500 cumulative cash. Recommended:
          stay sole prop until ~10 paying customers; convert to LLC at Month 6+.
        </li>
        <li>
          <strong>P-0004 (insurance broker)</strong> — wait until $2,500 cumulative cash. Pick from
          3 broker quotes collected at OBJ-M2-003 reactivation.
        </li>
      </ol>

      <h2>What this preview asks of you</h2>
      <p>
        The 11 routes above answer every "what does this look like" question. The 5 pending
        decisions above answer every "what do I have to do" question. If everything here looks
        right and the pending decisions feel correct in order, you can authorize P-0001 with a
        single $4.99 spend and we begin.
      </p>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview">Back to preview index</a> ·{' '}
        <a href="/preview/runbooks">← Operational Runbooks</a>
      </p>
    </>
  );
}