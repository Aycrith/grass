#!/usr/bin/env python3
"""citation-drift-monitor.py — internal-consistency check for 25-citation build.

CONTEXT
=======
NAP (Name/Address/Phone) consistency across all 25 citations is
the #1 local-SEO ranking factor after the GBP itself. Drift
between the canonical source (apps/web/src/lib/business.ts) and
any emitted citation block is a ranking penalty.

This script catches drift BEFORE it costs ranking. It does NOT
scrape the live web (that would require maintenance, rate
limits, and ToS compliance). Instead, it checks the **internal
consistency** of the artifacts the steward controls:

  Layer 1: apps/web/src/lib/business.ts (canonical NAP)
  Layer 2: content/marketing/citation-data-package.md
           (the human-readable data package)
  Layer 3: drafts/citations/<date>/<NN>-<slug>.md
           (the emitted per-directory blocks, when they exist)

The script:

  1. Reads Layer 1 (business.ts).
  2. Scans Layer 2 (data package) and extracts every NAP
     reference. Verifies each one matches Layer 1.
  3. Scans Layer 3 (emitted blocks, if any) and verifies each
     NAP block matches Layer 1.
  4. Verifies per-directory format overrides (Yelp parens, Bing
     no-protocol URL) are applied correctly in the emitted
     blocks.
  5. Verifies the citation-data-package.md's 25-directory
     table matches the script's DIRECTORIES list.

USAGE
=====
    # Check the current state (run weekly)
    python scripts/citation-drift-monitor.py

    # Check a specific date-stamped emission
    python scripts/citation-drift-monitor.py \\
        --emission drafts/citations/2026-07-26/

    # Check against a specific data package
    python scripts/citation-drift-monitor.py \\
        --data-package content/marketing/citation-data-package.md

    # Print the canonical NAP block (for human inspection)
    python scripts/citation-drift-monitor.py --print-nap

    # JSON output (for CI integration)
    python scripts/citation-drift-monitor.py --json

EXIT CODES
==========
  0 = clean (no drift detected)
  1 = drift detected (the steward must fix one or more artifacts)
  2 = missing file (e.g., a referenced citation block doesn't exist)

WEEKLY WORKFLOW
===============
Add this to the steward weekly checklist:

    # Every Sunday, before any other GBP work:
    python scripts/citation-drift-monitor.py

    # If exit 0: continue.
    # If exit 1: open the file the script flagged, fix the
    # drifted line, re-run.

DESIGN DECISIONS
================
- The script is conservative: it ERRORS on any drift it
  detects, even cosmetic differences (extra whitespace,
  capitalization, etc.). The strict approach prevents the
  "drift by a space" failure mode where a search engine sees
  "Largo Lawn" and "Largo  Lawn" as different businesses.
- The script does NOT validate against live web directories.
  That would require web scraping (with rate limits and ToS
  implications) and would generate false positives when
  directories cache slightly different versions. The internal-
  consistency check is sufficient because the steward updates
  the canonical business.ts once and the script regenerates
  the citation blocks.
- The script does NOT auto-fix drift. The fix is a one-line
  edit in the artifact (the steward can see the diff and
  decide whether to re-emit or hand-edit).

CROSS-REFERENCES
================
- apps/web/src/lib/business.ts — the canonical NAP source.
- content/marketing/citation-data-package.md — Layer 2.
- drafts/citations/<date>/*.md — Layer 3.
- scripts/citation-payload-generator.py — the script that
  emits Layer 3 from Layer 1.
- state/ledger.yaml → OBJ-M2-006 — the active objective.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Optional

# Re-use the parse_business_ts and BusinessNAP from the generator.
# The generator file has hyphens (`citation-payload-generator.py`)
# which Python's `import` statement cannot handle natively; we
# load it via importlib.util.spec_from_file_location. This avoids
# duplicating the TS parser and the 25-directory DIRECTORIES list
# (a single source of truth is the whole point of the drift check).
import importlib.util

_GENERATOR_PATH = Path(__file__).resolve().parent / "citation-payload-generator.py"
_spec = importlib.util.spec_from_file_location(
    "citation_payload_generator", _GENERATOR_PATH
)
if _spec is None or _spec.loader is None:
    raise ImportError(
        f"Could not load citation-payload-generator.py from {_GENERATOR_PATH}"
    )
_generator_module = importlib.util.module_from_spec(_spec)
sys.modules["citation_payload_generator"] = _generator_module
_spec.loader.exec_module(_generator_module)

DESCRIPTION_VARIANTS = _generator_module.DESCRIPTION_VARIANTS
DIRECTORIES = _generator_module.DIRECTORIES
BusinessNAP = _generator_module.BusinessNAP
format_phone = _generator_module.format_phone
format_url = _generator_module.format_url
parse_business_ts = _generator_module.parse_business_ts
render_nap_block = _generator_module.render_nap_block

# Reconfigure stdout for Windows UTF-8 (same as the generator).
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
        sys.stderr.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    except (AttributeError, OSError):
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DATA_PACKAGE = REPO_ROOT / "content" / "marketing" / "citation-data-package.md"
DEFAULT_EMISSION_DIR = REPO_ROOT / "drafts" / "citations"


# ---------------------------------------------------------------------------
# Drift report
# ---------------------------------------------------------------------------


@dataclass
class DriftIssue:
    """One detected drift, with enough context for the steward to fix it."""

    layer: str  # "data-package" | "emission" | "internal-roster" | "format-override"
    location: str  # file:line or directory slug
    severity: str  # "error" | "warning"
    message: str
    expected: Optional[str] = None
    actual: Optional[str] = None

    def to_dict(self) -> dict:
        return {
            "layer": self.layer,
            "location": self.location,
            "severity": self.severity,
            "message": self.message,
            "expected": self.expected,
            "actual": self.actual,
        }


@dataclass
class DriftReport:
    """Aggregate result of one drift-check run."""

    issues: list[DriftIssue] = field(default_factory=list)
    canonical_nap: Optional[BusinessNAP] = None
    checked_at: str = field(default_factory=lambda: datetime.now().isoformat(timespec="seconds"))

    @property
    def errors(self) -> list[DriftIssue]:
        return [i for i in self.issues if i.severity == "error"]

    @property
    def warnings(self) -> list[DriftIssue]:
        return [i for i in self.issues if i.severity == "warning"]

    @property
    def is_clean(self) -> bool:
        return len(self.errors) == 0

    def to_dict(self) -> dict:
        return {
            "checked_at": self.checked_at,
            "is_clean": self.is_clean,
            "errors": [i.to_dict() for i in self.errors],
            "warnings": [i.to_dict() for i in self.warnings],
            "canonical_nap": {
                "name": self.canonical_nap.name if self.canonical_nap else None,
                "address": (
                    f"{self.canonical_nap.address_line1}, "
                    f"{self.canonical_nap.address_city}, "
                    f"{self.canonical_nap.address_state} "
                    f"{self.canonical_nap.address_zip}"
                    if self.canonical_nap
                    else None
                ),
                "phone": self.canonical_nap.phone_display if self.canonical_nap else None,
                "email": self.canonical_nap.email if self.canonical_nap else None,
                "url": self.canonical_nap.url if self.canonical_nap else None,
            },
        }


# ---------------------------------------------------------------------------
# Layer 2 check: data package
# ---------------------------------------------------------------------------


def _extract_nap_references(text: str) -> list[tuple[int, str]]:
    """Find every NAP-like multi-line block in the text.

    A NAP block is a sequence of 4-6 lines that looks like
    "name\\naddress\\ncity, state zip\\nphone\\nemail\\nurl".
    Returns a list of (line_number, matched_block) pairs.
    """
    nap_pattern = re.compile(
        r"^(?P<line1>[A-Z][A-Za-z .]+)\n"  # business name
        r"(?P<line2>\d{3,6}\s+[A-Z][A-Za-z0-9 .]+(?:Rd|St|Ave|Blvd|Dr|Ln|Way|Pl))\n"  # street
        r"(?P<line3>[A-Z][a-z]+,\s+[A-Z]{2}\s+\d{5})\n"  # city, state, zip
        r"(?P<line4>[+()0-9 -]{10,})\n"  # phone
        r"(?P<line5>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\n"  # email
        r"(?P<line6>https?://[a-zA-Z0-9./-]+)$",  # URL
        re.MULTILINE,
    )
    results: list[tuple[int, str]] = []
    for m in nap_pattern.finditer(text):
        line_no = text[: m.start()].count("\n") + 1
        results.append((line_no, m.group(0)))
    return results


def check_data_package(nap: BusinessNAP, path: Path, report: DriftReport) -> None:
    """Verify the data package's NAP blocks match business.ts."""
    if not path.exists():
        report.issues.append(
            DriftIssue(
                layer="data-package",
                location=str(path.relative_to(REPO_ROOT)),
                severity="error",
                message="Data package not found.",
            )
        )
        return

    text = path.read_text(encoding="utf-8")

    # 1. Check every detected NAP block matches business.ts
    for line_no, block in _extract_nap_references(text):
        canonical = nap.nap_block
        if block.strip() != canonical.strip():
            report.issues.append(
                DriftIssue(
                    layer="data-package",
                    location=f"{path.relative_to(REPO_ROOT)}:{line_no}",
                    severity="error",
                    message="NAP block in data package doesn't match business.ts.",
                    expected=canonical,
                    actual=block,
                )
            )

    # 2. Check the 25-directory table count
    # The data package has a per-tier table with `^| \d+ | <name> |` rows.
    tier1 = re.findall(r"^\|\s*1\s*\|", text, re.MULTILINE)
    tier2 = re.findall(r"^\|\s*2\s*\|", text, re.MULTILINE)
    tier3 = re.findall(r"^\|\s*3\s*\|", text, re.MULTILINE)
    if not (tier1 and tier2 and tier3):
        report.issues.append(
            DriftIssue(
                layer="data-package",
                location=str(path.relative_to(REPO_ROOT)),
                severity="warning",
                message=(
                    "Could not find tier 1/2/3 tables in the data package. "
                    "If the document was restructured, this check needs updating."
                ),
            )
        )

    # 3. Check that all 25 directory slugs appear in the data package
    for d in DIRECTORIES:
        if d.slug not in text and d.name not in text:
            report.issues.append(
                DriftIssue(
                    layer="data-package",
                    location=f"directory #{d.number:02d} ({d.slug})",
                    severity="error",
                    message=(
                        f"Directory '{d.name}' ({d.slug}) is in the script's "
                        "DIRECTORIES list but missing from the data package. "
                        "Add a tier-table row + a per-directory notes block."
                    ),
                )
            )


# ---------------------------------------------------------------------------
# Layer 3 check: emitted blocks
# ---------------------------------------------------------------------------


def check_emission(nap: BusinessNAP, emission_dir: Path, report: DriftReport) -> None:
    """Verify every emitted per-directory block matches business.ts."""
    if not emission_dir.exists():
        report.issues.append(
            DriftIssue(
                layer="emission",
                location=str(emission_dir.relative_to(REPO_ROOT)),
                severity="warning",
                message=(
                    f"No emission directory at {emission_dir}. Run "
                    "`python scripts/citation-payload-generator.py emit --output "
                    f"{emission_dir.relative_to(REPO_ROOT)}/<date>/` before "
                    "submitting citations."
                ),
            )
        )
        return

    # Detect whether the path IS a date-stamped dir (has the 25
    # per-directory files) or is the PARENT of date-stamped dirs.
    has_25_files = sum(
        1
        for d in DIRECTORIES
        if (emission_dir / f"{d.number:02d}-{d.slug}.md").exists()
    )
    if has_25_files >= 20:
        # This is itself a date-stamped dir.
        latest = emission_dir
    else:
        # Find date-stamped subdirectories
        date_dirs = [d for d in emission_dir.iterdir() if d.is_dir()]
        if not date_dirs:
            report.issues.append(
                DriftIssue(
                    layer="emission",
                    location=str(emission_dir.relative_to(REPO_ROOT)),
                    severity="warning",
                    message=(
                        "Emission directory exists but contains no "
                        "date-stamped subdirectories (and no per-directory "
                        "files directly). Run `python scripts/citation-"
                        "payload-generator.py emit --output "
                        f"{emission_dir.relative_to(REPO_ROOT)}/<date>/`."
                    ),
                )
            )
            return
        # Use the most recent date-stamped directory
        date_dirs.sort(key=lambda d: d.name, reverse=True)
        latest = date_dirs[0]

    # Check each per-directory block
    for d in DIRECTORIES:
        filename = f"{d.number:02d}-{d.slug}.md"
        path = latest / filename
        if not path.exists():
            report.issues.append(
                DriftIssue(
                    layer="emission",
                    location=f"{latest.relative_to(REPO_ROOT)}/{filename}",
                    severity="error",
                    message=(
                        f"Emission file missing for {d.name} (expected {filename}). "
                        "Re-run the emit subcommand."
                    ),
                )
            )
            continue

        text = path.read_text(encoding="utf-8")

        # Verify the rendered NAP block is in the file
        expected_nap = render_nap_block(nap, d)
        if expected_nap not in text:
            report.issues.append(
                DriftIssue(
                    layer="emission",
                    location=f"{latest.relative_to(REPO_ROOT)}/{filename}",
                    severity="error",
                    message=(
                        f"NAP block in {filename} doesn't match what the "
                        "generator would emit. Re-run the emit subcommand "
                        "or hand-edit the file to match."
                    ),
                    expected=expected_nap,
                    actual="<missing or different>",
                )
            )

        # Verify the per-directory format overrides are applied
        expected_phone = format_phone(nap, d.phone_format)
        if expected_phone not in text:
            report.issues.append(
                DriftIssue(
                    layer="format-override",
                    location=f"{latest.relative_to(REPO_ROOT)}/{filename}",
                    severity="error",
                    message=(
                        f"Phone format '{d.phone_format}' not applied in "
                        f"{filename}. Expected '{expected_phone}'."
                    ),
                    expected=expected_phone,
                )
            )

        expected_url = format_url(nap, d.url_format)
        if expected_url not in text:
            report.issues.append(
                DriftIssue(
                    layer="format-override",
                    location=f"{latest.relative_to(REPO_ROOT)}/{filename}",
                    severity="error",
                    message=(
                        f"URL format '{d.url_format}' not applied in "
                        f"{filename}. Expected '{expected_url}'."
                    ),
                    expected=expected_url,
                )
            )

        # Verify the description variant is in the file
        if DESCRIPTION_VARIANTS[d.description_variant] not in text:
            report.issues.append(
                DriftIssue(
                    layer="emission",
                    location=f"{latest.relative_to(REPO_ROOT)}/{filename}",
                    severity="error",
                    message=(
                        f"Description variant '{d.description_variant}' not "
                        f"found in {filename}. The variant name or the text "
                        "may have drifted."
                    ),
                )
            )

    # Verify INDEX.md exists
    index_path = latest / "INDEX.md"
    if not index_path.exists():
        report.issues.append(
            DriftIssue(
                layer="emission",
                location=f"{latest.relative_to(REPO_ROOT)}/INDEX.md",
                severity="error",
                message="INDEX.md missing from the emission. Re-run the emit subcommand.",
            )
        )


# ---------------------------------------------------------------------------
# Internal-roster check: the script's DIRECTORIES list vs the data package
# ---------------------------------------------------------------------------


def check_internal_roster(report: DriftReport) -> None:
    """Sanity-check the DIRECTORIES list itself."""
    if len(DIRECTORIES) != 25:
        report.issues.append(
            DriftIssue(
                layer="internal-roster",
                location="citation_payload_generator.py:DIRECTORIES",
                severity="error",
                message=(
                    f"DIRECTORIES list has {len(DIRECTORIES)} entries; "
                    "expected 25. The OBJ-M2-006 exit criterion requires "
                    "exactly 25 citations."
                ),
            )
        )

    # Check for duplicate slugs
    seen_slugs: dict[str, int] = {}
    for d in DIRECTORIES:
        if d.slug in seen_slugs:
            report.issues.append(
                DriftIssue(
                    layer="internal-roster",
                    location=f"directory #{d.number:02d}",
                    severity="error",
                    message=(
                        f"Duplicate slug '{d.slug}' "
                        f"(also at #{seen_slugs[d.slug]:02d})."
                    ),
                )
            )
        seen_slugs[d.slug] = d.number

    # Check tier distribution (7 + 8 + 10 = 25)
    by_tier: dict[int, int] = {}
    for d in DIRECTORIES:
        by_tier[d.tier] = by_tier.get(d.tier, 0) + 1
    expected = {1: 7, 2: 8, 3: 10}
    for tier, count in expected.items():
        actual = by_tier.get(tier, 0)
        if actual != count:
            report.issues.append(
                DriftIssue(
                    layer="internal-roster",
                    location=f"tier {tier}",
                    severity="error",
                    message=(
                        f"Tier {tier} has {actual} directories; expected {count}. "
                        "Tier balance is part of the citation-build contract."
                    ),
                )
            )


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Citation drift monitor — internal-consistency check for the 25-citation build.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python scripts/citation-drift-monitor.py\n"
            "  python scripts/citation-drift-monitor.py --emission drafts/citations/2026-07-26/\n"
            "  python scripts/citation-drift-monitor.py --print-nap\n"
            "  python scripts/citation-drift-monitor.py --json\n"
        ),
    )
    parser.add_argument(
        "--emission",
        type=str,
        default=None,
        help="Specific date-stamped emission dir to check (default: latest in drafts/citations/).",
    )
    parser.add_argument(
        "--data-package",
        type=str,
        default=None,
        help="Specific data package path (default: content/marketing/citation-data-package.md).",
    )
    parser.add_argument(
        "--print-nap",
        action="store_true",
        help="Print the canonical NAP block from business.ts and exit.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output the drift report as JSON (for CI integration).",
    )
    args = parser.parse_args()

    if args.print_nap:
        nap = parse_business_ts()
        print(nap.nap_block)
        return 0

    # 1. Read canonical NAP
    try:
        nap = parse_business_ts()
    except (FileNotFoundError, ValueError) as exc:
        if args.json:
            print(
                json.dumps(
                    {
                        "is_clean": False,
                        "errors": [
                            {
                                "layer": "canonical",
                                "location": "apps/web/src/lib/business.ts",
                                "severity": "error",
                                "message": str(exc),
                            }
                        ],
                    }
                )
            )
        else:
            print(f"FAIL: {exc}", file=sys.stderr)
        return 2

    report = DriftReport(canonical_nap=nap)

    # 2. Check the internal roster
    check_internal_roster(report)

    # 3. Check the data package
    data_package = (
        Path(args.data_package) if args.data_package else DEFAULT_DATA_PACKAGE
    )
    check_data_package(nap, data_package, report)

    # 4. Check the emission
    if args.emission:
        emission = Path(args.emission).resolve()
    else:
        emission = DEFAULT_EMISSION_DIR
    check_emission(nap, emission, report)

    # 5. Output
    if args.json:
        print(json.dumps(report.to_dict(), indent=2))
    else:
        _print_human_report(report)

    return 0 if report.is_clean else 1


def _print_human_report(report: DriftReport) -> None:
    """Print the drift report in a human-readable format."""
    print("=== citation-drift-monitor ===\n")
    if report.canonical_nap:
        print("Canonical NAP (from apps/web/src/lib/business.ts):")
        for line in report.canonical_nap.nap_block.split("\n"):
            print(f"  {line}")
        print()

    n_errors = len(report.errors)
    n_warnings = len(report.warnings)

    if n_errors == 0 and n_warnings == 0:
        print("Result: CLEAN (no drift detected)")
        return

    if n_errors:
        print(f"ERRORS ({n_errors}):")
        for i, issue in enumerate(report.errors, 1):
            print(f"\n  [{i}] {issue.layer} :: {issue.location}")
            print(f"      {issue.message}")
            if issue.expected:
                print(f"      expected: {issue.expected!r}")
            if issue.actual:
                print(f"      actual:   {issue.actual!r}")
        print()

    if n_warnings:
        print(f"WARNINGS ({n_warnings}):")
        for i, issue in enumerate(report.warnings, 1):
            print(f"\n  [{i}] {issue.layer} :: {issue.location}")
            print(f"      {issue.message}")
        print()

    print(
        f"Result: {'CLEAN' if report.is_clean else 'FAIL'} "
        f"({n_errors} errors, {n_warnings} warnings)"
    )
    if not report.is_clean:
        print("\nFix the issues above, then re-run this script. Exit 0 = clean.")


if __name__ == "__main__":
    sys.exit(main())
