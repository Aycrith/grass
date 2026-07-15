/**
 * /about - founder story, mission, values, service register, gear.
 *
 * Mounts canonical sections: AboutHero + OperatorBio +
 * EquipmentShowcase + FinalCTABanner (re-used as the page closer).
 */

import { AboutHero, EquipmentShowcase, FinalCTABanner, OperatorBio } from '@/components/sections';
import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${BUSINESS.name}: solo-founder lawn care business serving Largo, FL.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OperatorBio />
      <EquipmentShowcase />
      <FinalCTABanner />
    </>
  );
}
