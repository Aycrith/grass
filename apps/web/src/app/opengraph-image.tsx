/**
 * Open Graph image — 1200×630.
 *
 * D-0025: replaced the broken next/font/google .fetch()/.arrayBuffer()
 * approach (was throwing TypeError "font.fetch is not a function" /
 * "font.arrayBuffer is not a function" in Next.js 15.5.20 — neither
 * method is exposed on the font runtime object, so /opengraph-image
 * was returning 500 for every crawler and user).
 *
 * Now: minimal satori-rendered PNG with NO custom fonts (uses
 * satori's default font, which is always available — no network
 * fetch, no runtime API mismatch). Composition lives in
 * `app/_og-card.tsx` so the OG and Twitter route handlers stay
 * trivial.
 *
 * The og-image is also exposed as a static apps/web/public/
 * og-image.png as a fallback (for crawlers that don't run
 * edge functions).
 */

import { ImageResponse } from 'next/og';

import { OgCard, OG_CARD_SIZE } from './_og-card';

export const runtime = 'edge';
export const alt = "Largo Lawn: your neighbor's lawn mower in Largo, FL";
export const size = OG_CARD_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(<OgCard />, {
    ...size,
    // No custom fonts — satori uses its default which is bundled
    // in the next/og package. Avoids the font.fetch / font.arrayBuffer
    // TypeError that broke /opengraph-image in Next 15.5.20.
  });
}
