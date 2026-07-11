/**
 * About page — founder story, mission, values.
 */

import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${BUSINESS.name} — solo-founder lawn care business serving Largo, FL.`,
};

export default function AboutPage() {
  return (
    <section className="container">
      <h1>About {BUSINESS.name}</h1>
      <p>
        {BUSINESS.name} is a solo-founder lawn care and landscaping business based in{' '}
        {BUSINESS.address.city}, FL. We serve residential customers in{' '}
        {BUSINESS.service_area_zips.length} Pinellas County ZIP codes with a focused set of
        yard-care services.
      </p>

      <h2>Our Mission</h2>
      <p>
        We exist to make professional lawn care affordable and reliable for everyday homeowners.
        Floridians already deal with enough — hurricanes, humidity, salt air — and a stressed-out
        yard shouldn't add to it.
      </p>

      <h2>Why Solo?</h2>
      <p>
        Most landscaping companies grow fast, hire subcontractors, and lose quality control. We
        don't. {BUSINESS.legal_entity} is a one-crew operation — every job is performed by the same
        person who quoted it. When you book, you know exactly who's coming.
      </p>

      <h2>Our Values</h2>
      <ul>
        <li>
          <strong>Transparent pricing:</strong> Rates published on the website. No surprise fees.
        </li>
        <li>
          <strong>Weather fairness:</strong> When winds hit {BUSINESS.hurricane_wind_threshold_mph}+
          mph or it's raining at your scheduled time, we auto-reschedule at no charge.
        </li>
        <li>
          <strong>No upselling:</strong> If your yard doesn't need a service, we'll tell you.
        </li>
        <li>
          <strong>Local accountability:</strong> We live here. Our reputation depends on every yard
          we touch.
        </li>
      </ul>

      <h2>What we don't (yet) do</h2>
      <p>
        We don&apos;t currently offer fertilization, pest control, or irrigation system
        installation. Those services require specialized Florida licensing (FDACS Limited Commercial
        Fertilizer Applicator, FDACS §482 Pest Control, PCCLB Irrigation Specialty) that we have
        not acquired. If you need any of those, ask us — we can recommend a licensed operator in
        the area.
      </p>

      <h2>Service register (active)</h2>
      <ul>
        <li>Lawn mowing (push + riding, ≤1 acre)</li>
        <li>Mechanical edging (curbs, walks, bed lines)</li>
        <li>Mulch installation (bulk delivery + install)</li>
        <li>Hedge & shrub trimming (≤12 ft height)</li>
        <li>Hurricane prep + post-storm cleanup</li>
        <li>Seasonal cleanup (leaves, beds, debris haul-off)</li>
      </ul>

      <p style={{ marginTop: '2rem' }}>
        <Link href="/contact" className="btn">
          Get in Touch →
        </Link>
      </p>
    </section>
  );
}
