/**
 * /areas/[zip] - per-ZIP neighborhood page.
 *
 * D-0034 re-authorization. D-0033 deleted the per-area
 * components (AreaHero, AreaNeighborhoodNotes, AreaServiceOffer,
 * AreaFAQ, AreaCTA) and this route; this is the substantive
 * rewrite with real local content + 6 painted storybook
 * illustrations.
 *
 * 5 sections in order:
 *   1. AreaHero              — full-bleed painted scene + ZIP eyebrow + h1 + CTAs
 *   2. AreaNeighborhoodNotes — about + landmarks + challenges + what I do here
 *   3. AreaServiceOffer      — 6 services (mowing/edging/mulching/...)
 *   4. AreaFAQ               — 3-4 per-ZIP questions in <Accordion>
 *   5. AreaCTA               — palm-shadow closer with ZIP-specific quote
 *
 * Statically generated for all 6 ZIPs via `generateStaticParams`.
 * JSON-LD: schema.org `Service` with `areaServed: postalCode: {zip}`
 * + `provider: LandscapingBusiness` per the schema.org spec for
 * local service businesses. Same shape as the per-service detail
 * pages (/services/[slug]).
 *
 * 404s for any ZIP not in the canonical 6 — D-0032 makes the
 * form permissive, but this page is a marketing surface for
 * the 6 home-area ZIPs only.
 */

import {
  AreaCTA,
  AreaFAQ,
  AreaHero,
  AreaNeighborhoodNotes,
  AreaServiceOffer,
} from '@/components/sections';
import { BUSINESS } from '@/lib/business';
import { areaDetail } from '@/lib/content';
import { detailBreadcrumb } from '@/lib/json-ld';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const KNOWN_ZIPS = Object.keys(areaDetail);

interface AreaParams {
  params: Promise<{ zip: string }>;
}

function isKnownAreaZip(zip: string): zip is keyof typeof areaDetail {
  return zip in areaDetail;
}

export async function generateStaticParams() {
  return KNOWN_ZIPS.map((zip) => ({ zip }));
}

export async function generateMetadata({ params }: AreaParams): Promise<Metadata> {
  const { zip } = await params;
  if (!isKnownAreaZip(zip)) return {};
  const detail = areaDetail[zip];
  if (!detail) return {};
  return {
    title: `${detail.name} lawn care (ZIP ${zip}) | Largo Lawn`,
    description: detail.tagline,
    alternates: { canonical: `/areas/${zip}` },
  };
}

export default async function AreaDetailPage({ params }: AreaParams) {
  const { zip } = await params;
  if (!isKnownAreaZip(zip)) notFound();
  const detail = areaDetail[zip];
  if (!detail) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Lawn care',
    name: `Lawn care in ${detail.name} (${zip})`,
    description: detail.tagline,
    provider: { '@type': 'LandscapingBusiness', name: BUSINESS.name },
    areaServed: {
      '@type': 'PostalAddress',
      postalCode: zip,
      addressRegion: 'FL',
      addressCountry: 'US',
      addressLocality: detail.name,
    },
    url: `https://largolawn.pro/areas/${zip}`,
  };

  const breadcrumbSchema = detailBreadcrumb({
    parentLabel: 'Service areas',
    parentHref: '/areas',
    currentLabel: `ZIP ${zip} (${detail.name})`,
    currentHref: `/areas/${zip}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SEO JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SEO JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AreaHero detail={detail} />
      <AreaNeighborhoodNotes detail={detail} />
      <AreaServiceOffer zip={zip} />
      <AreaFAQ detail={detail} />
      <AreaCTA detail={detail} />
    </>
  );
}
