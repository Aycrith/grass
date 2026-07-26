/**
 * Schedule helpers — Mission 1 (D-0035)
 *
 * Pure functions consumed by the ScheduleTimeline component and
 * any other surface that needs the operator's route day-by-day.
 * These are deliberately *not* in the React tree (no JSX, no
 * hooks) so the component stays presentational and these
 * helpers stay unit-testable.
 *
 * Previously co-located in `lib/business.ts` (which also exports
 * the BUSINESS constants, NAP, hours, and pricing floor). The
 * schedule helpers are a separate concern — they don't read
 * BUSINESS at all, they read the `weeklySchedule` / `dayMeta`
 * data from `lib/content.ts`. Extracted to its own file so
 * the import surface for each file is minimal:
 *   - `lib/business` for NAP + pricing
 *   - `lib/schedule` for route-day math
 *   - `lib/content` for the schedule data itself
 */

export type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

/** JS Date.getDay() (0=Sun) -> day-key used in weeklySchedule / dayMeta. */
export const DAY_KEYS: ReadonlyArray<DayKey> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Build a `Record<DayKey, V>` with every day-key mapped to
 * the same default value. Replaces the 7-line `{ Mon: X, Tue: X,
 * Wed: X, Thu: X, Fri: X, Sat: X, Sun: X }` literal that the
 * ScheduleTimeline component needed 4 times (for zipsByDay,
 * yardsByDay, etaStartByDay, etaEndByDay). The `V` type is
 * inferred from the argument.
 */
export function emptyDayRecord<V>(defaultValue: V): Record<DayKey, V> {
  return {
    Mon: defaultValue,
    Tue: defaultValue,
    Wed: defaultValue,
    Thu: defaultValue,
    Fri: defaultValue,
    Sat: defaultValue,
    Sun: defaultValue,
  };
}

/** Opposite of DAY_KEYS — index for a given day-key. */
export function dayIndex(key: DayKey): number {
  return DAY_KEYS.indexOf(key);
}

/** Today's day-key (local TZ). Pure (no Date.now() calls in the
 * exported shape) so SSR + first client render agree. */
export function todayKey(now: Date = new Date()): DayKey {
  return DAY_KEYS[now.getDay()] ?? 'Mon';
}

/**
 * Find the next day (>= today) the given ZIP is on the route.
 * Walks up to 14 days forward. Returns null if the ZIP never
 * appears on the schedule (e.g. a non-home-area ZIP).
 *
 * `zipsByDay` is a record of day-key -> ReadonlyArray<zip> so
 * the caller (component) passes the raw weeklySchedule data.
 */
export function nextMowForZip(
  zip: string,
  zipsByDay: Readonly<Record<DayKey, ReadonlyArray<string>>>,
  now: Date = new Date(),
): { day: DayKey; daysFromNow: number; isoDate: string } | null {
  const today = todayKey(now);
  const todayIdx = dayIndex(today);
  for (let offset = 0; offset < 14; offset += 1) {
    const idx = (todayIdx + offset) % 7;
    const k = DAY_KEYS[idx] ?? 'Mon';
    const zips = zipsByDay[k] ?? [];
    if (zips.includes(zip)) {
      // Build the ISO date for the match.
      const target = new Date(now);
      target.setDate(now.getDate() + offset);
      return {
        day: k,
        daysFromNow: offset,
        isoDate: target.toISOString().slice(0, 10),
      };
    }
  }
  return null;
}

/**
 * Find the ZIP the operator is currently mowing (deterministic
 * by hour-of-day for the v1 static page). Returns null if
 * outside any work day or before the ETA window starts.
 *
 * Logic: spread the day's yards across the ETA window at 1
 * yard per ~25 minutes. The "current" yard is the one whose
 * window brackets `now`. Within that yard, pick a deterministic
 * ZIP from the day's zips list by yard-index modulo zips.length.
 *
 * When the day's zips list is shorter than yards, we cycle
 * through the zips in order. The result is a stable,
 * reproducible "the operator is in {zip} right now" indicator
 * — not a real-time feed, but accurate enough to make the
 * section feel alive.
 */
export function currentRouteProgress(
  zipsByDay: Readonly<Record<DayKey, ReadonlyArray<string>>>,
  yardsByDay: Readonly<Record<DayKey, number>>,
  etaStartByDay: Readonly<Record<DayKey, string | null>>,
  etaEndByDay: Readonly<Record<DayKey, string | null>>,
  now: Date = new Date(),
): { doneYards: number; totalYards: number; currentZip: string; currentNeighborhood: string | null } | null {
  const day = todayKey(now);
  const zips = zipsByDay[day] ?? [];
  const total = yardsByDay[day] ?? 0;
  const startStr = etaStartByDay[day];
  const endStr = etaEndByDay[day];
  if (zips.length === 0 || total === 0 || !startStr || !endStr) return null;

  const start = parseHM(startStr);
  const end = parseHM(endStr);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  if (nowMin < start || nowMin > end) return null;

  const elapsed = nowMin - start;
  const span = end - start;
  if (span <= 0) return null;
  const ratio = Math.min(1, Math.max(0, elapsed / span));
  // The current yard index is round(ratio * (total - 1)).
  const yardIdx = Math.min(total - 1, Math.max(0, Math.round(ratio * (total - 1))));
  // doneYards is floor(ratio * total), capped at total - 1 so the
  // message reads "n of m done" not "n of m done" with n===m before
  // the day is genuinely over.
  const doneYards = Math.min(total - 1, Math.floor(ratio * total));
  const zipIdx = yardIdx % zips.length;
  const currentZip = zips[zipIdx] ?? zips[0] ?? '';
  return {
    doneYards,
    totalYards: total,
    currentZip,
    currentNeighborhood: null, // resolved at call-site via pinLocations
  };
}

function parseHM(s: string): number {
  const [h, m] = s.split(':').map((n) => Number.parseInt(n, 10));
  return (h ?? 0) * 60 + (m ?? 0);
}

/**
 * Days back to the previous mow for the given ZIP, or null if
 * the ZIP isn't on the schedule. Walks up to 14 days back.
 */
export function daysSinceLastMow(
  zip: string,
  zipsByDay: Readonly<Record<DayKey, ReadonlyArray<string>>>,
  now: Date = new Date(),
): number | null {
  const todayIdx = dayIndex(todayKey(now));
  for (let offset = 1; offset <= 14; offset += 1) {
    const idx = (todayIdx - offset + 7) % 7;
    const k = DAY_KEYS[idx] ?? 'Mon';
    const zips = zipsByDay[k] ?? [];
    if (zips.includes(zip)) return offset;
  }
  return null;
}

/**
 * Lookup the human-readable neighborhood for a ZIP via the
 * serviceAreaMap.pinLocations registry. Returns null if the ZIP
 * isn't in the registry (e.g. a non-home-area ZIP).
 */
export function neighborhoodFor(
  zip: string,
  pinLocations: Readonly<Record<string, string>>,
): string | null {
  return pinLocations[zip] ?? null;
}

/**
 * Build the "this month" calendar matrix: 7 columns (Sun-Sat)
 * × N rows, where each cell is either a day-of-month number
 * or null for the padding cells before/after the 1st.
 *
 * Cells are stamped with whether they have a mow day (any
 * work-day in that week's column). Today is flagged so the
 * renderer can highlight it.
 */
export interface MonthCell {
  dayOfMonth: number;
  date: Date;
  isToday: boolean;
  isMowDay: boolean;
  /** Day-key (Mon..Sun) for that date. */
  dayKey: DayKey;
  /** ISO YYYY-MM-DD for that date. */
  iso: string;
  inCurrentMonth: boolean;
}

export function buildMonthMatrix(
  year: number,
  month: number, // 0-indexed (0=Jan)
  zipsByDay: Readonly<Record<DayKey, ReadonlyArray<string>>>,
  now: Date = new Date(),
): MonthCell[] {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: MonthCell[] = [];

  // Leading padding (prior month tail).
  for (let i = 0; i < startWeekday; i += 1) {
    const d = new Date(year, month, 1 - (startWeekday - i));
    cells.push(makeCell(d, false, zipsByDay, now));
  }
  // In-month cells.
  for (let day = 1; day <= daysInMonth; day += 1) {
    const d = new Date(year, month, day);
    cells.push(makeCell(d, true, zipsByDay, now));
  }
  // Trailing padding to fill the last row.
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1];
    if (!last) break;
    const d = new Date(last.date);
    d.setDate(d.getDate() + 1);
    cells.push(makeCell(d, false, zipsByDay, now));
  }
  return cells;
}

function makeCell(
  date: Date,
  inCurrentMonth: boolean,
  zipsByDay: Readonly<Record<DayKey, ReadonlyArray<string>>>,
  now: Date,
): MonthCell {
  const k = DAY_KEYS[date.getDay()] ?? 'Mon';
  const zips = zipsByDay[k] ?? [];
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  return {
    dayOfMonth: date.getDate(),
    date,
    isToday,
    isMowDay: zips.length > 0,
    dayKey: k,
    iso: date.toISOString().slice(0, 10),
    inCurrentMonth,
  };
}
