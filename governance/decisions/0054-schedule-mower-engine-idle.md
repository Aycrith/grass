# D-0054 — Engine-running vibration on ScheduleTimeline today-card mower

**Status:** Ratified
**Date:** 2026-07-21
**Owner:** Engineering
**Reviewer:** Steward
**Related:** D-0051 (todayMower CSS cascade fix), D-0053 (ambient palms cycle)

---

## Context

The user requested more visible "video/animated content using the
various assets generated for this project." The
ScheduleTimeline today-card mower (D-0051: 88×88px after the
cascade fix) is a static WebP illustration — a stylized ride-on
mower with a green body, brown seat, two black wheels, and two
grass tufts.

The mower is the only visual ornament in the today-card footer.
It's the visitor's last visual moment before the "Book this mow"
CTA. A subtle "engine running" vibration would signal "this
mower is real and active" without being distracting.

## Decision

Add a 0.6s engine-idle vibration to the today-card mower
illustration via CSS keyframes:

```css
.todayCardFoot > .todayMower {
  /* ... existing rules ... */
  animation: todayMowerIdle 0.6s ease-in-out infinite;
  transform-origin: center bottom;
}

@keyframes todayMowerIdle {
  0%, 100% { transform: translateY(0)      rotate(0deg);   }
  25%      { transform: translateY(-0.4px) rotate(0deg);   }
  50%      { transform: translateY(0)      rotate(0.5deg); }
  75%      { transform: translateY(-0.3px) rotate(0deg);   }
}
```

## Design rationale

**Amplitude: ±0.4px translateY, 0.5° rotate.** The mower is a 88px
accent in a ~6-inch card footer, not a focal element. A larger
amplitude would read as the mower "having a seizure" instead of
"idling." 0.4px translation is just below the threshold of
"is the mower moving?" — registers as engine vibration without
distracting from the bio content.

**Period: 0.6s → 1.67 Hz.** Real small engines idle at
~600-1000 rpm → 10-16 Hz, way too fast to animate (the eye would
lock onto a strobing image). 1.67 Hz reads as "running" without
being distracting.

**Asymmetric keyframe phasing.** translateY peaks at 25% and 75%,
rotate peaks at 50%. The motion doesn't look like a pure sine
wave — the up-down and the tilt peak at different times, which
reads as the engine vibrating the body and the body rocking under
the engine's torque, not as a single rotating motion.

**Transform pivot: `center bottom`.** Resolves to `44px 88px` in
the 88×88 box (per Playwright inspect). The mower bobs from its
wheels, not its center — the up-down reads as the engine vibrating
the body, the rotate reads as a slight tilt under load. If the
pivot were `center center`, the rotation would look like the mower
spinning in place.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .todayCardFoot > .todayMower {
    animation: none;
  }
}
```

The vibration collapses to identity. The mower renders as a static
88×88 image, matching the pre-D-0054 state.

## Verification

Playwright inspect confirms the animation is applied:
- `animation: 0.6s ease-in-out infinite ScheduleTimeline_todayMowerIdle__66C8U`
- `transformOrigin: 44px 88px` (= `center bottom` in the 88×88 box)
- `width: 88, height: 88` (D-0051 fix preserved)

Visual proof: `apps/web/audit/d-0054-mower-idle/today-foot-zoom.png`
shows the mower at 88px in the today-card footer, next to the
"Book this mow" CTA. The 3 captures (`schedule-timeline-t0.png`
+ `t0.3s.png` + `t0.6s.png`) are spaced at 0.3s = half a cycle, so
the mower is at the opposite phase of its vibration arc in each
capture.

## Artifacts

- Commit: `58ff312 feat(schedule): D-0054 engine-running vibration on today-card mower`
- File: `apps/web/src/components/sections/ScheduleTimeline.module.css` (added keyframe + reduced-motion)
- Captures: `apps/web/audit/d-0054-mower-idle/*.png`
