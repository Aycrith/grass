/**
 * /hurricane-prep Twitter card image — 1200×630.
 *
 * Twitter renders <meta name="twitter:image"> from the same
 * composition as the OG image. The route handler is a thin
 * shim around the OG handler so the social preview stays in
 * lockstep with the OG surface (no risk of the two drifting).
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
        'Pre-storm sweep, post-storm haul, and the insurance paperwork.\nJune through November.'
      }
    />,
    { ...size },
  );
}
