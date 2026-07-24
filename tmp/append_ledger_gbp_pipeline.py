#!/usr/bin/env python3
"""Append the 2026-07-24 GBP photo pipeline changelog entry."""
from __future__ import annotations

import sys
from pathlib import Path

import yaml

LEDGER = Path("state/ledger.yaml")

NEW_ENTRY = '''  - id: 2026-07-24-gbp-photo-pipeline
    date: "2026-07-24"
    title: "GBP photo pipeline (script + avatar + shooting-day workflow)"
    summary: |
      Authored the operational side of the GBP photo spec
      (content/assets/gbp-photo-spec.md). The 184-line spec defined
      10 photo deliverables; this turn makes them shippable in
      20-30 minutes per yard visit instead of 90+ minutes of
      Canva work.

      Three artifacts:

        1. scripts/gbp-photo-process.py — two-subcommand CLI
           (avatar + photo). The avatar subcommand generates the
           720x720 cream-bg logo avatar (Photo 2) from
           brand/logo-mark.svg; the photo subcommand takes a
           phone photo, smart-crop centers it to the target
           aspect, resizes to spec dimensions, and writes the
           GBP-ready JPG to apps/web/public/work/.

        2. apps/web/public/work/avatar-720x720.png — the generated
           avatar. 3 grass blades + soil line in primary green
           on cream, 720x720, 3.7KB.

        3. content/assets/gbp-shooting-day-workflow.md — the
           on-the-yard workflow. 5-shot sequence (cover, before,
           after, edge detail, service-in-action) with filename
           conventions and CLI examples.

      Design decision: the user burns the caption into the photo
      at capture time (chalkboard / paper / phone screen prop)
      instead of having the script render an overlay. No font
      dependency, no brand-color matching, no accessibility
      penalty from text-on-image. Per the 5-question multi-choice
      on 2026-07-24.

      Cross-references:
        - D-0024 (Asset-level rule for geographic features — N/A
          here, the avatar is hand-drawn)
        - The 2026-07-24 visual-review-is-the-gate memory entry
          (the fern overlay was reverted for the same kind of
          "in-a-corner" visual incoherence — the avatar avoids
          that by being a centered mark on a clean background)
    by: "Mavis (orchestrator, 2026-07-24 13:30 EDT)"
    cross_project: false
    decision_basis: |
      1) GBP photos are the single biggest Phase 2 lever. Listings
         WITH photos get 35% more clicks and 42% more direction
         requests per the spec. Without photos, the GBP listing
         is invisible relative to competitors.

      2) The pre-existing spec (184 lines) defined the design
         contract but the operational workflow was missing. The
         user would have to do 30+ min of Canva work per photo,
         multiplied by ~7 work photos per month per the post-
         frequency rule. That's 3.5 hours/month of overhead on
         top of the actual lawn care work.

      3) The script turns the operational workflow into ~2 min
         of CLI per photo. The 3.5 hours/month drops to ~14
         minutes/month. Net savings: ~3.2 hours/month.

      4) Auto-suggest from filename + ZIP tokens (edging-33771.jpg
         -> "Mechanical Edging - 33771 - Largo Lawn") removes
         the typing overhead. The user can override with
         --caption when the filename doesn't match the spec.

      5) The avatar is the ONLY photo I can generate end-to-end
         without user input (no phone photos needed). Generating
         it now means it's ready to upload the moment the GBP
         dashboard is set up, which is one of the Day 16
         milestones.

      6) Alternative considered and rejected: USE CANVA
         AUTOMATION API. Rejected because (a) requires Canva
         account credentials, (b) requires API setup that's
         out of scope for the cash-min mode, (c) doesn't
         actually save time vs the script (Canva's auto-format
         is ~3 min per photo, script is ~5 sec per photo).
    alternatives_considered:
      - "Use Canva automation API: rejected (cash-min mode, no Canva API credentials, doesn't actually save time vs the script)"
      - "Use ImageMagick CLI + a shell script: rejected (less readable Python, no auto-suggest from filename)"
      - "Skip the script, document the workflow in Markdown only: rejected (still 30+ min of Canva work per photo)"
    references:
      - "content/assets/gbp-photo-spec.md (the design contract)"
      - "content/assets/gbp-shooting-day-workflow.md (the operational workflow)"
      - "brand/logo-mark.svg (the source for the avatar)"
      - "scripts/gbp-photo-process.py (the implementation)"
      - "apps/web/public/work/avatar-720x720.png (the avatar output)"
      - "Phase 2 exit criterion OBJ-M2-006: GBP profile + 25-citation build + 5 paid pilot jobs"
    verified:
      - "avatar subcommand: generates 720x720 PNG (3.7KB) successfully"
      - "photo subcommand: type=edging, cover, team, mulching, storm-prep all work"
      - "auto-suggest: filename tokens correctly extract type, zip, yards, height, storm name"
      - "smart-crop: 4:3 source -> 16:9 target crops sides, 1:1 target crops top/bottom"
'''


def main() -> int:
    raw = LEDGER.read_text(encoding="utf-8")
    if "2026-07-24-gbp-photo-pipeline" in raw:
        print("ERROR: entry id already present", file=sys.stderr)
        return 1
    new_content = raw + "\n" + NEW_ENTRY
    try:
        parsed = yaml.safe_load(new_content)
    except yaml.YAMLError as exc:
        print(f"ERROR: invalid YAML: {exc}", file=sys.stderr)
        return 1
    cl = parsed.get("changelog", [])
    if not cl or cl[-1].get("id") != "2026-07-24-gbp-photo-pipeline":
        print("ERROR: appended ledger does not end with the new entry", file=sys.stderr)
        return 1
    print(f"OK: ledger now has {len(cl)} entries")
    LEDGER.write_text(new_content, encoding="utf-8")
    print(f"OK: wrote {LEDGER} ({len(new_content)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
