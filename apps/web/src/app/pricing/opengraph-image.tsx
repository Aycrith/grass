/**
 * /pricing Open Graph image — 1200×630.
 *
 * 2026-07-26 — added per-route OG image so the pricing page
 * renders a distinct social preview.
 */

import { ImageResponse } from 'next/og';

import { OgCard, OG_CARD_SIZE } from '@/app/_og-card';

export const runtime = 'edge';
export const alt = 'Largo Lawn pricing: lawn care rates in Largo, FL';
export const size = OG_CARD_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="LARGO LAWN · PRICING"
      headline="What it costs."
      subhead={
        'Floor pricing per visit. No subscription, no contract,\nno surprise fees. Free quotes within 24 hours.'
      }
    />,
    { ...size },
  );
}
