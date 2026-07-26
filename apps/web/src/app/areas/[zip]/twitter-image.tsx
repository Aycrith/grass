/**
 * Per-ZIP Twitter card image — 1200×630.
 *
 * 2026-07-26 — mirrors opengraph-image.tsx with the same
 * per-ZIP content.
 */

import { ImageResponse } from 'next/og';

import { OgCard, OG_CARD_SIZE } from '@/app/_og-card';
import { areaDetail } from '@/lib/content';

export const runtime = 'edge';
export const alt = 'Largo Lawn: lawn care in Largo, FL';
export const size = OG_CARD_SIZE;
export const contentType = 'image/png';

interface AreaImageParams {
  params: Promise<{ zip: string }>;
}

export default async function Image({ params }: AreaImageParams) {
  const { zip } = await params;
  const detail = areaDetail[zip];
  if (!detail) {
    return new ImageResponse(
      <OgCard headline="Largo Lawn." subhead="Lawn care in Largo, FL." />,
      { ...size },
    );
  }
  return new ImageResponse(
    <OgCard
      eyebrow={`LARGO LAWN · ${zip}`}
      headline={`${detail.name}.`}
      subhead={`Local, solo-operator lawn care in ${detail.longName.toLowerCase()}.\nFree quotes within 24 hours.`}
    />,
    { ...size },
  );
}
