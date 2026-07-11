/**
 * /preview/distribution — renders cash-min-distribution-ideas.md verbatim.
 *
 * 8 ideas, each with cost + expected conversion. Indexed above the
 * markdown so the steward sees the headline first.
 */

import { renderMarkdownFromPath } from '@/lib/markdown';
import { MarkdownPreview } from '@/components/MarkdownPreview';

export const metadata = {
  title: 'Preview — Distribution Playbook',
  robots: { index: false, follow: false },
};

export default async function PreviewDistribution() {
  const html = await renderMarkdownFromPath(
    'C:/Users/camer/DEVNEW/GRASS/research/distribution/cash-min-distribution-ideas.md',
  );
  return (
    <>
      <h1>Distribution Playbook — 8 $0-Cost Acquisition Ideas</h1>
      <div className="preview-callout">
        All 8 ideas cost $0 to execute. Realistic mix over 12 months yields ~45 new customers at
        ~$0 effective CAC. Source: <code>research/distribution/cash-min-distribution-ideas.md</code>.
      </div>

      <h2>Headline Mix</h2>
      <table>
        <thead>
          <tr>
            <th>Idea</th>
            <th>New customers/mo</th>
            <th>Total over 12 mo</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>GBP funnel (post-verification)</td>
            <td>1.5</td>
            <td>18</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>Free ad credits (Google + Meta + Bing)</td>
            <td>1.0</td>
            <td>12</td>
            <td>$0 (credit-paid)</td>
          </tr>
          <tr>
            <td>Referrals (post-pilot-3)</td>
            <td>0.5</td>
            <td>6</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>NextDoor Local Deals</td>
            <td>0.25</td>
            <td>3</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>Repeat organic (returning)</td>
            <td>0.5</td>
            <td>6</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td>
              <strong>3.75</strong>
            </td>
            <td>
              <strong>45</strong>
            </td>
            <td>
              <strong>$0 effective</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <MarkdownPreview content={html} />

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview">Back to preview index</a> ·{' '}
        <a href="/preview/ads">← Ad Campaigns</a> ·{' '}
        <a href="/preview/compliance">Next: Compliance Drafts →</a>
      </p>
    </>
  );
}