/**
 * TrustStrip — static ZIPs + value-prop band.
 *
 * Used immediately under the hero on the homepage. Per the motion PRD,
 * this is intentionally NOT a marquee (which reads franchise-y and is
 * on the anti-patterns list). Plain static text + tabular ZIP list.
 *
 * Data flows from `BUSINESS.service_area_zips` so it stays in lockstep
 * with the JSON-LD + footer.
 */

import type { ReactNode } from 'react';

import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';

import styles from './TrustStrip.module.css';

interface TrustStripProps {
  className?: string;
}

export function TrustStrip({ className }: TrustStripProps): ReactNode {
  const zips = BUSINESS.service_area_zips;

  return (
    <aside className={cn(styles.root, className)} aria-label="Service area">
      <div className="container">
        <div className={styles.inner}>
          <span className={styles.prefix}>Proudly serving</span>
          <ul className={styles.zipList}>
            {zips.map((zip, idx) => (
              <li key={zip} className={styles.zip}>
                {zip}
                {idx < zips.length - 1 ? <span className={styles.sep}> · </span> : null}
              </li>
            ))}
          </ul>
          <span className={styles.suffix}>— and the surrounding Pinellas County.</span>
        </div>
      </div>
    </aside>
  );
}
