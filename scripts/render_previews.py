#!/usr/bin/env python3
"""Render preview PNGs for the investor-AAA-package assets.

Outputs (under output/procurement/):
  - preview_cover_letter_v3.4.png     -> cover letter HTML
  - preview_summary_card_v3.4.png     -> summary card HTML
"""
from __future__ import annotations

from pathlib import Path
from playwright.sync_api import sync_playwright

PROC = Path(__file__).resolve().parent.parent / "output" / "procurement"

JOBS = [
    ("preview_cover_letter_v3.4.png", "business_plan_grass_v3.0_cover.html", 700, 900),
    ("preview_summary_card_v3.4.png", "business_plan_grass_summary_card_v3.4.html", 800, 1200),
]


def main() -> int:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for out_name, src_name, w, h in JOBS:
            src = PROC / src_name
            if not src.exists():
                print(f"[skip] missing: {src}")
                continue
            out_path = PROC / out_name
            page = browser.new_page(viewport={"width": w, "height": h})
            url = "file:///" + str(src.resolve()).replace("\\", "/")
            page.goto(url)
            page.wait_for_load_state("networkidle")
            page.screenshot(path=str(out_path), full_page=True)
            page.close()
            print(f"[ok] {out_name} ({out_path.stat().st_size} bytes, {w}x{h})")
        browser.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
