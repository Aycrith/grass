#!/usr/bin/env python3
"""
Generate SUMMARY.md for every snapshot under output/snapshots/.

Snapshot discipline (PRP-A A-11):
  Each snapshot MUST have a SUMMARY.md with:
    - timestamp, version, variant(s)
    - files included (with sizes)
    - what changed
    - what was sent, recipient, send status
    - known limitations
    - source SHA (the build script + a hash of file contents)
    - founder approval
    - rollback reference

Usage:
    python scripts/write_snapshot_summary.py               # all snapshots
    python scripts/write_snapshot_summary.py <dir-name>   # one snapshot
"""
from __future__ import annotations

import datetime as dt
import hashlib
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SNAPSHOTS = ROOT / "output" / "snapshots"

# Snapshot narrative (authored once, audited by steward)
SNAPSHOT_NOTES: dict[str, dict] = {
    "2026-07-27T20-50_post_business_plan_build": {
        "variant": "long (mission1) + cover letter + scripts",
        "what_changed": (
            "Initial v1.0 long business plan build. 15 sections, full QA pass with "
            "Playwright PNG captures (full_qa_cover / market / financials + cover QA). "
            "Cover letter v1.0 + build scripts archived."
        ),
        "sent": "Dry-run only; not sent to any recipient.",
        "recipient": "n/a",
        "send_status": "dry-run only",
        "known_limitations": (
            "Pre-correction facts present: $13/hr FL min wage; 6.75% Pinellas sales tax; "
            "7.9-13% net margin range. Corrected in subsequent snapshots."
        ),
        "founder_approval": "approved 2026-07-27",
    },
    "2026-07-27T23-06-31_post_business_plan_with_evaluation": {
        "variant": "long (mission1_with_evaluation)",
        "what_changed": (
            "Long plan + external-evaluator addendum. 16 sections total. 8 PNG captures "
            "of the evaluation addendum pages (scored, recommendations, market, "
            "quantified, growth, addendum, bibliography, end). Evaluation-derived "
            "improvements queued for next build cycle."
        ),
        "sent": "Dry-run only; not sent.",
        "recipient": "n/a",
        "send_status": "dry-run only",
        "known_limitations": (
            "Same pre-correction facts as 20-50 snapshot. 4 evaluator recommendations "
            "NOT YET incorporated into the long plan body (deferred to v1.1 patch)."
        ),
        "founder_approval": "approved 2026-07-27",
    },
    "2026-07-28T00-41-26_post_condensed_business_plan": {
        "variant": "condensed (12-page PDF) + condensed cover letter",
        "what_changed": (
            "Condensed 12-page PDF for older-audience reader. First deliverable sized "
            "for the family investor send. Cover letter + visual QA captures archived."
        ),
        "sent": "2026-07-28 00:41:09 to choblo@gmail.com (founder staging).",
        "recipient": "choblo@gmail.com",
        "send_status": "delivered (staging); superseded for live family investor by v1.1 family package",
        "known_limitations": (
            "This condensed PDF carries corrected facts (7.0% / $14-$15/hr / 10-15%) but "
            "the ORIGINAL Q9 (SAFE) instrument language was the original framing; the "
            "family-package pivot to 0% loan (Option C) lives in the cover letter + "
            "summary card, NOT in this PDF. The condensed body was intentionally kept "
            "neutral on instrument so the cover letter carries the loan framing."
        ),
        "founder_approval": "approved 2026-07-28",
    },
    "2026-07-28T04-30_post_long_plan_v1.1": {
        "variant": "long (mission1) v1.1 — corrected facts + 4 evaluator recs",
        "what_changed": (
            "Long plan v1.1 patch (per PRP-A A-1/A-2/A-3). Five additions to "
            "scripts/build_business_plan.py: (1) $62,100 Y1 gross revenue headline in "
            "the at-a-glance stat grid; (2) FL min wage $14/hr current → $15/hr "
            "2026-09-30 in the first-hire wage assumption (per FL Constitution "
            "Amendment 2); (3) First-hire margin transition section (74% gross margin "
            "→ 45-55% post-first-hire); (4) Post-credit CAC forecast section "
            "($90-200/customer after pilot-window free credits expire); (5) Named AI "
            "model provider (Claude / Anthropic) + 4-hour retry + secondary model "
            "fallback + manual operating window in §08; (6) Two new risks in "
            "§14 (AI model provider outage + agent drift with three named guards). "
            "Long plan rebuilt to 839.2 KB HTML + 399.2 KB Gmail-safe HTML."
        ),
        "sent": "Dry-run only; long plan is reference-only per Q5 (regenerate-in-place, not re-send).",
        "recipient": "n/a (reference document)",
        "send_status": "regenerate-in-place only — NOT re-sent unsolicited",
        "known_limitations": (
            "Long plan still contains pre-correction values in operational artifacts "
            "(· architecture/twin/invoice.md, content/templates/invoice-template.md, "
            "research/regulatory/largo-licensing-map.yaml, state/ledger.yaml). These "
            "are flagged as D-0062 Source Reconciliation Exception for next cycle per "
            "the drift policy."
        ),
        "founder_approval": "pending steward review at next ledger checkpoint",
    },
    "2026-07-28T18-30_post_equipment_correction": {
        "variant": "v3.0 long (mission1) — corrected equipment specs to 36\" commercial zero-turn",
        "what_changed": (
            "Procurement-driven equipment correction: the operations equipment table "
            "and use-of-funds Equipment line both previously described a 21\" push "
            "mower at $1,200, which under-specs the equipment a solo landscaper "
            "actually needs to mow residential lots at gate-clearance scale. "
            "Procurement scan of Garbage Goober listings (Dover FL lot walk + email "
            "ingestion) showed true commercial 36\" zero-turn pricing at $2,900-$3,900 "
            "used (Toro Grandstand, Exmark, Hustler Super S). The plan now reflects "
            "a 36\" commercial zero-turn primary + supporting tools at $5,230 used "
            "(was $1,800 push mower). The Optional second unit is reserved for "
            "Phase 2 add-on at ~$2,900 used (not in Year 1 ask). Use-of-funds buffer "
            "recomputed: $12,000 - $5,230 - $1,750 - $3,000 - $1,500 - $262 = $258. "
            "Buffer now tight but mathematically valid. Three files touched: "
            "scripts/build_business_plan_v3.py (HTML equipment table, use-of-funds "
            "equipment line, page-2 'low entry cost' line, Markdown equipment "
            "table, callout about optional stand-on ZT); content/facts.yaml "
            "(v3-use-of-funds-buffer $3,688 -> $258 with computed source string); "
            "tests/test_arithmetic.py (fixed sum 1800 -> 5230; expected buffer "
            "258). All gates green: preflight ok=True; facts-check "
            "matched=8 missing=0 mismatched=0; pytest 18/18; HTML 237.5 KB <= "
            "250 KB ceiling; PDF 282.4 KB."
        ),
        "sent": "Not yet re-sent; choblo #4 (2026-07-28T13:57:10, JSONL #140) carries the pre-correction plan.",
        "recipient": "n/a (awaiting founder authorization for v3 re-send)",
        "send_status": "awaiting live-send re-authorization with corrected equipment",
        "known_limitations": (
            "Buffer at $258 is tight (covers overruns on insurance, working-capital "
            "gap, or hurricane reserve gap — not all three). Optional stand-on zero-"
            "turn at ~$2,900 is explicitly Phase 2 add-on and not in Year 1 ask. "
            "Procurement data is from a single scan cycle (Day 38 best-part-2 "
            "trailers/ZT36); may want a second pass before investor send. The Dover "
            "FL in-person 3-pick lot walk (Wright WZT052 52\" $1,800 / Gravely 34Z "
            "34\" $1,500 / Exmark S-Series 36-48\" $1,700) was inspected but the "
            "Gravely 34Z at 34\" was excluded (below 36\" minimum deck)."
        ),
        "founder_approval": "pending steward review at next ledger checkpoint",
    },
    "2026-07-28T19-00_post_final_polish": {
        "variant": "v3.0 long (mission1) — final polish: MD buffer corrected + Phase 2 callout tightened with broader procurement scan",
        "what_changed": (
            "Final polish after the equipment correction (18:30 snapshot). Three "
            "changes: (1) Markdown use-of-funds Buffer row hardcoded $3,688 -> $258 "
            "in scripts/build_business_plan_v3.py line 665 (the HTML computed the "
            "buffer dynamically so it was always correct, but the MD had a stale "
            "hardcoded value from the pre-correction build); (2) Phase 2 stand-on "
            "ZT callout on page 5 (HTML + MD) tightened from '~$2,900 used' to "
            "'$1,700-$3,000 used (Dover FL in-person lot walk: Exmark S-Series "
            "$1,700; Craigslist/eBay: Gravely Pro-Stance 36\" $3,000 typical)' — "
            "the broader procurement scan (Day 38 best-part-3 ZT + Dover lot walk) "
            "corroborates the $1,700-$3,000 range; (3) PDF rebuilt at 283.5 KB "
            "(was 283.4 KB from 18:30 snapshot, +116 bytes from longer callout). "
            "HTML 237.7 KB (was 237.5 KB, +200 bytes from longer callout); "
            "Markdown 20.4 KB (was 20.2 KB, +170 bytes from buffer note + callout). "
            "All gates still green: preflight ok=True; facts-check "
            "matched=8 missing=0 mismatched=0; pytest 18/18; HTML 237.7 KB <= "
            "250 KB ceiling."
        ),
        "sent": "Not yet re-sent; choblo #4 (2026-07-28T13:57:10, JSONL #140) carries pre-correction plan; investor re-send STILL GATED.",
        "recipient": "n/a (awaiting founder authorization for v3 re-send)",
        "send_status": "awaiting live-send re-authorization with corrected equipment + tightened Phase 2 callout",
        "known_limitations": (
            "Same as 18:30 equipment-correction snapshot. Buffer at $258 is tight. "
            "Procurement data is from a single scan cycle (Day 38 best-part-2/3/4) + "
            "Dover FL in-person 3-pick lot walk. A second scan pass before investor "
            "send would strengthen the price-range claim, but the existing data is "
            "well-corroborated (Exmark S-Series 36\" at $1,700 in-person + Craigslist "
            "listings at $2,900-$3,900 for Exmark 36\" Commercial + Gravely Pro-Stance "
            "36\" at $3,000 eBay typical). PRE-SEND-READINESS.md provides a single-page "
            "founder sign-off checklist with the dual-authorization re-send command."
        ),
        "founder_approval": "pending steward review at next ledger checkpoint",
    },
}


def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()[:12]


def short_sha(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]


def build_summary(dirpath: Path) -> str:
    name = dirpath.name
    meta = SNAPSHOT_NOTES.get(name, {
        "variant": "unknown",
        "what_changed": "(no narrative recorded for this snapshot)",
        "sent": "n/a",
        "recipient": "n/a",
        "send_status": "n/a",
        "known_limitations": "(no narrative recorded)",
        "founder_approval": "(pending)",
    })

    files = sorted([p for p in dirpath.iterdir() if p.is_file()])
    file_rows = []
    file_hashes = []
    for p in files:
        size_kb = p.stat().st_size / 1024
        sha = sha256_file(p)
        file_hashes.append(sha)
        rel = p.relative_to(ROOT).as_posix()
        file_rows.append(f"| `{rel}` | {size_kb:.1f} KB | `{sha}` |")

    contents_hash = short_sha("|".join(sorted(file_hashes)))

    timestamp = name.split("_")[0]  # ISO-ish prefix

    out = f"""# Snapshot: `{name}`

**Document ID:** SNAP-{name}
**Created:** {timestamp}
**Captured:** {dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
**Author:** GRASS executive agent + steward
**Status:** archived (read-only)

---

## Variant

**{meta['variant']}**

## What changed

{meta['what_changed']}

## Send status

- **Sent:** {meta['sent']}
- **Recipient:** {meta['recipient']}
- **Status:** {meta['send_status']}

## Known limitations

{meta['known_limitations']}

## Founder approval

{meta['founder_approval']}

---

## Files in this snapshot ({len(files)} file{'s' if len(files) != 1 else ''})

| Path | Size | SHA-256 (first 12) |
|---|---:|---|
{chr(10).join(file_rows)}

**Combined contents SHA-256 (first 12):** `{contents_hash}`

## Rollback reference

To restore this snapshot's build script(s) to the working tree:

```bash
# Dry-run first
ls -la output/snapshots/{name}/

# Restore a specific script (example for long plan)
cp output/snapshots/{name}/build_business_plan.py scripts/build_business_plan.py

# Re-render the plan
python scripts/build_business_plan.py
```

## Provenance

- Snapshot discipline per `docs/business-plan/support/07-snapshot-discipline.md`
- Auto-generated by `scripts/write_snapshot_summary.py`
- Constitution rule: "Documentation before memory" (Hard Rule 4)
"""
    return out


def main() -> int:
    targets = sys.argv[1:]
    if not targets:
        if not SNAPSHOTS.exists():
            print(f"[error] no snapshots dir: {SNAPSHOTS}", file=sys.stderr)
            return 1
        targets = sorted([d.name for d in SNAPSHOTS.iterdir() if d.is_dir()])

    n_ok = 0
    for name in targets:
        d = SNAPSHOTS / name
        if not d.exists():
            print(f"[skip] not found: {d}")
            continue
        summary_path = d / "SUMMARY.md"
        body = build_summary(d)
        summary_path.write_text(body, encoding="utf-8")
        size_kb = summary_path.stat().st_size / 1024
        print(f"[ok] wrote {summary_path} ({size_kb:.1f} KB)")
        n_ok += 1
    print(f"\n[done] {n_ok} summary file(s) written")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())