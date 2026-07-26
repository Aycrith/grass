'use client';

/**
 * PricingTiers — three-row pricing card with featured middle.
 *
 * Reads `lib/content.ts → pricingHeader` for section copy
 * (heading, subhead, featured ribbon, CTA label) and
 * `lib/content.ts → pricingTiers` for tier data. Featured tier
 * lifts and wears a sun ribbon. No number animation (we want
 * the numbers to be exactly what we billed the customer —
 * animated count-up reads dishonest).
 *
 * D-0030 (Wave C of three sequential design changes) — visual
 * system hygiene pass:
 *   - Eyebrow removed. Per the ≤3-eyebrow rule, only Hero /
 *     Coverage / FinalCTA get eyebrows. The "Pricing" label
 *     was redundant with the heading "What it costs."
 *   - CTA hierarchy fixed. Featured card keeps the sun
 *     "Get a free quote" (the page's primary conversion).
 *     Non-anchor cards drop from "primary" (dark-green pill)
 *     to "outline" + no iconRight — outline is the spec's
 *     secondary CTA treatment, and dropping the arrow on
 *     non-anchor cards removes the "competing arrow" issue
 *     that was making the section look like three equal
 *     CTAs rather than one anchor + two supporting tiers.
 *   - StaggerGroup wrapper removed (below-fold = static per
 *     D-0030 motion gating). The grid renders flat on first
 *     paint, no fade-up cascade.
 */

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Container, Section } from '@/components/site';
import { Button, Illustration } from '@/components/ui';
import { cn } from '@/lib/cn';
import { pricingHeader, pricingTiers } from '@/lib/content';

import styles from './PricingTiers.module.css';

const STAGGER_STEP_S = 0.08;
const STAGGER_INITIAL_S = 0.1;

interface PricingTiersProps {
  className?: string;
}

type PricingTier = (typeof pricingTiers)[number];

interface PricingTierCardProps {
  tier: PricingTier;
  delay?: number;
}

function PricingTierCard({ tier, delay = 0 }: PricingTierCardProps): ReactNode {
  return (
    <FadeUp
      as="div"
      className={cn(styles.card, tier.featured && styles.cardFeatured)}
      delay={delay}
    >
      {tier.featured ? (
        <>
          <span className={styles.ribbon} aria-hidden="true">
            {pricingHeader.ribbon}
          </span>
          {/* D-0020 — hand-painted corner stamp on the anchor (Mowing) card.
           * Top-left of the card, opposite the ribbon, so the two marks
           * bracket the card. Sized larger than the OperatorStrip portrait
           * version (64px vs 48px) since the card is the page's primary
           * conversion touchpoint. No background panel — the deep-green
           * card surface carries the gold rays directly. */}
          <span className={styles.cardCornerStamp} aria-hidden="true">
            <Image
              src="/illustrations/corner-stamp.svg"
              alt=""
              width={80}
              height={80}
              className={styles.cardCornerStampImage}
            />
          </span>
        </>
      ) : null}
      <h3 className={styles.title}>{tier.title}</h3>
      <p className={styles.price}>
        {tier.price}
        <span className={styles.priceCadence}> · {tier.cadence}</span>
      </p>
      <p className={styles.body}>{tier.body}</p>
      {/* D-0030 — CTA hierarchy:
       *   featured:  sun (the page's only sun-filled primary,
       *              "Get a free quote" → /quote)
       *   non-feat:  outline (the spec's secondary treatment),
       *              same label, no iconRight (kills the
       *              "competing arrow" against the anchor). */}
      <Button
        as="link"
        href="/quote"
        variant={tier.featured ? 'sun' : 'outline'}
        size="md"
        iconRight={
          tier.featured ? <ArrowRight size={16} aria-hidden="true" /> : undefined
        }
      >
        {pricingHeader.ctaLabel}
      </Button>
    </FadeUp>
  );
}

export function PricingTiers({ className }: PricingTiersProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)} data-test-section="pricing-tiers">
      <Container>
        <FadeUp as="header" className={styles.header}>
          <h2 className={styles.headerHeading}>{pricingHeader.heading}</h2>
          <p className={styles.headerSub}>{pricingHeader.subhead}</p>
        </FadeUp>

        {/* WP15 — sun-color rule + pinellas-palm ornament between the
         * header and the tier cards. Brand-anchors the all-type
         * pricing block with editorial polish. */}
        <FadeUp as="div" className={styles.headerOrnament} aria-hidden="true" delay={0.05}>
          <span className={styles.headerOrnamentRule} />
          <Illustration
            src="/illustrations/pinellas-palm-v3-120.webp"
            alt=""
            width={120}
            height={120}
            className={styles.headerOrnamentMark}
          />
          <span className={styles.headerOrnamentRule} />
        </FadeUp>

        <div className={styles.grid}>
          {pricingTiers.map((tier, i) => (
            <PricingTierCard
              key={tier.title}
              tier={tier}
              delay={STAGGER_INITIAL_S + i * STAGGER_STEP_S}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
