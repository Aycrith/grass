'use client';

/**
 * PricingFAQ — `/pricing` FAQ section.
 *
 * Reuses the cross-cutting `lib/content.ts → faq` array that
 * the homepage FAQAccordion uses. Wraps the design-system
 * <Accordion> primitive (Radix-backed) for keyboard a11y,
 * focus rings, and reduced-motion consistency.
 *
 * Lives client-side because it uses Radix Accordion (which
 * needs state for expanded/collapsed).
 */

import type { ReactNode } from 'react';

import { Eyebrow } from '@/components/site';
import { Accordion } from '@/components/ui';
import { cn } from '@/lib/cn';
import { faq } from '@/lib/content';

import styles from './PricingFAQ.module.css';

interface PricingFAQProps {
  className?: string | undefined;
}

export function PricingFAQ({ className }: PricingFAQProps): ReactNode {
  return (
    <section className={cn(styles.root, className)}>
      <div className="container">
        <header className={styles.header}>
          <Eyebrow tone="default" className={styles.headerEyebrow}>
            Questions about pricing
          </Eyebrow>
          <h2 className={styles.headerHeading}>Frequently asked.</h2>
          <p className={styles.headerSub}>
            The honest answers to the things people ask before they commit.
          </p>
        </header>
        <Accordion
          id="faq-pricing"
          items={faq.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))}
          className={styles.accordion}
        />
      </div>
    </section>
  );
}
