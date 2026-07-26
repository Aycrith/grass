/**
 * GBP-stub - Google Business Profile redirect landing page.
 *
 * Real Google Business Profiles don't accept custom URLs on the listing
 * itself, but the GBP "Website" field links here. The page exists so that:
 * 1. We have a destination matching the citation NAP
 * 2. We capture any traffic that bypasses the main homepage
 * 3. We provide a direct "request a quote" CTA for hot GBP leads
 *
 * Refactored 2026-07-25 to use the shared <Section> + <Button>
 * primitives and the .prose typography class. Before this refactor
 * the page was a bare <section className="container"> with raw
 * <h1>/<h2>/<ul>/<p> and a hand-rolled anchor with `className="btn"`
 * (the .btn class was never actually defined in the global CSS — the
 * anchors were just rendering as default blue underlines).
 *
 * 2026-07-25 follow-up: the inner <div className="container
 * container--prose"> wrapper migrated to the <Container size="prose">
 * React primitive. The legacy global classes are still defined in
 * styles/layout.css for /qr's print-asset prose guide, but every
 * customer-facing page now uses the React primitive.
 */

import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';
import { Phone } from 'lucide-react';

import { FadeUp } from '@/components/motion';
import { Container, Section } from '@/components/site';
import { Button } from '@/components/ui';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: `${BUSINESS.name}: Google Profile Visitors`,
  description: `Welcome from our Google Business Profile. ${BUSINESS.name} based in ${BUSINESS.address.city}, FL.`,
  robots: { index: false, follow: true },
};

const HIGHLIGHTS: ReadonlyArray<string> = [
  'Locally owned & operated',
  'Transparent pricing — no surprise fees',
  'Free quotes within 24 hours',
  'Weather-fair scheduling (no charge for rain cancellations)',
  'Hurricane mode: auto-pause + auto-reschedule during named storms',
  'Local, solo-founder accountability',
];

export default function GbpLandingPage() {
  return (
    <Section rhythm="loose" tone="soft">
      <Container size="prose">
        <FadeUp>
          <div className="prose">
            <h1>Welcome from Google</h1>
            <p>
              Thanks for finding us on Google! {BUSINESS.name} is a locally-owned
              lawn-care service based in {BUSINESS.address.city}, FL. We serve{' '}
              {BUSINESS.service_area_zips.length} ZIP codes in Pinellas County.
            </p>

            <h2>Get a free quote</h2>
            <p>
              Most quotes are returned within 24 hours during business days. Use
              the buttons below, or call us directly.
            </p>
            <div className={styles.ctaRow}>
              <Button as="link" href="/contact" variant="primary" size="lg">
                Request a quote
              </Button>
              <Button as="a" href={`tel:${BUSINESS.phone}`} variant="sun" size="lg">
                <Phone size={18} aria-hidden="true" />
                Call {BUSINESS.phone}
              </Button>
            </div>

            <h2>Why Google visitors choose us</h2>
            <ul>
              {HIGHLIGHTS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <div className={styles.backLinkRow}>
              <Button as="link" href="/" variant="ghost" size="md">
                ← Back to our main site
              </Button>
            </div>
          </div>
        </FadeUp>
      </Container>
    </Section>
  );
}
