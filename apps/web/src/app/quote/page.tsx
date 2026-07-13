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
 */

import { QuoteConfirmation, QuoteHero } from '@/components/sections';
import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';
import { QuoteCalculator } from './QuoteCalculator';

export const metadata: Metadata = {
  title: 'Free Quote · Largo Lawn',
  description:
    'Get a free, no-obligation quote for lawn care in Largo FL. Instant estimate, no spam, response within 24 hours.',
};

export default function QuotePage() {
  return (
    <>
      <QuoteHero />
      <section style={{ background: 'var(--ll-sand-bleached)', paddingBottom: 'var(--space-12)' }}>
        <div className="container">
          <QuoteCalculator serviceArea={BUSINESS.service_area_zips} />
        </div>
      </section>
      <QuoteConfirmation />
    </>
  );
}
