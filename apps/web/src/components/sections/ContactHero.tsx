/**
 * ContactHero — `/contact` page opener.
 *
 * Cream surface. Eyebrow + h1 + tagline, all from
 * `lib/content.ts → contactPage`. When `?source=hurricane` is
 * in the URL (because Hurricane Mode is active), the hero
 * adds a prominent clay-bordered callout below the tagline.
 *
 * The existing <ContactForm> stays as-is — it's a client
 * component with its own state machine and posts to
 * /api/lead. We only own the editorial frame around it.
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { contactPage } from '@/lib/content';

import styles from './ContactHero.module.css';

interface ContactHeroProps {
  /** Render the hurricane-mode callout — true when /contact?source=hurricane. */
  hurricaneMode?: boolean | undefined;
  className?: string | undefined;
}

export function ContactHero({ hurricaneMode, className }: ContactHeroProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <FadeUp className={styles.copy}>
          <Eyebrow tone="default" dot className={styles.eyebrow}>
            {contactPage.eyebrow}
          </Eyebrow>
          <h1 className={styles.title}>{contactPage.heading}</h1>
          <p className={styles.tagline}>{contactPage.tagline}</p>
          {hurricaneMode ? (
            <p className={styles.hurricaneCallout}>{contactPage.hurricaneCopy}</p>
          ) : null}
          <p className={styles.coverage}>{contactPage.coverageLine}</p>
          <p className={styles.phoneLine}>
            <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a> ·{' '}
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </p>
        </FadeUp>
      </div>
    </Section>
  );
}
