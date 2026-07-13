/**
 * /about — founder story, mission, values, service register.
 *
 * Mounts canonical sections: AboutHero + OperatorBio +
 * FinalCTABanner (re-used as the page closer).
 *
 * EquipmentShowcase is deferred to WP10 (requires ComfyUI
 * assets that haven't been generated yet).
 */

import { AboutHero, FinalCTABanner, OperatorBio } from '@/components/sections';
import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${BUSINESS.name} — solo-founder lawn care business serving Largo, FL.`,
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OperatorBio />
      <FinalCTABanner />
    </>
  );
}
