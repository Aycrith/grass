/**
 * ContactHero — `/contact` page opener.
 *
 * Cream surface. Eyebrow + h1 + tagline, all from
 * `lib/content.ts → contactPage`. The hurricane-mode callout
 * is shown when the global HurricaneBanner is active
 * (`BUSINESS.hurricaneModeActive` is true) — the callout
 * here complements the site-wide banner with a longer,
 * page-specific message about prep / cleanup prioritization.
 *
 * The legacy `?source=hurricane` URL param is preserved as
 * a fallback for direct link previews (e.g. the steward
 * wants to see what the page looks like in hurricane mode
 * without flipping the production capability flag). When
 * both are true simultaneously, the URL param wins.
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
  /**
   * Render the hurricane-mode callout. The `/contact` page
   * passes `hurricaneMode={true}` when either the global
   * HurricaneBanner is active OR the URL has
   * `?source=hurricane`. The site-wide banner handles the
   * brief notice; this callout is the long-form page-level
   * version with the prep / cleanup messaging.
   */
  hurricaneMode?: boolean | undefined;
  className?: string | undefined;
}

export function ContactHero({ hurricaneMode, className }: ContactHeroProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <FadeUp className={styles.copy}>
          <Eyebrow tone="default" className={styles.eyebrow}>
            {contactPage.eyebrow}
          </Eyebrow>
          <h1 className={styles.title}>{contactPage.heading}</h1>
          <p className={styles.tagline}>{contactPage.tagline}</p>
          {hurricaneMode || BUSINESS.hurricaneModeActive ? (
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
