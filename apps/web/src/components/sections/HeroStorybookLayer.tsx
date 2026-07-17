/**
 * HeroStorybookLayer - the animated SVG landscape that opens the hero.
 *
 * Hand-authored Florida scenery: sun + clouds + distant palms + swaying
 * ranch palms + foreground grass tufts + a small lawn mower that drives
 * across the scene as the visitor scrolls. The storybook layer sits on
 * top of the real photograph and cross-fades into it across the
 * [0.10, 0.40] scroll window, so the visitor watches the cartoon
 * world literally dissolve into the working operation.
 *
 * This file holds the SVG primitives only. The unified hero composition
 * (stacking order, scroll-driven cross-fade, mobile collapse) lives in
 * HeroFieldTelemetry.tsx.
 *
 * Brand fidelity:
 *   - cream / palm green / sun / clay palette (locked CSS variables)
 *   - no fake client logos, no fake testimonials
 *   - small lawn mower is the canonical operator iconography
 *
 * Reduced motion: ambient CSS animations (clouds drift, palms sway,
 * wildflowers bloom) collapse to instant via existing @media blocks.
 * The scroll-driven cross-fade and the mower's wheel rotation still
 * run on reduced-motion because they are tied to user scroll, not
 * autonomous animation. The blur+saturate dissolve below is no-op on
 * `collapsed={true}`.
 *
 * D-0043 (cinematic dissolve):
 *   The previous dissolve was a single linear `opacity 1 -> 0` ramp.
 *   That felt jarring because SVG vector graphics (sharp, crisp,
 * fully-saturated edges) cut out hard against the natural edges of
 * the 4K photograph. Two coordinated transforms now apply:
 *   - opacity: [0, 0.10, 0.30, 0.40] -> [1, 1, 0.5, 0]
 *     asymmetric soft-fade; the layer stays full through the first
 *     10% of scroll, then softens quickly through 0.30-0.40.
 *   - filter: blur(0px) saturate(100%) -> blur(14px) saturate(0%)
 *     across [0.10, 0.40]. The vectors soften into a ghost before
 *     vanishing, so the eye reads the dissolve as one world fading
 *     into another rather than a hard layer swap. The blur is light
 *     enough (14px) to avoid a smudgy halo but heavy enough to wash
 *     out the cartoon outline against the photo's natural edges.
 */

import type { MotionValue } from 'framer-motion';
import { motion, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

import styles from './HeroStorybookLayer.module.css';

interface HeroStorybookLayerProps {
  /** 0..1 scroll progress driving the mower + cross-fade. */
  progress: MotionValue<number>;
  /** True on mobile + reduced-motion: skip scroll-scrubbed animations. */
  collapsed?: boolean;
}

/**
 * Master stack: sky + drifting clouds + 3 parallax layers (far / mid /
 * near) + the moving mower + the scroll hint. The whole composition
 * is wrapped in a single motion.div whose opacity is driven by the
 * hero's scroll progress, so the parent can fade the entire storybook
 * world out as the photo layer fades in.
 */
export function HeroStorybookLayer({
  progress,
  collapsed = false,
}: HeroStorybookLayerProps): ReactNode {
  // D-0043 — opacity eases 1 -> 0 across [0.10, 0.40] in 4 keys so
  // the first 10% holds the storybook as the resting state, then
  // softens through 0.10-0.30, then drops to 0 by 0.40 (sharing an
  // exact boundary with the photo's warmth grade in
  // HeroFieldTelemetry). When `collapsed` the layer stays full opacity
  // for the entire scroll-through (effectively not used -
  // HeroFieldTelemetry unmounts the storybook entirely when scroll-
  // fade is disabled).
  const opacity = useTransform(
    progress,
    [0, 0.10, 0.30, 0.40],
    collapsed ? [1, 1, 1, 1] : [1, 1, 0.5, 0],
  );

  // D-0043 — the `filter` form is function-form useTransform so
  // framer-motion interpolates using the raw numeric range we
  // compute here, then formats as a CSS filter string. Direct string
  // interpolation of `'blur(0px) saturate(100%)' -> 'blur(14px)
  // saturate(0%)'` can produce visible "snap" frames; the function
  // form lets us author the easing curve explicitly and skip the
  // string-mixing logic entirely. On `collapsed` the filter stays
  // identity (no blur, full saturation).
  const filter = useTransform(progress, (v) => {
    if (collapsed) return 'blur(0px) saturate(100%)';
    const start = 0.10;
    const end = 0.40;
    const tRaw = (v - start) / (end - start);
    const t = Math.max(0, Math.min(1, tRaw));
    const blur = t * 14;
    const saturate = (1 - t) * 100;
    return `blur(${blur}px) saturate(${saturate}%)`;
  });

  // Each parallax layer translates horizontally as scroll progresses,
  // slower in the back, faster in the foreground. On mobile + reduced-
  // motion we lock translations to 0 so the scene is a still frame.
  const farPanX = useTransform(progress, (v) =>
    collapsed ? '0%' : `${-v * 6}%`,
  );
  const midPanX = useTransform(progress, (v) =>
    collapsed ? '0%' : `${-v * 12}%`,
  );
  const nearPanX = useTransform(progress, (v) =>
    collapsed ? '0%' : `${-v * 18}%`,
  );

  // Sky translates a touch slower than the far layer to give a 4-tier
  // depth separation (sky / far / mid / near) instead of the usual 3.
  const skyPanX = useTransform(progress, (v) =>
    collapsed ? '0%' : `${-v * 3}%`,
  );

  return (
    <motion.div
      className={styles.layer}
      style={{ opacity, filter }}
      aria-hidden="true"
    >
      <motion.div className={styles.skyWrap} style={{ x: skyPanX }}>
        <BackgroundSky />
      </motion.div>
      <Clouds />
      <motion.div className={styles.farLayer} style={{ x: farPanX }}>
        <FarLayer />
      </motion.div>
      <motion.div className={styles.midLayer} style={{ x: midPanX }}>
        <MidLayer />
      </motion.div>
      <Mower position={progress} />
      <motion.div className={styles.nearLayer} style={{ x: nearPanX }}>
        <NearLayer />
      </motion.div>
      <ScrollHint mowerX={progress} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * Background sky - gradient + sun + horizon glow + birds.
 * Pure SVG, no scroll drive.
 * ----------------------------------------------------------------- */

function BackgroundSky(): ReactNode {
  return (
    <svg
      className={styles.sky}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      style={{ width: '105%', height: '105%', left: '-2.5%', top: '-2.5%' }}
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-sun-pale)" />
          <stop offset="30%" stopColor="var(--ll-sun-deep)" />
          <stop offset="55%" stopColor="var(--ll-sun-light)" />
          <stop offset="80%" stopColor="var(--ll-cream)" />
          <stop offset="100%" stopColor="var(--ll-sand-bleached)" />
        </linearGradient>
        <radialGradient id="hero-sun" cx="0.22" cy="0.28" r="0.28">
          <stop offset="0%" stopColor="var(--ll-cream)" stopOpacity="0.95" />
          <stop offset="35%" stopColor="var(--ll-sun-light)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--ll-sun)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#hero-sky)" />
      <rect width="1600" height="900" fill="url(#hero-sun)" />
      <circle cx="352" cy="252" r="72" fill="var(--ll-cream)" opacity="0.9" />
      <circle cx="352" cy="252" r="120" fill="var(--ll-sun)" opacity="0.18" />
      {/* Birds (V-shapes) drift gently via CSS animation. */}
      <g
        className={styles.birds}
        fill="none"
        stroke="var(--ll-palm-bark)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      >
        <path d="M 880 180 q 6 -8 12 0 q 6 -8 12 0" />
        <path d="M 940 200 q 5 -6 10 0 q 5 -6 10 0" />
        <path d="M 1010 175 q 6 -8 12 0 q 6 -8 12 0" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------
 * Drifting clouds - pure CSS keyframes, GPU-cheap.
 * ----------------------------------------------------------------- */

function Clouds(): ReactNode {
  return (
    <div className={styles.clouds}>
      <div className={`${styles.cloud} ${styles.cloud1}`} />
      <div className={`${styles.cloud} ${styles.cloud2}`} />
      <div className={`${styles.cloud} ${styles.cloud3}`} />
      <div className={`${styles.cloud} ${styles.cloud4}`} />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Far layer - distant palms + faint houses. Translates slowest.
 * ----------------------------------------------------------------- */

function FarLayer(): ReactNode {
  return (
    <svg
      className={styles.layerSvg}
      viewBox="0 0 2000 900"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="far-palm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-palm-light)" />
          <stop offset="100%" stopColor="var(--ll-palm)" />
        </linearGradient>
      </defs>
      <path
        d="M 0 460 Q 200 440 400 450 T 800 448 T 1200 455 T 1600 440 T 2000 450 L 2000 900 L 0 900 Z"
        fill="var(--ll-sand)"
        opacity="0.5"
      />
      <g fill="url(#far-palm)" opacity="0.45">
        <PalmTree x={120} y={415} h={70} />
        <PalmTree x={340} y={405} h={80} />
        <PalmTree x={680} y={410} h={72} />
        <PalmTree x={980} y={400} h={88} />
        <PalmTree x={1300} y={408} h={76} />
        <PalmTree x={1620} y={400} h={84} />
        <PalmTree x={1880} y={415} h={72} />
      </g>
      <g fill="var(--ll-sage-muted)" opacity="0.3">
        <rect x={500} y={430} width={60} height={30} />
        <rect x={1100} y={425} width={70} height={35} />
        <rect x={1450} y={432} width={55} height={28} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------
 * Mid layer - closer palms (swaying), ranch houses.
 * ----------------------------------------------------------------- */

function MidLayer(): ReactNode {
  return (
    <svg
      className={styles.layerSvg}
      viewBox="0 0 2000 900"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="mid-trunk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-clay)" />
          <stop offset="100%" stopColor="var(--ll-palm-bark)" />
        </linearGradient>
        <linearGradient id="mid-frond" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-palm)" />
          <stop offset="100%" stopColor="var(--ll-green)" />
        </linearGradient>
        <linearGradient id="house-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-cream)" />
          <stop offset="100%" stopColor="var(--ll-sand)" />
        </linearGradient>
        <linearGradient id="house-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ll-clay)" />
          <stop offset="100%" stopColor="var(--ll-palm-bark)" />
        </linearGradient>
      </defs>
      <path
        d="M 0 480 Q 300 470 600 478 T 1200 480 T 1800 476 T 2000 482 L 2000 900 L 0 900 Z"
        fill="var(--ll-sand)"
        opacity="0.6"
      />
      <path
        d="M 0 540 Q 400 530 800 540 T 1600 538 T 2000 544 L 2000 900 L 0 900 Z"
        fill="var(--ll-clay)"
        opacity="0.5"
      />

      <g transform="translate(1100 370)">
        <House />
      </g>
      <g transform="translate(1500 400) scale(0.7)">
        <House />
      </g>
      <g transform="translate(400 400) scale(0.65)">
        <House />
      </g>

      <g className={styles.swaySlow}>
        <PalmTree
          x={150}
          y={280}
          h={200}
          trunkFill="url(#mid-trunk)"
          frondFill="url(#mid-frond)"
        />
      </g>
      <g className={styles.swaySlow} style={{ animationDelay: '-1.2s' }}>
        <PalmTree
          x={780}
          y={260}
          h={220}
          trunkFill="url(#mid-trunk)"
          frondFill="url(#mid-frond)"
        />
      </g>
      <g className={styles.swaySlow} style={{ animationDelay: '-0.6s' }}>
        <PalmTree
          x={1850}
          y={290}
          h={190}
          trunkFill="url(#mid-trunk)"
          frondFill="url(#mid-frond)"
        />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------
 * The mower - drives across the screen as scroll progresses.
 * Wheels rotate, the deck bounces, and a mowed path grows behind it.
 * ----------------------------------------------------------------- */

function Mower({ position }: { position: MotionValue<number> }): ReactNode {
  const xPct = useTransform(position, (v) =>
    `${Math.max(2, Math.min(96, v * 100))}%`,
  );
  const wheelRot = useTransform(position, [0, 1], [0, 720]);
  const deckBounce = useTransform(position, (v) => Math.sin(v * Math.PI * 12) * 1.5);
  const pathWidth = useTransform(position, (v) => `${Math.max(0, v * 100)}%`);

  return (
    <motion.div className={styles.mower} style={{ left: xPct }}>
      <motion.div className={styles.mowedPath} style={{ width: pathWidth }} />
      <motion.svg
        viewBox="0 0 200 120"
        width="100%"
        height="100%"
        style={{ y: deckBounce }}
      >
        {/* Mower deck */}
        <rect x={50} y={50} width={108} height={36} rx={6} fill="var(--ll-green)" />
        <rect x={50} y={50} width={108} height={10} rx={4} fill="var(--ll-palm)" />
        {/* Bag */}
        <rect x={120} y={36} width={36} height={20} rx={3} fill="var(--ll-palm-bark)" />
        <rect x={124} y={40} width={28} height={4} rx={2} fill="var(--ll-clay)" />
        {/* Handle */}
        <line
          x1={150}
          y1={56}
          x2={188}
          y2={20}
          stroke="var(--ll-palm-bark)"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <line
          x1={172}
          y1={24}
          x2={188}
          y2={20}
          stroke="var(--ll-palm-bark)"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <circle cx={150} cy={56} r={4} fill="var(--ll-sun)" />
        {/* Wheels - rotated by scroll progress */}
        <motion.g style={{ rotate: wheelRot, transformOrigin: '62px 92px' }}>
          <circle cx={62} cy={92} r={14} fill="var(--ll-palm-bark)" />
          <circle cx={62} cy={92} r={6} fill="var(--ll-sage-muted)" />
          <circle cx={62} cy={92} r={3} fill="var(--ll-sun)" />
        </motion.g>
        <motion.g style={{ rotate: wheelRot, transformOrigin: '146px 92px' }}>
          <circle cx={146} cy={92} r={14} fill="var(--ll-palm-bark)" />
          <circle cx={146} cy={92} r={6} fill="var(--ll-sage-muted)" />
          <circle cx={146} cy={92} r={3} fill="var(--ll-sun)" />
        </motion.g>
        {/* Grass clippings flying */}
        <g opacity="0.6">
          <circle cx={20} cy={70} r={2} fill="var(--ll-clay)" />
          <circle cx={30} cy={62} r={1.5} fill="var(--ll-sand)" />
          <circle cx={10} cy={66} r={1.2} fill="var(--ll-clay)" />
          <circle cx={40} cy={70} r={1.5} fill="var(--ll-palm-bark)" />
        </g>
      </motion.svg>
      <div className={styles.mowerTrail} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * Near layer - foreground grass + wildflowers.
 * ----------------------------------------------------------------- */

function NearLayer(): ReactNode {
  return (
    <div className={styles.nearInner}>
      <svg
        className={styles.layerSvg}
        viewBox="0 0 2000 900"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ll-clay)" />
            <stop offset="100%" stopColor="var(--ll-palm-bark)" />
          </linearGradient>
          <linearGradient id="grass-tip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ll-sand)" />
            <stop offset="100%" stopColor="var(--ll-clay)" />
          </linearGradient>
        </defs>

        <path
          d="M 0 600 Q 500 590 1000 600 T 2000 596 L 2000 900 L 0 900 Z"
          fill="url(#grass)"
        />
        <g className={styles.blades}>
          {Array.from({ length: 60 }).map((_, i) => {
            const x = i * 34 + (i % 3) * 8;
            const h = 24 + (i % 5) * 6;
            return (
              <g key={i} transform={`translate(${x} 680)`}>
                <path
                  d={`M 0 0 Q ${3 + (i % 3)} -${h} 6 -${h}`}
                  stroke="url(#grass-tip)"
                  strokeWidth={1.6}
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={`M 8 0 Q ${11 + (i % 3)} -${h - 6} 14 -${h - 6}`}
                  stroke="url(#grass-tip)"
                  strokeWidth={1.4}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.7}
                />
              </g>
            );
          })}
        </g>
        <g className={styles.wildflowers}>
          {[
            { x: 240, y: 650, c: 'var(--ll-sun)' },
            { x: 580, y: 660, c: 'var(--ll-clay)' },
            { x: 920, y: 648, c: 'var(--ll-sun)' },
            { x: 1240, y: 656, c: 'var(--ll-sand)' },
            { x: 1620, y: 652, c: 'var(--ll-sun)' },
            { x: 1860, y: 662, c: 'var(--ll-clay)' },
          ].map((f, i) => (
            <g key={i} transform={`translate(${f.x} ${f.y})`}>
              <circle r={3} fill={f.c} />
              <circle r={1.4} fill="var(--ll-palm-bark)" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Scroll hint - "scroll to mow" with progress dot + arrow.
 * Hidden when the mower has crossed the screen (scroll > 0.95).
 * ----------------------------------------------------------------- */

function ScrollHint({ mowerX }: { mowerX: MotionValue<number> }): ReactNode {
  const opacity = useTransform(mowerX, [0, 0.05, 0.9, 1], [1, 1, 1, 0]);
  const y = useTransform(mowerX, [0, 1], [0, 12]);
  const dotLeft = useTransform(mowerX, (v) => `${v * 100}%`);
  return (
    <motion.div className={styles.scrollHint} style={{ opacity, y }}>
      <span className={styles.scrollHintLabel}>SCROLL TO MOW</span>
      <span className={styles.scrollHintTrack}>
        <motion.span className={styles.scrollHintDot} style={{ left: dotLeft }} />
      </span>
      <span className={styles.scrollHintArrow} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 5v14M5 12l7 7 7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * Tiny SVG primitives - hand-authored, small enough to be inline.
 * ----------------------------------------------------------------- */

function PalmTree({
  x,
  y,
  h,
  trunkFill = '#1f4e2c',
  frondFill = '#2d5a3d',
}: {
  x: number;
  y: number;
  h: number;
  trunkFill?: string;
  frondFill?: string;
}): ReactNode {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M 0 0 Q ${-2} -${h * 0.5} 1 -${h}`}
        stroke={trunkFill}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <g transform={`translate(0 -${h})`}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
          <g key={rot} transform={`rotate(${rot})`}>
            <path d="M 0 0 Q 12 -6 24 -2 Q 18 -10 8 -8 Z" fill={frondFill} />
            <path
              d="M 0 0 Q 18 2 32 8 Q 24 14 14 10 Z"
              fill={frondFill}
              opacity={0.85}
            />
          </g>
        ))}
        <circle r={2.5} fill="#3d2814" />
      </g>
    </g>
  );
}

function House(): ReactNode {
  return (
    <g>
      <rect x={0} y={20} width={140} height={70} fill="url(#house-wall)" />
      <polygon points="0,20 70,-12 140,20" fill="url(#house-roof)" />
      <rect x={10} y={60} width={40} height={30} fill="var(--ll-clay)" opacity={0.4} />
      <rect x={20} y={48} width={14} height={42} fill="var(--ll-palm-bark)" />
      <rect x={48} y={32} width={20} height={20} fill="var(--ll-palm-bark)" opacity={0.7} />
      <rect x={50} y={34} width={16} height={16} fill="var(--ll-sun)" />
      <rect x={90} y={32} width={20} height={20} fill="var(--ll-palm-bark)" opacity={0.7} />
      <rect x={92} y={34} width={16} height={16} fill="var(--ll-sun)" />
      <circle cx={130} cy={70} r={14} fill="var(--ll-palm)" opacity={0.8} />
    </g>
  );
}
