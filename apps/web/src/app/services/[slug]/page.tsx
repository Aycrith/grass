/**
 * Service [slug] page — `/services/[slug]`.
 *
 * Renders the four canonical sections-library components in
 * sequence: ServiceHero (full-bleed image + heading + tagline +
 * dual CTAs) → ServiceIncludes (what's included + pricing card)
 * → ServiceFAQ (per-service Q&A) → ServiceCTA (final per-service
 * CTA + back link to /services).
 *
 * SEO: each page has unique title, description, and Service-
 * type JSON-LD. Page generates statically at build time via
 * `generateStaticParams()`.
 *
 * Customer-facing surface for "mowing Largo FL", "edging 33771",
 * "mulching Pinellas", etc. JSON-LD for LandscapingBusiness +
 * Service + PostalAddress is anchored to `BUSINESS`.
 */

import { ServiceCTA, ServiceFAQ, ServiceHero, ServiceIncludes } from '@/components/sections';
import { BUSINESS } from '@/lib/business';
import { type ServiceKey, isKnownService, serviceDetail, services } from '@/lib/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ServiceParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServiceParams): Promise<Metadata> {
  const { slug } = await params;
  if (!isKnownService(slug)) return {};
  const svc = serviceDetail[slug];
  if (!svc) return {};
  return {
    title: `${svc.name} in Largo, FL`,
    description: svc.tagline,
  };
}

export default async function ServiceDetailPage({ params }: ServiceParams) {
  const { slug } = await params;
  if (!isKnownService(slug)) notFound();
  const detail = serviceDetail[slug];
  if (!detail) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: detail.name,
    name: `${detail.name} in Largo, FL`,
    description: detail.tagline,
    provider: { '@type': 'LandscapingBusiness', name: BUSINESS.name },
    areaServed: {
      '@type': 'City',
      name: 'Largo',
      containedInPlace: { '@type': 'State', name: 'FL' },
    },
    url: `https://largolawn.pro/services/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SEO JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceHero slug={slug as ServiceKey} />
      <ServiceIncludes slug={slug as ServiceKey} />
      <ServiceFAQ slug={slug as ServiceKey} />
      <ServiceCTA serviceName={detail.name} />
    </>
  );
}
