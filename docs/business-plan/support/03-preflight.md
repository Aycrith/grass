# S-03 — Preflight & Gmail QA (`scripts/preflight.py`)

**Document ID:** DOCS-BP-S-03-PREFLIGHT
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent + build steward

---

## 1. Purpose

This document specifies `scripts/preflight.py` — the standalone preflight gate that validates every artifact before send. It blocks send on any blocking failure.

---

## 2. Entry point

```bash
python scripts/preflight.py [flags]
```

### 2.1 Flags

| Flag | Effect |
|---|---|
| `--check-facts` | Run drift check only (per S-01) |
| `--check-headline` | Verify $62,100 ARR headline + net profit label |
| `--check-evaluator-recs` | Verify four evaluator recommendations present |
| `--check-mockup-label --page N` | Verify illustrative mockup label on page N |
| `--check-toc` | Verify TOC present and anchors resolve |
| `--check-footer` | Verify version stamp footer present |
| `--check-no-placeholders --family-only` | Verify no `[FOUNDER_CONFIRM]` in family artifacts |
| `--check-no-guarantees` | Verify no "guaranteed return" language |
| `--check-traceability` | Verify every dollar traceable |
| `--check-card-disclaimer` | Verify summary card has "forecast" disclaimer |
| `--variant <variant>` | Restrict checks to one variant |
| (no flags) | Run all checks |

---

## 3. Blocking checks

These exit 1 on failure:

### 3.1 HTML structure

- **0 `background-image`** in `<style>` or inline styles (Gmail strips background images)
- **0 `background-url`** anywhere
- **0 `position:absolute`** or **`position:fixed`** (Gmail rendering unreliable)
- **0 `<script>`** tags (Gmail strips scripts)
- **Balanced `<table>` open/close** (verified via parser)
- **All `<img>` have `alt`** attribute
- **No empty `src`** attributes
- **No `javascript:`** in `href`

### 3.2 Content

- **No stale wrong facts.** Check generated HTML does not contain `$13/hr`, `6.75%`, `7.9–13%` (the 3 corrections).
- **Required version stamp** present in footer.
- **No unresolved `[FOUNDER_CONFIRM]`** placeholders in family package.
- **Required headline present** ($62,100 ARR + $16,590 net profit).
- **All watch-list facts** present in generated HTML (per facts.yaml).

### 3.3 PDF structure

- **No blank pages** (page count > 0 and every page has content).
- **Page count ≥ 1.**
- **No zero-byte attachments.**
- **PDF metadata title** matches variant name.

### 3.4 Family-specific

- **No "guaranteed return"** language.
- **Every dollar in use-of-funds** has a corresponding receipt/invoice/ledger entry reference.
- **Summary card** has "Forecast, not a promise" disclaimer.
- **Illustrative mockups** have visible "Illustrative" label.
- **Cap table** has no unresolved percentages.

---

## 4. Warning checks (non-blocking)

- **Cover letter size threshold:** < 100 KB or warning.
- **Accessibility lint:** Min 12pt font; WCAG AA contrast (4.5:1 for body, 3:1 for large); no information conveyed by color alone.
- **Image count:** No more than 5 images per page (Gmail spam heuristics).
- **Link count:** No more than 20 links per email.

---

## 5. Implementation pattern

```python
def main():
    args = parse_args()
    artifacts = discover_artifacts(args.variant)

    blockers = []
    warnings = []

    for artifact in artifacts:
        # HTML checks
        if artifact.endswith('.html'):
            text = read_text(artifact)
            blockers += check_html_structure(text)
            blockers += check_no_stale_facts(text)
            warnings += check_accessibility(text)

        # PDF checks
        if artifact.endswith('.pdf'):
            blockers += check_pdf_structure(artifact)

    if args.family_only:
        blockers += check_family_specific(artifacts)

    if blockers:
        print_blockers(blockers)
        sys.exit(1)

    if warnings:
        print_warnings(warnings)

    sys.exit(0)
```

---

## 6. Output format

On success:

```
[PASS] No stale wrong facts.
[PASS] All required footers present.
[PASS] No unresolved placeholders.
[PASS] All attachments Gmail-safe.
[PASS] PDF structure OK.
Exit 0.
```

On failure:

```
[FAIL] Stale fact detected: '6.75%' on line 142 of output/procurement/business_plan_grass_mission1_v1.1.html
[FAIL] Placeholder unresolved: '[FOUNDER_CONFIRM]' in output/procurement/cover_letter_v1.1_family.html
Exit 1.
```

---

## 7. Allow-list mechanism

Legitimate exceptions can be allow-listed with comments:

```html
<!-- preflight-allow: position:absolute is intentional for hero banner -->
<div style="position:absolute; ...">...</div>
```

Allow-list is enforced by line comments only. Strict mode (`--strict`) ignores allow-list.

---

## 8. Acceptance evidence

- **A-AC8:** `scripts/preflight.py` exits 0 on all current artifacts; exits 1 on injected failures.

---

## 9. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |