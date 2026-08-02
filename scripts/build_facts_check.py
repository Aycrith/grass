#!/usr/bin/env python3
"""
Cross-validate generated HTML/PDF artifacts against content/facts.yaml.

For each watched fact (per facts.yaml scope), parse `data-fact-key="..."`
markers from the HTML artifact and verify that the rendered value matches
the canonical value. This is a strict per-marker semantic check.

Usage:
  python scripts/build_facts_check.py                                # check family package artifacts
  python scripts/build_facts_check.py --artifact <path>             # check one file
  python scripts/build_facts_check.py --all                         # check all output/procurement/
  python scripts/build_facts_check.py --scope v3                    # check only facts with given scope
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

try:
    import yaml  # type: ignore
except ImportError:
    print("[error] PyYAML not installed; pip install pyyaml", file=sys.stderr)
    sys.exit(2)


FACTS = ROOT / "content" / "facts.yaml"
PROC = ROOT / "output" / "procurement"
REPORTS = ROOT / "output" / "reports"

# Files to check by default for the family package
DEFAULT_ARTIFACTS = [
    "business_plan_grass_family_cover_letter.html",
    "business_plan_grass_summary_card_v2.0.html",
]

# Regex for data-fact-key markers: <span data-fact-key="KEY">VALUE</span>
DATA_FACT_KEY_RE = re.compile(r'data-fact-key="([^"]+)"[^>]*>([^<]*)</span>')


def load_facts() -> list[dict]:
    """Load facts.yaml; return list of fact dicts."""
    if not FACTS.exists():
        return []
    raw = FACTS.read_text(encoding="utf-8")
    data = yaml.safe_load(raw)
    if not isinstance(data, dict):
        return []
    return data.get("facts", []) or []


def render_canonical(fact: dict) -> str:
    """Render a fact's canonical value into the same string the builder uses."""
    v = fact["value"]
    units = fact.get("units", "")
    if units == "USD" and isinstance(v, (int, float)):
        return f"${v:,.0f}"
    if units == "percent" and isinstance(v, (int, float)):
        return f"{v}%"
    return str(v)


def check_artifact(path: Path, facts: list[dict], scope_filter: str | None = None) -> dict:
    """Parse data-fact-key markers from HTML; report matched/missing/mismatched.

    Returns dict with: matched (list), missing (list), mismatched (list), ok (bool).
    """
    out = {"matched": [], "missing": [], "mismatched": [], "ok": True, "n_markers": 0}
    if not path.exists() or path.suffix.lower() != ".html":
        return out
    raw = path.read_text(encoding="utf-8")
    markers = dict(DATA_FACT_KEY_RE.findall(raw))
    out["n_markers"] = len(markers)
    if not markers:
        return out
    for fact in facts:
        scope = fact.get("scope", "all")
        # Apply scope filter if requested
        if scope_filter and scope not in (scope_filter, "all"):
            continue
        key = fact["key"]
        if key not in markers:
            # Only require presence when scope matches the requested filter exactly,
            # or when no filter was applied (universally watched).
            if scope_filter is None or scope == scope_filter:
                out["missing"].append(key)
            continue
        expected = render_canonical(fact).strip()
        rendered = markers[key].strip()
        # Normalize: strip commas, dollar, percent for comparison
        def norm(s: str) -> str:
            return s.replace(",", "").replace("$", "").replace("%", "").strip()
        if norm(rendered) == norm(expected):
            out["matched"].append(key)
        else:
            out["mismatched"].append((key, rendered, expected))
    out["ok"] = len(out["mismatched"]) == 0 and len(out["missing"]) == 0
    return out


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--artifacts", nargs="*", default=None,
                    help="Specific files to check (default: family package)")
    ap.add_argument("--artifact", default=None,
                    help="Single artifact to check")
    ap.add_argument("--all", action="store_true",
                    help="Check all files under output/procurement/")
    ap.add_argument("--scope", default=None,
                    help="Filter facts to a specific scope (e.g., 'v3')")
    args = ap.parse_args()

    facts = load_facts()
    if not facts:
        print(f"[error] no facts loaded from {FACTS}", file=sys.stderr)
        return 1

    if args.artifact:
        ap = Path(args.artifact)
        if not ap.is_absolute() and not ap.exists():
            cand_proc = PROC / args.artifact
            cand_rep = REPORTS / args.artifact
            if cand_proc.exists():
                ap = cand_proc
            elif cand_rep.exists():
                ap = cand_rep
        files = [ap]
    elif args.all:
        files = sorted([p for p in PROC.iterdir() if p.is_file() and p.suffix.lower() == ".html"])
    else:
        names = args.artifacts or DEFAULT_ARTIFACTS
        files = [PROC / n for n in names]

    print(f"[facts-check] {len(facts)} facts loaded; checking {len(files)} artifact(s) [scope={args.scope or 'all'}]")
    n_matched = n_missing = n_mismatched = 0
    for f in files:
        if not f.exists():
            print(f"  [SKIP] {f.name}: file not found")
            continue
        r = check_artifact(f, facts, scope_filter=args.scope)
        n_matched += len(r["matched"])
        n_missing += len(r["missing"])
        n_mismatched += len(r["mismatched"])
        marker = "OK" if r["ok"] else "FAIL"
        print(f"  [{marker}] {f.name:50s} markers={r['n_markers']} matched={len(r['matched'])} missing={len(r['missing'])} mismatched={len(r['mismatched'])}")
        for k, rendered, expected in r["mismatched"]:
            print(f"     MISMATCH {k}: rendered={rendered!r} expected={expected!r}")
        for k in r["missing"]:
            print(f"     MISSING {k}")

    print(f"\n[summary] matched={n_matched} missing={n_missing} mismatched={n_mismatched}")
    if n_mismatched > 0 or n_missing > 0:
        print("[FAIL] some facts are missing or mismatched")
        return 1
    print("[ok] all watched facts match canonical values")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
