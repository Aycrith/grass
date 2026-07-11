/**
 * GBP-stub — Google Business Profile redirect landing page.
 *
 * Real Google Business Profiles don't accept custom URLs on the listing
 * itself, but the GBP "Website" field links here. The page exists so that:
 * 1. We have a destination matching the citation NAP
 * 2. We capture any traffic that bypasses the main homepage
 * 3. We provide a direct "request a quote" CTA for hot GBP leads
 */

import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `${BUSINESS.name} — Google Profile Visitors`,
  description: `Welcome from our Google Business Profile. ${BUSINESS.name} based in ${BUSINESS.address.city}, FL.`,
  robots: { index: false, follow: true },
};

export default function GbpLandingPage() {
  return (
    <section className="container">
      <h1>Welcome from Google</h1>
      <p>
        Thanks for finding us on Google! {BUSINESS.name} is a licensed and insured lawn-care service
        based in {BUSINESS.address.city}, FL. We serve {BUSINESS.service_area_zips.length} ZIP codes
        in Pinellas County.
      </p>

      <h2>Get a Free Quote</h2>
      <p>
        Most quotes are returned within 24 hours during business days. Use the form below or call us
        directly.
      </p>
      <p>
        <Link href="/contact" className="btn">
          Request a Quote
        </Link>{' '}
        <a href={`tel:${BUSINESS.phone}`} className="btn" style={{ background: 'var(--gray-700)' }}>
          Call {BUSINESS.phone}
        </a>
      </p>

      <h2>Why Google Visitors Choose Us</h2>
      <ul>
        <li>✓ Licensed & Insured in Florida</li>
        <li>✓ Transparent pricing — no surprise fees</li>
        <li>✓ Weather-fair scheduling (no charge for rain cancellations)</li>
        <li>✓ Hurricane mode — auto-pause + auto-reschedule during named storms</li>
        <li>✓ Local, solo-founder accountability</li>
      </ul>

      <p style={{ marginTop: '2rem' }}>
        <Link href="/">← Back to our main site</Link>
      </p>
    </section>
  );
}
