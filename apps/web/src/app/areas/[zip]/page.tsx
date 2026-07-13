/**
 * /areas/[zip] — one per service area.
 *
 * Mounts 5 canonical section components in order:
 *   AreaHero            — full-bleed image + ZIP pill + h1 + CTA
 *   AreaNeighborhoodNotes — intro paragraph + nearby landmarks
 *   AreaServiceOffer    — 6-card grid linking to /services/[slug]
 *   AreaFAQ             — 1 ZIP-specific question (Radix accordion)
 *   AreaCTA             — palm-shadow final CTA + back to /areas
 *
 * Content flows from `lib/content.ts → areaDetail[zip]` (single
 * source of truth) and `serviceAreaMap.areaImages[zip]` for the
 * hero image. The page is statically generated for every ZIP in
 * BUSINESS.service_area_zips via generateStaticParams.
 */

import {
  AreaCTA,
  AreaFAQ,
  AreaHero,
  AreaNeighborhoodNotes,
  AreaServiceOffer,
} from '@/components/sections';
import { BUSINESS, inServiceArea } from '@/lib/business';
import { areaDetail } from '@/lib/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface AreaParams {
  params: Promise<{ zip: string }>;
}

export async function generateStaticParams() {
  return BUSINESS.service_area_zips.map((zip: string) => ({ zip }));
}

export async function generateMetadata({ params }: AreaParams): Promise<Metadata> {
  const { zip } = await params;
  if (!inServiceArea(zip)) return {};
  const detail = areaDetail[zip as keyof typeof areaDetail];
  if (!detail) return {};
  return {
    title: `${detail.heading} | ${BUSINESS.name}`,
    description: detail.intro,
  };
}

export default async function AreaZipPage({ params }: AreaParams) {
  const { zip } = await params;
  if (!inServiceArea(zip)) notFound();
  const detail = areaDetail[zip as keyof typeof areaDetail];
  if (!detail) notFound();

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Lawn Care',
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${BUSINESS.url}/#business`,
      name: BUSINESS.name,
      areaServed: { '@type': 'PostalAddress', postalCode: zip, addressRegion: 'FL' },
    },
    areaServed: { '@type': 'PostalAddress', postalCode: zip, addressRegion: 'FL' },
  };

  return (
    <>
      <AreaHero zip={zip} />
      <AreaNeighborhoodNotes zip={zip} />
      <AreaServiceOffer zip={zip} />
      <AreaFAQ zip={zip} />
      <AreaCTA zip={zip} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- JSON-LD schema for ZIP area
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SEO JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
    </>
  );
}
