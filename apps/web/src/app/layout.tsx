/**
 * Root layout — Mission 1 web app.
 *
 * Charter binding: every page is customer-facing, so this is the only place
 * brand NAP (name/address/phone) is rendered in <head> JSON-LD for SEO.
 *
 * Sticky emergency banner shows when `hurricaneMode` is triggered via
 * `cap_hurricane_mode` capability (see @grass/scheduling-core).
 */

import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://grasslargo.com'),
  title: {
    default: `${BUSINESS.name} — Lawn Care & Landscaping in ${BUSINESS.address.city}, FL`,
    template: `%s — ${BUSINESS.name}`,
  },
  description:
    'Affordable, reliable lawn care and landscaping for homeowners in Largo and Pinellas County. Mowing, edging, mulching, hedge trimming, hurricane prep.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://grasslargo.com',
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
    areaServed: BUSINESS.service_area_zips.map((zip) => ({
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
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: SEO JSON-LD
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <header className="site-header">
          <div className="container">
            <a href="/" className="brand">
              🌱 {BUSINESS.name}
            </a>
            <nav>
              <a href="/services">Services</a>
              <a href="/areas">Service Areas</a>
              <a href="/pricing">Pricing</a>
              <a href="/about">About</a>
              <a href="/contact" className="cta">
                Get a Quote
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>
              <strong>{BUSINESS.legal_entity}</strong> · {BUSINESS.address.line1},{' '}
              {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
            </p>
            <p>
              <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a> ·{' '}
              <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            </p>
            <p>
              <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · Licensed & Insured (FL)
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
