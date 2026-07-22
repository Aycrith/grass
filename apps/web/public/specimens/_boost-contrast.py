"""D-0059 rev4 — boost contrast on the 4 specimen SVGs.

The hand-authored sepia line-art specimens use very thin strokes
(0.25-0.5px on a 340x340 viewBox) that disappear at the rendered
display size (~300x300px on the page). This script doubles the
stroke widths and increases the fill opacities so the line art
reads as a deliberate pressed-herbarium illustration rather than
a faint wash.

Re-runnable; only changes stroke-width / fill-opacity values,
nothing structural.
"""
import re
from pathlib import Path

SPECIMEN_DIR = Path("apps/web/public/specimens")

# Stroke widths to bump: 0.18 -> 0.45, 0.25 -> 0.55, 0.3 -> 0.6, 0.4 -> 0.7, 0.5 -> 0.9, 0.6 -> 1.0, 0.7 -> 1.1
STROKE_BUMPS = [
    ('stroke-width="0.18"', 'stroke-width="0.45"'),
    ('stroke-width="0.25"', 'stroke-width="0.55"'),
    ('stroke-width="0.3"',  'stroke-width="0.6"'),
    ('stroke-width="0.4"',  'stroke-width="0.7"'),
    ('stroke-width="0.5"',  'stroke-width="0.9"'),
    ('stroke-width="0.6"',  'stroke-width="1.0"'),
    ('stroke-width="0.7"',  'stroke-width="1.1"'),
    ('stroke-width="2.2"',  'stroke-width="2.8"'),  # stolon lines
    ('stroke-width="0.8"',  'stroke-width="1.0"'),
]

# Fill opacities to bump
FILL_OPACITY_BUMPS = [
    ('fill-opacity="0.15"', 'fill-opacity="0.32"'),  # blade wash
    ('fill-opacity="0.18"', 'fill-opacity="0.35"'),  # sun core
    ('fill-opacity="0.6"',  'fill-opacity="0.75"'),  # seedhead outline
    ('fill-opacity="0.85"', 'fill-opacity="0.95"'),  # label tag
]

# Stroke opacities to bump (veining + structure)
STROKE_OPACITY_BUMPS = [
    ('opacity="0.55"', 'opacity="0.7"'),
    ('opacity="0.4"',  'opacity="0.55"'),
    ('opacity="0.35"', 'opacity="0.5"'),
    ('opacity="0.5"',  'opacity="0.65"'),
    ('opacity="0.6"',  'opacity="0.75"'),
    ('opacity="0.7"',  'opacity="0.85"'),
    ('opacity="0.85"', 'opacity="0.95"'),
    ('opacity="0.3"',  'opacity="0.45"'),
    ('opacity="0.4"',  'opacity="0.55"'),
]

for svg_path in SPECIMEN_DIR.glob("*.svg"):
    if svg_path.name.startswith("_"):
        continue
    text = svg_path.read_text(encoding="utf-8")
    original = text
    for old, new in STROKE_BUMPS + FILL_OPACITY_BUMPS + STROKE_OPACITY_BUMPS:
        text = text.replace(old, new)
    if text != original:
        svg_path.write_text(text, encoding="utf-8")
        print(f"boosted {svg_path.name}")
    else:
        print(f"no changes: {svg_path.name}")
