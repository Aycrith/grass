#!/usr/bin/env python3
"""
Build a PDF version of the GRASS v3.0 investor-grade business plan.

Output: output/procurement/business_plan_grass_v3.0.pdf

Uses Playwright (chromium) to print the Gmail-safe HTML to PDF, matching the
pattern in scripts/build_condensed_business_plan_pdf.py.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "output" / "procurement" / "business_plan_grass_v3.0.html"
PDF = ROOT / "output" / "procurement" / "business_plan_grass_v3.0.pdf"


def build() -> int:
    if not HTML.exists():
        print(f"ERROR: {HTML} not found. Run scripts/build_business_plan_v3.py first.", file=sys.stderr)
        return 1
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("ERROR: playwright not installed. Install with: pip install playwright && playwright install chromium", file=sys.stderr)
        return 2

    url = "file:///" + str(HTML.resolve()).replace("\\", "/")
    print(f"[build] printing {HTML.name} -> {PDF.name} ...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url)
        page.wait_for_load_state("networkidle")
        page.pdf(
            path=str(PDF),
            format="Letter",
            margin={"top": "0.5in", "right": "0.5in", "bottom": "0.5in", "left": "0.5in"},
            print_background=True,
            prefer_css_page_size=False,
        )
        browser.close()

    size_kb = PDF.stat().st_size / 1024
    print(f"[ok] wrote {PDF} ({size_kb:.1f} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(build())
