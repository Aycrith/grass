# S-02 — Build Pipeline (`scripts/build_business_plans.py`)

**Document ID:** DOCS-BP-S-02-BUILD-PIPELINE
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent + build steward

---

## 1. Purpose

This document specifies the unified build pipeline — the single entry point that replaces three separate build scripts. It is the contract for how every variant of the business plan is built.

---

## 2. Entry point

`scripts/build_business_plans.py` is the canonical entry point.

```bash
python scripts/build_business_plans.py --variant <variant> [flags]
```

### 2.1 Variants

| Variant | Output | Use |
|---|---|---|
| `long` | `output/procurement/business_plan_grass_mission1_v1.1.{html,pdf}` | Reference only |
| `condensed` | `output/procurement/business_plan_grass_condensed_v1.1.{html,pdf}` | Reader-facing canonical |
| `evaluation` | `output/procurement/business_plan_grass_mission1_with_evaluation_v1.1.{html,pdf}` | Long + evaluator addendum |
| `family` | All of: condensed + cover letter + summary card | Tomorrow's send |
| `summary-card` | `output/procurement/business_plan_grass_summary_card_v1.1.{html,pdf}` | One-pager |
| `both` | Long + condensed + evaluation | All reference artifacts |

### 2.2 Flags

| Flag | Effect |
|---|---|
| `--check-only` | Run all gates but do not write output |
| `--no-pdf` | HTML only |
| `--diff <from> <to>` | Generate `output/reports/diff_<from>_to_<to>.md` |
| `--version <version>` | Override version stamp (default: read from `VERSION`) |

---

## 3. Build sequence

```
1. Validate dependencies (weasyprint, markdown, PyYAML, etc.)
2. Load content/facts.yaml
3. Run drift check against output/reports/facts.lock.yaml (exit 1 on drift)
4. Render template(s) to HTML
5. Run scripts/preflight.py on HTML (exit 1 on failure)
6. Convert HTML → PDF (weasyprint or similar)
7. Stamp version footer per S-05
8. Compute hashes (input source SHA, output HTML SHA, output PDF SHA)
9. Generate diff artifact if --diff flag set
10. Write build log to output/reports/build_log_<timestamp>.json
```

**Refuses to write output if any required gate fails.**

---

## 4. Templates

Templates live in `templates/`:

```
templates/
  long_plan.html.j2
  condensed_plan.html.j2
  evaluation_addendum.html.j2
  cover_letter_family.html.j2
  summary_card.html.j2
  base.html.j2
```

Jinja2 syntax. Templates receive a context dict containing:

```python
{
    "facts": [...],          # from content/facts.yaml
    "version": "1.1",
    "build_date": "2026-07-28",
    "source_sha": "<git-sha>",
    "variant": "family",
    "sections": [...],       # content sections
    "images": [...],         # image manifest
    "tone": "family",        # family | founder | technical
}
```

---

## 5. Brand tokens

`content/brand_tokens.yaml` provides:

```yaml
brand:
  name: "Largo Lawn"
  primary: "#1f3a2e"     # deep-green
  secondary: "#c87f3a"   # sun
  sand: "#f5ebd9"        # sand-bleached
  cream: "#faf6ee"
typography:
  display: "Fraunces"
  body: "Inter"
spacing:
  xs: 0.5rem
  sm: 1rem
  md: 2rem
  lg: 4rem
```

All templates reference tokens; no hardcoded colors or fonts.

---

## 6. Acceptance evidence

- **A-AC8:** Preflight exits 0 on all current artifacts.
- **A-AC9:** All variants build from one entry point; preflight + drift-check gate enforced.

---

## 7. Failure modes

| Mode | Behavior |
|---|---|
| Facts YAML missing | Exit 1 with "facts.yaml not found" |
| Drift detected | Exit 1 with fact ID and previous value |
| Template syntax error | Exit 1 with template path and Jinja error |
| WeasyPrint not installed | Exit 1 with install instructions |
| Preflight fails | Exit 1 with gate ID and offending pattern |

---

## 8. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |