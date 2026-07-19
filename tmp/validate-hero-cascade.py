#!/usr/bin/env python3
"""
Read-only validation for the 4 newly-authored hero-cascade files.
Runs 5 verification blocks sequentially; exits 0 if all pass, 1 if any fail.

Authored by Buffy's validation pass on the 4-cascade ADR package:
  apps/web/visual/inventory/2026-07-17-hero-refinement-spec.md
  governance/decisions/0043-palette-rebuild.md
  governance/decisions/0044-viewport-motion-architecture.md
  governance/decisions/0045-structural-cascade.md
  + state/ledger.yaml updates

Usage: python tmp/validate-hero-cascade.py
"""
import sys
from pathlib import Path

ROOT = Path(r"C:/Users/camer/DEVNEW/grass")
SPEC = ROOT / "apps/web/visual/inventory/2026-07-17-hero-refinement-spec.md"
ADRS = [
    ROOT / "governance/decisions/0043-palette-rebuild.md",
    ROOT / "governance/decisions/0044-viewport-motion-architecture.md",
    ROOT / "governance/decisions/0045-structural-cascade.md",
]
LEDGER = ROOT / "state/ledger.yaml"

DECISION_TEMPLATE_SECTIONS = [
    "Problem", "Context", "Requirements", "Alternatives",
    "Evaluation matrix", "Decision", "Risk", "Rollback",
    "Confidence", "Review date",
]

fail_count = 0


def fail(msg):
    global fail_count
    fail_count += 1
    print(f"  X  {msg}")


def ok(msg):
    print(f"  V  {msg}")


# ---------------------------------------------------------------------------
# Block 1: state/ledger.yaml YAML parses cleanly post-update
# ---------------------------------------------------------------------------
print("\n=== Block 1: state/ledger.yaml YAML parse ===")
try:
    import yaml
    with open(LEDGER, encoding="utf-8") as fh:
        data = yaml.safe_load(fh)
    ratified = data["decisions"]["ratified"]
    ratified_ids = [r["id"] for r in ratified]
    expected_ids = {"D-0001", "D-0002", "D-0003", "D-0004",
                    "D-0043", "D-0044", "D-0045"}
    missing = expected_ids - set(ratified_ids)
    if missing:
        fail(f"missing ratified IDs: {missing}")
    else:
        ok(f"ratified IDs present: {sorted(expected_ids)}")
        for d in ratified:
            if d["id"] in {"D-0043", "D-0044", "D-0045"}:
                print(f"         {d['id']}: confidence={d['confidence']:.2f}, "
                      f"review={d['review_date']}, file={d['decision_file']}")
    n_changelog = len(data["changelog"])
    print(f"         changelog entries = {n_changelog}")
    print(f"         first changelog entry date = {data['changelog'][0]['date']}")
    print(f"         first changelog entry by   = {data['changelog'][0]['by']}")
except Exception as e:
    fail(f"YAML parse failed: {type(e).__name__}: {e}")


# ---------------------------------------------------------------------------
# Block 2: each ADR has all 10 Decision Template sections
# ---------------------------------------------------------------------------
print("\n=== Block 2: 10-section template check (per ADR) ===")
for adr in ADRS:
    txt = adr.read_text(encoding="utf-8")
    h2s = [l[3:].strip() for l in txt.splitlines() if l.startswith("## ")]
    missing_sections = [s for s in DECISION_TEMPLATE_SECTIONS if s not in h2s]
    if missing_sections:
        fail(f"{adr.name} missing: {missing_sections}")
    else:
        ok(f"{adr.name}: 10/10 Decision Template sections present")


# ---------------------------------------------------------------------------
# Block 3: spec has all 9 sections (§0..§8)
# ---------------------------------------------------------------------------
print("\n=== Block 3: spec has sections §0..§8 ===")
txt = SPEC.read_text(encoding="utf-8")
h2s = [l[3:].strip() for l in txt.splitlines() if l.startswith("## ")]
expected_spec_prefixes = [f"§{i}" for i in range(9)]
found_prefixes = [h[:2] for h in h2s]
missing_spec = [e for e in expected_spec_prefixes if e not in found_prefixes]
if missing_spec:
    fail(f"spec missing sections: {missing_spec}")
else:
    ok(f"spec has all §0..§8 sections")
    print(f"         found: {h2s}")


# ---------------------------------------------------------------------------
# Block 4: cross-reference integrity (spec↔ADR bidirectional)
# ---------------------------------------------------------------------------
print("\n=== Block 4: cross-reference integrity ===")
spec_txt = SPEC.read_text(encoding="utf-8")
for adr in ADRS:
    fname = adr.name
    in_spec = fname in spec_txt
    adr_txt = adr.read_text(encoding="utf-8")
    spec_cited = "2026-07-17-hero-refinement-spec.md" in adr_txt
    if not in_spec:
        fail(f"spec does NOT cite {fname}")
    else:
        ok(f"spec -> {fname}: cited")
    if not spec_cited:
        fail(f"{fname} does NOT cite spec")
    else:
        ok(f"{fname} -> spec: cited")


# ---------------------------------------------------------------------------
# Block 5: code-reviewer fixes applied
# ---------------------------------------------------------------------------
print("\n=== Block 5: code-reviewer fixes verification ===")

# Fix Q5: <noscript> removed from D-0045 cascade diagram
d0045 = (ADRS[2]).read_text(encoding="utf-8")
if "<noscript>" in d0045:
    fail("D-0045 still contains <noscript> (Q5 fix not applied)")
else:
    ok("D-0045 <noscript> removed (Q5 fix applied)")

# Fix Q5: <picture> inner <img> pattern present in D-0045
if "<picture>" in d0045 and "<source" in d0045:
    ok("D-0045 <picture><source> + inner <img> pattern present (Q5 fix applied)")
else:
    fail("D-0045 missing <picture><source> inner-<img> pattern (Q5 fix not applied)")

# Fix Q7: useViewportMotion in its own file (not co-located in variants.tsx)
d0044 = (ADRS[1]).read_text(encoding="utf-8")
if "useViewportMotion.tsx" in d0044:
    ok("D-0044 useViewportMotion.tsx (own file) referenced (Q7 fix applied)")
else:
    fail("D-0044 missing useViewportMotion.tsx reference (Q7 fix not applied)")

# Spec §3 mirrors Q7 fix
if "useViewportMotion.tsx" in spec_txt:
    ok("spec §3 mirrors Q7-fix file placement")
else:
    fail("spec §3 missing useViewportMotion.tsx reference")

# Fix Q6: D-0045 confidence is now 0.78 (not 0.82)
if "**0.78**" in d0045:
    ok("D-0045 confidence updated to 0.78 (Q6 fix applied)")
else:
    fail("D-0045 confidence not 0.78 (Q6 fix not applied)")

# Ledger D-0045 confidence entry is now 0.78
try:
    import yaml
    with open(LEDGER, encoding="utf-8") as fh:
        data = yaml.safe_load(fh)
    d0045_ledger = next(r for r in data["decisions"]["ratified"] if r["id"] == "D-0045")
    if abs(d0045_ledger["confidence"] - 0.78) < 0.01:
        ok(f"ledger D-0045 confidence = {d0045_ledger['confidence']} (Q6 fix applied)")
    else:
        fail(f"ledger D-0045 confidence = {d0045_ledger['confidence']} (expected 0.78)")
except Exception as e:
    fail(f"could not verify ledger D-0045 confidence: {e}")

# Fix Q3: cascade layer mapping section in D-0045
if "Cascade layer mapping" in d0045 or "catalog-to-cascade" in d0045:
    ok("D-0045 catalog-to-cascade mapping note present (Q3 fix applied)")
else:
    fail("D-0045 missing catalog-to-cascade mapping note (Q3 fix not applied)")


print(f"\n=== Summary ===  failures: {fail_count}")
sys.exit(1 if fail_count else 0)
