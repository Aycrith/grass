/**
 * Root layout — Mission 1 web app.
 *
 * Charter binding: every page is customer-facing, so this is the only place
 * brand NAP (name/address/phone) is rendered in JSON-LD for SEO.
 *
 * Sticky emergency banner shows when `hurricaneMode` is triggered via
 * `cap_hurricane_mode` capability (see @grass/scheduling-core).
 *
 * Typography: Inter (body) + Fraunces (display) loaded via next/font/google
 * and exposed as `--font-inter` / `--font-fraunces` CSS variables on `<html>`.
 * typography.css consumes those variables. No Google Fonts CDN @import.
 *
 * Why JSON-LD lives in <body> and not <head>:
 * Next.js 15 App Router fully manages <head> when `metadata` is exported —
 * any manual children written into a JSX <head> element can shadow the
 * auto-generated <title>, <meta name="description">, <meta property="og:*">,
 * and twitter:* tags in the prod SSR HTML output. The Lighthouse audit
 * surfaced this as `meta-description` failing on every route (only charset
 * + viewport survived). Moving JSON-LD into <body> keeps the structured
 * data fully Google-compliant (JSON-LD parses anywhere in the document)
 * while leaving <head> entirely to the metadata API.
 */

import { SiteFooter, SiteHeader } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://largolawn.pro'),
  title: {
    default: `${BUSINESS.name} — Lawn Care & Landscaping in ${BUSINESS.address.city}, FL`,
    template: `%s — ${BUSINESS.name}`,
  },
  description:
    'Affordable, reliable lawn care and landscaping for homeowners in Largo and Pinellas County. Mowing, edging, mulching, hedge trimming, hurricane prep.',
  keywords: [
    'lawn care Largo FL',
    'landscaping 33771',
    'yard maintenance Pinellas',
    'lawn mowing Largo',
    'hedge trimming',
    'mulching',
    'hurricane prep',
    'solo operator lawn care',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://largolawn.pro',
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} — Lawn Care in ${BUSINESS.address.city}, FL`,
    description:
      'Affordable, reliable lawn care and landscaping in Largo and Pinellas County. Free quotes within 24 hours.',
  },
  twitter: {
    card: 'summary',
    title: `${BUSINESS.name} — Lawn Care in ${BUSINESS.address.city}, FL`,
    description:
      'Affordable, reliable lawn care and landscaping in Largo and Pinellas County.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LandscapingBusiness',
    name: BUSINESS.name,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    url: 'https://largolawn.pro',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.line1,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      postalCode: BUSINESS.address.zip,
      addressCountry: 'US',
    },
    areaServed: BUSINESS.service_area_zips.map((zip: string) => ({
      '@type': 'PostalAddress',
      postalCode: zip,
      addressCountry: 'US',
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '14:00',
      },
    ],
    priceRange: '$$',
    image: 'https://largolawn.pro/og.png',
  };

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        {/* JSON-LD: rendered in <body> so it doesn't shadow metadata-API tags. */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: SEO JSON-LD
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
