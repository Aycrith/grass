'use client';

/**
 * LenisProvider — wraps the app in Lenis smooth-scroll.
 *
 * Why Lenis: it gives us buttery momentum without GSAP's lock-in cost or
 * Locomotive's stale API. ~5KB gzipped. Cooperates with Framer Motion's
 * `useScroll` / `useTransform` without manual coupling.
 *
 * Reduced motion: when `prefers-reduced-motion: reduce`, Lenis is constructed
 * with `smoothWheel: false` and the underlying RAF loop still ticks but does
 * not animate the document. We also respect `pointer: coarse` and ≤768px by
 * effectively disabling the smooth scroll (Lenis becomes `smoothWheel: false`).
 *
 * Phase A8 introduces this wrapper; Phase C (HeroCinematic) is the first
 * consumer. The wrapping is invisible until scroll-linked components appear.
 */

import { ReactLenis } from 'lenis/react';
import { type ReactNode, useEffect, useState } from 'react';

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const [reduced, setReduced] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');
    const mqMobile = window.matchMedia('(max-width: 768px)');
    const update = () => {
      setReduced(mqReduced.matches);
      setCoarse(mqCoarse.matches || mqMobile.matches);
    };
    update();
    mqReduced.addEventListener('change', update);
    mqCoarse.addEventListener('change', update);
    mqMobile.addEventListener('change', update);
    return () => {
      mqReduced.removeEventListener('change', update);
      mqCoarse.removeEventListener('change', update);
      mqMobile.removeEventListener('change', update);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        // Disable the actual smooth-scroll behavior on reduced-motion or
        // mobile (coarse pointer + narrow viewport). The provider still
        // ticks so the rest of the tree does not have to mount-condition.
        duration: reduced || coarse ? 0 : 1.2,
        smoothWheel: !reduced && !coarse,
        syncTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        lerp: 0.1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
