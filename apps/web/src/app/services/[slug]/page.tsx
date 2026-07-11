/**
 * Service [slug] page — renders one of the 6 service pages from data.ts.
 *
 * SEO: each page has unique title, description, JSON-LD. Page generated
 * statically at build time via generateStaticParams.
 */

import { ServicePage, ServicePageJsonLd } from '@/components/ServicePage';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICES, isKnownService } from '../data';

interface ServiceParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SERVICES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServiceParams): Promise<Metadata> {
  const { slug } = await params;
  if (!isKnownService(slug)) return {};
  const svc = SERVICES[slug];
  if (!svc) return {};
  return {
    title: `${svc.name} in Largo, FL`,
    description: svc.tagline,
  };
}

export default async function ServiceDetailPage({ params }: ServiceParams) {
  const { slug } = await params;
  if (!isKnownService(slug)) notFound();
  const svc = SERVICES[slug];
  if (!svc) notFound();
  return (
    <>
      <ServicePageJsonLd content={svc} slug={slug} />
      <ServicePage content={svc} />
    </>
  );
}
