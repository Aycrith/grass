'use client';

/**
 * HeroCinematic — full-bleed landing-page hero.
 *
 * Layout: asymmetric split — copy left, layered illustrated composition right
 * (mobile stacks). Choreography:
 *   - On mount: headline reveals word-by-word via clip-path (WordReveal).
 *   - On mount: subheadline + actions fade-up (StaggerGroup).
 *   - On mount: SVG composition layers fade-up in stagger (sun → palm →
 *     mower → grass → callout).
 *   - On scroll: whole stage translates Y at 0.4× velocity (ParallaxImage).
 *
 * Reduced motion: parallax disabled; reveal collapses to instant via
 * `useReducedMotion` inside WordReveal + the spring in ParallaxImage.
 * Coarse pointer: parallax disabled by ParallaxImage's pointer check.
 *
 * WP19 — replaced the photo right column (which was failing to render in
 * <picture>+next/image setups because <picture> doesn't forward <source>
 * rules to next/image children — leaving a dark-green `.media` placeholder
 * visible) with a layered SVG illustration composition. Every layer is an
 * asset already shipped in WP11 (/illustrations/*), so the hero renders
 * in any condition (slow networks, throttled modes, image-disabled users,
 * browsers that reject next/image+<picture>). The deep-green `.media`
 * stage is now intentional brand surface, not a "placeholder behind the
 * photograph" — it warms with a top-right radial gradient.
 *
 * Composition layers (back to front): pinellas-palm (with its own sun
 * baked in) → mower-side-profile → grass-blade-cluster-xl → 33771 callout
 * pill. Each animates in on mount and contributes a subtle ambient loop
 * on its own. Reduced-motion collapses every loop to instant via
 * `@media (prefers-reduced-motion: no-preference)`.
 *
 * WP21 — removed the inline sun-arc SVG (Layer 1) because it competed
 * with the palm SVG's built-in sun, creating "two suns" incoherence
 * above-the-fold. The palm's own sun is now the single sun source; the
 * morning halo glow (WP20) carries the warm golden-hour feeling.
 * "01" corner stamp moved to top-LEFT so it no longer overlaps the
 * palm's sun in the upper-right.
 */

import { Clock, MapPin, Phone } from 'lucide-react';
import type { ReactNode } from 'react';

import { Eyebrow } from '@/components/site';
import { Button, Illustration } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { hero } from '@/lib/content';

import { ParallaxImage, StaggerGroup, WordReveal } from '@/components/motion';

import styles from './HeroCinematic.module.css';

interface HeroCinematicProps {
  className?: string;
}

export function HeroCinematic({ className }: HeroCinematicProps): ReactNode {
  const { composition } = hero;
  return (
    <section className={cn(styles.root, className)} aria-label="Largo Lawn introduction">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.copy}>
            <Eyebrow tone="default" dot className={styles.eyebrow}>
              {hero.eyebrow}
            </Eyebrow>

            <h1 className={styles.headline}>
              <span className={styles.headlineLine}>
                <WordReveal text="Your neighbor's" />
              </span>
              <span className={styles.headlineLine}>
                <WordReveal text="lawn mower." />
              </span>
            </h1>

            <p className={styles.subhead}>{hero.subhead}</p>

            <div className={styles.rule} aria-hidden="true" />

            <div className={styles.actions}>
              <Button as="link" href={hero.primaryCta.href} variant="sun" size="lg">
                {hero.primaryCta.label}
              </Button>
              <Button as="a" href={hero.secondaryCta.href} variant="outline" size="lg">
                {hero.secondaryCta.label}
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

          <ParallaxImage
            offset={60}
            className={styles.media}
            overlay={
              <>
                {/* WP15 — editorial framing. Rendered via the overlay slot so
                  * they position against the panel (height = 4:5 of the panel
                  * width) rather than against the parallaxing motion.div
                  * which has `height: 0` and a transform creating its own
                  * positioning context. The callout pill is also in the
                  * overlay so its click target stays anchored to the panel
                  * bottom-left even while the palm/sun parallax scrolls. */}
                <span className={styles.cornerStamp} aria-hidden="true">
                  01
                </span>
                <a
                  href={composition.calloutHref}
                  className={styles.callout}
                  aria-label={`${composition.callout} — open area page`}
                >
                  <span className={styles.calloutDot} aria-hidden="true" />
                  {composition.callout}
                </a>
                <span className={styles.caption} aria-hidden="true">
                  <span className={styles.captionMark}>“</span>
                  <span className={styles.captionText}>Pinellas porch — golden hour</span>
                </span>
              </>
            }
          >
            {/* WP20 — morning warmth halo. Static layer that sits behind the
              * StaggerGroup so the SVG layers paint on top of it. mix-blend-mode:
              * screen lifts the deep-green stage toward sun-color around the
              * palm's position, carrying the "golden hour" caption into the
              * visual rather than only being stated on a pill. */}
            <div className={styles.glow} aria-hidden="true" />
            <StaggerGroup
              as="div"
              className={styles.stage}
              childDelay={0.14}
              initialDelay={0.05}
            >
              {/* WP39 — ground anchor band beneath the grass. Static, fades
                  from transparent to deep palm-shadow so the blades read as
                  rooted in earth rather than floating. Sits inside the
                  StaggerGroup so it shares the scene-level pointer-events
                  semantics, but no fade-up is applied (its z-index is
                  below the grass layer). */}
              <div className={styles.ground} aria-hidden="true" />

              {/* Layer 1 — pinellas-palm. The palm SVG carries its own sun
                  baked in (two stacked circles at cx=380 cy=140 with rays),
                  so this is the single sun source for the composition. */}
              <div className={styles.palmWrap}>
                <Illustration
                  src="/illustrations/pinellas-palm.svg"
                  alt=""
                  width={300}
                  height={200}
                  className={styles.palm}
                />
              </div>

              {/* Layer 2 — solo mower (small horizontal drift). */}
              <Illustration
                src="/illustrations/mower-side-profile.svg"
                alt=""
                width={140}
                height={93}
                className={styles.mower}
              />

              {/* Layer 3 — foreground grass (sway with per-blade delays). */}
              <Illustration
                src="/illustrations/grass-blade-cluster-xl.svg"
                alt=""
                width={260}
                height={173}
                className={styles.grass}
              />
            </StaggerGroup>
          </ParallaxImage>
        </div>
      </div>
    </section>
  );
}