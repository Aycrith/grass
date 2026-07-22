'use client';
// D-0045 structural cascade is implemented (see governance/decisions/0045-structural-cascade.md
// Status section). The native <picture> element in BackgroundPhoto below dispatches to AVIF/WebP/JPEG
// fallbacks for the v2 photo, layered alongside the hand-authored SVG primary (HeroStorybookLayer).
// D-0049 — second scene is now SecondScene (pure CSS, no Three.js).

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

import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useViewportMotion } from '@/components/motion';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

import { HeroStorybookLayer } from './HeroStorybookLayer';
// D-0049 — SecondScene is a pure-CSS component (no Three.js, no dynamic
// import). Renders the painted scene2-01..06.webp frames as full-bleed
// background-image with a CSS-step cycle. Replaces the D-0048 HeroScene3D
// (which produced a black-column rendering bug in production).
import { SecondScene } from './SecondScene';

import styles from './HeroFieldTelemetry.module.css';

// D-Wave2A — headline now sourced from `lib/content.ts → hero.headline`
// (single source of truth) rather than hardcoded inside the component.
// The string is split into lines on the closing period (or the last
// word boundary) and each line is split into words so the WordReveal
// per-word animation keeps its existing cadence.
function parseHeadline(headline: string): readonly (readonly string[])[] {
  const trimmed = headline.trim();
  // Strip a trailing period if present; we'll re-attach it to the final word
  const hasTrailingPeriod = trimmed.endsWith('.');
  const body = hasTrailingPeriod ? trimmed.slice(0, -1) : trimmed;
  // Split into 2 visual lines on the half-word boundary (4 words -> 2 + 2)
  const words = body.split(/\s+/).filter(Boolean);
  if (words.length <= 2) {
    const lines = [words];
    return hasTrailingPeriod && words.length > 0
      ? [[...lines[0]!.slice(0, -1), `${lines[0]!.at(-1) ?? ''}.`]]
      : lines;
  }
  const half = Math.ceil(words.length / 2);
  const line1 = words.slice(0, half);
  const line2 = words.slice(half);
  if (hasTrailingPeriod && line2.length > 0) {
    line2[line2.length - 1] = `${line2.at(-1) ?? ''}.`;
  }
  return [line1, line2];
}

/* Pass 3b — parseScene2Headline. Splits the second-scene headline
 * into plain + italic segments. The brand keyword gets italic
 * Fraunces emphasis matching the WP81 editorial break pattern;
 * everything else reads plain. Returns ordered segments so the
 * caller can render them in sequence.
 *
 * D-0049 — exported so SecondScene can reuse the same italic-keyword
 * rule instead of duplicating it. */
export function parseScene2Headline(
  headline: string,
): readonly { text: string; italic: boolean }[] {
  // Brand keywords to italicize in the second scene's editorial
  // pull-quote. Add new keywords here as scene 2 copy evolves.
  // D-0049 — restored to D-0047's "yard" / "every week" / "week"
  // list. The D-0048 "Tuesday" keyword was a copy regression
  // around the "Walked past Tuesday." draft; "yard" matches the
  // restored "Same yard, every week." pull-quote.
  const italicKeywords = ['yard', 'week', 'every week'];
  const trimmed = headline.trim();
  const tokens: { text: string; italic: boolean }[] = [];
  // Walk word-by-word, matching against the keyword list (case-
  // insensitive, whole-word). Whitespace is preserved between
  // segments.
  const wordRe = /(\s+)|([^\s]+)/g;
  let match: RegExpExecArray | null;
  while ((match = wordRe.exec(trimmed)) !== null) {
    const text = match[0];
    if (match[1] !== undefined) {
      // whitespace — keep on previous segment
      if (tokens.length > 0) tokens[tokens.length - 1]!.text += text;
      else tokens.push({ text, italic: false });
      continue;
    }
    const isKeyword = italicKeywords.some(
      (kw) => text.toLowerCase() === kw.toLowerCase() || text.toLowerCase().replace(/[.,]/g, '') === kw.toLowerCase(),
    );
    tokens.push({ text, italic: isKeyword });
  }
  return tokens;
}

const TELEMETRY_STATS = [
  { value: '47', label: 'Yards on route' },
  { value: '18h', label: 'Quote turnaround' },
  { value: '6 yrs', label: 'Cutting in 33771' },
  { value: '6', label: 'Pinellas ZIPs' },
] as const;

// Module-scope invariant: statOpacities[i]! / statYs[i]! in the
// .map(...) below relies on this length matching. If a future edit
// adds a 5th stat, the indexed access returns undefined and the
// fade-in silently breaks motion-without-opacity. Module-load
// throw surfaces the drift before motion.span mounts, instead of
// silently opacity-undefined at runtime.
if (TELEMETRY_STATS.length !== 4) {
  throw new Error(
    `TELEMETRY_STATS.length=${TELEMETRY_STATS.length}; update statOpacities/statYs arrays to match.`,
  );
}

// D-0046 — the debug-additive gate forces ALL four stack layers visible via
// a data-attribute on the root <section> + CSS escape-hatch rules. We do NOT
// use inline opacity/y ternaries on motion.divs because Framer Motion binds
// a subscriber when the prop is first a MotionValue, and after a re-render
// to a literal number the subscriber does not unbind — the style stays
// effectively at the MotionValue's frozen value at first paint (here: 0).
// The data-attribute + CSS !important approach bypasses Framer Motion's
// style cache entirely. See ADR governance/decisions/0046-debug-overlay.md
// §Trade-offs accepted (binding subscriber bug) for the full rationale.

interface HeroFieldTelemetryProps {
  className?: string;
  eyebrow: string;
  /** Full headline string (with optional trailing period). Split into
   * 2 visual lines via parseHeadline() so WordReveal keeps its cadence. */
  headline: string;
  subhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  /** Wave 4 — second pinned scene content (scroll > 0.40). */
  scene2: {
    eyebrow: string;
    headline: string;
    subhead: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
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
  headline,
  subhead,
  primaryCta,
  secondaryCta,
  scene2,
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

  // ?debug=show-additive URL-param gate (D-0046). Forces additive overlay
  // opacities to 1.0 at every scroll position so the steward can audit visual
  // fidelity independent of scroll-progress motion gating AND the @media CSS
  // hide gates. SSR-safe: defaults false on first render, useEffect flips
  // client-side without React #418. URLSearchParams exact-equality on the
  // named param; unaffected by utm_/other-prefixed querystrings.
  //
  // D-0046 rev 3 — add `popstate` listener so client-side navigation (Next.js
  // <Link> components, browser back/forward) re-evaluates the gate; without
  // it the steward could navigate to ?debug=show-additive via in-app links
  // and still see the non-debug visual. The empty-deps array means the
  // listener is attached once and lives for the component's lifetime.
  // Console logging gives the steward a DevTools-readable signal of whether
  // the gate flipped.
  const [isDebugAdditive, setIsDebugAdditive] = useState(false);
  useEffect(() => {
    const checkUrl = (): void => {
      const isDebug =
        new URLSearchParams(window.location.search).get('debug') === 'show-additive';
      // D-0046 — the no-console rule is disabled project-wide so this
      // dev-tools signal for the steward needs no eslint-disable
      // directive. Removing the directive (vs leaving one in place)
      // also avoids the `reportUnusedDisableDirectives` lint error
      // for a rule that never fires.
      console.log('[HeroFieldTelemetry debug gate]', 'url.search=', window.location.search, 'isDebugAdditive=', isDebug);
      setIsDebugAdditive(isDebug);
    };
    checkUrl();
    window.addEventListener('popstate', checkUrl);
    return () => window.removeEventListener('popstate', checkUrl);
  }, []);

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

  // D-0044 — shared viewport motion substrate for the storybook layers.
  const { layers: viewportLayers, reduced: viewportReduced } = useViewportMotion(sectionRef);

  // D-0043 (Wave 2) — shared layer-4 timing. LiveStatus + FieldStamp +
  // TelemetryStats all read `uiOpacity` / `uiY` so they rise together.
  // D-0059 rev3 — the dashboard fade-in window was [0.1, 0.3] in
  // D-0043 rev 2 / D-0059 rev2, which positioned the LIVE pill
  // and telemetry strip so they rose DURING the storybook
  // dissolve. With the storybook cross-fade now tightened to
  // [0.10, 0.25] (rev3) the dashboard widgets are pushed to
  // [0.25, 0.40] so they appear AFTER the storybook is fully
  // gone. This kills the rev2 visual where "LIVE Route has room"
  // was sitting on top of the dissolving storybook ghosts at
  // y=0.20 — the dashboard is now a clear, clean reveal on the
  // resting photo, not a mid-cross-fade overlay.
  //
  // The "front-of-house" reveal still happens as one beat — the
  // LIVE pill, EST stamp, and telemetry strip all share
  // `uiOpacity` / `uiY` so they rise together at y=0.25 → y=0.40.
  // The beat is just later now: it lines up with the photo
  // reaching its resting state, not with the storybook's
  // mid-dissolve. The photo grade (warmth overlay) also settles
  // to 0 at y=0.40 in lockstep.
  const uiOpacity = useTransform(smoothProgress, [0.25, 0.40], [0, 1]);
  const uiY = useTransform(smoothProgress, [0.25, 0.40], [12, 0]);

  // D-0043 (Wave 2) — additive green palette correction. The
  // production photo has ~14,200 sand-colored foreground pixels
  // (target ≤ 2,500). These two layers tint and mask the sandy
  // foreground toward the brand green band without modifying the
  // photo asset or the cross-fade. Thresholds lowered from
  // [0.10, 0.50] / [0.15, 0.55] to [0.05, 0.25] / [0.10, 0.30] so
  // the green wash and grass silhouette are visible by the time the
  // storybook is ~30% dissolved — they belong to the same reveal
  // beat as the dashboard widgets above, not a separate late event.
  //   - greenVignetteOpacity: bottom-up green wash, intensifies as
  //     the storybook fades out.
  //   - grassOpacity: SVG grass blade silhouette along the bottom
  //     edge, rises in slightly later so it feels like foreground
  //     foliage settling on top of the photo.
  //     D-0049 — added a fade-out leg [0.4, 0.7] so the silhouette
  //     dissolves as scene 2 (the painted ranch house) cross-fades
  //     in. Without this the dark brand-green grass reads as a
  //     black saw-tooth stripe across the bottom of the bright
  //     scene 2 illustration.
  const greenVignetteOpacity = useTransform(
    smoothProgress,
    [0.05, 0.25, 0.4, 0.7],
    [0, 1, 1, 0],
  );
  const grassOpacity = useTransform(
    smoothProgress,
    [0.1, 0.3, 0.4, 0.7],
    [0, 1, 1, 0],
  );

  // Wave 4 — second pinned scene cross-fade ranges. Section height
  // bumped 200svh → 350svh; new scroll bands introduced:
  //   [0.00, 0.10]  Scene 1 resting (storybook fully visible)
  //   [0.10, 0.40]  Scene 1 → photo cross-fade (D-0043)
  //   [0.40, 0.70]  Photo → Scene 2 cross-fade (Wave 4, new)
  //   [0.70, 1.00]  Scene 2 resting (gouache illustration visible)
  //
  // photoFade drives both photo opacity AND photoGrade opacity (the
  // photo grade is a child of photo and inherits the value). The
  // scene1 content fades out as the photo fades in, scene2 content
  // fades in as the photo fades out. Dashboard widgets (LIVE pill,
  // EST stamp, telemetry) persist across both scenes because their
  // identity is scene-agnostic.
  const photoFade = useTransform(smoothProgress, [0.4, 0.7], [1, 0]);
  const secondSceneFade = useTransform(smoothProgress, [0.4, 0.7], [0, 1]);
  const scene1ContentFade = useTransform(smoothProgress, [0.35, 0.55], [1, 0]);
  const scene2ContentFade = useTransform(smoothProgress, [0.55, 0.75], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className={cn(styles.root, className)}
      id="hero"
      data-test-section="hero"
      data-debug-additive={isDebugAdditive ? 'true' : 'false'}
      aria-label="Largo Lawn - your neighbor's lawn mower hero"
    >
      {/* D-0046 rev 3 — direct <style> JSX injection. React inline style props
       * strip !important, so we render a real <style> element when the gate
       * is on. This guarantees the browser receives the override rules with
       * raw !important priority at parse time, independent of:
       *   - CSS module compilation edge cases
       *   - Framer Motion style.setProperty for opacity/transform
       *   - The @media (pointer: coarse), (prefers-reduced-motion: reduce), or
       *     (max-width: 767px) display:none gate on .greenVignette +
       *     .grassSilhouette in the original stylesheet.
       * The class names resolve through `styles.*` so the hashed module
       * class names match the existing JSX usage. */}
      {isDebugAdditive && (
        <style
          dangerouslySetInnerHTML={{
            __html: [
              `#hero .${styles.greenVignette},`,
              `#hero .${styles.grassSilhouette} {`,
              `  display: block !important;`,
              `  opacity: 1 !important;`,
              `}`,
              `#hero .${styles.liveStatus},`,
              `#hero .${styles.telemetry},`,
              `#hero .${styles.telemetryItem} {`,
              `  display: flex !important;`,
              `  opacity: 1 !important;`,
              `  transform: none !important;`,
              `}`,
            ].join('\n'),
          }}
        />
      )}
      <div className={styles.viewport}>
        {/* Z 0: real 4K Florida lawn photograph. */}
        <BackgroundPhoto progress={smoothProgress} photoFade={photoFade} />

        {/* D-0059 Path A — route pin REMOVED.
         *
         * The route pin used to render at scroll [0.5, 0.65] over
         * the lower-right of the photo, with a 1.8s pulse ring
         * suggesting "live, right now". The pin's aria-label
         * ("Currently mowing this lawn") pointed to the same
         * status the LIVE pill (top-right) already carries —
         * "Mowing now · 1274 6th St NE, 33771" — so it was a
         * visual echo of the same data, with a screen-reader
         * label explicitly tied to the pill.
         *
         * Removal rationale: the LIVE pill IS the status
         * indicator. The route pin was a third visual element
         * competing for attention in the photo cross-fade
         * window. The pin's small pulsing ring also created a
         * motion artifact in the [0.10, 0.40] cross-fade when
         * the storybook was dissolving behind it. The pin is
         * gone; the LIVE pill carries the status alone. */}

        {/* Z 0.5: additive green palette correction.
         * Bottom-up green wash that tints the sandy foreground toward
         * the brand green band as the storybook fades out. Pure CSS
         * gradient, no new image asset.
         *
         * D-0046 — under ?debug=show-additive the data-[debug-additive=true]
         * CSS escape-hatch forces `.greenVignette` to display:block +
         * opacity:1 !important so the steward sees it at every scroll
         * position independent of the greenVignetteOpacity MotionValue. */}
        <motion.div
          className={styles.greenVignette}
          style={{ opacity: greenVignetteOpacity }}
          aria-hidden="true"
        />

        {/* Z 1: vignette + scrim for text legibility. */}
        <div className={styles.scrim} aria-hidden="true" />

        {/* Z 2: animated SVG storybook layer. Cross-fades out as the
         * visitor scrolls so the photo becomes the resting state.
         * On mobile + reduced-motion the storybook is not mounted at
         * all so the CSS keyframe animations (clouds, palms, birds)
         * don't burn CPU on phones.
         *
         * D-0044 — per-layer parallax is driven by useViewportMotion and
         * passed down. D-0043 — useReRollPicks is accepted here as a prop
         * so the asset catalog can be swapped without touching the rest
         * of the composition. */}
        {enableScrollFade && (
          <div className={styles.storybookWrap} aria-hidden="true" data-testid="hero-storybook">
            <HeroStorybookLayer
              progress={smoothProgress}
              collapsed={false}
              {...(!viewportReduced && { layerMotion: viewportLayers })}
            />
          </div>
        )}

        {/* Z 2.5: additive SVG grass silhouette.
         * Static foreground grass blades along the bottom edge that mask
         * the remaining sand pixels and reinforce the brand green band.
         * Rises in as the storybook dissolves so the transition reads as
         * "cartoon world turns into real lawn".
         *
         * D-0046 — under ?debug=show-additive the data-[debug-additive=true]
         * CSS escape-hatch forces `.grassSilhouette` to display:block +
         * opacity:1 !important so the steward sees it at every scroll
         * position independent of the grassOpacity MotionValue. */}
        <motion.div
          className={styles.grassSilhouette}
          style={{ opacity: grassOpacity }}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className={styles.grassSvg}
          >
            <title>Foreground grass silhouette</title>
            <path
              fill="var(--ll-green)"
              opacity="0.9"
              d="M0,120 L1200,120 L1200,80 Q1180,100 1160,40 Q1140,90 1120,50 Q1100,110 1080,60 Q1060,95 1040,30 Q1020,100 1000,45 Q980,80 960,20 Q940,90 920,40 Q900,100 880,55 Q860,85 840,25 Q820,95 800,60 Q780,110 760,40 Q740,90 720,35 Q700,105 680,50 Q660,80 640,20 Q620,90 600,45 Q580,100 560,30 Q540,85 520,55 Q500,105 480,40 Q460,95 440,25 Q420,80 400,60 Q380,100 360,45 Q340,90 320,30 Q300,105 280,50 Q260,85 240,20 Q220,100 200,40 Q180,90 160,55 Q140,110 120,35 Q100,80 80,45 Q60,95 40,25 Q20,105 0,60 Z"
            />
          </svg>
        </motion.div>

        {/* Z 3: text + CTAs. Always visible across the transition so
         * the visitor always knows where they are and what the page
         * is selling.
         *
         * Wave 4 — wrapped in a motion.div so scene 1's content
         * (the editorial "Your neighbor's lawnmower." storybook
         * moment) dissolves out across [0.35, 0.55] as the photo
         * fades in; scene 2's content (the "Same yard, every week."
         * commitment) dissolves in across [0.55, 0.75] as the photo
         * fades out. The two scenes crossfade over a 20% scroll
         * window so neither one feels snappy. */}
        <motion.div
          className={styles.content}
          style={{ opacity: scene1ContentFade }}
        >
          <Content
            eyebrow={eyebrow}
            headline={headline}
            subhead={subhead}
            primaryCta={primaryCta}
            secondaryCta={secondaryCta}
          />
        </motion.div>

        {/* Wave 4 — Z 3.5: second pinned scene.
         *
         * D-0049 — the second scene is now a pure-CSS component
         * (SecondScene.tsx) that renders the painted VEO frames
         * (scene2-01..06.webp) as a full-bleed background-image
         * cycling at 10s/frame. The painted frames ARE complete,
         * coherent Florida-ranch-house scenes — they were always
         * meant to fill the panel, not be split into Three.js planes.
         * Editorial pull-quote content overlay sits on top with
         * "Same yard, every week." copy + a 12s-cycle palms
         * foreground parallax layer at bottom-right.
         *
         * Z-stack: scene 0 (photo) underneath; this scene (z 1) above
         * photo; storybook (z 2) above this scene so any leftover
         * storybook artifacts don't bleed through the [0.40, 0.70]
         * cross-fade window. Content overlay sits at z 2 inside the
         * scene. */}
        <SecondScene
          scene2={scene2}
          opacity={secondSceneFade}
          contentOpacity={scene2ContentFade}
        />

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
        {/* D-0046 — call sites pass plain MotionValue<number>; the debug-additive
         * gate is enforced via the section's data-debug-additive attribute +
         * CSS escape-hatch rules in HeroFieldTelemetry.module.css. We do NOT
         * use inline opacity/y ternaries on motion.divs here because Framer
         * Motion's style cache stays bound to the original MotionValue after
         * the prop transitions to a literal number — see comment block at top
         * of file for the full binding-subscriber rationale. */}
        <LiveStatus now={now ?? undefined} uiOpacity={uiOpacity} uiY={uiY} />
        <FieldStamp />
        <TelemetryStats uiOpacity={uiOpacity} uiY={uiY} progress={smoothProgress} />
        {isDebugAdditive && (
          <div
            className={styles.debugBanner}
            role="status"
            aria-live="polite"
          >
            debug: additive layers forced visible ·{' '}
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              isDebugAdditive={String(isDebugAdditive)} · search=
              {typeof window !== 'undefined' ? window.location.search : 'n/a'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
 * Content - eyebrow + headline + subhead + CTAs. Always visible.
 * ============================================================ */

function Content({
  eyebrow,
  headline,
  subhead,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  headline: string;
  subhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}): ReactNode {
  const headlineLines = parseHeadline(headline);
  return (
    <>
      <span className={styles.eyebrow}>{eyebrow}</span>

      {/* D-0059 Path A — service-area callout pill REMOVED.
       *
       * The pill used to sit below the eyebrow with a sun-yellow
       * location pin + the text "33771 · Largo (central)",
       * linking to /areas/33771. It was a clickable hint that
       * duplicated the eyebrow "Lawn care in 33771" signal.
       *
       * Removal rationale: the ServiceAreaMap section below the
       * hero IS the per-ZIP navigation (form + 6 ZIP chips +
       * neighborhood labels). Adding a pill above the hero
       * competed with the form and added a third visual
       * element to the scene 1 content column. The eyebrow
       * already says "Lawn care in 33771" — the pill was a
       * second telling. */}

      <h1 className={styles.headline}>
        {headlineLines.map((line, li) => (
          <span key={`line-${line.join('-')}`} className={styles.headlineLine}>
            {line.map((word, wi) => (
              <RevealWord
                key={`word-${line.join('-')}-${word}`}
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

function BackgroundPhoto({
  progress,
  photoFade,
}: {
  progress: MotionValue<number>;
  // Wave 4 — photo opacity fades out across [0.4, 0.7] as scene 2
  // (the gouache illustration) fades in. Without this, the photo
  // would dominate the resting state and obscure the second scene.
  // When undefined (e.g. on surfaces where wave 4 isn't engaged yet)
  // the photo stays fully opaque.
  photoFade?: MotionValue<number>;
}): ReactNode {
  // Reduced motion collapses both transforms - photo stays put.
  const reduced = useReducedMotion();
  // D-0043 (rev) — first-paint composition. The previous range
  // [0, 0.50] -> [1.02, 1.08] started the photo at 1.02 with a
  // -1.5% y-shift on every render, which meant a desktop visitor
  // landing on the hero saw the photo pre-cropped even before they
  // scrolled. Range is now [0, 0.50] -> [1, 1.08] (and [0%, 1%])
  // so the photo's first paint matches its natural composition
  // and the camera zoom-in reads as the user engages with scroll.
  const photoScale = useTransform(progress, [0, 0.5], reduced ? [1, 1] : [1, 1.08]);
  const photoY = useTransform(progress, [0, 0.5], reduced ? ['0%', '0%'] : ['0%', '1%']);
  // Color-grade overlay matches the storybook fade range so the two
  // share one dissolve boundary at scroll 0.40. Mixed in via
  // mix-blend-mode: overlay rather than as a transparency overlay
  // because overlay preserves the photo's natural highlights
  // (skies stay bright, grass blades aren't washed out).
  const gradeOpacity = useTransform(progress, [0.1, 0.4], reduced ? [0, 0] : [0.55, 0]);

  return (
    <motion.div
      className={styles.photo}
      aria-hidden="true"
      style={photoFade ? { opacity: photoFade } : {}}
    >
      <motion.div className={styles.photoWrap} style={{ scale: photoScale, y: photoY }}>
        {/* D-0045 — structural cascade: browser-native <picture> fallback
         * chain for the v2 hero photo. Desktop browsers pick AVIF or WebP
         * via <source>; mobile browsers pick the mobile variants; legacy
         * browsers fall through to the JPEG. The hand-authored SVG primary
         * (HeroStorybookLayer) still sits above this layer at z-index 2. */}
        <picture>
          <source
            srcSet="/hero/v2/desktop.avif"
            type="image/avif"
            media="(min-width: 768px)"
          />
          <source
            srcSet="/hero/v2/desktop.webp"
            type="image/webp"
            media="(min-width: 768px)"
          />
          <source
            srcSet="/hero/v2/mobile.avif"
            type="image/avif"
            media="(max-width: 767px)"
          />
          <source
            srcSet="/hero/v2/mobile.webp"
            type="image/webp"
            media="(max-width: 767px)"
          />
          <img
            src="/hero/v2/hero-green-grass.jpg"
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            className={styles.photoImg}
          />
        </picture>
        <motion.div className={styles.photoGrade} style={{ opacity: gradeOpacity }} />
      </motion.div>
      <div className={styles.photoVignette} />
    </motion.div>
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
  /** D-0043 fade-in + D-0050 Phase 3 fade-out combined. The
   * call site passes `dashboardCombined` (the product of the
   * in-fade and out-fade MotionValues) under this name so the
   * widget doesn't need to know about the combined logic. */
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
      <div className={styles.liveStatusInner}>
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
      </div>
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
 *
 * D-0059 Path A — the D-0050 Phase 3 dashboard fade-out
 * (combined in-fade + out-fade MotionValue, which was added
 * so the stamp would fade out in scene 3 to make room for the
 * per-ZIP strip) is removed. The per-ZIP strip is gone, so the
 * stamp no longer needs to fade out — it persists as static
 * postcard iconography through scene 3. The original plain-
 * div binding is restored.
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
  const stat1Opacity = useTransform(progress, [0.46, 0.5], [0, 1]);
  const stat2Opacity = useTransform(progress, [0.5, 0.54], [0, 1]);
  const stat3Opacity = useTransform(progress, [0.54, 0.58], [0, 1]);
  const stat0Y = useTransform(progress, [0.42, 0.46], [12, 0]);
  const stat1Y = useTransform(progress, [0.46, 0.5], [12, 0]);
  const stat2Y = useTransform(progress, [0.5, 0.54], [12, 0]);
  const stat3Y = useTransform(progress, [0.54, 0.58], [12, 0]);
  // Indexed access is type-safe under noUncheckedIndexedAccess + the
  // call-site `!` assertion: if TELEMETRY_STATS.length ever diverges
  // from 4, the assertion fails at the typecheck boundary instead of
  // silently undefined-rendering motion values at runtime.
  const statOpacities = [stat0Opacity, stat1Opacity, stat2Opacity, stat3Opacity];
  const statYs = [stat0Y, stat1Y, stat2Y, stat3Y];

  return (
    <motion.div
      className={styles.telemetry}
      style={{ opacity: uiOpacity, y: uiY }}
      aria-label="Field log stats"
    >
      {TELEMETRY_STATS.map((stat, i) => (
        <motion.span
          key={stat.value}
          className={styles.telemetryItem}
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

/* D-0049 — exported so SecondScene can reuse the magnetic CTA pattern
 * without duplicating the spring/pointermove logic. */
export function MagneticCta({
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

/* ============================================================
 * D-0049 — HeroScene3D (the D-0048 Three.js 2.5D plane stack) was
 * removed. The second scene is now the pure-CSS SecondScene component
 * (apps/web/src/components/sections/SecondScene.tsx) imported at the
 * top of this file. That component renders scene2-01..06.webp as a
 * full-bleed background-image with CSS-step cycle + a palms parallax
 * foreground layer + the editorial pull-quote content overlay.
 *
 * See governance/decisions/0049-second-scene-css-revert.md for the
 * full rationale (D-0048's Three.js approach produced a black-column
 * rendering bug in production; the painted frames are coherent
 * complete scenes that work better as a single full-bleed image).
 * ============================================================ */
