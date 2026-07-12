'use client';

/**
 * HeroCinematic — full-bleed landing-page hero.
 *
 * Layout: asymmetric split — copy left, layered image right (mobile stacks).
 * Choreography:
 *   - On mount: headline reveals word-by-word via clip-path (WordReveal).
 *   - On mount: subheadline + actions fade-up (StaggerGroup).
 *   - On scroll: image parallax translates up at 0.4× velocity (ParallaxImage).
 *
 * Reduced motion: parallax disabled; reveal collapses to instant via
 * `useReducedMotion` inside WordReveal + the spring in ParallaxImage.
 * Coarse pointer: parallax disabled by ParallaxImage's pointer check.
 *
 * Imagery: SVG placeholder (`/hero/desktop.svg` + `/hero/mobile.svg`).
 * Steward swaps in real yard-at-golden-hour .webp at the same paths.
 */

import { Clock, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';

import { Eyebrow } from '@/components/site';
import { Button } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';

import { ParallaxImage, WordReveal } from '@/components/motion';

import styles from './HeroCinematic.module.css';

interface HeroCinematicProps {
  className?: string;
}

export function HeroCinematic({ className }: HeroCinematicProps): ReactNode {
  return (
    <section className={cn(styles.root, className)} aria-label="Largo Lawn introduction">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.copy}>
            <Eyebrow tone="default" dot className={styles.eyebrow}>
              01 — Lawn care in 33771
            </Eyebrow>

            <h1 className={styles.headline}>
              <span className={styles.headlineLine}>
                <WordReveal text="Your neighbor's" />
              </span>
              <span className={styles.headlineLine}>
                <WordReveal text="lawn mower." />
              </span>
            </h1>

            <p className={styles.subhead}>
              Local, solo-operator lawn care in Largo and the five adjacent Pinellas ZIPs. Free
              quotes within 24 hours. No contract, no franchise markup.
            </p>

            <div className={styles.rule} aria-hidden="true" />

            <div className={styles.actions}>
              <Button as="link" href="/quote" variant="sun" size="lg">
                Get a free quote
              </Button>
              <Button
                as="a"
                href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, '')}`}
                variant="outline"
                size="lg"
              >
                Call {BUSINESS.phone}
              </Button>
            </div>

            <div className={styles.trustRow}>
              <span className={styles.trustItem}>
                <MapPin size={16} aria-hidden="true" />
                Serving {BUSINESS.service_area_zips.length} Pinellas ZIPs
              </span>
              <span className={styles.trustItem}>
                <Clock size={16} aria-hidden="true" />
                24-hour quote turnaround
              </span>
              <span className={styles.trustItem}>
                <Phone size={16} aria-hidden="true" />
                Reply by phone, not a portal
              </span>
            </div>
          </div>

          <ParallaxImage offset={60} className={styles.media}>
            <div className={styles.mediaInner}>
              <picture>
                <source media="(max-width: 900px)" srcSet="/hero/mobile.svg" />
                <Image
                  src="/hero/desktop.svg"
                  alt="Freshly mowed lawn in 33771 at golden hour"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </picture>
            </div>
          </ParallaxImage>
        </div>
      </div>
    </section>
  );
}
