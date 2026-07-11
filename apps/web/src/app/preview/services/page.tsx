/**
 * /preview/services — editorial mirror of /services with annotation boxes
 * flagging voice / pricing / FAQ completeness. Steward uses this to
 * validate customer-facing copy against brand voice + profit math.
 */

import Link from 'next/link';
import { PRICING_FLOOR_CENTS } from '@/lib/business';

export const metadata = {
  title: 'Preview — Service Copy (Editorial Mirror)',
  robots: { index: false, follow: false },
};

interface ServiceEntry {
  slug: string;
  name: string;
  priceFrom: string;
  brandCheck: string;
  pricingCheck: string;
  faqCount: number;
}

const SERVICES: ServiceEntry[] = [
  {
    slug: 'mowing',
    name: 'Lawn Mowing',
    priceFrom: `$${(PRICING_FLOOR_CENTS.mowing_per_visit_small / 100).toFixed(0)} small / $${(PRICING_FLOOR_CENTS.mowing_per_visit_large / 100).toFixed(0)} large per visit`,
    brandCheck: '✅ Voice matches ("We mow at 3.0–3.5 inches for St. Augustine grass")',
    pricingCheck: 'Anchor: 35% COGS target. Mowing runs ~20% COGS → healthy.',
    faqCount: 3,
  },
  {
    slug: 'edging',
    name: 'Lawn Edging',
    priceFrom: `$${(PRICING_FLOOR_CENTS.edging_per_linear_ft / 100).toFixed(2)}/linear ft`,
    brandCheck: '✅ Voice matches (commercial edger, not string trimmer)',
    pricingCheck: 'Often bundled with mowing → effective margin higher than listed.',
    faqCount: 2,
  },
  {
    slug: 'mulching',
    name: 'Mulch Installation',
    priceFrom: `$${((PRICING_FLOOR_CENTS.mulch_per_cubic_yard + PRICING_FLOOR_CENTS.mulch_install_per_cubic_yard) / 100).toFixed(0)}/yd³ installed`,
    brandCheck: '✅ Voice matches (cites UF/IFAS recommendation)',
    pricingCheck: 'Highest-ticket service. COGS depends on mulch type + yd³ volume.',
    faqCount: 3,
  },
  {
    slug: 'hedge-trimming',
    name: 'Hedge & Shrub Trimming',
    priceFrom: `$${(PRICING_FLOOR_CENTS.hedge_trim_per_linear_ft / 100).toFixed(2)}/linear ft`,
    brandCheck: '⚠️ "rounded, squared, or naturalistic" — shapes feel branded.',
    pricingCheck: 'Low COGS (labor-heavy). Heights up to 12 ft.',
    faqCount: 2,
  },
  {
    slug: 'hurricane-prep',
    name: 'Hurricane Prep & Cleanup',
    priceFrom: `$${(PRICING_FLOOR_CENTS.hurricane_prep_base / 100).toFixed(0)} base + debris volume`,
    brandCheck: '✅ Voice + charter-compliance (30 mph sustained-wind rule)',
    pricingCheck: 'Seasonal (June–November). Insurance claim support is a value-add.',
    faqCount: 3,
  },
  {
    slug: 'seasonal-cleanup',
    name: 'Seasonal Cleanup',
    priceFrom: `$${(PRICING_FLOOR_CENTS.seasonal_cleanup_base / 100).toFixed(0)} base + lot size`,
    brandCheck: '⚠️ "we don\'t get a hard leaf drop like the northeast" — regional color ✅',
    pricingCheck: 'Twice-yearly cadence; hauls everything off-site (premium position).',
    faqCount: 2,
  },
];

export default function PreviewServices() {
  return (
    <>
      <h1>Service Copy — Editorial Mirror</h1>
      <div className="preview-callout">
        This page mirrors <Link href="/services">/services</Link> but adds annotation boxes so
        you can verify each service line against brand voice + pricing math + FAQ completeness
        before approving the customer-facing surface.
      </div>

      <h2>Header rating matrix</h2>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>FAQ count</th>
            <th>Price anchor</th>
            <th>Brand voice ✅/⚠️</th>
            <th>Pricing check</th>
            <th>Live</th>
          </tr>
        </thead>
        <tbody>
          {SERVICES.map((s) => (
            <tr key={s.slug}>
              <td>
                <strong>{s.name}</strong>
              </td>
              <td>{s.faqCount}</td>
              <td>{s.priceFrom}</td>
              <td>{s.brandCheck}</td>
              <td>{s.pricingCheck}</td>
              <td>
                <a href={`/services/${s.slug}`}>live →</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Detail</h2>
      <p>
        Each live customer-facing page lives at <code>/services/[slug]</code> and is rendered by
        the <code>ServicePage</code> component. Click &quot;live&quot; above to see them in the
        customer-facing site (no preview chrome).
      </p>

      <h2>Pricing source-of-truth</h2>
      <p>
        Source: <code>research/pricing/price-book.yaml</code>. Customer-facing <code>/pricing</code>{' '}
        page uses the floor values shown above. The <code>price-book.yaml</code> contains ceiling
        rates too — see <code>/preview/distribution</code> and the profitability math in{' '}
        <Link href="/preview/profit">/preview/profit</Link> for how the floors roll up to the
        Year-1 P&amp;L.
      </p>

      <h3>Year 1 revenue mix (per customer, bi-weekly)</h3>
      <table>
        <thead>
          <tr>
            <th>Service / add-on</th>
            <th>Adoption rate</th>
            <th>Per-customer $/yr</th>
            <th>Blended LTV contribution</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mowing weekly @ $65</td>
            <td>100%</td>
            <td>$1,690</td>
            <td>$1,690</td>
          </tr>
          <tr>
            <td>One mulching service @ $200</td>
            <td>30%</td>
            <td>$200</td>
            <td>$60</td>
          </tr>
          <tr>
            <td>One hedge-trim @ $150</td>
            <td>20%</td>
            <td>$150</td>
            <td>$30</td>
          </tr>
          <tr>
            <td>
              <strong>Total LTV / customer (Year 1)</strong>
            </td>
            <td></td>
            <td></td>
            <td>
              <strong>$1,780</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Why this matters</h3>
      <p>
        The 30% mulching and 20% hedge-trim adoption rates are conservative. Real Largo lawn-care
        operators commonly sell 1-2 add-on services per existing customer per year. If the mix
        hits 50% mulching + 35% hedge-trim instead, Year 1 LTV/customer jumps from $1,780 to
        $1,843 — small delta per customer, large over 45 customers. Pricing math in{' '}
        <Link href="/preview/profit">/preview/profit</Link> shows the cumulative effect.
      </p>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview">Back to preview index</a> ·{' '}
        <a href="/preview/compliance">← Compliance Drafts</a> ·{' '}
        <a href="/preview/runbooks">Next: Operational Runbooks →</a>
      </p>
    </>
  );
}