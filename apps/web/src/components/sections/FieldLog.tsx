'use client';

/**
 * FieldLog — D-0055 editorial "field log" section.
 *
 * A stand-alone editorial moment between the OperatorStrip (where
 * the operator is introduced) and the ServiceBento (where the work
 * is listed). Solves three diagnostic findings in one section:
 *
 *   1. The 6 ZIPs are referenced in 4 different places (form,
 *      ambient palms, hero per-ZIP strip, schedule) but the visitor
 *      never sees the *route* — the connection between them. This
 *      section is the first place the route is visible.
 *   2. The operator's voice is consistent but never has an editorial
 *      moment. The pull-quote is the page's first stand-alone
 *      quote — poetic, not functional.
 *   3. The brand's visual signatures (passport-stamp, paper-grain,
 *      hand-drawn cartoon) appear once each. This section repeats
 *      them so they read as a language, not a one-off.
 *
 * Design rationale (full brief in apps/web/audit/d-0055-field-log/memo.md):
 *
 *   - Single column, max-width 920px, centered.
 *   - 5 vertical zones: eyebrow → pull-quote → route SVG → field
 *     note → passport stamp.
 *   - Background: cream + paper-grain.svg texture (5% opacity,
 *     inherited from globals.css body::before — no new asset).
 *   - Pull-quote: "The yard never knows the difference. The operator
 *     does." Fraunces italic 500, palm-bark, 22ch max-width.
 *   - Route: hand-authored flat-fill SVG cartoon, 720×280 viewBox,
 *     6 houses in a rough cluster, winding path, sun-yellow truck
 *     marker at "today" (33771). Matches the hero scene 1 cartoon
 *     style (D-0049 lesson: hand-authored SVG cartoon, not painted
 *     VEO brushwork, for a NEW hand-drawn content piece).
 *   - 3 CSS animations on viewport entry, all gated by
 *     prefers-reduced-motion: path draw-in, stamp slam, eyebrow
 *     fade-up.
 *
 * Animations use Framer Motion's `whileInView` for the trigger
 * (so SSR + first client render agree, no hydration mismatch) and
 * pure CSS for the actual animation (cheaper than motion.div for
 * stroke-dashoffset + scale).
 */

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef, type ReactNode } from 'react';

import { Container, Section } from '@/components/site';

import styles from './FieldLog.module.css';

export function FieldLog(): ReactNode {
  // Trigger path draw-in + stamp slam when the section enters the
  // viewport. amount: 0.3 = "30% of the section is in view" so the
  // animations start when the visitor scrolls to it (not before).
  // The Section component doesn't accept a ref, so we attach the
  // ref to the inner container instead.
  const innerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(innerRef, { once: true, amount: 0.2 });

  return (
    <Section
      tone="warm"
      className={styles.root}
      data-test-section="field-log"
    >
      <Container>
        <div className={styles.inner} ref={innerRef}>
          {/* Zone 1 + 2: eyebrow + pull-quote (fade-up on viewport entry) */}
          <motion.div
            className={styles.quoteBlock}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.eyebrow}>
              Field log <span className={styles.eyebrowDot} aria-hidden="true">·</span>{' '}
              Week 28
            </span>
            <blockquote className={styles.quote}>
              The yard never knows the difference.{' '}
              <span className={styles.quoteEm}>The operator does.</span>
            </blockquote>
          </motion.div>

          {/* Zone 3: hand-drawn route SVG (path draw-in on viewport entry) */}
          <div className={styles.routeFrame}>
            <RouteMap animated={inView} />
          </div>

          {/* Zone 4: field note (right-aligned, italic) */}
          <motion.p
            className={styles.fieldNote}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Forty-seven yards, six ZIPs, the same truck, every week.
            <br />
            You&apos;ll know my face before you know my name.
          </motion.p>

          {/* Zone 5: passport stamp (slam animation on viewport entry) */}
          <motion.div
            className={styles.stamp}
            initial={{ opacity: 0, scale: 1.4, rotate: -12 }}
            animate={
              inView
                ? { opacity: 0.85, scale: 1, rotate: -2 }
                : { opacity: 0, scale: 1.4, rotate: -12 }
            }
            transition={{ duration: 0.4, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
            aria-hidden="true"
          >
            <Image
              src="/illustrations/passport-stamp.svg"
              alt=""
              width={100}
              height={100}
              className={styles.stampImage}
            />
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------
 * RouteMap — hand-drawn 6-house weekly route.
 *
 * Pure SVG cartoon, 720x280 viewBox. Six houses positioned in a
 * rough cluster (matching the actual ZIP geography: 33756 NW,
 * 33770 NE, 33771 center, 33773 E, 33774 SE, 33778 SW). A winding
 * cubic-bezier path connects them in the order of weeklySchedule.
 * The truck marker is sun-yellow filled and sits at 33771 (today,
 * Tuesday).
 *
 * Path draw-in: the path's `stroke-dasharray` is set to its full
 * length; `stroke-dashoffset` starts at the same value and
 * animates to 0 over 1.6s with ease-out-quart. The truck marker
 * fades in (opacity 0 → 1) at the same time, slightly delayed, so
 * it appears AS the path "arrives" at the today position.
 *
 * prefers-reduced-motion: the path renders as fully drawn and the
 * truck as fully visible (no animation).
 * ----------------------------------------------------------------- */

interface RouteMapProps {
  animated: boolean;
}

function RouteMap({ animated }: RouteMapProps): ReactNode {
  // Path length tuned by hand: this winding path is ~600-650 units
  // long. We use 720 to ensure the dashoffset fully clears the path
  // when the animation completes (a small overshoot is invisible
  // because the path is bounded by its visible length).
  const PATH_LENGTH = 720;

  return (
    <svg
      className={styles.route}
      viewBox="0 0 720 280"
      role="img"
      aria-label="Hand-drawn map of the operator's weekly route through six Largo ZIPs. The truck is at 33771 today."
    >
      <title>The route — week 28</title>
      <desc>
        Six houses connected by a winding hand-drawn path. The sun-yellow
        truck is at 33771 (Tuesday, today). The other five houses are
        33756, 33770, 33773, 33774, 33778 — Monday, Monday, Thursday,
        Friday, Saturday in weekly order.
      </desc>

      {/* The route path. Hand-tuned cubic bezier with intentionally
       * imperfect curves (the wobble is the "hand-drawn" signal —
       * a perfect arc would read as a digital route line). */}
      <path
        className={styles.routePath}
        d="M 110 80
           C 130 60, 180 60, 230 70
           C 280 80, 320 110, 360 130
           C 400 145, 440 130, 490 110
           C 540 90, 600 130, 600 180
           C 600 210, 540 220, 470 220
           C 380 220, 280 210, 200 220"
        style={{
          strokeDasharray: PATH_LENGTH,
          strokeDashoffset: animated ? 0 : PATH_LENGTH,
        }}
      />

      {/* Six houses. Each is a roof + body + door, hand-authored
       * flat-fill. The 33771 (today) house is filled sun-yellow
       * (cream-tinted) so it reads as the active destination. */}
      <House x={110} y={80} zip="33756" day="Mon" />
      <House x={230} y={70} zip="33770" day="Mon" />
      <House x={360} y={130} zip="33771" day="Tue" today />
      <House x={490} y={110} zip="33773" day="Thu" />
      <House x={600} y={180} zip="33774" day="Fri" />
      <House x={200} y={220} zip="33778" day="Sat" />

      {/* The truck marker. Sun-yellow filled, sits at 33771 (today).
       * The fade-in is delayed by 50% of the path animation so the
       * truck "arrives" at 33771 as the path reaches it. */}
      <g
        className={styles.truck}
        style={{ opacity: animated ? 1 : 0 }}
        transform="translate(395 124)"
        aria-label="Operator's truck at today's stop, 33771"
      >
        {/* Truck body (cabin + bed, flat-fill sun yellow) */}
        <rect x="-12" y="-2" width="18" height="8" rx="1" fill="var(--ll-sun)" />
        <rect x="-9" y="-6" width="8" height="4" rx="0.5" fill="var(--ll-sun)" />
        {/* Wheels */}
        <circle cx="-7" cy="7" r="2.5" fill="var(--ll-palm-bark)" />
        <circle cx="3" cy="7" r="2.5" fill="var(--ll-palm-bark)" />
        {/* Outline so the truck reads against any background */}
        <rect
          x="-12"
          y="-2"
          width="18"
          height="8"
          rx="1"
          fill="none"
          stroke="var(--ll-palm-bark)"
          strokeWidth="0.8"
        />
      </g>

      {/* Editorial title strip at the bottom of the SVG */}
      <text
        className={styles.routeTitle}
        x="360"
        y="265"
        textAnchor="middle"
      >
        The route · Mon → Sat · 47 yards
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------
 * House — small hand-authored cartoon house for the route map.
 * 28x28 in the SVG viewBox (~50px on a 1280px desktop viewport).
 * Roof triangle + body rect + door + window.
 *
 * The `today` variant uses sun-yellow fill + 1.6px stroke (vs
 * 1.2px on the other houses) so it reads as the highlighted
 * destination.
 * ----------------------------------------------------------------- */

interface HouseProps {
  x: number;
  y: number;
  zip: string;
  day: string;
  today?: boolean;
}

function House({ x, y, zip, day, today = false }: HouseProps): ReactNode {
  return (
    <g
      className={`${styles.house} ${today ? styles.houseToday : ''}`}
      transform={`translate(${x} ${y})`}
    >
      {/* Body */}
      <path
        d="M -14 4 L 0 -10 L 14 4 L 14 16 L -14 16 Z"
        fill={today ? '#fff8e6' : '#ffffff'}
        stroke="var(--ll-palm-bark)"
        strokeWidth={today ? 1.6 : 1.2}
      />
      {/* Door */}
      <rect x="-3" y="7" width="6" height="9" fill="var(--ll-palm-bark)" />
      {/* Window (small square) */}
      <rect x="-11" y="6" width="5" height="4" fill="var(--ll-palm-bark)" opacity="0.3" />
      <rect x="6" y="6" width="5" height="4" fill="var(--ll-palm-bark)" opacity="0.3" />
      {/* ZIP label */}
      <text x="0" y="32" textAnchor="middle" className={styles.houseZip}>
        {zip}
      </text>
      {/* Day label */}
      <text x="0" y="44" textAnchor="middle" className={styles.houseDay}>
        {today ? `${day} · today` : day}
      </text>
    </g>
  );
}
