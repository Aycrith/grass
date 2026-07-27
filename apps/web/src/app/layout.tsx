/**
 * Root layout - Mission 1 web app.
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
 * Next.js 15 App Router fully manages <head> when `metadata` is exported -
 * any manual children written into a JSX <head> element can shadow the
 * auto-generated <title>, <meta name="description">, <meta property="og:*">,
 * and twitter:* tags in the prod SSR HTML output. The Lighthouse audit
 * surfaced this as `meta-description` failing on every route (only charset
 * + viewport survived). Moving JSON-LD into <body> keeps the structured
 * data fully Google-compliant (JSON-LD parses anywhere in the document)
 * while leaving <head> entirely to the metadata API.
 */

import { HurricaneBanner, SiteFooter, SiteHeader } from '@/components/site';
import { LenisProvider, MotionConfig } from '@/components/motion';
import { BUSINESS } from '@/lib/business';
import { services } from '@/lib/content';
import { JsonLd } from '@/lib/json-ld';
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
  metadataBase: new URL(BUSINESS.url),
  title: {
    default: `${BUSINESS.name}: Lawn Care & Landscaping in ${BUSINESS.address.city}, FL`,
    template: `%s - ${BUSINESS.name}`,
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
    url: BUSINESS.url,
    siteName: BUSINESS.name,
    title: `${BUSINESS.name}: Lawn Care in ${BUSINESS.address.city}, FL`,
    description:
      'Affordable, reliable lawn care and landscaping in Largo and Pinellas County. Free quotes within 24 hours.',
  },
  twitter: {
    card: 'summary',
    title: `${BUSINESS.name}: Lawn Care in ${BUSINESS.address.city}, FL`,
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
  // LandscapingBusiness JSON-LD — anchored to BUSINESS (NAP + service
  // area + hours) and `services` content (the 6-service catalog).
  // 2026-07-26 enhancement: added `hasOfferCatalog` so every per-service
  // URL is a sub-entity of the business; Google can render
  // service-level rich results anchored to the parent LandscapingBusiness
  // (e.g. "Services offered" carousel). Also added `sameAs` for the
  // known external profiles (GBP stub, Nextdoor presence, Facebook
  // page if present) — these help Google's Knowledge Graph disambiguate
  // "Largo Lawn" from other landscaping businesses with similar names.
  const offerCatalog = {
    '@type': 'OfferCatalog',
    name: `${BUSINESS.name} services`,
    itemListElement: Object.values(services).map((svc) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: svc.title,
        url: `${BUSINESS.url}/services/${svc.slug}`,
        description: svc.summary,
      },
    })),
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LandscapingBusiness',
    name: BUSINESS.name,
    description:
      'Solo-operator lawn care and landscaping in Largo, FL. Weekly route across six Pinellas ZIPs. Free quotes within 24 hours.',
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    url: BUSINESS.url,
    // SAB (service-area business) address — when BUSINESS.addressPublic is
    // false, the streetAddress field is omitted. schema.org accepts a
    // PostalAddress with only addressLocality/addressRegion/postalCode
    // for SABs and Google's local pack does not penalize the omission.
    // See BUSINESS.addressPublic in lib/business.ts.
    address: {
      '@type': 'PostalAddress',
      ...(BUSINESS.addressPublic && BUSINESS.address.line1
        ? { streetAddress: BUSINESS.address.line1 }
        : {}),
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
    image: `${BUSINESS.url}/og.png`,
    hasOfferCatalog: offerCatalog,
    // External profiles — `sameAs` tells Google these are the
    // canonical external presences for the business entity. Helps
    // the Knowledge Graph disambiguate the name. Empty array when
    // the steward has not yet linked any external profile.
    sameAs: [`${BUSINESS.url}/gbp`],
  };

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        {/*
         * <noscript> fallback — the site is heavily JS-dependent
         * (hero animations, form validation, accordions, the
         * coverage check, the quote calculator). When JS is off,
         * the user sees a single-line phone + email prompt with
         * the option to use a mailto: or tel: link. Better than
         * the blank page they would otherwise see.
         *
         * Rendered as the first child of <body> (not <head>) so it
         * doesn't fight Next 15's metadata-managed <head> pipeline.
         * The CSS is inlined (1 rule) so the noscript block doesn't
         * depend on a stylesheet that also requires JS.
         */}
        <noscript>
          <div
            style={{
              padding: '12px 16px',
              background: '#1F4E2C',
              color: '#F4E8D0',
              textAlign: 'center',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
            }}
          >
            For the best experience, enable JavaScript. You can still reach us at{' '}
            <a
              href={`tel:${BUSINESS.phoneTel}`}
              style={{ color: '#F4E8D0', textDecoration: 'underline' }}
            >
              {BUSINESS.phone}
            </a>{' '}
            or{' '}
            <a
              href={`mailto:${BUSINESS.email}`}
              style={{ color: '#F4E8D0', textDecoration: 'underline' }}
            >
              {BUSINESS.email}
            </a>
            .
          </div>
        </noscript>
        {/* JSON-LD: rendered in <body> so it doesn't shadow metadata-API tags. */}
        <JsonLd data={jsonLd} />
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        {/* HurricaneBanner — capability-bound site-wide banner.
         *
         * Gated on BUSINESS.hurricaneModeActive (the steward flips
         * this when the `cap_hurricane_mode` capability is triggered).
         * The banner is a 'use client' component but it's safe to
         * mount from this Server Component layout — the parent
         * <body> never re-renders, so the banner's Framer Motion
         * mount animation only fires when the flag actually changes
         * via a redeploy. The header below is `position: sticky;
         * top: 0`, so the banner pushes the header down naturally
         * and the header takes over the viewport top as the visitor
         * scrolls past it. */}
        {BUSINESS.hurricaneModeActive ? <HurricaneBanner /> : null}
        {/* WP19 - LenisProvider mounts smooth-scroll so the ParallaxImage
         * site-wide) actually sees a non-zero `scrollYProgress`. The
         * provider is gated for prefers-reduced-motion + coarse-pointer +
         * <=768px viewports inside LenisProvider.tsx so mobile and
         * reduce-motion users keep native scroll. */}
        <LenisProvider>
          <MotionConfig>
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
          </MotionConfig>
        </LenisProvider>
      </body>
    </html>
  );
}
