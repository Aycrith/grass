#!/usr/bin/env python3
"""
D-0049 (rev 3) — Fix black-letterbox bleed in fern + songbirds parallax assets.

ROOT CAUSE:
  The fern-01..06.webp and songbirds-01..06.webp assets are VEO extractions
  encoded as RGB WebP (no alpha channel). They have SOLID BLACK pixels in
  the letterbox areas (corners = (0,0,0) or (1,1,1), confirmed by
  ImageMagick probe). The storybook layers .fernWrap and .songbirdsWrap
  apply `mix-blend-mode: multiply` to the cartoon underneath — and
  black × anything = black, so the letterbox bleeds through as a solid
  dark column. The column is visible at ~50% of panel width (left edge
  of the songbirds-01..06 letterbox) on the production hero at scroll 0
  and through the [0.10, 0.40] cross-fade window.

FIX:
  Convert solid-black pixels (R + G + B < 30) to alpha=0. Threshold is
  conservative — dark green palm leaves and hill pixels are RGB ~30-60,
  60-100, 30-50 (R+G+B ~120-210) so they are preserved at full alpha.
  Save back as WebP with alpha channel (lossless-ish; webp lossless
  preserves the alpha exactly).

DOES NOT TOUCH:
  - scene2-01..06.webp (1240x680, corners are cream ~250,245,230 — no
    black letterbox, no fix needed)
  - palms-01..06.webp  (1240x680, corners are cream/green — no black
    letterbox, no fix needed)
  - desktop.avif / desktop.webp / mobile.avif / mobile.webp (the 4K
    production photograph, full-bleed, no letterbox)
  - hero-green-grass.jpg (fallback photo, no letterbox)

USAGE:
  python apps/web/scripts/fix-v2-asset-letterbox.py [--dry-run]

The script is idempotent — running it again on already-transparent
assets is a no-op for pixels that are already alpha=0.
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from PIL import Image

BLACK_THRESHOLD = 30  # R + G + B < threshold → alpha = 0
ASSETS_DIR = Path("apps/web/public/hero/layers/v2")

# (prefix, count) for each asset family we process. Both families
# extracted from VEO with the same letterbox bleed.
ASSET_FAMILIES: list[tuple[str, int]] = [
    ("fern", 6),
    ("songbirds", 6),
]


def fix_one(path: Path, dry_run: bool) -> tuple[int, int, int]:
    """Process one WebP. Returns (total_pixels, transparent_count, opaque_count)."""
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    pixels = im.load()

    transparent_count = 0
    opaque_count = 0
    total = w * h

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r + g + b < BLACK_THRESHOLD:
                if a != 0:
                    pixels[x, y] = (r, g, b, 0)
                    transparent_count += 1
                # else already transparent
            else:
                if a != 255:
                    pixels[x, y] = (r, g, b, 255)
                    opaque_count += 1
                # else already opaque

    if not dry_run and (transparent_count > 0 or opaque_count > 0):
        # WebP with alpha, lossless to preserve the exact RGB values
        # for the opaque pixels (no quality drift on the dark green
        # palm leaves or hill shadows).
        im.save(path, "WEBP", lossless=True, method=6)

    return total, transparent_count, opaque_count


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Report what would change without writing the file",
    )
    args = parser.parse_args(argv)

    if not ASSETS_DIR.is_dir():
        print(f"ERROR: assets dir not found: {ASSETS_DIR.resolve()}", file=sys.stderr)
        return 1

    total_changed = 0
    total_pixels = 0
    for prefix, count in ASSET_FAMILIES:
        for i in range(1, count + 1):
            path = ASSETS_DIR / f"{prefix}-{i:02d}.webp"
            if not path.is_file():
                print(f"  SKIP (missing): {path}")
                continue
            n_pixels, n_trans, n_opaque = fix_one(path, args.dry_run)
            total_pixels += n_pixels
            total_changed += n_trans + n_opaque
            label = "DRY-RUN" if args.dry_run else "WROTE"
            print(
                f"  {label} {path.name:24s} "
                f"{n_pixels:>9d}px  "
                f"made-transparent={n_trans:>8d}  "
                f"made-opaque={n_opaque:>6d}"
            )

    print(
        f"\nTotal: {total_pixels:,d} pixels scanned across {sum(c for _, c in ASSET_FAMILIES)} assets. "
        f"{total_changed:,d} alpha values changed. "
        f"{'[DRY-RUN] no files written' if args.dry_run else '[WRITE] files updated in place'}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
