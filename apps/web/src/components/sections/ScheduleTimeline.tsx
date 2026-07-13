/**
 * ScheduleTimeline — "This week, on the route" strip on `/`.
 *
 * Mounts between ServiceAreaMap (06) and OperatorNote (07) as a
 * fourth typographic moment — the operator's weekly schedule, made
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
 * This is a static v1 — future Supabase dynamic would replace
 * the content registry source without touching layout.
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { weeklySchedule } from '@/lib/content';

import styles from './ScheduleTimeline.module.css';

interface ScheduleTimelineProps {
  className?: string | undefined;
}

export function ScheduleTimeline({ className }: ScheduleTimelineProps): ReactNode {
  return (
    <Section rhythm="loose" tone="default" className={cn(styles.root, className)}>
      <div className="container">
        <header className={styles.header}>
          <Eyebrow tone="default" dot className={styles.eyebrow}>
            06.5 — On the route this week
          </Eyebrow>
          <h2 className={styles.heading}>Which day the mower shows up.</h2>
          <p className={styles.lede}>
            A static snapshot for the current week. If a holiday shifts the route, you'll see a
            banner at the top of the site before the day.
          </p>
        </header>

        <FadeUp>
          <ol className={styles.strip} aria-label="Weekly mowing schedule">
            {weeklySchedule.map((day) => (
              <li key={day.day} className={styles.day} data-day={day.day}>
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
                  </div>
                )}
              </li>
            ))}
          </ol>
        </FadeUp>
      </div>
    </Section>
  );
}
