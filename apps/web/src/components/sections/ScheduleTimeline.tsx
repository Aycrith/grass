'use client';

/**
 * ScheduleTimeline — "This week, on the route" strip on `/`.
 *
 * D-0035: the schedule was a static text wall. Five typographic
 * moments added (ledger header, resolver, month grid, week strip,
 * subscribe).
 *
 * D-0036: conversion-first rebuild. The principle applied across
 * the whole landing page: every interactive moment earns its
 * place by pushing toward /quote. Specific changes:
 *
 *   - **Resolver hit panel** ends with a primary CTA
 *     ("Lock in Saturday \u2192") that routes to /quote with the
 *     matched ZIP and day pre-filled. The result is no longer
 *     informational; it is a step in the booking funnel.
 *   - **Today card** has a primary CTA at the bottom
 *     ("Book this mow \u2192") so the most visually salient card
 *     in the section is also the one with the clearest next
 *     action.
 *   - **Each day card** has a "Book {Day}" mini-CTA at the
 *     bottom so the week strip is not just a status board \u2014
 *     every day is one click from /quote.
 *   - **Month calendar** is collapsed behind a "See full
 *     month" toggle. Reference info; not conversion-driving.
 *   - **Subscribe CTA** is kept but de-emphasized (smaller
 *     copy, secondary visual weight) so it doesn't compete
 *     with the primary /quote path.
 *
 * Animations (D-0036):
 *   - **Scroll-reveal stagger** on the day cards: each card
 *     fades up 12px as it enters the viewport, 70ms stagger.
 *     The today card animates last and largest. Uses
 *     Framer Motion's `whileInView` so SSR + first client
 *     render agree (no hydration mismatch).
 *   - **Today-card attention pulse** on scroll-into-view:
 *     a one-time 1.2s clay-bloom on the today card. Gated by
 *     `useReducedMotion()`.
 *   - **Resolver result slide-in** when the user submits: a
 *     spring-loaded slide-up + fade. Reads as "the system is
 *     responding to you."
 *   - **Primary CTA breathing pulse** on the resolver hit
 *     and today card: a 3s ease-in-out clay glow. Gated by
 *     `useReducedMotion()`.
 *   - **Day card hover lift**: subtle 2px translateY + clay
 *     border on hover. Disabled under reduced motion.
 *
 * Layout follows D-0035 (horizontal scroll-snap strip on
 * desktop, vertical stack on mobile, scroll-snap disabled
 * under reduced motion).
 */

import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Section } from '@/components/site';
import { Button, Illustration } from '@/components/ui';
import {
  type DayKey,
  buildMonthMatrix,
  currentRouteProgress,
  dayIndex,
  daysSinceLastMow,
  neighborhoodFor,
  nextMowForZip,
  todayKey,
} from '@/lib/business';
import { cn } from '@/lib/cn';
import {
  dayBookCta,
  dayMeta,
  holidaySkips,
  scheduleResolver,
  serviceAreaMap,
  subscribeToRoute,
  weeklySchedule,
} from '@/lib/content';

import styles from './ScheduleTimeline.module.css';

interface ScheduleTimelineProps {
  className?: string | undefined;
}

// --- Per-day field-log pictograms ------------------------------------------

const DAY_ICON: Record<
  'mow' | 'edge' | 'mulch' | 'trim' | 'blow' | 'rest' | 'closed' | 'holiday',
  ReactNode
> = {
  mow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2 16h16l2-4h2v4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M6 12V8h6l2 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  edge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 20c4-2 6-6 6-12 4 2 6 6 6 12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 20h12" strokeLinecap="round" />
    </svg>
  ),
  mulch: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 16c2-3 5-3 7 0s5 3 7 0 4-3 4-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 20h18" strokeLinecap="round" />
    </svg>
  ),
  trim: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M5 19l8-8" strokeLinecap="round" />
      <path d="M11 13l3 3 5-5-3-3z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 6l2-2" strokeLinecap="round" />
    </svg>
  ),
  blow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 12h10a3 3 0 0 0 0-6H4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8h-3" strokeLinecap="round" />
      <path d="M16 18l3-3M19 15l3 3" strokeLinecap="round" />
    </svg>
  ),
  rest: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M20 14a8 8 0 1 0-8 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 14h-4V10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  closed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 8l8 8M16 8l-8 8" strokeLinecap="round" />
    </svg>
  ),
  holiday: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3v18M5 8h14M5 16h14" strokeLinecap="round" />
      <path d="M9 5l3-2 3 2M9 19l3 2 3-2" strokeLinecap="round" />
    </svg>
  ),
};

const DAY_LONG: Record<DayKey, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

// --- Framer Motion variants -------------------------------------------------
// Card-fade-up on scroll-into-view. 70ms stagger per card so the eye walks
// the strip left-to-right. Reduced-motion: instant, no transition.
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  shown: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const reducedCardVariants = {
  hidden: { opacity: 1, y: 0 },
  shown: { opacity: 1, y: 0 },
};

const resultVariants = {
  hidden: { opacity: 0, y: 12 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 220, damping: 24 },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const reducedResultVariants = {
  hidden: { opacity: 1, y: 0 },
  shown: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 },
};

export function ScheduleTimeline({ className }: ScheduleTimelineProps): ReactNode {
  // --- Today / current-time resolution ----------------------------------
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const today = now ? todayKey(now) : 'Mon';
  const currentDayIndex = now ? now.getDay() : 1;
  const reducedMotion = useReducedMotion();

  // --- Derived data tables (memoized) ----------------------------------
  const zipsByDay = useMemo<Record<DayKey, ReadonlyArray<string>>>(() => {
    const m: Record<DayKey, ReadonlyArray<string>> = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    };
    for (const day of weeklySchedule) {
      m[day.day as DayKey] = day.zips;
    }
    return m;
  }, []);

  const yardsByDay = useMemo<Record<DayKey, number>>(() => {
    const m: Record<DayKey, number> = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0,
    };
    for (const day of weeklySchedule) {
      m[day.day as DayKey] = day.yards;
    }
    return m;
  }, []);

  const etaStartByDay = useMemo<Record<DayKey, string | null>>(() => {
    const m: Record<DayKey, string | null> = {
      Mon: null, Tue: null, Wed: null, Thu: null, Fri: null, Sat: null, Sun: null,
    };
    for (const k of Object.keys(dayMeta) as DayKey[]) m[k] = dayMeta[k].etaStart;
    return m;
  }, []);

  const etaEndByDay = useMemo<Record<DayKey, string | null>>(() => {
    const m: Record<DayKey, string | null> = {
      Mon: null, Tue: null, Wed: null, Thu: null, Fri: null, Sat: null, Sun: null,
    };
    for (const k of Object.keys(dayMeta) as DayKey[]) m[k] = dayMeta[k].etaEnd;
    return m;
  }, []);

  const routeProgress = useMemo(() => {
    if (!now) return null;
    return currentRouteProgress(zipsByDay, yardsByDay, etaStartByDay, etaEndByDay, now);
  }, [now, zipsByDay, yardsByDay, etaStartByDay, etaEndByDay]);

  const monthCells = useMemo(() => {
    if (!now) return [];
    return buildMonthMatrix(now.getFullYear(), now.getMonth(), zipsByDay, now);
  }, [now, zipsByDay]);

  const activeSkip = useMemo(() => {
    if (!now) return null;
    const horizon = new Date(now);
    horizon.setDate(now.getDate() + 7);
    for (const skip of holidaySkips) {
      const skipDate = new Date(`${skip.date}T00:00:00`);
      if (skipDate >= now && skipDate <= horizon) return skip;
    }
    return null;
  }, [now]);

  // Month calendar collapsed by default. D-0036 — reference info, not
  // conversion-driving. The "See full month" toggle reveals it on demand.
  const [showMonth, setShowMonth] = useState(false);

  // --- "Find your mow day" resolver ------------------------------------
  const resolverId = useId();
  const [query, setQuery] = useState('');
  const [resolved, setResolved] = useState<
    | { kind: 'hit'; zip: string; neighborhood: string | null; day: DayKey; daysFromNow: number; eta: string | null; firstZip: string }
    | { kind: 'miss'; query: string }
    | { kind: 'idle' }
  >({ kind: 'idle' });

  const onResolve = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 3) {
      setResolved({ kind: 'idle' });
      return;
    }

    const isZip = /^\d{5}$/.test(q);
    let zip: string | null = null;
    if (isZip) {
      zip = q;
    } else {
      const tokens = q
        .toLowerCase()
        .split(/[\s,/()]+/)
        .filter((t) => t.length >= 3);
      for (const [z, label] of Object.entries(serviceAreaMap.pinLocations)) {
        const lower = label.toLowerCase();
        if (tokens.some((t) => lower.includes(t))) {
          zip = z;
          break;
        }
      }
    }

    if (!zip) {
      setResolved({ kind: 'miss', query: q });
      return;
    }

    const next = nextMowForZip(zip, zipsByDay, now ?? new Date());
    if (!next) {
      setResolved({ kind: 'miss', query: q });
      return;
    }
    const eta =
      etaStartByDay[next.day] && etaEndByDay[next.day]
        ? `${etaStartByDay[next.day]} to ${etaEndByDay[next.day]}`
        : null;
    setResolved({
      kind: 'hit',
      zip,
      neighborhood: neighborhoodFor(zip, serviceAreaMap.pinLocations),
      day: next.day,
      daysFromNow: next.daysFromNow,
      eta,
      firstZip: zip,
    });
  };

  // --- Render -----------------------------------------------------------
  const weekStart = useMemo(() => {
    if (!now) return null;
    const d = new Date(now);
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - (day - 1));
    d.setHours(0, 0, 0, 0);
    return d;
  }, [now]);

  const weekEnd = useMemo(() => {
    if (!weekStart) return null;
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    return d;
  }, [weekStart]);

  const weekLabel = useMemo(() => {
    if (!weekStart || !weekEnd) return '';
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(weekStart)} to ${fmt(weekEnd)}`;
  }, [weekStart, weekEnd]);

  const monthLabel = useMemo(() => {
    if (!now) return '';
    return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [now]);

  // --- Intersection observer on the today card for the attention pulse
  // The today card's clay-bloom runs once when it enters the viewport.
  const todayRef = useRef<HTMLDivElement | null>(null);
  const todayInView = useInView(todayRef, { once: true, amount: 0.5 });
  const useMotion = !reducedMotion;

  // URL builder for /quote with prefill.
  const quoteHref = (zip: string | null | undefined, day: DayKey | null | undefined) => {
    const params = new URLSearchParams();
    if (zip) params.set('zip', zip);
    if (day) params.set('day', day);
    return `/quote?${params.toString()}`;
  };

  return (
    <Section
      tone="default"
      className={cn(styles.root, className)}
      data-test-section="schedule-timeline"
    >
      <div className="container">
        {/* === Header (compact) ============================================ */}
        <header className={styles.header}>
          <div className={styles.headerRow}>
            <div className={styles.headerCopy}>
              <h2 className={styles.heading}>Which day the mower shows up.</h2>
              <p className={styles.lede}>
                Type your ZIP. I&rsquo;ll show you the day, the time, and lock in a free quote.
              </p>
            </div>
            <span className={styles.weekMeta} aria-label="Current week">
              Week of {weekLabel || '\u2014'}
            </span>
          </div>

          {activeSkip && (
            <div className={styles.skipBanner} role="status">
              <span className={styles.skipBannerIcon} aria-hidden="true">
                {DAY_ICON.holiday}
              </span>
              <span className={styles.skipBannerText}>
                <strong>Route shift this week.</strong> {activeSkip.reason}.
              </span>
            </div>
          )}
        </header>

        {/* === Resolver (the BIG primary action) =========================== */}
        <section className={styles.resolver} aria-labelledby={`${resolverId}-label`}>
          <span className={styles.resolverEyebrow} id={`${resolverId}-label`}>
            {scheduleResolver.eyebrow}
          </span>
          <form className={styles.resolverForm} onSubmit={onResolve} role="search">
            <label htmlFor={`${resolverId}-input`} className={styles.srOnly}>
              {scheduleResolver.inputLabel}
            </label>
            <input
              id={`${resolverId}-input`}
              type="search"
              inputMode="search"
              autoComplete="postal-code"
              className={styles.resolverInput}
              placeholder={scheduleResolver.placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (resolved.kind !== 'idle') setResolved({ kind: 'idle' });
              }}
              maxLength={32}
            />
            <Button as="button" type="submit" variant="primary" size="md">
              {scheduleResolver.cta}
            </Button>
          </form>

          <AnimatePresence mode="wait" initial={false}>
            {resolved.kind === 'hit' && (
              <motion.div
                key="hit"
                className={cn(styles.resolverHit, styles.resolverHitPulse)}
                variants={useMotion ? resultVariants : reducedResultVariants}
                initial="hidden"
                animate="shown"
                exit="exit"
              >
                <span className={styles.resolverHitLabel}>{scheduleResolver.hitHeading}</span>
                <span className={styles.resolverHitValue}>
                  {DAY_LONG[resolved.day]}
                  {resolved.daysFromNow > 0 && (
                    <span className={styles.resolverHitRelative}>
                      {' \u00b7 in '}
                      {resolved.daysFromNow} {resolved.daysFromNow === 1 ? 'day' : 'days'}
                    </span>
                  )}
                </span>
                <span className={styles.resolverHitMeta}>
                  {resolved.zip}
                  {resolved.neighborhood && <> &middot; {resolved.neighborhood}</>}
                  {resolved.eta && <> &middot; {resolved.eta}</>}
                </span>
                <Button
                  as="link"
                  href={quoteHref(resolved.firstZip, resolved.day)}
                  variant="sun"
                  size="lg"
                  className={styles.resolverHitCta}
                >
                  <span>
                    {scheduleResolver.hitCta.replace('{day}', DAY_LONG[resolved.day])}
                  </span>
                  <span className={styles.ctaArrow} aria-hidden="true">
                    &rarr;
                  </span>
                </Button>
              </motion.div>
            )}
            {resolved.kind === 'miss' && (
              <motion.div
                key="miss"
                className={styles.resolverMiss}
                variants={useMotion ? resultVariants : reducedResultVariants}
                initial="hidden"
                animate="shown"
                exit="exit"
              >
                <span className={styles.resolverMissLabel}>{scheduleResolver.missHeading}</span>
                <span className={styles.resolverMissBody}>{scheduleResolver.missBody}</span>
                <Button
                  as="link"
                  href={quoteHref(null, null)}
                  variant="sun"
                  size="md"
                  className={styles.resolverMissCta}
                >
                  <span>{scheduleResolver.missCta}</span>
                  <span className={styles.ctaArrow} aria-hidden="true">
                    &rarr;
                  </span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* === Today card (BIG with primary CTA) =========================== */}
        {(() => {
          const todayDayKey = today;
          const todayMeta = dayMeta[todayDayKey];
          const todayRow = weeklySchedule.find((d) => d.day === todayDayKey);
          if (!todayRow) return null;
          const firstZip = todayRow.zips[0] ?? null;
          return (
            <motion.div
              ref={todayRef}
              className={cn(
                styles.todayCard,
                todayRow.closed && styles.todayCardClosed,
                useMotion && todayInView && styles.todayCardPulse,
              )}
              variants={useMotion ? cardVariants : reducedCardVariants}
              custom={6}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className={styles.todayCardHead}>
                <span className={styles.todayCardBadge}>
                  <span className={styles.todayCardDot} aria-hidden="true" />
                  Today &middot; {DAY_LONG[todayDayKey]}
                </span>
                <span className={styles.todayCardYards}>
                  {todayRow.closed ? 'Closed' : `${todayRow.yards} yards`}
                </span>
              </div>
              <div className={styles.todayCardBody}>
                {!todayRow.closed && todayMeta.etaStart && todayMeta.etaEnd && (
                  <div className={styles.todayCardEta}>
                    <span className={styles.todayCardEtaIcon} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className={styles.todayCardEtaValue}>
                      {formatHM(todayMeta.etaStart)} to {formatHM(todayMeta.etaEnd)}
                    </span>
                  </div>
                )}
                {routeProgress && (
                  <div className={styles.todayCardProgress}>
                    <span className={styles.todayCardProgressLabel}>
                      Currently mowing in{' '}
                      <strong>
                        {routeProgress.currentZip}
                        {neighborhoodFor(routeProgress.currentZip, serviceAreaMap.pinLocations)
                          ? ` \u00b7 ${neighborhoodFor(routeProgress.currentZip, serviceAreaMap.pinLocations)}`
                          : ''}
                      </strong>
                    </span>
                    <div
                      className={styles.progressBar}
                      role="progressbar"
                      aria-valuenow={routeProgress.doneYards}
                      aria-valuemin={0}
                      aria-valuemax={routeProgress.totalYards}
                    >
                      <span
                        className={styles.progressFill}
                        style={{
                          width: `${
                            (routeProgress.doneYards / Math.max(1, routeProgress.totalYards)) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <span className={styles.todayCardProgressCount}>
                      <strong>{routeProgress.doneYards}</strong> of{' '}
                      {routeProgress.totalYards} done
                    </span>
                  </div>
                )}
                {!routeProgress && !todayRow.closed && (
                  <p className={styles.todayCardIdle}>
                    Mower runs {formatHM(todayMeta.etaStart ?? '07:00')} to{' '}
                    {formatHM(todayMeta.etaEnd ?? '17:00')}. Catch me on the next route.
                  </p>
                )}
                {todayRow.closed && (
                  <p className={styles.todayCardIdle}>{todayMeta.note}</p>
                )}
                <p className={styles.todayCardNote}>{todayMeta.note}</p>
              </div>
              <div className={styles.todayCardFoot}>
                <Button
                  as="link"
                  href={quoteHref(firstZip, todayDayKey)}
                  variant="sun"
                  size="lg"
                  className={styles.todayCardCta}
                >
                  <span>{dayBookCta.today}</span>
                  <span className={styles.ctaArrow} aria-hidden="true">
                    &rarr;
                  </span>
                </Button>
                <Illustration
                  src="/illustrations/mower-side-profile-v3-120.webp"
                  alt=""
                  width={120}
                  height={120}
                  className={styles.todayMower}
                />
              </div>
            </motion.div>
          );
        })()}

        {/* === Week strip (compact, with per-day mini-CTAs) ================ */}
        <section className={styles.week} aria-label="This week on the route">
          <div className={styles.weekHead}>
            <h3 className={styles.weekHeading}>This week</h3>
            <span className={styles.weekCount}>
              {weeklySchedule.reduce((sum, d) => sum + d.yards, 0)} yards &middot;{' '}
              {Array.from(new Set(weeklySchedule.flatMap((d) => d.zips))).length} ZIPs
            </span>
            <button
              type="button"
              className={styles.monthToggle}
              onClick={() => setShowMonth((s) => !s)}
              aria-expanded={showMonth}
              aria-controls="schedule-month"
            >
              {showMonth ? 'Hide month' : 'See full month'}
              <span className={styles.monthToggleArrow} aria-hidden="true">
                {showMonth ? '\u2212' : '+'}
              </span>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showMonth && (
              <motion.div
                id="schedule-month"
                key="month"
                className={styles.month}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                aria-label={`Mow days in ${monthLabel}`}
              >
                <div className={styles.monthHead}>
                  <h4 className={styles.monthHeading}>{monthLabel}</h4>
                  <span className={styles.monthLegend}>
                    <span className={styles.monthLegendDot} aria-hidden="true" />
                    mow day
                  </span>
                </div>
                <div className={styles.monthGrid} role="grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((wd) => (
                    <span key={wd} className={styles.monthWeekday} role="columnheader">
                      {wd}
                    </span>
                  ))}
                  {monthCells.map((cell) => (
                    <span
                      key={cell.iso}
                      className={cn(
                        styles.monthCell,
                        !cell.inCurrentMonth && styles.monthCellMuted,
                        cell.isMowDay && cell.inCurrentMonth && styles.monthCellMow,
                        cell.isToday && styles.monthCellToday,
                      )}
                      role="gridcell"
                      aria-current={cell.isToday ? 'date' : undefined}
                    >
                      <span className={styles.monthCellNum}>{cell.dayOfMonth}</span>
                      {cell.isMowDay && cell.inCurrentMonth && (
                        <span className={styles.monthCellDot} aria-hidden="true" />
                      )}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ol className={styles.strip} aria-label="Weekly mowing schedule">
            {weeklySchedule.map((day, i) => {
              const dayKey = day.day as DayKey;
              const meta = dayMeta[dayKey];
              const isToday = today === dayKey;
              const isPast = currentDayIndex > dayIndex(dayKey);
              const firstZip = day.zips[0] ?? null;
              return (
                <motion.li
                  key={day.day}
                  className={cn(
                    styles.day,
                    isToday && styles.dayToday,
                    isPast && !isToday && styles.dayPast,
                    day.closed && styles.dayClosed,
                  )}
                  data-day={day.day}
                  data-today={isToday ? 'true' : undefined}
                  variants={useMotion ? cardVariants : reducedCardVariants}
                  custom={i}
                  initial="hidden"
                  whileInView="shown"
                  viewport={{ once: true, amount: 0.25 }}
                >
                  <div className={styles.dayHead}>
                    <span className={styles.dayIcon} aria-hidden="true">
                      {DAY_ICON[meta.icon]}
                    </span>
                    <span className={styles.dayName}>{day.day}</span>
                    <span className={styles.dayMeta}>
                      {day.closed ? 'Closed' : `${day.yards} yards`}
                    </span>
                  </div>

                  {!day.closed && meta.etaStart && meta.etaEnd && (
                    <div className={styles.dayEta}>
                      <span className={styles.dayEtaIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" strokeLinecap="round" />
                        </svg>
                      </span>
                      <span className={styles.dayEtaValue}>
                        {formatHM(meta.etaStart)} to {formatHM(meta.etaEnd)}
                      </span>
                    </div>
                  )}

                  {!day.closed && (
                    <ul className={styles.zipList}>
                      {day.zips.slice(0, 3).map((zip) => {
                        const n = neighborhoodFor(zip, serviceAreaMap.pinLocations);
                        const lastMow = daysSinceLastMow(zip, zipsByDay, now ?? new Date());
                        return (
                          <li key={zip}>
                            <Link
                              href={`/areas/${zip}`}
                              className={styles.zip}
                              title={
                                n
                                  ? `${zip} \u00b7 ${n}${
                                      lastMow !== null
                                        ? ` \u00b7 last mowed ${lastMow}d ago`
                                        : ''
                                    }`
                                  : zip
                              }
                            >
                              <span className={styles.zipNumber}>{zip}</span>
                              {n && <span className={styles.zipNeighborhood}>{n}</span>}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {day.closed && <p className={styles.dayNote}>{meta.note}</p>}

                  {!day.closed && (
                    <Button
                      as="link"
                      href={quoteHref(firstZip, dayKey)}
                      variant="outline"
                      size="sm"
                      className={styles.dayCta}
                    >
                      <span>{dayBookCta.template.replace('{day}', day.day)}</span>
                      <span className={styles.ctaArrow} aria-hidden="true">
                        &rarr;
                      </span>
                    </Button>
                  )}
                </motion.li>
              );
            })}
          </ol>
        </section>

        {/* === Subscribe (small, secondary) ================================ */}
        <section className={styles.subscribe} aria-label="Subscribe to the route">
          <div className={styles.subscribeCopy}>
            <span className={styles.subscribeHeading}>
              <span className={styles.subscribeIcon} aria-hidden="true">
                {DAY_ICON.blow}
              </span>
              {subscribeToRoute.heading}
            </span>
            <span className={styles.subscribeBody}>{subscribeToRoute.body}</span>
          </div>
          <Button
            as="link"
            href={quoteHref(
              resolved.kind === 'hit' ? resolved.firstZip : null,
              null,
            )}
            variant="ghost"
            size="sm"
            className={styles.subscribeCta}
          >
            {subscribeToRoute.cta} &rarr;
          </Button>
        </section>
      </div>
    </Section>
  );
}

function formatHM(s: string): string {
  const [hStr, mStr] = s.split(':');
  const h = Number.parseInt(hStr ?? '0', 10);
  const m = Number.parseInt(mStr ?? '0', 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}
