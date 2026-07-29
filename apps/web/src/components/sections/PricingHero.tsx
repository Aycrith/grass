/**
 * PricingHero — `/pricing` page opener.
 *
 * Cream surface (matches the rest of the site's editorial pages).
 * Eyebrow + h1 + tagline pulled from `lib/content.ts →
 * pricingPage` so the steward edits one file when copy changes.
 *
 * Distinct from the homepage `PricingTiers` (which is a 3-card
 * price teaser): the `/pricing` page hero sets the editorial
 * frame for the full comparison table below.
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Container, Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { pricingPage } from '@/lib/content';

import styles from './PricingHero.module.css';

interface PricingHeroProps {
  className?: string | undefined;
}

export function PricingHero({ className }: PricingHeroProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <Container>
        <FadeUp className={styles.copy}>
          <Eyebrow tone="default" className={styles.eyebrow}>
            {pricingPage.eyebrow}
          </Eyebrow>
          <h1 className={styles.title}>{pricingPage.heading}</h1>
          <p className={styles.tagline}>{pricingPage.tagline}</p>
        </FadeUp>
      </Container>
    </Section>
  );
}
