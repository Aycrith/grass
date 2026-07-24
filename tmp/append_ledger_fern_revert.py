#!/usr/bin/env python3
"""Append the 2026-07-24 fern-overlay revert governance note to state/ledger.yaml.

Same text-level append pattern as tmp/append_ledger_governance.py
(see that file for the design rationale — yaml.safe_dump was a
disaster, so we do a surgical text append that preserves the
file's existing comments, quoting, and indentation).

Run: python tmp/append_ledger_fern_revert.py
Verify: python -c "import yaml; yaml.safe_load(open('state/ledger.yaml'))"
"""
from __future__ import annotations

import sys
from pathlib import Path

import yaml

LEDGER = Path("state/ledger.yaml")

NEW_ENTRY = '''  - id: 2026-07-24-fern-overlay-revert
    date: "2026-07-24"
    title: "Revert: 5th painted plane (fern overlay above scene 2) — visual was incoherent"
    summary: |
      Reverts the fern-*.webp overlay above the painted scene 2
      (the "5th painted plane" introduced in D-0060 on 2026-07-23).
      The mount was technically clean — typecheck EXIT 0, lint
      EXIT 0, charter-compliance 3/3, build 85 routes prerender
      clean — but visually incoherent.

      The user reviewed the post-resolution capture in
      tmp/hero-captures/2026-07-23-post-qresolutions/desktop-pos0.70.png
      and identified the fern as "completely incoherent... like an
      image dropped in the top right hand corner... completely out
      of place... stupid looking." The 5-plane label is no longer
      accurate. The 4th cartoon plane (hand-drawn birdbath in the
      storybook foreground dead space) is RETAINED — it works as
      designed because cartoon stacks with cartoon (D-0049 rev 4)
      and the birdbath has a natural anchor in the storybook
      foreground.

      The fern-*.webp files stay on disk for potential future use
      in a different scene context.
    by: "Mavis (orchestrator, 2026-07-24 10:30 EDT)"
    cross_project: false
    decision_basis: |
      1) Visual review evidence: the post-resolution capture shows
         the fern as a clearly distinct object in the top-right
         corner of scene 2, with hard alpha edges visible (cream
         background of the source blending into scene 2 as a cream
         wash, fronds themselves barely visible). It reads as a
         pasted image, not as a "deep foreground detail" of the
         scene.

      2) Asset-level analysis: fern-01.webp is 1240x680 RGBA, but
         the alpha channel has the cream BACKGROUND opaque (~656k
         pixels) and only the fronds transparent. mix-blend-mode:
         multiply operates on the visible (opaque) pixels, so the
         cream background blends INTO scene 2 as a cream wash, and
         the fronds themselves are barely visible (transparent
         pixels are skipped entirely in multiply). The asset needs
         to be re-keyed (background transparent, fronds opaque) for
         any future use as an overlay.

      3) Anchor analysis: even if the asset were correctly keyed,
         the fern still has no natural anchor in scene 2 — it
         doesn't sit behind/in front of the palms, the ranch house,
         the lawn, etc. A multiply overlay on a free-floating
         object without a destination anchor will read as a pasted
         image regardless of blend mode.

      4) Quality-gate lesson: the fern overlay PASSED every
         automated gate (typecheck, lint, charter, build, 85
         routes) and was still visually wrong. A static-quality
         gate passing does not mean a visual asset is correct.
         Future plane additions should include a
         tmp/hero-captures/<date>-<plane>/ capture set + steward
         sign-off BEFORE the change is labeled "shipped".

      5) Alternative considered and rejected: KEEP the fern but
         make it smaller / add a fade mask / change blend mode.
         Rejected because (a) the asset is fundamentally not
         suited for the destination scene (no anchor, wrong alpha
         channel), (b) workarounds would be visual lipstick on a
         bad fit, (c) the cartoon birdbath already provides the
         "additional depth" the 5-plane architecture was trying
         to add.
    alternatives_considered:
      - "Re-key the fern asset + re-add overlay: rejected (still no destination anchor, workarounds compound the bad fit)"
      - "Keep fern at very small size / corner position: rejected (free-floating object without anchor still reads as pasted)"
      - "Replace fern with a different foreground asset: deferred (would need a new VEO call + scene context, not a quick fix)"
    lesson: |
      VISUAL REVIEW IS THE GATE THAT MATTERS FOR VISUAL ASSETS.

      The 5-plane iteration's "5th painted plane" passed every
      automated check but was visually incoherent. The author
      (Mavis) treated the open question as a simple "remove the
      fern mirror" code change and committed without scrutinizing
      the post-change capture. The user (Cameron) caught the
      issue in seconds on visual review.

      The lesson for future sessions:

        1. After ANY visual change, the author MUST do a visual
           review of the post-change capture BEFORE claiming the
           change is complete. "Code compiles, lint passes" is
           necessary but not sufficient for a visual change.

        2. The visual review MUST be specific: "does the asset
           anchor to a destination element?" "is the asset's
           alpha channel correct for the blend mode?" "does
           the change read as part of the scene or as a pasted
           image?" If the answer to any of these is "I don't
           know" or "maybe", the change is not complete.

        3. The user (Cameron) trusts the system when the safety
           net is visible and demonstrable. Honest visual
           review is part of that safety net — claiming a
           visual change is "shipped" without looking at the
           capture is a regression of the safety net.

        4. This is a cross-project lesson. Any future visual
           change (hero, components, marketing pages, etc.)
           needs the same discipline: visual review BEFORE
           "shipped", not after.
    references:
      - "D-0060 ADR §13 (supersession): governance/decisions/0060-five-plane-hero-architecture.md"
      - "User review: post-qresolutions/desktop-pos0.70.png"
      - "Revert commit: 925b4eb revert(hero): drop 5th painted plane (fern overlay)"
      - "Asset analysis: fern-01.webp has cream background opaque, fronds transparent (alpha inversion)"
      - "Lesson cross-ref: this lesson applies to ALL visual changes, not just this hero work"
'''


def main() -> int:
    raw = LEDGER.read_text(encoding="utf-8")

    if "2026-07-24-fern-overlay-revert" in raw:
        print(
            "ERROR: entry id 2026-07-24-fern-overlay-revert already present",
            file=sys.stderr,
        )
        return 1

    new_content = raw + "\n" + NEW_ENTRY

    try:
        parsed = yaml.safe_load(new_content)
    except yaml.YAMLError as exc:
        print(f"ERROR: appended ledger is not valid YAML: {exc}", file=sys.stderr)
        return 1

    cl = parsed.get("changelog", [])
    if not cl or cl[-1].get("id") != "2026-07-24-fern-overlay-revert":
        print("ERROR: appended ledger does not end with the new entry", file=sys.stderr)
        return 1

    print(f"OK: ledger now has {len(cl)} changelog entries")
    print(f"OK: new last entry id = {cl[-1]['id']!r}")

    LEDGER.write_text(new_content, encoding="utf-8")
    print(f"OK: wrote {LEDGER} ({len(new_content)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
