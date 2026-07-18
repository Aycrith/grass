# D-0015 - Hero mask viewport-gate + sister-spec ratification

## Problem

Three open carryovers from the D-0014 (Amendment 1) audit chain need binding
ratification:

1. **Mask 4a (content-column intrusion below ~1100px viewport).**
   The `.photoWrap` right-edge `mask-image` (`linear-gradient(to right,
   black 0%, black 86%, transparent 100%)`) is wired into the full-viewport
   photoWrap, not into the content-only column. At 768-1100px viewports
   the mask boundary intrudes ~3-13% into the right side of the desktop
   content column.

2. **Mask 4b (double-fade with `.photoVignette`).**
   `.photoVignette` is a sibling of `.photoWrap` and already fades the
   right edge to `transparent 78%`. Combined with the mask, the right
   edge now fades TWICE - the photo's shoulder fades into the vignette's
   fade into cream. The doubled fade is visually over-corrected.

3. **Sister-spec ratification gap.**
   The implementation effort to ship a non-reduced-motion Playwright
   capture (`apps/web/visual/hero-noreduction.spec.ts`) so D-0014 +
   Amendment 1's recolored foreground grass + grass-tip gradients are
   visually verifiable (not just source-grep-verifiable) was attempted
   under D-0014's amendment convention but the script cycled through
   four revisions without a passing baseline. Per code-reviewer WARN
   the right governance path is to ratify the sister-spec requirements
   in a sister ADR rather than ship-before-ratification under D-0014.
   The failed spec was rolled back to ground state; this ADR is the
   formal ratification of the requirements that drove it.

## Context

- Charter principle #3 binds each irreversible decision to a Decision
  Template entry that has been ratified. A new sister spec file + a
  new visual-regression baseline ARE conditionally irreversible
  (the file is reversible by deletion; the committed baseline is the
  long-lived matrix ground truth). Together they earn their own ADR.
- Charter principle #6 (maintainability over velocity) binds refactor
  weekly. D-0014's review date 2026-07-31 is the natural cadence point
  for these carryovers.
- The reducedMotion='reduce' global config (playwright.config.ts line
  ~67) unmounts the storybook layer (HeroFieldTelemetry.tsx
  enableScrollFade=false), so NearLayer is NOT in the captured DOM for
  the canonical reduced-motion baseline. A sister matrix row IS the
  audit-required path for capturing D-0014 + Amendment 1's recolored
  foreground grass visually.
- Mask-risk mapping comes from the post-D-0014 code-review (WARN #4a
  and WARN #4b).

## Requirements

1. **`.photoWrap` mask viewport-gate.** Wrap the
   `mask-image` declarations on `.photoWrap` (in
   `HeroFieldTelemetry.module.css`) with a `@media (min-width: 1100px)`
   block so the fade only kicks in above the desktop content column's
   maximum width. Below 1100px, the right-edge fade is solely delegated
   to the existing `.photoVignette` `transparent 78%` boundary.
2. **Right-edge fade consolidation.** Pick either the mask OR the
   vignette as the single source of truth for the right-edge fade.
   Decision criterion: the mask offers hard pixel control but re-paints
   on every transform; the vignette is paint-only. Recommendation: KEEP
   the mask, narrow the vignette's right tap from `transparent 78%` to
   `transparent 92%` at `min-width: 1100px` (mask is primary below 1100px,
   vignette is primary above 1100px) - one source of truth per viewport
   bucket.
3. **Sister-spec ratification.** A new sister spec file
   `apps/web/visual/hero-noreduction.spec.ts` is AUTHORIZED, with:
   - `test.use({ reducedMotion: 'no-preference' })` at spec level.
   - Lodged in Playwright's default `<spec>-snapshots/` directory.
   - Snapshot basename `hero-motion-on` (NOT `hero`) to avoid the
     `hero-` prefix grep-collision with the canonical reduced-motion
     baseline `apps/web/visual/baselines/hero-chromium-desktop.png`.
   - Animation-freeze pre-capture: `addStyleTag` with
     `* { animation-play-state: paused !important; transition: none !important; }`
     + `document.getAnimations().forEach(a => a.pause())` to keep the
     captured PNG pixel-stable across CI runs.
   - Helper trio `flushScrollTriggers`, `settleForCapture`,
     `maskVolatileContent` imported from `./utils/stabilize` (NOT
     `./utils/fixtures`, which is a data-fixtures export).
   - Selector `[data-test-section="hero"]` (NOT `#hero`, which has
     strict-mode timeout on the duplicate id in the /visual-test
     wrapper).

## Alternatives

### Alt A - Defer all 3 to a future "hero polish" wave
Would clear the ledger but leaves visual-regression coverage of
D-0014 + Amendment 1's recolored foreground grass unverified.
**Rejected** - charter #2 (evidence before opinions) and charter #6
bind visual verification of recolor decisions.

### Alt B - Ship sister-spec under D-0014 amendment-in-place convention
The orchestrator attempted this path. Four revisions cycled without
a passing baseline. The code-reviewer WARN #4 explicitly recommended
ship-D-0015-first. **Rejected** - amendment-in-place is defensible
for in-scope clarifications but not for wholly-new test artifacts.

### Alt C (chosen) - Author D-0015 binding the 3 requirements
One ADR, three testable acceptance criteria, decoupled from D-0014's
review cadence. Matches the code-reviewer's verbatim recommendation.
PR pattern: separate commit per requirement (mask gate + fade
consolidation + sister spec) so each ships on its own reviewer
read.

## Evaluation matrix

| Criterion                                | Alt A | Alt B | Alt C (chosen) |
|------------------------------------------|-------|-------|----------------|
| Binds all 3 carryovers                   | NO    | PARTIAL| YES            |
| Charter #3 ratification cycle            | NO    | SHIP-BEFORE (WARN)| RATIFIED   |
| Visual-regression coverage for D-0014    | NO    | YES (if passing)| YES        |
| Fits 14-day review cadence                | YES   | YES   | YES            |
| Single-PR reviewable               
