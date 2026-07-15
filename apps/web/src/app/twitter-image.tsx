/**
 * Twitter card image - 1200×630.
 *
 * Mirrors opengraph-image.tsx verbatim. Twitter's card validators
 * look for a static /twitter-image.{png,jpg,gif,webp} OR an
 * app/twitter-image.tsx route. We use the route form so the
 * generated card always matches the OG image.
 *
 * Re-exports opengraph-image's logic by composition, not by
 * re-importing the component (satori responses are not shareable
 * across route boundaries).
 */

import { ImageResponse } from 'next/og';
import { Fraunces, Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  weight: ['700'],
});

// `next/font/google` exposes `.fetch()` at runtime but the public
// NextFont type in Next.js 15.5 does not declare it. Cast to access.
// biome-ignore lint/suspicious/noExplicitAny: documented Next.js API; type lag
const fetchFontData = (font: any): Promise<ArrayBuffer> => font.fetch();

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
          fontFamily: 'Inter',
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

        <div
          style={{
            marginTop: 16,
            fontFamily: 'Fraunces',
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
      fonts: [
        { name: 'Inter', data: await fetchFontData(inter), weight: 400, style: 'normal' },
        { name: 'Inter', data: await fetchFontData(inter), weight: 500, style: 'normal' },
        { name: 'Inter', data: await fetchFontData(inter), weight: 700, style: 'normal' },
        { name: 'Fraunces', data: await fetchFontData(fraunces), weight: 700, style: 'normal' },
      ],
    },
  );
}