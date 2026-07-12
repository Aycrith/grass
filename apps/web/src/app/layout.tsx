/**
 * Root layout — Mission 1 web app.
 *
 * Charter binding: every page is customer-facing, so this is the only place
 * brand NAP (name/address/phone) is rendered in <head> JSON-LD for SEO.
 *
 * Sticky emergency banner shows when `hurricaneMode` is triggered via
 * `cap_hurricane_mode` capability (see @grass/scheduling-core).
 *
 * Typography: Inter (body) + Fraunces (display) loaded via next/font/google
 * and exposed as `--font-inter` / `--font-fraunces` CSS variables on `<html>`.
 * typography.css consumes those variables. No Google Fonts CDN @import.
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://largolawn.pro',
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} — Lawn Care in ${BUSINESS.address.city}, FL`,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LandscapingBusiness',
    name: BUSINESS.name,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
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
  };

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: SEO JSON-LD
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
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
