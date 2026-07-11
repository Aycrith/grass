/**
 * Pricing — flat-rate table.
 */

import { BUSINESS, PRICING_FLOOR_CENTS } from '@/lib/business';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent flat-rate pricing for lawn care and landscaping in Largo, FL.',
};

export default function PricingPage() {
  return (
    <section className="container">
      <h1>Pricing</h1>
      <p>
        We publish our rates because we want you to know what you're paying for. Final pricing
        depends on lot size, service frequency, and scope — these are starting points.
      </p>

      <h2>Service Rates</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--gray-300)', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem' }}>Service</th>
            <th style={{ padding: '0.5rem' }}>Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--gray-300)' }}>
            <td style={{ padding: '0.5rem' }}>Mowing (small lot ≤0.25 ac)</td>
            <td style={{ padding: '0.5rem' }}>
              ${(PRICING_FLOOR_CENTS.mowing_per_visit_small / 100).toFixed(0)}/visit
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--gray-300)' }}>
            <td style={{ padding: '0.5rem' }}>Mowing (medium lot 0.25–0.5 ac)</td>
            <td style={{ padding: '0.5rem' }}>
              ${(PRICING_FLOOR_CENTS.mowing_per_visit_medium / 100).toFixed(0)}/visit
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--gray-300)' }}>
            <td style={{ padding: '0.5rem' }}>Mowing (large lot 0.5–1 ac)</td>
            <td style={{ padding: '0.5rem' }}>
              ${(PRICING_FLOOR_CENTS.mowing_per_visit_large / 100).toFixed(0)}/visit
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--gray-300)' }}>
            <td style={{ padding: '0.5rem' }}>Edging (standalone)</td>
            <td style={{ padding: '0.5rem' }}>
              ${(PRICING_FLOOR_CENTS.edging_per_linear_ft / 100).toFixed(2)}/linear ft
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--gray-300)' }}>
            <td style={{ padding: '0.5rem' }}>Mulch (pine bark, bulk)</td>
            <td style={{ padding: '0.5rem' }}>
              ${(PRICING_FLOOR_CENTS.mulch_per_cubic_yard / 100).toFixed(0)}/yd³ (materials)
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--gray-300)' }}>
            <td style={{ padding: '0.5rem' }}>Mulch install labor</td>
            <td style={{ padding: '0.5rem' }}>
              ${(PRICING_FLOOR_CENTS.mulch_install_per_cubic_yard / 100).toFixed(0)}/yd³ (labor)
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--gray-300)' }}>
            <td style={{ padding: '0.5rem' }}>Hedge trimming</td>
            <td style={{ padding: '0.5rem' }}>
              ${(PRICING_FLOOR_CENTS.hedge_trim_per_linear_ft / 100).toFixed(2)}/linear ft
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--gray-300)' }}>
            <td style={{ padding: '0.5rem' }}>Hurricane prep</td>
            <td style={{ padding: '0.5rem' }}>
              From ${(PRICING_FLOOR_CENTS.hurricane_prep_base / 100).toFixed(0)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0.5rem' }}>Seasonal cleanup</td>
            <td style={{ padding: '0.5rem' }}>
              From ${(PRICING_FLOOR_CENTS.seasonal_cleanup_base / 100).toFixed(0)}
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Discounts & Recurring Service</h2>
      <ul>
        <li>
          <strong>Pre-pay for 6 months:</strong> 10% off mowing (lock in price + service priority)
        </li>
        <li>
          <strong>Refer a neighbor:</strong> $25 credit on your next invoice for each neighbor who
          signs up
        </li>
        <li>
          <strong>Senior / military:</strong> 10% off all services (valid ID required)
        </li>
      </ul>

      <h2>What's Not Included</h2>
      <p>
        To stay in compliance with Florida regulations, we do not currently offer:
      </p>
      <ul>
        <li>Fertilization (requires the FDACS Limited Commercial Fertilizer Applicator license)</li>
        <li>Pest control (requires FDACS §482 certification)</li>
        <li>Irrigation system installation (requires the PCCLB Irrigation Specialty license)</li>
      </ul>
      <p>We can refer you to trusted licensed partners for these services.</p>

      <h2>Sales Tax Note (Year 1)</h2>
      <p>
        For the first phase of operation, our invoice reads <em>&ldquo;tax not yet
        collected&rdquo;</em>. The Florida / Pinellas combined rate is{' '}
        {BUSINESS.sales_tax_pct.toFixed(2)}% ({'6%'} FL state +
        {' '}{BUSINESS.sales_tax_pct - 6}% Pinellas County surtax). Once we register for Florida
        sales tax (DR-1) at the first-cash milestone, we&apos;ll add a sales-tax line item to
        invoices and remit quarterly. Until then, we either absorb the tax into the advertised
        price or invoice it transparently for your records — your choice at quote-time.
      </p>

      <h2>Sales Tax</h2>
      <p>
        All services are subject to {BUSINESS.sales_tax_pct.toFixed(2)}% Florida / Pinellas sales
        tax ({'6%'} FL state + {BUSINESS.sales_tax_pct - 6}% Pinellas County surtax, effective
        2025-01-01).
      </p>

      <p style={{ marginTop: '2rem' }}>
        <Link href="/contact" className="btn">
          Request a Free Quote →
        </Link>
      </p>
    </section>
  );
}
