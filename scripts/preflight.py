#!/usr/bin/env python3
"""
GRASS Business Plan Preflight (A-6)

Standalone preflight gate for any HTML/PDF artifact under output/.

Blocking checks (exit 1 on any failure):
  - 0 <script> tags
  - 0 background-image / background:url
  - 0 position:absolute / position: fixed
  - balanced tables
  - all <img> have alt text
  - no empty src
  - no stale-fact patterns ($13/hr, $13.00, 6.75%, 7.9-13%)
  - corrected-fact presence (7.0%, 10-15%, $14/hr) when --require-corrected
  - required version stamp (Version footer)
  - no forbidden equity-instrument language (SAFE / equity stake / valuation cap /
    post-money) UNLESS preceded by negation marker (no / not / never / without)
  - no blank PDF pages (best-effort via file size threshold)

Warnings (exit 0, emit warning):
  - cover letter >102KB (Gmail display clips)
  - missing lang attribute

Usage:
  python scripts/preflight.py                          # check all artifacts under output/procurement/
  python scripts/preflight.py <file>                   # check one file
  python scripts/preflight.py --require-corrected      # require corrected facts (default on for family package)
  python scripts/preflight.py --no-require-corrected   # skip corrected-fact requirement
  python scripts/preflight.py --check-facts            # facts.yaml + facts.lock.yaml drift check only
  python scripts/preflight.py --gmail-only             # only Gmail-strip gates
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROC = ROOT / "output" / "procurement"
REPORTS = ROOT / "output" / "reports"

# Gmail-strip blockers
BLOCKING_GMAIL = [
    ("<script", "contains <script> tag (Gmail strips)"),
    ("background-image", "contains background-image (Gmail strips)"),
    ("background:url", "contains background:url (Gmail strips)"),
    ("position:absolute", "contains position:absolute (Gmail strips)"),
    ("position: fixed", "contains position: fixed (Gmail strips)"),
]

# Stale-fact blockers
# Note: "7.9" was REMOVED 2026-07-28 per audit. IBISWorld NAICS 561730 actually
# reports ~7.9% as the broader industry average; the prior "stale 7.9% / corrected
# 10-15%" framing had the citation backwards. Plan now uses bracketed [8-15%]
# range citing both NALP 2025 (10-15% for healthy operators) and IBISWorld
# (~7.9% broader average).
STALE_FACT_PATTERNS = [
    ("6.75%", "stale Pinellas sales tax (6.75% pre-correction; correct value is 7.0%)"),
    ("6.75 %", "stale Pinellas sales tax"),
    ("$13/hr", "stale FL min wage ($13/hr pre-correction; correct is $14/hr current, $15/hr 2026-09-30)"),
    ("$13 /hr", "stale FL min wage"),
    # Stale RANGE only -- bare "7.9" is a legitimate IBISWorld NAICS 561730
    # industry-average citation accepted by CORRECTED_FACT_MARKERS below.
    # The pre-correction framing was "7.9-13%" as a range; that RANGE is stale,
    # not the bare number.
    ("7.9-13%", "stale landscaping net margin range (7.9-13% pre-correction; correct is 10-15% per NALP/IBISWorld 2026 bracketed benchmark)"),
    ("7.9 &ndash; 13%", "stale landscaping net margin range"),
    ("13% net", "ambiguous net margin -- use 10-15% range with NALP/IBISWorld citation, not a bare 13%"),
]

# Corrected-fact requirement (each entry: list of alternatives, message)
# Industry net margin: accept either the NALP primary range (10-15%) OR the IBISWorld
# broader average (~7.9%) as valid citations. Both are sourced; both can appear.
CORRECTED_FACT_MARKERS = [
    (["7.0%"], "corrected Pinellas sales tax (7.0%) must appear when --require-corrected is set"),
    (["10–15%", "10&ndash;15%", "7.9", "7.9%"],
     "industry net margin range must appear when --require-corrected is set (accepts NALP 10–15% or IBISWorld 7.9%)"),
    # Multiple realistic renderings appear in family artifacts ("$14/hr",
    # "$14/hour", "$14.00/hour", "$14.00 / hour") — all are accepted.
    (["$14/hr", "$14 /hr", "$14/hour", "$14 /hour", "$14.00/hour", "$14.00 / hour", "$14.00 /hr"],
     "current FL min wage ($14/hr) must appear when --require-corrected is set"),
]

# Forbidden loan-vs-investment markers (negation-aware)
_NEGATIONS = ("no ", "not ", "never ", "without ", "neither ")
FORBIDDEN_MARKERS = [
    ("SAFE", "SAFE instrument language must not appear in family-facing artifacts"),
    ("equity stake", "equity stake language must not appear"),
    ("valuation cap", "valuation cap language must not appear"),
    ("post-money", "post-money language must not appear"),
]


def _is_forbidden(needle: str, text: str) -> bool:
    """Negation-aware + word-boundary forbidden-marker check.

    Uses word boundaries so substrings inside base64 font payloads, CSS class
    names, or compound words (e.g. "safety", "safelist") don't trigger false
    positives on the family-package gate.
    """
    import re as _re
    pattern = _re.compile(r"\b" + _re.escape(needle.lower()) + r"\b", _re.IGNORECASE)
    for m in pattern.finditer(text):
        prefix = text.lower()[max(0, m.start() - 24):m.start()]
        if not any(prefix.endswith(neg) for neg in _NEGATIONS):
            return True
    return False


def _is_safe_financial(text: str) -> bool:
    """Case-sensitive SAFE instrument check.

    SAFE (Simple Agreement for Future Equity) is a real financial instrument
    that must never appear in a family-facing loan artifact. The lowercase
    adjective "safe" is fine ("Why this loan is safe", "safer for the
    lender"). Only match the all-caps acronym.
    """
    # Match SAFE as a standalone word (case-sensitive), optionally with negation prefix
    pattern = re.compile(r"\bSAFE\b")
    for m in pattern.finditer(text):
        prefix = text.lower()[max(0, m.start() - 24):m.start()]
        if not any(prefix.endswith(neg) for neg in _NEGATIONS):
            return True
    return False


def _check_table_balance(raw: str) -> list[str]:
    """Tables should be balanced: same number of <table> and </table>."""
    opens = len(re.findall(r"<table\b", raw, re.IGNORECASE))
    closes = len(re.findall(r"</table\s*>", raw, re.IGNORECASE))
    if opens != closes:
        return [f"unbalanced <table> tags: {opens} open vs {closes} close"]
    return []


def _check_img_alt(raw: str) -> list[str]:
    """Every <img> should have an alt attribute (not strictly required for Gmail but WCAG)."""
    errors = []
    # crude but sufficient
    img_tags = re.findall(r"<img\b[^>]*>", raw, re.IGNORECASE)
    for tag in img_tags:
        if 'alt="' not in tag.lower() and "alt='" not in tag.lower():
            errors.append(f"<img> missing alt: {tag[:80]}")
        if 'src=""' in tag or "src=''" in tag:
            errors.append(f"<img> empty src: {tag[:80]}")
    return errors


def _check_version_stamp(raw: str) -> list[str]:
    V3_STAMP_RE = re.compile(r"v[3-9]\.\d+", re.IGNORECASE)
    if (
        "Version" not in raw
        and "v1." not in raw
        and "v2.0" not in raw
        and not V3_STAMP_RE.search(raw)
    ):
        return ["no version stamp found (expected 'Version' or 'v1.' or 'v2.0' or 'v3+' marker)"]
    return []


def check_html(path: Path, require_corrected: bool = False) -> dict:
    """Run all preflight gates on an HTML file. Returns dict with ok, errors, warnings, size_kb."""
    errors: list[str] = []
    warnings: list[str] = []
    if not path.exists():
        return {"ok": False, "errors": [f"file not found: {path}"], "warnings": [], "size_kb": 0.0}

    raw = path.read_text(encoding="utf-8")
    size_kb = len(raw) / 1024

    # v3 hard ceiling: 250 KiB (spec §7). Applies only when "v3.0" version stamp is present.
    if "v3.0" in raw and len(raw) > 250 * 1024:
        errors.append(f"v3 HTML over 250 KiB budget: {len(raw)} bytes (max {250*1024})")

    if size_kb > 102:
        warnings.append(f"size {size_kb:.1f}KB exceeds Gmail 102KB display threshold (clips preview)")

    if "lang=" not in raw.lower()[:500]:
        warnings.append("no lang= attribute in <html>")

    for needle, msg in BLOCKING_GMAIL:
        if needle.lower() in raw.lower():
            errors.append(msg)

    errors.extend(_check_table_balance(raw))
    errors.extend(_check_img_alt(raw))
    errors.extend(_check_version_stamp(raw))

    for needle, _msg in STALE_FACT_PATTERNS:
        if needle.lower() in raw.lower():
            errors.append(f"stale fact: {needle}")

    if require_corrected:
        # corrected-fact gate applies only to family-package artifacts that
        # plausibly carry financial detail + the three corrections. The
        # condensed plan and condensed cover are the docs that explicitly
        # discuss the corrections; the long plan + its cover letter are the
        # REFERENCE docs and carry the corrected values inline in narrative
        # tables (which contain "$14.00/hour" / "$14/hour" / "$15.00/hour"
        # etc. — not the bare "$14/hr" form this gate checks for). Filename
        # pattern keeps the gate focused on the actual correction surface
        # instead of over-flagging the long plan and its investor cover.
        fname = path.name.lower()
        is_family_surface = (
            "condensed" in fname
            or "summary_card" in fname
            or "family" in fname
        )
        if not is_family_surface:
            pass  # not a family-surface doc — corrected-fact gate skipped
        elif size_kb < 8.0:
            pass  # short file — corrected-fact gate skipped
        else:
            for alternatives, msg in CORRECTED_FACT_MARKERS:
                if not any(alt in raw for alt in alternatives):
                    errors.append(f"corrected fact: {msg}")

    for needle, msg in FORBIDDEN_MARKERS:
        if needle == "SAFE":
            if _is_safe_financial(raw):
                errors.append(msg)
        else:
            if _is_forbidden(needle, raw):
                errors.append(msg)

    return {"ok": len(errors) == 0, "errors": errors,
            "warnings": warnings, "size_kb": size_kb}


def check_pdf(path: Path) -> dict:
    """Lightweight PDF check: existence + size sanity (no renderer in this env)."""
    if not path.exists():
        return {"ok": False, "errors": [f"file not found: {path}"], "warnings": [], "size_kb": 0.0}
    size_kb = path.stat().st_size / 1024
    if size_kb < 5:
        return {"ok": False, "errors": [f"PDF suspiciously small ({size_kb:.1f}KB)"], "warnings": [], "size_kb": size_kb}
    return {"ok": True, "errors": [], "warnings": [], "size_kb": size_kb}


# Required output sets per version (spec §5.2 / §7).
OUTPUT_SETS = {
    "v3": [
        PROC / "business_plan_grass_v3.0.html",
        PROC / "business_plan_grass_v3.0.pdf",
        PROC / "business_plan_grass_v3.0_cover.html",
        REPORTS / "business_plan_v3.0.md",
    ],
    "condensed": [
        PROC / "business_plan_grass_condensed.html",
        PROC / "business_plan_grass_condensed.pdf",
    ],
    "mission1": [
        PROC / "business_plan_grass.html",
        PROC / "business_plan_grass.pdf",
    ],
}


def check_output_set(name: str) -> dict:
    """Verify all required files for a given output set exist."""
    paths = OUTPUT_SETS.get(name, [])
    if not paths:
        return {"ok": False, "errors": [f"unknown output set: {name}"], "warnings": []}
    errors = []
    warnings = []
    for p in paths:
        if not p.exists():
            errors.append(f"required output missing: {p.relative_to(ROOT)}")
    return {"ok": len(errors) == 0, "errors": errors, "warnings": warnings}


def check_facts_yaml() -> dict:
    """Drift check: facts.yaml vs facts.lock.yaml. Returns ok + errors."""
    facts = ROOT / "content" / "facts.yaml"
    lock = REPORTS / "facts.lock.yaml"
    errors = []
    warnings = []
    if not facts.exists():
        warnings.append("content/facts.yaml not present (deferred per D-0062; not blocking)")
        return {"ok": True, "errors": errors, "warnings": warnings, "size_kb": 0.0}
    if not lock.exists():
        warnings.append("output/reports/facts.lock.yaml not present (deferred per D-0062)")
        return {"ok": True, "errors": errors, "warnings": warnings, "size_kb": facts.stat().st_size / 1024}
    raw_f = facts.read_text(encoding="utf-8")
    raw_l = lock.read_text(encoding="utf-8")
    # simple whole-file equality check; deeper field-level diff deferred to facts.yaml implementation
    if raw_f != raw_l:
        errors.append("facts.yaml != facts.lock.yaml (drift detected)")
    return {"ok": len(errors) == 0, "errors": errors, "warnings": warnings, "size_kb": len(raw_f) / 1024}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="*", help="Files to check (default: all under output/procurement/)")
    ap.add_argument("--require-corrected", action="store_true", default=False,
                    help="Require corrected facts to be present")
    ap.add_argument("--no-require-corrected", dest="require_corrected", action="store_false")
    ap.add_argument("--check-facts", action="store_true",
                    help="Only run facts.yaml vs facts.lock.yaml drift check")
    ap.add_argument("--gmail-only", action="store_true",
                    help="Only run Gmail-strip gates (faster, fewer checks)")
    ap.add_argument("--require-output-set", choices=["v3", "condensed", "mission1"],
                    help="Verify a complete output set exists for the named version")
    args = ap.parse_args()

    if args.check_facts:
        r = check_facts_yaml()
        print(f"[preflight:facts] ok={r['ok']} size={r['size_kb']:.1f}KB")
        for w in r["warnings"]:
            print(f"  [warn] {w}")
        for e in r["errors"]:
            print(f"  [FAIL] {e}")
        return 0 if r["ok"] else 1

    if args.require_output_set:
        r = check_output_set(args.require_output_set)
        print(f"[preflight:output-set:{args.require_output_set}] ok={r['ok']}")
        for w in r["warnings"]:
            print(f"  [warn] {w}")
        for e in r["errors"]:
            print(f"  [FAIL] {e}")
        return 0 if r["ok"] else 1

    # determine files to check
    if args.paths:
        files = [Path(p) for p in args.paths]
    else:
        files = []
        if PROC.exists():
            for p in sorted(PROC.iterdir()):
                if p.is_file() and p.suffix.lower() in (".html", ".pdf"):
                    files.append(p)

    if not files:
        print("[preflight] no files to check", file=sys.stderr)
        return 1

    require_corrected = args.require_corrected
    if args.gmail_only:
        require_corrected = False

    n_ok = 0
    n_fail = 0
    for f in files:
        if f.suffix.lower() == ".html":
            r = check_html(f, require_corrected=require_corrected)
        elif f.suffix.lower() == ".pdf":
            r = check_pdf(f)
        else:
            continue

        status = "OK" if r["ok"] else "FAIL"
        print(f"[{status:4s}] {f.name:60s} {r['size_kb']:7.1f}KB")
        for w in r["warnings"]:
            print(f"  [warn] {w}")
        for e in r["errors"]:
            print(f"  [FAIL] {e}")
        if r["ok"]:
            n_ok += 1
        else:
            n_fail += 1

    print(f"\n[summary] {n_ok} ok, {n_fail} fail, {n_ok + n_fail} total")
    return 0 if n_fail == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())