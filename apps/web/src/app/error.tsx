'use client';

/**
 * error — root error boundary.
 *
 * Catches uncaught errors in the App Router subtree. Displays a
 * plain-local 500 with a retry button (per brand voice: no platitudes).
 * The actual error is logged server-side; we only show a generic
 * message to the customer and a "try again" affordance.
 *
 * Refactored 2026-07-25 to consume the new shared
 * `status-page.module.css` AND the shared <Button> primitive.
 * The previous implementation used a hand-rolled `<button
 * className={styles.primaryCta}>` and `<Link className={styles.outlineCta}>`
 * (raw anchor with the legacy outline-cta class). Now uses
 * <Button variant="primary"> + <Button as="link" variant="outline">.
 */

import { useEffect } from 'react';

import { Container, Section } from '@/components/site';
import { Button } from '@/components/ui';

import styles from './status-page.module.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side logger picks this up via the Next.js error reporter.
    // We intentionally don't surface the message to the customer.
    console.error(error);
  }, [error]);

  return (
    <Section rhythm="loose">
      <Container size="prose">
        <div className={styles.root}>
          <span className={styles.label}>500: something went wrong</span>
          <h1 className={styles.title}>The page didn&apos;t load.</h1>
          <p className={styles.body}>
            Could be a hiccup on our end. Try again. If it keeps happening, the phone line goes
            straight to voicemail and we listen every morning.
          </p>
          <div className={styles.ctaRow}>
            <Button type="button" variant="primary" size="md" onClick={reset}>
              Try again
            </Button>
            <Button as="link" href="/" variant="outline" size="md">
              Back to home
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
