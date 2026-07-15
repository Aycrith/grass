'use client';

/**
 * OperatorNote — Mission 1 editorial "07" position.
 *
 * A typographic poster that fills the gap left by removing
 * TestimonialQuote (no real customer quotes yet, per brand
 * guidelines: invented testimonials are forbidden).
 *
 * Distinct from TestimonialQuote: this is FIRST-PERSON from the
 * operator himself ("I'm the guy"), not a customer review. Italic
 * Fraunces display quote + small circular portrait on the right
 * anchor attribution. No CTA — this is breathing space between
 * the dark ServiceAreaMap section above and the FAQAccordion
 * below.
 *
 * All copy flows from `lib/content.ts → operatorNote` and
 * `lib/content.ts → operator`. Steward edits those without
 * touching this component.
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { operator, operatorNote } from '@/lib/content';

import styles from './OperatorNote.module.css';

interface OperatorNoteProps {
  className?: string | undefined;
}

export function OperatorNote({ className }: OperatorNoteProps): ReactNode {
  return (
    <Section rhythm="loose" tone="warm" className={cn(styles.root, className)}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.copy}>
            <Eyebrow tone="default" className={styles.eyebrow}>
              {operatorNote.eyebrow}
            </Eyebrow>
            <FadeUp>
              <blockquote className={styles.quote}>{operatorNote.quote}</blockquote>
            </FadeUp>
            <p className={styles.attribution}>
              <span className={styles.attributionRule} aria-hidden="true" />
              {operator.name}, {operator.yearsMowing} years in 33771
            </p>
          </div>
          <div className={styles.portraitWrap}>
            <Image
              src="/operator/portrait.webp"
              alt={`Portrait of ${operator.name}, Largo Lawn operator`}
              width={140}
              height={140}
              className={styles.portrait}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
