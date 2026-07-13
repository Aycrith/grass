/**
 * /areas — index page.
 *
 * Mounts the canonical AreaDirectory section (cream surface,
 * 3-col ZIP card grid on desktop). ZIP iteration order comes
 * from BUSINESS.service_area_zips so the index matches the
 * landing-page service-area map.
 *
 * JSON-LD: emits a Place entry per ZIP so search engines see
 * the service area as a structured set, not six duplicate
 * single-page schemas.
 */

import { AreaDirectory } from '@/components/sections';
import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Areas',
  description: `Lawn care and landscaping service areas: ${BUSINESS.service_area_zips.join(', ')} in Pinellas County, FL.`,
};

export default function AreasIndexPage() {
  const placeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${BUSINESS.name} service areas`,
    itemListElement: BUSINESS.service_area_zips.map((zip, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Place',
        name: `ZIP ${zip}`,
        address: {
          '@type': 'PostalAddress',
          postalCode: zip,
          addressRegion: 'FL',
          addressCountry: 'US',
        },
      },
    })),
  };
  return (
    <>
      <AreaDirectory />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- JSON-LD schema for service areas
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SEO JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
      />
    </>
  );
}
