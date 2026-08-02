# 04 — PRP-B: Visual Evidence (7 Tasks)

**Document ID:** DOCS-BP-04-PRP-B
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent
**Review cadence:** Each task verified before send; full PRP-B reviewed quarterly

---

## 1. Purpose

This document is **PRP-B: Visual Evidence** — the second of three PRPs in the spec-driven framework. It contains 7 tasks, each a full Decision Template.

PRP-B addresses the visual evidence that supports the family package — hero images, mockups, tables of contents, version footers, diff artifacts, and the GBP visual gap. PRP-B does NOT cover textual corrections (PRP-A), family-investor-specific content (PRP-D), or scripts that build or send those things (support specs).

**Budget principle:** Tonight's visual budget is **$0**. Use existing approved real assets or omit. All mockups must be Gmail-safe HTML inline, labeled "Illustrative."

---

## 2. PRP-B task map

| Task | Title | Effort | Owner | Acceptance ID |
|---|---|---:|---|---|
| B-1 | Hero image to condensed plan cover | 15 min | Plan editor | B-AC1 |
| B-2 | Stripe invoice mockup to page 5 | 60 min | Plan editor | B-AC2 |
| B-3 | Google review mockup to page 7 | 30 min | Plan editor | B-AC3 |
| B-4 | Table of contents to condensed plan | 30 min | Plan editor | B-AC4 |
| B-5 | Version + revision date footer (all docs) | 30 min | Build steward | B-AC5 |
| B-6 | Auto-generate diff vs. previous version | 45 min | Build steward | B-AC6 |
| B-7 | Google Business Profile mockup to page 4 | 30 min | Plan editor | B-AC7 |

**Total PRP-B effort:** ~4 hours; budget-conditional.

---

## 3. Task B-1 — Hero Image to Condensed Plan Cover

**Problem.** The condensed PDF cover page has no visual anchor — only text. A small hero image (sun-bleached Largo morning, palm silhouette, lawn texture) would create visual identity and signal "this is a real local business."

**Context.** The project has an existing approved hero asset at `output/assets/business_plan_cover.jpg` (or equivalent) used in the landing page. That asset is steward-approved. Re-using it on the condensed PDF cover is safe.

**Requirements.**

- **Default: OMIT.** Tonight's deadline does not allow new asset creation, and an unapproved synthetic image reduces trust. The cover remains text-only with the existing brand colors.
- **Conditional:** If `output/assets/business_plan_cover.jpg` exists AND is steward-approved AND is used in the landing page without issue, embed it as `<img>` tag on the cover page with `alt="Largo morning, lawn texture, palm silhouette — illustrative"`. Width 100% of cover column. No background-image, no CSS-sprite, no float-left wrapping.
- **If used:** add the disclaimer `"Illustrative cover image. Actual service area photography to be captured in Q4 2026."` below the image.

**Alternatives considered.**

- **A. Use existing approved asset** — if it exists.
- **B. Omit** (default).
- **C. Create a new hero asset** — explicitly out of scope tonight.

**Evaluation matrix.**

| Option | Trust risk | Visual quality | Tonight-feasible |
|---|:-:|:-:|:-:|
| A | Low (existing approved) | Med | ✓ |
| B | None | None | ✓ |
| C | High (unapproved) | High | ✗ |

**Decision.** **B (default) — omit hero.** **A (conditional) — use only if existing approved asset is confirmed.**

**Risk.** Cover feels plain without a hero.
**Mitigation.** Use a strong typographic title block, the brand color band, and the chapter numbering.

**Rollback.** Remove `<img>` from template.

**Confidence.** 90%.

**Review date.** 2026-10-01.

**Acceptance evidence.** B-AC1 — either the existing approved asset is embedded with disclaimer OR no hero is embedded and the cover is text-only with brand color band.

---

## 4. Task B-2 — Stripe Invoice Mockup to Page 5

**Problem.** The condensed plan describes pricing ($48 weekly mowing, $185 mulching) but does not show what a customer invoice looks like. A mockup would ground the abstract pricing in a concrete artifact.

**Context.** Stripe is the documented payment processor (D-0002). The actual Stripe invoice format is well-known: line items, subtotal, tax, total, due date, recurring flag. A mockup demonstrates professionalism and demystifies the billing relationship.

**Requirements.**

- Inline HTML mockup (Gmail-safe) showing:
  - Vendor: "Largo Lawn LLC" (placeholder; final name confirmed at LLC formation)
  - Customer: "The Smith Family" (placeholder; no real customer name)
  - Service: "Weekly lawn maintenance — medium lot"
  - Frequency: "Recurring, every Tuesday"
  - Line items: Mowing $48.00; Subtotal $48.00; Sales tax (7.0%) $3.36; **Total $51.36**
  - Due date: "Next visit: Tuesday"
  - Cancellation: "Cancel any time, no fee"
  - Status: "Paid — card ending 4242"
- Prominent label above the mockup: `Illustrative example — not a live customer record.`
- Alt text on any visual element.
- Min 12pt body font in the mockup.

**Alternatives considered.**

- **A. Inline HTML mockup** (chosen).
- **B. Real Stripe screenshot** — not possible without an account.
- **C. Skip.**

**Evaluation matrix.**

| Option | Trust risk | Realism | Tonight-feasible |
|---|:-:|:-:|:-:|
| A | Low (labeled illustrative) | Med | ✓ |
| B | Low | High | ✗ (no account) |
| C | None | None | ✓ |

**Decision.** **A** — inline HTML mockup with explicit "Illustrative" label.

**Risk.** Reader confuses mockup with live record.
**Mitigation.** Prominent "Illustrative example — not a live customer record." label, plus a small "Stripe is a real payment processor" footnote.

**Rollback.** Remove mockup from page 5.

**Confidence.** 95%.

**Review date.** 2026-10-01.

**Acceptance evidence.** B-AC2 — Stripe mockup present on page 5 with "Illustrative" label; preflight checks label presence.

---

## 5. Task B-3 — Google Review Mockup to Page 7

**Problem.** The plan mentions customer reviews and reputation but does not show what a Google Business Profile review looks like. A mockup would ground the abstract "we collect reviews after every job" in a visible artifact.

**Context.** Per D-0013 (real testimonial policy), no fabricated testimonials are allowed. A mockup demonstrates the FORMAT, not a real review.

**Requirements.**

- Inline HTML mockup labeled:
  - `Sample review format — collects real customer feedback only after service delivery.`
- Mockup contents:
  - 5-star rating
  - Reviewer name: `Pat S.` (initials only; no fabricated full names)
  - Date: `2 weeks ago`
  - Body: 1–2 sentences describing service delivery (template language, not a real review)
  - Thumbs-up count: 0
- Alt text on visual elements.
- Footer: `Reviews are collected only after a service is delivered, never solicited before.`

**Alternatives considered.**

- **A. Inline HTML mockup with template language** (chosen).
- **B. Real Google review screenshot** — not allowed without explicit consent.
- **C. Skip.**

**Evaluation matrix.**

| Option | D-0013 compliance | Trust risk | Tonight-feasible |
|---|:-:|:-:|:-:|
| A | ✓ | Low (labeled) | ✓ |
| B | ✗ | Low (real) | ✗ |
| C | ✓ | None | ✓ |

**Decision.** **A** — inline HTML mockup, explicitly labeled as format-only.

**Risk.** Reader assumes the mockup is real.
**Mitigation.** Prominent label; template language; explicit footer about real-customer policy.

**Rollback.** Remove mockup from page 7.

**Confidence.** 95%.

**Review date.** 2026-10-01.

**Acceptance evidence.** B-AC3 — Google review mockup present on page 7 with format-only label; preflight checks label presence.

---

## 6. Task B-4 — Table of Contents to Condensed Plan

**Problem.** The condensed PDF has 12 pages of content but no in-document navigation aid. A reader may lose track of where they are, and the document is harder to discuss on the call.

**Context.** A 1-page table of contents with anchor links adds clarity without adding much visual weight.

**Requirements.**

- 1-page TOC with anchor links to the 12 sections of the condensed plan.
- Section titles match the PDF outline (e.g., "The Service," "The Market," "The Money," "The Plan," "The Risk," "The Ask," "The Returns," etc.).
- Page numbers reference the actual PDF page (verified by preflight).
- TOC appears after the cover and before the executive summary.

**Alternatives considered.**

- **A. 1-page TOC with anchor links** (chosen).
- **B. Sidebar TOC** — not Gmail-safe; risks layout breaks.
- **C. Skip.**

**Evaluation matrix.**

| Option | Navigation aid | Layout risk | Tonight-feasible |
|---|:-:|:-:|:-:|
| A | High | Low | ✓ |
| B | Med | High | ✓ |
| C | None | None | ✓ |

**Decision.** **A** — 1-page TOC with anchor links.

**Risk.** Page numbers drift when content changes.
**Mitigation.** Preflight verifies page numbers match section anchors.

**Rollback.** Remove TOC.

**Confidence.** 95%.

**Review date.** 2026-09-01.

**Acceptance evidence.** B-AC4 — TOC present, 12 section entries, anchor links resolve to actual sections.

---

## 7. Task B-5 — Version + Revision Date Footer (All Documents)

**Problem.** No document carries a visible version stamp. A reader cannot tell which version they are looking at.

**Context.** Per A-9, every document needs a footer. This is the visual instantiation of that requirement. Same format across all variants.

**Requirements.**

- Footer on every page of every variant.
- Footer contents:
  ```
  Largo Lawn · Mission 1
  Version 1.1 · <variant-name>
  Built 2026-07-28 · Source SHA: <short-sha>
  Forecast document; not a guarantee of results.
  ```
- Small text (8pt), monochrome.
- Same format across all variants.

**Alternatives considered.**

- **A. Footer on every page** (chosen).
- **B. Footer only on last page.**
- **C. Separate version page.**

**Evaluation matrix.**

| Option | Visibility | Intrusiveness | Tonight-feasible |
|---|:-:|:-:|:-:|
| A | High | Low (8pt) | ✓ |
| B | Med | Low | ✓ |
| C | High | Med | ✓ |

**Decision.** **A** — every page footer.

**Risk.** Footer takes up space.
**Mitigation.** 8pt, monochrome, bottom of page.

**Rollback.** Revert build script.

**Confidence.** 95%.

**Review date.** 2026-09-01.

**Acceptance evidence.** B-AC5 — `v1.1` and date present in both plan footers; preflight verifies.

---

## 8. Task B-6 — Auto-Generate Diff vs. Previous Version

**Problem.** When v1.1 ships, there is no human-readable record of what changed. A reviewer or future stakeholder cannot trace the evolution of the canonical artifact.

**Context.** A diff artifact captures the human-narrative changes (not just line-level diffs) — what facts changed, what was added, what was removed, what new disclosures appeared.

**Requirements.** `output/reports/diff_<from>_to_<to>.md` with:

- Version metadata (from-version, to-version, date, variant)
- Changed facts (3 corrected values, ARR headline, use-of-funds, etc.)
- Removed wrong facts (`$13/hr`, `6.75%`, `7.9–13%`)
- Added investor-facing disclosures (cap table, returns, FAQ, summary card)
- Changed sections (list of sections edited)
- Output hashes (input source SHA, output HTML SHA, output PDF SHA)
- Preflight result (exit code, gates passed, gates warned)
- Reviewer sign-off line (founder initials + date)

**Alternatives considered.**

- **A. Auto-generated narrative diff** (chosen).
- **B. Manual narrative diff.**
- **C. Skip.**

**Evaluation matrix.**

| Option | Reproducibility | Reviewer efficiency | Tonight-feasible |
|---|:-:|:-:|:-:|
| A | High | High | ✓ |
| B | Low | Med | ✓ |
| C | None | Low | ✓ |

**Decision.** **A** — auto-generated from build metadata.

**Risk.** Auto-generated diff may miss human-narrative context.
**Mitigation.** Manual section for "narrative summary" included.

**Rollback.** Delete diff file.

**Confidence.** 90%.

**Review date.** 2026-09-01.

**Acceptance evidence.** B-AC6 — `output/reports/diff_v1.0_to_v1.1.md` exists; covers all 4 categories above.

---

## 9. Task B-7 — Google Business Profile Mockup to Page 4

**Problem.** The plan describes the Google Business Profile (GBP) as the primary customer-acquisition channel but does not show what it looks like. A mockup would ground the abstract "you'll see us on Google" in a visible artifact.

**Context.** GBP is the #1 channel for local services per `research/distribution/cash-min-distribution-ideas.md`. A mockup demystifies the channel.

**Requirements.**

- Inline HTML mockup labeled:
  - `Sample Google Business Profile format — actual profile will go live after LLC formation.`
- Mockup contents:
  - Business name: "Largo Lawn" (placeholder)
  - Rating: 4.9 ★ (1 review — labeled "1 verified review")
  - Hours: "Mon–Sat 7am–6pm"
  - Phone: "(727) 555-0100" (placeholder)
  - Address: "Service area: Largo FL 33771 + 5 ZIPs"
  - "Get Quote" button (illustrative)
  - 2 customer photos (illustrative, labeled "Sample photos — actual photos to be captured")
- Alt text on visual elements.

**Conditional:** Only include if B-1 hero is omitted AND B-7 fills the visual gap on page 4.

**Alternatives considered.**

- **A. Inline HTML mockup, illustrative** (chosen if condition met).
- **B. Real GBP screenshot** — not allowed (would falsely claim a live listing).
- **C. Skip.**

**Evaluation matrix.**

| Option | Trust risk | Visual aid | Tonight-feasible |
|---|:-:|:-:|:-:|
| A | Low (labeled) | Med | ✓ |
| B | High (false claim) | High | ✗ |
| C | None | None | ✓ |

**Decision.** **A (conditional)** — only if B-1 is omitted.

**Risk.** Reader assumes the mockup is a live listing.
**Mitigation.** Prominent "Sample format" label; explicit "actual profile will go live after LLC formation" disclaimer.

**Rollback.** Remove mockup from page 4.

**Confidence.** 90%.

**Review date.** 2026-10-01.

**Acceptance evidence.** B-AC7 — GBP mockup present on page 4 with format-only label OR not present (with B-1 omitted, B-7 fills gap; with B-1 present, B-7 is omitted).

---

## 10. PRP-B summary

| Task | Effort | Confidence | Acceptance ID |
|---|---:|:-:|---|
| B-1 — Hero image | 15 min | 90% | B-AC1 |
| B-2 — Stripe mockup | 60 min | 95% | B-AC2 |
| B-3 — Review mockup | 30 min | 95% | B-AC3 |
| B-4 — TOC | 30 min | 95% | B-AC4 |
| B-5 — Version footer | 30 min | 95% | B-AC5 |
| B-6 — Diff artifact | 45 min | 90% | B-AC6 |
| B-7 — GBP mockup | 30 min | 90% | B-AC7 |
| **Total** | **~4 hours** | **avg 93%** | **7 ACs** |

PRP-B is budget-conditional. The minimum viable tonight is B-5 (footer), B-6 (diff artifact), and B-4 (TOC). B-1/B-2/B-3/B-7 are nice-to-have polish that do not block send.

---

## 11. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |