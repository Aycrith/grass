# Audit 1 — Documentation Inventory (2026-07-30)

> **Read-only audit.** Output of the Explore agent dispatched during the situation-review session.
>
> **Scope:** Every `*.md`, `*.yaml`, `constitution/`, `governance/`, `state/`, `architecture/`, `knowledge/`, `agents/`, `research/`, `docs/`, `output/procurement/`, `output/gtm/` artifact relevant to the business plan or paid pilot.
>
> **Source:** Agent 1 of 3 (parallel).

---

## 11 Categories of Drift

The single most important finding: the documentation has **multiple competing versions of the same fact** across surfaces. None of these is a single source of truth.

| # | Item | Where it varies | Canonical figure |
|---|---|---|---|
| 1 | **Sales tax** | `research/pricing/price-book.yaml` says 6.75%; `architecture/twin/invoice.md` says 6.75%; `output/procurement/business_plan_*.html` says 7.0% (after correction) | **7.0%** (FL 6 + Pinellas 1) — D-0062 `tax_6_75_to_7_0` CRITICAL |
| 2 | **FL min wage** | `business_plan_*.html` says $13/hr; `architecture/twin/*` says $14/hr or $15/hr | **$14/hr** (2026 effective) / **$15/hr** (post-election) — D-0062 `fl_min_wage_13_to_14_15` HIGH |
| 3 | **Domain cost** | `state/ledger.yaml` says $4.99; `docs/business-plan/05-prp-d-family-investor-package.md` says $9.15 | **$9.15/yr** (Namecheap) — D-0062 `domain_cost_4_99_to_9_15` MEDIUM |
| 4 | **Loan ask** | `output/procurement/business_plan_grass_v3.0.html` says $12,000; `business_plan_grass_condensed.html` and `docs/business-plan/05-prp-d-family-investor-package.md` say $15,000 | **$15,000** — D-0062 `loan_ask_15K_canonical` HIGH |
| 5 | **Service pricing** | `research/pricing/price-book.yaml` has $38–$115 mowing tier table; ads say "$25+ per visit" or "$45 average"; Thumbtack says "$40-60" | **price-book tier table** — D-0062 `pricing_ladder_reconcile` HIGH |
| 6 | **ZIP list** | `content/facts.yaml`, `apps/web/src/lib/business.ts`, GBP setup, all ads → 6 ZIPs consistent (`33770, 33771, 33773, 33774, 33778, 33756`) | **6 ZIPs** confirmed |
| 7 | **Pet waste pricing** | D-0064/D-0065 + landing spec: $7.50 first + $15/wk; ads say $0 free first; Thumbtack says $15/visit; draft says $25 biweekly / $40 one-time | **Layered**: free first → $15/wk → $25 biweekly → $40 one-time — D-0062 `pet_waste_pricing_ladder` HIGH |
| 8 | **Hurricane prep pricing** | `output/gtm/03-google-ads-campaign-draft.md`: $175 pre / $350 light / $650 heavy. Not in any other surface. | **$175 / $350 / $650** — D-0062 `hurricane_prep_pricing_ladder` HIGH |
| 9 | **Insurance claim** | D-0065 says $1M general liability; `apps/web/src/app/terms/page.tsx` and `FinalCTABanner.tsx` both reference "$1M insured"; GBP setup mentions "policy on request" pattern | **"$1M insured" until policy number on hand, then "policy on request"** — D-0062 `insurance_claim_unverified` HIGH |
| 10 | **Tenure claim** | `/pet-waste` page + ads say "since 2020"; GBP description + Yelp bio say "since 2026" | **Drop "since" entirely** per D-0064 §0.10 — D-0062 `since_2020_unsupported` MEDIUM |
| 11 | **Operator strip SLA** | `/pet-waste` says 5-min text; `OperatorStrip` says 18h median (different metric, but confuses readers) | **Remove 18h median for pilot** — D-0062 `md_5min_18h_sla_conflict` MEDIUM |

---

## Capability Registry (`state/capability-registry.yaml`)

**6 registered capabilities:**

| ID | Name | Maturity |
|---|---|---|
| `cap_mowing_standard` | Weekly & biweekly mowing | pilot |
| `cap_edging_hard_edge` | Hard-edge edging | pilot |
| `cap_mulching_install` | Mulch installation | pilot |
| `cap_hedge_trim` | Hedge trimming | pilot |
| `cap_lead_capture_gbp` | GBP lead capture | binding |
| `cap_pet_waste_cleanup` | Pet waste cleanup (per D-0065) | pilot |

**4 reserved** (placeholder, awaiting D-0062× cleanup):
- `cap_hurricane_prep` (deregistered; needs reinstatement)
- `cap_palm_trim` (deferred — license decision)
- `cap_pool_cage_clean` (deferred — demand validation)
- `cap_pressure_wash_soft` (deferred — equipment decision)

---

## Twin Models (`architecture/twin/`)

Strong documentation. Models exposed: `Service`, `Customer`, `Property`, `Crew`, `Equipment`, `Vehicle`, `Job`, `Invoice`, `Schedule`, `Route`, `Quote`, `Lead`, `Marketing`, `KPI`.

- `service.md` — 9 service_line enum values present, including `pet_waste_cleanup`.
- `invoice.md` — has 6.75% tax (stale; must be 7.0% per D-0062).
- `README.md` — explains the twin-model concept, links to all models.

**No Mermaid runtime diagram** in `architecture/04-systems-architecture.md` (23 lines, mostly placeholder).

---

## Risk Register (`state/risk-register.yaml`)

Top 5 risks (this session's snapshot):
1. **R-PILOT-001** — Day 7 < 3 qualified leads → pause + D-0067 ADR. Likelihood 3, impact 5.
2. **R-PILOT-004** — No qualified leads by Day 14 → pilot abort. Likelihood 2, impact 5.
3. **R-SMS-002** — Twilio 10DLC not registered → SMS acks filtered. Likelihood 4, impact 4 (highest open risk).
4. **R-CAP-002** — Pet-waste reverts to Month-10 candidate (D-0065 reversibility clause). Likelihood 1, impact 5.
5. **R-DRIFT-001** — D-0062 unresolved drift breaks business plan send. Likelihood 2, impact 4.

---

## Recent Commit Discipline (this session's snapshot)

Last 5 commits:
```
56a4012 fix(privacy,tests): B-3a + test-coverage gaps surfaced by 2nd-pass review
4a287c3 fix(attribution): resolve 5 PR #1 blockers (B-1..B-5)
c36fa77 S3.12: attribution tests (5 files) — Stage 3 acceptance
3ef5156 S3.11: legacy lead source migration parser (Q-4 — ship in same PR)
09de521 S3.10: remove CookieConsent banner; add footer analytics notice (Q-5)
```

**Stage 2 + Stage 3 at HEAD are genuinely green** (22/22 route tests + 85/85 attribution tests). The challenge is the working tree, not the committed history.

---

## Business Plan Structure

Two competing artifacts:
- `output/procurement/business_plan_grass_v3.0.html` → 12-page, $12K ask (older, superseded)
- `output/procurement/business_plan_grass_condensed.html` → 12-page, $15K ask (current, sent to choblo 2026-07-28)

Plus `docs/business-plan/05-prp-d-family-investor-package.md` ($15K ask, evaluators' addendum).

**Three rounds sent to choblo@gmail.com** — all `success=True` in `~/.owl/sent_emails.jsonl`. **One family-investor send** to `gggrimshaw@gmail.com` 2026-07-28T19:46:58 — status PENDING.

---

## Recommended Single Source of Truth

The Drift Triad (per strategy plan §7.1):

| Artifact | Role | Currently? |
|---|---|---|
| `content/facts.yaml` | Canonical numerics | New target — must be created/populated |
| `state/capability-registry.yaml` | Canonical service catalog | Exists, partial |
| `architecture/twin/service.md` | Canonical service_line enum | Exists, strong |

**Mitigation:** `bun run validate:drift` script (Gate 1, T1.4 deliverable) that diffs the three artifacts.

---

## What this audit did NOT cover

- Live website state (covered by Audit 2).
- Ad/GTM artifacts (covered by Audit 3).
- Code-side drift (covered by Audit 2 + 3 combined).
- Memory / knowledge architecture (intentional omission — those snapshots are auto-managed).
