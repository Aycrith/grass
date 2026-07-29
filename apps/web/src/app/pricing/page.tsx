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
 *
 * SEO: FAQPage JSON-LD mirrors the visible PricingFAQ section
 * so Google can render the 6 Q&As as rich-result FAQ snippets
 * in search. The structured data is generated server-side from
 * the same `faq` array the React component consumes, so it can
 * never drift from what the user actually sees.
 */

import {
  FinalCTABanner,
  PricingComparisonTable,
  PricingFAQ,
  PricingHero,
} from '@/components/sections';
import { BUSINESS } from '@/lib/business';
import { faq } from '@/lib/content';
import { JsonLd, pageBreadcrumb } from '@/lib/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent flat-rate pricing for lawn care and landscaping in Largo, FL.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
    provider: { '@type': 'LandscapingBusiness', name: BUSINESS.name },
  };

  const breadcrumbSchema = pageBreadcrumb({
    currentLabel: 'Pricing',
    currentHref: '/pricing',
  });

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbSchema} />
      <PricingHero />
      <PricingComparisonTable />
      <PricingFAQ />
      <FinalCTABanner />
    </>
  );
}
