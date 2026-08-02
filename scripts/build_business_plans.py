#!/usr/bin/env python3
"""
GRASS Unified Business Plan Builder (A-8 + S-02)

Single entry point for all business-plan artifact builds. Orchestrates the
existing build scripts (build_business_plan.py, build_condensed_business_plan.py,
build_summary_card.py, build_family_cover_letter.py, etc.) and runs the gates
defined in PRP-A:
  - facts.yaml vs facts.lock.yaml drift check (A-7)
  - build_facts_check cross-validation (S-01)
  - preflight Gmail-safe + corrected-fact + forbidden-marker gates (A-6)
  - version stamping via scripts/versioning.py (A-9)

Variants:
  --variant long               build the full long plan (mission1)
  --variant long-eval          build the long plan with evaluator addendum
  --variant condensed          build the 12-page condensed plan PDF
  --variant summary-card       build the v2.0 one-page business case
  --variant cover-letter       build the original corporate cover letter
  --variant family             build the family cover letter + summary card (v2.0)
  --variant all                build all of the above

Flags:
  --no-gates                   skip drift / preflight / facts-check gates
  --no-pdf                     skip PDF rendering for HTML-only artifacts
  --check-only                 only run gates, do not build

Usage:
  python scripts/build_business_plans.py --variant family
  python scripts/build_business_plans.py --variant all
  python scripts/build_business_plans.py --variant long --no-gates
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "scripts"

# (variant, [script_paths_relative_to_ROOT], label)
VARIANTS: dict[str, dict] = {
    "long": {
        "label": "long plan (mission1)",
        "scripts": ["scripts/build_business_plan.py"],
        "also_render_pdf": True,
    },
    "long-eval": {
        "label": "long plan + evaluator addendum",
        "scripts": ["scripts/build_business_plan_with_evaluation.py"],
        "also_render_pdf": True,
    },
    "condensed": {
        "label": "condensed plan (12-page PDF)",
        "scripts": ["scripts/build_condensed_business_plan.py",
                    "scripts/build_condensed_business_plan_pdf.py"],
        "also_render_pdf": True,
    },
    "summary-card": {
        "label": "summary card v2.0 (one-page business case)",
        "scripts": ["scripts/build_summary_card.py"],
        "also_render_pdf": True,
    },
    "cover-letter": {
        "label": "corporate cover letter",
        "scripts": ["scripts/build_business_plan_cover_letter.py"],
        "also_render_pdf": False,
    },
    "family": {
        "label": "family package (cover letter + summary card v2.0)",
        "scripts": ["scripts/build_family_cover_letter.py",
                    "scripts/build_summary_card.py"],
        "also_render_pdf": True,
    },
    "all": {
        "label": "all variants",
        "scripts": ["scripts/build_business_plan.py",
                    "scripts/build_business_plan_with_evaluation.py",
                    "scripts/build_condensed_business_plan.py",
                    "scripts/build_condensed_business_plan_pdf.py",
                    "scripts/build_summary_card.py",
                    "scripts/build_family_cover_letter.py",
                    "scripts/build_business_plan_cover_letter.py"],
        "also_render_pdf": True,
    },
    "v3": {
        "label": "v3.0 investor-grade plan (12-page HTML + Markdown + PDF + cover)",
        "scripts": ["scripts/build_business_plan_v3.py",
                    "scripts/build_business_plan_v3_pdf.py"],
        "also_render_pdf": True,
    },
}


def run_script(script_rel: str, env: dict | None = None) -> int:
    """Run a build script and stream its stdout/stderr. Return its exit code."""
    script_path = ROOT / script_rel
    if not script_path.exists():
        print(f"  [skip] {script_rel} (not found)", file=sys.stderr)
        return 1
    print(f"  [run]  {script_rel}")
    r = subprocess.run(
        [sys.executable, str(script_path)],
        capture_output=True, text=True,
        env=env,
    )
    if r.stdout:
        print(r.stdout.rstrip())
    if r.stderr:
        print(r.stderr.rstrip(), file=sys.stderr)
    return r.returncode


def run_gate(label: str, args: list[str]) -> int:
    """Run a gate script and return its exit code."""
    print(f"\n[gate] {label}")
    r = subprocess.run(
        [sys.executable, str(SCRIPTS / "preflight.py"), *args],
        capture_output=True, text=True,
    )
    if r.stdout:
        print(r.stdout.rstrip())
    if r.stderr:
        print(r.stderr.rstrip(), file=sys.stderr)
    return r.returncode


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--variant", required=True,
                    choices=list(VARIANTS.keys()),
                    help="Which build variant to run")
    ap.add_argument("--no-gates", action="store_true",
                    help="Skip drift-check, preflight, and facts-check gates")
    ap.add_argument("--no-pdf", action="store_true",
                    help="Skip PDF rendering for HTML-only artifacts")
    ap.add_argument("--check-only", action="store_true",
                    help="Only run gates, do not build")
    args = ap.parse_args()

    variant = VARIANTS[args.variant]
    print(f"[build] variant={args.variant} ({variant['label']})")

    # 1. Gates first (if not skipped and not check-only)
    if not args.check_only and not args.no_gates:
        if run_gate("facts drift check", ["--check-facts"]) != 0:
            print("\n[abort] facts.yaml drift detected; bump version + regenerate facts.lock.yaml",
                  file=sys.stderr)
            return 2

    # 2. Build
    if not args.check_only:
        env = None
        if args.no_pdf:
            # builders honor their own no-pdf flag where applicable; this is a hint
            env = {"PYTHONIOENCODING": "utf-8", "NO_PDF": "1"}

        n_ok = 0
        n_fail = 0
        for script_rel in variant["scripts"]:
            rc = run_script(script_rel, env=env)
            if rc == 0:
                n_ok += 1
            else:
                n_fail += 1
        print(f"\n[build] {n_ok} ok, {n_fail} fail")

    # 3. Post-build gates (if not skipped)
    if not args.no_gates:
        print("\n[gate] preflight on family package artifacts (--require-corrected)")
        rc = run_gate("preflight (family)",
                      ["output/procurement/business_plan_grass_family_cover_letter.html",
                       "output/procurement/business_plan_grass_summary_card_v2.0.html",
                       "output/procurement/business_plan_grass_condensed.pdf",
                       "--require-corrected"])
        if rc != 0:
            print("\n[warn] preflight failed; review above", file=sys.stderr)

        print("\n[gate] facts cross-validation")
        rc = subprocess.run(
            [sys.executable, str(SCRIPTS / "build_facts_check.py")],
            capture_output=True, text=True,
        ).returncode
        if rc != 0:
            print("\n[warn] facts-check failed", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())