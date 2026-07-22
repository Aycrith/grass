/**
 * HeroStorybookLayer - the animated SVG landscape that opens the hero.
 *
 * Hand-authored Florida scenery: sun + clouds + distant palms + swaying
 * ranch palms + foreground grass tufts + a small lawn mower that drives
 * across the scene as the visitor scrolls. The storybook layer sits on
 * top of the real photograph and cross-fades into it across the
 * [0.10, 0.40] scroll window, so the visitor watches the cartoon
 * world literally dissolve into the working operation.
 *
 * This file holds the SVG primitives only. The unified hero composition
 * (stacking order, scroll-driven cross-fade, mobile collapse) lives in
 * HeroFieldTelemetry.tsx.
 *
 * Brand fidelity:
 *   - cream / palm green / sun / clay palette (locked CSS variables)
 *   - no fake client logos, no fake testimonials
 *   - small lawn mower is the canonical operator iconography
 *
 * Reduced motion: ambient CSS animations (clouds drift, palms sway,
 * wildflowers bloom) collapse to instant via existing @media blocks.
 * The scroll-driven cross-fade and the mower's wheel rotation still
 * run on reduced-motion because they are tied to user scroll, not
 * autonomous animation. The blur+saturate dissolve below is no-op on
 * `collapsed={true}`.
 *
 * D-0043 (cinematic dissolve):
 *   The previous dissolve was a single linear `opacity 1 -> 0` ramp.
 *   That felt jarring because SVG vector graphics (sharp, crisp,
 * fully-saturated edges) cut out hard against the natural edges of
 * the 4K photograph. Two coordinated transforms now apply:
 *   - opacity: [0, 0.10, 0.30, 0.40] -> [1, 1, 0.5, 0]
 *     asymmetric soft-fade; the layer stays full through the first
 *     10% of scroll, then softens quickly through 0.30-0.40.
 *   - filter: blur(0px) saturate(100%) -> blur(14px) saturate(0%)
 *     across [0.10, 0.40]. The vectors soften into a ghost before
 *     vanishing, so the eye reads the dissolve as one world fading
 *     into another rather than a hard layer swap. The blur is light
 *     enough (14px) to avoid a smudgy halo but heavy enough to wash
 *     out the cartoon outline against the photo's natural edges.
 */

import type { MotionValue } from 'framer-motion';
import { motion, useTransform } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

import type { ViewportMotionLayerId } from '@/components/motion';

import styles from './HeroStorybookLayer.module.css';

interface HeroStorybookLayerProps {
  /** 0..1 scroll progress driving the mower + cross-fade. */
  progress: MotionValue<number>;
  /** True on mobile + reduced-motion: skip scroll-scrubbed animations. */
  collapsed?: boolean;
  /** D-0044 — per-layer vertical parallax motion values from useViewportMotion. */
  layerMotion?: Partial<
    Record<ViewportMotionLayerId, { y: MotionValue<number>; x: MotionValue<number> }>
  >;
}

/**
 * Master stack: sky + drifting clouds + 3 parallax layers (far / mid /
 * near) + the moving mower + the scroll hint. The whole composition
 * is wrapped in a single motion.div whose opacity is driven by the
 * hero's scroll progress, so the parent can fade the entire storybook
 * world out as the photo layer fades in.
 */
export function HeroStorybookLayer({
  progress,
  collapsed = false,
  layerMotion,
}: HeroStorybookLayerProps): ReactNode {
  // D-0059 rev3 — TWO-PHASE cross-fade, tightened window. The
  // rev2 two-phase had Phase 1 [0.10, 0.25] opacity 1→0.6 and
  // Phase 2 [0.25, 0.40] opacity 0.6→0 — a 30% scroll band where
  // the storybook stayed at 60-100% opacity for the first 50% of
  // the band. The Phase 1 values were too gentle (only 4px blur,
  // 15% saturate drop) so the cartoon ranch houses / palms / sun
  // were still clearly recognizable as "ghosts" sitting on top of
  // the photo at y=0.20 (73% opacity, 2.67px blur). The visitor
  // saw two houses, two suns, two sets of palms.
  //
  // rev3 cuts the window in half (0.10-0.25 = 15% of scroll) and
  // makes Phase 1 a "smear" rather than a "soft-fade":
  //   Phase 1 (smear)     [0.10, 0.18]: opacity 1 -> 0.4, blur 0 -> 8px,
  //     saturate 100% -> 70%. By the end of Phase 1 the cartoon
  //     is at 40% opacity with 8px blur — the shapes are still
  //     there but they read as "smudged watercolor", not "cartoon
  //     overlay".
  //   Phase 2 (dissolve)  [0.18, 0.25]: opacity 0.4 -> 0, blur 8 -> 14px,
  //     saturate 70% -> 0%. The cartoon is then dissolved away
  //     quickly with the rest of the smear.
  //
  // The key change: the cross-fade now happens in ~0.5-1 second
  // of real-world scroll time (15% of 350svh at typical scroll
  // cadence), not 1-2 seconds (30%). The double-exposure window
  // is brief enough that the eye reads it as "the storybook
  // smears into the photo" rather than "two scenes fighting".
  //
  // The sun animation is preserved (D-0052). At y=0.10 the sun
  // is at 100% and fully animated; by y=0.14 the sun is at 70%
  // with 4px blur (the rotation + breathing is still visible but
  // smeared); by y=0.18 the sun is at 40% with 8px blur (the
  // animation is barely perceptible through the smear). The sun
  // doesn't get its own fade — it inherits the storybook's smear
  // like everything else, which is the editorial motion-design
  // convention (a unified scene dissolving, not staged element
  // exits).
  const opacity = useTransform(
    progress,
    [0, 0.1, 0.18, 0.25],
    collapsed ? [1, 1, 1, 1] : [1, 1, 0.4, 0],
  );

  // D-0059 rev3 — filter in two phases. Phase 1 (smear) is
  // blur 0 -> 8px, saturate 100% -> 70% across [0.10, 0.18] —
  // 53% of the band (8% of scroll) is the smear. Phase 2
  // (dissolve) is blur 8 -> 14px, saturate 70% -> 0% across
  // [0.18, 0.25] — 47% of the band (7% of scroll) is the
  // dissolve. The function-form useTransform gives us direct
  // control over the easing curve at each phase boundary.
  const filter = useTransform(progress, (v) => {
    if (collapsed) return 'blur(0px) saturate(100%)';
    if (v <= 0.1) return 'blur(0px) saturate(100%)';
    if (v <= 0.18) {
      // Phase 1: smear [0.10, 0.18]
      const tRaw = (v - 0.1) / 0.08;
      const t = Math.max(0, Math.min(1, tRaw));
      const blur = t * 8;
      const saturate = 100 - t * 30;
      return `blur(${blur}px) saturate(${saturate}%)`;
    }
    if (v <= 0.25) {
      // Phase 2: dissolve [0.18, 0.25]
      const tRaw = (v - 0.18) / 0.07;
      const t = Math.max(0, Math.min(1, tRaw));
      const blur = 8 + t * 6;
      const saturate = 70 - t * 70;
      return `blur(${blur}px) saturate(${saturate}%)`;
    }
    return 'blur(14px) saturate(0%)';
  });

  // Each parallax layer translates horizontally as scroll progresses,
  // slower in the back, faster in the foreground. On mobile + reduced-
  // motion we lock translations to 0 so the scene is a still frame.
  const farPanX = useTransform(progress, (v) => (collapsed ? '0%' : `${-v * 6}%`));
  const midPanX = useTransform(progress, (v) => (collapsed ? '0%' : `${-v * 12}%`));
  const nearPanX = useTransform(progress, (v) => (collapsed ? '0%' : `${-v * 18}%`));

  // Sky translates a touch slower than the far layer to give a 4-tier
  // depth separation (sky / far / mid / near) instead of the usual 3.
  const skyPanX = useTransform(progress, (v) => (collapsed ? '0%' : `${-v * 3}%`));

  // D-0044 — vertical parallax from useViewportMotion, mapped onto the
  // existing storybook layers. The horizontal pan above is the legacy
  // D-0042 motion; the vertical parallax is the new cascade layer.
  // Wave 3 — fern + songbirds MotionValues are now consumed by the
  // dedicated parallax layer components below.
  const skyY = layerMotion?.sky?.y;
  const farY = layerMotion?.egret?.y;
  const midY = layerMotion?.mower?.y;
  const nearY = layerMotion?.gouache?.y;
  // D-0049 rev 4 — fernY + songbirdsY intentionally unused
  // (FernLayer / SongbirdsLayer were removed from the storybook
  // JSX because the painted VEO assets clashed with the hand-
  // authored SVG cartoon). The MotionValues are still computed
  // by useViewportMotion (it's all-or-nothing per hook call) so
  // we just don't consume them. If a re-painted-cartoon-style
  // asset is slotted back in later, re-add these two bindings.

  return (
    <motion.div className={styles.layer} style={{ opacity, filter }} aria-hidden="true">
      <motion.div
        className={styles.skyWrap}
        style={{ x: skyPanX, ...(skyY !== undefined && { y: skyY }) }}
      >
        <BackgroundSky />
      </motion.div>
      <Clouds />
      {/* D-0049 rev 4 — SongbirdsLayer REMOVED from the storybook.
       *
       * The Wave 3 songbirds-01..06.webp + fern-01..06.webp parallax
       * assets are VEO-painted detailed Florida scenery (brushwork
       * palm, brushwork leaves, painted birds on a hill). They were
       * originally added in D-0044 as foreground depth over the
       * storybook cartoon — but the painted style and the hand-
       * authored SVG cartoon style are at completely different
       * fidelity levels. Rendered together they read as a mash-up of
       * two scenes in one panel, not as depth. The cartoon storybook
       * already has its own depth cascade (sky + drifting clouds +
       * far palms + swaying mid palms + ranch houses + foreground
       * grass + wildflowers); the painted parallax was unnecessary
       * "more is more" that broke visual coherence.
       *
       * The SongbirdsLayer and FernLayer function components + the
       * useViewportMotion subscription stay in the file (in case
       * future re-painted-cartoon-style assets want to be slotted
       * back in) but the JSX is no longer mounted. The
       * /public/hero/layers/v2/fern-* and songbirds-* assets stay
       * on disk for the same reason.
       *
       * See governance/decisions/0049-second-scene-css-revert.md
       * §rev 4 for the steward review that triggered the removal
       * (the dark-letterbox fix in rev 3 made the painted content
       * fully visible, which exposed the style mismatch that the
       * black letterbox was previously hiding). */}
      <motion.div
        className={styles.farLayer}
        style={{ x: farPanX, ...(farY !== undefined && { y: farY }) }}
      >
        <FarLayer />
      </motion.div>
      <motion.div
        className={styles.midLayer}
        style={{ x: midPanX, ...(midY !== undefined && { y: midY }) }}
      >
        <MidLayer />
      </motion.div>
      {/* D-0014: Mower SVG removed - was the grey vehicle on the brown mid-band */}
      <motion.div
        className={styles.nearLayer}
        style={{ x: nearPanX, ...(nearY !== undefined && { y: nearY }) }}
      >
        <NearLayer />
      </motion.div>
      {/* D-0059 rev3 — paper-grain overlay REMOVED. The rev2
       * paper-grain (200x200 SVG feTurbulence at 0.08 opacity with
       * mix-blend-mode: multiply) was a static texture designed to
       * make the cartoon read as "printed on paper". But during the
       * [0.10, 0.25] cross-fade, the paper-grain stayed attached to
       * the storybook at 73% opacity (Phase 1 of rev2's two-phase
       * curve kept the storybook at >60% for half the band). The
       * result at y=0.20 was a *textured* ghost — the cartoon
       * ranch houses / palms / sun were smeared with a paper-noise
       * pattern sitting on top of the photo. The texture made the
       * ghost feel "real" rather than "transparent" — the opposite
       * of the intended effect.
       *
       * The cartoon's "alive" quality now comes from the D-0052 sun
       * animation (rotation + breathing + halo pulse) and the
       * existing D-0042 parallax + sway. The paper-grain is
       * recoverable as a static design-pass later (per §2.2.1 in
       * the original plan) if the steward wants the printed-page
       * feel, but only after the cross-fade is settled enough that
       * the texture doesn't read as ghost noise during transition.
       */}
      <ScrollHint mowerX={progress} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * Background sky - gradient + sun + horizon glow + birds.
 * Pure SVG, no scroll drive.
 * ----------------------------------------------------------------- */

function BackgroundSky(): ReactNode {
  return (
    <svg
      className={styles.sky}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      style={{ width: '105%', height: '105%', left: '-2.5%', top: '-2.5%' }}
    >
      <title>Background sky</title>
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-sun-pale)" />
          <stop offset="30%" stopColor="var(--ll-sun-deep)" />
          <stop offset="55%" stopColor="var(--ll-sun-light)" />
          <stop offset="80%" stopColor="var(--ll-cream)" />
          <stop offset="100%" stopColor="var(--ll-sand-bleached)" />
        </linearGradient>
        {/* D-0059 rev7 - sun artistic rework (sunburst composition).
         *
         * The rev6 sun was a 3-layer composition (halo + 8 triangular
         * rays + warm core). On a 1920x800 review the user flagged it
         * as "not artistically good" / "wireframe" / "not triple A" —
         * the triangular rays were too subtle to read as intentional
         * illustration, and the gradient orb + soft halo read as a
         * "blurry white circle" rather than a designed sun.
         *
         * rev7 is a 4-layer SUNBURST composition (the classic
         * 16-ray "rising sun" pattern from WPA poster art, the
         * North Dakota state seal, the Arizona flag, and the
         * Argentine national flag):
         *   1. .sunHalo  — soft warm radial gradient circle r=180.
         *                  Pulses 0.85->1.0 + scale 1->1.06 at 7s.
         *   2. .sunRaysLong  — 8 LONG triangular rays at 45° intervals
         *                  (0, 45, 90, ... 315). Each ray is 78px
         *                  tall (from y=110 to y=188) with a 24px
         *                  base. Filled with the sunRayLong gradient
         *                  (sun-light high-opacity at tip, sun-deep
         *                  lower-opacity at base). Rotates clockwise
         *                  at 50s/360deg linear — slow enough to read
         *                  as ambient warmth, not spinning.
         *   3. .sunRaysShort — 8 SHORT triangular rays at 22.5° offsets
         *                  (22.5, 67.5, 112.5, ... 337.5) — fills the
         *                  gaps between the long rays. Each ray is
         *                  40px tall (y=130 to y=170) with a 10px base.
         *                  Filled with the sunRayShort gradient
         *                  (lower opacity than the long rays so the
         *                  density hierarchy reads). Rotates
         *                  COUNTER-CLOCKWISE at 70s/360deg linear —
         *                  the counter-rotation creates a subtle
         *                  "shimmer" between the two layers, like
         *                  sun catching on water or heat-haze.
         *   4. .sunCore  — warm radial gradient orb r=82 (cream
         *                  highlight upper-left, sun-light mid,
         *                  sun edge). Breathes 1.0->1.02 at 7s.
         *
         * Why 16 rays and not 8 or 12?
         *   - 8: too sparse, reads as "+" cross with 4 corners.
         *   - 12: classic sunburst density, but the rays all hit
         *         at 30° intervals which is too geometric.
         *   - 16 (alternating long-short at 22.5°): the asymmetric
         *         ray length breaks the "all rays equal" pattern,
         *         the visual mass shifts as the layers rotate at
         *         different speeds, and the sun looks DESIGNED rather
         *         than SYMMETRIC. This is the same composition logic
         *         used in classic WPA posters and national flag sun
         *         motifs.
         *
         * Why counter-rotation?
         *   Single-rotation at any speed reads as "a pinwheel
         *   turning". Counter-rotation between two layers (long
         *   rays clockwise, short rays counter-clockwise, at
         *   different periods 50s vs 70s) makes the sun feel ALIVE
         *   without being a button. The relative motion between the
         *   two layers never repeats exactly within a single
         *   viewing — the visitor cannot lock onto a single cycle.
         *
         * The 8 long rays are defined ONCE as a single triangle path
         * (pointing up, at the top, centered on 352, 252) and rotated
         * to each of the 8 positions via the SVG `transform="rotate(rot
         * 352 252)"` attribute. Same trick for the short rays. This
         * keeps the JSX minimal and the SVG small. */}
        <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--ll-sun)" stopOpacity="0.48" />
          <stop offset="40%" stopColor="var(--ll-sun)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--ll-sun)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sunRayLong" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-sun-light)" stopOpacity="0.95" />
          <stop offset="60%" stopColor="var(--ll-sun)" stopOpacity="0.88" />
          <stop offset="100%" stopColor="var(--ll-sun-deep)" stopOpacity="0.78" />
        </linearGradient>
        <linearGradient id="sunRayShort" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-sun-light)" stopOpacity="0.78" />
          <stop offset="100%" stopColor="var(--ll-sun-deep)" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="sunCore" cx="0.36" cy="0.36" r="0.65">
          <stop offset="0%" stopColor="var(--ll-cream)" />
          <stop offset="35%" stopColor="var(--ll-sun-light)" />
          <stop offset="80%" stopColor="var(--ll-sun)" />
          <stop offset="100%" stopColor="var(--ll-sun-deep)" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#hero-sky)" />

      {/* D-0059 rev7 sun composition — see comment in <defs> above. */}
      <circle
        className={styles.sunHalo}
        cx="352"
        cy="252"
        r="180"
        fill="url(#sunGlow)"
      />
      {/* 8 LONG rays at 45° intervals (clockwise rotation 50s). */}
      <g className={styles.sunRaysLong}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
          <g key={`long-${rot}`} transform={`rotate(${rot} 352 252)`}>
            <path d="M 352 110 L 340 188 L 364 188 Z" fill="url(#sunRayLong)" />
          </g>
        ))}
      </g>
      {/* 8 SHORT rays at 22.5° offsets (counter-clockwise rotation 70s). */}
      <g className={styles.sunRaysShort}>
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((rot) => (
          <g key={`short-${rot}`} transform={`rotate(${rot} 352 252)`}>
            <path d="M 352 130 L 347 170 L 357 170 Z" fill="url(#sunRayShort)" />
          </g>
        ))}
      </g>
      <circle
        className={styles.sunCore}
        cx="352"
        cy="252"
        r="82"
        fill="url(#sunCore)"
      />
      {/* Birds (V-shapes) drift gently via CSS animation. */}
      <g
        className={styles.birds}
        fill="none"
        stroke="var(--ll-palm-bark)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      >
        <path d="M 880 180 q 6 -8 12 0 q 6 -8 12 0" />
        <path d="M 940 200 q 5 -6 10 0 q 5 -6 10 0" />
        <path d="M 1010 175 q 6 -8 12 0 q 6 -8 12 0" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------
 * Drifting clouds - pure CSS keyframes, GPU-cheap.
 * ----------------------------------------------------------------- */

function Clouds(): ReactNode {
  return (
    <div className={styles.clouds}>
      <div className={`${styles.cloud} ${styles.cloud1}`} />
      <div className={`${styles.cloud} ${styles.cloud2}`} />
      <div className={`${styles.cloud} ${styles.cloud3}`} />
      <div className={`${styles.cloud} ${styles.cloud4}`} />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Far layer - distant palms + faint houses. Translates slowest.
 * ----------------------------------------------------------------- */

function FarLayer(): ReactNode {
  return (
    <svg className={styles.layerSvg} viewBox="0 0 2000 900" preserveAspectRatio="xMidYMax slice">
      <title>Distant palm layer</title>
      <defs>
        <linearGradient id="far-palm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-palm-light)" />
          <stop offset="100%" stopColor="var(--ll-palm)" />
        </linearGradient>
      </defs>
      <path
        d="M 0 460 Q 200 440 400 450 T 800 448 T 1200 455 T 1600 440 T 2000 450 L 2000 900 L 0 900 Z"
        fill="var(--ll-palm-light)"
        opacity="0.45"
      />
      {/* D-0059 rev8 — distant palm grove group sway.
       *
       * The pre-rev8 far palms were completely static. A static
       * distant vista looks correct for a still photo, but the
       * storybook is a living scene and the eye expects distant
       * palms to "breathe" in the wind even if the motion is
       * barely visible. Per-tree animation is overkill at this
       * scale (7 palms, h=70-88 viewBox units, 0.45 opacity
       * wash) — a single group-level rotation with a very small
       * amplitude (±0.35°) gives the grove a subtle unified
       * breath without per-tree CSS bloat. The pivot is the
       * viewBox bottom-center (1000, 900) which sits well below
       * the palms (~485 viewBox units away), so the angular
       * motion translates to ~3 viewBox units of horizontal
       * displacement at the palm-tops — a distant-treeline
       * shimmer. The 14s period is much slower than the mid
       * palms' 7s frond rotation so the two layers don't
       * visibly sync. */}
      <g className={styles.farPalmsSway} fill="url(#far-palm)" opacity="0.45">
        <PalmTree x={120} y={415} h={70} />
        <PalmTree x={340} y={405} h={80} />
        <PalmTree x={680} y={410} h={72} />
        <PalmTree x={980} y={400} h={88} />
        <PalmTree x={1300} y={408} h={76} />
        <PalmTree x={1620} y={400} h={84} />
        <PalmTree x={1880} y={415} h={72} />
      </g>
      <g fill="var(--ll-sage-muted)" opacity="0.3">
        <rect x={500} y={430} width={60} height={30} />
        <rect x={1100} y={425} width={70} height={35} />
        <rect x={1450} y={432} width={55} height={28} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------
 * Mid layer - closer palms (swaying), ranch houses.
 * ----------------------------------------------------------------- */

function MidLayer(): ReactNode {
  return (
    <svg className={styles.layerSvg} viewBox="0 0 2000 900" preserveAspectRatio="xMidYMax slice">
      <title>Midground palm layer</title>
      <defs>
        <linearGradient id="mid-trunk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-clay)" />
          <stop offset="100%" stopColor="var(--ll-palm-bark)" />
        </linearGradient>
        <linearGradient id="mid-frond" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-palm)" />
          <stop offset="100%" stopColor="var(--ll-green)" />
        </linearGradient>
        <linearGradient id="house-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-cream)" />
          <stop offset="100%" stopColor="var(--ll-sand)" />
        </linearGradient>
        <linearGradient id="house-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-clay)" />
          <stop offset="100%" stopColor="var(--ll-palm-bark)" />
        </linearGradient>
      </defs>
      <path
        d="M 0 480 Q 300 470 600 478 T 1200 480 T 1800 476 T 2000 482 L 2000 900 L 0 900 Z"
        fill="var(--ll-palm-light)"
        opacity="0.5"
      />
      <path
        d="M 0 540 Q 400 530 800 540 T 1600 538 T 2000 544 L 2000 900 L 0 900 Z"
        fill="var(--ll-grass)"
        opacity="0.5"
      />

      {/* D-0059 rev4 — center ranch house MOVED from viewBox x=1100
       * to x=1400 (and scaled 1.0 -> 0.8). At x=1100 the center
       * house sat on screen x ≈ 845px which is in the middle of
       * the second line of the headline ("neighbor's lawn mower.")
       * — the visitor saw the house's dark roof interrupting the
       * text. Moving it past the headline's right edge (~900px) and
       * scaling it down to 0.8 keeps the three-house composition
       * but puts the center house in the right free zone (1000-
       * 1280px on a 1280px viewport) where it brackets the headline
       * instead of crossing it. */}
      <g transform="translate(1400 380) scale(0.8)">
        <House />
      </g>
      <g transform="translate(1500 400) scale(0.7)">
        <House />
      </g>
      <g transform="translate(400 400) scale(0.65)">
        <House />
      </g>

      {/* D-0059 rev8 — palm sway is now PART-WISE, not whole-tree.
       * The pre-rev8 .swaySlow wrapper rotated the entire palm
       * (trunk + fronds + coconut) as a single rigid body. With
       * `transform-origin: bottom center` resolved to the viewBox
       * bottom-center, the BASE of the trunk lifted off the ground
       * as the tree swayed — the visitor saw the roots slide
       * across the ground band, which is the "primitive whole-
       * element transformation" the steward flagged.
       *
       * rev8 moves the animation INSIDE the PalmTree primitive: the
       * trunk path (separate <g> in the new structure) stays
       * static, and the fronds group (positioned at translate
       * (0 -h), i.e. at the trunk-top attach point) is the only
       * thing that rotates. CSS .palmFronds uses `transform-box:
       * fill-box; transform-origin: 50% 50%` to resolve the pivot
       * to the center of the fronds' bounding box — which is the
       * attach point. Result: the trunk stays rooted, the canopy
       * sweeps around the trunk-top, just like a real palm in
       * wind. Per-palm `phase` keeps the three mid palms slightly
       * out of sync so the grove doesn't sway in lockstep. */}
      {/* D-0059 rev7 - left palm MOVED from y=280 to y=480, h 200 -> 170.
       * The previous y=280 had the palm's fronds at viewBox y=80
       * (since h=200, fronds sit at y-h). At a 1920x800 viewport
       * the MidLayer SVG with preserveAspectRatio="xMidYMax slice"
       * clips the top of the viewBox: with element 2304x800 and
       * viewBox 2000x900, the slice scale is 1.152 and the yMax
       * alignment means the visible viewBox y range is 205.7 to
       * 900. Anything above y=205.7 is clipped above the viewport.
       * The left palm's fronds at y=80 sat 125.7 units above the
       * clip line — they were invisible, leaving only the bottom
       * ~85px of trunk showing as a "hanging straight line" at
       * the top of the screen. The user flagged this in the
       * 1920x800 review as "palm tree's top is hanging and cut
       * off from the top of the screen".
       *
       * Move to y=480, h=170: fronds at y=310 (104 units below
       * the clip line, fully visible), base on the palm-light
       * ground band at y=480. Trunk length 170 viewBox units =
       * 196 screen pixels — the trunk is the visual "anchor" of
       * the palm and now reads as a complete tree instead of a
       * hanging line. h=170 (was 200) keeps the left palm
       * noticeably taller than the middle/right palms (h=130) so
       * the depth hierarchy still reads. */}
      <PalmTree
        x={150}
        y={480}
        h={170}
        trunkFill="url(#mid-trunk)"
        frondFill="url(#mid-frond)"
        anim
        phase="0s"
      />
      {/* D-0059 rev4 polish — middle palm MOVED from x=780 to x=950.
       * At x=780 the trunk sat at screen x ≈ 444, which is inside
       * the eyebrow pill's x range (349-532). The pill was 45%
       * opaque so the dark trunk showed through behind the
       * "LAWN CARE IN 33771" text, reading as a vertical thread
       * hanging the pill. Moving to x=950 puts the trunk at
       * screen x ≈ 596 (past the pill's right edge) and keeps
       * the three-palm composition. The pill background is also
       * bumped to 72% in HeroFieldTelemetry.module.css so even
       * if a future change moves the pill back, the trunk won't
       * read through it. */}
      <PalmTree
        x={950}
        y={400}
        h={130}
        trunkFill="url(#mid-trunk)"
        frondFill="url(#mid-frond)"
        anim
        phase="-1.2s"
      />
      {/* D-0059 rev7 - right palm LOWERED from y=360 to y=400.
       * At y=360 the fronds sat at viewBox y=230, which maps to
       * screen y=27.9 — only 28 pixels below the top of the
       * viewport. The fronds were technically visible but
       * crowding the top edge, which read as "palm trees
       * crammed at the top of the scene" on a 1920x800 review.
       * Lowering to y=400 (h unchanged at 130) puts the fronds
       * at viewBox y=270, screen y=74 — same y as the middle
       * palm for a clean horizontal alignment, with comfortable
       * breathing room from the top edge. */}
      <PalmTree
        x={1750}
        y={400}
        h={130}
        trunkFill="url(#mid-trunk)"
        frondFill="url(#mid-frond)"
        anim
        phase="-0.6s"
      />
    </svg>
  );
}

/* D-0049 rev 4 — FernLayer and SongbirdsLayer function components
 * were REMOVED. The painted VEO assets (detailed brushwork palm +
 * leaves + birds) clashed with the hand-authored SVG cartoon at
 * incompatible fidelity levels — rendered together they read as a
 * mash-up of two scenes, not as foreground depth.
 *
 * The original component source is preserved in git history (commit
 * b330cf8 just before this commit). If a re-painted-cartoon-style
 * asset is generated later and wants to be slotted back into the
 * storybook, re-add the components and the corresponding MotionValue
 * bindings above (fernY / songbirdsY).
 *
 * The CSS classes (.fernWrap, .fernInner, .fernStrip, .fernFrame1..6,
 * .songbirdsWrap, .songbirdsInner, .songbirdsFrame1..6) and the WebP
 * assets in apps/web/public/hero/layers/v2/fern-* and songbirds-*
 * are kept for the same reason. */

/* ------------------------------------------------------------------
 * Near layer - foreground grass + wildflowers.
 * ----------------------------------------------------------------- */
function NearLayer(): ReactNode {
  return (
    <div className={styles.nearInner}>
      <svg className={styles.layerSvg} viewBox="0 0 2000 900" preserveAspectRatio="xMidYMax slice">
        <title>Foreground grass layer</title>
        <defs>
          <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ll-grass-deep)" />
            <stop offset="100%" stopColor="var(--ll-grass-mow)" />
          </linearGradient>
          <linearGradient id="grass-tip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ll-grass-mow)" />
            <stop offset="100%" stopColor="var(--ll-grass-deep)" />
          </linearGradient>
        </defs>

        <path d="M 0 600 Q 500 590 1000 600 T 2000 596 L 2000 900 L 0 900 Z" fill="url(#grass)" />
        {/* D-0059 rev8 — per-blade grass sway.
         *
         * The pre-rev8 .blades group had a single one-shot `grow`
         * animation (scaleY 0→1) and no continuous motion. After
         * the grow-in finished the foreground was static — the
         * lawn didn't respond to the same wind that sways the
         * palms, which is a coherence gap: a real mowed lawn
         * visibly breathes in even a gentle breeze.
         *
         * rev8 adds a continuous per-blade sway. Each of the 60
         * blade groups gets .blade class + an inline `--i` CSS
         * custom property. The CSS keyframe rotates the blade
         * around its base (transform-box: fill-box; transform-origin:
         * 50% 100% resolves to the bottom of the blade's bounding
         * box, which is the base where the blade meets the ground
         * at y=680). The animation-delay is `calc(var(--i) * -0.11s)`
         * so each blade is 0.11s ahead of the previous one — with
         * 60 blades the phase spread is 6.6s against a 2.6s period,
         * meaning at any moment the lawn has blades at all phases
         * of the sway, reading as a continuous shimmer rather
         * than a synchronized back-and-forth. The "wind moving
         * across the lawn" effect emerges from the phase gradient
         * itself.
         *
         * Why ±3.5° and not more? Grass blades in a still photo
         * look static; in real wind they bend a lot, but visually
         * the visitor reads "alive lawn" at ±3-4° per blade with
         * phase variation. Larger rotations make the blades look
         * like they're being torn by a storm.
         *
         * The grow-in animation is preserved on the parent .blades
         * group so the entrance still happens (now as a stagger
         * of per-blade grow + continuous sway) — the children's
         * CSS animations don't conflict with the parent's grow
         * because grow runs once and is `backwards` on delay. */}
        <g className={styles.blades}>
          {Array.from({ length: 60 }).map((_, i) => {
            const x = i * 34 + (i % 3) * 8;
            const h = 24 + (i % 5) * 6;
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: static generated grass blades
              <g
                key={`blade-${i}`}
                className={styles.blade}
                style={{ '--i': i } as CSSProperties}
                transform={`translate(${x} 680)`}
              >
                <path
                  d={`M 0 0 Q ${3 + (i % 3)} -${h} 6 -${h}`}
                  stroke="url(#grass-tip)"
                  strokeWidth={1.6}
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={`M 8 0 Q ${11 + (i % 3)} -${h - 6} 14 -${h - 6}`}
                  stroke="url(#grass-tip)"
                  strokeWidth={1.4}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.7}
                />
              </g>
            );
          })}
        </g>
        {/* D-0059 rev6 — wildflowers REMOVED.
         *
         * The 5 wildflower circles (2px inner + 3px outer, sun/clay/sand
         * colors at viewBox y=650-662) rendered as 4 visible "erroneous
         * dots" at the bottom of the storybook on most viewports — the
         * 5th was off-screen on narrower viewports, and all 5 read as
         * random stray pixels rather than intentional decoration. The
         * .bloom animation (scale 0->1.4->1) ran once on first paint
         * but at 2-3px display size the motion was imperceptible. They
         * didn't serve a clear purpose and the user flagged them as
         * "hallucinated and broken incoherent" on the 1920px-wide
         * review screenshot.
         *
         * Removal rationale: the storybook's foreground is the
         * NearLayer grass blades (60 of them, .grow animation), which
         * carry the "alive lawn" weight on their own. The wildflowers
         * added 5 small dots that competed for attention at the
         * bottom-edge of the scene where the CTA is — the dots and
         * the CTA button fought for the same visual real estate.
         *
         * The CSS .wildflowers class is removed too (no other usage).
         * See governance/decisions/0059-hero-simplification-and-extension.md
         * §12 (rev6) for the full rationale. */}
        {/* D-0059 Path A — cartoon operator + walk-behind mower REMOVED.
         *
         * The operator used to render in the empty middle area of
         * the foreground (viewBox x ≈ 1200-1340) between the
         * centered editorial column and the right-side ranch house.
         * The operator was a hand-authored flat-fill SVG matching
         * the existing PalmTree / House primitive style.
         *
         * Removal rationale: the operator duplicated the identity
         * already carried by the OperatorStrip section below the
         * hero. The D-0049 rev 4 lesson said painted VEO brushwork
         * + hand-authored SVG cartoon are at incompatible fidelity
         * levels; the operator stayed in hand-authored SVG to
         * satisfy that constraint, but it still duplicated the
         * OperatorStrip section's identity signal. The foreground
         * area is now empty grass + wildflowers, which gives the
         * ranch houses + palms more breathing room.
         *
         * The empty area reads as "the storybook is establishing
         * place, not character" — the operator's character is
         * delivered below the hero, where there's room to do it
         * justice. See governance/decisions/0059-hero-simplification-
         * and-extension.md §2.1 for the full rationale. */}
      </svg>
    </div>
  );
}
/* ------------------------------------------------------------------
 * Scroll hint - prompts the visitor to scroll and reveals the photo.
 * Hidden once the storybook has fully dissolved (scroll > 0.95).
 * ----------------------------------------------------------------- */

function ScrollHint({ mowerX }: { mowerX: MotionValue<number> }): ReactNode {
  const opacity = useTransform(mowerX, [0, 0.05, 0.9, 1], [1, 1, 1, 0]);
  const y = useTransform(mowerX, [0, 1], [0, 12]);
  const dotLeft = useTransform(mowerX, (v) => `${v * 100}%`);
  return (
    <motion.div className={styles.scrollHint} style={{ opacity, y }}>
      <span className={styles.scrollHintLabel}>SCROLL TO REVEAL</span>
      <span className={styles.scrollHintTrack}>
        <motion.span className={styles.scrollHintDot} style={{ left: dotLeft }} />
      </span>
      <span className={styles.scrollHintArrow} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <title>Scroll hint arrow</title>
          <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * Tiny SVG primitives - hand-authored, small enough to be inline.
 * ----------------------------------------------------------------- */

function PalmTree({
  x,
  y,
  h,
  trunkFill = '#1f4e2c',
  frondFill = '#2d5a3d',
  /* D-0059 rev8 — physics-coherent palm sway.
   *
   * `anim=true` opts this palm into the new per-part animation: the
   * trunk stays rooted at its base (no rotation, the roots don't
   * lift), and the fronds group rotates around the trunk-top attach
   * point (where the canopy actually meets the trunk). The pre-rev8
   * `.swaySlow` wrapper rotated the whole palm as a rigid body —
   * visually the BASE lifted off the ground, which is the
   * "primitive whole-element transformation" the steward flagged.
   *
   * `phase` lets MidLayer stagger the three mid palms' frond cycles
   * (0s, -1.2s, -0.6s) so the grove doesn't sway in mechanical
   * lockstep. Far-layer palms default anim=false because they're
   * behind a 0.45 opacity wash and don't need per-part animation
   * (they get a separate group-level "distant grove breathing" sway
   * via .farPalmsSway).
   */
  anim = false,
  phase = '0s',
}: {
  x: number;
  y: number;
  h: number;
  trunkFill?: string;
  frondFill?: string;
  anim?: boolean;
  phase?: string;
}): ReactNode {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Trunk — anchored at (0,0), the base. NO rotation: the
       * root of the tree stays in the ground no matter how hard
       * the canopy sways. The trunk shape itself goes from (0,0)
       * at the base to (1, -h) at the top, with a slight curve. */}
      <path
        d={`M 0 0 Q ${-2} -${h * 0.5} 1 -${h}`}
        stroke={trunkFill}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      {/* Fronds — pivoted at the trunk-top attach point. The
       * SVG `transform="translate(0 -h)"` puts the group's local
       * origin at the top of the trunk. CSS `transform-box: fill-box;
       * transform-origin: 50% 50%` then resolves the rotation pivot
       * to the CENTER of the fronds' bounding box — which is the
       * trunk-top attach point (the 8 fronds radiate from 0,0 in
       * their local space, so their bbox is a square centered on
       * the local origin). The fronds sweep around the fixed
       * trunk-top, not around the viewBox bottom-center. */}
      <g
        className={anim ? styles.palmFronds : undefined}
        transform={`translate(0 -${h})`}
        style={anim ? { animationDelay: phase } : undefined}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
          <g key={rot} transform={`rotate(${rot})`}>
            <path d="M 0 0 Q 12 -6 24 -2 Q 18 -10 8 -8 Z" fill={frondFill} />
            <path d="M 0 0 Q 18 2 32 8 Q 24 14 14 10 Z" fill={frondFill} opacity={0.85} />
          </g>
        ))}
        <circle r={2.5} fill="#3d2814" />
      </g>
    </g>
  );
}

function House(): ReactNode {
  return (
    <g>
      <rect x={0} y={20} width={140} height={70} fill="url(#house-wall)" />
      <polygon points="0,20 70,-12 140,20" fill="url(#house-roof)" />
      <rect x={10} y={60} width={40} height={30} fill="var(--ll-clay)" opacity={0.4} />
      <rect x={20} y={48} width={14} height={42} fill="var(--ll-palm-bark)" />
      <rect x={48} y={32} width={20} height={20} fill="var(--ll-palm-bark)" opacity={0.7} />
      <rect x={50} y={34} width={16} height={16} fill="var(--ll-sun)" />
      <rect x={90} y={32} width={20} height={20} fill="var(--ll-palm-bark)" opacity={0.7} />
      <rect x={92} y={34} width={16} height={16} fill="var(--ll-sun)" />
      <circle cx={130} cy={70} r={14} fill="var(--ll-palm)" opacity={0.8} />
    </g>
  );
}
