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
 *   1  .palmsLayer     - 6 palms frames as foreground parallax (mix-blend-mode: multiply)
 *   2  .content        - editorial pull-quote (eyebrow + headline + subhead + CTAs)
 *
 * The 6 frames in scene2-01..06.webp are near-identical painted scenes
 * with subtle differences (mower position shifts slightly, sun has
 * minor variations). Cycling them at 10s per frame with `steps(1, end)`
 * produces a meditative hand-painted stillness — the visitor sees a
 * subtle ambient update every ~1.7s, not a jarring flipbook.
 *
 * The palms strip (palms-01..06.webp) sits at bottom-right with
 * mix-blend-mode: multiply so it overprints the painted background
 * like a hand-painted foreground element. 12s cadence (slower than
 * scene2's 10s) so the two cycles drift in/out of phase over the
 * 60s LCM.
 *
 * Reduced motion: drops the cycling animation, locks both layers to
 * frame 01. Coarse pointer (mobile): drops palms layer to save
 * fillrate, scene2 cycling still runs at the slow 10s cadence.
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

const PALMS_FRAMES = [
  '/hero/layers/v2/palms-01.webp',
  '/hero/layers/v2/palms-02.webp',
  '/hero/layers/v2/palms-03.webp',
  '/hero/layers/v2/palms-04.webp',
  '/hero/layers/v2/palms-05.webp',
  '/hero/layers/v2/palms-06.webp',
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
        {/* Foreground parallax — palms strip at bottom-right with
         * mix-blend-mode: multiply. 12s cadence so the two cycles
         * drift in/out of phase. Overprints the painted scene
         * like a hand-painted foreground element. */}
        <div className={styles.palmsLayer} aria-hidden="true">
          {PALMS_FRAMES.map((src, i) => (
            <div
              key={src}
              className={`${styles.palmsFrame} ${styles[`palmsFrame${i + 1}`]}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
      </div>

      {/* Editorial pull-quote content overlay.
       * Bottom 12svh of the viewport, centered, warm-brown text. */}
      <motion.div
        className={styles.content}
        style={{ opacity: contentOpacity }}
      >
        <span className={styles.eyebrow}>{scene2.eyebrow}</span>
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
    </motion.div>
  );
}
