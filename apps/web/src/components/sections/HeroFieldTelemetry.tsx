'use client';

/**
 * HeroFieldTelemetry - the unified production hero.
 *
 * Concept: the visitor starts inside an animated Florida storybook
 * (sky + clouds + distant palms + swaying ranch palms + foreground
 * grass + a small lawn mower that drives across the scene). As they
 * scroll, the storybook cross-fades into the real 4K photograph of a
 * freshly-mowed lawn, with the live status, field stamp, and telemetry
 * stats revealing on top of the photo. The cartoon world literally
 * dissolves into the working operation.
 *
 * Layer stack (z-index, bottom to top):
 *   0  BackgroundPhoto.photoWrap     - motion.div, scroll-driven scale
 *      BackgroundPhoto.photoImg      - 4K Florida lawn photograph
 *      BackgroundPhoto.photoGrade    - sunset warmth gradient overlay
 *   1  Vignette + Scrim              - text legibility on the left
 *   2  HeroStorybookLayer            - SVG landscape, blur+saturate out
 *   3  Content (eyebrow + headline + subhead + CTAs) - always visible
 *   4  LiveStatus / FieldStamp / TelemetryStats - shared fade-in
 *
 * Scroll-driven cross-fade ranges (driven by useScroll on the section):
 *   0.00 - 0.10  storybook fully visible, grade overlay at full warmth
 *   0.10 - 0.40  storybook blurs+desaturates+fades to 0 in lockstep
 *                with the photo's warmth grade easing to 0. Together
 *                this effect reads as "sunset dissolves into noon"
 *                instead of two distinct color worlds fighting each
 *                other. Ken Burns scale+pan runs gently across the
 *                same window so the photo motion is on the user's
 *                scroll clock rather than a free-running CSS keyframe.
 *   0.40 - 0.60  layer-4 overlays (LiveStatus + FieldStamp +
 *                TelemetryStats) rise together via a shared `uiOpacity`
 *                and `uiY`. Single fade-in, no muddied middle frame
 *                where vector clouds + 4K photo + dashboard stack.
 *   0.60 - 1.00  resting state - photo + content + telemetry
 *
 * Mobile + reduced-motion: section collapses to 100svh, the storybook
 * is hidden, the photo-grade overlay is hidden, and the user sees the
 * photo + content + dashboard without any scroll-scrubbed animation.
 * Battery / thermal budget on phones is respected.
 *
 * Replaces (history):
 *   - HeroCinematic (SDXL painterly image, reverted 2026-07-15)
 *   - HeroMowerScene (200svh scroll-pinned SVG, superseded 2026-07-17
 *     because its content had no path into the 4K photo world)
 *   - HeroFieldTelemetryScene (WebGL grass overlay, removed 2026-07-17
 *     because the SDF blades looked like incoherent shards of green)
 *
 * D-0043 (cinematic cross-fade):
 *   - Color-grade overlay on the photo so the warm storybook above
 *     and the warm-tinted photo below feel like one world at scroll
 *     start, not two competing color temperatures.
 *   - Scroll-locked Ken Burns so photo micro-motion rides the user's
 *     gesture instead of fighting it on a 32s alternate CSS cycle.
 *   - Blur(0→14px) + saturate(100%→0%) on the storybook dissolve
 *     so the SVG vector graphics soften into a ghost rather than
 *     cut out hard against the photo's natural edges.
 *   - Shared `uiOpacity` / `uiY` for the layer-4 overlays so the
 *     dashboard rises together after the photo settles instead of
 *     stacking during the muddy middle of the dissolve.
 *
 * Brand fidelity:
 *   - Cream / Palm Green / Sun / Clay palette (locked CSS variables)
 *   - Fraunces display + Inter body (locked)
 *   - Conversion verbs (locked)
 *   - id="hero" preserved so the ConversionRail still works
 */

import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

import { HeroStorybookLayer } from './HeroStorybookLayer';

import styles from './HeroFieldTelemetry.module.css';

const HEADLINE_LINES = [
  ['Your', "neighbor's"],
  ['lawn', 'mower.'],
] as const;

const TELEMETRY_STATS = [
  { value: '47', label: 'Yards on route' },
  { value: '18h', label: 'Quote turnaround' },
  { value: '6 yrs', label: 'Cutting in 33771' },
  { value: '6', label: 'Pinellas ZIPs' },
] as const;

interface HeroFieldTelemetryProps {
  className?: string;
  eyebrow: string;
  subhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  /** ISO datetime to start the "now" anchor. Defaults to current time. */
  now?: string;
}

/**
 * HeroFieldTelemetry - the unified production hero.
 *
 * (See big block-comment above for the full D-0043 design rationale.
 *  This alias stays inline for `HeroFieldTelemetry`'s implementation.)
 */

export function HeroFieldTelemetry({
  className,
  eyebrow,
  subhead,
  primaryCta,
  secondaryCta,
  now,
}: HeroFieldTelemetryProps): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  // D-0043 (rev 2) — default `enableScrollFade` is `true`. This is
  // the SSR-safe pattern that eliminates the hydration flash. The
  // desktop SSR HTML ships (a) the storybook mount and (b) the
  // layer-4 dashboard widgets as `motion.div` with inline opacity
  // driven by the scroll progress. The effect below flips the
  // flag to `false` on phone / coarse pointer / reduced-motion
  // surfaces; React unmounts the storybook and CSS !important
  // overrides the dashboard's inline opacity:0 to opacity:1. On
  // desktop the flag stays `true` and nothing changes between SSR
  // and hydration, so the first paint matches the steady state —
  // no flash in either direction.
  const [enableScrollFade, setEnableScrollFade] = useState(true);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    setEnableScrollFade(!(reducedMotion || isCoarse));
  }, [reducedMotion]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Smooth the raw progress so the cross-fade feels like a dissolve,
  // not a snap. Spring is light enough that scroll still feels
  // responsive but heavy enough to hide scroll-flicker.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.5,
  });

  // D-0043 — shared layer-4 timing. LiveStatus + FieldStamp +
  // TelemetryStats all read `uiOpacity` / `uiY` so they rise together
  // once the photo has settled on its natural vivid green. The
  // 12px y-offset matches the prior TelemetryStats offset so the
  // stamp + live status adopted the exact same idiom. Without the
  // shared timing the prior implementation had history ranges that
  // overlap the storybook fade-out, producing muddy mid-frame
  // where vector clouds + 4K photo + dashboard were all stacked.
  const uiOpacity = useTransform(smoothProgress, [0.40, 0.60], [0, 1]);
  const uiY = useTransform(smoothProgress, [0.40, 0.60], [12, 0]);

  return (
    <section
      ref={sectionRef}
      className={cn(styles.root, className)}
      id="hero"
      data-test-section="hero"
      aria-label="Largo Lawn - your neighbor's lawn mower hero"
    >
      <div className={styles.viewport}>
        {/* Z 0: real 4K Florida lawn photograph. */}
        <BackgroundPhoto progress={smoothProgress} />

        {/* Z 1: vignette + scrim for text legibility. */}
        <div className={styles.scrim} aria-hidden="true" />

        {/* Z 2: animated SVG storybook layer. Cross-fades out as the
         * visitor scrolls so the photo becomes the resting state.
         * On mobile + reduced-motion the storybook is not mounted at
         * all so the CSS keyframe animations (clouds, palms, birds)
         * don't burn CPU on phones. */}
        {enableScrollFade && (
          <div
            className={styles.storybookWrap}
            aria-hidden="true"
            data-testid="hero-storybook"
          >
            <HeroStorybookLayer progress={smoothProgress} collapsed={false} />
          </div>
        )}

        {/* Z 3: text + CTAs. Always visible across the transition so
         * the visitor always knows where they are and what the page
         * is selling. */}
        <div className={styles.content}>
          <Content
            eyebrow={eyebrow}
            subhead={subhead}
            primaryCta={primaryCta}
            secondaryCta={secondaryCta}
          />
        </div>

        {/* Z 4: live status (top right), field stamp (bottom left),
         * and telemetry stats (bottom right).
         *   - LiveStatus + TelemetryStats are always `motion.div`
         *     with `style={{ opacity: uiOpacity, y: uiY }}` driving
         *     the cinematic fade-in on desktop scroll users.
         *   - On phone / coarse-pointer / reduced-motion surfaces,
         *     a CSS `!important` override in the module CSS forces
         *     opacity:1 + transform:none on these widgets — no React
         *     conditional branching, so no SSR->hydration flash.
         *   - FieldStamp is decorative passport chrome on the
         *     postcard, not dashboard chrome, so it is always a
         *     plain `<div>` regardless of scroll motion. */}
        <LiveStatus
          now={now ?? undefined}
          uiOpacity={uiOpacity}
          uiY={uiY}
        />
        <FieldStamp />
        <TelemetryStats
          uiOpacity={uiOpacity}
          uiY={uiY}
          progress={smoothProgress}
        />
      </div>
    </section>
  );
}

/* ============================================================
 * Content - eyebrow + headline + subhead + CTAs. Always visible.
 * ============================================================ */

function Content({
  eyebrow,
  subhead,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  subhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}): ReactNode {
  return (
    <>
      <span className={styles.eyebrow}>{eyebrow}</span>

      <h1 className={styles.headline}>
        {HEADLINE_LINES.map((line, li) => (
          <span key={li} className={styles.headlineLine}>
            {line.map((word, wi) => (
              <RevealWord
                // biome-ignore lint/suspicious/noArrayIndexKey: stable per-render order
                key={wi}
                word={word}
                delay={li * 0.18 + wi * 0.08}
                withSpace={wi < line.length - 1}
              />
            ))}
          </span>
        ))}
      </h1>

      <motion.p
        className={styles.subhead}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {subhead}
      </motion.p>

      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <MagneticCta href={primaryCta.href} variant="sun" size="lg">
          {primaryCta.label}
          <span className={styles.ctaArrow} aria-hidden="true">
            →
          </span>
        </MagneticCta>
        <MagneticCta href={secondaryCta.href} variant="ghost" size="lg">
          {secondaryCta.label}
        </MagneticCta>
      </motion.div>
    </>
  );
}

/* ============================================================
 * BackgroundPhoto - the real Florida lawn photograph.
 *
 * D-0043 — three coordinated refinements sit inside this layer:
 *
 *   1. .photoWrap (motion.div) carries scroll-driven scale (1.02 →
 *      1.08) and y (-1.5% → 1%), replacing the 32s alternate CSS
 *      keyframe that previously ran on the photo's own clock. The
 *      photo now moves on the user's scroll clock, in lockstep
 *      with the storybook dissolve and the warmth grade below.
 *
 *   2. .photoGrade (motion.div, above the photo) blends a
 *      sun-gradient sunset warmth at opacity 0.55 → 0 across
 *      [0.10, 0.40] via mix-blend-mode: overlay. At scroll 0 the
 *      photo reads as warm sunset, matching the storybook layer
 *      above; as the storybook dissolves, the photo wakes into
 *      its natural vivid green.
 *
 *   3. CSS gates .photoGrade via @media (max-width: 767px),
 *      (pointer: coarse), and (prefers-reduced-motion: reduce)
 *      so the resting-state photo on phones + reduced-motion is
 *      never tinted warm. Runtime `enableScrollFade=false` already
 *      unmounts the storybook and the effective scroll progress
 *      stays ~0 on mobile; the CSS gate is the source of truth
 *      for the grade's visibility on those surfaces.
 * ============================================================ */

function BackgroundPhoto({ progress }: { progress: MotionValue<number> }): ReactNode {
  // Reduced motion collapses both transforms - photo stays put.
  const reduced = useReducedMotion();
  // D-0043 (rev) — first-paint composition. The previous range
  // [0, 0.50] -> [1.02, 1.08] started the photo at 1.02 with a
  // -1.5% y-shift on every render, which meant a desktop visitor
  // landing on the hero saw the photo pre-cropped even before they
  // scrolled. Range is now [0, 0.50] -> [1, 1.08] (and [0%, 1%])
  // so the photo's first paint matches its natural composition
  // and the camera zoom-in reads as the user engages with scroll.
  const photoScale = useTransform(
    progress,
    [0, 0.50],
    reduced ? [1, 1] : [1, 1.08],
  );
  const photoY = useTransform(
    progress,
    [0, 0.50],
    reduced ? ['0%', '0%'] : ['0%', '1%'],
  );
  // Color-grade overlay matches the storybook fade range so the two
  // share one dissolve boundary at scroll 0.40. Mixed in via
  // mix-blend-mode: overlay rather than as a transparency overlay
  // because overlay preserves the photo's natural highlights
  // (skies stay bright, grass blades aren't washed out).
  const gradeOpacity = useTransform(
    progress,
    [0.10, 0.40],
    reduced ? [0, 0] : [0.55, 0],
  );

  return (
    <div className={styles.photo} aria-hidden="true">
      <motion.div
        className={styles.photoWrap}
        style={{ scale: photoScale, y: photoY }}
      >
        <Image
          src="/hero/v2/hero-green-grass.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.photoImg}
        />
        <motion.div className={styles.photoGrade} style={{ opacity: gradeOpacity }} />
      </motion.div>
      <div className={styles.photoVignette} />
    </div>
  );
}

/* ============================================================
 * LiveStatus - the "currently mowing" widget.
 * Always rendered as a single `motion.div` with
 * `style={{ opacity: uiOpacity, y: uiY }}` driving the cinematic
 * fade-in on desktop scroll users. On phone / coarse-pointer /
 * reduced-motion surfaces the CSS `!important` rule in
 * HeroFieldTelemetry.module.css overrides the inline opacity:0
 * to opacity:1 + transform:none — so the dashboard is always
 * visible on those surfaces with zero React branching.
 * ============================================================ */

function LiveStatus({
  now,
  uiOpacity,
  uiY,
}: {
  now: string | undefined;
  uiOpacity: MotionValue<number>;
  uiY: MotionValue<number>;
}): ReactNode {
  const reduced = useReducedMotion();
  const [minute, setMinute] = useState(() => {
    const anchor = now ? new Date(now).getTime() : Date.now();
    return Math.floor(anchor / 60000);
  });
  useEffect(() => {
    const id = setInterval(() => setMinute((m) => m + 1), 60000);
    return () => clearInterval(id);
  }, []);

  // Rotate through 3 plausible states based on time.
  const cycle = minute % 12;
  let status: { dot: string; line1: string; line2: string };
  if (cycle < 5) {
    status = {
      dot: 'on',
      line1: 'Mowing now',
      line2: '1274 6th St NE, 33771',
    };
  } else if (cycle < 9) {
    status = {
      dot: 'soon',
      line1: 'Next slot',
      line2: 'Tuesday 7:30am, 33771',
    };
  } else {
    status = {
      dot: 'open',
      line1: 'Route has room',
      line2: 'Quote within 24h',
    };
  }

  return (
    <motion.div
      className={styles.liveStatus}
      style={{ opacity: uiOpacity, y: uiY }}
      role="status"
      aria-live="polite"
    >
      <span className={styles.liveStatusRow}>
        <span
          className={cn(
            styles.liveStatusDot,
            status.dot === 'on' && styles.liveStatusDotOn,
            status.dot === 'soon' && styles.liveStatusDotSoon,
            status.dot === 'open' && styles.liveStatusDotOpen,
          )}
          aria-hidden="true"
        >
          {!reduced && <span className={styles.liveStatusPulse} />}
        </span>
        <span className={styles.liveStatusLabel}>LIVE</span>
      </span>
      <span className={styles.liveStatusLine1}>{status.line1}</span>
      <span className={styles.liveStatusLine2}>{status.line2}</span>
      <span className={styles.liveStatusMeta}>
        Updated {minute % 60 === 0 ? 'just now' : `${minute % 60}m ago`}
      </span>
    </motion.div>
  );
}

/* ============================================================
 * FieldStamp - "EST 2026 LARGO FL" passport stamp.
 * Tilted, like a hand-pressed stamp. Decoration on the photo,
 * NOT dashboard chrome - always visible on desktop, hidden on
 * mobile (the live status pill carries the load). Bound here as
 * a plain <div> (not motion.div) so reduced-motion + mobile
 * visitors still see the stamp at scroll 0 - it was a
 * pre-existing element of the postcard, not an overlay that
 * comes in after the dissolve.
 * ============================================================ */

function FieldStamp(): ReactNode {
  return (
    <div className={styles.stamp} aria-hidden="true">
      <span className={styles.stampInner}>
        <span>EST · 2026</span>
        <span className={styles.stampDot}>·</span>
        <span>LARGO</span>
        <span className={styles.stampDot}>·</span>
        <span>FL</span>
      </span>
    </div>
  );
}

/* ============================================================
 * TelemetryStats - the "field log" stats strip.
 * Always rendered as a single `motion.div` with
 * `style={{ opacity: uiOpacity, y: uiY }}` driving the cinematic
 * fade-in. See `LiveStatus` for the full rationale + the
 * CSS `!important` override in HeroFieldTelemetry.module.css
 * that overrides inline opacity:0 on phone / coarse-pointer /
 * reduced-motion surfaces.
 * ============================================================ */

function TelemetryStats({
  uiOpacity,
  uiY,
  progress,
}: {
  uiOpacity: MotionValue<number>;
  uiY: MotionValue<number>;
  progress: MotionValue<number>;
}): ReactNode {
  // D-0043 (rev 4) — per-stat micro-cascade with vertical lift.
  // Each stat rides its own narrow scroll window (0.04 step) for
  // BOTH opacity and a subtle y offset (12px → 0px) so the strip
  // reads as settling into place rather than just fading in:
  //   stat 0 (47)     opacity [0.42, 0.46],  y [0.42, 0.46]  [12, 0]
  //   stat 1 (18h)    opacity [0.46, 0.50],  y [0.46, 0.50]  [12, 0]
  //   stat 2 (6 yrs)  opacity [0.50, 0.54],  y [0.50, 0.54]  [12, 0]
  //   stat 3 (6)      opacity [0.54, 0.58],  y [0.54, 0.58]  [12, 0]
  // The y rides the same window as the opacity so the lift and
  // the reveal are perceptually one motion. Combined with the
  // parent's uiY [12, 0] rise on [0.40, 0.60], the total visible
  // lift is 24px → 0px at the trailing end of each stat's
  // window, which feels tactile without being slow.
  //
  // On phone / coarse-pointer / reduced-motion surfaces the CSS
  // `!important` override on `.telemetry` and `.telemetryItem`
  // forces both the wrapper and every child stat to opacity:1 +
  // transform:none so the strip is always shown in full on those
  // surfaces — no React branching, no SSR->hydration flash. The
  // cascade is desktop-scroll-only.
  const stat0Opacity = useTransform(progress, [0.42, 0.46], [0, 1]);
  const stat1Opacity = useTransform(progress, [0.46, 0.50], [0, 1]);
  const stat2Opacity = useTransform(progress, [0.50, 0.54], [0, 1]);
  const stat3Opacity = useTransform(progress, [0.54, 0.58], [0, 1]);
  const stat0Y = useTransform(progress, [0.42, 0.46], [12, 0]);
  const stat1Y = useTransform(progress, [0.46, 0.50], [12, 0]);
  const stat2Y = useTransform(progress, [0.50, 0.54], [12, 0]);
  const stat3Y = useTransform(progress, [0.54, 0.58], [12, 0]);
  const statOpacities = [
    stat0Opacity,
    stat1Opacity,
    stat2Opacity,
    stat3Opacity,
  ];
  const statYs = [stat0Y, stat1Y, stat2Y, stat3Y];

  return (
    <motion.div
      className={styles.telemetry}
      style={{ opacity: uiOpacity, y: uiY }}
      aria-label="Field log stats"
    >
      {TELEMETRY_STATS.map((stat, i) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: static per-render
          key={i}
          className={styles.telemetryItem}
          // Both arrays are guaranteed to have TELEMETRY_STATS.length
          // entries (4 each) by construction, so the indexed access is
          // safe. The `!` asserts that to TypeScript under
          // noUncheckedIndexedAccess + exactOptionalPropertyTypes.
          style={{ opacity: statOpacities[i]!, y: statYs[i]! }}
        >
          <span className={styles.telemetryValue}>{stat.value}</span>
          <span className={styles.telemetryLabel}>{stat.label}</span>
        </motion.span>
      ))}
    </motion.div>
  );
}

/* ============================================================
 * RevealWord - per-word reveal of the headline.
 * Each word slides up from a clip window. Same pattern as before
 * so the headline always reads identically regardless of which
 * background (storybook or photo) is behind it.
 * ============================================================ */

function RevealWord({
  word,
  delay,
  withSpace,
}: {
  word: string;
  delay: number;
  withSpace?: boolean;
}): ReactNode {
  const reduced = useReducedMotion();
  return (
    <span className={styles.wordWindow} style={{ paddingBottom: '0.08em' }}>
      <motion.span
        className={styles.wordInner}
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{
          duration: reduced ? 0.01 : 0.9,
          delay: reduced ? 0 : 0.15 + delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {withSpace ? `${word}\u00a0` : word}
      </motion.span>
    </span>
  );
}

/* ============================================================
 * MagneticCta - the button pulls toward the cursor.
 * Identical pattern to the previous hero so the conversion path
 * feels identical whether the visitor enters from the storybook
 * or the photo.
 * ============================================================ */

function MagneticCta({
  href,
  children,
  variant,
  size,
}: {
  href: string;
  children: ReactNode;
  variant: 'sun' | 'ghost';
  size: 'lg';
}): ReactNode {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (reduce) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
    x.set(Math.max(-18, Math.min(18, dx)));
    y.set(Math.max(-12, Math.min(12, dy)));
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className={styles.magneticWrap}
      style={{ x: sx, y: sy }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <Button as="link" href={href} variant={variant} size={size} inverse>
        {children}
      </Button>
    </motion.span>
  );
}
