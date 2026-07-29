/**
 * ServiceCTA — final per-service call to action.
 *
 * Smaller, less dramatic than the homepage FinalCTABanner.
 * A dark band with eyebrow + h2 + one CTA ("Get my free quote")
 * that wraps `/services/[slug]` after the FAQ. Includes a
 * back-link to `/services` so visitors who landed directly via
 * search can orient.
 *
 * Lighter-weight than FinalCTABanner because the per-service
 * page is a navigational waypoint, not a landing-page closer.
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

import { Container, Section } from '@/components/site';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

import styles from './ServiceCTA.module.css';

interface ServiceCTAProps {
  serviceName: string;
  className?: string | undefined;
}

export function ServiceCTA({ serviceName, className }: ServiceCTAProps): ReactNode {
  return (
    <Section className={cn(styles.root, className)}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Ready when you are</span>
            <h2 className={styles.heading}>Ready for {serviceName.toLowerCase()} in 33771?</h2>
            <p className={styles.body}>
              Free, no-obligation quote within 24 hours. Local, solo, and on the same route every
              week.
            </p>
          </div>
          <div className={styles.actions}>
            <Button as="link" href="/quote" variant="sun" size="lg">
              Get my free quote
            </Button>
            <Link href="/services" className={styles.back}>
              ← All services
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
