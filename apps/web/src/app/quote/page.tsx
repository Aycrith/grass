import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/business';
import { QuoteCalculator } from './QuoteCalculator';

export const metadata: Metadata = {
  title: 'Free Quote · Largo Lawn',
  description:
    'Get a free, no-obligation quote for lawn care in Largo FL. Instant estimate, no spam, response within 24 hours.',
};

export default function QuotePage() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Free Quote</h1>
        <p className="lead">
          Tell us about your yard. We'll send a flat-rate quote within 24 hours —
          no obligation, no contract.
        </p>
      </section>

      <QuoteCalculator serviceArea={BUSINESS.service_area_zips} />

      <section className="card" style={{ marginTop: '2rem' }}>
        <h2>What happens next</h2>
        <ol>
          <li>Submit the form (30 seconds).</li>
          <li>We text or email within 24 hours with a flat-rate quote.</li>
          <li>If the price works, schedule your first mow — usually within the same week.</li>
          <li>After the first visit, decide if you want weekly / bi-weekly / one-time. No contract.</li>
        </ol>
        <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: '#4a4a4a' }}>
          Prefer to talk it through? Text or call{' '}
          <a href={`tel:${BUSINESS.phone.replace(/\D/g, '')}`}>{BUSINESS.phone}</a>.
        </p>
      </section>
    </main>
  );
}
