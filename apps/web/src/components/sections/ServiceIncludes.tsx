'use client';

/**
 * ServiceIncludes — "What's included" section on `/services/[slug]`.
 *
 * Two-column layout: copy column on the left (heading + intro
 * line + 5–8 bullet items), pricing card on the right (Fraunces
 * pricing line + final-price-disclaimer + CTA buttons).
 *
 * On mobile (≤980px) the two columns stack — copy first, pricing
 * card below as a single dark band.
 *
 * Bullets read from `serviceDetail[slug].bullets` and pricing
 * reads from `serviceDetail[slug].pricing`. The pricing card is
 * the only place the per-visit / per-cubic-yard / per-linear-foot
 * prices appear on the customer-facing site.
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Container, Section } from '@/components/site';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import { type ServiceKey, serviceDetail } from '@/lib/content';

import styles from './ServiceIncludes.module.css';

interface ServiceIncludesProps {
  slug: ServiceKey;
  className?: string | undefined;
}

export function ServiceIncludes({ slug, className }: ServiceIncludesProps): ReactNode {
  const detail = serviceDetail[slug];
  return (
    <Section className={cn(styles.root, className)}>
      <Container>
        <div className={styles.grid}>
          <FadeUp className={styles.copy}>
            <span className={styles.eyebrow}>What&apos;s included</span>
            <h2 className={styles.heading}>Every visit, every time.</h2>
            <ul className={styles.bullets}>
              {detail.bullets.map((b, i) => (
                <li key={`${detail.slug}-bullet-${i}`} className={styles.bullet}>
                  <span className={styles.bulletDot} aria-hidden="true">
                    ·
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </FadeUp>

          <FadeUp className={styles.pricing} delay={0.08}>
            <span className={styles.pricingEyebrow}>Pricing</span>
            <p className={styles.pricingLine}>{detail.pricing}</p>
            <p className={styles.pricingNote}>
              Final price depends on lot size, frequency, and scope. Get a free quote in 24 hours.
            </p>
            <div className={styles.actions}>
              <Button as="link" href="/quote" variant="primary" size="md">
                Get a free quote
              </Button>
              <Button as="link" href="/contact" variant="ghost" size="md">
                Ask a question
              </Button>
            </div>
          </FadeUp>
        </div>
      </Container>
    </Section>
  );
}
