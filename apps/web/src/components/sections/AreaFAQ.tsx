'use client';

/**
 * AreaFAQ — ZIP-specific FAQ accordion on `/areas/[zip]`.
 *
 * One ZIP-specific question per area (vs. multiple per service
 * on `/services/[slug]`). Reuses the design-system <Accordion>
 * primitive (Radix-backed) so keyboard a11y, focus rings, and
 * reduced-motion paths stay consistent with ServiceFAQ.
 *
 * Reads from `lib/content.ts → areaDetail[zip].faqs`.
 */

import type { ReactNode } from 'react';

import { Eyebrow } from '@/components/site';
import { Accordion } from '@/components/ui';
import { cn } from '@/lib/cn';
import { areaDetail } from '@/lib/content';

import styles from './AreaFAQ.module.css';

interface AreaFAQProps {
  /** Service-area ZIP — must be a key in `areaDetail`. */
  zip: string;
  className?: string | undefined;
}

export function AreaFAQ({ zip, className }: AreaFAQProps): ReactNode {
  const detail = areaDetail[zip as keyof typeof areaDetail];
  if (!detail) return null;
  const faqs = detail.faqs;
  return (
    <section className={cn(styles.root, className)}>
      <div className="container">
        <header className={styles.header}>
          <Eyebrow tone="default" className={styles.headerEyebrow}>
            Specific to {zip}
          </Eyebrow>
          <h2 className={styles.headerHeading}>A {detail.name} question.</h2>
          <p className={styles.headerSub}>
            One we hear more often than others — about this neighborhood specifically.
          </p>
        </header>

        <Accordion
          id={`faq-area-${zip}`}
          items={faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))}
          className={styles.accordion}
        />
      </div>
    </section>
  );
}
