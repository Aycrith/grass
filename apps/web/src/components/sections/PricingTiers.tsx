'use client';

/**
 * PricingTiers — three-row pricing card with featured middle.
 *
 * Reads `lib/content.ts → pricingHeader` for section copy
 * (eyebrow, heading, subhead, featured ribbon, CTA label) and
 * `lib/content.ts → pricingTiers` for tier data. Featured tier
 * lifts and wears a sun ribbon. Cards fade-up stagger on enter;
 * no number animation (we want the numbers to be exactly what
 * we billed the customer — animated count-up reads dishonest).
 */

import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { StaggerGroup } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { Button, Illustration } from '@/components/ui';
import { cn } from '@/lib/cn';
import { pricingHeader, pricingTiers } from '@/lib/content';

import styles from './PricingTiers.module.css';

interface PricingTiersProps {
  className?: string;
}

export function PricingTiers({ className }: PricingTiersProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <header className={styles.header}>
          <Eyebrow tone="default" dot className={styles.headerEyebrow}>
            {pricingHeader.eyebrow}
          </Eyebrow>
          <h2 className={styles.headerHeading}>{pricingHeader.heading}</h2>
          <p className={styles.headerSub}>{pricingHeader.subhead}</p>
        </header>

        {/* WP15 — sun-color rule + pinellas-palm ornament between the
         * header and the tier cards. Brand-anchors the all-type
         * pricing block with editorial polish. */}
        <div className={styles.headerOrnament} aria-hidden="true">
          <span className={styles.headerOrnamentRule} />
          <Illustration
            src="/illustrations/pinellas-palm.svg"
            alt=""
            width={120}
            height={80}
            className={styles.headerOrnamentMark}
          />
          <span className={styles.headerOrnamentRule} />
        </div>

        <StaggerGroup as="div" className={styles.grid} childDelay={0.1}>
          {pricingTiers.map((tier) => (
            <div key={tier.title} className={cn(styles.card, tier.featured && styles.cardFeatured)}>
              {tier.featured ? (
                <span className={styles.ribbon} aria-hidden="true">
                  {pricingHeader.ribbon}
                </span>
              ) : null}
              <p className={styles.eyebrow}>{tier.eyebrow}</p>
              <h3 className={styles.title}>{tier.title}</h3>
              <p className={styles.price}>
                {tier.price}
                <span className={styles.priceCadence}> · {tier.cadence}</span>
              </p>
              <p className={styles.body}>{tier.body}</p>
              <Button
                as="link"
                href="/quote"
                variant={tier.featured ? 'sun' : 'primary'}
                size="md"
                iconRight={<ArrowRight size={16} aria-hidden="true" />}
              >
                {pricingHeader.ctaLabel}
              </Button>
            </div>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
