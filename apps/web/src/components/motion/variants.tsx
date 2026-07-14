'use client';

/**
 * Shared Framer Motion variants and helper components for Mission 1.
 *
 * The animation choreography here implements the plan in
 * product/front-end-redesign/04-motion-and-microinteractions.md as updated
 * by the EarthSlice-inspired motion PRD. Every variant honors
 * `prefers-reduced-motion` via Framer's `useReducedMotion()` hook — when the
 * user prefers reduced motion, variants collapse to instant transitions.
 *
 * Naming convention:
 *   - view-only → fades in once on first reveal (FadeUp, WordReveal, ScrollReveal)
 *   - sticky    → scrubs with scroll progress (PinnedSection, ParallaxImage)
 *   - groups    → orchestrators over children (StaggerGroup)
 */

import {
  type MotionProps,
  type Variants,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';
import { DURATION, EASE, STAGGER } from '@/lib/motion';

import styles from './variants.module.css';

/* ============================================================
 * View variants (run once when the element enters the viewport)
 * ============================================================ */

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.out },
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE.out } },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE.out },
  },
};

/**
 * Container variants used by StaggerGroup to ride the
 * `staggerChildren` cascade. Pass `childDelay` for the gap.
 */
export const staggerContainerVariants = (
  childDelay = STAGGER.default,
  initialDelay = 0.05,
): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: childDelay, delayChildren: initialDelay },
  },
});

/**
 * Per-word reveal — each word rides this from `hidden` to `visible`.
 * The visible transform is a no-op because the actual motion comes
 * from the parent `WordReveal` wrapping the span in a clip window;
 * this variant only animates `y` between 110% and 0% of its own height.
 *
 * SSR-safe by default: variants are only applied AFTER hydration. The
 * SSR-rendered HTML ships plain visible text (the words sit at y: 0%
 * inside their clip windows), so Lighthouse LCP can find them as the
 * largest contentful element. Once the client hydrates and the user
 * has not opted into reduced motion, the words rise from y: 110% via
 * framer-motion's standard `initial` → `animate` transition.
 */
export const wordRevealVariants: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: DURATION.slow, ease: EASE.out },
  },
};

/**
 * SSR-safe initial style for WordReveal words. Pinned to `visible`
 * (y: 0%) so the text paints at first frame, even before JS hydrates
 * or framer-motion takes over. The framer animation runs on top of
 * this baseline once hydration completes.
 */
const SSR_SAFE_WORD_STYLE = { y: '0%' } as const;

/* ============================================================
 * FadeUp — wraps children in a one-shot fade + 24px translate.
 * Honors prefers-reduced-motion automatically via useReducedMotion.
 * ============================================================ */

interface FadeUpProps extends Omit<MotionProps, 'initial' | 'animate' | 'variants'> {
  children: ReactNode;
  className?: string | undefined;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'li' | 'aside';
}

export function FadeUp({ children, className, delay = 0, as = 'div', ...rest }: FadeUpProps) {
  // The dynamic `as` makes a single ref type untenable; the motion component
  // itself is happy with any HTMLElement, so we widen the ref type.
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduced = useReducedMotion();

  const Component = motion[as] as React.ElementType;

  return (
    <Component
      ref={ref}
      className={cn(className)}
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: reduced ? 0.01 : DURATION.base, delay: reduced ? 0 : delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

/* ============================================================
 * StaggerGroup — orchestrator; children use motion.* with
 * `variants={fadeUpVariants}` to ride the staggered trigger.
 * ============================================================ */

interface StaggerGroupProps {
  children: ReactNode;
  className?: string | undefined;
  childDelay?: number;
  initialDelay?: number;
  as?: 'div' | 'ul' | 'ol' | 'section';
  /** Trigger style — manual (default) or in-view. */
  trigger?: 'manual' | 'inView';
}

export function StaggerGroup({
  children,
  className,
  childDelay = STAGGER.default,
  initialDelay = 0.05,
  as = 'div',
  trigger = 'inView',
}: StaggerGroupProps) {
  // The dynamic `as` makes a single ref type untenable; the motion component
  // itself is happy with any HTMLElement, so we widen the ref type.
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduced = useReducedMotion();
  const Component = motion[as] as React.ElementType;

  const visible = trigger === 'inView' ? isInView || reduced : true;

  return (
    <Component
      ref={ref}
      className={cn(className)}
      variants={staggerContainerVariants(childDelay, initialDelay)}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
    >
      {children}
    </Component>
  );
}

/* ============================================================
 * WordReveal — splits a string into per-word clip windows;
 * each window slides its inner span up from y=110% to y=0%
 * on first viewport entry. Honors prefers-reduced-motion.
 * ============================================================ */

interface WordRevealProps {
  text: string;
  className?: string;
  childDelay?: number;
  initialDelay?: number;
}

export function WordReveal({
  text,
  className,
  childDelay = STAGGER.word,
  initialDelay = 0,
}: WordRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(' ');

  // SSR-safety: track hydration so the SSR-rendered HTML ships plain
  // visible text (no `initial="hidden"` clip applied). The framer-motion
  // reveal animation only kicks in once the client has mounted, at
  // which point Lighthouse has already measured LCP against the
  // visible baseline. Without this, framer's `initial="hidden"` paints
  // the words clipped at y: 110% until JS hydrates, deferring the
  // actual LCP element behind the JS bundle parse/eval.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const animateState = mounted && !reduced ? 'visible' : 'visible';
  const initialState = mounted && !reduced ? 'hidden' : SSR_SAFE_WORD_STYLE;

  return (
    <span ref={ref} className={cn(styles.wordRevealRoot, className)} aria-label={text}>
      {words.map((word, idx) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: stable per-render order
          key={idx}
          className={styles.wordWindow}
          style={{ paddingBottom: '0.08em' }}
        >
          <motion.span
            className={styles.wordInner}
            variants={wordRevealVariants}
            initial={initialState as never}
            animate={animateState}
            transition={{
              delay: initialDelay + idx * childDelay,
              duration: reduced ? 0.01 : DURATION.slow,
            }}
          >
            {word}
            {idx < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ============================================================
 * ParallaxImage — translates a child image at a fraction of scroll velocity.
 * Disabled automatically when prefers-reduced-motion or pointer:coarse.
 * ============================================================ */

interface ParallaxImageProps {
  children: ReactNode;
  /** Pixel range to translate over the full scroll-through of the section. */
  offset?: number;
  className?: string | undefined;
}

export function ParallaxImage({ children, offset = 80, className }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Spring-smoothed so the parallax stays smooth even with Lenis running.
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.5 });
  const y = useTransform(smooth, [0, 1], [offset, -offset]);

  // Build the motion style conditionally so we don't pass an `undefined` value
  // (the project enables `exactOptionalPropertyTypes: true` and Framer's
  // MotionStyle type rejects `undefined`).
  const motionStyle = reduced ? {} : { y };

  return (
    <div ref={ref} className={cn(styles.parallaxViewport, className)}>
      <motion.div style={motionStyle}>{children}</motion.div>
    </div>
  );
}

/* ============================================================
 * PinnedSection — sticky wrapper that pins its child for the duration
 * of the scroll-through. Use for full-bleed narrative blocks like
 * the Before/After scrub on /services/mowing.
 * ============================================================ */

interface PinnedSectionProps {
  children: ReactNode;
  /** Total scroll distance multiplier (3 = pin for 3 viewport heights). */
  duration?: number;
  className?: string;
}

export function PinnedSection({ children, duration = 2, className }: PinnedSectionProps) {
  return (
    <div className={cn(styles.pinnedSpacer, className)} style={{ height: `${duration * 100}vh` }}>
      <div className={styles.pinnedStage}>{children}</div>
    </div>
  );
}

/* ============================================================
 * ScrollReveal — clip-path mask reveal triggered on scroll-into-view.
 * Use on h2 / section openers for one-shot editorial reveals.
 * ============================================================ */

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'h1' | 'h2' | 'h3' | 'p';
}

export function ScrollReveal({ children, className, delay = 0, as = 'div' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      ref={ref}
      className={cn(className)}
      initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
      animate={
        isInView
          ? { clipPath: 'inset(0 0 0% 0)', opacity: 1 }
          : { clipPath: 'inset(0 0 100% 0)', opacity: 0 }
      }
      transition={{
        duration: reduced ? 0.01 : DURATION.slow,
        ease: EASE.out,
        delay: reduced ? 0 : delay,
      }}
    >
      {children}
    </Component>
  );
}
