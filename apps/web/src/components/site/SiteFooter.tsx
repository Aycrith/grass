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

import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Illustration, Pill } from '@/components/ui';
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
  { href: '/quote', label: 'Get a quote' },
  { href: '/review', label: 'Leave a review' },
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
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brand}>
              <Illustration
                src="/illustrations/pinellas-palm.svg"
                alt=""
                width={36}
                height={24}
                className={styles.brandMark}
              />
              {BUSINESS.name}
            </Link>
            <div className={styles.brandLine}>
              <span className={styles.brandEntity}>{BUSINESS.legal_entity}</span>
              <span className={styles.brandAddress}>
                {BUSINESS.address.line1}
                <br />
                {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
              </span>
            </div>
            <div className={styles.contactStack}>
              <span className={styles.contactLine}>
                <Phone size={16} aria-hidden="true" />
                <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>
              </span>
              <span className={styles.contactLine}>
                <Mail size={16} aria-hidden="true" />
                <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
              </span>
            </div>
            <dl className={styles.hours} aria-label="Business hours">
              <div className={styles.hoursRow}>
                <dt>Mon–Fri</dt>
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
            <h3 className={styles.colTitle}>Service Area</h3>
            <p className={styles.areaNote}>
              Serving six ZIPs across Largo and the surrounding Pinellas County neighborhoods.
            </p>
            <div className={styles.zipRow}>
              {BUSINESS.service_area_zips.map((zip) => (
                <Link key={zip} href={`/areas/${zip}`} aria-label={`Service area ${zip}`}>
                  <Pill tone="outline" size="sm">
                    {zip}
                  </Pill>
                </Link>
              ))}
            </div>
            <Link href="/areas" className={styles.areaLink}>
              See full service area →
            </Link>
          </div>
        </div>

        <div className={styles.bottom}>
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
          <span>
            Built in Largo ·{' '}
            <a href="https://largolawn.pro" target="_blank" rel="noopener noreferrer">
              largolawn.pro
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
