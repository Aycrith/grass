/**
 * Services index — `/services`.
 *
 * Renders <ServiceDirectory>, the canonical sections-library
 * directory page. The directory reads from `lib/content.ts →
 * services` for the bento-card summary and `lib/content.ts →
 * servicesIndex` for the header copy.
 *
 * Customer-facing routes are SEO-targeted for "lawn care Largo
 * FL", "landscaping 33771", and each of the 6 service lines.
 * JSON-LD for the 6 individual services is emitted by their
 * own [slug]/page.tsx; this index page itself emits a single
 * ItemList of Service entries for richer search snippets.
 */

import { ServiceDirectory, FinalCTABanner } from '@/components/sections';
import { BUSINESS } from '@/lib/business';
import { services } from '@/lib/content';
import { JsonLd, pageBreadcrumb } from '@/lib/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Six residential lawn-care services for Largo and Pinellas County: mowing, edging, mulching, hedge trimming, hurricane prep, seasonal cleanup.',
  alternates: { canonical: '/services' },
};

export default function ServicesIndexPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: Object.values(services).map((svc, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: svc.title,
      url: `${BUSINESS.url}/services/${svc.slug}`,
    })),
  };

  const breadcrumbSchema = pageBreadcrumb({
    currentLabel: 'Services',
    currentHref: '/services',
  });

  return (
    <>
      <JsonLd
        data={{
          ...itemListJsonLd,
          provider: { '@type': 'LandscapingBusiness', name: BUSINESS.name },
        }}
      />
      <JsonLd data={breadcrumbSchema} />
      <ServiceDirectory />
      {/* Page closer — same FinalCTABanner used on /, /pricing, /about
       * so every deep-link page ends with a conversion CTA. A visitor
       * who lands on /services/mowing from search and reads the page
       * has no in-page path to /quote besides the header nav. */}
      <FinalCTABanner />
    </>
  );
}
