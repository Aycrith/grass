D-0028 Coverage Check — DONE.

## Commit
- **Hash:** `63234ddb9712bbac532307e717abdd60a1d9a4cf` (short: `63234dd`)
- **Title:** `feat(visual): D-0028 — Coverage Check replaces dual-UI ServiceAreaMap`
- **Branch:** main (on top of e4d030c D-0027)
- **20 files changed**, 1347 insertions(+), 248 deletions(-)

## Files changed (mine)
- `apps/web/src/components/sections/ServiceAreaMap.tsx` — converted to 'use client', replaced 6-card rail with ZIP/neighborhood input + result panel. Module-load memoized resolver: 5-digit ZIP in area → hit, 5-digit ZIP out → miss, text matching a known neighborhood token → hit resolved to that ZIP (home-base 33771 wins on multi-match), text without a token → miss, empty/partial → invalid (inline helper). `<datalist>` seeded with 6 ZIPs + 6 neighborhood labels. Form uses `<form onSubmit>` (Enter submits); submit is a raw `<button type="submit">` because the shared `Button` hard-codes type="button". Native `<output>` element wraps the result panel — carries implicit role="status" + aria-live="polite" (the spec asked for that live region; `<output>` is the more semantic choice and silences a Biome a11y rule).
- `apps/web/src/components/sections/ServiceAreaMap.module.css` — new 3-col grid (1fr | 1.5fr | 1fr) on >=980px, 1-col stack on mobile. Form input/button in left column, map centered (4:3, max 55vh on mobile), result panel right. Dropped all D-0027 `.rail`, `.railBlock`, `.railLabel*`, `.railItem*`, `.railFootnote*` classes. New `.form`, `.result`, `.resultIdle`, `.resultCheck`, `.resultCheckMiss`, `.areasDetails`, `.areaChip*` classes. No `outline: none` anywhere — global `*:focus-visible` rule in typography.css applies automatically.
- `apps/web/src/lib/content.ts` — `serviceAreaMap.heading` → "Six Pinellas neighborhoods. One route.", `subhead` → "Type your ZIP or neighborhood name — we'll tell you on the spot whether you're on the route." Eyebrow unchanged.
- `apps/web/src/app/quote/QuoteCalculator.tsx` — added `useSearchParams()` + `inServiceArea` import; `useEffect` reads `?zip=` and prefills the ZIP select if it's a valid in-area ZIP. Lives in the existing UTM-read effect.
- `apps/web/src/app/quote/page.tsx` — wrapped `QuoteCalculator` in `<Suspense>` (Next 15 requires a boundary for `useSearchParams()`); added a skeleton fallback that matches the calculator's shape so the layout doesn't shift during hydration.
- 9 visual captures under `audit/d0028-*.png` (5 desktop @ 1280x900, 4 mobile @ 393x851, 3 states each: idle / hit-33771 / miss-99999, plus hit-areas-open to show the collapsed-details chip row expanded).
- `audit/capture-d0028.py` + `audit/capture-d0028.ps1` — CDP capture wrapper (Chrome headless + WebSocket) for future D-0028+ iterations.

## Acceptance checklist (all green)
- [x] ServiceAreaMap is 'use client' with internal state (`query`, `result`)
- [x] Single input with `inputmode="numeric"`, `pattern="\d{5}"`, `autoComplete="postal-code"`
- [x] `<datalist>` includes all 6 ZIPs + all 6 neighborhood names from `pinLocations`
- [x] Hit: "You're covered · {zip} — {name}" + sun-filled `Button as="link" variant="sun"` → `/quote?zip={zip}` — `audit/d0028-desktop-hit-section.png`
- [x] Miss: "That's outside my usual route" + outline `Button as="link" variant="outline"` → `/quote` — `audit/d0028-desktop-miss-section.png`
- [x] Invalid: inline helper "Type a 5-digit ZIP or a neighborhood name like 'Largo' or 'Belleair'.", no CTA, layout stable
- [x] Live region via `<output>` (implicit role="status" + aria-live="polite")
- [x] Visible focus ring on input AND check button (global `*:focus-visible` applies)
- [x] Form is `<form onSubmit>` AND click on "Check coverage" submits (raw `<button type="submit">`)
- [x] Map picture preserved as brand art, NO AI regeneration
- [x] Collapsed `<details>` "See all six areas" with 6 area chips linking to `/areas/{zip}`
- [x] `/quote?zip=33771` pre-fills ZIP select — wired via `useSearchParams` + `inServiceArea` in QuoteCalculator; the parent page wraps in `<Suspense>` so /quote stays static-prerenderable
- [x] Mobile 393px: form stacks above map, map max-height 55vh, result panel under map — `audit/d0028-mobile-{idle,hit,miss}-section.png`
- [x] Desktop >=980px: 3-col grid (form | map | result) — `audit/d0028-desktop-{idle,hit,miss}-section.png`
- [x] `bun run typecheck` — green for my code (7 pre-existing TS6133 errors in `visual/desktop-section-composition/wp75-81.spec.ts` are untouched, logged in commit body)
- [x] `bun run build` — green, /quote still static-prerenderable
- [x] `bun run test:charter` — 3/3 green (lint-agents, lint-capabilities, ledger-freshness @ 1.1 days)

## Decisions I made differently from the spec
1. **Layout:** spec said "form + result panel flank the map" (3-col on desktop). I went with 3-col grid (1fr | 1.5fr | 1fr). Documented in the commit body — flank keeps the result panel within eye-distance of the submit button.
2. **Result live region:** spec said `<div role="status" aria-live="polite">`. I used `<output>` (semantic HTML5 element with implicit role="status" + aria-live="polite"). Same a11y behavior, more semantic, silences a Biome lint. Documented in commit body.
3. **Idle state:** added a soft "We'll tell you on the spot." prompt in the result panel when no query has been submitted, so the layout doesn't shift on first interaction.

## Things the steward should know before reviewing
- The commit was made via a tool/process I didn't directly invoke (timestamp 22:54, after I had finished `git add`-ing the source files but before I got to `git commit`). The author + author email match the repo's existing commit author. Commit hash, contents, and message all match what I was about to commit. If you want the commit re-done with a different author or hash, let me know and I'll reset and recommit.
- The working tree still has 2 pre-existing modifications (`apps/web/public/illustrations/pinellas-overpass-raw-clean.json` 1-line whitespace, `apps/web/visual/test-output/...` from my PW run) — neither is in the commit.
- Other work in progress: `apps/web/src/app/page.tsx` and `OperatorStrip.tsx/.module.css` were modified AFTER my commit (likely D-0029 Wave B from another agent). Untouched by me.
- Capture scripts: I committed `audit/capture-d0028.{py,ps1}` and `audit/capture-d0028-mobile.{py,ps1}`. The -mobile variants were created by an earlier capture iteration that the steward can drop if they prefer a single canonical script.
- Visual capture caveat: the `d0028-desktop-hit-areas-open.png` shows the **miss** state in the result panel (not hit) because the test sequence is hit → miss → open-details. The chips row below is what we wanted to show; the result panel's content is incidental.

Branch: `main`.
