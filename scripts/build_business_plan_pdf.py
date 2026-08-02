#!/usr/bin/env python3
"""
Build a PDF version of the GRASS business plan.

The HTML plan renders beautifully in a browser but Gmail's HTML-attachment
preview has a long-standing bug (decodes the quoted-printable source as text
instead of handing off to the HTML viewer). PDFs always render correctly.

Output: output/procurement/business_plan_grass_mission1.pdf
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(r"C:\Users\camer\DEVNEW\GRASS")
HTML = ROOT / "output" / "procurement" / "business_plan_grass_mission1.html"
PDF = ROOT / "output" / "procurement" / "business_plan_grass_mission1.pdf"


def build() -> int:
    if not HTML.exists():
        print(f"ERROR: {HTML} not found. Run scripts/build_business_plan.py first.", file=sys.stderr)
        return 1
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("ERROR: playwright not installed. Run: bun add -d playwright (or pip install playwright)", file=sys.stderr)
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
