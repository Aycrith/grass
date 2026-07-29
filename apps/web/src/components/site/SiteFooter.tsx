/**
 * SiteFooter — Mission 1 NAP block.
 *
 * 4-column desktop, 2-column tablet, single-column mobile.
 * Every NAP datum (phone, email, address) flows from `lib/business`
 * so the footer stays in lockstep with the JSON-LD embedded in
 * `app/layout.tsx`. Service-area ZIPs are also pulled from
 * BUSINESS.service_area_zips.
 *
 * Hours come from BUSINESS.hours by day. Do not hard-code hours
 * anywhere else in the codebase — go through BUSINESS.
 */

'use client';

import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Illustration } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';

import styles from './SiteFooter.module.css';

const SERVICE_HREFS: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/services/mowing', label: 'Mowing' },
  { href: '/services/edging', label: 'Edging' },
  { href: '/services/mulching', label: 'Mulching' },
  { href: '/services/hedge-trimming', label: 'Hedge trimming' },
  { href: '/services/hurricane-prep', label: 'Hurricane prep' },
  { href: '/services/seasonal-cleanup', label: 'Seasonal cleanup' },
];

const COMPANY_HREFS: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
  { href: '/quote', label: 'Get a free quote' },
  { href: '/review', label: 'Leave a review' },
];

// 2026-07-26 — added after the 4 new hub pages landed
// (/hurricane-prep, /process, /reviews, /areas-near-me, /faq).
// The primary header nav stays at 4 items (Services, Areas, Pricing,
// About); the footer is the right place to surface the deeper
// content so the header does not get crowded.
const RESOURCES_HREFS: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/hurricane-prep', label: 'Hurricane prep + cleanup' },
  { href: '/process', label: 'How it works' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/faq', label: 'Frequently asked' },
  { href: '/areas-near-me', label: 'Areas near me' },
  { href: '/door-hanger', label: 'Print door hanger' },
];

const LEGAL_HREFS: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps): ReactNode {
  const year = new Date().getFullYear();
  const hours = BUSINESS.hours;

  return (
    <footer className={cn(styles.root, className)}>
      <div className={styles.container}>
        <FadeUp as="div" className={styles.grid}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brand}>
              <Illustration
                src="/illustrations/pinellas-palm-v3-72.webp"
                alt=""
                width={36}
                height={36}
                className={styles.brandMark}
              />
              {BUSINESS.name}
            </Link>
            <div className={styles.brandLine}>
              <span className={styles.brandEntity}>{BUSINESS.legal_entity}</span>
              <span className={styles.brandAddress}>
                {BUSINESS.addressPublic && BUSINESS.address.line1 && (
                  <>
                    {BUSINESS.address.line1}
                    <br />
                  </>
                )}
                {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
              </span>
            </div>
            <div className={styles.contactStack}>
              <span className={styles.contactLine}>
                <Phone size={16} aria-hidden="true" />
                <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a>
              </span>
              <span className={styles.contactLine}>
                <Mail size={16} aria-hidden="true" />
                <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
              </span>
            </div>
            <dl className={styles.hours} aria-label="Business hours">
              <div className={styles.hoursRow}>
                <dt>Mon to Fri</dt>
                <dd>{hours.weekdays}</dd>
              </div>
              <div className={styles.hoursRow}>
                <dt>Sat</dt>
                <dd>{hours.saturday}</dd>
              </div>
              <div className={styles.hoursRow}>
                <dt>Sun</dt>
                <dd>{hours.sunday}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Services</h3>
            <ul className={styles.linkList}>
              {SERVICE_HREFS.map((s) => (
                <li key={s.href}>
                  <Link href={s.href}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Company</h3>
            <ul className={styles.linkList}>
              {COMPANY_HREFS.map((c) => (
                <li key={c.href}>
                  <Link href={c.href}>{c.label}</Link>
                </li>
              ))}
            </ul>
            <h3 className={styles.colTitleSpaced}>Legal</h3>
            <ul className={styles.linkList}>
              {LEGAL_HREFS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Resources</h3>
            <ul className={styles.linkList}>
              {RESOURCES_HREFS.map((r) => (
                <li key={r.href}>
                  <Link href={r.href}>{r.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Service Area</h3>
            <p className={styles.areaNote}>
              Solo-operator lawn care across Largo and the surrounding Pinellas County
              neighborhoods. Type your ZIP on the homepage to check coverage.
            </p>
          </div>
        </FadeUp>

        <FadeUp as="div" className={styles.bottom} delay={0.1}>
          <span data-visual-mask="year">
            © {year} {BUSINESS.legal_entity}. All rights reserved.
          </span>
          <ul className={styles.legalLinks}>
            {LEGAL_HREFS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
          {/* Stage 3 (Q-5) + B-3 follow-up: footer notice replacing the previous
              CookieConsent banner. Honest characterization:
              - PostHog is a first-party analytics processor; events are keyed
                by `lead.id` and include ZIP + landing_path (correlates to PII).
              - The browser stores an attribution key (`grass_attribution_v1`,
                30-day TTL) so the UTMs survive page reloads — it is a
                functional local copy, not an advertising tracker.
              No client-side tracking tags, no advertising cookies, no opt-out
              required because there is nothing to opt out of. The privacy
              page (see /privacy) describes the actual data flow. */}
          <span className={styles.analyticsNote}>
            First-party analytics (PostHog, server-side; keyed to your lead id). One local-storage
            attribution key (grass_attribution_v1, 30 days). No advertising cookies.
          </span>
          <span>
            Built in Largo ·{' '}
            <a href={BUSINESS.url} target="_blank" rel="noopener noreferrer">
              {new URL(BUSINESS.url).hostname}
            </a>
          </span>
        </FadeUp>
      </div>
    </footer>
  );
}
