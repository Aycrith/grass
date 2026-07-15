/**
 * QuoteHero — `/quote` page opener.
 *
 * Sand-bleached surface (slightly different from the cream
 * ContactHero so the two lead-capture pages feel distinct
 * when a visitor lands on both). Eyebrow + h1 + tagline.
 *
 * All copy from `lib/content.ts → quotePage`.
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { quotePage } from '@/lib/content';

import styles from './QuoteHero.module.css';

interface QuoteHeroProps {
  className?: string | undefined;
}

export function QuoteHero({ className }: QuoteHeroProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <FadeUp className={styles.copy}>
          <Eyebrow tone="default" className={styles.eyebrow}>
            {quotePage.eyebrow}
          </Eyebrow>
          <h1 className={styles.title}>{quotePage.heading}</h1>
          <p className={styles.tagline}>{quotePage.tagline}</p>
        </FadeUp>
      </div>
    </Section>
  );
}
