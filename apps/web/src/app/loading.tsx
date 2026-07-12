/**
 * loading — root-level loading state.
 *
 * Next.js App Router shows this Suspense fallback during route
 * transitions and async data fetches. A small, on-brand skeleton
 * (sand-bleached surface + palm-shadow spinner) beats a blank flash.
 */

import { Container, Section } from '@/components/site';

import styles from './not-found.module.css';

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
