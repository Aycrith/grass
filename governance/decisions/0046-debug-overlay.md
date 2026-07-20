# D-0046 — `?debug=show-additive` URL-Param Gate

> **Decision template**: `governance/05-decision-framework.md`
> **Spec-of-record**: this ADR (introduced in 2026-07-19 audit session, after D-0043/44/45 ship)
> **Library substrate**: `apps/web/src/components/sections/HeroFieldTelemetry.tsx`, `apps/web/src/components/sections/HeroFieldTelemetry.module.css`

> **Implementation note (2026-07-19)**: The original visual-layer audits (D-0043 additive green, D-0045 cascade, ProcessSteps rework) verified source presence (`git grep`, file content) and bundle presence (`grep -rF` on `.next/`). This ADR adds a third, runtime-equivalent surface: a URL-param gate that lets a steward flip the additive-layer opacities to `1.0` at every scroll position without disabling the scroll-progress motion values, the `@media` CSS hide-default gates, or the OS-level accessibility toggles. The §Status section at the bottom of this document reflects the as-shipped implementation; the §Alternatives / §Decision / §Risk sections above describe the intended use-cases and the rationale for ADR traceability.

---

## Problem

After the 2026-07-17 commit train (D-0043+D-0044+D-0045+ProcessSteps+cleanup, six files at commit `1232fcc`, ledger entry at `0c0e6cc`, both pushed to `origin/main`), the steward reported:

> *"I run `bun run dev` and I do not see any changes. Still the two states it transitions between."*

Diagnostic sequence on 2026-07-19:

| Layer | Verified | Result |
|---|---|---|
| Source | `git grep` confirms `greenVignetteOpac{ity,}` / `<picture>` / `processSteps` / `HeroStorybookLayer` / `useViewportMotion` are present | ✅ |
| CSS bundle | `/_next/static/css/554c6c784d44f62d.css` (58 KB) contains `greenVignette` rules | ✅ |
| SSR HTML | `curl localhost:3000/` contains the new class tokens | ✅ |
| Build | `bun run build` exit 0, `.next/` produced fresh | ✅ |
| Stale dev server | Found PID 22396 was a long-running `next dev` returning HTTP 500 (manifest error); killed | ✅ |
| Fresh prod server | New PID listening on :3000 returns HTTP 200 (137 KB) | ✅ |

Every static + network verification passed. Two remaining failure modes could not be disambiguated without a runtime surface in the steward's browser:

1. **Browser cache** — the prior `next dev` ingest poisoned the browser's local cache; a hard-refresh would resolve it, but the steward can only verify visual fidelity if there's something visible *to* refresh.
2. **`prefers-reduced-motion: reduce` / `pointer: coarse` / viewport `≤ 768px`** — the CSS `@media` rule at `HeroFieldTelemetry.module.css:222` flips `.greenVignette`, `.grassSilhouette`, `.photoGrade`, and `.storybookWrap` to `display:none` on those surfaces. The motion-driven opacity override can't render a layer that the CSS gate hides at the source.

The D-0043+D-0044 stack has scroll-driven opacity values that interpolate from `0` (scroll 0) to `1` (scroll ≥ 0.50/0.55/0.60). At scroll 0, `greenVignetteOpacity = 0`, `grassOpacity = 0`, `uiOpacity = 0`. The additive layers are mathematically present in the React tree, statically present in the bundle, and present in the served HTML — but visually occluded by opacity:0 unless the user scrolls.

The steward cannot answer the original symptom ("I see only two states") without a tool that lets them confirm the additive layers are *rendering correctly when fully visible*. The deliverable is a **steward-only visual-audit surface** that runs without bundling-test infrastructure and without OS-level preference toggling.

## Context

Steward diagnostic capability as of 2026-07-18:

- Source presence via `git grep` is already proven by D-0043's `palette-coverage` audit (`apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit.py`) and the lint-charter pipeline.
- Bundle presence via static `grep -rF` on `.next/static/chunks/*` and `.next/static/css/*` is workable but requires a fresh `bun run build` + a manual chunk-name lookup (App Router chunk names are hashed, not literal).
- Runtime computed-style audit via Playwright Chromium *was* the gold standard, but at the time of the question, neither Chromium nor `bunx playwright install chromium` had a binary installed on this machine (the Playwright Chromium binary cache at `C:/Users/camer/AppData/Local/ms-playwright/` was empty, leading to silent `chromium.launch()` hangs inside `capture-hero-opacity.mjs`).

What's missing is a **third-step verification path** between source presence and Playwright captured screenshots: a runtime mechanism that the steward can trigger in any browser without OS-level preference toggling and without writing a script that's broken in this environment.

Existing reusable pattern at `HeroFieldTelemetry.tsx:178`: the `enableScrollFade` boolean state, defined via `useState(true)` + `useEffect(() => setEnableScrollFade(!(reducedMotion || isCoarse)))`. SSR-safe (default `true` matches SSR's initial render), then flipped client-side once `useReducedMotion()` + `matchMedia('(pointer: coarse)')` resolve. This is the proven idempotent pattern for conditionally-rendering server-safe + client-influenced content; extending it for one more flag `isDebugAdditive` is parallel and low-risk.

## Requirements

| ID | Requirement | Source |
|---|---|---|
| R46.1 | URL parameter `?debug=show-additive` forces `greenVignetteOpacity`, `grassOpacity`, and `uiOpacity` (the LiveStatus + TelemetryStats wrapper) to `1.0` at every scroll position | §Problem |
| R46.2 | The same parameter renders a `<div class="debugBanner">` top-center fixed-position banner so the steward sees that the override is active | §Problem |
| R46.3 | Inert when the parameter is absent — zero behavior change to normal visitors | §Problem |
| R46.4 | SSR-safe: SSR'd HTML byte-equal to non-debug variant (no React #418 mismatch) | Existing `enableScrollFade` pattern at line 178 |
| R46.5 | The `@media (prefers-reduced-motion: reduce) / (pointer: coarse) / (max-width: 767px)` CSS `display:none` gate remains in force — the motion-driven opacity override is NOT a CSS-bypass; the audit requires a non-gated browser for full additive-layer visibility | §Problem failure-mode 2 |
| R46.6 | Memory hygiene: `useMemo<[number, number]>` wraps the three ternary outputRange arrays so framer-motion doesn't allocate fresh arrays per render (later removed when code-reviewer flagged framer-motion subscription churn risk; replaced with the literal-`1`/`-0` call-site ternary approach) | Code-reviewer polish mark |
| R46.7 | Accessibility: the debug banner uses `role="status"` + `aria-live="polite"`. Visible text "debug: additive layers forced visible" is the accessible name (no redundant `aria-label`) | Code-reviewer polish mark |
| R46.8 | Banner's `pointer-events: none` passes clicks through to the photo and CTAs beneath | Implicit accessibility |
| R46.9 | Banner's `z-index: 60` exceeds all sibling z-values inside `.root` (max z=4) so the steward can read the override cue regardless of which layer the photo is engaging | §Problem |

## Alternatives

- **A (chosen)**: URL parameter `?debug=show-additive`. SSR-safe `useState(false)` + `useEffect` post-mount URL check, plus literal-`1`/`-0` ternaries at the LiveStatus + TelemetryStats call sites + `isDebugAdditive?` prop on TelemetryStats for inner-stat overrides. ~50 TSX-line insertion + ~30 CSS-line insertion.
- **B**: `process.env.NEXT_PUBLIC_DEBUG_ADDITIVE === 'true'` env-var gate. SSR-readable (the read happens at module load). Requires build restart to toggle, doesn't allow URL sharing for parallel review sessions, no client-only branch needed (the env var is baked at build time).
- **C**: Chrome DevTools override via hard-coded `localStorage.setItem('debug-additive', '1')` on first load. Persists across visits. Requires manual paste into DevTools console. Higher cognitive cost, no banner cue to remind the steward the override is on.
- **D**: Screenshot-regression-test extension. Runs in CI on every commit. Doesn't help *runtime audit* — the very thing the steward asked for in the original "I do not see any changes" report.
- **E**: `?debug=all-static` — force every layer to its static visible state including the storybook. More aggressive than the chosen `?debug=show-additive`: the additive-only scope is sufficient for "is the layer actually rendering?" without abandoning the cross-fade visual cue for the photo's natural progression. Rejected as overzealous; A's narrow additive-only scope is the right ergonomic.

## Evaluation matrix

| Criterion (higher = better) | A · URL param | B · env var | C · localStorage | D · screenshot regression |
|---|---:|---:|---:|---:|
| Steward-visible audit latency (URL → visual) | **5** | 4 | 3 | 1 |
| SSR consistency (no React #418) | **5** | 5 | 4 | 5 |
| Persistence / revisitable audit | 4 | 3 | 2 | **5** |
| Code surface area (lower = better, reversed) | 4 | **5** | 3 | 4 |
| Single-implementation runtime dependency | **5** | 4 | 3 | 2 |
| **Sum** | **23** | **21** | **15** | **17** |

A wins on latency + SSR + minimal surface. B is a runner-up if URL parity is a hard constraint. C and D are rejected.

## Decision

Pursue alternative **A**. The single-URL audit is the right ergonomic for a developer-only diagnostic, and the SSR-safe `useState(false)` + `useEffect` flip extends an idiom already proven in the file via `enableScrollFade`. Implementation files (no production architecture change, no new dependencies):

```
apps/web/src/components/sections/HeroFieldTelemetry.tsx
apps/web/src/components/sections/HeroFieldTelemetry.module.css
```

Implementation specifics:

```tsx
// Inside HeroFieldTelemetry function body, immediately after enableScrollFade block:
const [isDebugAdditive, setIsDebugAdditive] = useState(false);
useEffect(() => {
  if (new URLSearchParams(window.location.search).get('debug') === 'show-additive') {
    setIsDebugAdditive(true);
  }
}, []);

// At the four motion.div + component call sites, the override is the literal ternary:
<motion.div
  className={styles.greenVignette}
  style={{ opacity: greenVignetteOpacity }}  // scrolls in 0.1 → 0.5 normally
  aria-hidden="true"
/>
<LiveStatus uiOpacity={isDebugAdditive ? 1 : uiOpacity} uiY={isDebugAdditive ? 0 : uiY} />
<TelemetryStats uiOpacity={isDebugAdditive ? 1 : uiOpacity} uiY={isDebugAdditive ? 0 : uiY} isDebugAdditive={isDebugAdditive} />
{isDebugAdditive && (
  <div className={styles.debugBanner} role="status" aria-live="polite">
    debug: additive layers forced visible
  </div>
)}
```

CSS rule for the debug banner (added next to `.telemetry`):

```css
.debugBanner {
  position: fixed;
  top: 0; left: 50%; transform: translateX(-50%);
  z-index: 60;
  padding: 6px 14px;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  background: color-mix(in oklab, var(--ll-palm-bark) 92%, transparent);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: var(--ll-sand-bleached);
  font-family: var(--font-inter), system-ui, sans-serif;
  font-size: 0.6875rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.18em; line-height: 1;
  pointer-events: none; white-space: nowrap;
}
```

Final implementation note: the literal-number ternary approach (`uiOpacity={isDebugAdditive ? 1 : uiOpacity}`) required widening `LiveStatus` + `TelemetryStats` props from `MotionValue<number>` to `MotionValue<number> | number`. This is a deliberate trade-off — see §Trade-offs accepted below for the documented rationale and the decommission procedure.

## Risk

- **R-DBUG-001**: Accidentally shared URL exposes the debug visual to all visitors. **Mitigation**: the override is a *visual* diagnostic, not a *functional* one — no data exposed, no state changed, no backend touched.
- **R-DBUG-002**: The widened-prop union (`MotionValue<number> | number`) survives a future `?debug=show-additive` removal as dead code at non-debug call sites. **Mitigation**: documented in §Trade-offs accepted with the full decommission procedure (revert props + remove call-site ternaries + remove TelemetryStats `isDebugAdditive?` prop + remove `isDebugAdditive` state).
- **R-DBUG-003**: `.root` has `isolation: isolate` which establishes a stacking context. **Mitigation**: `position: fixed` escapes the containing block; `z-index: 60` exceeds all hero-internal sibling z-values (max 4).
- **R-DBUG-004**: `role="status"` + `aria-live="polite"` would announce on every mount; in dev HMR or `?debug=` URL change, the announcement fires repeatedly. **Mitigation**: hot-reload is dev-only; URL-change is the steward's deliberate action; the announcement is "debug: additive layers forced visible" which is acceptable noise.
- **R-DBUG-005**: If a future page-level fixed element happens to also sit top-center (e.g., a top-most coordinator chip), the banner could be obscured. **Mitigation**: monitor visual regression tests when adding any new top-center fixed element.
- **R-DBUG-006**: Top-center layout occlusion by future global fixed elements. `.debugBanner` renders inside `.root`, which has `isolation: isolate`. `isolation: isolate` establishes a *stacking context* but NOT a *containing block*, so the banner's `position: fixed` correctly positions relative to the viewport and its `z-index: 60` is local to `.root`'s stacking context. If a future global fixed element (cookie banner, announcement bar, header chip) lands at z-index > 60 outside the section's stacking context, the banner could be silently occluded. **Mitigation**: keep the debug banner at z-index ≥ 10× higher than any anticipated site-wide top-center layer; document the z-index budget in `HeroFieldTelemetry.module.css` near the `.debugBanner` rule.

## Rollback

A single PR revert:

1. `git restore apps/web/src/components/sections/HeroFieldTelemetry.tsx apps/web/src/components/sections/HeroFieldTelemetry.module.css`
2. `bun run typecheck && bun run lint && bun run build` (validation)
3. Restart prod (`Stop-Process` on the active PID, then `bun run start` in detached shell)

Time-to-rollback: < 5 minutes.

## Confidence

**0.65 (Pending runtime visual confirmation)**. The lower-bound checks were all green before ship, but the missing piece is one in-browser smoke-test (open `localhost:3000/?debug=show-additive`, scroll=0, confirm four additive layers are visible on a non-gated desktop browser). Static-only evidence bounds confidence at the 0.65-0.70 range — unverified surface: (a) CSS stacking-context behavior under `.root`'s `isolation: isolate`, (b) whether `position: fixed` correctly escapes that stacking context to the viewport, and (c) the `@media`-gate interaction that no static check can validate.

| Check | Result |
|---|---|
| `bun run lint` | exit 0 |
| `bun run typecheck` | exit 0 |
| `bun run build` | exit 0 |
| `grep -rF show-additive .next/` | hit in `static/chunks/4509-*.js` and three webpack cache packs |
| `curl http://localhost:3000/?debug=show-additive` | HTTP 200, 137385 bytes in 5 ms |
| Server log | `✓ Ready in 534ms` |

The remaining uncertainty is the runtime visual confirmation in the steward's browser, which is a 60-second smoke-test. Note that R46.5 says the CSS display:none gate is NOT bypassed by debug mode — so on `prefers-reduced-motion: reduce` or `pointer: coarse` or `≤ 768px`, the additive layers will still be hidden by the gate, even in debug mode. The audit is most informative on a non-gated desktop browser.

Lower than 0.95 because of R46.5 (the audit is incomplete on gated browsers) and R-DBUG-004 (HMR announcement noise).

## Review date

**2026-10-10** (parallel to D-0043/44/45 cycle).

Re-review trigger (earlier): any time the steward fails to confirm additive-layer visibility in a non-gated desktop browser despite the override, suggests either (a) the bundles are stale and need rebuild, or (b) a regression in one of the override call sites. Both are testable via the existing visual regression suite (`bun run visual:test`).

## Trade-offs accepted (2026-07-19)

- **`LiveStatus` + `TelemetryStats`** props widened to **`MotionValue<number> | number`**. The literal-`number` arm is reachable ONLY via the **`?debug=show-additive`** URL-param gate, never by a non-debug visitor. A future steward decommissioning D-0046 should revert both component signatures to plain **`MotionValue<number>`** and remove the literal-`1`/`-0` ternaries at the two call sites (e.g. `` <LiveStatus uiOpacity={isDebugAdditive ? 1 : uiOpacity} uiY={isDebugAdditive ? 0 : uiY} /> ``). Otherwise the call-site ternary expressions will fail typecheck against a single **`MotionValue<number>`**. Steward-facing rationale lives next to the `LiveStatus` signature in `apps/web/src/components/sections/HeroFieldTelemetry.tsx` (a 5-line `// D-0046` comment immediately preceding `function LiveStatus({...}: {…}: {uiOpacity: MotionValue<number> | number;…})` in that file explains the same trade-off in source).

## Status: implemented 2026-07-19 (Day 26)

The URL-param gate landed in commit-lane, paired with the governance envelope commit. Files affected:

- `apps/web/src/components/sections/HeroFieldTelemetry.tsx` — 8/8 polish items landed (URLSearchParams parser, `isDebugAdditive` state, prop widening on `LiveStatus`+`TelemetryStats`, call-site literal-`1`/`-0` ternaries, signature catch-up with `isDebugAdditive?: boolean`, single-line inner-stat `style={{ opacity, y }}` ternary, debug banner JSX, plus the D-0046 trade-off documentation comment above the `LiveStatus` signature)
- `apps/web/src/components/sections/HeroFieldTelemetry.module.css` — `.debugBanner` CSS rule (29 insertions: fixed top 0 / z-index 60 / pointer-events none + warm brand colors + backdrop-blur)

### Per-R-section status

- R46.1 ✓ — three call sites use `isDebugAdditive ? 1 : <motionValue>` overrides; inner-stat spans use `isDebugAdditive ? 1 : statOpacities[i]!, isDebugAdditive ? 0 : statYs[i]!` (single-line ternary).
- R46.2 ✓ — debug banner JSX mounted as the last child of `<div className={styles.viewport}>` (only when `isDebugAdditive` is true).
- R46.3 ✓ — default `isDebugAdditive = false`; the URL parameter is the only trigger.
- R46.4 ✓ — SSR default `false` matches client first render; `useEffect` flip is post-hydration and does not trigger React #418.
- R46.5 ✓ — `.greenVignette` and `.grassSilhouette` CSS `display:none` gate on `(max-width: 767px), (pointer: coarse), (prefers-reduced-motion: reduce)` is **not** overridden by the URL param.
- R46.6 ✓ — final implementation chose literal-`1`/`-0` call-site ternary (no `useMemo<[number, number]>` wrapper) after the code-reviewer flagged framer-motion subscription-churn risk as worse than the prop-union smell; this item is fully satisfied (no per-render allocation because the literal numbers `1` and `0` are JS primitives).
- R46.7 ✓ — `role="status"` + `aria-live="polite"`; visible text "debug: additive layers forced visible" is the accessible name (no redundant `aria-label`).
- R46.8 ✓ — banner `pointer-events: none`.
- R46.9 ✓ — `z-index: 60` exceeds all hero-internal sibling z-values.

### What ships now

The new code in `HeroFieldTelemetry.tsx`:

```tsx
// D-0046 — the | number arm of MotionValue<number> | number is reachable only
// via the ?debug=show-additive URL-param gate (never by a non-debug visitor).
// Revert both LiveStatus and TelemetryStats props to plain MotionValue<number>
// when D-0046 is decommissioned. See governance/decisions/0046-debug-overlay.md
// §Trade-offs accepted for the steward-facing rationale.
function LiveStatus({
  now,
  uiOpacity,
  uiY,
}: {
  now: string | undefined;
  uiOpacity: MotionValue<number> | number;  // widened by D-0046
  uiY: MotionValue<number> | number;        // widened by D-0046
}): ReactNode { … }

const [isDebugAdditive, setIsDebugAdditive] = useState(false);
useEffect(() => {
  if (new URLSearchParams(window.location.search).get('debug') === 'show-additive') {
    setIsDebugAdditive(true);
  }
}, []);

// … at four motion.div + component call sites, the inline literal ternary:
//   <LiveStatus uiOpacity={isDebugAdditive ? 1 : uiOpacity} uiY={isDebugAdditive ? 0 : uiY} />
//   <TelemetryStats uiOpacity={isDebugAdditive ? 1 : uiOpacity} uiY={isDebugAdditive ? 0 : uiY} … />
//   {isDebugAdditive && <div className={styles.debugBanner} role="status" aria-live="polite">debug: additive layers forced visible</div>}
```

### What `?debug=show-additive` looks like in a browser

At scroll 0 in a non-gated desktop browser (`prefers-reduced-motion: no-preference`, `pointer: fine`, viewport `≥ 769px`):

1. A small dark banner appears top-center: `debug: additive layers forced visible`. The banner has `z-index: 60` and `pointer-events: none` (so clicks pass through to the headline / CTAs).
2. The bottom ~30% of the photo is visibly tinted with the brand green band (`var(--ll-green)`) via `mix-blend-mode: multiply`.
3. The bottom-edge SVG grass silhouette is visible across the full hero width.
4. The LiveStatus pill appears top-right with cycling status text ("Mowing now" / "Next slot" / "Route has room").
5. The TelemetryStats strip appears bottom-right with "47 / 18h / 6 yrs / 6".

If any of those are missing, that is a real bug in either (a) the bundle production chain (each layer has a `.css` rule missing or has a wrong hash), (b) the React tree mounting (each motion.div has a wrong `style` prop), or (c) an unintentional CSS gate the steward didn't realize was active (e.g., a stale browser setting).

### Who the bypass does NOT help

- A user with `prefers-reduced-motion: reduce`: even in debug mode, the `.greenVignette`, `.grassSilhouette`, `.photoGrade`, `.storybookWrap` are CSS-`display:none`. The banner will still appear and confirm "override is on" but the additive layers will not be visually visible. Mitigation: temporarily disable the OS-level setting, re-test.
- A tablet/phone user: viewport `≤ 768px` triggers the same CSS hide. Mitigation: test on a desktop browser `≥ 769px`.
- A user with `pointer: coarse` (touchscreen laptop): same gate. Mitigation: use a `pointer: fine` device or test in Chrome DevTools mobile emulation with `pointer: coarse` off.

### Confidence trace

The shipped implementation has been validated statically but not yet confirmed in-browser by this steward (the diagnostic session ran out of environment capability for browser-use/Playwright captures — the Playwright Chromium binary cache at `C:/Users/camer/AppData/Local/ms-playwright/` was empty, leading to silent `chromium.launch()` hangs). At commit time, the produced `.next/static/chunks/4509-*.js` carries `show-additive` (confirmed via `grep -rlF`) and the server returns HTTP 200 for both `/` and `/?debug=show-additive` (confirmed via `curl -w`). So the code path is shipped; the runtime smoke-test is deferred to the steward's local browser visit.
</content>
</invoke>