# S-08 — Visual Evidence & Accessibility

**Document ID:** DOCS-BP-S-08-VISUAL-EVIDENCE
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent + plan editor

---

## 1. Purpose

This document specifies the visual evidence rules: what images are allowed, how mockups are labeled, accessibility standards, and Gmail-safe HTML restrictions.

---

## 2. Image policy

| Type | Allowed? | Notes |
|---|---|---|
| **Real, approved** | ✓ | Used in landing page (e.g., hero photo of Largo morning) |
| **Illustrative mockup** | ✓ | Labeled "Illustrative example — not a live customer record." |
| **Synthetic / AI-generated** | ⚠ Conditionally | Only if steward-approved AND labeled "AI-generated" |
| **Stock photography** | ⚠ Conditionally | Only if clearly labeled |
| **Real customer photo** | ✗ | Requires explicit written consent; deferred to D-0013 |
| **Fabricated review** | ✗ | Per D-0013, no fabricated testimonials |

---

## 3. Image specifications

| Property | Specification |
|---|---|
| Format | JPG or PNG |
| Max width | 1200px (Gmail-safe) |
| Max file size | 200 KB per image |
| Alt text | Required for every `<img>` |
| Decorative images | Use `alt=""` |
| Alignment | Inline only (no float) |
| Wrapping | No text wrap; break to new column or page |

---

## 4. Mockup rules

Every mockup MUST carry a visible label:

| Mockup | Label |
|---|---|
| Stripe invoice | `Illustrative example — not a live customer record.` |
| Google review | `Sample review format — collects real customer feedback only after service delivery.` |
| GBP listing | `Sample Google Business Profile format — actual profile will go live after LLC formation.` |
| Email screenshot | `Sample email format — actual outreach will be customized per recipient.` |
| Pricing chart | `Illustrative pricing — actual prices subject to change per quote.` |

Labels must be **prominent** (≥ 14pt, italic, or in a bordered box) and **above or beside** the mockup, not buried in fine print.

---

## 5. Accessibility standards

WCAG 2.1 AA compliance (warn-only in preflight, not blocking):

| Property | Standard |
|---|---|
| **Min font size** | 12pt body text |
| **Min heading size** | 16pt |
| **Contrast ratio (body)** | 4.5:1 |
| **Contrast ratio (large)** | 3:1 |
| **Color-only info** | Forbidden; use shape + text + color |
| **Alt text** | Required on every `<img>` |
| **Heading hierarchy** | h1 → h2 → h3, no skipping |
| **Links** | Descriptive text (no "click here") |
| **Tables** | `<th>` for header cells |

### 5.1 Brand color contrast (verified)

| Combination | Ratio | Standard |
|---|---:|---|
| Deep-green text on cream | 8.4:1 | AAA |
| Sand-bleached text on deep-green | 8.4:1 | AAA |
| Sun text on cream | 4.6:1 | AA |
| Sun text on deep-green | 5.2:1 | AA |
| Black text on cream | 14:1 | AAA |

All brand color combinations meet or exceed AA.

---

## 6. Gmail-safe HTML restrictions

Gmail strips or unreliable-renders:

| Restricted | Why | Alternative |
|---|---|---|
| `<script>` | Stripped | Static content only |
| `background-image` | Stripped | `<img>` tags |
| `position:absolute` | Rendering breaks | Block layout |
| `position:fixed` | Stripped | Block layout |
| External CSS | Stripped | Inline `<style>` in `<head>` |
| External fonts | Sometimes stripped | Web-safe fonts with fallbacks |
| JavaScript | Stripped | None |
| `<form>` | Stripped | Plain text links |
| `<iframe>` | Stripped | None |

---

## 7. B-1, B-2, B-3, B-7 mockup implementations

### B-1 — Hero image (conditional, default omitted)

If used: `<img src="output/assets/business_plan_cover.jpg" alt="Largo morning, lawn texture, palm silhouette — illustrative" style="width:100%;">` with disclaimer below.

### B-2 — Stripe invoice mockup

Inline HTML with table layout. Borderless cells. Monospace font for amounts.

### B-3 — Google review mockup

Inline HTML with star icons (★ ☆) as plain text, no images.

### B-7 — GBP mockup (conditional, default omitted)

Inline HTML with text-only listing. No Google logo.

---

## 8. Acceptance evidence

- **B-AC1:** Hero asset embedded with disclaimer OR no hero embedded (text-only with brand color band).
- **B-AC2:** Stripe mockup on page 5 with "Illustrative" label.
- **B-AC3:** Google review mockup on page 7 with format-only label.
- **B-AC7:** GBP mockup on page 4 with format-only label OR not present.

---

## 9. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |