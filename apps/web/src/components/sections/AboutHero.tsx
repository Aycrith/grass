/**
 * AboutHero — `/about` page opener.
 *
 * Cream surface. Eyebrow + h1 + tagline, plus a small "what's
 * not on the page" callout pointing visitors to the
 * OperatorBio below for the founder story.
 *
 * All copy from `lib/content.ts → aboutPage`.
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Container, Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { aboutPage } from '@/lib/content';

import styles from './AboutHero.module.css';

interface AboutHeroProps {
  className?: string | undefined;
}

export function AboutHero({ className }: AboutHeroProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <Container>
        <FadeUp className={styles.copy}>
          <Eyebrow tone="default" className={styles.eyebrow}>
            {aboutPage.eyebrow}
          </Eyebrow>
          <h1 className={styles.title}>{aboutPage.heading}</h1>
          <p className={styles.tagline}>{aboutPage.tagline}</p>
        </FadeUp>
      </Container>
    </Section>
  );
}
