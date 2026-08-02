# CHANGELOG

All notable changes to the GRASS business-plan artifacts are documented here.
Format: [version] — date — summary.

---

## [2.0] — 2026-07-28

**Family seed-loan package pivot (Option C: 0% loan, not SAFE).**

### Changed

- **Family investor instrument**: SAFE (Option A, previously recommended) → 0% family loan (Option C, founder-selected). No equity issued; founder is the personal obligor; 50% of monthly free cash flow applied to outstanding principal; 24-month term; Month 12 mid-term review. Rationale: founder preference; matches D-0011 cash-min model; simplest and clearest for a family context.
- **Family cover letter tone**: warm story → receipts-first business case. 8 paragraphs, no warmth hedge. Lead with the receipts; ask comes second; relationship is last.
- **Summary card**: fridge-magnet metaphor (v1.1) → one-page business case (v2.0). A4 landscape → A4 portrait. Six sections in order: Business → Ask → Marketing & acquisition → Profitability → Repayment → Risk.
- **Long plan v1.1 patch** (per PRP-A A-1/A-2/A-3):
  - Added `$62,100` Year-1 gross revenue headline in at-a-glance stat grid (was net-only).
  - Added FL min wage `$14/hr` current → `$15/hr` 2026-09-30 (per FL Constitution Amendment 2) in first-hire wage assumption.
  - Added First-hire margin transition section: `74%` Year-1 gross margin → `45–55%` post-first-hire.
  - Added Post-credit CAC forecast: `$90–$200/customer` after the 30–60-day free-credit window.
  - Named AI model provider: Claude (Anthropic) as primary; secondary-model fallback; 4-hour retry queue; manual operating window on extended outage.
  - Added two new risks to §14 risk table: AI model provider outage + Agent drift.
- **Subject line** for family send: "Largo Lawn — business plan + loan request (Largo FL) — YYYY-MM-DD" (dropped "and a question" softness).
- **Pre-correction facts now enforced by automated gates** (negation-aware forbidden-marker scanner; HTML-escape-aware corrected-fact scanner).
- **cp1252 console artifact** fixed in send wrapper (`sys.stdout.reconfigure(encoding="utf-8")` + `PYTHONIOENCODING=utf-8`).

### Added

- `docs/business-plan/05-prp-d-family-investor-package.md` — PRP-D spec.
- `docs/business-plan/18-founder-decisions.md` — Q1–Q16 founder decisions, LOCKED.
- 9 support specifications under `docs/business-plan/support/`.
- `scripts/send_family_package.py` — PRP-D send wrapper (negation-aware, corrected-fact-aware).
- `scripts/build_summary_card.py` — one-page business-case renderer (v2.0).
- `scripts/build_family_cover_letter.py` — receipts-first cover-letter renderer.
- `scripts/preflight.py` — standalone preflight (callable from CI / pre-send).
- `scripts/versioning.py` — central footer + VERSION + git SHA + source hash.
- `scripts/write_snapshot_summary.py` — auto-generate snapshot SUMMARY.md.
- `scripts/build_diff_artifact.py` — auto-generate long-plan v1.0 → v1.1 diff.
- `VERSION` — current version (`2.0`).
- `output/snapshots/2026-07-28T04-30_post_long_plan_v1.1/SUMMARY.md` — new snapshot.
- `output/reports/diff_long_plan_v1.0_to_v1.1.md` — diff artifact.

### Known limitations (carried forward)

- Operational artifacts still carry pre-correction values (`architecture/twin/invoice.md`, `content/templates/invoice-template.md`, `research/regulatory/largo-licensing-map.yaml`, `state/ledger.yaml`). Flagged as **D-0062 Source Reconciliation Exception** for next cycle per the drift policy.
- Long plan artifacts still pre-date the version-stamp convention; this is intentional (long plan is reference-only per Q5; family package is the canonical artifact).

---

## [1.1] — 2026-07-28 (interim, superseded by 2.0)

- Condensed 12-page PDF delivered (218 KB).
- Pinellas sales tax corrected to `7.0%` (FL DOR DR-15DSS 2026).
- Landscaping net margin range corrected to `10–15%` (NALP/IBISWorld 2026).
- Sent to choblo@gmail.com (founder staging) at 2026-07-28 00:41:09.

---

## [1.0] — 2026-07-27

- Initial long business plan build (15 sections, full QA pass).
- Cover letter v1.0.
- Pre-correction facts present ($13/hr, 6.75%, 7.9–13%) — corrected in v1.1.