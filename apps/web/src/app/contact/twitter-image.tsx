/**
 * /contact Twitter card image — 1200×630.
 */

import { ImageResponse } from 'next/og';

import { OgCard, OG_CARD_SIZE } from '@/app/_og-card';

export const runtime = 'edge';
export const alt = 'Contact Largo Lawn: get a free lawn-care quote in Largo, FL';
export const size = OG_CARD_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="LARGO LAWN · CONTACT"
      headline="Get a free quote."
      subhead={'Solo-operator lawn care in 33771.\nFree quotes within 24 hours, no contract.'}
    />,
    { ...size },
  );
}
