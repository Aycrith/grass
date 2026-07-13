/**
 * AreaCTA — final per-area call to action on `/areas/[zip]`.
 *
 * Same visual idiom as ServiceCTA: palm-shadow band, sand
 * text, sun button. The heading and the back link both
 * reference the ZIP, and the back-link goes to `/areas`
 * (vs. ServiceCTA which goes to `/services`).
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import { areaDetail } from '@/lib/content';

import styles from './AreaCTA.module.css';

interface AreaCTAProps {
  /** Service-area ZIP — must be a key in `areaDetail`. */
  zip: string;
  className?: string | undefined;
}

export function AreaCTA({ zip, className }: AreaCTAProps): ReactNode {
  const detail = areaDetail[zip as keyof typeof areaDetail];
  if (!detail) return null;
  return (
    <section className={cn(styles.root, className)}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Ready when you are</span>
            <h2 className={styles.heading}>Ready for a great yard in {zip}?</h2>
            <p className={styles.body}>
              Free, no-obligation quote within 24 hours. Local, solo, and on the same route every
              week.
            </p>
          </div>
          <div className={styles.actions}>
            <Button as="link" href="/quote" variant="sun" size="lg">
              Get my free quote
            </Button>
            <Link href="/areas" className={styles.back}>
              ← All service areas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
