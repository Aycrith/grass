# Hero Diagnostic Memo — "New content missing from hero"

> **Date:** 2026-07-19
> **Owner:** Steward + Claude Code
> **Source:** `apps/web/audit/d-hero-diagnostic/` (6 screenshots + 6 DOM JSONs + console log + errors log)
> **Companion plan:** `C:\Users\camer\.claude\plans\develop-a-comprehensive-plan-precious-gizmo.md`

## TL;DR

The user's complaint is **confirmed by evidence**: after scrolling past the hero, no new scenes or content appear. The hero is a single 200svh pinned section that does **one** cross-fade (storybook SVG → 4K photo) and then settles into a static resting state. The "additional scenes" the user expects do not exist anywhere in the code.

The agents did implement the D-0042 / D-0043 / D-0044 / D-0045 / D-0046 specs, but each spec was **descoped during implementation** from a more ambitious original proposal. The shipped hero is a *cross-fade*, not a *sequence of scenes*.

## What renders at each scroll position (1440×900, prefers-reduced-motion: no-preference)

| Scroll % | Storybook | Photo | Additive green layers | LiveStatus | Telemetry | FieldStamp |
|---|---|---|---|---|---|---|
| 0% | opacity 1, sharp | opacity 1 (under) | opacity 0 (hidden) | opacity 0 (hidden) | opacity 0 (hidden) | opacity 1 ✓ |
| 25% | opacity ~0.6, blurred 7px, 50% sat | opacity 1 ✓ | 0.85-0.97 (fading in) | opacity 0.45 | opacity 0.45 | opacity 1 ✓ |
| 50% | faded out | opacity 1 ✓ | opacity 1 ✓ | opacity 1 ✓ | opacity 1 ✓ | opacity 1 ✓ |
| 75% | hidden | opacity 1 ✓ | opacity 1 ✓ | opacity 1 ✓ | opacity 1 ✓ | opacity 1 ✓ |
| 100% | hidden | opacity 1 ✓ | opacity 1 ✓ | opacity 1 ✓ | opacity 1 ✓ | opacity 1 ✓ |

**No new content reveals between scroll 50% and 100%.** The resting state is the final state. This is the user's complaint in evidence form.

## Real bugs surfaced by this diagnostic

### 1. **React #418 hydration mismatch** (errors.log)

Two identical minified errors fire on every page load. React error #418 = "Hydration failed because the initial UI does not match what was rendered on the server." This was masked by the `enableScrollFade` state pattern (the steward noted this in WP85+) but is still surfacing.

**Suspected source:** the `isDebugAdditive` useState/useEffect pair combined with the `popstate` listener may be creating SSR/client divergence when `window.location.search` differs between server (empty) and client. Also: the headline word reveal uses `useState(true)` for `enableScrollFade` but the headline DOM has motion-controlled spans that may SSR with different styles than the client hydration.

**Severity:** medium — page still renders, but the React error boundary is being triggered twice per load, which breaks production perf claims and floods the Sentry error stream.

### 2. **"SCROLL TO MOW" prompt is stale** (visible at scroll 0%)

The `ScrollHint` component in `HeroStorybookLayer.tsx` reads "SCROLL TO MOW" and animates a progress dot, but the Mower SVG was removed in D-0014. The user sees an affordance for an object that doesn't exist.

### 3. **Headline wraps to 3 lines at scroll 0** (scroll-00pct.png)

"Your" / "neighbor's" / "lawn mower." instead of 2 lines. The HEADLINE_LINES constant in `HeroFieldTelemetry.tsx:99-102` groups these as 2 lines but the actual rendered width exceeds the content column on the 1440 viewport. WP84 already documented this at 320px; it persists at 1440px too.

## Content audit: orphaned vs consumed

| Content in `lib/content.ts` | Consumed by `HeroFieldTelemetry`? | Where it lives now |
|---|---|---|
| `hero.eyebrow` | ✅ Yes (via prop) | Rendered top-center |
| `hero.headline` | ✅ Yes (Wave 2A — wired via `parseHeadline()`) | Renders via WordReveal; `lib/content.ts:31` is now the single source of truth |
| `hero.subhead` | ✅ Yes (via prop) | Rendered under headline |
| `hero.primaryCta` | ✅ Yes (via prop) | Rendered as sun CTA |
| `hero.secondaryCta` | ✅ Yes (via prop) | Rendered as ghost CTA |
| `hero.composition.palmAriaLabel` | ❌ No | `lib/content.ts:46` — orphan from WP19/WP21 era, cleanup candidate |
| `hero.composition.mowerAriaLabel` | ❌ No | `lib/content.ts:47` — orphan, cleanup candidate |
| `hero.composition.grassAriaLabel` | ❌ No | `lib/content.ts:48` — orphan, cleanup candidate |
| `hero.composition.callout` ("33771 - Largo central") | ⚠ Pending — pill slot reserved for hero header | `lib/content.ts:49` — reserved for Wave 5 pill |
| `hero.composition.calloutHref` | ⚠ Pending | `lib/content.ts:50` — reserved for Wave 5 pill |

**Wave 2A reduced orphans from 6 to 5.** `hero.headline` is now the single source of truth, so `lib/content.ts` edits reach the page. `hero.composition.callout` is reserved for a Wave 5 "33771 - Largo central" callout pill (per Option A spec). The 3 aria-label orphans remain cleanup candidates for a future housekeeping commit (out of scope here since the parent component no longer renders a right-column composition).

## D-0044 motion layer audit

| D-0044 layer ID | Declared in `useViewportMotion.tsx` | Consumed in `HeroStorybookLayer.tsx` | Mapped to |
|---|---|---|---|
| `sky` | ✅ | ✅ line 121 | skyWrap |
| `egret` | ✅ | ✅ line 122 | farLayer |
| `mower` | ✅ | ✅ line 123 | midLayer (but mower SVG was removed D-0014!) |
| `fern` | ✅ | ❌ Never read | — |
| `songbirds` | ✅ | ❌ Never read | — |
| `gouache` | ✅ | ✅ line 124 | nearLayer |

**2 of 6 layers are declared but never consumed.** Additionally, the `mower` layer mapping goes to midLayer which is the SVG palms/houses — not to an actual mower, since the mower was removed in D-0014. The layer name is now misleading.

## Conclusion for the user

**Was new content collected/generated/implemented?** Partially:
- ✅ D-0043 additive overlays: implemented (CSS+SVG only, no asset re-roll)
- ✅ D-0044 useViewportMotion hook: partially implemented (4 of 6 layers wired)
- ✅ D-0045 `<picture>` cascade: implemented (AVIF/WebP/JPEG)
- ✅ D-0046 debug-additive gate: implemented (3 revisions, working)
- ❌ D-0008 7-composable asset pack: never shipped (descoped during D-0043 implementation)
- ❌ D-0042 WebGL grass field: never shipped (descoped during D-0043 implementation)

**Why isn't it displayed within the hero component sequencing?**
The hero is a single 200svh pinned section that does ONE cross-fade (storybook → photo) and stops. There is no second photo, no service-grid moment, no operator close-up scene, no further scene transition. The user expects a sequence of scenes; the code is a cross-fade into a resting state.

**Path forward (from approved plan):**
- **Wave 2 (Option A, 1-2h):** surface existing content — lower fade-in thresholds, wire orphaned `hero.headline` from content.ts, fix "SCROLL TO MOW" prompt, optionally wire `hero.composition.callout`
- **Wave 3 (Option C, 2-3h):** wire missing `fern` and `songbirds` layers + apply declared cadence values
- **Wave 4:** verify + commit + update visual baseline

These don't add new scenes. If the user wants the multi-scene experience (matching original D-0008/D-0042 ambition), escalate to **Option B** in the plan: add a second pinned scene after the photo, requiring ~4-6 hours of new content authoring + scroll math.
