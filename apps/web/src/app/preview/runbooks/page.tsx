/**
 * /preview/runbooks — 7 authored operational runbooks surfaced as
 * browseable pages under /preview/runbooks/[slug].
 *
 * Authored content lives in content/runbooks/*.md (Phase 4). Each
 * route renders the markdown via renderMarkdownFromPath.
 */

import { renderMarkdownFromPath } from '@/lib/markdown';

export const metadata = {
  title: 'Preview — Operational Runbooks',
  robots: { index: false, follow: false },
};

const RUNBOOKS = [
  {
    slug: 'day-of-mow',
    label: 'Day-of-Mow Routine',
    description: 'Standing operating procedure for every routine mow visit',
    trigger: 'Every visit (Pilot #1+)',
  },
  {
    slug: 'weather-cancellation',
    label: 'Weather Cancellation',
    description: 'When to cancel, how to communicate, reschedule without friction',
    trigger: 'Every rain event',
  },
  {
    slug: 'hurricane-mode',
    label: 'Hurricane Mode',
    description: 'Pre-storm prep, during-storm stoppage, post-storm triage (June–November)',
    trigger: 'Named storm within 5-day cone OR ≥30 mph sustained winds',
  },
  {
    slug: 'equipment-access',
    label: 'Equipment Access',
    description: 'Starter kit, truck layout, maintenance schedule, failure playbook',
    trigger: 'Pilot #1 (Day 1) for kit; $5K gate for upgrades',
  },
  {
    slug: 'quote-to-close',
    label: 'Quote-to-Close Playbook',
    description: 'From inbound inquiry to first paid visit — funnel math + scripts',
    trigger: 'Every lead inbound',
  },
  {
    slug: 'customer-retention',
    label: 'Customer Retention',
    description: 'Stop churn before it happens — cadence, recovery scripts, math',
    trigger: 'After Pilot #3',
  },
  {
    slug: 'accounting-setup',
    label: 'Accounting Setup',
    description: 'Five accounts, bookkeeping rhythm, tax fundamentals, defer DR-1 until $1K/mo',
    trigger: '$500 cumulative cash gate',
  },
] as const;

export default async function PreviewRunbooks() {
  // Render all 7 runbooks inline, in order, with H2 anchors.
  const rendered = await Promise.all(
    RUNBOOKS.map(async (rb) => {
      const absolutePath = `C:/Users/camer/DEVNEW/GRASS/content/runbooks/${rb.slug}.md`;
      const html = await renderMarkdownFromPath(absolutePath);
      return { ...rb, html };
    }),
  );

  return (
    <>
      <h1>Operational Runbooks — 7 authored</h1>

      <div className="preview-callout">
        <strong>Status:</strong> Complete. All 7 runbooks authored and ready for review. Read
        in order if you&apos;re starting fresh; jump to the trigger-conditional ones
        (hurricane, equipment, accounting) only when those gates fire.
      </div>

      <h2>Why these matter</h2>
      <p>
        A runbook is &ldquo;exactly what to do on Day 1 / when X happens.&rdquo; Marketing copy
        and a beautiful website get the customer to call. Runbooks get the work done right
        every time, without you having to re-think it under pressure. The seven below cover
        the operational lifecycle: getting the customer, doing the work, handling weather,
        handling storms, retaining the customer, and keeping the books.
      </p>

      <h2>The seven</h2>
      <table>
        <thead>
          <tr>
            <th>Runbook</th>
            <th>Trigger</th>
            <th>When to read</th>
          </tr>
        </thead>
        <tbody>
          {RUNBOOKS.map((rb) => (
            <tr key={rb.slug}>
              <td>
                <a href={`#${rb.slug}`}>
                  <strong>{rb.label}</strong>
                </a>
                <br />
                <small>{rb.description}</small>
              </td>
              <td>{rb.trigger}</td>
              <td>
                {rb.slug === 'day-of-mow' || rb.slug === 'quote-to-close'
                  ? 'Before Pilot #1'
                  : rb.slug === 'hurricane-mode'
                    ? 'May (pre-season)'
                    : rb.slug === 'accounting-setup' || rb.slug === 'equipment-access'
                      ? 'When gate fires'
                      : 'Week 6+'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ margin: '3rem 0', border: 0, borderTop: '1px solid var(--gray-300)' }} />

      {rendered.map((rb) => (
        <section key={rb.slug} id={rb.slug} style={{ marginBottom: '4rem' }}>
          <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: rb.html }} />
        </section>
      ))}

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview">Back to preview index</a> ·{' '}
        <a href="/preview/services">← Service Copy</a> ·{' '}
        <a href="/preview/decisions">Next: Decision Log →</a>
      </p>
    </>
  );
}
