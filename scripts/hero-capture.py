"""hero-capture.py — Playwright-based visual capture for the hero.

CONTEXT
=======
The landing-page hero is a 3-scene scroll-pinned composition that
takes 350svh to play out. A single screenshot at the top of the
page captures only Scene 1. To verify the full composition, you
need captures at multiple scroll positions AND multiple viewports.

This script:
  1. Launches headless Chromium via Playwright
  2. Navigates to the dev server (default http://localhost:3000)
  3. Captures the hero at 3 viewports x 3 scroll positions = 9 PNGs
  4. Saves them to tmp/hero-captures/ with a timestamped subfolder

USAGE
=====
    python scripts/hero-capture.py                         # default 3 viewports x 3 positions
    python scripts/hero-capture.py --url http://localhost:3001
    python scripts/hero-capture.py --viewports 1920x800   # single viewport
    python scripts/hero-capture.py --positions 0,0.4,0.7  # custom scroll positions
    python scripts/hero-capture.py --out tmp/baselines/2026-08-01
    python scripts/hero-capture.py --wait 5                # wait 5s after page load

PREREQ
======
- Playwright + Chromium installed (verified: scripts/palette-validate.py
  prep section)
- The dev server running at --url (the script does NOT start the dev
  server — it expects you to run `bun dev` in another terminal)
"""
import argparse
import sys
import time
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print(
        "ERROR: Playwright is required. Install with: pip install playwright\n"
        "       Then run: playwright install chromium",
        file=sys.stderr,
    )
    sys.exit(2)


# Default capture set: 3 viewports x 3 scroll positions = 9 PNGs.
# Viewports: desktop / tablet / mobile.
# Positions: 0.00 (Scene 1 resting), 0.30 (transition), 0.70 (Scene 2 resting).
DEFAULT_VIEWPORTS = [
    ("desktop", 1920, 800),
    ("tablet",  768, 1024),
    ("mobile",  375, 667),
]
DEFAULT_POSITIONS = [0.0, 0.30, 0.70]
# The list separator is `;` (not `,`) because each viewport spec
# already uses a comma between name and dims. Using `,` for both
# would force the user to escape one of them.
VIEWPORT_SEP = ";"


def parse_viewport(s: str) -> tuple[str, int, int]:
    """Parse 'name,WxH' or 'WxH' into (name, width, height)."""
    if "," in s:
        name, dims = s.split(",", 1)
    else:
        # No name provided; fall back to the literal dims as the name
        # so the output filename is still informative (e.g. "1920x800-pos0.00.png").
        name, dims = s, s
    if "x" not in dims:
        raise ValueError(
            f"viewport dims must be WxH (got {dims!r}); use comma between name and dims, e.g. 'desktop,1920x800'"
        )
    w, h = dims.split("x", 1)
    return (name.strip(), int(w), int(h))


def parse_positions(s: str) -> list[float]:
    """Parse '0,0.4,0.7' into [0.0, 0.4, 0.7]."""
    return [float(p) for p in s.split(",")]


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__.split("\n\n")[0],
    )
    parser.add_argument(
        "--url",
        default="http://localhost:3000",
        help="URL to capture (default: http://localhost:3000)",
    )
    parser.add_argument(
        "--viewports",
        default=VIEWPORT_SEP.join(f"{n},{w}x{h}" for n, w, h in DEFAULT_VIEWPORTS),
        help=(
            f"Semicolon-separated list of viewports as 'name,WxH' "
            f"(default: desktop,1920x800;tablet,768x1024;mobile,375x667)"
        ),
    )
    parser.add_argument(
        "--positions",
        default=",".join(str(p) for p in DEFAULT_POSITIONS),
        help=(
            "Comma-separated list of scroll positions in 0..1 "
            "(default: 0.0,0.30,0.70)"
        ),
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=None,
        help=(
            "Output directory (default: tmp/hero-captures/<timestamp>). "
            "Created if it doesn't exist."
        ),
    )
    parser.add_argument(
        "--wait",
        type=float,
        default=2.0,
        help="Seconds to wait after page load before first capture (default: 2.0)",
    )
    parser.add_argument(
        "--selector",
        default="section#hero",
        help="CSS selector for the hero element (default: 'section#hero')",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the planned captures without running Playwright",
    )
    args = parser.parse_args()

    viewports = [parse_viewport(v) for v in args.viewports.split(VIEWPORT_SEP) if v]
    positions = parse_positions(args.positions)

    if args.out is None:
        ts = time.strftime("%Y-%m-%d-%H%M%S")
        out_dir = Path("tmp/hero-captures") / ts
    else:
        out_dir = args.out

    print(f"URL:       {args.url}")
    print(f"Selector:  {args.selector}")
    print(f"Viewports: {len(viewports)}")
    for name, w, h in viewports:
        print(f"  - {name}: {w}x{h}")
    print(f"Positions: {positions}")
    print(f"Output:    {out_dir}")
    print(f"Wait:      {args.wait}s after page load")

    if args.dry_run:
        total = len(viewports) * len(positions)
        print(f"\n[dry-run] would capture {total} screenshots")
        return 0

    out_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            for name, w, h in viewports:
                print(f"\n=== {name} ({w}x{h}) ===")
                context = browser.new_context(
                    viewport={"width": w, "height": h},
                    device_scale_factor=1,
                )
                page = context.new_page()
                print(f"  navigate to {args.url}")
                page.goto(args.url, wait_until="networkidle")
                print(f"  wait {args.wait}s for hero to settle")
                time.sleep(args.wait)

                # Locate the hero element. Bail with a clear error
                # if it's not present (the page is not on the right
                # route, or the dev server is serving a different
                # page).
                hero = page.locator(args.selector).first
                if hero.count() == 0:
                    print(
                        f"  ERROR: no element matched {args.selector!r}.",
                        file=sys.stderr,
                    )
                    context.close()
                    continue

                for pos in positions:
                    # Scroll the page so the hero's scroll progress
                    # is `pos`. The hero section is 350svh tall, so
                    # `pos` maps to `pos * (350svh - 100svh)` of
                    # scroll, i.e. the hero's internal progress.
                    # We use page.evaluate to get the hero's
                    # bounding box and scroll proportionally.
                    box = hero.bounding_box()
                    if box is None:
                        print(f"  WARN: no bounding box for {args.selector}", file=sys.stderr)
                        scroll_y = 0
                    else:
                        # The hero is 350svh tall. Scroll so that
                        # pos*350svh of the hero is above the
                        # viewport top.
                        scroll_y = int(pos * (box["height"] - h))
                    page.evaluate(f"window.scrollTo(0, {scroll_y})")
                    # Small settle delay so the scroll-driven
                    # MotionValues have time to update before the
                    # screenshot.
                    time.sleep(0.4)

                    out_path = out_dir / f"{name}-pos{pos:.2f}.png"
                    print(f"  capture @ pos={pos:.2f} -> {out_path.name}")
                    hero.screenshot(path=str(out_path))

                context.close()
        finally:
            browser.close()

    print(f"\nDone. {len(viewports) * len(positions)} captures in {out_dir}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
