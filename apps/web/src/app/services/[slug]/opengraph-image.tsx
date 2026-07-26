/**
 * Per-service Open Graph image — 1200×630.
 *
 * 2026-07-26 — added per-route OG images so every /services/[slug]
 * link renders a distinct social preview (previously every page on
 * the site shared the same brand-default OgCard rendered at the
 * app root, which hurt both CTR and platform caching).
 *
 * Edge-rendered via satori. No custom fonts. Composition lives
 * in `app/_og-card.tsx` — the parameterised OgCard takes the
 * service name + tagline from `serviceDetail` so each per-service
 * preview reads as a distinct piece of editorial content in a
 * social feed.
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
    // unknown slug — Next.js will not call us, but defend anyway
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
