'use client';

/**
 * FAQAccordion — six common-question FAQ.
 *
 * Reads from `lib/content.ts → faqHeader` for section copy and
 * `lib/content.ts → faq[]` for question/answer pairs. Wraps the
 * design-system <Accordion> primitive (Radix-backed) with the
 * section's headline + body intro. Each row is hairline-divided
 * with a chevron rotating 180° on open.
 *
 * Keyboard accessible by Radix defaults (Arrow keys + Enter/Space).
 *
 * D-0030 (Wave C of three sequential design changes) — visual
 * system hygiene pass:
 *   - Section rhythm: loose → default. D-0030 mandates even
 *     vertical padding (--space-10 / 64px) across all in-scope
 *     sections; the FAQ was previously --space-13 (128px).
 *   - The eyebrow (originally "08 - Questions") was already
 *     removed in an earlier wave, so no further eyebrow work
 *     here.
 */

import { FadeUp } from '@/components/motion';
import { Section } from '@/components/site';
import { Accordion } from '@/components/ui';
import { cn } from '@/lib/cn';
import { faq, faqHeader } from '@/lib/content';

import styles from './FAQAccordion.module.css';

interface FAQAccordionProps {
  className?: string;
}

export function FAQAccordion({ className }: FAQAccordionProps): React.ReactNode {
  return (
    <Section className={cn(styles.root, className)} id="faq" data-test-section="faq-accordion">
      <div className="container">
        <FadeUp as="header" className={styles.header}>
          <h2 className={styles.headerHeading}>{faqHeader.heading}</h2>
          <p className={styles.headerSub}>{faqHeader.subhead}</p>
        </FadeUp>

        <FadeUp as="div" className={styles.accordionWrap} delay={0.1}>
          <Accordion
            id="faq"
            items={faq.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))}
            className={styles.accordion}
          />
        </FadeUp>
      </div>
    </Section>
  );
}
