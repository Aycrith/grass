/**
 * /preview/citations — Tier 1-5 directory list + NAP template.
 *
 * Renders the relevant section of cash-min-distribution-ideas.md plus
 * a synthesized directory list the steward can copy.
 */

import { renderMarkdownFromPath } from '@/lib/markdown';
import { MarkdownPreview } from '@/components/MarkdownPreview';

export const metadata = {
  title: 'Preview — Citation Plan',
  robots: { index: false, follow: false },
};

export default async function PreviewCitations() {
  const html = await renderMarkdownFromPath(
    'C:/Users/camer/DEVNEW/GRASS/research/distribution/cash-min-distribution-ideas.md',
  );
  return (
    <>
      <h1>Citation Plan</h1>
      <div className="preview-callout">
        <strong>Why citations matter:</strong> Google ranks local businesses by NAP consistency
        across the web. Tier 1 (Apple Maps, Bing, FB, Yelp) accounts for ~70% of the ranking
        lift. Tier 2-5 fill in the rest. Cost: $0.
      </div>

      <h2>NAP Template (copy verbatim into every directory)</h2>
      <pre style={{ background: 'var(--ll-cream)', padding: '1rem', borderRadius: 'var(--radius)' }}>
{`Name:    Largo Lawn
Address: 12345 Starkey Rd, Largo, FL 33771
Phone:   +1-727-555-0123
Email:   hello@largolawn.pro
URL:     https://largolawn.pro
Hours:   Mon–Fri 7:00 AM – 5:00 PM | Sat 8:00 AM – 2:00 PM | Sun Closed
Category: Lawn care service (PRIMARY — NOT "Landscaper")
Service-area ZIPs: 33771, 33770, 33773, 33774, 33778, 33756`}
      </pre>

      <h2>Directory Tier List</h2>
      <table>
        <thead>
          <tr>
            <th>Tier</th>
            <th>Directories</th>
            <th>Time</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1 (must-do)</td>
            <td>Apple Maps, Bing Places, Facebook Business, Yelp Business</td>
            <td>45 min</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>2 (data aggregators)</td>
            <td>Acxiom, Localeze, Foursquare, InfoGroup</td>
            <td>1 hr</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>3 (general directories)</td>
            <td>Superpages, YellowPages.com, Citysearch, Manta</td>
            <td>1 hr</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>4 (niche/industry)</td>
            <td>Angi (formerly Angie&apos;s List), HomeAdvisor, Porch, LawnCare.net</td>
            <td>1 hr</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>5 (local/community)</td>
            <td>NextDoor Business, Pinellas Chamber, Greater Largo Chamber</td>
            <td>1 hr</td>
            <td>$0</td>
          </tr>
        </tbody>
      </table>

      <h2>Distribution Playbook (source file)</h2>
      <p>
        The full <code>cash-min-distribution-ideas.md</code> document includes 8 distribution
        ideas, of which citations are idea #2. Renders below verbatim.
      </p>

      <MarkdownPreview content={html} />

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview">Back to preview index</a> ·{' '}
        <a href="/preview/gbp">← GBP Profile</a> ·{' '}
        <a href="/preview/ads">Next: Ad Campaigns →</a>
      </p>
    </>
  );
}