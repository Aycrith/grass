"""prep-fern-bottom-anchored.py — extract a bottom-anchored fern frame strip.

CONTEXT
=======
The v2 fern layer (apps/web/public/hero/layers/v2/fern-01..06.webp) is
the same fern frond used in HeroStorybookLayer's foreground parallax.
It is FULL-FRAME cropped: the frond occupies the upper-left of the
1240x680 strip and the bottom 60% is empty cream background.

If a future iteration wants a DIFFERENT foreground treatment — for
example, adding a 4th 'grass band' plane that has fern fronds
entering FROM the top of the band and disappearing INTO the bottom
of the band (the "ferns rooted in the grass" treatment) — the
existing fern-*.webp won't work. The frond sits too high; the new
band needs a fern whose TIP is at the bottom of the strip and whose
STEM is at the top.

This script produces that variant.

OUTPUT
======
A 6-frame bottom-anchored fern strip at apps/web/public/hero/layers/v2/fern-bottom-NN.webp.
Same 6-frame cadence as the other v2 strips (2.4s loop, frame index
step 0, 16, 56, 96, 136, 176, 216 of the source 240-frame clip).

USAGE
=====
    python scripts/prep-fern-bottom-anchored.py             # extract from current dir
    python scripts/prep-fern-bottom-anchored.py --source <path>  # explicit source
    python scripts/prep-fern-bottom-anchored.py --dry-run   # show plan, no writes

PREREQ
======
- ffmpeg in PATH (8.x tested)
- Source mp4 is 1280x720 (the standard VEO output)
- Run from the directory containing the source mp4, OR pass --source
"""
import argparse
import os
import subprocess
import sys
from pathlib import Path

# Source mp4 - the Fern_swaying_in_painting VEO render. Crop values
# are measured from probe/Fern_swaying_in_painting_202607171905_*.png:
# the frond occupies the upper-LEFT half of the inner content area;
# the bottom-anchored variant needs the OPPOSITE - the frond at the
# BOTTOM, empty cream at the TOP. We get there by inverting the
# vertical crop window: take the lower 60% of the source content
# (which still contains the frond) and pad the top with cream by
# anchoring to the bottom.
SOURCE_FILENAME = "Fern_swaying_in_painting_202607171905.mp4"

# Source is 1280x720. The inner content (cream-bg) is 1240x680
# centered at (20, 20). For bottom-anchored output we keep the full
# 1240 width but crop the upper 40% OFF, then scale the remaining
# 60% (the lower portion, which still contains the frond) to the
# same 1240x680 canvas. Result: the frond tip is now near the bottom
# of the canvas (where it meets "the ground") and the stem is in
# the middle. Empty cream fills the top quarter.
CROP_X, CROP_Y = 20, 20 + 272  # = 292; skip the top 40% of inner content
CROP_W, CROP_H = 1240, 408     # remaining 60% of inner content height
SCALE_W, SCALE_H = 1240, 680   # scale back to the v2 standard size

DUR = 10
FRAME_COUNT = 6
OUT_DIR = "apps/web/public/hero/layers/v2"
TMP_DIR = OUT_DIR + "/.fern-bottom-tmp"
OUT_PREFIX = "fern-bottom"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument(
        "--source",
        type=Path,
        default=Path(SOURCE_FILENAME),
        help=f"Path to the source mp4 (default: ././{SOURCE_FILENAME} relative to cwd)",
    )
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=Path(OUT_DIR),
        help=f"Output directory (default: {OUT_DIR})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the planned ffmpeg commands without executing them",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if not args.source.exists():
        print(f"ERROR: source mp4 not found: {args.source}", file=sys.stderr)
        print(
            f"       run this from a directory containing {SOURCE_FILENAME}, "
            f"or pass --source <path>",
            file=sys.stderr,
        )
        return 1

    # ffmpeg select expression: pick frames at evenly-spaced timestamps.
    # 6 frames across 10s @ 24fps = indices 16, 56, 96, 136, 176, 216.
    indices = [int(i * (24 * DUR - 1) / (FRAME_COUNT - 1)) for i in range(FRAME_COUNT)]
    select_expr = "+".join(f"eq(n\\,{i})" for i in indices)

    vf = (
        f"crop={CROP_W}:{CROP_H}:{CROP_X}:{CROP_Y},"
        f"scale={SCALE_W}:{SCALE_H}:flags=lanczos,"
        f"select='{select_expr}',"
        f"setpts=N/({FRAME_COUNT}/1.0)/TB"
    )

    if args.dry_run:
        print("[dry-run] would run ffmpeg with these args:")
        print(f"  source:  {args.source}")
        print(f"  vf:      {vf}")
        print(f"  out_dir: {args.out_dir}")
        print(f"  prefix:  {OUT_PREFIX}")
        print(f"  frames:  {FRAME_COUNT} (indices {indices})")
        return 0

    args.out_dir.mkdir(parents=True, exist_ok=True)
    tmp_dir = Path(TMP_DIR)
    tmp_dir.mkdir(parents=True, exist_ok=True)

    # First pass: extract PNGs at native res.
    tmp_pattern = tmp_dir / f"{OUT_PREFIX}-%02d.png"
    print(
        f"extract {FRAME_COUNT} frames from {args.source.name} "
        f"-> {OUT_PREFIX} (bottom-anchored crop)"
    )
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-v",
            "error",
            "-i",
            str(args.source),
            "-vf",
            vf,
            "-frames:v",
            str(FRAME_COUNT),
            str(tmp_pattern),
        ],
        check=True,
    )

    # Second pass: encode each PNG to webp individually.
    print(f"encode {OUT_PREFIX} to webp")
    for i in range(1, FRAME_COUNT + 1):
        src_png = tmp_dir / f"{OUT_PREFIX}-{i:02d}.png"
        dst_webp = args.out_dir / f"{OUT_PREFIX}-{i:02d}.webp"
        if not src_png.exists():
            print(f"  WARN missing {src_png}")
            continue
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-v",
                "error",
                "-i",
                str(src_png),
                "-lossless",
                "0",
                "-q:v",
                "65",
                str(dst_webp),
            ],
            check=True,
        )

    # Cleanup temp pngs.
    for old in tmp_dir.iterdir():
        old.unlink()
    tmp_dir.rmdir()

    # Inventory.
    print(f"--- {OUT_PREFIX} OUTPUT ---")
    for f in sorted(args.out_dir.iterdir()):
        if f.name.startswith(OUT_PREFIX + "-") and f.suffix == ".webp":
            print(f"  {f.name} -> {f.stat().st_size} bytes")

    return 0


if __name__ == "__main__":
    sys.exit(main())
