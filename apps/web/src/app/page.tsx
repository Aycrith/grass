/**
 * Home page (Landing) — the single most-SEO-critical page.
 *
 * Targets: "lawn care Largo FL", "landscaping 33771", "yard maintenance Pinellas".
 * GBP-style NAP block matches schema.org/LandscapingBusiness in layout.
 */

import { BUSINESS, PRICING_FLOOR_CENTS } from '@/lib/business';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Lawn Care & Landscaping in {BUSINESS.address.city}, FL</h1>
          <p>
            Affordable, reliable yard care for homeowners in Largo and Pinellas County. Licensed and
            insured. Free quotes within 24 hours.
          </p>
          <p>
            <Link href="/contact" className="btn">
              Get Your Free Quote →
            </Link>
          </p>
        </div>
      </section>

      <section className="container">
        <h2>Our Services</h2>
        <div className="grid">
          <div className="card">
            <h3>
              <Link href="/services/mowing">Mowing</Link>
            </h3>
            <p>
              Weekly, bi-weekly, or monthly mowing for lots up to 1 acre. Edging and blowing
              included.
            </p>
            <p>
              <strong>
                From ${(PRICING_FLOOR_CENTS.mowing_per_visit_small / 100).toFixed(0)}/visit
              </strong>
            </p>
          </div>
          <div className="card">
            <h3>
              <Link href="/services/edging">Edging</Link>
            </h3>
            <p>Mechanical edging along curbs, walkways, and beds. Sharp, clean lines.</p>
            <p>
              <strong>
                From ${(PRICING_FLOOR_CENTS.edging_per_linear_ft / 100).toFixed(2)}/linear ft
              </strong>
            </p>
          </div>
          <div className="card">
            <h3>
              <Link href="/services/mulching">Mulching</Link>
            </h3>
            <p>Bulk mulch delivery + install. Pine bark, cypress, or hardwood blends.</p>
            <p>
              <strong>
                From $
                {(
                  (PRICING_FLOOR_CENTS.mulch_per_cubic_yard +
                    PRICING_FLOOR_CENTS.mulch_install_per_cubic_yard) /
                  100
                ).toFixed(0)}
                /yd³ installed
              </strong>
            </p>
          </div>
          <div className="card">
            <h3>
              <Link href="/services/hedge-trimming">Hedge Trimming</Link>
            </h3>
            <p>Seasonal hedge and shrub trimming. Heights up to 12 ft.</p>
            <p>
              <strong>
                From ${(PRICING_FLOOR_CENTS.hedge_trim_per_linear_ft / 100).toFixed(2)}/linear ft
              </strong>
            </p>
          </div>
          <div className="card">
            <h3>
              <Link href="/services/hurricane-prep">Hurricane Prep</Link>
            </h3>
            <p>Pre-storm yard securing, branch removal, and post-storm cleanup. June–November.</p>
            <p>
              <strong>From ${(PRICING_FLOOR_CENTS.hurricane_prep_base / 100).toFixed(0)}</strong>
            </p>
          </div>
          <div className="card">
            <h3>
              <Link href="/services/seasonal-cleanup">Seasonal Cleanup</Link>
            </h3>
            <p>Spring and fall leaf removal, bed cleanup, debris haul-off.</p>
            <p>
              <strong>From ${(PRICING_FLOOR_CENTS.seasonal_cleanup_base / 100).toFixed(0)}</strong>
            </p>
          </div>
        </div>

        <h2>Why Choose {BUSINESS.name}?</h2>
        <ul>
          <li>
            <strong>Local & Insured:</strong> Based in {BUSINESS.address.city}, fully licensed in
            Florida with $1M general liability coverage.
          </li>
          <li>
            <strong>Transparent Pricing:</strong> Per-visit or per-project rates — no surprise fees.
          </li>
          <li>
            <strong>Hurricane-Smart:</strong> When winds hit {BUSINESS.hurricane_wind_threshold_mph}
            + mph, we pause outdoor work and auto-reschedule — no charge for weather cancellations.
          </li>
          <li>
            <strong>Service Area:</strong>{' '}
            {BUSINESS.service_area_zips.map((z) => (
              <span key={z}>
                <Link href={`/areas/${z}`}>{z}</Link>{' '}
              </span>
            ))}
          </li>
        </ul>
      </section>
    </>
  );
}
