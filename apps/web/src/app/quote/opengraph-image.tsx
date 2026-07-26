/**
 * /quote Open Graph image — 1200×630.
 */

import { ImageResponse } from 'next/og';

import { OgCard, OG_CARD_SIZE } from '@/app/_og-card';

export const runtime = 'edge';
export const alt = 'Largo Lawn quote calculator: instant lawn-care estimate in Largo, FL';
export const size = OG_CARD_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="LARGO LAWN · INSTANT QUOTE"
      headline="Quote in 60 seconds."
      subhead={'Drop in your lot size. Floor pricing, no\ncontracts, no upsell. Free final quote within 24h.'}
    />,
    { ...size },
  );
}
