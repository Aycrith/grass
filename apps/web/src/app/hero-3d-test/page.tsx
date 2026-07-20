'use client';

/**
 * `/hero-3d-test` page — D-0048 real-browser review surface.
 *
 * Mounts `<HeroScene3D />` in isolation with mock MotionValues so the
 * scene renders as it does at scroll ~95% in the production hero
 * (fully revealed, camera at max orbit). The page has minimal chrome:
 * title, scroll-progress slider (so the steward can scrub scrollProgress
 * 0→1 to test camera orbit), and the scene panel itself.
 *
 * Steward workflow:
 *   1. Navigate to /hero-3d-test in a real browser
 *   2. Observe: parallax between BG scene2 plane, MID palms plane,
 *      FG fern plane
 *   3. Observe: wind sway (each plane at different cadence)
 *   4. Observe: texture cycling (each plane at different rate)
 *   5. Drag the slider to scrub camera orbit
 *
 * The scene fills 100svh. A debug overlay shows current MotionValue
 * values + texture-load state. This is the only place the scene can
 * be visually confirmed — Playwright headless drops WebGL context.
 */
import { HeroScene3D } from '@/components/sections/HeroScene3D';
import { motionValue, MotionValue } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';

import styles from './page.module.css';

// Build a stable MotionValue that's mutable on the client (start at 1.0
// to simulate scene 2 fully revealed). The slider overrides it at runtime.
function makeMotionValue(initial: number): MotionValue<number> {
  // motionValue() is the right factory but the type signature requires
  // a generic. Cast to keep TS happy.
  return motionValue<number>(initial);
}

export default function Hero3DTestPage(): ReactNode {
  // Mock MotionValues for the scene. Use useState for the slider
  // display value, and a separate mutable ref for the MotionValue
  // we pass to HeroScene3D so changes propagate.
  const [scrollProgress, setScrollProgress] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [webglAvailable, setWebglAvailable] = useState(true);

  const opacityMV = useState(() => makeMotionValue(1))[0];
  const contentMV = useState(() => makeMotionValue(1))[0];
  const scrollMV = useState(() => makeMotionValue(1))[0];

  useEffect(() => {
    // Probe WebGL on mount so the debug overlay shows the fallback state.
    try {
      const c = document.createElement('canvas');
      const gl =
        c.getContext('webgl2') ||
        c.getContext('webgl') ||
        c.getContext('experimental-webgl');
      setWebglAvailable(!!gl);
    } catch {
      setWebglAvailable(false);
    }
  }, []);

  useEffect(() => {
    opacityMV.set(opacity);
  }, [opacity, opacityMV]);
  useEffect(() => {
    contentMV.set(contentOpacity);
  }, [contentOpacity, contentMV]);
  useEffect(() => {
    scrollMV.set(scrollProgress);
  }, [scrollProgress, scrollMV]);

  return (
    <main className={styles.root}>
      <div className={styles.scenePanel}>
        <HeroScene3D
          opacity={opacityMV}
          contentOpacity={contentMV}
          scrollProgress={scrollMV}
          scene2={{
            eyebrow: 'CHAPTER 2 — TUESDAY MORNING',
            headline: 'Walked past Tuesday.',
            subhead:
              'Six days I plan the route. One day I cut. The mower noise lasts twenty minutes; the rest of the week is yours.',
            primaryCta: { label: 'See my route', href: '/service-areas' },
            secondaryCta: { label: 'See pricing', href: '/pricing' },
          }}
        />
      </div>

      <aside className={styles.debug}>
        <h1 className={styles.title}>D-0048 — Hero 3D Test</h1>
        <p className={styles.note}>
          Real-browser mount surface. Headless Chrome drops WebGL — use a
          real browser to see the Three.js scene.
        </p>
        <dl className={styles.metrics}>
          <dt>webgl</dt>
          <dd>{webglAvailable ? 'available' : 'unavailable (fallback)'}</dd>
          <dt>scrollProgress</dt>
          <dd>{scrollProgress.toFixed(2)}</dd>
          <dt>opacity</dt>
          <dd>{opacity.toFixed(2)}</dd>
          <dt>contentOpacity</dt>
          <dd>{contentOpacity.toFixed(2)}</dd>
        </dl>
        <label className={styles.slider}>
          <span>camera orbit (scrollProgress)</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={scrollProgress}
            onChange={(e) => setScrollProgress(parseFloat(e.target.value))}
          />
        </label>
        <label className={styles.slider}>
          <span>scene opacity</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
          />
        </label>
        <label className={styles.slider}>
          <span>content opacity</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={contentOpacity}
            onChange={(e) => setContentOpacity(parseFloat(e.target.value))}
          />
        </label>
        <ul className={styles.legend}>
          <li>
            <span className={styles.dot} data-strip="bg" />
            BG plane (z=-15) — scene2 (Florida ranch house + palms + sun + mower)
          </li>
          <li>
            <span className={styles.dot} data-strip="mid" />
            MID plane (z=-8) — palms (palms framing ranch house, asymmetric)
          </li>
          <li>
            <span className={styles.dot} data-strip="fg" />
            FG plane (z=-3) — fern (close-up fern frond on paper-cream bg)
          </li>
        </ul>
      </aside>
    </main>
  );
}