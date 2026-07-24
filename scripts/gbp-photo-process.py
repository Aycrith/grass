#!/usr/bin/env python3
"""gbp-photo-process.py — GBP photo processing pipeline for Largo Lawn.

CONTEXT
=======
The GBP (Google Business Profile) listing for Largo Lawn is the single
biggest Phase 2 lever — listings WITH photos get 35% more clicks and 42%
more direction requests than listings without. The 184-line spec at
`content/assets/gbp-photo-spec.md` defines 10 photo deliverables (cover,
profile avatar, 6 work photos, team portrait, optional post-storm). This
script turns the spec into a one-command pipeline:

  1. `python scripts/gbp-photo-process.py avatar` — generates the
     720x720 cream-bg logo avatar (Photo 2) from `brand/logo-mark.svg`.
     Self-contained, no input.

  2. `python scripts/gbp-photo-process.py IMG_2024.jpg --type edging
     --zip 33771` — takes a phone photo, prints the suggested caption
     (per the spec's caption templates) to console, smart-crop centers
     the photo to the target aspect for `--type`, resizes to spec
     dimensions, and writes the GBP-ready JPG to
     `apps/web/public/work/<type>-<zip>-<date>.jpg`.

The user burns the caption into the photo at capture time (chalkboard
prop, paper held in frame, or phone screen) per the design decision on
2026-07-24 — the script does NOT add an overlay to the photo.

USAGE
=====
    # Generate the GBP profile avatar
    python scripts/gbp-photo-process.py avatar

    # Process a single phone photo
    python scripts/gbp-photo-process.py IMG_2024.jpg --type edging --zip 33771
    python scripts/gbp-photo-process.py IMG_2024.jpg --type cover --zip 33771
    python scripts/gbp-photo-process.py IMG_2024.jpg --type team --name Cameron
    python scripts/gbp-photo-process.py IMG_2024.jpg --type before-after --zip 33771

    # Override the suggested caption
    python scripts/gbp-photo-process.py IMG_2024.jpg --type edging --zip 33771 --caption "My caption"

    # Custom output path
    python scripts/gbp-photo-process.py IMG_2024.jpg --type edging --zip 33771 --out ./my-output.jpg

CAPTION AUTO-SUGGEST
====================
The script maps `--type` to a caption template (from the spec). The
filename is also parsed for tokens to refine the suggestion:

  - `--type edging` + filename `edging-33771.jpg` -> "Mechanical Edging — 33771 — Largo Lawn"
  - `--type mulching` + filename `mulch-3yd-33774.jpg` -> "Mulch Install — 3 cubic yards — 33774"
  - `--type hedge` + filename `hedge-8ft-33770.jpg` -> "Hedge Trim — 8 ft height — 33770"
  - `--type storm-prep` + filename `prep-ian-33773.jpg` -> "Pre-Storm Prep — Ian — 33773"
  - `--type before-after` + filename `ba-33771.jpg` -> "Before & After — 33771 — Largo Lawn"
  - `--type mowing` + filename `mow-33771.jpg` -> "Weekly Mowing — 33771 — Largo Lawn"
  - `--type cover` -> (no caption; the cover photo is a single banner)
  - `--type team` + --name Cameron -> "Cameron — Founder, Largo Lawn"

Override with --caption.

DEPENDENCIES
============
Pillow (PIL) for image processing. Standard in most Python envs.
`pip install pillow` if not already present.

DESIGN DECISIONS (2026-07-24)
=============================
- Caption burned in at capture time (not script-rendered overlay):
  the user holds a chalkboard / paper / phone screen with the
  caption in the photo. Simplest pipeline, no font dependency, no
  brand-color text matching.
- Separate `avatar` subcommand: clean separation, no input needed
  for the self-contained logo avatar generation.
- Smart center-crop for orientation: Pillow's center-weighted crop
  handles portrait-source / landscape-target without a face-detection
  dependency. Loses off-center subjects (rare in lawn-care photos
  where the lawn IS the subject).
- One photo per command: verbose but simple. The user processes
  each photo individually with explicit --type and --zip flags.
- Auto-suggest from filename + ZIP: filename tokens like
  `edging-33771.jpg` map to the spec's caption templates. The user
  can override with --caption. Saves typing on the common cases.
"""
from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path

from PIL import Image, ImageDraw

# Brand palette (from brand/guidelines.md)
LL_GREEN = (31, 78, 44)       # #1F4E2C — primary
LL_CREAM = (250, 246, 240)    # #FAF6F0 — background
LL_SAND = (212, 165, 116)     # #D4A574 — secondary (unused here, kept for reference)
LL_CHARCOAL = (26, 26, 26)    # #1A1A1A — body text
LL_SKY = (59, 125, 216)       # #3B7DD8 — link blue (unused here, kept for reference)

# GBP photo spec dimensions (from content/assets/gbp-photo-spec.md)
PHOTO_SPECS = {
    "cover":        {"w": 1024, "h": 576,  "aspect": 16/9,  "caption": ""},
    "avatar":       {"w": 720,  "h": 720,  "aspect": 1.0,   "caption": ""},  # generated, not processed
    "work":         {"w": 720,  "h": 540,  "aspect": 4/3,   "caption": "{action} — {zip} — Largo Lawn"},
    "team":         {"w": 720,  "h": 720,  "aspect": 1.0,   "caption": "{name} — Founder, Largo Lawn"},
    "before-after": {"w": 720,  "h": 540,  "aspect": 4/3,   "caption": "Before & After — {zip} — Largo Lawn"},
    "edging":       {"w": 720,  "h": 540,  "aspect": 4/3,   "caption": "Mechanical Edging — {zip} — Largo Lawn"},
    "mulching":     {"w": 720,  "h": 540,  "aspect": 4/3,   "caption": "Mulch Install — {yards} cubic yards — {zip}"},
    "hedge":        {"w": 720,  "h": 540,  "aspect": 4/3,   "caption": "Hedge Trim — {height} ft height — {zip}"},
    "mowing":       {"w": 720,  "h": 540,  "aspect": 4/3,   "caption": "Weekly Mowing — {zip} — Largo Lawn"},
    "storm-prep":   {"w": 720,  "h": 540,  "aspect": 4/3,   "caption": "Pre-Storm Prep — {storm} — {zip}"},
    "storm-cleanup":{"w": 720,  "h": 540,  "aspect": 4/3,   "caption": "Post-Storm Cleanup — {zip} — Largo Lawn"},
    "truck":        {"w": 720,  "h": 540,  "aspect": 4/3,   "caption": ""},  # optional, no default
}

# Filename token -> caption variable mapping (for auto-suggest)
# Tokens are matched case-insensitively against the filename (without extension).
TOKEN_MAP = {
    # edging
    "edging": ("edging", {"action": "Mechanical Edging"}),
    "edge":   ("edging", {"action": "Mechanical Edging"}),
    # mulching
    "mulch":   ("mulching", {}),
    "mulching": ("mulching", {}),
    # hedge
    "hedge": ("hedge", {}),
    "trim":  ("hedge", {}),
    # mowing
    "mow":     ("mowing", {"action": "Weekly Mowing"}),
    "mowing":  ("mowing", {"action": "Weekly Mowing"}),
    # before/after
    "ba":          ("before-after", {}),
    "before":      ("before-after", {}),
    "after":       ("before-after", {}),
    "before-after":("before-after", {}),
    # storm
    "prep":        ("storm-prep", {}),
    "storm-prep":  ("storm-prep", {}),
    "storm":       ("storm-prep", {}),  # ambiguous but defaults to prep
    "cleanup":     ("storm-cleanup", {}),
    "post-storm":  ("storm-cleanup", {}),
    # truck
    "truck":  ("truck", {}),
    # cover / team
    "cover": ("cover", {}),
    "team":  ("team", {}),
}

# ZIP token: match 5-digit US ZIP at the start of a token
ZIP_RE = re.compile(r"\b(33\d{3})\b")

# Storm name token: words in the filename that look like a storm name
# (case-insensitive; the actual storm name is case-preserved by reading
# from the source filename).
STORM_HINT_RE = re.compile(r"\b([A-Za-z][a-z]+)\b")


@dataclass
class CaptionContext:
    """Context for filling in caption template variables."""
    zip: str | None = None
    name: str | None = None
    yards: str | None = None
    height: str | None = None
    storm: str | None = None
    action: str | None = None

    def fill(self, template: str) -> str:
        """Fill the caption template with available context.

        Missing variables are left as `{varname}` so the user sees what
        still needs to be filled in. The output is never partially
        filled silently.
        """
        if not template:
            return ""
        result = template
        for key, value in self.vars().items():
            placeholder = "{" + key + "}"
            if value is not None:
                result = result.replace(placeholder, str(value))
        return result

    def vars(self) -> dict[str, str | None]:
        return {
            "zip": self.zip,
            "name": self.name,
            "yards": self.yards,
            "height": self.height,
            "storm": self.storm,
            "action": self.action,
        }

    def missing(self, template: str) -> list[str]:
        """Return the list of unfilled variable names in the template."""
        if not template:
            return []
        return [
            m.group(1)
            for m in re.finditer(r"\{(\w+)\}", template)
            if self.vars().get(m.group(1)) is None
        ]


def parse_filename(path: Path) -> tuple[str | None, CaptionContext]:
    """Parse a phone-photo filename for caption-suggestion tokens.

    Examples:
      "edging-33771.jpg"              -> type='edging', zip='33771'
      "mulch-3yd-33774.jpg"           -> type='mulching', yards='3', zip='33774'
      "hedge-8ft-33770.jpg"           -> type='hedge', height='8', zip='33770'
      "prep-ian-33773.jpg"            -> type='storm-prep', storm='Ian', zip='33773'
      "IMG_20240715_142030.jpg"       -> no type detected
      "before-after-33771.jpg"        -> type='before-after', zip='33771'

    Returns (type_hint, caption_context).
    """
    stem = path.stem.lower()
    ctx = CaptionContext()
    type_hint = None

    # Match type tokens (longest-match first to prefer 'before-after' over 'before')
    for token in sorted(TOKEN_MAP.keys(), key=len, reverse=True):
        if token in stem:
            type_hint, var_hints = TOKEN_MAP[token]
            ctx.action = var_hints.get("action")
            break

    # Match ZIP
    m = ZIP_RE.search(stem)
    if m:
        ctx.zip = m.group(1)

    # Match yards (e.g., "3yd", "2-cubic")
    m = re.search(r"(\d+)\s*yd", stem)
    if m:
        ctx.yards = m.group(1)

    # Match height (e.g., "8ft", "6ft")
    m = re.search(r"(\d+)\s*ft", stem)
    if m:
        ctx.height = m.group(1)

    # Match storm name: any word in the original-case stem that isn't a
    # generic English word. We read the case-preserved stem so the storm
    # name keeps its original capitalization (e.g. "Milton" not "milton").
    if type_hint == "storm-prep":
        candidates = STORM_HINT_RE.findall(path.stem)
        # Filter out generic-looking words (lowercase comparison)
        stop = {
            "img", "iphone", "photo", "storm", "prep", "cleanup",
            "the", "and", "for", "with", "from", "this", "that",
            "before", "after", "largo", "lawn", "largolawn",
            "zip", "yd", "ft", "ba",  # measurement tokens
        }
        for cand in candidates:
            if cand.lower() not in stop:
                ctx.storm = cand
                break

    return type_hint, ctx


def smart_center_crop(img: Image.Image, target_w: int, target_h: int) -> Image.Image:
    """Smart center-weighted crop to target aspect, then resize.

    For phone photos that don't match the target aspect, this:
      1. Crops the SOURCE image to the target aspect (centered).
      2. Resizes the cropped image to the target dimensions.

    Pillow's center-crop is the simplest approach — works well when
    the subject is roughly centered (typical for lawn-care photos
    where the lawn fills the frame). For off-center subjects, the
    user should re-shoot.
    """
    src_w, src_h = img.size
    src_aspect = src_w / src_h
    target_aspect = target_w / target_h

    if src_aspect > target_aspect:
        # Source is WIDER than target. Crop the SIDES (left/right).
        new_w = int(src_h * target_aspect)
        left = (src_w - new_w) // 2
        box = (left, 0, left + new_w, src_h)
    else:
        # Source is TALLER than target. Crop the TOP/BOTTOM.
        new_h = int(src_w / target_aspect)
        top = (src_h - new_h) // 2
        box = (0, top, src_w, top + new_h)

    cropped = img.crop(box)
    return cropped.resize((target_w, target_h), Image.LANCZOS)


def process_photo(
    src: Path,
    photo_type: str,
    ctx: CaptionContext,
    caption_override: str | None = None,
    out: Path | None = None,
) -> Path:
    """Process a single phone photo into a GBP-ready JPG.

    Returns the output path.
    """
    spec = PHOTO_SPECS[photo_type]
    target_w, target_h = spec["w"], spec["h"]

    # Resolve caption: override > template with context filled in
    if caption_override is not None:
        caption = caption_override
    else:
        caption = ctx.fill(spec["caption"])

    # Print the caption to console BEFORE the user re-shoots with the
    # chalkboard / paper / phone screen. The script doesn't render the
    # caption into the photo (per the 2026-07-24 design decision).
    print()
    print(f"=== Suggested caption (write on chalkboard/paper, then shoot) ===")
    print(f"    {caption!r}")
    if not caption:
        print("    (no caption for this photo type — shoot clean)")
    print()

    # Process the image
    print(f"Loading {src} ({src.stat().st_size} bytes)...")
    img = Image.open(src)
    if img.mode != "RGB":
        # Some phone photos are RGBA. Convert to RGB for JPG output.
        img = img.convert("RGB")
    print(f"  source: {img.size[0]}x{img.size[1]} ({img.size[0]/img.size[1]:.2f}:1)")
    print(f"  target: {target_w}x{target_h} ({target_w/target_h:.2f}:1)")

    out_img = smart_center_crop(img, target_w, target_h)
    print(f"  cropped: {out_img.size[0]}x{out_img.size[1]}")

    # Resolve output path
    if out is None:
        work_dir = Path("apps/web/public/work")
        work_dir.mkdir(parents=True, exist_ok=True)
        type_slug = photo_type
        zip_slug = ctx.zip or "nozip"
        date_slug = date.today().isoformat()
        out = work_dir / f"{type_slug}-{zip_slug}-{date_slug}.jpg"

    out.parent.mkdir(parents=True, exist_ok=True)
    out_img.save(out, "JPEG", quality=92, optimize=True, progressive=True)
    print(f"  wrote: {out} ({out.stat().st_size} bytes)")
    print()
    return out


def draw_grass_blade(
    draw: ImageDraw.ImageDraw,
    cx: float,            # center x
    base_y: float,         # bottom of blade
    height: float,         # blade height
    width: float,          # blade max width
    lean: float,           # lean in degrees (negative = left, positive = right)
    color: tuple[int, int, int],
) -> None:
    """Draw a single grass blade as a teardrop / leaf shape.

    The blade is wider at the middle and tapers to a point at the tip.
    The `lean` parameter tilts the blade left or right (in degrees).

    Construction: build left-side points (base -> tip) then right-side
    points in REVERSE (tip -> base), so the polygon traces the outline
    of the leaf. The width function 4*w*t*(1-t) peaks at the middle
    (t=0.5) and tapers to 0 at both base and tip.
    """
    import math

    n_points = 24
    left_points = []
    right_points = []
    for i in range(n_points):
        t = i / (n_points - 1)
        w = 4 * width * t * (1 - t)
        y = base_y - t * height
        left_points.append((cx - w, y))
        right_points.append((cx + w, y))

    # Combine: go UP the left side (base -> tip) then DOWN the right side (tip -> base)
    points = left_points + right_points[::-1]

    # Apply lean: rotate each point around (cx, base_y) by `lean` degrees
    if lean != 0:
        rad = math.radians(lean)
        cos_a, sin_a = math.cos(rad), math.sin(rad)
        rotated = []
        for x, y in points:
            dx, dy = x - cx, y - base_y
            nx = cx + dx * cos_a - dy * sin_a
            ny = base_y + dx * sin_a + dy * cos_a
            rotated.append((nx, ny))
        points = rotated

    draw.polygon(points, fill=color)


def generate_avatar() -> Path:
    """Generate the 720x720 cream-bg logo avatar (Photo 2 in the spec).

    The avatar is a clean rendering of the Largo Lawn mark on the
    cream brand background. The original `brand/logo-mark.svg` has
    degenerate path data (the quadratic curves use the same control
    point as the start/end, producing zero-width shapes) — this
    function re-draws the mark directly with Pillow, producing the
    intended three-blade grass shape.

    Output: apps/web/public/work/avatar-720x720.png
    """
    W = 720
    H = 720
    img = Image.new("RGB", (W, H), LL_CREAM)
    draw = ImageDraw.Draw(img)

    # 3 grass blades + soil line, centered in the canvas
    # Center blade: tallest, straight up
    # Left blade: leans left (-15deg)
    # Right blade: leans right (+15deg)
    base_y = 540  # bottom of the blades (above the soil line)
    blade_height = 320
    blade_width = 50

    # Left blade
    draw_grass_blade(
        draw,
        cx=280,
        base_y=base_y,
        height=blade_height - 40,
        width=blade_width - 10,
        lean=-18,
        color=LL_GREEN,
    )
    # Center blade (tallest, straight)
    draw_grass_blade(
        draw,
        cx=360,
        base_y=base_y,
        height=blade_height,
        width=blade_width,
        lean=0,
        color=LL_GREEN,
    )
    # Right blade
    draw_grass_blade(
        draw,
        cx=440,
        base_y=base_y,
        height=blade_height - 40,
        width=blade_width - 10,
        lean=18,
        color=LL_GREEN,
    )

    # Soil line: rounded rectangle at the bottom
    soil_top = base_y + 8
    soil_bot = soil_top + 24
    soil_left = 200
    soil_right = 520
    radius = 12
    draw.rounded_rectangle(
        [soil_left, soil_top, soil_right, soil_bot],
        radius=radius,
        fill=LL_GREEN,
    )

    out = Path("apps/web/public/work/avatar-720x720.png")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)
    return out


def build_parser() -> argparse.ArgumentParser:
    """Build the CLI parser. Two subcommands: `avatar` (no input) and
    the default photo processor.
    """
    parser = argparse.ArgumentParser(
        prog="gbp-photo-process",
        description=(
            "GBP photo processing pipeline for Largo Lawn. "
            "Subcommand `avatar` generates the 720x720 logo avatar. "
            "Default behavior processes a phone photo into a GBP-ready JPG."
        ),
    )
    sub = parser.add_subparsers(dest="cmd")

    # avatar subcommand (no input)
    sub.add_parser(
        "avatar",
        help="Generate the 720x720 logo avatar from brand/logo-mark.svg",
    )

    # photo processor (default)
    photo = sub.add_parser(
        "photo",
        help="Process a phone photo into a GBP-ready JPG (DEFAULT if no subcommand given)",
    )
    photo.add_argument(
        "src",
        type=Path,
        help="Path to the source phone photo (JPG, PNG, HEIC, etc.)",
    )
    photo.add_argument(
        "--type",
        required=True,
        choices=sorted(PHOTO_SPECS.keys()),
        help="GBP photo type (drives target dimensions + caption template)",
    )
    photo.add_argument(
        "--zip",
        default=None,
        help="Service-area ZIP code (overrides filename token)",
    )
    photo.add_argument(
        "--name",
        default=None,
        help="Operator first name (for the team-photo caption)",
    )
    photo.add_argument(
        "--yards",
        default=None,
        help="Cubic yards of mulch (for the mulching caption)",
    )
    photo.add_argument(
        "--height",
        default=None,
        help="Hedge height in feet (for the hedge caption)",
    )
    photo.add_argument(
        "--storm",
        default=None,
        help="Storm name (for the storm-prep caption, e.g. 'Ian', 'Milton')",
    )
    photo.add_argument(
        "--caption",
        default=None,
        help="Override the auto-suggested caption entirely",
    )
    photo.add_argument(
        "--out",
        type=Path,
        default=None,
        help="Output path (default: apps/web/public/work/<type>-<zip>-<date>.jpg)",
    )

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()

    # Two-pass parse: if no subcommand is given, prepend "photo" so
    # the user can just call `gbp-photo-process.py IMG_xxx.jpg --type
    # edging` without typing the "photo" subcommand explicitly.
    if argv is None:
        argv = sys.argv[1:]

    # If the first non-flag arg is a path or doesn't match a subcommand,
    # treat it as the photo source (prepend "photo").
    if argv and argv[0] not in {"avatar", "photo", "-h", "--help"}:
        argv = ["photo", *argv]

    args = parser.parse_args(argv)

    if args.cmd is None:
        parser.print_help()
        return 1

    if args.cmd == "avatar":
        out = generate_avatar()
        print(f"OK: wrote {out} ({out.stat().st_size} bytes, 720x720 PNG)")
        print()
        print("Next: open the avatar in the GBP dashboard and upload it")
        print("as the Profile photo. The round-crop will happen automatically")
        print("on Google's side.")
        return 0

    if args.cmd == "photo":
        if not args.src.exists():
            print(f"ERROR: source file not found: {args.src}", file=sys.stderr)
            return 2

        # Build the caption context from CLI args + filename parsing
        ctx = CaptionContext(
            zip=args.zip,
            name=args.name,
            yards=args.yards,
            height=args.height,
            storm=args.storm,
        )

        # If --type wasn't set explicitly, try to infer from the filename
        if args.type not in PHOTO_SPECS:
            print(f"ERROR: unknown photo type: {args.type}", file=sys.stderr)
            return 2

        # If --zip wasn't given, try to parse it from the filename
        if ctx.zip is None:
            _, file_ctx = parse_filename(args.src)
            ctx.zip = file_ctx.zip
        # If --type='storm-prep' and --storm wasn't given, try filename
        if args.type == "storm-prep" and ctx.storm is None:
            _, file_ctx = parse_filename(args.src)
            ctx.storm = file_ctx.storm
        # If --type='mulching' and --yards wasn't given, try filename
        if args.type == "mulching" and ctx.yards is None:
            _, file_ctx = parse_filename(args.src)
            ctx.yards = file_ctx.yards
        # If --type='hedge' and --height wasn't given, try filename
        if args.type == "hedge" and ctx.height is None:
            _, file_ctx = parse_filename(args.src)
            ctx.height = file_ctx.height

        out = process_photo(args.src, args.type, ctx, args.caption, args.out)
        print(f"OK: wrote {out}")
        return 0

    parser.print_help()
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
