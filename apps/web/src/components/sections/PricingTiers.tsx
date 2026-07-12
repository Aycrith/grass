'use client';

/**
 * PricingTiers — three-row pricing card with featured middle.
 *
 * Reads `lib/content.ts → pricingTiers`. Featured tier lifts and
 * wears a sun ribbon. Cards fade-up stagger on enter; no number
 * animation (we want the numbers to be exactly what we billed
 * the customer — animated count-up reads dishonest).
 */

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { StaggerGroup } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { pricingTiers } from '@/lib/content';

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
            04 — Pricing
          </Eyebrow>
          <h2 className={styles.headerHeading}>What it costs.</h2>
          <p className={styles.headerSub}>
            Floor pricing, per visit or per project. Most lawns fall inside the floor; bigger yards,
            slopes, and gated back-fences bump the price. No subscription, no contract, no surprise
            fees.
          </p>
        </header>

        <StaggerGroup as="div" className={styles.grid} childDelay={0.1}>
          {pricingTiers.map((tier) => (
            <div key={tier.title} className={cn(styles.card, tier.featured && styles.cardFeatured)}>
              {tier.featured ? (
                <span className={styles.ribbon} aria-hidden="true">
                  Most booked
                </span>
              ) : null}
              <p className={styles.eyebrow}>{tier.eyebrow}</p>
              <h3 className={styles.title}>{tier.title}</h3>
              <p className={styles.price}>
                {tier.price}
                <span className={styles.priceCadence}> · {tier.cadence}</span>
              </p>
              <p className={styles.body}>{tier.body}</p>
              <Link href="/quote" className={styles.cta}>
                Get a quote <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
