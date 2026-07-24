'use client';

/**
 * SecondScene — the second pinned scene of the unified hero (D-0049).
 *
 * Replaces the D-0048 Three.js 2.5D plane stack (which produced a
 * black-column rendering bug in production) with a pure-CSS approach
 * that uses the pre-existing VEO-painted `scene2-01..06.webp` frames
 * as a full-bleed background cycling at a slow cadence. The painted
 * frames ARE coherent complete scenes (Florida ranch house, terracotta
 * roof, sun, palms, mower on the lawn) — they were always meant to
 * fill the panel, not be split into Three.js planes.
 *
 * Layer stack (z-index, bottom to top):
 *   0  .sceneStage     - 6 painted frames as background-image, CSS-step cycle
 *   1  .content        - editorial pull-quote (eyebrow + headline + subhead + CTAs)
 *
 * The 6 frames in scene2-01..06.webp are near-identical painted scenes
 * with subtle differences (mower position shifts slightly, sun has
 * minor variations). Cycling them at 10s per frame with `steps(1, end)`
 * produces a meditative hand-painted stillness — the visitor sees a
 * subtle ambient update every ~1.7s, not a jarring flipbook.
 *
 * D-0049 (rev 2) — dropped the palms foreground parallax layer. The
 * previous version overlaid palms-01..06.webp at bottom-right with
 * mix-blend-mode: multiply, which worked under D-0047 (when palms-*
 * were slim letterboxed strips from a different VEO source). The
 * D-0048 re-extracted palms-01..06.webp at higher quality as full
 * Florida scenes (house, big sun, palm trees, bird bath) — using
 * the same "background-size: 42% auto, right bottom" pattern put
 * a giant palm tree + sun on top of the painted scene 2 instead
 * of a slim frond. The painted scene 2 IS already complete with
 * its own palms, sun, and house. Adding a foreground overlay
 * destroys the composition.
 *
 * Why this works and the D-0048 Three.js version didn't:
 *   - No WebGL context required (no headless-Chrome SwiftShader drop)
 *   - No camera frustum math (the BG plane geometry couldn't cover
 *     the visible panel, leaving a dark column in the center)
 *   - No dynamic import + ssr:false (~150KB three.js + R3F + drei
 *     out of the initial bundle, now back in)
 *   - The painted frames ARE the scene; we don't have to re-construct
 *     a coherent image from 3 different texture strips
 *
 * The /hero-test route (formerly /hero-3d-test) still exists as a
 * review surface but renders this component in isolation.
 */
import { type MotionValue, motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { MagneticCta, parseScene2Headline } from './HeroFieldTelemetry';

import styles from './SecondScene.module.css';

const SCENE2_FRAMES = [
  '/hero/layers/v2/scene2-01.webp',
  '/hero/layers/v2/scene2-02.webp',
  '/hero/layers/v2/scene2-03.webp',
  '/hero/layers/v2/scene2-04.webp',
  '/hero/layers/v2/scene2-05.webp',
  '/hero/layers/v2/scene2-06.webp',
] as const;

// 2026-07-23 — 5th painted plane: a fern micro-loop overlay
// above the painted scene 2 background. Per the D-0049 rev 4
// painted/cartoon lesson, painted VEO brushwork stacks with
// painted VEO brushwork (and only with itself) — so mounting
// fern-*.webp ABOVE scene2-*.webp is safe (both are painted),
// while the same fern ABOVE the cartoon storybook would have
// been the rejected rev-4 mashup.
//
// Top-anchored, mix-blend-mode: multiply, low opacity so the
// fern reads as a subtle foreground detail (not a layer that
// covers the ranch house). The fern is in the upper-LEFT of
// the source frame; we anchor the .fernLayer container at the
// upper-RIGHT of the painted scene 2 with `background-position:
// right top` so the source's left-aligned fern is naturally
// visible at the right edge. No horizontal mirror (removed
// 2026-07-23 per the 5-plane review — the mirror was over-
// engineering; right-anchored positioning + contain sizing
// already puts the fern at the upper-right in its natural
// source orientation).
const FERN_FRAMES = [
  '/hero/layers/v2/fern-01.webp',
  '/hero/layers/v2/fern-02.webp',
  '/hero/layers/v2/fern-03.webp',
  '/hero/layers/v2/fern-04.webp',
  '/hero/layers/v2/fern-05.webp',
  '/hero/layers/v2/fern-06.webp',
] as const;

interface SecondSceneProps {
  scene2: {
    eyebrow: string;
    headline: string;
    subhead: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  /** Container opacity. Driven by `secondSceneFade` MotionValue
   *  in HeroFieldTelemetry — 0 in scene 1, 1 by scroll 0.70. */
  opacity: MotionValue<number>;
  /** Content overlay opacity. Lag scene fade slightly so the
   *  picture lands first, then the chapter copy. */
  contentOpacity: MotionValue<number>;
}

export function SecondScene({
  scene2,
  opacity,
  contentOpacity,
}: SecondSceneProps): ReactNode {
  return (
    <motion.div
      className={styles.root}
      style={{ opacity }}
      data-testid="hero-second-scene"
    >
      {/* Full-bleed painted scene — 6 frames, CSS-step cycle @ 10s.
       * Each frame is a near-identical painted Florida ranch house;
       * the cycle reads as meditative hand-painted stillness. */}
      <div className={styles.sceneStage} aria-hidden="true">
        {SCENE2_FRAMES.map((src, i) => (
          <div
            key={src}
            className={`${styles.sceneFrame} ${styles[`sceneFrame${i + 1}`]}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      {/* 2026-07-23 — 5th painted plane: fern micro-loop overlay.
       * Sits ABOVE the painted scene 2 background (z-order within
       * this component's stack), BELOW the editorial pull-quote
       * chrome (so the chrome stays readable). The fern is a
       * top-anchored PAIRED-painted overlay — both this and
       * scene 2 are VEO brushwork, so the painted-stacks-with-
       * painted lesson from D-0049 rev 4 is satisfied. mix-blend-
       * mode: multiply at 0.65 opacity so the fern reads as a
       * "deep" foreground detail (the fronds are in the same
       * sun-warm palette as the ranch house, so multiply blends
       * them into the illustration rather than overlaying them
       * on top). 8s CSS-step cycle matches the original fern
       * frame prep cadence (Frame N visible for ~1.33s before
       * stepping to Frame N+1).
       *
       * NOT mounted on mobile + reduced-motion (the .fernLayer
       * CSS class is hidden by the @media block at the bottom
       * of SecondScene.module.css). The fern is too small a
       * detail to read on phones and the cycle animation is
       * not reduced-motion friendly. */}
      <div className={styles.fernLayer} aria-hidden="true">
        {FERN_FRAMES.map((src, i) => (
          <div
            key={src}
            className={`${styles.fernFrame} ${styles[`fernFrame${i + 1}`]}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      {/* Editorial pull-quote content overlay.
       * Bottom 12svh of the viewport, centered, warm-brown text.
       *
       * D-0059 rev2 - editorial chrome (plan §2.2.3) makes the
       * pull-quote read as a CAPTION on a painted illustration,
       * not a third hero headline. Four coordinated elements:
       *
       *   1. .eyebrowRule — 32px-wide 1px clay horizontal rule
       *      above the eyebrow (the chapter-divider convention).
       *   2. .eyebrowSquare — 8x8px clay square to the left of
       *      the eyebrow (the chapter-marker convention).
       *   3. .openingMark — opening curly quote bumped to 1.4em
       *      with translateY(-0.1em) (typographic ornament, not
       *      a stray character).
       *   4. .ctaUnderline — 1px clay underline on MagneticCta
       *      hover (the editorial-spread "click to continue"
       *      convention).
       *
       * The chrome lives in SecondScene.module.css. It's NOT a
       * shared component (yet) — the only "editorial" section
       * in the site is scene 2, so a reusable EditorialChrome
       * component would be premature abstraction. If the
       * SpecimenPlate or PocketMap sections ever need chrome,
       * extract this layout to apps/web/src/components/ui/
       * EditorialChrome.tsx at that point. */}
      <motion.div
        className={styles.content}
        style={{ opacity: contentOpacity }}
      >
        <span className={styles.eyebrowRule} aria-hidden="true" />
        <span className={styles.eyebrowRow}>
          <span className={styles.eyebrowSquare} aria-hidden="true" />
          <span className={styles.eyebrow}>{scene2.eyebrow}</span>
        </span>
        <h2 className={styles.headline}>
          <span className={styles.openingMark} aria-hidden="true">
            &ldquo;
          </span>
          {parseScene2Headline(scene2.headline).map((seg, i) =>
            seg.italic ? (
              <em key={`seg-${i}`} className={styles.italic}>
                {seg.text}
              </em>
            ) : (
              <span key={`seg-${i}`}>{seg.text}</span>
            ),
          )}
        </h2>
        <p className={styles.subhead}>{scene2.subhead}</p>
        <span className={styles.eyebrowRule} aria-hidden="true" />
        <div className={styles.actions}>
          <MagneticCta href={scene2.primaryCta.href} variant="sun" size="lg">
            {scene2.primaryCta.label}
            <span className={styles.ctaArrow} aria-hidden="true">
              &rarr;
            </span>
          </MagneticCta>
          <MagneticCta href={scene2.secondaryCta.href} variant="ghost" size="lg">
            {scene2.secondaryCta.label}
          </MagneticCta>
        </div>
      </motion.div>

      {/* D-0050 Phase 3 — per-ZIP card strip.
       *
       * 6 cards in a horizontal row at the bottom of the scene,
       * one per service area ZIP. Each card shows the painted
       * area image (top 60%) + ZIP code + neighborhood label,
       * and links to /areas/[zip]. The cream-tinted card
       * background with backdrop blur separates the strip from
       * the painted grass below it.
       *
       * Renders only in scene 3 (the painted ranch house),
       * fading in across scroll [0.70, 0.85] — the resting
       * state of the scene, well after the photo has faded out
       * and the route pin is gone. Stays out of the photo
       * cross-fade window so it doesn't compete with the route
       * pin in scene 2.
       *
       * The strip's z-index is 1 inside the SecondScene root
       * (which itself is at z 1 of the hero), so the strip
       * sits above the painted scene stage but below the
       * editorial pull-quote (z 2). On mobile the strip drops
       * to a 3x2 grid via the @media (max-width: 767px) rule
       * in the module CSS. */}
      {/* D-0059 Path A — per-ZIP card strip REMOVED.
       *
       * The strip used to render 6 ZIP cards at the bottom of scene
       * 3 (D-0050 Phase 3), with a coordinated handoff from the
       * dashboard widgets. The strip duplicated the per-ZIP
       * navigation already carried by the ServiceAreaMap section
       * below the hero (form + 6 ZIP chips + neighborhood labels),
       * AND it competed with the [0.40, 0.70] cross-fade window
       * (the strip faded in across [0.70, 0.85] but its
       * presence added a third visual language to a section that
       * already has two — painted illustration + editorial
       * pull-quote). The ServiceAreaMap section IS the per-ZIP
       * navigation; the strip is gone.
       *
       * The 0.875rem bottom padding is preserved via the .content
       * bottom: 22svh; rule so the editorial pull-quote has the same
       * breathing room it had under the strip's roof. */}
    </motion.div>
  );
}

