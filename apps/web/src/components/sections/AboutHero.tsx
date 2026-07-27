'use client';

/**
 * AboutHero — `/about` page opener.
 *
 * Full editorial split layout:
 *   - Left: operator portrait (full-bleed, square crop)
 *   - Right: eyebrow + headline + tagline + pull-quote + CTA
 *
 * On mobile: portrait stacks above the text.
 *
 * Reads from `lib/content.ts → aboutPage` + `operator` for copy.
 * Uses the new portrait.webp (57KB, real AI-generated operator photo).
 *
 * D-000x (2026-07-26): Replaced plain text-only hero with editorial
 * split layout featuring the operator portrait.
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Container, Eyebrow } from '@/components/site';
import { Button } from '@/components/ui';
import { operator } from '@/lib/content';
import { cn } from '@/lib/cn';

import styles from './AboutHero.module.css';

interface AboutHeroProps {
  className?: string;
}

export function AboutHero({ className }: AboutHeroProps): ReactNode {
  return (
    <section className={cn(styles.root, className)} data-test-section="about-hero">
      {/* Left: operator portrait — full-bleed, square crop */}
      <div className={styles.portraitCol}>
        <div className={styles.portraitWrap}>
          <Image
            src="/operator/portrait.webp"
            alt={`Portrait of ${operator.name}, the operator behind Largo Lawn`}
            fill
            sizes="(max-width: 980px) 100vw, 50vw"
            className={styles.portraitImg}
            priority
          />
          {/* Corner stamp — same idiom as OperatorStrip */}
          <div className={styles.cornerStamp} aria-hidden="true">
            <Image
              src="/illustrations/corner-stamp.svg"
              alt=""
              width={80}
              height={80}
              className={styles.cornerStampImg}
            />
          </div>
        </div>
      </div>

      {/* Right: editorial copy */}
      <div className={styles.copyCol}>
        <Container className={styles.copyInner}>
          <FadeUp>
            <Eyebrow tone="default" className={styles.eyebrow}>
              About
            </Eyebrow>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className={styles.title}>
              The same guy.
              <br />
              Six years.
            </h1>
          </FadeUp>

          <FadeUp delay={0.16}>
            <p className={styles.tagline}>
              Solo-founder lawn care in Largo, FL. Every job is performed by the same person
              who quoted it. No crew swap, no franchise markup.
            </p>
          </FadeUp>

          {/* Pull-quote — operator voice */}
          <FadeUp delay={0.24}>
            <blockquote className={styles.pullQuote}>
              <p>
                &ldquo;Most landscaping companies grow fast, hire subcontractors, and lose quality
                control. We don&apos;t.&rdquo;
              </p>
            </blockquote>
          </FadeUp>

          {/* Inline stat row */}
          <FadeUp delay={0.32}>
            <ul className={styles.statRow} aria-label="Operator credentials">
              <li className={styles.stat}>
                <span className={styles.statValue}>{operator.yearsMowing} yrs</span>
                <span className={styles.statLabel}>Cutting in 33771</span>
              </li>
              <li className={styles.stat}>
                <span className={styles.statValue}>Solo</span>
                <span className={styles.statLabel}>No crew swap</span>
              </li>
              <li className={styles.stat}>
                <span className={styles.statValue}>$1M</span>
                <span className={styles.statLabel}>Liability insured</span>
              </li>
            </ul>
          </FadeUp>

          {/* CTA */}
          <FadeUp delay={0.4}>
            <div className={styles.actions}>
              <Button as="link" href="/quote" variant="primary" size="lg">
                Get a free quote
              </Button>
              <Button as="link" href="/contact" variant="outline" size="lg">
                Ask a question
              </Button>
            </div>
          </FadeUp>
        </Container>
      </div>
    </section>
  );
}
