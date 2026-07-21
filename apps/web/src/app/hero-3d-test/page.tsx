'use client';

/**
 * `/hero-3d-test` page — D-0049 real-browser review surface.
 *
 * Mounts `<SecondScene />` in isolation with mock MotionValues so the
 * scene renders as it does at scroll ~95% in the production hero
 * (fully revealed, content fully visible). The page has minimal chrome:
 * title, scene-opacity slider, content-opacity slider, and the scene
 * panel itself.
 *
 * D-0049 — replaced the D-0048 HeroScene3D import with the new
 * SecondScene component. The 3-plane legend + camera-orbit slider
 * are gone because the new component is pure-CSS (no Three.js).
 *
 * Steward workflow:
 *   1. Navigate to /hero-3d-test in a real browser
 *   2. Observe: painted scene filling the panel (no black column!)
 *   3. Observe: ambient scene2 cycling (10s/frame)
 *   4. Observe: palms foreground parallax (12s/frame, drifts)
 *   5. Drag the sliders to test opacity behavior
 *
 * Renders identically in headless Chrome (no WebGL dependency).
 */
import { motionValue, type MotionValue } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';

import { SecondScene } from '@/components/sections/SecondScene';

import styles from './page.module.css';

function makeMotionValue(initial: number): MotionValue<number> {
  return motionValue<number>(initial);
}

export default function Hero3DTestPage(): ReactNode {
  const [opacity, setOpacity] = useState(1);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  const opacityMV = useState(() => makeMotionValue(1))[0];
  const contentMV = useState(() => makeMotionValue(1))[0];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    opacityMV.set(opacity);
  }, [opacity, opacityMV]);
  useEffect(() => {
    contentMV.set(contentOpacity);
  }, [contentOpacity, contentMV]);

  return (
    <main className={styles.root}>
      <div className={styles.scenePanel}>
        <SecondScene
          opacity={opacityMV}
          contentOpacity={contentMV}
          perZipStrip={{
            eyebrow: 'Where this lives.',
            cards: [
              { zip: '33756', label: 'Belleair / Clearwater', href: '/areas/33756' },
              { zip: '33770', label: 'Belleair Bluffs / Largo', href: '/areas/33770' },
              { zip: '33771', label: 'Largo (central)', href: '/areas/33771' },
              { zip: '33773', label: 'Largo (east)', href: '/areas/33773' },
              { zip: '33774', label: 'Largo / Ridgecrest', href: '/areas/33774' },
              { zip: '33778', label: 'Seminole / Largo West', href: '/areas/33778' },
            ],
          }}
          perZipStripOpacity={opacityMV}
          scene2={{
            eyebrow: 'CHAPTER 2 — THE COMMITMENT',
            headline: 'Same yard, every week.',
            subhead:
              'No swap, no franchise markup. The same operator shows up at the same address on the same day, until you say stop.',
            primaryCta: { label: 'See my route', href: '/service-areas' },
            secondaryCta: { label: 'See pricing', href: '/pricing' },
          }}
        />
      </div>

      <aside className={styles.debug}>
        <h1 className={styles.title}>D-0049 — Hero SecondScene Test</h1>
        <p className={styles.note}>
          Real-browser mount surface. Pure-CSS — renders identically in
          headless Chrome. The D-0048 Three.js HeroScene3D was removed
          (it produced a black-column rendering bug in production).
        </p>
        <dl className={styles.metrics}>
          <dt>reduced-motion</dt>
          <dd>{reducedMotion ? 'reduce' : 'no-preference'}</dd>
          <dt>opacity</dt>
          <dd>{opacity.toFixed(2)}</dd>
          <dt>contentOpacity</dt>
          <dd>{contentOpacity.toFixed(2)}</dd>
        </dl>
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
            <span className={styles.dot} data-strip="scene" />
            Painted scene (scene2-01..06.webp) — 10s CSS-step cycle
          </li>
          <li>
            <span className={styles.dot} data-strip="palms" />
            Foreground palms (palms-01..06.webp) — 12s cycle, mix-blend multiply
          </li>
        </ul>
      </aside>
    </main>
  );
}
