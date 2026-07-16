'use client';

/**
 * ScheduleTimeline — "This week, on the route" strip on `/`.
 *
 * Mounts between ServiceAreaMap and FAQAccordion as a fourth
 * typographic moment — the operator's weekly schedule, made
 * visible. Reduces the operational mystery ("what day do you
 * actually come?") that turns into a support question for every
 * new customer.
 *
 * Reads `lib/content.ts → weeklySchedule`. Each day is a row
 * showing the ZIPs routed that day + a click-to-expand yard list.
 *
 * Layout: horizontal scroll-snap strip on desktop, vertical stack
 * on mobile. Each day has a 1×1 dot of the team color + ZIPs in
 * mono. Reduced-motion: no scroll-snap animation, instant.
 *
 * Client component so we can detect "today" client-side
 * and highlight it with `data-today="true"`. The day-pulse animation
 * is gated by `prefers-reduced-motion`.
 *
 * D-0030 (Wave C of three sequential design changes) — visual
 * system hygiene pass:
 *   - Section rhythm: loose → default. D-0030 mandates even
 *     vertical padding (--space-10 / 64px) across all sections
 *     in the in-scope list. ServiceAreaMap is out of scope
 *     (D-0028 lock); ScheduleTimeline + FAQAccordion move
 *     down to match the others.
 *   - FadeUp wrapper removed (below-fold = static per D-0030
 *     motion gating). The strip renders flat on first paint.
 *
 * This is a static v1 — future Supabase dynamic would replace
 * the content registry source without touching layout.
 */

import { useEffect, useState, type ReactNode } from 'react';

import { Section } from '@/components/site';
import { Illustration } from '@/components/ui';
import { cn } from '@/lib/cn';
import { weeklySchedule } from '@/lib/content';

import styles from './ScheduleTimeline.module.css';

interface ScheduleTimelineProps {
  className?: string | undefined;
}

/** Maps JS Date.getDay() (0=Sun) to the day-key used in `weeklySchedule`. */
const DAY_KEYS: ReadonlyArray<string> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ScheduleTimeline({ className }: ScheduleTimelineProps): ReactNode {
  const [todayKey, setTodayKey] = useState<string | null>(null);

  useEffect(() => {
    setTodayKey(DAY_KEYS[new Date().getDay()] ?? null);
  }, []);

  return (
    <Section
      tone="default"
      className={cn(styles.root, className)}
      data-test-section="schedule-timeline"
    >
      <div className="container">
        <header className={styles.header}>
          <h2 className={styles.heading}>Which day the mower shows up.</h2>
          <p className={styles.lede}>
            A static snapshot for the current week. If a holiday shifts the route, you'll see a
            banner at the top of the site before the day.
          </p>
        </header>

        <ol className={styles.strip} aria-label="Weekly mowing schedule">
          {weeklySchedule.map((day) => {
            const isToday = todayKey === day.day;
            return (
              <li
                key={day.day}
                className={styles.day}
                data-day={day.day}
                data-today={isToday ? 'true' : undefined}
              >
                <div className={styles.dayHead}>
                  <span className={styles.dayDot} aria-hidden="true" />
                  <span className={styles.dayName}>{day.day}</span>
                  {day.closed ? (
                    <span className={styles.dayMeta}>Closed</span>
                  ) : (
                    <span className={styles.dayMeta}>{day.yards} yards</span>
                  )}
                </div>
                {!day.closed && (
                  <div className={styles.dayBody}>
                    <span className={styles.zipLabel}>ZIPs on route</span>
                    <ul className={styles.zipList}>
                      {day.zips.map((zip) => (
                        <li key={zip} className={styles.zip}>
                          {zip}
                        </li>
                      ))}
                    </ul>
                    {isToday && (
                      <>
                        <span className={styles.todayBadge} aria-label="Today's route">
                          Today
                        </span>
                        <Illustration
                          src="/illustrations/mower-side-profile-v3-120.webp"
                          alt=""
                          width={120}
                          height={120}
                          className={styles.todayMower}
                        />
                      </>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
