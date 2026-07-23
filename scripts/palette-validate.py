"""palette-validate.py — brand-token compliance check for hero assets.

CONTEXT
=======
The landing-page hero carries 11 decisions (D-0042 through D-0059)
and one core rule: every color on the hero is a locked --ll-* token
in apps/web/src/styles/tokens.css. There are no one-off hex values
in the hero CSS modules. If a new asset (a future gravel-path loop,
a future hedge-trim loop, a future illustration) introduces a
color outside the locked palette, the asset is wrong — not the
palette.

This script catches that before the asset lands in the repo.

WHAT IT DOES
============
1. Loads an image (PNG, JPG, WebP, AVIF) via Pillow
2. Samples N random pixels (default 5000)
3. Bins the sampled pixels into a coarse 16-step RGB grid
4. For each bin's mean color, finds the CLOSEST brand palette token
5. Reports a Euclidean RGB distance to the closest token
6. Flags any color whose distance exceeds the threshold as an
   outlier (the asset has a color the palette doesn't account for)

The threshold defaults to 50 (~12% of 0-255 range, or "close but
not matching"). Tune with --threshold.

USAGE
=====
    python scripts/palette-validate.py <image>
    python scripts/palette-validate.py <image> --threshold 60
    python scripts/palette-validate.py <image> --json   # machine-readable
    python scripts/palette-validate.py <image> --samples 10000

Exit code: 0 if all colors within threshold, 1 if outliers found.
"""
import argparse
import json
import sys
from collections import Counter
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print(
        "ERROR: Pillow is required. Install with: pip install Pillow",
        file=sys.stderr,
    )
    sys.exit(2)


# Brand palette tokens from apps/web/src/styles/tokens.css.
# Hex values are the canonical "name" of the color. color-mix()
# derivatives (--ll-sun-pale, --ll-grass-mow, etc.) are computed
# at use time and not enumerated here — they fall between their
# two source tokens in RGB space and are caught by the
# threshold check naturally.
PALETTE = {
    "--ll-green":         (0x1f, 0x4e, 0x2c),
    "--ll-sand":          (0xd4, 0xa5, 0x74),
    "--ll-sky":           (0x3b, 0x7d, 0xd8),
    "--ll-charcoal":      (0x1a, 0x1a, 0x1a),
    "--ll-cream":         (0xfa, 0xf6, 0xf0),
    "--ll-palm-shadow":   (0x2d, 0x5a, 0x3d),
    "--ll-palm-light":    (0x6b, 0x9b, 0x7e),
    "--ll-gulf":          (0x2e, 0x6b, 0x8c),
    "--ll-sun":           (0xe8, 0xb6, 0x5a),
    "--ll-clay":          (0xb5, 0x65, 0x1d),
    "--ll-sand-bleached": (0xf4, 0xe8, 0xd0),
    "--ll-shell":         (0xff, 0xff, 0xff),
    "--ll-palm-bark":     (0x1a, 0x1f, 0x1b),
    "--ll-sage-muted":    (0x8f, 0xa8, 0x9b),
}


def hex_to_rgb(hex_str: str) -> tuple[int, int, int]:
    h = hex_str.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def rgb_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    """Euclidean RGB distance. 0 = identical, 441.67 = black to white."""
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def closest_token(rgb: tuple[int, int, int]) -> tuple[str, float]:
    """Return (token-name, distance-to-that-token) for the closest palette entry."""
    best_name = "?"
    best_dist = float("inf")
    for name, token_rgb in PALETTE.items():
        d = rgb_distance(rgb, token_rgb)
        if d < best_dist:
            best_dist = d
            best_name = name
    return best_name, best_dist


def sample_pixels(
    img: Image.Image,
    n: int,
    seed: int = 0,
) -> list[tuple[int, int, int]]:
    """Sample n random pixels from the image. Uses a deterministic
    PRNG (random) so the same input produces the same report.

    Returns a list of (R, G, B) tuples in 0-255 space.
    """
    import random
    rng = random.Random(seed)
    w, h = img.size
    pixels = []
    # Convert to RGB if not already (handles RGBA, P, L, etc.)
    if img.mode != "RGB":
        img = img.convert("RGB")
    for _ in range(n):
        x = rng.randrange(w)
        y = rng.randrange(h)
        pixels.append(img.getpixel((x, y)))
    return pixels


def bin_pixels(
    pixels: list[tuple[int, int, int]],
    step: int = 16,
) -> Counter:
    """Bin pixels into a coarse RGB grid. The step=16 default gives
    16x16x16 = 4096 possible bins, which is fine-grained enough to
    catch dominant colors but coarse enough to bin noisy pixels
    together (a 1-pixel JPEG artifact doesn't become its own bin).

    Returns a Counter mapping (R_bin, G_bin, B_bin) -> count.
    """
    bins: Counter = Counter()
    for r, g, b in pixels:
        bins[(r // step * step, g // step * step, b // step * step)] += 1
    return bins


def bin_to_mean(
    bin_r: int, bin_g: int, bin_b: int, step: int = 16,
) -> tuple[int, int, int]:
    """Convert a bin coordinate to the bin's centroid (mid-cell RGB)."""
    return (bin_r + step // 2, bin_g + step // 2, bin_b + step // 2)


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__.split("\n\n")[0],
    )
    parser.add_argument("image", type=Path, help="Path to the image to validate")
    parser.add_argument(
        "--threshold",
        type=float,
        default=50.0,
        help="Euclidean RGB distance threshold (default: 50.0)",
    )
    parser.add_argument(
        "--samples",
        type=int,
        default=5000,
        help="Number of random pixels to sample (default: 5000)",
    )
    parser.add_argument(
        "--bin-step",
        type=int,
        default=16,
        help="RGB bin size (default: 16)",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=0,
        help="PRNG seed for reproducible sampling (default: 0)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output machine-readable JSON",
    )
    parser.add_argument(
        "--outliers-only",
        action="store_true",
        help="Suppress compliant colors; report only outliers",
    )
    args = parser.parse_args()

    if not args.image.exists():
        print(f"ERROR: image not found: {args.image}", file=sys.stderr)
        return 2

    try:
        img = Image.open(args.image)
    except Exception as e:
        print(f"ERROR: cannot open image: {e}", file=sys.stderr)
        return 2

    pixels = sample_pixels(img, args.samples, args.seed)
    bins = bin_pixels(pixels, step=args.bin_step)
    total = sum(bins.values())

    # Build per-bin report: mean color, closest token, distance, share.
    bin_reports = []
    outliers = []
    for (r, g, b), count in bins.most_common():
        mean = bin_to_mean(r, g, b, step=args.bin_step)
        token, dist = closest_token(mean)
        share = count / total
        rec = {
            "mean_rgb": mean,
            "count": count,
            "share": share,
            "closest_token": token,
            "distance": dist,
        }
        bin_reports.append(rec)
        if dist > args.threshold:
            outliers.append(rec)

    # Sort outliers by share descending (most-prominent first).
    outliers.sort(key=lambda r: r["share"], reverse=True)

    report = {
        "image": str(args.image),
        "samples": args.samples,
        "threshold": args.threshold,
        "bin_count": len(bins),
        "outlier_count": len(outliers),
        "all_within_threshold": len(outliers) == 0,
        "top_outliers": [
            {
                "color": f"#{rec['mean_rgb'][0]:02x}{rec['mean_rgb'][1]:02x}{rec['mean_rgb'][2]:02x}",
                "share_pct": round(100 * rec["share"], 1),
                "closest_token": rec["closest_token"],
                "distance": round(rec["distance"], 1),
            }
            for rec in outliers[:10]
        ],
    }

    if args.json:
        # JSON mode flattens the report.
        print(json.dumps(report, indent=2))
    else:
        # Human mode.
        size = args.image.stat().st_size
        print(f"Image:    {args.image}")
        print(f"Size:     {img.size[0]}x{img.size[1]}, {size} bytes")
        print(f"Samples:  {args.samples} random pixels")
        print(f"Palette:  {len(PALETTE)} locked tokens, threshold {args.threshold}")
        print(f"Result:   {report['all_within_threshold'] and 'PASS' or 'FAIL'} "
              f"({report['outlier_count']} outlier bins)")
        print()
        if outliers and not args.outliers_only:
            print("Top outliers (most prominent colors NOT in the palette):")
            print()
            print(f"  {'color':<10} {'share':>6}  {'closest':<18} {'distance':>8}")
            print(f"  {'-'*10} {'-'*6}  {'-'*18} {'-'*8}")
            for r in outliers[:10]:
                mr, mg, mb = r["mean_rgb"]
                color = f"#{mr:02x}{mg:02x}{mb:02x}"
                share_pct = 100 * r["share"]
                print(
                    f"  {color:<10} {share_pct:>5.1f}%  "
                    f"{r['closest_token']:<18} {r['distance']:>8.1f}"
                )
        elif not outliers:
            print("All sampled colors are within the locked palette. "
                  "Asset is brand-compliant.")

    return 0 if report["all_within_threshold"] else 1


if __name__ == "__main__":
    sys.exit(main())
