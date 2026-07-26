/**
 * Twitter card image — 1200×630.
 *
 * D-0025: mirrors opengraph-image.tsx with the same fix — drops
 * the broken next/font/google .fetch()/.arrayBuffer() calls that
 * were throwing TypeError on /twitter-image in Next.js 15.5.20.
 *
 * (Was: `font.fetch is not a function` and `font.arrayBuffer is
 * not a function` — the next/font/google runtime object doesn't
 * expose either method.)
 *
 * Now: minimal satori-rendered PNG with NO custom fonts. The
 * brand composition is shared with /opengraph-image via
 * `app/_og-card.tsx` so the steward only edits the card in one
 * place when copy or logo changes.
 */

import { ImageResponse } from 'next/og';

import { OgCard, OG_CARD_SIZE } from './_og-card';

export const runtime = 'edge';
export const alt = "Largo Lawn: your neighbor's lawn mower in Largo, FL";
export const size = OG_CARD_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="LAWN CARE IN 33771"
      headline="Your neighbor's lawn mower."
      subhead={
        'Local, solo-operator lawn care in Largo and the adjacent\nfive Pinellas ZIPs. Free quotes within 24 hours.'
      }
    />,
    {
      ...size,
    },
  );
}
