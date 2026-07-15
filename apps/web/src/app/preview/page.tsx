/**
 * /preview index - the steward's one-stop checklist before approving
 * the $4.99 domain purchase.
 */

import Link from 'next/link';
import { PREVIEW_NAV } from '@/lib/preview-nav';

export const metadata = {
  title: 'Preview Build: Index',
  robots: { index: false, follow: false },
};

export default function PreviewIndex() {
  return (
    <>
      <h1>Preview Build Index</h1>

      <div className="preview-callout">
        <strong>You are looking at localhost-only content.</strong> Nothing here is purchased,
        registered, or live. The domain <code>largolawn.pro</code> is <strong>not</strong> yet
        registered. The Google Business Profile is <strong>not</strong> yet created. No ads are
        running. This preview lets you read and approve every artifact before committing the $4.99
        domain cost.
      </div>

      <h2>Why this preview exists</h2>
      <p>
        Every marketing artifact, financial projection, regulatory draft, and operational playbook
        that has been conceptualized for Largo Lawn is now browsable as a route under{' '}
        <code>/preview/*</code>. Each route renders the actual file as it would be used in the
        real business. You can read end-to-end before spending any money.
      </p>

      <h2>What you can do right now (zero spend)</h2>
      <ul>
        <li>
          <input type="checkbox" /> Browse every route in the sidebar. At minimum{' '}
          <Link href="/preview/brand">/preview/brand</Link>,{' '}
          <Link href="/preview/profit">/preview/profit</Link>, and{' '}
          <Link href="/preview/gbp">/preview/gbp</Link>.
        </li>
        <li>
          <input type="checkbox" /> Re-read <code>brand/guidelines.md</code> (via{' '}
          <Link href="/preview/brand">/preview/brand</Link>) and check whether the homepage,
          service pages, and GBP landing obey it.
        </li>
        <li>
          <input type="checkbox" /> Check <Link href="/preview/services">/preview/services</Link>{' '}
          copy against <Link href="/preview/profit">/preview/profit</Link> pricing. Do the
          numbers add up to what you want to charge?
        </li>
        <li>
          <input type="checkbox" /> Verify the cash flow projection in{' '}
          <Link href="/preview/profit">/preview/profit</Link> feels right.
        </li>
        <li>
          <input type="checkbox" /> Read the GBP profile content in{' '}
          <Link href="/preview/gbp">/preview/gbp</Link>. Every field is pre-filled.
        </li>
        <li>
          <input type="checkbox" /> Read the 7 operational runbooks in{' '}
          <Link href="/preview/runbooks">/preview/runbooks</Link> - day-of-mow, weather, hurricane
          mode, equipment, quote-to-close, retention, accounting.
        </li>
        <li>
          <input type="checkbox" /> Read the 13 customer-facing content artifacts in{' '}
          <Link href="/preview/content">/preview/content</Link> - GBP Q&amp;A, phone/email/SMS
          scripts, quotes, invoices, waivers, printable assets.
        </li>
        <li>
          <input type="checkbox" /> Read the ad campaign drafts in{' '}
          <Link href="/preview/ads">/preview/ads</Link> - these run on free new-account credits,
          so $0 out-of-pocket.
        </li>
        <li>
          <input type="checkbox" /> Check the 5 pending decisions in{' '}
          <Link href="/preview/decisions">/preview/decisions</Link>.
        </li>
        <li>
          <input type="checkbox" /> Decide: ready to purchase the domain, or request changes?
        </li>
      </ul>

      <h2>Surface map</h2>
      <div className="preview-card-grid">
        {PREVIEW_NAV.map((item) => (
          <div key={item.slug} className="card">
            <h3>
              <Link href={`/preview/${item.slug}`}>{item.label}</Link>
            </h3>
            <p>{item.description}</p>
            <p>
              <Link href={`/preview/${item.slug}`} style={{ fontSize: '0.9rem' }}>
                Open →
              </Link>
            </p>
          </div>
        ))}
      </div>

      <h2>What I changed to make this preview internally consistent</h2>
      <ul>
        <li>
          Removed "Licensed &amp; Insured" copy from the homepage, GBP landing page, footer, and
          About page. The brand guidelines anti-brand list forbids it, and OBJ-M2-003 (insurance
          binding) is deferred until $2,500 cumulative cash.
        </li>
        <li>
          Added an orange "Preview Build →" button in the site header so you can always find your
          way back here.
        </li>
        <li>
          Rendered every draft, research artifact, customer-content artifact, and operational
          runbook as a route under <code>/preview/*</code>.
        </li>
        <li>
          Authored 13 customer-content artifacts (4 scripts/templates in Phase 2, 9 print/
          digital/transactional assets in Phase 3) - all under <code>content/</code> and
          browsable at <Link href="/preview/content">/preview/content</Link>.
        </li>
        <li>
          Authored 7 operational runbooks (Phase 4) - all under <code>content/runbooks/</code> and
          browsable at <Link href="/preview/runbooks">/preview/runbooks</Link>.
        </li>
      </ul>

      <h2>What I did NOT do</h2>
      <ul>
        <li>
          ❌ Did <strong>not</strong> register <code>largolawn.pro</code> (would cost $4.99).
        </li>
        <li>
          ❌ Did <strong>not</strong> create a Google Business Profile (requires clicking Google ToS).
        </li>
        <li>
          ❌ Did <strong>not</strong> bind a payment method to any platform.
        </li>
        <li>
          ❌ Did <strong>not</strong> deploy to Vercel (you chose localhost).
        </li>
        <li>
          ❌ Did <strong>not</strong> hire, contract, or commit to any external vendor.
        </li>
      </ul>

      <h2>Two-question validation</h2>
      <p>Before approving the $4.99 spend, both questions must be YES:</p>
      <ul>
        <li>
          <input type="checkbox" /> <strong>"Does this look like a business I want to run?"</strong>{' '}
          (Browse /, /services, /about, /contact, /gbp, then check the preview surface.)
        </li>
        <li>
          <input type="checkbox" />{' '}
          <strong>"Do I trust these projections and copy?"</strong>{' '}
          (Read /preview/profit, /preview/gbp, /preview/services, /preview/ads.)
        </li>
      </ul>

      <h2>What happens after you approve</h2>
      <ol>
        <li>You click "I approve" - I do nothing automatically.</li>
        <li>
          You register <code>largolawn.pro</code> on Vercel (or Cloudflare) for $4.99/yr, then
          tell me the registrar login.
        </li>
        <li>I update <code>apps/web/src/lib/business.ts</code> + sitemap + robots + layout if
          anything needs to point at the real domain.</li>
        <li>You create the Google Business Profile by pasting from{' '}
          <Link href="/preview/gbp">/preview/gbp</Link>.</li>
        <li>
          We wait 5-14 days for the GBP verification postcard. Meanwhile, citation building and ad
          setup (free credits) begin.
        </li>
        <li>First GBP-visible lead → quote → paid pilot → 5-star review loop closes.</li>
      </ol>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        Next: <Link href="/preview/brand">Brand & Voice →</Link>
      </p>
    </>
  );
}