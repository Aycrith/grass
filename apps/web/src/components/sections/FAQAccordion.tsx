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
 * Below the accordion: a small "still have questions?" call-strip
 * linking to the phone + email. The 6 questions don't cover every
 * situation (e.g. "I have a half-acre with a slope and three
 * dogs"), so a voice channel is the right escape hatch for the
 * questions the FAQ doesn't anticipate.
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
import { Container, Section } from '@/components/site';
import { Accordion } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { faq, faqHeader } from '@/lib/content';

import styles from './FAQAccordion.module.css';

interface FAQAccordionProps {
  className?: string;
}

export function FAQAccordion({ className }: FAQAccordionProps): React.ReactNode {
  return (
    <Section className={cn(styles.root, className)} id="faq" data-test-section="faq-accordion">
      <Container>
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

        {/* Voice-channel escape hatch. The 6 visible Q&As don't
         * cover every property (a sloped half-acre with three dogs
         * is its own conversation), so a text or call is the right
         * follow-up when the answer isn't here. Phone + email read
         * from BUSINESS so the contact info stays in lockstep with
         * the JSON-LD + footer + /contact page. */}
        <FadeUp as="div" className={styles.moreHelpWrap} delay={0.15}>
          <p className={styles.moreHelp}>
            Still have questions?{' '}
            <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a> or{' '}
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </p>
        </FadeUp>
      </Container>
    </Section>
  );
}
