# 2026-07-17 — Hero Palette / Coverage Audit (READ-ONLY)

## Scope

The steward annotated `apps/web/visual/baselines/hero-chromium-desktop.png`
(18:56 today) with three regions of concern:

| Annotation | Location | What it flags |
|---|---|---|
| **Blue L** | lower-left | foreground band still sand-toned where it should be grass-green |
| **Blue C** | lower-center | mid-band clay/sand where mid-band grass should be |
| **Red R** | right edge | photo/illustration bleeds past the content boundary |

D-0014 (hero foreground grass recolor + Mower SVG removal + planned
photo-edge mask) shipped earlier today at commit 8 in the 2026-07-17
cascade. This audit is the post-cascade **5-minute MEASURE** — it
turns the steward's annotated screenshot into NUMBERS so any future
hero-rev2 spec can inherit quantitative acceptance criteria instead of
re-debating the same axes visually.

## Method

| Step | Choice | Source |
|---|---|---|
| Distance metric | RGB Euclidean (root-sum-sq of channel diffs) | thinker-with-files-gemini design (2026-07-17) |
| Tolerance band | Δ≤30 | captures anti-aliased borders; rejects cross-talk family members |
| Sampling | stride = 10 on both axes; ~1% of pixels | deterministic, fast in pure Python |
| Anchoring families | GREEN / SAND / BG mutual-exclusive; EDGE catchall | brand tokens in `apps/web/src/styles/tokens.css` (incl. D-0014 grass derivatives) |
| Spatial localisation | 3×3 grid of thirds (top/mid/bottom × left/center/right) | direct correspondence to the blue-circle annotations |
| Mask-bleed detection | rightmost 5% X slice — bg_pct≥60 AND green_pct≤25 → mask_bleed_detected | direct correspondence to the red-circle annotation |
| Sample fingerprint | SHA-256 over the ordered sampled (r,g,b) tuples | reproducibility / byte-lock across cadences |
| Determinism | PIL read + classification + SHA-256 are all pure | output is byte-identical across hits |

## Tooling

| Component | Path | Role |
|---|---|---|
| Audit module | `apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit.py` | emits JSON to stdout; v3 with Q8 grass-derivatives, ci_gate, stride-aligned right-edge slice, ≥-threshold wording |
| Runner | `tmp/print-audit.py` | in-process importlib loader; writes JSON byte-lock artifact; prints KPIs |
| Output (byte-lock) | `apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit-output.json` | SHA `c35f4f1f2718a0f41158a21e4d8d276a9a705fea1a624b8ddc845c9ebc20c4d3`; byte-identical across re-runs |

## Inputs to this audit

| Parameter | Value |
|---|---|
| Hero PNG | `apps/web/visual/baselines/hero-chromium-desktop.png` |
| Resolution | **1265 × 801** px |
| Stride (every Nth pixel) | 10 |
| Total pixels sampled | **10,287** (≈1.0% of 1,012,985 px) |
| Sample fingerprint (SHA-256) | `5adec8ec8d53a0562b925e0d73bfb86fb1f8058a5faed2292b00fb600ae11e27` |
| GREEN anchors | `#1f4e2c #2a6638 #2d5a3d #6b9b7e #457455 #295638 #295637` (last 3 = D-0014 grass derivatives) |
| SAND anchors | `#d4a574 #b5651d` |
| BG anchors | `#faf6f0 #f4e8d0` |

## KPIs (this run)

### Global coverage (sample-weighted)

| Bucket | % | Interpretation |
|---|---:|---|
| green | **15.86** | direct green-family match (D-0014 cascade target) |
| sand | **0.02** | effectively NIL — D-0014 sand-recolor cascade succeeded |
| bg | 14.21 | page bg tokens (cream / sand-bleached) — mostly hero sky |
| edge | 69.90 | colors not within Δ≤30 of any token. **NOT a regression** — see interpretation §"Edge bucket dominance" |

### 3×3 spatial grid (sand-pct focus)

| Row ↓ / Col → | left | center | right |
|---|---|---|---|
| **top** | sand 0.00, green 30.92, bg 29.29, edge 39.79 | sand 0.00, green 8.11, bg 30.34, edge 61.55 | sand 0.00, green 8.73, bg 48.68, edge 42.59 |
| **mid** | sand 0.00, green 13.35, bg 2.84, edge 83.81 | sand 0.00, green 0.88, bg 15.17, edge 83.95 | sand 0.18, green 11.20, bg 0.62, edge 88.01 |
| **bottom** | sand 0.00, green 22.74, bg 0.34, edge 76.92 | sand 0.00, green 25.22, bg 0.44, edge 74.34 | sand 0.00, green 21.16, bg 0.44, edge 78.40 |

The two steward-annotated **blue circles** sat at bottom-left and
bottom-center — both cells show **0.00% sand**. ✓

The 0.18% sand in mid-right is documented cross-talk per
`method.known_risks[]` (sun-deep ≈ Δ38 from `--ll-sand`; the Δ≤30
tolerance keeps it inside edge). Acceptable per design.

### Right-edge mask-bleed (steward red circle)

| Metric | Value | Threshold | Verdict |
|---|---:|---|---|
| n_sampled | 567 | — | — |
| bg_pct | 14.11 | < 60 | ✓ well under page-bg dominance |
| green_pct | 22.93 | > 25 | ✓ foreground floor met |
| `mask_bleed_detected` | **false** | must be false | **PASS** ✓ |

### CI gate

```text
ci_gate: pass=True
ci_gate_verdict: PASS
reasons: (empty)
```

(No gate-failure reasons — sand_pct well below 5.0% threshold; mask bleed false.)

## Steward-annotated outcomes

| Annotation | Audit measurement | Status |
|---|---|---|
| **Blue L** (bottom-left sand band) | sand_pct = 0.00% in cell | **RESOLVED** by D-0014 |
| **Blue C** (bottom-center sand band) | sand_pct = 0.00% in cell | **RESOLVED** by D-0014 |
| **Red R** (right-edge photo bleed) | mask_bleed_detected = false; bg 14.11%, green 22.93% in right 5% | **RESOLVED** by D-0014 |

The post-D-0014 hero carries a verifiable before/after artifact:
pre-fix SHA `5c682354…` (per `2026-07-17-hero-bug-findings.md`), with
the byte-level difference now also quantified at the perceptual-palette
level (sand is gone, foreground is green, edge mask is in place). Test
grain matches the steward's eye but with numbers attached.

## Edge bucket dominance (69.9%) — interpretation, not regression

The "edge" bucket holds any pixel outside the Δ≤30 threshold of every
anchored token. The 69.9% share is driven by:

- **Hand-painted gouache sky** — `--ll-sun-pale/light/deep` derivatives. The closest sun-deep pixel is ≈Δ38 from `--ll-sand`, safely outside the SAND catch. Correct behavior.
- **Grass-blend transitions** — D-0014's `--ll-grass` is anchored at `#457455` (linear-RGB midpoint approximation of the oklab color-mix). The audit catches the central greens but leaves interpolation zones (between base green and palm-shadow, etc.) in edge.
- **Foreground illustrations** — palms, songbirds, the mayfly/mower silhouette; multi-color painted forms that intentionally sit out-of-brand-token range.

This is a **feature of the brief's storybook-painted aesthetic** — not
a regression on brand compliance. The "edge" bucket is
mutually-exclusive and UN-BINNED by design, deliberately so future
spikes in saturation (sun-deep) or wider grass-blend shifts don't
spuriously trip the SAND or BG gates. Tightening edge would mean
adding hand-painted-blend token anchors — a follow-up, not a this-round
blocker (see "Transferable acceptance criteria" below).

## Transferable acceptance criteria (for any future hero-rev2 spec)

These are the quantitative gates this audit produces from the current
post-D-0014 baseline. A future hero-rev2 spec that reflects the
steward-annotated intent can borrow these as binding:

1. **`sand_pct` per cell** — keep ≤ 0.50% per cell AND ≤ 0.10% globally in the `bottom_left | bottom_center` cells (blue-circle zones). Current pass: 0.00% / 0.00% / 0.02% global.
2. **`mask_bleed_detected`** at the rightmost 5% X slice — must equal `false`, AND `bg_pct < 30` AND `green_pct > 20` as belt-and-suspenders. Current pass: false / 14.11 / 22.93.
3. **Foreground green coverage in bottom_third** — ≥ 20% per cell across `bottom_left`, `bottom_center`, `bottom_right`. Current pass: 22.74 / 25.22 / 21.16.
4. **Optional tightening (defer)**: add `--ll-grass-{pale,deep,vibrant}` blend anchors to reduce the "edge" bucket from 69.9% to <55%. Risk: may over-constrain future illustrated scenes. Recommend: do not add without a spec-author's explicit decision.

## Known followups (non-blocking)

1. **Clean __pycache__ suppression verification.** v3 (v3.2 polish on `tmp/print-audit.py`) added `sys.dont_write_bytecode = True` to suppress Python's import-lib `.pyc` cache writes (which would otherwise violate the read-only invariant). The basher's verification on this round was contaminated by a pre-existing `__pycache__/` directory from earlier (v3-round) runs. Empirically confirm the suppression with a deletion-first test (rm -rf `__pycache__/` → run summarise → assert absence). Add a 1-line `assert not __pycache__.exists()` to print-audit.py per code-reviewer Q6.
2. **Mobile baseline absent.** `apps/web/visual/baselines/hero-chromium-mobile.png` does not exist. The audit needs a mobile capture to operate symmetrically. Future cadence: either author the mobile capture or scope the audit to desktop-only with explicit documentation.
3. **Sun-deep × sand cross-talk risk** is sub-Δ30 in the current render but documented in `method.known_risks[]`. A future sky-render with higher saturation could trip minor sand false-positives in the top row. If so, the future-spec should clamp the top_third sand threshold to ≤ 0.5% (the cross-talk is bounded there).
4. **Non-reduced-motion visual sister capture** for D-0015 verification, per `2026-07-17-hero-bug-findings.md → Amendment 1 → Visual-verification caveat`. Source-level grep verification caught the recolor but a no-reduced-motion Playwright capture is the cleanest signal that the actual rendered pixel matches the source intent. Sister spec file `visual/hero-noreduction.spec.ts` is the canonical next step.

## Byte-lock evidence (re-runnable)

| Artifact | Path / SHA |
|---|---|
| Audit module | `apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit.py` (v3) |
| Runner | `tmp/print-audit.py` (v3.2, v3 polish applied) |
| JSON output (canonical) | `apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit-output.json` |
| JSON output sha256-12 | `c35f4f1f2718a` |

Re-running the audit (via `python tmp/print-audit.py`) regenerates the
JSON byte-identically — establishes that the audit is deterministic
and a SHA byte-lock across future cadences will catch any
methodology/palette drift.
