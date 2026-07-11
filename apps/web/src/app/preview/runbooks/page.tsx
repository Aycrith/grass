/**
 * /preview/runbooks — placeholder/stub for Phase 4 operational runbooks.
 *
 * Authored content lands in subsequent rounds. This page shows what's
 * planned, links to existing relevant artifacts, and gives the steward a
 * route to surface expectations.
 */

import Link from 'next/link';

export const metadata = {
  title: 'Preview — Operational Runbooks',
  robots: { index: false, follow: false },
};

export default function PreviewRunbooks() {
  return (
    <>
      <h1>Operational Runbooks — Planned</h1>
      <div className="preview-callout">
        <strong>Status:</strong> Stubs. Full content lands in Phase 4 (Round 6+). For now, this
        page lists what&apos;s planned so you can validate the surface expectations before any
        runbook content is written.
      </div>

      <h2>Why these runbooks aren&apos;t blocking the preview</h2>
      <p>
        A runbook is "exactly what to do on Day 1 / when X happens." It only has value once you
        have customers + equipment + scheduling. For the first 5 paid pilots, the actual on-the-
        keyboard moves are already in <Link href="/preview/distribution">/preview/distribution</Link>{' '}
        and <Link href="/preview/gbp">/preview/gbp</Link>. Runbooks become critical when you
        have repeating work — typically by Pilot #5 (Week 6+).
      </p>

      <h2>Planned runbooks (7 total)</h2>
      <table>
        <thead>
          <tr>
            <th>Runbook</th>
            <th>Trigger</th>
            <th>Authoring Source</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Day-of-mow routine</td>
            <td>Every visit, Pilot #1+</td>
            <td>
              Brand voice (<Link href="/preview/brand">/preview/brand</Link>), capability
              registry <code>state/capability-registry.yaml → cap_mowing_standard</code>
            </td>
          </tr>
          <tr>
            <td>Weather cancellation policy</td>
            <td>Every rain event</td>
            <td>
              <code>apps/web/src/app/services/data.ts</code> (mowing service FAQ references
              weather auto-reschedule)
            </td>
          </tr>
          <tr>
            <td>Hurricane mode procedure</td>
            <td>Named storm within 48hr cone OR sustained winds ≥30 mph</td>
            <td>
              <code>state/capability-registry.yaml → cap_hurricane_mode</code> + business
              constant <code>hurricane_wind_threshold_mph: 30</code>
            </td>
          </tr>
          <tr>
            <td>Equipment access plan</td>
            <td>Hand tools only at $0 gate; rental at $500+ gate</td>
            <td>
              <code>drafts/equipment/purchase-plan.md</code>
            </td>
          </tr>
          <tr>
            <td>Quote-to-close playbook</td>
            <td>Every lead inbound</td>
            <td>
              <Link href="/preview/services">/preview/services</Link> pricing + brand voice
            </td>
          </tr>
          <tr>
            <td>Customer retention playbook</td>
            <td>After Pilot #3</td>
            <td>
              <code>research/market/profitability-roadmap.md → "Recurring revenue model"</code>{' '}
              shows math for 50% weekly conversion
            </td>
          </tr>
          <tr>
            <td>Accounting setup</td>
            <td>$500 cumulative cash gate</td>
            <td>
              <code>drafts/sunbiz/articles-of-organization.md</code> + Schedule C / DWC-250 / DR-1
            </td>
          </tr>
        </tbody>
      </table>

      <h2>What you can do now (no runbooks needed)</h2>
      <ul>
        <li>
          <strong>First pilot job:</strong> use <Link href="/contact">/contact</Link> form to
          receive a request, then call the prospect using the script voice from{' '}
          <Link href="/preview/brand">/preview/brand</Link>.
        </li>
        <li>
          <strong>First weather cancel:</strong> text the customer the day before if forecast
          shows &gt;50% rain. No charge. Reschedule to next clear day.
        </li>
        <li>
          <strong>First review request:</strong> drop a review-magnet card at job completion
          with QR code to GBP review form (link generated after GBP verification).
        </li>
      </ul>

      <h2>Runbook authoring order (when ready)</h2>
      <ol>
        <li>Day-of-mow routine — most-frequently-used.</li>
        <li>Quote-to-close playbook — second-most-frequent.</li>
        <li>Weather cancellation policy — easy to write, high impact.</li>
        <li>Customer retention playbook — becomes critical after Pilot #3.</li>
        <li>Hurricane mode procedure — only in hurricane season (June–November).</li>
        <li>Equipment access plan — only when cash gate opens.</li>
        <li>Accounting setup — only when cash gate opens.</li>
      </ol>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview">Back to preview index</a> ·{' '}
        <a href="/preview/services">← Service Copy</a> ·{' '}
        <a href="/preview/decisions">Next: Decision Log →</a>
      </p>
    </>
  );
}