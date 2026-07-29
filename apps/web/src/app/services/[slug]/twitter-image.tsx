/**
 * Per-service Twitter card image — 1200×630.
 *
 * 2026-07-26 — mirrors opengraph-image.tsx with the same
 * per-service content. Composition lives in `app/_og-card.tsx`.
 */

import { ImageResponse } from 'next/og';

import { OgCard, OG_CARD_SIZE } from '@/app/_og-card';
import { isKnownService, serviceDetail, services } from '@/lib/content';

export const runtime = 'edge';
export const alt = 'Largo Lawn: lawn care in Largo, FL';
export const size = OG_CARD_SIZE;
export const contentType = 'image/png';

interface ServiceImageParams {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ServiceImageParams) {
  const { slug } = await params;
  if (!isKnownService(slug)) {
    return new ImageResponse(
      <OgCard headline="Largo Lawn." subhead="Lawn care in Largo, FL." />,
      { ...size },
    );
  }
  const detail = serviceDetail[slug];
  const summary = services[slug]?.summary ?? detail.tagline;
  return new ImageResponse(
    <OgCard
      eyebrow="LARGO LAWN · SERVICE"
      headline={`${detail.name}.`}
      subhead={`${summary}\nFree quotes within 24 hours.`}
    />,
    { ...size },
  );
}
