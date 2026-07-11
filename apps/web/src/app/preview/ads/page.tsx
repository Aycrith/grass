/**
 * /preview/ads — renders autonomous-paid-acquisition.md.
 *
 * Ad spend comes from free new-account credits ($500 Google + $100 Meta +
 * $100 MS + $25 Yelp + $50 NextDoor + Thumbtack leads) — no cash.
 */

import { renderMarkdownFromPath } from '@/lib/markdown';
import { MarkdownPreview } from '@/components/MarkdownPreview';

export const metadata = {
  title: 'Preview — Ad Campaigns',
  robots: { index: false, follow: false },
};

export default async function PreviewAds() {
  const html = await renderMarkdownFromPath(
    'C:/Users/camer/DEVNEW/GRASS/research/distribution/autonomous-paid-acquisition.md',
  );
  return (
    <>
      <h1>Ad Campaigns</h1>
      <div className="preview-callout">
        <strong>Total spend: $0.00</strong> — all ad spend comes from free new-account credits:
        Google Ads $500 + Meta $100 + Microsoft $100 + Yelp $25 + NextDoor $50 + Thumbtack ~5 free
        leads. Realistic CPL $25-45. Realistic conversion to paying customer: 15-25%.
      </div>

      <h2>Platform-by-Platform Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Free Credit</th>
            <th>Campaign Type</th>
            <th>Realistic CPL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Google Ads</td>
            <td>$500</td>
            <td>Search RSA — "lawn care Largo FL", "landscaping 33771"</td>
            <td>$25-40</td>
          </tr>
          <tr>
            <td>Meta (FB + IG)</td>
            <td>$100</td>
            <td>Lead Form — geo-fenced to 33771 + adjacent ZIPs</td>
            <td>$5-12 (lower volume)</td>
          </tr>
          <tr>
            <td>Microsoft (Bing)</td>
            <td>$100</td>
            <td>Import Google Search campaigns</td>
            <td>$20-30</td>
          </tr>
          <tr>
            <td>Yelp</td>
            <td>$25</td>
            <td>Profile upgrade + request-a-quote button</td>
            <td>High intent (ready to buy)</td>
          </tr>
          <tr>
            <td>NextDoor</td>
            <td>$50</td>
            <td>Local Deals — "first mow $30"</td>
            <td>$15-25</td>
          </tr>
          <tr>
            <td>Thumbtack</td>
            <td>~5 free leads</td>
            <td>Pro profile + instant-quote</td>
            <td>$0-15 (pay per lead)</td>
          </tr>
        </tbody>
      </table>

      <h2>Autonomous Management Rules</h2>
      <ul>
        <li>Hard daily cap: $10 across all platforms (until $500 cumulative pilot revenue).</li>
        <li>Pause ad if CPL &gt; $60 for 3 consecutive days.</li>
        <li>Pause ad if conversion to paying customer &lt; 10% over 14 days.</li>
        <li>Daily ledger entry: spend + impressions + clicks + leads + bookings.</li>
      </ul>

      <h2>Full Acquisition Plan</h2>
      <MarkdownPreview content={html} />

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview">Back to preview index</a> ·{' '}
        <a href="/preview/citations">← Citation Plan</a> ·{' '}
        <a href="/preview/distribution">Next: Distribution Playbook →</a>
      </p>
    </>
  );
}