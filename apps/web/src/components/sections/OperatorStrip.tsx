'use client';

/**
 * OperatorStrip — Mission 1 "Hi, I'm the guy mowing your
 * neighbor's yard" first-person block.
 *
 * Sits between hero and service bento on the homepage. Shows the
 * operator portrait, a 2-3 sentence bio, and a horizontal "tools
 * I run" metabar in place of the legacy 2×2 webp tile grid.
 *
 * The metabar trades webp tile micro-photography for typographic
 * clarity — four italic-Fraunces model names with sun-colored
 * dots in a clay-bordered column, mirroring the OperatorNote
 * "clay rule + portrait" idiom. Reads as operator voice more
 * directly than tiny webps did, and removes the only place on
 * the page that rendered the equipment webp slots.
 *
 * D-0029 — fold the two strongest "by the numbers" stats from
 * the demoted ServiceAreaStats panel into the bio card. The full
 * 4-stat panel was demoted from `/` (it sat at fold 3-4 and
 * competed with the coverage check for attention); the two
 * stats that read as "we know what we're doing" (vs.
 * "look at our numbers") are kept inline in the bio as a
 * single quiet row above the signature mark. The numbers
 * stay specific (47 yards / 18h) and inherit the operator's
 * voice instead of feeling like a marketing panel.
 *
 * D-0030 (Wave C of three sequential design changes) — visual
 * system hygiene pass:
 *   - Removed ParallaxImage wrapper around the portrait. D-0030
 *     gates motion to above-the-fold (Hero + Coverage); the
 *     operator strip is the first section below the fold, so
 *     the portrait now renders as a static, full-bleed image.
 *     The portrait keeps its D-0020 corner stamp; the corner
 *     stamp is a "corner ornament" (allowed) not "scroll-driven
 *     motion" (gated).
 *   - The image now uses object-position so the head sits
 *     inside the panel without a 6% bleed; the old bleed was
 *     sized to the ParallaxImage motion range, not the static
 *     layout.
 *
 * D-0039 — scroll-driven reveal pass: the portrait, bio, and
 * equipment metabar now fade up with a staggered cascade when
 * the section enters the viewport. This is an intentional
 * relaxation of the D-0030 below-the-fold motion gate; the
 * reveals are subtle (24px fade-up, once only) and respect
 * prefers-reduced-motion via the FadeUp component.
 *
 * Copy flows from `lib/content.ts → operator` so the steward
 * can edit it without touching this component.
 *
 * Imagery: SVG placeholder. Steward swaps in real .webp at the
 * same paths. Until then, components degrade honestly.
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Container, Section } from '@/components/site';
import { Illustration } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { operator } from '@/lib/content';

import styles from './OperatorStrip.module.css';

interface OperatorStripProps {
  className?: string;
}

// Stagger step for the three-column scroll reveal (portrait → bio → equipment).
const STAGGER_STEP_S = 0.12;

/**
 * D-0053 — OperatorStrip ambient painted-palms background.
 *
 * The 6 painted VEO `palms-01..06.webp` frames (full Florida scenes
 * with house + sun + palms + bird bath) cycle at 10s/frame behind
 * the operator bio. The frames are NEAR-IDENTICAL painted scenes
 * with subtle differences (sun rays shift, clouds drift, grass
 * blade tip wobbles) — cycling them at 10s/frame with
 * `steps(1, end)` produces a meditative hand-painted stillness.
 *
 * The painted scenes are CSS-bleached down to 7% opacity with
 * `mix-blend-mode: multiply` so they integrate with the cream
 * `--ll-shell` backdrop without overwhelming the bio content.
 * The portrait column, bio, and equipment column all sit on top
 * (z >= 1) of the ambient stage (z = 0). The painted content
 * reads as "the operator's world" without competing for the
 * reader's attention.
 *
 * The 6-frame CSS-step pattern is the same one SecondScene uses
 * for its scene2-*.webp cycle (D-0049). Both cycles share the
 * `sceneCycle` cadence + `prefers-reduced-motion` lock-to-frame-1
 * pattern. The D-0049 lesson — painted VEO is fine as a full-
 * bleed or subtle backdrop but clashes with the hand-authored
 * SVG cartoon when both are in the same panel at the same time
 * — is honored here: the painted palms are SUBTLE (7% opacity)
 * and the bio content is TEXT (not hand-authored SVG cartoon).
 */
const PALMS_FRAMES = [
  '/hero/layers/v2/palms-01.webp',
  '/hero/layers/v2/palms-02.webp',
  '/hero/layers/v2/palms-03.webp',
  '/hero/layers/v2/palms-04.webp',
  '/hero/layers/v2/palms-05.webp',
  '/hero/layers/v2/palms-06.webp',
] as const;

export function OperatorStrip({ className }: OperatorStripProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)} data-test-section="operator-strip">
      {/* D-0053 — ambient painted-palms background. 6-frame CSS-step
       * cycle at 7% opacity with mix-blend-mode: multiply, sitting
       * behind the operator bio column. See PALMS_FRAMES doc above
       * for the why-painted-7%-and-not-100% rationale. */}
      <div className={styles.ambientPalms} aria-hidden="true">
        {PALMS_FRAMES.map((src, i) => (
          <div
            key={src}
            className={`${styles.ambientPalmsFrame} ${styles[`ambientPalmsFrame${i + 1}`]}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <Container>
        <div className={styles.inner}>
          <FadeUp as="div" className={styles.portrait} delay={STAGGER_STEP_S * 0}>
            <div className={styles.portraitInner}>
              <Image
                src="/operator/portrait.webp"
                alt={`Portrait of ${operator.name}, Largo Lawn operator`}
                fill
                sizes="(max-width: 980px) 100vw, 320px"
              />
              {/* D-0020 — hand-painted corner stamp. Sits at the
               * top-right of the portrait like a postcard stamp,
               * adding a storybook editorial touch to the operator
               * section. Hand-authored SVG with intentional
               * stroke weight (2.5px in 80x80 viewBox, renders at
               * 48px so the rays stay crisp). */}
              <span className={styles.cornerStamp} aria-hidden="true">
                <Image
                  src="/illustrations/corner-stamp.svg"
                  alt=""
                  width={80}
                  height={80}
                  className={styles.cornerStampImage}
                />
              </span>
            </div>
          </FadeUp>

          <FadeUp as="div" className={styles.bio} delay={STAGGER_STEP_S * 1}>
            <h2 className={styles.bioHeading}>
              Hi, I&apos;m <em>{operator.name}</em>.
            </h2>
            <span className={styles.bioMeta}>
              {operator.yearsMowing} years cutting grass in 33771
            </span>
            <p className={styles.bioBody}>{operator.bio}</p>

            {/* D-0029 — inline "we know what we're doing" stat row
             * folded from the demoted ServiceAreaStats panel. The
             * bio is the operator's voice section, so specific
             * numbers ("47 yards on the route" + "18h median quote
             * turnaround" + "6 ZIPs on the route") reinforce that
             * voice without a separate stats section. 2026-07-26:
             * added the 3rd stat ("6 ZIPs") so the row reads as a
             * full triptych instead of an unbalanced 2-up — the
             * 6-ZIP count anchors the operator's reach in the same
             * fact the user will see on /areas and in the homepage
             * coverage-check. Quiet typographic row above the
             * signature mark; no chart, no card, no CTA. */}
            <ul className={styles.bioStatRow} aria-label="Operator stats">
              <li className={styles.bioStat}>
                <span className={styles.bioStatValue}>47</span>
                <span className={styles.bioStatLabel}>Yards on the weekly route</span>
              </li>
              <li className={styles.bioStat}>
                <span className={styles.bioStatValue}>18 h</span>
                <span className={styles.bioStatLabel}>Median quote turnaround</span>
              </li>
              <li className={styles.bioStat}>
                <span className={styles.bioStatValue}>{BUSINESS.service_area_zips.length}</span>
                <span className={styles.bioStatLabel}>ZIPs on the route</span>
              </li>
            </ul>

            {/* WP15 — editorial "operator signature mark" closing the bio.
             * A sun-color rule + centered pinellas-palm + city caption,
             * reading as the operator's signed mark. Florida identity
             * is the operator identity. */}
            <div className={styles.bioSignature} aria-hidden="true">
              <span className={styles.bioSignatureRule} />
              <Illustration
                src="/illustrations/pinellas-palm-v3-72.webp"
                alt=""
                width={72}
                height={72}
                className={styles.bioSignatureMark}
              />
              <p className={styles.bioSignatureCity}>Largo · Florida</p>
            </div>
          </FadeUp>

          <FadeUp as="div" className={styles.equipment} delay={STAGGER_STEP_S * 2}>
            <p className={styles.equipmentTitle}>What I run</p>
            <ul className={styles.toolBar} aria-label="Equipment list">
              {operator.equipment.map((item) => (
                <li key={item.name} className={styles.tool}>
                  <span className={styles.toolModel}>{item.name}</span>
                  <span className={styles.toolUse}>{item.use}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </Container>
    </Section>
  );
}
