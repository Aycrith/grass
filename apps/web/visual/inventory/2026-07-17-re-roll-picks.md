# 2026-07-17 — Re-Roll Picks (Visual QA, metric-driven)

## Honest scope

I cannot actually view MP4 videos. The picks below are **metric-driven** — computed by `tmp/qa-pick.py` from each duplicate:

- **Loop seamlessness proxy** — per-pixel mean absolute diff between the first (t=0.5s) and last (t=duration-0.5s) frames at a 320×180 downscale. **Lower = cleaner loop closure.**
- **Palette match proxy** — green-channel mean luma at three sample frames (t=0.5s, mid, t=duration-0.5s). The script's chosen band is **G≈50-150** for brand greens; actual brand tokens (`--ll-green` G=78, `--ll-green-hover` G=102, `--ll-palm-shadow` G=90, `--ll-palm-light` G=155) span ~78-155.
- **Motion cadence brittleness** — captured implicitly by loop_diff variance across the three sampled frames.

Frame samples for the steward's own visual cross-check live in `apps/web/visual/inventory/frames/` (21 PNGs total = 3 per duplicate). The picks below are reasonable proxies; the steward's eye is the binding decision.

## Picks (3 of 7 retained)

### ✅ Egret #2 — `Egret_standing_in_shallow_water_202607172016.mp4`

| Metric | #1 (re-roll reject) | **#2 (chosen)** |
|---|---:|---:|
| size_bytes | 2,159,605 | **2,169,107 (+0.4%)** |
| **loop_seam_mean_diff_RGB** | 8.49 | **5.16** ⭐ (lower = cleaner loop; **60% cleaner**) |
| green_channel (t0 / tmid / tend) | 151 / 147 / 145 | **155 / 154 / 154** |
| filename timestamp | `_202607172016_202607172038` (double — re-roll pattern) | `_202607172016` (single — primary) |

**Rationale (1 line):** `#2` has the cleanest loop closure (mean diff 5.16 vs 8.49 — ~60% lower) AND carries the simpler single-timestamp filename, supporting it as the primary generation rather than a re-roll reject.

### ✅ Mower #8 — `Riding_mower_cutting_lawn_202607171601.mp4`

| Metric | #7 (chosen alt) | **#8 (chosen)** |
|---|---:|---:|
| size_bytes | 2,492,306 | **2,533,822 (+1.7%)** |
| **loop_seam_mean_diff_RGB** | 35.52 | **30.11** ⭐ (15% cleaner) |
| green_channel (t0 / tmid / tend) | 100 / 100 / 101 (flat) | **103 / 112 / 110** (varied) |
| implied motion | static-feeling (lower variance) | wider per-frame variance (more actual motion) |

**Rationale (1 line):** `#8` is 1.7% larger, 15% cleaner loop, and shows wider green-channel variance across the loop — `#7`'s flat 100/100/101 hints at minimal motion between sample points vs. `#8`'s actual movement variation.

### ✅ Gouache base plate #10 — `Hand-painted_gouache_painting_still_202607171732.mp4`

| Metric | #9 | **#10 (chosen)** | #11 |
|---|---:|---:|---:|
| size_bytes | 2,536,613 | 2,475,219 | 2,482,733 |
| **loop_seam_mean_diff_RGB** | 4.61 | **1.54** ⭐ | 13.05 |
| green_channel (t0/tmid/tend) | 177 / 176 / 176 (sun-blue wash) | **72 / 70 / 70** ⭐ (primary green band) | 93 / 93 / 91 (mid-green band) |
| palette match to brand greens | weak (out of band, sun-blue) | strong (`--ll-green` G=78) | mid (`--ll-palm-shadow` G=90) |

**Rationale (1 line):** `#10` wins on BOTH axes by wide margins — the **lowest loop_diff in the entire dataset** (1.54, 3× cleaner than runner-up #9, 8× cleaner than #11) AND its green-channel mean of ~70 lands cleanly in the primary brand-green band (`--ll-green #1f4e2c` G=78); `#9`'s `~177` reads more like `--ll-sun-light` than grass, and `#11`'s `~93` is `palm-shadow`-mid without the primary-green saturation.

## Re-roll pattern observations

| Concept | Observation |
|---|---|
| **Egret** | `#1`'s double-timestamp `_202607172016_202607172038` is a re-roll pattern (generated at 20:16, re-rolled at 20:38). The pick matches the simpler-suffix filename as the primary. |
| **Mower** | `#7` (16:03) vs `#8` (16:01) — both single-timestamp. The 15% loop_diff gap is real; `#8` was generated 2 minutes earlier with marginally more motion. |
| **Gouache** | 3 generations span 16:36 → 17:32 → 17:37. **`#10` (mid-generational) is the cleanest loop AND best green match.** Visual quality is independent of recency — the latest timestamp (#11) is NOT the best. |

## Deletion candidates (saves ~9.22 MiB)

The user's message targeted ~12 MB savings. Actual measured savings with these picks:

| File (basename) | size_bytes |
|---|---:|
| `Egret_standing_in_shallow_water_202607172016_202607172038.mp4` | 2,159,605 |
| `Riding_mower_cutting_lawn_202607171603.mp4` | 2,492,306 |
| `Hand-painted_gouache_illustratio…_202607171636.mp4` | 2,536,613 |
| `Hand-painted_gouache_storybook_p…_202607171737.mp4` | 2,482,733 |
| **Total** | **9,671,257 B ≈ 9.22 MiB** |

(The ~12 MB estimate in the user's message appears to have been approximate; measured savings is 9.22 MiB which still earns its keep.)

**Note on safety:** the user's message implicitly authorized deletion ("deleting at the end saves ~12 MB"). **I have NOT executed deletion this turn** because the picks above are metric-driven, not visually validated. Best practice: deletion follows a brief visual confirmation pass. See `## Suggested followups` below for the deletion-as-followup path.

## Frame samples for steward's visual QA

All 21 frame PNGs in `apps/web/visual/inventory/frames/`:

```
egret__Egret_standing...202607172016_202607172038__t0_5s.png    (Egret #1, early)
egret__Egret_standing...202607172016_202607172038__tmid.png      (mid 4.0s)
egret__Egret_standing...202607172016_202607172038__tend.png     (late 7.5s — compare to t0 for loop seam)
egret__Egret_standing...202607172016__t0_5s.png                 (Egret #2, CHOSEN)
egret__Egret_standing...202607172016__tmid.png
egret__Egret_standing...202607172016__tend.png
mower__Riding_mower...202607171603__t0_5s.png                   (Mower #7)
mower__Riding_mower...202607171603__tmid.png
mower__Riding_mower...202607171603__tend.png
mower__Riding_mower...202607171601__t0_5s.png                   (Mower #8, CHOSEN)
mower__Riding_mower...202607171601__tmid.png
mower__Riding_mower...202607171601__tend.png
gouache__Hand-painted_gouache...illustratio...202607171636__t0_5s.png   (Gouache #9)
gouache__Hand-painted_gouache...illustratio...202607171636__tmid.png
gouache__Hand-painted_gouache...illustratio...202607171636__tend.png
gouache__Hand-painted_gouache...painting_still...202607171732__t0_5s.png  (Gouache #10, CHOSEN)
gouache__Hand-painted_gouache...painting_still...202607171732__tmid.png
gouache__Hand-painted_gouache...painting_still...202607171732__tend.png
gouache__Hand-painted_gouache...storybook_p...202607171737__t0_5s.png   (Gouache #11)
gouache__Hand-painted_gouache...storybook_p...202607171737__tmid.png
gouache__Hand-painted_gouache...storybook_p...202607171737__tend.png
```

Plus the machine-readable sidecar `apps/web/visual/inventory/frames/qa-pick-metrics.json`. Re-run the tool any time with:

```bash
python /c/Users/camer/DEVNEW/grass/tmp/qa-pick.py \
  --downloads "C:/Users/camer/Downloads" \
  --frames-out "C:/Users/camer/DEVNEW/grass/apps/web/visual/inventory/frames"
```

## Known followups (from prior code-review)

1. **Tighten subprocess timeouts in `tmp/qa-pick.py`.** Currently 30s × ffprobe + 3×ffmpeg = up to 120s per video × 7 = **14-minute worst-case bound**. Recommend 10s ffprobe / 15s ffmpeg / 90s script cap. The CEC run here took <60s end-to-end (within the existing budget), but the worst-case tail is real for slow disks.
2. **`apps/web/visual/inventory/frames/` to `.gitignore`.** The PNG frames are working-tree artifacts (re-runnable from the raw MP4s); should be excluded from VCS like `apps/web/_working-tree-noise/`.
3. **PIL exception hardening in qa-pick.py.** Current `safe_open_summarize` checks `p.stat().st_size == 0` but a truncated PNG can pass that check and crash `Image.open(p)` mid-loop. Wrap in try/except returning `(None, None)` on `UnidentifiedImageError`.
