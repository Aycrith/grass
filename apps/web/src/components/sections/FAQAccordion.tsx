'use client';

/**
 * FAQAccordion — six common-question FAQ.
 *
 * Reads from `lib/content.ts → faqHeader` for section copy and
 * `lib/content.ts → faq[]` for question/answer pairs. Wraps the
 * design-system <Accordion> primitive (Radix-backed) with the
 * section's numbered eyebrow + headline + body intro. Each row
 * is hairline-divided with a chevron rotating 180° on open.
 *
 * Keyboard accessible by Radix defaults (Arrow keys + Enter/Space).
 */

import { Eyebrow, Section } from '@/components/site';
import { Accordion } from '@/components/ui';
import { cn } from '@/lib/cn';
import { faq, faqHeader } from '@/lib/content';

import styles from './FAQAccordion.module.css';

interface FAQAccordionProps {
  className?: string;
}

export function FAQAccordion({ className }: FAQAccordionProps): React.ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)} id="faq">
      <div className="container">
        <header className={styles.header}>
          <Eyebrow tone="default" dot className={styles.headerEyebrow}>
            {faqHeader.eyebrow}
          </Eyebrow>
          <h2 className={styles.headerHeading}>{faqHeader.heading}</h2>
          <p className={styles.headerSub}>{faqHeader.subhead}</p>
        </header>

        <Accordion
          id="faq"
          items={faq.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))}
          className={styles.accordion}
        />
      </div>
    </Section>
  );
}
