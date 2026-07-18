/* eslint-disable react/no-unescaped-entities */
/**
 * /preview/compliance — renders the licensing map + the deferred-drafts
 * ladder. Every deferred item has its draft already written.
 */

import { renderMarkdownFromPath } from '@/lib/markdown';
import { MarkdownPreview } from '@/components/MarkdownPreview';

export const metadata = {
  title: 'Preview — Compliance Drafts',
  robots: { index: false, follow: false },
};

export default async function PreviewCompliance() {
  let html = '';
  try {
    html = await renderMarkdownFromPath(
      'C:/Users/camer/DEVNEW/GRASS/research/regulatory/largo-licensing-map.yaml',
    );
  } catch (e) {
    html = `<p style="color: var(--red-700)">Could not render licensing map: ${(e as Error).message}</p>`;
  }
  return (
    <>
      <h1>Compliance Drafts — All Deferred Until Cash Gates Trigger</h1>
      <div className="preview-callout">
        <strong>Every deferred compliance item has its draft already written.</strong> No work
        is needed at sign-off — only at the cash-gate trigger. The four deferred items become
        urgent as pilot revenue crosses $500 / $1K / $2.5K.
      </div>

      <h2>Cash Ladder (when deferred items reactivate)</h2>
      <table>
        <thead>
          <tr>
            <th>Cumulative Cash</th>
            <th>Trigger</th>
            <th>Reactivation Item</th>
            <th>Cash Required</th>
            <th>Draft</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>$500</td>
            <td>First paid pilot revenue</td>
            <td>
              OBJ-M2-001 (Sunbiz LLC + EIN + bank + DR-1 sales tax registration)
            </td>
            <td>$125</td>
            <td>
              <code>drafts/sunbiz/articles-of-organization.md</code>
            </td>
          </tr>
          <tr>
            <td>$1,000</td>
            <td>First paying customer</td>
            <td>
              OBJ-M2-002 (City of Largo BTR + Pinellas County BTR + DWC-250)
            </td>
            <td>$92 + $30/yr</td>
            <td>
              <code>drafts/btr/*.md</code> (3 files)
            </td>
          </tr>
          <tr>
            <td>$2,500</td>
            <td>First paying customer</td>
            <td>OBJ-M2-003 (GL insurance bind)</td>
            <td>$2,500-4,600/yr</td>
            <td>
              <code>drafts/insurance/broker-quote-requests.md</code>
            </td>
          </tr>
          <tr>
            <td>$5,000</td>
            <td>First equipment expense</td>
            <td>OBJ-M2-005 (equipment purchase/rental plan)</td>
            <td>Variable</td>
            <td>
              <code>drafts/equipment/purchase-plan.md</code>
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>Consolidation note:</strong> Once you cross $2,500 cumulative cash, all four
        deferred items (Sunbiz + BTRs + insurance + equipment) become urgent — file them as a
        batch, not four separate waits.
      </p>

      <h2>What you can legally do today without any of these</h2>
      <ul>
        <li>
          Receive payments from pilot customers via Stripe / Cash App / Venmo / Zelle (personal
          accounts OK for first ~5 transactions).
        </li>
        <li>Earn 5-star GBP reviews from those pilots.</li>
        <li>
          Build GBP ranking via citations to a domain that exists (after domain registration).
        </li>
        <li>Do small lots (≤0.25 acre) with hand tools (no commercial mower).</li>
        <li>
          Do hurricane prep work (per registry, hurricane prep is part of "landscaping" not a
          separate licensed trade).
        </li>
      </ul>

      <h2>Risk acceptance (operating without LLC + BTRs + insurance)</h2>
      <p>
        For the first 5 paid pilots, the operation runs without:
      </p>
      <ul>
        <li>
          <strong>An LLC.</strong> Personal liability for incidents. Sole proprietor by default.
          Mitigation: limited pilot scope, signed waiver-of-liability on every quote.
        </li>
        <li>
          <strong>Local BTR.</strong> Operating without a Largo BTR is a municipal citation
          risk (~$250 fine) but doesn&apos;t affect customer satisfaction or GBP ranking.
          Mitigation: file the BTR draft the day pilot #3 closes (if revenue allows).
        </li>
        <li>
          <strong>GL insurance.</strong> Personal assets at risk for property damage or injury.
          Mitigation: hand-tools-only scope, waiver-of-liability, small lots only, no
          storm/hurricane work until bound.
        </li>
        <li>
          <strong>Sales tax registration.</strong> Collecting sales tax without a DR-1 is a
          Florida DOR issue. Mitigation: do not collect FL sales tax until OBJ-M2-001
          reactivates; invoice customers as "tax not yet collected" — alternatively, absorb the
          tax into the advertised price.
        </li>
      </ul>

      <h2>Licensing Map (full YAML rendered)</h2>
      <p>
        Source: <code>research/regulatory/largo-licensing-map.yaml</code>. This file is the gate
        for ALL service-line expansion. Until GI-BMP + FDACS Limited Cert held, service register
        explicitly excludes fertilization. Same for irrigation and pest control.
      </p>

      <MarkdownPreview content={html} />

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview">Back to preview index</a> ·{' '}
        <a href="/preview/distribution">← Distribution</a> ·{' '}
        <a href="/preview/services">Next: Service Copy →</a>
      </p>
    </>
  );
}