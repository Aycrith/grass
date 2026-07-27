/**
 * /hurricane-prep Open Graph image — 1200×630.
 *
 * Per-route OG image so the deep-dive hub renders a distinct
 * social preview (the brand-default OgCard at the app root would
 * make the page read as a generic lawn-care link in a feed).
 * Edge-rendered via satori; no custom fonts (avoids the
 * next/font/google runtime mismatch in Next 15.5.20). Composition
 * lives in `app/_og-card.tsx` so the OG and Twitter route
 * handlers stay trivial.
 */

import { ImageResponse } from 'next/og';

import { OgCard, OG_CARD_SIZE } from '@/app/_og-card';
import { hurricanePrepPage } from '@/lib/content';

export const runtime = 'edge';
export const alt = 'Largo Lawn: hurricane prep and post-storm cleanup in Largo, FL';
export const size = OG_CARD_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="HURRICANE PREP · LARGO FL"
      headline={hurricanePrepPage.heading}
      subhead={
        'Pre-storm sweep, post-storm haul, and the insurance paperwork.\nJune through November. Free quotes within 24 hours.'
      }
    />,
    { ...size },
  );
}
