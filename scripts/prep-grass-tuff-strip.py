"""prep-grass-tuff-strip.py — extract a 6-frame grass-tuff foreground strip.

CONTEXT
=======
The hero's hand-authored SVG NearLayer (60 grass blades with per-blade
sway) currently fills the lower 30% of scene 1. If a future
iteration wants to REPLACE that SVG with the painted-VEO grass
texture from the Hand-painted_gouache_illustratio source clip
(where the storybook BG has a natural grass-tuft band at the
bottom), this script lifts that band out as a 6-frame webp strip.

This is the OPPOSITE direction of the fern-bottom prep script:
that one is for "fern fronds rooted in the grass band";
this one IS the grass band itself.

OUTPUT
======
A 6-frame grass-tuff strip at apps/web/public/hero/layers/v2/grass-NN.webp.
Same 6-frame cadence as the other v2 strips (3.2s loop, slightly
slower than the palms because grass tufts sway less than palm
fronds).

USAGE
=====
    python scripts/prep-grass-tuff-strip.py             # extract from current dir
    python scripts/prep-grass-tuff-strip.py --source <path>  # explicit source
    python scripts/prep-grass-tuff-strip.py --dry-run   # show plan, no writes

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

# The illustratio source has the most usable grass-tuft band
# (large mowed lawn in the foreground, painted in gouache). The
# storybook variant is too symmetric; the painting_still is a
# top-down checkerboard (different concept). illustratio it is.
SOURCE_FILENAME = "Hand-painted_gouache_illustratio._202607171636.mp4"

# Source is 1280x720. Inner content area 1240x680 starting at
# (20, 20). The grass-tuft band is the lower 35% of the inner
# content: y_offset = 20 + (680 * 0.65) = 462, height = 680 * 0.35
# = 238. Scale to 1240x420 to keep the same aspect (2.95:1) the
# hero expects for a full-bleed grass band.
CROP_X, CROP_Y = 20, 462
CROP_W, CROP_H = 1240, 238
SCALE_W, SCALE_H = 1240, 420

DUR = 10
FRAME_COUNT = 6
OUT_DIR = "apps/web/public/hero/layers/v2"
TMP_DIR = OUT_DIR + "/.grass-tmp"
OUT_PREFIX = "grass"


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

    tmp_pattern = tmp_dir / f"{OUT_PREFIX}-%02d.png"
    print(
        f"extract {FRAME_COUNT} frames from {args.source.name} "
        f"-> {OUT_PREFIX} (grass-tuft band crop)"
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

    for old in tmp_dir.iterdir():
        old.unlink()
    tmp_dir.rmdir()

    print(f"--- {OUT_PREFIX} OUTPUT ---")
    for f in sorted(args.out_dir.iterdir()):
        if f.name.startswith(OUT_PREFIX + "-") and f.suffix == ".webp":
            print(f"  {f.name} -> {f.stat().st_size} bytes")

    return 0


if __name__ == "__main__":
    sys.exit(main())
