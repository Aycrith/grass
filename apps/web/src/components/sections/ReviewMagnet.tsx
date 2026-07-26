/**
 * ReviewMagnet — `/review` body section.
 *
 * Three stacked sub-blocks:
 *   1. Hero — eyebrow + h1 + tagline (cream surface).
 *   2. Form card — gated on `reviewPage.reviewMagnetEnabled`.
 *      - When false (default), renders the static "coming soon"
 *        card + phone CTA.
 *      - When true, renders <ReviewMagnetForm>, the interactive
 *        5-star selector + GBP-redirect / feedback-form branch.
 *   3. Not-right card — the operator's 48-hour guarantee
 *      (always visible regardless of the gate).
 *
 * Both form-card and not-right-card read from
 * `lib/content.ts → reviewPage`. The gate flag is the only
 * difference between pre-launch and post-launch states — the
 * steward flips `reviewPage.reviewMagnetEnabled` the day the
 * GBP profile is verified.
 *
 * Tracking: every GBP redirect appends
 * `?src=review-magnet&zip=...` so the GBP stub can attribute
 * visits to the review-magnet flow.
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { Button } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { reviewPage } from '@/lib/content';

import styles from './ReviewMagnet.module.css';
import { ReviewMagnetForm } from './ReviewMagnetForm';

interface ReviewMagnetProps {
  className?: string | undefined;
}

export function ReviewMagnet({ className }: ReviewMagnetProps): ReactNode {
  return (
    <>
      <Section rhythm="loose" className={cn(styles.heroSection, className)}>
        <div className="container">
          <FadeUp className={styles.copy}>
            <Eyebrow tone="default" className={styles.eyebrow}>
              {reviewPage.eyebrow}
            </Eyebrow>
            <h1 className={styles.title}>{reviewPage.heading}</h1>
            <p className={styles.tagline}>{reviewPage.tagline}</p>
          </FadeUp>
        </div>
      </Section>

      <Section rhythm="loose" className={cn(styles.comingSoonSection)}>
        <div className="container">
          <FadeUp className={styles.card}>
            <Eyebrow tone="default" >
              {reviewPage.reviewMagnetEnabled ? 'How was it?' : 'Coming soon'}
            </Eyebrow>
            {reviewPage.reviewMagnetEnabled ? (
              <ReviewMagnetForm />
            ) : (
              <>
                <h2 className={styles.cardHeading}>{reviewPage.comingSoonTitle}</h2>
                <p className={styles.cardBody}>{reviewPage.comingSoonBody}</p>
                <p className={styles.cardTail}>{reviewPage.comingSoonTail}</p>
                <div className={styles.cardActions}>
                  <Button
                    as="a"
                    href={`tel:${BUSINESS.phoneTel}`}
                    variant="primary"
                    size="md"
                  >
                    {BUSINESS.phone}
                  </Button>
                </div>
              </>
            )}
          </FadeUp>
        </div>
      </Section>

      <Section rhythm="loose" className={cn(styles.notRightSection)}>
        <div className="container">
          <FadeUp className={styles.card}>
            <Eyebrow tone="default" >
              When something isn&apos;t right
            </Eyebrow>
            <h2 className={styles.cardHeading}>{reviewPage.notRightTitle}</h2>
            <p className={styles.cardBody}>{reviewPage.notRightBody}</p>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
