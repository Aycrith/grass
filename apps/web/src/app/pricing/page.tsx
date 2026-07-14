/**
 * /pricing — flat-rate pricing page.
 *
 * Mounts the canonical pricing section composition:
 *   PricingHero             — editorial header
 *   PricingComparisonTable  — floor rates + discounts + not-included + tax
 *   PricingFAQ              — Radix accordion (reuses `faq` content)
 *   FinalCTABanner          — homepage closer (re-used as the page closer)
 *
 * All copy and rates flow from `lib/content.ts → pricingPage`
 * and `lib/business.ts → PRICING_FLOOR_CENTS` so the steward
 * edits one file per axis (copy / rates) to update the page.
 */

import {
  FinalCTABanner,
  PricingComparisonTable,
  PricingFAQ,
  PricingHero,
} from '@/components/sections';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent flat-rate pricing for lawn care and landscaping in Largo, FL.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <PricingComparisonTable />
      <PricingFAQ />
      <FinalCTABanner />
    </>
  );
}
