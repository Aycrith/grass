# Visual Surface Evidence — D-0046 Debug-Overlay Gate (Hero Rebuild)

> **Date:** 2026-07-19 (Day 26)
> **Feature audited:** D-0046 `?debug=show-additive` URL-param gate (production hero visual audit surface)
> **URL audited:** `http://localhost:3000/?debug=show-additive` (also reachable: `http://localhost:3000/` for baseline)
> **Method:** Live HTTP server checks + bundle-token verification + on-disk asset size audit
> **Status:** Production server live, all checks green **at the runtime layer**. Visual confirmation is best done by the steward in their own browser at the audit URL above.
> **ADR:** `governance/decisions/0046-debug-overlay.md`
> **Companion ADRs:** `governance/decisions/0043-palette-rebuild.md`, `0044-viewport-motion-architecture.md`, `0045-structural-cascade.md`

---

## 1. Executive summary

The Day 26 landing-page rebuild (D-0043 palette + D-0044 motion + D-0045 cascade + ProcessSteps rework) is **fully shipped, merged, lint-clean, typecheck-clean, build-green, and live on `localhost:3000`**. To give the steward a precise way to verify every additive layer is rendering before authorizing the `LargoLawn.pro` domain purchase (OBJ-M2-004, $4.99/yr), a debug gate (`?debug=show-additive`) was added that:

1. Forces the four additive overlay opacities to `1.0` at every scroll position (so they are visible even mid-cross-fade).
2. Mounts a top-center banner reading `debug: additive layers forced visible` (non-interactive, `pointer-events: none`).
3. Forces `LiveStatus` and `TelemetryStats` motion values to their resting state (`opacity: 1, y: 0`) so the dashboard widgets are visible without scroll-driven rise.

Per D-0046 governing principle: the steward can load ONE URL and visually confirm that **all four D-0043 additive layers + the D-0044 motion-mounted `HeroStorybookLayer` + the D-0046 dashboard widgets** are rendering correctly, WITHOUT toggling OS-level reduced-motion / coarse-pointer / viewport-size switches.

---

## 2. Live runtime verification (this turn)

| Check | Method | Result |
|---|---|---|
| Server alive on :3000 | `netstat -ano` (LISTENING filter) | **PID 19664** listening on `0.0.0.0:3000` |
| Next.js ready | `tail` `.server.log` | **Next.js 15.5.20** — `Ready in 579ms` |
| `GET /` | `Invoke-WebRequest -UseBasicParsing` | **200 OK** |
| `GET /?debug=show-additive` | same | **200 OK** |
| `GET /hero/v2/desktop.webp` | HEAD | **200 OK** |
| Debug tokens in served chunk | `grep` built JS chunks | One chunk contains `show-additive`, `debugBanner`, `isDebugAdditive`, `URLSearchParams` (current build resolves to `4509-31f60e6d3cba6281.js` — content-hash changes on every `bun run build`; always re-grep from the actual build) |
| Working tree clean | `git status` + `ls-files --others --exclude-standard` | Tracked ✓; only `apps/web/.server.err` regenerable noise (gitignored) |

### Cascade asset on-disk sizes (D-0045 verification)

| File | Bytes | Lighthouse-relevant cap |
|---|---:|---|
| `apps/web/public/hero/v2/desktop.avif` | 162,376 | under 250 KB ✓ |
| `apps/web/public/hero/v2/desktop.webp` | 227,040 | under 250 KB ✓ |
| `apps/web/public/hero/v2/mobile.avif` | 99,926 | under 250 KB ✓ |
| `apps/web/public/hero/v2/mobile.webp` | 137,708 | under 250 KB ✓ |
| `apps/web/public/hero/v2/hero-green-grass.jpg` | 4,059,828 | JPG fallback only (for browsers without AVIF or WebP support; modern browsers never request this file) |

---

## 3. What the steward should see at the audit URL

Open `http://localhost:3000/?debug=show-additive` in Chrome. Expected surface, top to bottom:

### 3.1 Top-center debug banner (NEW, FIXED)

A small dark band at **top: 0, centered, z-60, pointer-events: none**, reading approximately:
> `debug: additive layers forced visible`

It must NOT block clicks on the headline or CTAs beneath it (the band has `pointer-events: none`).

### 3.2 The four additive layers (D-0043) — all visible at scroll 0

| # | Layer | What it looks like | Component / DOM order (lowest to highest) |
|---|---|---|---|
| 1 | **Background photo** | The real 4K Florida lawn photograph (`hero-green-grass.jpg`), warm sunset grade may tint it depending on scroll position | `BackgroundPhoto` (inside `.photo`) — first child of `.viewport` |
| 2 | **Green vignette (NEW, D-0043)** | A faint green wash (#1f4e2c at ~20% opacity) across the bottom ~30% of the photo, fading up toward the middle | `GreenVignette` overlay div — sibling after `.photo` |
| 3 | **SVG grass silhouette (NEW, D-0043)** | A green grass-blade silhouette path (`#1f4e2c` → `#88a774` linear gradient) anchored along the bottom edge of the hero, full width | `GrassSilhouette` SVG — sibling after `.vignette` |
| 4 | **HeroStorybookLayer (D-0044 motion substrate)** | Hand-authored animated SVG landscape — sky gradient, drifting clouds (CSS keyframes), swaying palms, midground grass tufts, foreground wildflowers. Forced visible at all scroll positions under the debug gate. | `.storybookWrap` div around `HeroStorybookLayer` |
| 5 | **Hero text content (eyebrow + kinetic headline + subhead + CTAs)** | "Local, solo-operator lawn care in Largo and the five adjacent Pinellas ZIPs." + "Get a free quote" CTA. Unchanged from D-0042. | `.copy` block inside `.viewport` |
| 6 | **D-0046 dashboard widgets** (rendered with `opacity: 1, y: 0` under the gate) — `LiveStatus` + `FieldStamp` + `TelemetryStats` | Field-passport dashboard overlay: LIVE pill, "EST · 2026 · LARGO · FL" stamp, and the 4-stat telemetry strip (`6+ yrs` · `47 yards` · `33771` · `6 ZIPs`). All visible at scroll 0 under the gate. | `.liveStatus`, `.fieldStamp`, `.telemetry` siblings inside `.viewport` |

**Steward checklist (per additive layer):**
- [ ] **Green vignette visible across bottom of frame** — should tint the sand-colored foreground regions of the photo green, NOT replace the photo itself.
- [ ] **SVG grass silhouette visible along bottom edge** — sharp dark-green blades, NOT a gradient haze.
- [ ] **`LiveStatus` pill visible top-left of dashboard overlay** — "LIVE" + flavor line + timestamp.
- [ ] **`TelemetryStats` strip visible** — 4 stats in a row above the bottom-left CTA area (`6+ yrs · 47 yards · 33771 · 6 ZIPs`).

**Scroll-test the gate (5-second check):** with the debug URL loaded, scroll from top to about 50% of the hero height. The `HeroStorybookLayer` must remain fully visible at opacity 1.0 AND `LiveStatus` + `TelemetryStats` must NOT shift up or fade — both are forced to their resting state by the `isDebugAdditive` ternary, which exists BECAUSE the non-debug scroll fade would normally hide them at <40% scroll. Scroll back to top and confirm the same. If any layer shifts opacity between scroll positions, the gate is broken.

### 3.3 Mobile / coarse-pointer / reduced-motion

The D-0043 vignette + grass silhouette are gated by `prefers-reduced-motion` + `pointer: coarse` + `≤768px` viewport. Under the debug gate, the `isDebugAdditive` URL-param flag **does NOT override that gate** — the four additive layers still hide on mobile because they would burn CPU on phones and conflict with the storybook fade. This is documented as a deliberate D-0046 trade-off in `governance/decisions/0046-debug-overlay.md §Trade-offs accepted` — the debug gate is for desktop visual confirmation; mobile verification happens through the existing `coarse-pointer` Playwright test (`home-coarse-pointer-chromium-{desktop,mobile}.png`).

---

## 4. Reproducible verification commands

From `C:\Users\camer\DEVNEW\GRASS\`:

```bash
# 1) Re-launch prod server (if not running): detached, uses .gitignore'd log files
cd apps/web && bun run build && cd ..
powershell -NoProfile -Command "Start-Process -FilePath 'C:\Users\camer\.bun\bin\bun.exe' -ArgumentList @('run','start') -WorkingDirectory 'C:\Users\camer\DEVNEW\GRASS\apps\web' -RedirectStandardOutput 'C:\Users\camer\DEVNEW\GRASS\apps\web\.server.log' -RedirectStandardError 'C:\Users\camer\DEVNEW\GRASS\apps\web\.server.err' -WindowStyle Hidden"

# 2) Wait for :3000 listener
netstat -ano | findstr ':3000' | findstr LISTENING

# 3) Confirm both URLs serve 200 (Windows — use INVOKE-WEBREQUEST, NOT curl -o /dev/null)
powershell -NoProfile -Command "(Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000/' -TimeoutSec 10).StatusCode"
powershell -NoProfile -Command "(Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000/?debug=show-additive' -TimeoutSec 10).StatusCode"

# 4) Confirm debug tokens in served bundle (CHUNK FILENAME CHANGES PER BUILD — re-grep after any rebuild)
grep -l "show-additive" apps/web/.next/static/chunks/*.js | head -3
grep -oE "show-additive|debugBanner|isDebugAdditive|URLSearchParams" \
    apps/web/.next/static/chunks/*.js | sort -u

# 5) Confirm cascade assets reachable + under byte caps
powershell -NoProfile -Command "(Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000/hero/v2/desktop.webp' -TimeoutSec 10 -Method HEAD).StatusCode"
ls -la apps/web/public/hero/v2/

# 6) Charter compliance + lint + typecheck (full trust signal)
# Note: test:charter lives in the ROOT package.json (not apps/web/), per CLAUDE.md
cd apps/web && bun run lint && bun run typecheck && cd ..
bun run test:charter
```

---

## 5. Risks + caveats acknowledged

| ID | Risk | Mitigation |
|---|---|---|
| **R-DBUG-006** | Top-center fixed-position banner may occlude content under `.root`'s `isolation: isolate` z-stack in some browsers | `pointer-events: none` on the banner so it cannot block clicks; visual ops only |
| **R-DBUG-005** | `URLSearchParams` parser runs inside `useEffect` with empty deps — runs once on mount, reads URL at that moment only | Documented in ADR; closing/refreshing the page re-runs the effect |
| **R-DBUG-004** | Prop-union widening (`MotionValue<number> \| number`) on `LiveStatus`/`TelemetryStats` survives decommission | ADR §Trade-offs accepted documents the revert procedure (remove the `| number` arm + the call-site ternaries) |
| **R-DBUG-002** | `?debug=show-additive` is a query param — shareable, bookmarkable, but works at runtime only (no SSR flip) | SSR always renders the layered resting state; the gate is purely client-side enhancement |
| **R-DBUG-001** | Conf 0.65 (Pending runtime visual confirmation) — this audit doc is part of closing the loop | Once the steward confirms the four-layer checklist at §3.2, this can be flipped to 0.90+ |

---

## 6. Files inspected (read back from working tree end of Day 26)

- `apps/web/src/components/sections/HeroFieldTelemetry.tsx` (30,243 bytes, 8/8 polish items)
- `apps/web/src/components/sections/HeroFieldTelemetry.module.css`
- `apps/web/src/components/motion/useViewportMotion.tsx` (new in D-0044)
- `apps/web/src/components/motion/index.ts`
- `apps/web/public/hero/v2/{desktop,mobile}.{avif,webp}` + `hero-green-grass.jpg`
- `governance/decisions/0046-debug-overlay.md` (Trade-offs section documented)
- `governance/decisions/0043-palette-rebuild.md`, `0044-viewport-motion-architecture.md`, `0045-structural-cascade.md`

---

## 7. Validation checklist for steward sign-off

- [ ] Server running on `http://localhost:3000` (PID + Ready log captured in §2)
- [ ] `/` returns 200 with the live hero (scroll-driven cross-fade visible)
- [ ] `/?debug=show-additive` returns 200 with the four additive layers + banner visible at every scroll position
- [ ] Each of the four D-0043/44/46 layers in §3.2 is visually present and matches description
- [ ] No console errors on either URL (use DevTools → Console)
- [ ] Mobile (≤768px) hides the four additive layers but still shows the rest of the hero correctly (CSS gate working)
- [ ] Lighthouse CI guard (`.github/workflows/ci.yml`) — last green run captured per state/ledger.yaml changelog

---

## 8. Decision recommendation

If §3.2 checklist confirms the four layers render correctly:

1. **Authorize the `LargoLawn.pro` domain purchase** (OBJ-M2-004, $4.99/yr) — the visual surface is shippable.
2. Flip D-0046 §Confidence from `0.65 (Pending runtime visual confirmation)` to `0.90+` in `governance/decisions/0046-debug-overlay.md`, append a row to `state/ledger.yaml` confirming the steward visual sign-off, and flip R-DBUG-001 to RESOLVED.
3. Decommission the `?debug` gate post-domain-purchase (per ADR §Trade-offs accepted procedure): remove the prop-union widening, remove the call-site `isDebugAdditive ? 1 : uiOpacity` ternaries, remove the `URLSearchParams` parser, remove the `.debugBanner` CSS + JSX, fix the inner-stat motion.span back to single `MotionValue<number>` style.

If §3.2 checklist flags any layer missing:

1. Do NOT purchase the domain yet.
2. Re-open the audit doc, append the specific failure to §7 with a screenshot, and file a follow-up decision (D-004X followup) to fix.

---

*Per Charter principle: every irreversible decision has rationale + alternatives + risks recorded. This audit doc is the steward-facing artifact that closes the D-0046 confidence loop.*
