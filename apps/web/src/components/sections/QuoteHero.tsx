/**
 * QuoteHero — `/quote` page opener.
 *
 * Sand-bleached surface (slightly different from the cream
 * ContactHero so the two lead-capture pages feel distinct
 * when a visitor lands on both). Eyebrow + h1 + tagline.
 *
 * The "or call" phone + email line below the tagline mirrors
 * the ContactHero pattern. Customers who want a voice channel
 * can call/text before scrolling down to the calculator. The
 * QuoteConfirmation section below the form also surfaces a
 * "Prefer to talk it through?" line, but that one is below
 * the fold — surfacing the phone up here is the higher-intent
 * touch.
 *
 * All copy from `lib/content.ts → quotePage`.
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
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
          <p className={styles.phoneLine}>
            Prefer a voice?{' '}
            <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a> ·{' '}
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </p>
        </FadeUp>
      </div>
    </Section>
  );
}
