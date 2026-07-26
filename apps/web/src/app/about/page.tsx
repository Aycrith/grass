/**
 * /about - founder story, mission, values, service register, gear.
 *
 * Mounts canonical sections: AboutHero + OperatorBio +
 * EquipmentShowcase + FinalCTABanner (re-used as the page closer).
 *
 * Emits BreadcrumbList JSON-LD so Google can render a
 * "Home > About" crumb in the search snippet. Mirrors the
 * same shape on /pricing, /contact, /quote, /services, /areas.
 */

import { AboutHero, EquipmentShowcase, FinalCTABanner, OperatorBio } from '@/components/sections';
import { BUSINESS } from '@/lib/business';
import { JsonLd, pageBreadcrumb } from '@/lib/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${BUSINESS.name}: solo-founder lawn care business serving Largo, FL.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const breadcrumbSchema = pageBreadcrumb({
    currentLabel: 'About',
    currentHref: '/about',
  });

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <AboutHero />
      <OperatorBio />
      <EquipmentShowcase />
      <FinalCTABanner />
    </>
  );
}
