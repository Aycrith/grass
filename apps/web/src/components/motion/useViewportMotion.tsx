'use client';

/**
 * useViewportMotion — shared scroll-coupled parallax hook.
 *
 * D-0044 Viewport Motion Architecture substrate. Returns a
 * spring-smoothed scroll progress value plus per-layer motion
 * values mapped to the cadence presets defined in
 * `VIEWPORT_MOTION_VARIANTS`.
 *
 * Honors:
 *   - prefers-reduced-motion (returns static 0 progress)
 *   - coarse pointer / touch devices (returns static 0 progress)
 *   - viewport width ≤ 768 px (returns static 0 progress)
 *
 * The hook is designed to be consumed by hero layer components;
 * each layer reads its own `y` / `x` transform from the returned
 * `layers[layerId]` map.
 */

import {
  type MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export type ViewportMotionLayerId = 'sky' | 'egret' | 'fern' | 'mower' | 'songbirds' | 'gouache' | 'birdbath';

export interface ViewportMotionPreset {
  /** Scroll progress multiplier (0..1). */
  cadence: number;
  /** Max vertical translation in px. */
  translateY: number;
  /** Max horizontal translation in px (optional). */
  translateX?: number;
}

export const VIEWPORT_MOTION_VARIANTS: Record<ViewportMotionLayerId, ViewportMotionPreset> = {
  sky: { cadence: 0.05, translateY: 6 },
  egret: { cadence: 0.1, translateY: 12 },
  fern: { cadence: 0.22, translateY: 28 },
  mower: { cadence: 0.18, translateY: 22 },
  songbirds: { cadence: 0.28, translateY: 36 },
  gouache: { cadence: 0.32, translateY: 44 },
  // 2026-07-23 — 4th cartoon plane. The birdbath sits in the
  // foreground dead space (slightly above the grass tufts, below
  // the houses). It is the most reactive element in the dead space
  // (1.20x layer parallax + 0.36 cadence = the birdbath feels
  // "closest" to the visitor).
  birdbath: { cadence: 0.36, translateY: 48 },
};

export interface ViewportMotionResult {
  /** Raw 0..1 scroll progress (spring-smoothed). */
  progress: MotionValue<number>;
  /** True when motion is disabled by user preference or device. */
  reduced: boolean;
  /** Per-layer motion values. */
  layers: Record<ViewportMotionLayerId, { y: MotionValue<number>; x: MotionValue<number> }>;
}

/**
 * useViewportMotion — returns scroll-coupled motion values for hero layers.
 *
 * SSR note: `reducedMotion`, coarse-pointer, and narrow-viewport checks
 * are client-side only. On SSR the hook returns `reduced=false` and the
 * motion values are active. After hydration, if any disable condition is
 * met, the values collapse to zero via useTransform. This is intentional:
 * the parent `HeroFieldTelemetry` already gates storybook mount with
 * `enableScrollFade`, so the SSR output is consistent and the post-mount
 * collapse is harmless.
 *
 * @param targetRef - ref to the section whose scroll progress drives motion.
 */
export function useViewportMotion(
  targetRef: React.RefObject<HTMLElement | null>,
): ViewportMotionResult {
  const reducedMotion = useReducedMotion();
  const [isCoarse, setIsCoarse] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarseQuery = window.matchMedia('(pointer: coarse)');
    const narrowQuery = window.matchMedia('(max-width: 768px)');

    const update = () => {
      setIsCoarse(coarseQuery.matches);
      setIsNarrow(narrowQuery.matches);
    };

    update();
    coarseQuery.addEventListener('change', update);
    narrowQuery.addEventListener('change', update);
    return () => {
      coarseQuery.removeEventListener('change', update);
      narrowQuery.removeEventListener('change', update);
    };
  }, []);

  const disabled = Boolean(reducedMotion || isCoarse || isNarrow);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.5,
  });

  // D-0044 — per-layer transforms. Declared at the top level (not in a
  // loop) so React hook order is stable across renders. The layer count
  // is fixed by VIEWPORT_MOTION_VARIANTS, but lint rules still require
  // hooks to be unconditional.
  const skyY = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -VIEWPORT_MOTION_VARIANTS.sky.translateY],
  );
  const skyX = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -(VIEWPORT_MOTION_VARIANTS.sky.translateX ?? 0)],
  );
  const egretY = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -VIEWPORT_MOTION_VARIANTS.egret.translateY],
  );
  const egretX = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -(VIEWPORT_MOTION_VARIANTS.egret.translateX ?? 0)],
  );
  const fernY = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -VIEWPORT_MOTION_VARIANTS.fern.translateY],
  );
  const fernX = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -(VIEWPORT_MOTION_VARIANTS.fern.translateX ?? 0)],
  );
  const mowerY = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -VIEWPORT_MOTION_VARIANTS.mower.translateY],
  );
  const mowerX = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -(VIEWPORT_MOTION_VARIANTS.mower.translateX ?? 0)],
  );
  const songbirdsY = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -VIEWPORT_MOTION_VARIANTS.songbirds.translateY],
  );
  const songbirdsX = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -(VIEWPORT_MOTION_VARIANTS.songbirds.translateX ?? 0)],
  );
  const gouacheY = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -VIEWPORT_MOTION_VARIANTS.gouache.translateY],
  );
  const gouacheX = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -(VIEWPORT_MOTION_VARIANTS.gouache.translateX ?? 0)],
  );
  // 2026-07-23 — 4th cartoon plane. The birdbath is the most
  // reactive element in the foreground dead space (0.36 cadence,
  // 48px translateY) — slightly more than the gouache (scene 2)
  // so the visitor reads the birdbath as the closest foreground
  // element during the [0.00, 0.10] storybook resting state.
  const birdbathY = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -VIEWPORT_MOTION_VARIANTS.birdbath.translateY],
  );
  const birdbathX = useTransform(
    progress,
    [0, 1],
    disabled ? [0, 0] : [0, -(VIEWPORT_MOTION_VARIANTS.birdbath.translateX ?? 0)],
  );

  const layers: ViewportMotionResult['layers'] = useMemo(
    () => ({
      sky: { y: skyY, x: skyX },
      egret: { y: egretY, x: egretX },
      fern: { y: fernY, x: fernX },
      mower: { y: mowerY, x: mowerX },
      songbirds: { y: songbirdsY, x: songbirdsX },
      gouache: { y: gouacheY, x: gouacheX },
      birdbath: { y: birdbathY, x: birdbathX },
    }),
    [
      skyY,
      skyX,
      egretY,
      egretX,
      fernY,
      fernX,
      mowerY,
      mowerX,
      songbirdsY,
      songbirdsX,
      gouacheY,
      gouacheX,
      birdbathY,
      birdbathX,
    ],
  );

  return {
    progress,
    reduced: disabled,
    layers,
  };
}
