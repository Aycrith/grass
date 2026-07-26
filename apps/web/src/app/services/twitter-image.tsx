/**
 * /services Twitter card image — 1200×630.
 */

import { ImageResponse } from 'next/og';

import { OgCard, OG_CARD_SIZE } from '@/app/_og-card';

export const runtime = 'edge';
export const alt = 'Largo Lawn services: mowing, edging, mulching, hedge trimming, hurricane prep';
export const size = OG_CARD_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="LARGO LAWN · SERVICES"
      headline="Six residential services."
      subhead={
        'Mowing, edging, mulching, hedge trimming, hurricane prep,\nand seasonal cleanup. Solo-operator, weekly route.'
      }
    />,
    { ...size },
  );
}
