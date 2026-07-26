/**
 * /quote — free-quote page.
 *
 * Mounts the canonical section composition:
 *   QuoteHero           — editorial opener (sand-bleached)
 *   QuoteCalculator     — preserved client component
 *   QuoteConfirmation   — post-submit timeline (cream)
 *
 * The existing <QuoteCalculator> is preserved — it owns its
 * own service-area validation, optimistic UX, and /api/quote
 * post flow. We only own the editorial frame around it.
 *
 * D-0028: the QuoteCalculator now reads `?zip=` via
 * `useSearchParams()` to prefill the ZIP select. Next 15
 * requires the closest parent server component to wrap the
 * hook consumer in <Suspense> so the rest of /quote can
 * still prerender statically; without the boundary the
 * whole route opts into dynamic rendering on the first
 * request.
 */

import { Suspense } from 'react';

import { Container, Section } from '@/components/site';
import { QuoteConfirmation, QuoteHero } from '@/components/sections';
import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';
import { QuoteCalculator } from './QuoteCalculator';

export const metadata: Metadata = {
  title: 'Free Quote · Largo Lawn',
  description:
    'Get a free, no-obligation quote for lawn care in Largo FL. Instant estimate, no spam, response within 24 hours.',
  alternates: { canonical: '/quote' },
};

export default function QuotePage() {
  return (
    <>
      <QuoteHero />
      <Section tone="warm" rhythm="loose">
        <Container>
          {/* D-0028: Suspense boundary for the useSearchParams()
             call inside QuoteCalculator (reads ?zip= to prefill
             from the Coverage Check CTA on the homepage). The
             fallback is a skeleton card with the same shape so
             the layout doesn't shift while the calculator
             client-side hydrates. */}
          <Suspense fallback={<QuoteCalculatorSkeleton />}>
            <QuoteCalculator serviceArea={BUSINESS.service_area_zips} />
          </Suspense>
        </Container>
      </Section>
      <QuoteConfirmation />
    </>
  );
}

function QuoteCalculatorSkeleton() {
  return (
    <section
      className="card"
      style={{ marginTop: '2rem', minHeight: '24rem' }}
      aria-hidden="true"
    />
  );
}
