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
 * fetch, no runtime API mismatch). Composition matches the brand:
 * sand-bleached field, sun accent top-right, grass-blade mark +
 * Largo Lawn wordmark on left, eyebrow + headline + body on right.
 *
 * The og-image is also exposed as a static apps/web/public/
 * og-image.png as a fallback (for crawlers that don't run
 * edge functions).
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "Largo Lawn: your neighbor's lawn mower in Largo, FL";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F4E8D0', // --ll-sand-bleached
          padding: 80,
          color: '#1A1F1B', // --ll-palm-bark
          position: 'relative',
        }}
      >
        {/* Sun accent top-right */}
        <div
          style={{
            position: 'absolute',
            top: 72,
            right: 120,
            width: 96,
            height: 96,
            borderRadius: 9999,
            backgroundColor: '#E8B65A', // --ll-sun
            opacity: 0.85,
            display: 'flex',
          }}
        />

        {/* Logo lockup: grass-blade mark + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Grass-blade mark — simplified 3-blade glyph for satori */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 6,
              height: 100,
              width: 100,
            }}
          >
            <div
              style={{
                width: 24,
                height: 100,
                backgroundColor: '#1F4E2C', // --ll-green
                borderRadius: 12,
                transform: 'rotate(-8deg)',
              }}
            />
            <div
              style={{
                width: 24,
                height: 100,
                backgroundColor: '#1F4E2C', // --ll-green
                borderRadius: 12,
              }}
            />
            <div
              style={{
                width: 24,
                height: 100,
                backgroundColor: '#1F4E2C', // --ll-green
                borderRadius: 12,
                transform: 'rotate(8deg)',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: '#1F4E2C', // --ll-green
                lineHeight: 1,
              }}
            >
              Largo Lawn
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                fontWeight: 500,
                color: '#1F4E2C', // --ll-green
                opacity: 0.7,
                letterSpacing: 2,
              }}
            >
              YOUR NEIGHBOR&apos;S LAWN MOWER
            </div>
          </div>
        </div>

        {/* Eyebrow */}
        <div
          style={{
            marginTop: 96,
            fontSize: 16,
            fontWeight: 700,
            color: '#B5651D', // --ll-clay
            letterSpacing: 3,
            display: 'flex',
          }}
        >
          LAWN CARE IN 33771
        </div>

        {/* Headline — satori default font (replaces broken Fraunces
         * via next/font/google which was throwing TypeError). */}
        <div
          style={{
            marginTop: 16,
            fontSize: 92,
            fontWeight: 700,
            color: '#1A1F1B', // --ll-palm-bark
            letterSpacing: -2,
            lineHeight: 1.05,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Your neighbor&apos;s</span>
          <span>lawn mower.</span>
        </div>

        {/* Body — satori default font (replaces broken Inter). */}
        <div
          style={{
            marginTop: 32,
            fontSize: 22,
            fontWeight: 500,
            color: '#1A1F1B', // --ll-palm-bark
            opacity: 0.78,
            lineHeight: 1.4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Local, solo-operator lawn care in Largo and the adjacent</span>
          <span>five Pinellas ZIPs. Free quotes within 24 hours.</span>
        </div>
      </div>
    ),
    {
      ...size,
      // No custom fonts — satori uses its default which is
      // bundled in the next/og package. This avoids the
      // font.fetch / font.arrayBuffer TypeError that broke
      // /opengraph-image in Next 15.5.20.
    },
  );
}
