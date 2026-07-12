/**
 * Motion tokens — Mission 1
 *
 * Mirrors src/styles/tokens.css → --motion-* custom properties so JS-driven
 * animations (Framer Motion variants, GSAP timelines) stay in lockstep with
 * CSS-driven transitions. Keep the two in sync.
 *
 * Easing tuples: cubic-bezier(x1, y1, x2, y2). Convert from CSS via:
 *   var(--motion-easing-default) → [0.4, 0, 0.2, 1]
 *
 * Reduced motion: Framer Motion's `useReducedMotion()` returns `true` for users
 * with `prefers-reduced-motion: reduce`. Wrap variants in a MotionConfig at root
 * (Phase A8 wraps LenisProvider + MotionConfig together).
 */

export const EASE = {
  /** expo-out — hero reveals, headline word-by-word clip */
  out: [0.16, 1, 0.3, 1] as const,
  /** in-out — scrub timelines, pinned sections */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** default UI — hovers, fades, small movements */
  soft: [0.4, 0, 0.2, 1] as const,
  /** entrance — banner slide-down, hero image fade */
  enter: [0.22, 1, 0.36, 1] as const,
  /** exit — drawer close, banner dismiss */
  exit: [0.4, 0, 1, 1] as const,
};

export const DURATION = {
  fast: 0.15, // hover, focus ring
  base: 0.24, // most transitions
  slow: 0.4, // page transitions
  hero: 0.8, // hero image fade-in only
  pinned: 1.2, // pinned section scrub
};

export const STAGGER = {
  tight: 0.04,
  default: 0.08,
  loose: 0.12,
  word: 0.06, // headline word-by-word reveal
};

/** Common Framer Motion variants. Compose with custom motion components. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.out, delay },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE.out, delay },
  }),
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE.out, delay },
  }),
};

/** Headline word-by-word reveal — drives the HeroCinematic clip-path animation. */
export const wordReveal = {
  hidden: { y: '110%' },
  visible: (delay = 0) => ({
    y: '0%',
    transition: { duration: DURATION.slow, ease: EASE.out, delay },
  }),
};

/** Container that staggers its direct motion children. */
export const staggerContainer = (childDelay = STAGGER.default, initialDelay = 0.05) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: childDelay,
      delayChildren: initialDelay,
    },
  },
});

/** Breakpoint helpers — JS twin of the CSS @media (max-width: …) gates. */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 900,
  xl: 1024,
  xxl: 1280,
} as const;

/** True when the running browser should run heavy scroll-driven animations. */
export function shouldAnimate(): boolean {
  if (typeof window === 'undefined') return false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return false;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse) return false;
  return window.innerWidth >= BREAKPOINTS.md;
}
