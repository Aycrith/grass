/**
 * PinnedBeforeAfter — scroll-pinned before/after scrub.
 *
 * Mounts ONLY when the steward has set `services[mowing].beforeAfter`
 * to a permission-verified pair (before + after URLs + `permission: true`).
 * The /services/[slug] route enforces that gate before this component
 * ever mounts, so receiving non-empty URLs here already implies consent.
 *
 * Behavior:
 *   - Desktop (fine pointer + motion allowed): the section pins for ~150%
 *     viewport height; as the user scrolls through it, the after-image
 *     clip-path scrubs from 0% → 100%, revealing the cleaned yard.
 *   - Mobile / coarse pointer: pinning is disabled — the panel sits in
 *     normal flow with a draggable range input so touch users can still
 *     scrub.
 *   - Reduced motion: pinning + scroll-scrub disabled; renders a static
 *     side-by-side pair (keyboard / screen-reader / senior-friendly).
 *
 * Imagery: real photos only. Until the steward provides permission-verified
 * before + after photos, the gating layer at the route returns null and this
 * component never renders. Invented customer photos are forbidden by brand.
 */

'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';

import styles from './PinnedBeforeAfter.module.css';

interface PinnedBeforeAfterProps {
  before: string;
  after: string;
  caption?: string | undefined;
  className?: string | undefined;
}

export function PinnedBeforeAfter({
  before,
  after,
  caption,
  className,
}: PinnedBeforeAfterProps): React.ReactNode {
  // Manual scrub position (used on mobile / when pinned scroll-scrub is off).
  const [pos, setPos] = useState(50);
  const [reduced, setReduced] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerMq = window.matchMedia('(pointer: coarse)');
    setReduced(motionMq.matches);
    setCoarse(pointerMq.matches);
    const onMotion = () => setReduced(motionMq.matches);
    const onPointer = () => setCoarse(pointerMq.matches);
    motionMq.addEventListener('change', onMotion);
    pointerMq.addEventListener('change', onPointer);
    return () => {
      motionMq.removeEventListener('change', onMotion);
      pointerMq.removeEventListener('change', onPointer);
    };
  }, []);

  const useStaticLayout = reduced;
  const useManualScrub = !reduced && coarse;

  // Pinned scroll-scrub: drive clipPath inset from 0% → 100% as the section
  // passes through the viewport. `useSpring` keeps it smooth under Lenis.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.6,
  });
  const pinnedClipPct = useTransform(smoothProgress, [0, 1], [0, 100]);
  const pinnedClipPath = useTransform(pinnedClipPct, (p) => `inset(0 0 0 ${p}%)`);

  return (
    <section
      ref={sectionRef}
      className={cn(
        styles.root,
        useStaticLayout ? styles.rootStatic : styles.rootPinned,
        className,
      )}
      aria-label="Before and after lawn transformation"
    >
      <div className={styles.pinStage}>
        <div className={styles.pinFrame}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Same yard, one visit</span>
            <h2 className={styles.heading}>Drag, or scroll, to reveal the cut.</h2>
            <p className={styles.note}>
              {useStaticLayout
                ? 'A static before-and-after comparison for reduced-motion viewing.'
                : useManualScrub
                  ? 'Drag the handle below to compare the before and after.'
                  : 'Keep scrolling — the cut reveals itself.'}
            </p>
          </div>

          <div className={styles.scrubFrame}>
            {useStaticLayout ? (
              <div className={styles.staticPair}>
                <figure className={styles.staticFig}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={before} alt="Lawn before service." />
                  <figcaption>Before</figcaption>
                </figure>
                <figure className={styles.staticFig}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={after} alt="Lawn after service." />
                  <figcaption>After</figcaption>
                </figure>
              </div>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={before} alt="" className={styles.layer} />
                <motion.div
                  className={styles.afterLayer}
                  {...(useManualScrub ? {} : { style: { clipPath: pinnedClipPath } })}
                >
                  {useManualScrub ? (
                    <div
                      className={styles.afterLayerManual}
                      style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={after} alt="Lawn after service." />
                    </div>
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={after} alt="Lawn after service." />
                    </>
                  )}
                </motion.div>
                {useManualScrub ? (
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={pos}
                    onChange={(e) => setPos(Number(e.currentTarget.value))}
                    className={styles.handle}
                    aria-label="Drag to reveal before and after."
                  />
                ) : null}
                <div className={styles.labels}>
                  <span className={styles.labelA}>Before</span>
                  <span className={styles.labelB}>After</span>
                </div>
              </>
            )}
          </div>

          {caption ? <p className={styles.caption}>{caption}</p> : null}
        </div>
      </div>
    </section>
  );
}
