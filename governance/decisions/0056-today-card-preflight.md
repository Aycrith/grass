# D-0056 — Pre-flight note in ScheduleTimeline today card

**Status:** Ratified
**Date:** 2026-07-21
**Owner:** Engineering
**Reviewer:** Steward
**Related:** D-0051 (todayMower cascade fix), D-0054 (mower idle), D-0055 (FieldLog editorial voice)

---

## Context

The ScheduleTimeline today card (post-D-0051 + D-0054) is an
**operational artifact**: a static 88×88px mower illustration
plus a single ETA pill ("8:30 AM to 12:00 PM") plus a single
"Book this mow" CTA. The card is the visitor's last moment with
the schedule before deciding to book.

The page has been accumulating **operator voice** in the editorial
sections (FieldLog, OperatorStrip, SecondScene), but the schedule
itself — the operational moment — was still pure machinery: yards,
ZIPs, ETAs. The schedule was the one place the operator's voice
was missing.

A pre-flight note — a small editorial row above the ETA pill —
adds the operator's voice to the schedule moment. It's the
"small talk" between the bio (above) and the CTA (below).

## Decision

Add a small editorial row at the top of the today-card body,
above the ETA pill:

```
┌──────────────────────────────────────────┐
│  ☀  Pre-flight · Tue 21                  │  ← eyebrow
│     Mower tuned last night, fresh fuel   │  ← note
│     in the tank. Should be a clean       │
│     cut all day.                         │
├──────────────────────────────────────────┤
│  ⏱  8:30 AM to 12:00 PM                  │  ← ETA pill
└──────────────────────────────────────────┘
```

### Component

```tsx
{!todayRow.closed && now && (
  <div className={styles.todayCardPreflight}>
    <span className={styles.todayCardPreflightIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" strokeLinecap="round" />
      </svg>
    </span>
    <div className={styles.todayCardPreflightText}>
      <span className={styles.todayCardPreflightEyebrow}>
        Pre-flight{' '}
        <span className={styles.todayCardPreflightDot} aria-hidden="true">·</span>{' '}
        {DAY_LONG[todayDayKey].slice(0, 3)} {now.getDate()}
      </span>
      <span className={styles.todayCardPreflightNote}>
        Mower tuned last night, fresh fuel in the tank. Should be a clean cut all day.
      </span>
    </div>
  </div>
)}
```

### Styling

- **Background:** sun-yellow at 10% opacity (`color-mix(in oklab,
  var(--ll-sun) 10%, transparent)`) — connects to the day-of-week
  sun tone in the eyebrow
- **Border:** sun-yellow at 25% opacity, 1px — the card "ribbon"
  reads as a hand-tagged notecard, not as a UI alert
- **Icon:** 18px sun (6 rays + center) in clay — same idiom as the
  day-card icons (DAY_ICON.mow) so it belongs visually. The icon
  is intentionally **different** from the hero scene 1 cartoon
  sun (D-0052, 12 rays + breathing animation) — the schedule is
  functional, the hero is editorial. A 6-ray outline icon at
  18px reads as a UI symbol; the hero's 12-ray filled sun at
  360px reads as a storybook element.
- **Eyebrow:** 10px Inter 700 uppercase, letter-spacing 0.16em,
  clay color. Same register as the day-card eyebrow.
- **Note:** 15px Fraunces italic 400, palm-bark at 78% opacity —
  the editorial voice that connects to FieldLog and SecondScene.

## Design rationale

**Why a pre-flight note (not a weather widget):** A real weather
widget would (a) require a third-party API, (b) be a moving
target that the visitor would have to verify, (c) be out of
scope for a "coming soon to a yard near you" landing page. A
*static editorial note* that the operator could have written
yesterday evening is more honest, more on-brand, and harder to
get wrong.

**Why "Mower tuned last night, fresh fuel in the tank":** Three
specific, falsifiable claims. "Mower tuned" (last night) — the
operator maintains the equipment. "Fresh fuel" (in the tank) —
the operator is prepared. "Should be a clean cut all day" — the
operator is confident. Each clause is concrete; the visitor
can mentally verify the third one against the ETA pill below
("8:30 AM to 12:00 PM" is in fact a clean 3.5h window).

**Why date is dynamic, content is static:** The eyebrow reads
"Pre-flight · Tue 21" (or whatever today's date is). The body
is the same line every day. The dynamic date makes the note
feel current; the static body makes it feel like a
*recurring ritual* — the operator tunes the mower every
evening, fills the tank, and prepares the next day's route.
That recurrence is the brand promise.

**Why a small sun icon, not a weather emoji:** The schedule
page is functional, not editorial. An emoji (☀️) would clash
with the editorial register of the rest of the schedule. A
small outline sun icon (6 rays, 18px) reads as a UI symbol
without being playful. It also matches the existing DAY_ICON
register from D-0046 (the day cards in the schedule grid).

## The runtime error (lessons learned)

The first implementation used `today?.getDate()` for the day
number. **This crashed the server render with `TypeError:
today.getDate is not a function`** because `today` is a `DayKey`
string ('Mon', 'Tue', etc.) computed via `todayKey(now)`, NOT
a `Date` object. The `?.` optional chaining was masking the
type confusion.

The fix:
- Use `now.getDate()` (the actual Date object) for the day number
- Add a `!now &&` guard on the wrapper `<div>` to handle the
  server-render-no-now case (defensive — currently the server
  render does pass `now`, but the guard means the section will
  skip cleanly if `now` is ever `null` in the future)

This is the same `today is DayKey, now is Date` type confusion
that nearly caught the schedule component in D-0046 — the lesson
is now encoded in the code comment for D-0058 (the next
schedule-side work) and in the `?` vs `!` decision matrix in
`tools/decision-matrices.ts`.

## Reduced motion

No animations are introduced by this section. The pre-flight
note renders statically. The only motion on the page is the
D-0054 mower idle vibration, which already has its own
`prefers-reduced-motion` rule.

## Verification

- TypeScript: `tsc --noEmit` passes
- Visual: `apps/web/audit/d-0056-preflight/today-card-zoom.png`
  shows the today card with the pre-flight note at the top of
  the body
- Schedule context: `schedule-timeline-with-preflight.png` shows
  the full schedule timeline with the pre-flight note in place
- Verify: `preflight-verify.png` shows the live render with
  the full text content
- Playwright assertion confirms the text content: "Pre-flight ·
  Tue 21" + "Mower tuned last night, fresh fuel in the tank.
  Should be a clean cut all day."

## Artifacts

- Commit: `613536e feat(schedule): D-0056 pre-flight note in today card`
- Files: `apps/web/src/components/sections/ScheduleTimeline.tsx` (+30 lines), `ScheduleTimeline.module.css` (+69 lines)
- Captures: `apps/web/audit/d-0056-preflight/*.png`
