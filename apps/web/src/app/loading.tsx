/**
 * loading — root-level loading state.
 *
 * Next.js App Router shows this Suspense fallback during route
 * transitions and async data fetches. A small, on-brand skeleton
 * (sand-bleached surface + palm-shadow spinner) beats a blank flash.
 *
 * Refactored 2026-07-25 to consume the new shared
 * `status-page.module.css` (the prior import of `not-found.module.css`
 * was repurposed for the editorial 404 page). Styles unchanged.
 */

import { Container, Section } from '@/components/site';

import styles from './status-page.module.css';

export default function Loading() {
  return (
    <Section rhythm="loose">
      <Container size="prose">
        <output aria-live="polite" aria-label="Loading page" className={styles.root}>
          <span className={styles.labelMuted}>Loading</span>
          <div className={styles.spinner} />
        </output>
      </Container>
    </Section>
  );
}
