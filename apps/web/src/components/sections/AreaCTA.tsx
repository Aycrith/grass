/**
 * AreaCTA — `/areas/[zip]` page closer.
 *
 * Full-bleed palm-shadow band with sand-bleached text + a sun
 * CTA, matching the FinalCTABanner pattern (D-0019) but
 * per-ZIP-specific. The eyebrow reads the ZIP, the headline
 * reads the quote prompt, the subhead names the neighborhood.
 *
 * Distinct from FinalCTABanner (the homepage page-closer):
 *   - Headline is per-ZIP ("Get a free quote for 33771")
 *   - Subhead names the neighborhood specifically
 *   - Primary CTA pre-fills the quote form with the ZIP
 *   - Secondary CTA points to the /areas index (the wider
 *     service-area surface) rather than a generic "see more"
 *
 * All copy comes from props (not a single shared const) so
 * each per-ZIP page is the source of truth for its own CTA.
 */

import type { ReactNode } from 'react';

import { Container, Section } from '@/components/site';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { AreaDetail } from '@/lib/content';

import styles from './AreaCTA.module.css';

interface AreaCTAProps {
  detail: AreaDetail;
  className?: string | undefined;
}

export function AreaCTA({ detail, className }: AreaCTAProps): ReactNode {
  return (
    <Section className={cn(styles.root, className)}>
      <Container>
        <div className={styles.inner}>
          <span className={styles.eyebrow}>Ready when you are</span>
          <h2 className={styles.headline}>Get a free quote for {detail.zip}.</h2>
          <p className={styles.body}>
            Same-guy, same-day response in {detail.name} and the surrounding Pinellas County
            neighborhoods. No contract, no franchise markup. 24-hour quote turnaround during
            business days.
          </p>
          <div className={styles.actions}>
            <Button as="link" href={`/quote?zip=${detail.zip}`} variant="sun" size="lg">
              Get a free quote
            </Button>
            <Button as="link" href="/areas" variant="outline" size="lg" inverse>
              See all service areas
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
