/**
 * HeroCinematic — full-bleed landing-page hero.
 *
 * D-0010: removed the `'use client'` directive. The static text
 * (eyebrow, subhead, buttons, trust row) now renders server-side
 * with zero JS required for first paint. The motion parts
 * (WordReveal, ParallaxImage) are imported as implicit client
 * boundaries — Next.js treats them as client components and code-
 * splits them out. The 1.5-3s main-thread JS evaluation that was
 * blocking the LCP element paint is now deferred to a separate
 * bundle that loads after the SSR'd text is already visible.
 *
 * Layout: asymmetric split — copy left, painterly golden-hour Florida
 * ranch-house image right (mobile stacks image-on-top). Choreography:
 *   - On mount: headline reveals word-by-word via clip-path (WordReveal).
 *   - On mount: subheadline + actions fade-up (FadeUp).
 *   - On scroll: the right-column image parallaxes at 0.4× velocity
 *     (ParallaxImage).
 *
 * Reduced motion: parallax disabled; reveal collapses to instant via
 * `useReducedMotion` inside WordReveal + the spring in ParallaxImage.
 * Coarse pointer: parallax disabled by ParallaxImage's pointer check.
 *
 * WP49 — replaced the WP19-WP48 layered SVG illustration composition
 * (palm + mower + grass SVGs on a deep-green stage) with a single
 * painterly SDXL-generated image (apps/web/public/hero/mobile.webp,
 * 1200×1500, golden-hour Florida ranch house at 33771). The brief was
 * `apps/comfyui/prompts/hero-v2.md`, the governance decision was
 * `governance/decisions/0008-hero-v2-asset-pack.md`, and the keepers
 * were curated at `apps/comfyui/outputs/largo-lawn/hero-v2/curation.md`.
 *
 * Why this swap: the v1 layered SVG composition read as "three
 * independent cartoons" (stick-palm + fuzzy-mower + sparse-grass
 * each on their own clock) and the v2 SDXL attempt to upgrade the
 * layers hit LoRA bias on the mower (LoRA pulled tractors) and grass
 * (LoRA pulled purple irises). The mobile scene was a clean SDXL
 * keeper at 24/30 (per D-0008 §2 rubric) and ships as a single
 * static image — better LCP, no cohesion risk, no LoRA bias issues.
 *
 * The morning halo glow, corner stamp, caption pill, and callout pill
 * are all preserved as editorial framing overlays on the new image.
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

import { Eyebrow } from '@/components/site';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import { hero } from '@/lib/content';

import { ParallaxImage, WordReveal } from '@/components/motion';

import styles from './HeroCinematic.module.css';

interface HeroCinematicProps {
  className?: string;
  /**
   * Section id. Defaults to "hero" for production use; the visual-test
   * page passes "hero-cinematic" so both hero variants can co-exist
   * on the same /visual-test page without duplicate-id warnings.
   */
  id?: string;
}

export function HeroCinematic({ className, id = 'hero' }: HeroCinematicProps): ReactNode {
  const { composition } = hero;
  return (
    <section className={cn(styles.root, className)} aria-label="Largo Lawn introduction" id={id} data-test-section="hero-cinematic">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.copy}>
            <Eyebrow tone="default" className={styles.eyebrow}>
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

            <div className={styles.actions}>
              <Button as="link" href={hero.primaryCta.href} variant="sun" size="lg">
                {hero.primaryCta.label}
              </Button>
              <Button as="a" href={hero.secondaryCta.href} variant="outline" size="lg">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>

          <ParallaxImage
            offset={60}
            className={styles.media}
            overlay={
              <>
                <a
                  href={composition.calloutHref}
                  className={styles.callout}
                  aria-label={`${composition.callout}: open area page`}
                >
                  {composition.callout}
                </a>
                {/* D-0023 — hand-drawn "EST · 2026 · LARGO · FL" passport
                 * stamp at the bottom-right of the hero image. Pairs with
                 * the callout pill at the bottom-left so the two bottom
                 * marks bracket the photo like a stamped postcard. Tilted
                 * -8° via CSS for the hand-pressed feel. */}
                <span className={styles.passportStamp} aria-hidden="true">
                  <Image
                    src="/illustrations/passport-stamp.svg"
                    alt=""
                    width={80}
                    height={80}
                    className={styles.passportStampImage}
                  />
                </span>
              </>
            }
          >
            {/* WP49 / WP50 — v2 hero asset is the single SDXL-generated
             * painterly image. Originally paired with an AVIF <picture>
             * source for a 50% file-size reduction (mobile.avif 93KB vs
             * mobile.webp 186KB), but Lighthouse headless Chrome's
             * software AVIF decoder eats the transfer savings with
             * extra decode time (mobile LCP 3.8s → 4.3s, TBT 240ms →
             * 280ms; desktop LCP 0.7s → 0.9s). The AVIF files are
             * retained at apps/web/public/hero/{mobile,desktop}.avif
             * as documented artifacts (see audit/wp49-lighthouse/
             * SUMMARY-production.md §WP50) for future use when the
             * decoder landscape shifts. The webp via next/image with
             * `priority` is the active path. */}
            <Image
              src="/hero/mobile.webp"
              alt="A freshly mowed St Augustine lawn in front of a Pinellas ranch home at golden hour"
              width={1200}
              height={1500}
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.image}
            />
          </ParallaxImage>
        </div>
      </div>
    </section>
  );
}
