/**
 * ReviewMagnet — `/review` body section.
 *
 * Two-card layout for the GBP-stub review page:
 *   1. "Google review coming soon" — pre-launch state, gives
 *      visitors a phone CTA instead of the GBP form.
 *   2. "When something isn't right" — the operator's guarantee
 *      that they'll return within 48 hours to fix anything.
 *
 * Both cards read from `lib/content.ts → reviewPage`. The full
 * star-rating branch and `/api/review-handler` wiring is the
 * WP13 follow-up (gated on `reviewPage.reviewMagnetEnabled`,
 * which is currently false everywhere).
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { Button } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { reviewPage } from '@/lib/content';

import styles from './ReviewMagnet.module.css';

interface ReviewMagnetProps {
  className?: string | undefined;
}

export function ReviewMagnet({ className }: ReviewMagnetProps): ReactNode {
  return (
    <>
      <Section rhythm="loose" className={cn(styles.heroSection, className)}>
        <div className="container">
          <FadeUp className={styles.copy}>
            <Eyebrow tone="default" dot className={styles.eyebrow}>
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
            <Eyebrow tone="default" dot>
              Coming soon
            </Eyebrow>
            <h2 className={styles.cardHeading}>{reviewPage.comingSoonTitle}</h2>
            <p className={styles.cardBody}>{reviewPage.comingSoonBody}</p>
            <p className={styles.cardTail}>{reviewPage.comingSoonTail}</p>
            <div className={styles.cardActions}>
              <Button
                as="a"
                href={`tel:${BUSINESS.phone.replace(/\D/g, '')}`}
                variant="primary"
                size="md"
              >
                {BUSINESS.phone}
              </Button>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section rhythm="loose" className={cn(styles.notRightSection)}>
        <div className="container">
          <FadeUp className={styles.card}>
            <Eyebrow tone="default" dot>
              When something isn't right
            </Eyebrow>
            <h2 className={styles.cardHeading}>{reviewPage.notRightTitle}</h2>
            <p className={styles.cardBody}>{reviewPage.notRightBody}</p>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
