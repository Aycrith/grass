/**
 * /areas Twitter card image — 1200×630.
 */

import { ImageResponse } from 'next/og';

import { OgCard, OG_CARD_SIZE } from '@/app/_og-card';
import { BUSINESS } from '@/lib/business';

export const runtime = 'edge';
export const alt = 'Largo Lawn service areas: six Pinellas neighborhoods on a weekly route';
export const size = OG_CARD_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow={`LARGO LAWN · ${BUSINESS.service_area_zips.join(' / ')}`}
      headline="Six Pinellas neighborhoods."
      subhead={'Home base is 33771. The route reaches the five\nadjacent ZIPs on a consistent weekly schedule.'}
    />,
    { ...size },
  );
}
