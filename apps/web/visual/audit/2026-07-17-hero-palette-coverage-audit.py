#!/usr/bin/env python3
"""
2026-07-17 HERO PALETTE / COVERAGE AUDIT (READ-ONLY) -- v2

CHANGES vs v1 (per code-reviewer feedback):
  - Q8 (REAL): GREEN_FAMILY_RGB now anchors the D-0014 grass-family
    derivatives (--ll-grass, --ll-grass-mow, --ll-grass-deep). These
    were the EXACT mid-grass tones the hero foreground is supposed to
    contain; previously they fell into 'edge'.
  - Q10 (REAL): script now surfaces a top-level `ci_gate` block with
    a pass/fail boolean + reasons list. Exit code 0 = pass, 1 = data
    regression detected, 2 = bad args. CI can gate merges on this.
  - Q6 (nit): dropped redundant mode='r' (PIL default).
  - Q1 (soft): documented known cross-talk risk between --ll-sun-deep
    and --ll-sand inside `method.known_risks`.
  - Q2 (nit): right-edge slice starts at (W // stride) * stride with
    stride-aligned boundary; deterministic across viewport widths.

Methodology (unchanged from thinker design, 2026-07-17):
  - Stride sampling: every 10th pixel on both axes (N=10).
  - Distance metric: RGB Euclidean (d = sqrt(dR^2 + dG^2 + dB^2)).
  - Tolerance: delta_rgb <= 30 from any target hex.
  - Targets:
        GREEN_FAMILY = base greens + D-0014 grass derivatives
        SAND_FAMILY  = [--ll-sand, --ll-clay]
        BG_FAMILY    = [--ll-cream, --ll-sand-bleached]
  - Edge policy: pixels not within delta <= 30 of any target fall
    into the "edge" bucket -- mutually exclusive so sand counts
    represent unambiguous regression pixels, not anti-aliased
    borders.
  - Spatial: 3 x 3 grid (top/mid/bottom X left/center/right) by
    thirds. Localises the steward-annotated blue-circles (sand in
    lower rows) and the red-circle (right edge).
  - Mask bleed: rightmost 5% X slice -- bg_pct >= 60 AND
    green_pct <= 25 --> mask_bleed_detected = True.
  - Reproducibility: SHA-256 of sampled RGB tuples (deterministic
    order); sample_fingerprint_sha256 in the report.

USAGE:
  python 2026-07-17-hero-palette-coverage-audit.py <path-to-hero-png>
                              > 2026-07-17-hero-palette-coverage-audit-output.json

EXIT CODES:
  0  PASS  -- no data regressions detected (per ci_gate).
  1  FAIL  -- data regression (sand_pct > 5% OR mask_bleed_detected).
             Suitable for CI gating on merges.
  2  bad args.

DEFAULTS TO READ-ONLY BEHAVIOUR:
  - Opens image via PIL.Image.open (read-only by default).
  - Writes nothing to disk; only emits the JSON report to stdout.
  - Direct invocation does NOT create __pycache__ entries; only
    `python -m py_compile` or module-import would.
"""

from __future__ import annotations

import hashlib
import json
import sys
from typing import Iterable

from PIL import Image


# ---------------------------------------------------------------
# Brand colour tokens (from apps/web/src/styles/tokens.css).
# GREEN_FAMILY now includes D-0014 grass-derivative anchors:
#   --ll-grass      = mix(green 50%, palm-light)  approx #457455
#   --ll-grass-mow  = mix(green 30%, palm-shadow) approx #295638
#   --ll-grass-deep = mix(palm-shadow 70%, green) approx #295637
# The linear-RGB midpoint approximations below round to byte-aligned
# hex literals that the browser's oklab color-mix produces within
# delta_rgb <= 30 of these anchors at typical screen gamuts.
# ---------------------------------------------------------------
def hex2rgb(hex_str: str) -> tuple[int, int, int]:
    h = hex_str.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


GREEN_FAMILY_RGB: tuple[tuple[int, int, int], ...] = (
    hex2rgb('#1f4e2c'),  # --ll-green          primary brand green
    hex2rgb('#2a6638'),  # --ll-green-hover    primary CTA hover
    hex2rgb('#2d5a3d'),  # --ll-palm-shadow    deep section bg
    hex2rgb('#6b9b7e'),  # --ll-palm-light     subdued green
    hex2rgb('#457455'),  # --ll-grass          D-0014 mid green
    hex2rgb('#295638'),  # --ll-grass-mow      D-0014 freshly cut
    hex2rgb('#295637'),  # --ll-grass-deep     D-0014 deep grass
)
SAND_FAMILY_RGB: tuple[tuple[int, int, int], ...] = (
    hex2rgb('#d4a574'),  # --ll-sand           secondary accent
    hex2rgb('#b5651d'),  # --ll-clay           brick; pre-D-0014 mid-band
)
BG_FAMILY_RGB: tuple[tuple[int, int, int], ...] = (
    hex2rgb('#faf6f0'),  # --ll-cream          warm off-white
    hex2rgb('#f4e8d0'),  # --ll-sand-bleached  warm bone; hero bg
)

DELTA_RGB_LIMIT: int = 30

# CI-gate thresholds. Tunable; defaults reflect the acceptance
# targets stated in 2026-07-17-hero-bug-findings.md post-D-0014.
SAND_PCT_GATE: float = 5.0
BLEED_GATE: bool = True  # any True trip -> fail


def rgb_euclid(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    """Euclidean distance in RGB space -- root-sum-sq of channel diffs."""
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def classify(rgb: tuple[int, int, int]) -> str:
    """Return one of: 'green', 'sand', 'bg', 'edge'.

    Order matters: green > sand > bg > edge. A pixel that is within
    delta <= 30 of any GREEN target wins OVER a sand-target match --
    this prevents warm-yellow sky pixels from polluting the 'sand'
    bucket via cross-talk with --ll-sun-pale (out-of-family by design).
    """
    for tgt in GREEN_FAMILY_RGB:
        if rgb_euclid(rgb, tgt) <= DELTA_RGB_LIMIT:
            return 'green'
    for tgt in SAND_FAMILY_RGB:
        if rgb_euclid(rgb, tgt) <= DELTA_RGB_LIMIT:
            return 'sand'
    for tgt in BG_FAMILY_RGB:
        if rgb_euclid(rgb, tgt) <= DELTA_RGB_LIMIT:
            return 'bg'
    return 'edge'


def audit(image_path: str) -> dict:
    """Open the image read-only and emit the audit report dict."""
    img = Image.open(image_path).convert('RGB')
    W, H = img.size
    px = img.load()

    stride = 10
    sampled_rgb: list[tuple[int, int, int]] = []
    classifications: list[str] = []
    xs: list[int] = []
    ys: list[int] = []
    for y in range(0, H, stride):
        for x in range(0, W, stride):
            rgb = px[x, y]
            sampled_rgb.append(rgb)
            classifications.append(classify(rgb))
            xs.append(x)
            ys.append(y)

    n_total = len(sampled_rgb)
    counts = {'green': 0, 'sand': 0, 'bg': 0, 'edge': 0}
    for c in classifications:
        counts[c] += 1
    pcts = {k: round(100 * v / n_total, 2) for k, v in counts.items()}

    # 3 x 3 grid (rows: top/mid/bottom; cols: left/center/right).
    row_bounds = [(0, H / 3), (H / 3, 2 * H / 3), (2 * H / 3, H)]
    col_bounds = [(0, W / 3), (W / 3, 2 * W / 3), (2 * W / 3, W)]
    row_names = ('top', 'mid', 'bottom')
    col_names = ('left', 'center', 'right')
    grid: dict[str, dict[str, float]] = {}
    for ri, (y0, y1) in enumerate(row_bounds):
        for ci, (x0, x1) in enumerate(col_bounds):
            cell_counts = {'green': 0, 'sand': 0, 'bg': 0, 'edge': 0, 'total': 0}
            for x, y, c in zip(xs, ys, classifications):
                if x0 <= x < x1 and y0 <= y < y1:
                    cell_counts[c] += 1
                    cell_counts['total'] += 1
            cell_pcts = {
                k: round(100 * v / max(cell_counts['total'], 1), 2)
                for k, v in cell_counts.items()
                if k != 'total'
            }
            cell_name = f'{row_names[ri]}_{col_names[ci]}'
            grid[cell_name] = cell_pcts

    # Right-edge bleed detection (steward-annotated red circle).
    # Heuristic: the rightmost 5% X slice should NOT be dominated by
    # the page background colour (cream / sand-bleached). When it is,
    # an unmasked photo / placeholder is bleeding past the content.
    # Q2 (nit) fix: snap slice start to the stride grid so the slice
    # is bit-deterministic across viewport widths.
    right_edge_x_start = ((W * 95 // 100) // stride) * stride
    edge_xs = [x for x in xs if x >= right_edge_x_start]
    if edge_xs:
        edge_classifications = [
            classifications[i] for i, x in enumerate(xs) if x >= right_edge_x_start
        ]
        n_edge = len(edge_classifications)
        bg_pct = round(
            100 * sum(1 for c in edge_classifications if c == 'bg') / n_edge, 2
        )
        green_pct = round(
            100 * sum(1 for c in edge_classifications if c == 'green') / n_edge, 2
        )
        bleed_detected = bool(bg_pct >= 60 and green_pct <= 25)
    else:
        n_edge = 0
        bg_pct = 0.0
        green_pct = 0.0
        bleed_detected = False

    fingerprint = hashlib.sha256(
        '\n'.join(f'{r[0]},{r[1]},{r[2]}' for r in sampled_rgb).encode('utf-8')
    ).hexdigest()

    # CI gate.
    reasons: list[str] = []
    if pcts['sand'] >= SAND_PCT_GATE:
        reasons.append(
            f'sand_pct={pcts["sand"]}% reaches gate ≥'
            f'{SAND_PCT_GATE}% (steward-annotated blue-circle regression)'
        )
    if bleed_detected and BLEED_GATE:
        reasons.append(
            'mask_bleed_detected=true in rightmost 5% X slice '
            '(steward-annotated red-circle regression: photo bleeds '
            'past content boundary)'
        )
    ci_pass = len(reasons) == 0

    report = {
        'image': image_path,
        'image_size': [W, H],
        'stride': stride,
        'total_pixels_sampled': n_total,
        'sample_fingerprint_sha256': fingerprint,
        'global_coverage_pct': pcts,
        'grid_3x3_pct': grid,
        'right_edge_5pct': {
            'n_sampled': n_edge,
            'bg_pct': bg_pct,
            'green_pct': green_pct,
            'mask_bleed_detected': bleed_detected,
        },
        'ci_gate': {
            'pass': ci_pass,
            'reasons': reasons,
            'thresholds': {'sand_pct_max': SAND_PCT_GATE, 'bleed_must_be_false': BLEED_GATE},
        },
        'method': {
            'metric': 'rgb_euclidean',
            'tolerance_delta_rgb': DELTA_RGB_LIMIT,
            'edge_policy': 'mutually_exclusive_unbinned',
            'spatial_grid': '3x3_thirds',
            'bleed_threshold': 'bg_pct>=60 AND green_pct<=25 in rightmost 5% X slice',
            'known_risks': [
                '--ll-sun-deep is approximately Delta_E_RGB 38 from '
                '--ll-sand -- safely above the 30 threshold today, but '
                'a more saturated render of hero sky could produce '
                'minor sand false-positives in the top row.',
                'D-0014 grass derivatives (--ll-grass, --ll-grass-mow, '
                '--ll-grass-deep) are anchored at the linear-RGB '
                'midpoint approximation of the oklab color-mix; the '
                'browser may render them with sub-Delta_E_RGB 5 '
                'deviation, which is still inside the 30 tolerance.',
            ],
        },
        'token_anchors': {
            'GREEN_FAMILY': ['#1f4e2c', '#2a6638', '#2d5a3d', '#6b9b7e', '#457455', '#295638', '#295637'],
            'SAND_FAMILY': ['#d4a574', '#b5651d'],
            'BG_FAMILY': ['#faf6f0', '#f4e8d0'],
        },
        'version': 'v2',
    }
    return report


def main(argv: tuple[str, ...]) -> int:
    if len(argv) != 2:
        print(
            'usage: python 2026-07-17-hero-palette-coverage-audit.py <hero-png>',
            file=sys.stderr,
        )
        return 2
    report = audit(argv[1])
    json.dump(report, sys.stdout, indent=2)
    sys.stdout.write('\n')
    return 0 if report['ci_gate']['pass'] else 1


if __name__ == '__main__':
    raise SystemExit(main(tuple(sys.argv)))
