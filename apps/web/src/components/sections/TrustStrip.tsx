/**
 * TrustStrip — trust signals + service-area band.
 *
 * Used immediately under the hero on the homepage. Per the motion PRD,
 * this is intentionally NOT a marquee (which reads franchise-y and is
 * on the anti-patterns list). Plain static text + tabular ZIP list.
 *
 * 2026-07-29 (per the GTM audit Fix #13): the strip now carries two
 * extra trust signals for cold ad traffic:
 *   - "Serving 6 Pinellas ZIPs since 2020" — anchors the operator to
 *     a place and a tenure, the two things Google reviewers and
 *     nextdoor neighbors ask about first.
 *   - Review count + rating (when 5+ GBP reviews exist) — the
 *     highest-impact trust signal for cold paid traffic.
 *
 * Data flows from `BUSINESS.service_area_zips` and `lib/reviews` so it
 * stays in lockstep with the JSON-LD + footer.
 */

import type { ReactNode } from 'react';

import { Container } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { PENDING_AGGREGATE_RATING, RATING } from '@/lib/reviews';

import styles from './TrustStrip.module.css';

interface TrustStripProps {
  className?: string;
}

export function TrustStrip({ className }: TrustStripProps): ReactNode {
  const zips = BUSINESS.service_area_zips;
  const showRating = !PENDING_AGGREGATE_RATING;

  return (
    <aside className={cn(styles.root, className)} aria-label="Service area">
      <Container>
        <div className={styles.inner}>
          {showRating ? (
            <div className={styles.rating}>
              <span className={styles.stars} aria-hidden="true">
                ★★★★★
              </span>
              <span className={styles.ratingText}>
                <strong>{RATING.ratingValue.toFixed(1)}</strong> from{' '}
                <strong>{RATING.reviewCount}</strong>{' '}
                {RATING.reviewCount === 1 ? 'neighbor' : 'neighbors'} in 33771
              </span>
            </div>
          ) : null}
          <div className={styles.line}>
            <span className={styles.prefix}>Proudly serving</span>
            <ul className={styles.zipList}>
              {zips.map((zip, idx) => (
                <li key={zip} className={styles.zip}>
                  {zip}
                  {idx < zips.length - 1 ? <span className={styles.sep}> · </span> : null}
                </li>
              ))}
            </ul>
            <span className={styles.suffix}>
              — and the surrounding Pinellas County since 2020.
            </span>
          </div>
        </div>
      </Container>
    </aside>
  );
}
