/**
 * /about Open Graph image — 1200×630.
 *
 * 2026-07-26 — added per-route OG image so the about page
 * renders a distinct social preview (was sharing the brand
 * default with every other page).
 */

import { ImageResponse } from 'next/og';

import { OgCard, OG_CARD_SIZE } from '@/app/_og-card';

export const runtime = 'edge';
export const alt = 'About Largo Lawn: solo-operator lawn care in Largo, FL';
export const size = OG_CARD_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="LARGO LAWN · ABOUT"
      headline="Same guy, every week."
      subhead={
        'Solo-operator lawn care in Largo, FL. Six years cutting\ngrass in 33771. No crew swap, no franchise markup.'
      }
    />,
    { ...size },
  );
}
