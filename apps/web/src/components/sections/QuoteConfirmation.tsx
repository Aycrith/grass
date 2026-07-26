/**
 * QuoteConfirmation — `/quote` body section.
 *
 * Numbered step list of what happens after the visitor
 * submits the quote form. Reads from `lib/content.ts →
 * quotePage.confirmationSteps`. Cream surface, contrasting
 * with the sand-bleached QuoteHero above so the page
 * alternates surfaces as the visitor scrolls.
 *
 * Below the steps: a small "Prefer to talk it through?" line
 * linking to the phone number — covers the visitor who
 * bounced off the form and prefers a voice channel.
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { quotePage } from '@/lib/content';

import styles from './QuoteConfirmation.module.css';

interface QuoteConfirmationProps {
  className?: string | undefined;
}

export function QuoteConfirmation({ className }: QuoteConfirmationProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <FadeUp className={styles.inner}>
          <Eyebrow tone="default" className={styles.eyebrow}>
            {quotePage.confirmationEyebrow}
          </Eyebrow>
          <ol className={styles.steps}>
            {quotePage.confirmationSteps.map((step, i) => (
              <li key={step} className={styles.step}>
                <span className={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.stepBody}>{step}</span>
              </li>
            ))}
          </ol>
          <p className={styles.tail}>{quotePage.talkTail}</p>
          <p className={styles.phoneLine}>
            <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a>
          </p>
        </FadeUp>
      </div>
    </Section>
  );
}
