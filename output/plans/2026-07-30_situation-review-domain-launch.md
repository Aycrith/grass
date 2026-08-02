# Plan: Situation-Report Review — GRASS Domain + Launch Readiness

> **Status:** FINAL — steward-approved 2026-07-30. **Superseded by** `2026-07-31_strategy-rollout-adjustment.md` for execution planning. Preserved here for traceability of the foundation review.
>
> **Source-grounded in:** `output/reports/business_plan_improvement_analysis.md` (Mavis, 2026-07-28, 32 KB).
>
> **Synthesized with:** 471-line read-only technical audit (this session, 2026-07-30) + Documentation spectrum audit (this session) + Mission-state `state/ledger.yaml` (2026-07-29, 1 day old).

---

## Context

The user invoked `forge-skills:architecture-and-contracts` (re-purposed as a review task) to:

1. Review the comprehensive situation report produced by the **Mavis** agent on 2026-07-28 (`output/reports/business_plan_improvement_analysis.md`), which inventories the GRASS Mission 1 business plan deliverables and provides a prioritized improvement list.
2. Validate the **current state** of the project (ledger, git, technical, runtime).
3. Assess whether the **documentation spectrum** is sufficient to confidently:
   - Buy the domain (`LargoLawn.pro`)
   - Launch the paid pilot
4. Get a **clear recommendation** before any irreversible action.

The user explicitly chose two options:
- **Source:** Ground in `output/reports/business_plan_improvement_analysis.md`.
- **Outcome:** "Yes — proceed with domain+launch" (i.e., a clear YES with conditions, not a fence-sit).

---

## 1. Validation of the Source Report

The source report (`output/reports/business_plan_improvement_analysis.md`) is:

- **Self-described as:** "Comprehensive inventory, quality assessment, and prioritized improvement list for the GRASS Mission 1 business plan deliverables. This document is the input for the next spec/PRD cycle."
- **Authored by:** Mavis agent (one of the GRASS orchestrator agents), 2026-07-28.
- **Confirmed by:** Cross-agent provenance — the `.kilo/` plan (`C:\Users\camer\.kilo\plans\1785216463084-grass-investor-business-plan.md`) and `output/reports/development_plan_spec_driven.md` both cite this report as their primary input, explicitly naming the "MiniMax Code editor snapshot" as a corroborating source.
- **Scope:** Business plan deliverables (HTML/PDF, build scripts, snapshots, send log) — NOT the technical/runtime architecture. The user needs both.

**Source report validation:** ✅ The right source for the business plan side. ✅ Accurate about the business plan. ⚠️ Limited to the business plan deliverables — it does NOT cover the web app, the runtime architecture, paid pilot, or the technical integrations. Those come from the supplementary audits (this session).

---

## 2. Synthesis — Current State of the Project

The project has two parallel tracks that the user is conflating. They have **different readiness levels**.

### 2.1 Track A — Business Plan (Investor / Family Package)

**Source:** `output/reports/business_plan_improvement_analysis.md` (Mavis, 2026-07-28).

| Item | Status |
|---|---|
| Three rounds sent to choblo@gmail.com | ✅ All success=True in `~/.owl/sent_emails.jsonl` |
| Condensed 12-page plan (round 3) | ✅ Current canonical artifact for the founder |
| Long plan with evaluator's addendum | ⚠️ Reference; round 3 corrections applied |
| Three factual corrections (FL min wage, sales tax, net margin) | ✅ In condensed; ❌ **NOT propagated back to the long plan** |
| 8 evaluator recommendations | ✅ 4 adopted (condensed) / ❌ 4 still open in long plan |
| Visual evidence (GBP, Stripe, hero images) | ⚠️ Missing in condensed (text-only after round 3) |
| Wrapper script (`send_business_plan.py`) | ⚠️ Doesn't support condensed/with-evaluation flags |
| Preflight QA | ⚠️ Manual only; no automated regression gate |
| Snapshot discipline | ✅ 3 snapshots, reproducible from build scripts |

**Verdict — Business Plan:** 🟡 **YELLOW — Document is ready for the founder to read; not yet ready for the family-investor send.** The three factual corrections must propagate back to the long plan, and the wrapper/preflight gaps must close before any outbound send to gggrimshaw@gmail.com. The next family-investor send is **NOT in the same risk class as the original choblo self-sends** — it commits real money.

### 2.2 Track B — Paid Pilot Web App (Mission 1)

**Source:** 471-line audit (this session) + `state/ledger.yaml` (2026-07-29, working tree).

| Gate | Status |
|---|---|
| Stage 0 — Ratification | ✅ GREEN |
| Stage 1 — Landing spec | 🟡 DRAFT, no steward signoff |
| Stage 2 — Reliable lead capture | ✅ GREEN at HEAD (22/22 route tests, 107/107 total) |
| Stage 3 — Trustworthy attribution | ✅ GREEN at HEAD (85/85 attribution tests) |
| Stage 4 — `/pet-waste` page | ❌ **NOT ship-ready** (uncommitted, violates D-0064, D-0065, claims register) |
| Stage 5 — Google Search campaign | ⚠️ Pending; no confirmed credit, no ratified runbook |
| Stage 6 — Spend money | ❌ Hard-locked — must not start before Stage 4 ships |
| Runtime integrations (Supabase, Stripe, Twilio, Resend, Mapbox, Inngest, Jobber, Sentry) | ❌ **NOT actually wired** — `@grass/database.getClient()` throws "not implemented (Phase 4-5)" |
| `/api/lead` route | 🟡 GREEN at HEAD; **uncommitted working tree reintroduces GA4 + Meta CAPI + client tags** (hard-stop violation) |
| Twilio 10DLC | ❌ Unresolved |
| Domain (LargoLawn.pro) | ⚠️ Ratified (D-0007-B), pending steward click |
| Vercel production deployment | ⚠️ Config exists; no live deployment evidence in repo |

**Verdict — Paid Pilot:** 🟡 **YELLOW with multiple ❌ blockers.** The committed `feat/stage-3-trustworthy-attribution` branch IS shippable for landing-page traffic and lead capture (Stage 2 + 3 are genuine green). But the uncommitted working tree contains **hard-stop violations** that must be discarded before any spend, and the `/pet-waste` page is not ship-ready.

### 2.3 Documentation Spectrum (Supplementary Audit)

| Area | Status | Note |
|---|---|---|
| System architecture diagram | 🔴 **RED** | `architecture/04-systems-architecture.md` is 23 lines; no runtime diagram |
| Module contracts | 🟡 YELLOW | Twin docs are strong; `@grass/*` packages are stubs |
| Data-flow documentation | 🟡 YELLOW | Only `architecture/twin/README.md` (conceptual) |
| Failure-mode / error strategy | 🟡 YELLOW | Synthetic fallback exists; durable consent not wired |
| Deployment guide | 🟡 YELLOW | `deploy-vercel.mjs` + `15-pre-launch-runbook.md` cover happy path |
| Incident-response runbook | 🔴 **RED** | `docs/runbooks/` empty; `knowledge/postmortems/` template only |
| Cost model | 🟡 YELLOW | Observability $0–75/mo; financial projections in business plan |
| Integration-point inventory | 🟡 YELLOW | Real vs ADR-only mapping not centralized |
| Test strategy | 🟡 YELLOW | Strong taxonomy; e2e directory empty |
| Security model | 🟡 YELLOW | PII hashing, consent, secrets contracts; RLS/10DLC/RBAC declared but not implemented |
| Observability story | 🟡 YELLOW | Schemas + SLOs defined; no dashboards, no alerts |
| Onboarding guide | 🟡 YELLOW | CLAUDE.md is index; README is partial |

**Cross-cutting:** The user is right to hesitate. **The repository is rich on the business-plan side and the digital-twin-design side, but documentation-poor on the runtime architecture and operations side.** This is a real gap, not imagined.

---

## 3. Confidence Assessment — Buy the Domain & Launch?

### 3.1 Should you buy the domain?

**YES — proceed with the domain, but stop before spend.**

The domain is cheap (~$4.99–$9.15/yr on Vercel Registrar, per D-0062 drift) and reversible within the add-grace period. The risk-reward is one-sided. The domain is needed for:
- GBP (Google Business Profile) listing — D-0064 requires it before Stage 5
- /pet-waste canonical URL
- largolawn-xxxxx.vercel.app → clean homepage URL

**Conditions for the domain click:**
1. D-0007-B is already ratified (LargoLawn.pro brand).
2. The $4.99 vs $9.15 year-1 cost drift is acknowledged in D-0062 — pick the canonical figure (lean $9.15/go with the .pro registrar's actual price) and update the drift marker.
3. Lock the domain in Vercel Registrar (not a third party) so DNS + Vercel deploys share one admin.

### 3.2 Should you launch the paid pilot?

**CONDITIONAL YES — launch Steps 1–3 below, but DO NOT spend on Google Ads until Step 4.**

Sequence the launch in four gates. Each gate is a Go/No-Go decision the user makes.

**Gate 1 — Promote the canonical branch (pre-domain, no spend).**
- Commit the uncommitted state files (`state/ledger.yaml`, `state/risk-register.yaml`, `state/capability-registry.yaml`).
- Commit or discard D-0062 through D-0066.
- **MAYBE: ship the existing `feat/stage-3-trustworthy-attribution` HEAD to a Vercel preview** (`largolawn-xxxxx.vercel.app`) for landing-page traffic only — no GBP, no ads, no forms going to a real CRM. Run the smoke-test scripts (`smoke-test-prod.mjs`).
- **Outcome:** If smoke tests pass, the system is ready for the domain and the `/pet-waste` rebuild.

**Gate 2 — Buy the domain, point DNS at Vercel preview.**
- Click the Vercel Registrar buy on LargoLawn.pro (~$4.99–$9.15).
- Update the canonical URL in `app/layout.tsx`, `metadataBase`, and the `.env.example` `SITE_URL`.
- Run the smoke tests against `https://largolawn.pro/`.
- **Outcome:** If smoke tests pass, the canonical URL is live.

**Gate 3 — `/pet-waste` rebuild + Stage 4 sign-off.**
- DISCARD the uncommitted working tree's `/pet-waste/page.tsx` (currently violates D-0065, claims register, D-0064's Google-Search-only channel).
- DISCARD the uncommitted GA4/Meta/CAPI/ConsentBanner/AnalyticsProvider/track.ts work (hard-stop violation).
- Re-author `/pet-waste` against the Stage 1 spec + D-0065: $7.50 first cleanup, $15/week recurring, Google Search only, no unsubstantiated claims, no client analytics.
- Run Playwright visual regression, Lighthouse, a11y, CTA tests, real-device passes.
- **Outcome:** If all pass, the page is ship-ready.

**Gate 4 — Stage 5 campaign readiness (where spend happens).**
- Author `docs/runbooks/pilot-operations.md` (the missing artifact).
- Confirm Google Ads credit availability (D-0064 commits to free credits first).
- Confirm Twilio 10DLC registration status.
- Wire the Phase 4-5 packages (Supabase `/@grass/database`, durable `/api/lead` persistence, durable STOP/HELP) — or PAUSE SMS acks entirely if 10DLC is not yet live.
- Steward sign-off on Stage 1 spec (`docs/specs/paid-pilot-landing-spec.md`).
- **Outcome:** If all pass, flip the ads switch via the pre-launch runbook.

**Total Gate 1–4 effort:** 18–26 hours of focused agent work, plus one founder click (domain).

### 3.3 What can go wrong if you skip a gate

| Skipped gate | Failure mode | Cost |
|---|---|---|
| Buy domain without committing state files | Drift accumulates; the 8-day-old ledger rule fails again | Low |
| Skip the working-tree revert | GA4/Meta ship to production; D-0064 violated; TCPA exposure | High |
| Skip `/pet-waste` rebuild | Page goes live with unsubstantiated claims; D-0065 violated; brand damage | High |
| Skip Twilio 10DLC | SMS messages filtered by carriers; legal exposure under TCPA | High |
| Skip Supabase wiring | Lead capture is in-memory only; D-0066's durable consent unmatched | Critical |
| Skip Stage 5 ops runbook | Campaign oversight absent; CAC > $138 trigger undetected | Medium |

---

## 4. The Pre-Launch Checklist (MUST-DO before domain + launch)

Sequenced by risk. Each item is a hard precondition; the founder approves each as it's met.

### Tier 0 — Foundation (before anything)

- [ ] **F0.1** Commit the updated `state/ledger.yaml`, `state/risk-register.yaml`, `state/capability-registry.yaml` (currently uncommitted, 1 day old on disk).
- [ ] **F0.2** Commit or discard D-0062 through D-0066 (currently untracked).
- [ ] **F0.3** Resolve D-0061 numbering gap (file does not exist; either close or ratify).
- [ ] **F0.4** Update `CLAUDE.md` (currently says Phase 0 / Day 3; reality is Phase 2 / Day 14).
- [ ] **F0.5** Pick the canonical tax/wage/domain-cost figure (D-0062 reconciliation) and propagate.

### Tier 1 — Business Plan Integrity (parallelizable with Tier 2)

These are PRP-A's Tier-1 items from the source report. These are the **highest-leverage correctness fixes** and can ship independently.

- [ ] **B1.1** Propagate the three factual corrections (FL min wage, sales tax, net margin) back to the long plan (`output/procurement/business_plan_grass_mission1_with_evaluation.pdf`).
- [ ] **B1.2** Add explicit Y1 ARR headline ($62,100) to the long plan's executive summary and the condensed plan's at-a-glance page.
- [ ] **B1.3** Adopt the remaining 4 evaluator recommendations in the long plan: gross-margin-to-first-hire transition, post-credit CAC forecast, named AI model provider (or "to be named" with criteria), 3 additional risks.
- [ ] **B1.4** Create `output/reports/business_plan_condensed.md` (mirrors the HTML; reviewable source).
- [ ] **B1.5** Extend `scripts/send_business_plan.py` to support `--condensed` and `--with-evaluation` flags.
- [ ] **B1.6** Add a `preflight.py` script that runs Gmail-safe-HTML checks automatically.
- [ ] **B1.7** Add a `SUMMARY.md` to each snapshot directory.

### Tier 2 — Tech Hygiene (uncommitted working tree)

- [ ] **T2.1** **DISCARD** the uncommitted `apps/web/src/lib/server-track.ts` (GA4 MP + Meta CAPI). Hard-stop violation.
- [ ] **T2.2** **DISCARD** the uncommitted `apps/web/src/components/analytics/AnalyticsProvider.tsx` and `ConsentBanner.tsx` (reverses S3.10).
- [ ] **T2.3** **DISCARD** the uncommitted `apps/web/src/lib/track.ts` (window.gtag / window.fbq). Stage 3 gate violation.
- [ ] **T2.4** Revert the uncommitted `apps/web/src/app/pet-waste/page.tsx` to the Stage 1 spec + D-0065.
- [ ] **T2.5** Revert the uncommitted `apps/web/src/app/api/lead/route.ts` to the HEAD Stage 2/3 version (drop analytics_consent, event_id, form_variant).
- [ ] **T2.6** Decide: keep Gmail SMTP + Nodemailer (current build) OR revert to Resend (D-0002). One ADR; both are defensible — pick one and commit.
- [ ] **T2.7** Author `docs/runbooks/pilot-operations.md` (the missing artifact flagged by Agent 2 and Agent 3).

### Tier 3 — Architecture Documentation (the gap you felt)

This is the "sufficient spectrum of development documentation" question. The answer is **no — the current architecture docs are insufficient**, but you can ship without writing the full architecture document IF you accept that the runtime architecture is **discoverable from code** for now.

- [ ] **A3.1** Replace `architecture/04-systems-architecture.md` (currently 23 lines) with a real runtime diagram showing: Browser → Vercel edge → Next.js routes → `@grass/*` packages → external providers (Gmail SMTP, Twilio, PostHog, GA4 if re-added). **Even 80 lines with a Mermaid diagram is enough.** This is the single highest-leverage doc fix.
- [ ] **A3.2** Add a `docs/contracts/` directory with one contract per `@grass/*` package boundary (crm-core, notifications-core, payments-core, scheduling-core, database, auth). Use the forge-skills contract template.
- [ ] **A3.3** Author `docs/architecture/integration-points.md` — one table per external provider (Gmail SMTP, Twilio, PostHog, Mapbox, Jobber, Stripe, Supabase): contract, env var, where it's wired, where it's stubbed, owner-agent.
- [ ] **A3.4** Author `docs/runbooks/incident-response.md` — first-responder steps for "/api/lead 500ing", "Twilio failure", "PostHog outage", "rollback Vercel deploy", "data deletion request".
- [ ] **A3.5** Close the D-0062 drift with a verification script (pytest that asserts the corrected numbers are present in all artifacts).

### Tier 4 — Production Wiring (the "is it actually wired" test)

- [ ] **P4.1** Wire `@grass/database` to Supabase (currently throws "not implemented"). OR document explicitly that the pilot runs in-memory and the email inbox is the canonical record (D-0066 conflict).
- [ ] **P4.2** Wire durable STOP/HELP for Twilio (D-0066 requires; Phase 4-5).
- [ ] **P4.3** Register Twilio 10DLC and confirm sending path.
- [ ] **P4.4** Confirm Google Ads credit availability (D-0064).
- [ ] **P4.5** Confirm Vercel production deployment (run `deploy-vercel.mjs` once; capture URL).

### Tier 5 — Pre-Launch Verification (the smoke)

- [ ] **V5.1** `bun run test:charter` — green.
- [ ] **V5.2** `bun run validate` — green (lint + typecheck + charter).
- [ ] **V5.3** `apps/web/scripts/smoke-test-prod.mjs https://largolawn.pro` — 8/8 GREEN.
- [ ] **V5.4** `apps/web/scripts/smoke-email.mjs` — real email arrives in `LEAD_NOTIFY_TO` within 30s.
- [ ] **V5.5** Submit a real lead from `/pet-waste`; confirm it reaches notify inbox AND a PostHog `generate_lead` event fires (server-side).
- [ ] **V5.6** `bun run audit:phase-0` — review the artifact (currently stale; refresh).

---

## 5. Recommended Decision Sequence

The user must make these decisions in order. Each is a single Go/No-Go.

| Step | Decision | Question | Default if no answer |
|---|---|---|---|
| 1 | Foundation | Approve Tier 0 commits? | NO — block all subsequent steps |
| 2 | Domain | Click LargoLawn.pro on Vercel Registrar? | YES — domain is cheap and reversible |
| 3 | Tech hygiene | Discard uncommitted GA4/Meta + revert /pet-waste? | YES — hard-stop violations |
| 4 | Architecture | Approve A3.1 (rebuild 04-systems-architecture.md) before /pet-waste rebuild? | YES — needed for stakeholder confidence |
| 5 | /pet-waste | Author `/pet-waste` against Stage 1 spec + D-0065? | YES — without it, pilot has no surface |
| 6 | Pilot go-live | Flip the Google Ads switch? | NO — wait until Tier 4 + Tier 5 are green |

---

## 6. Verification — How to Confirm Each Gate Is Green

After each gate, the user can verify by running:

```bash
# Tier 0 — Foundation
git status                              # uncommitted state files should be committed
ls governance/decisions/                # 0062-0066 present
git log --grep="Phase 2" -1 --oneline   # ledger updated

# Tier 1 — Business Plan Integrity
python scripts/preflight.py output/procurement/*.html
git diff HEAD~1 output/procurement/     # corrections propagated

# Tier 2 — Tech Hygiene
git diff --stat                         # no uncommitted GA4/Meta
grep -r "fbq\|gtag" apps/web/src/lib/   # should be empty

# Tier 3 — Architecture
wc -l architecture/04-systems-architecture.md  # should be > 23
ls docs/runbooks/                              # should have files

# Tier 4 — Production Wiring
bun test platform/packages/database/     # Supabase wired
twilio phone-numbers:list               # 10DLC registered

# Tier 5 — Pre-Launch Verification
bun run validate
node apps/web/scripts/smoke-test-prod.mjs https://largolawn.pro
node apps/web/scripts/smoke-email.mjs
```

---

## 7. Open Questions for the Founder

These are branch points the user must decide. The plan defaults are below; change any of them.

1. **Buy the domain now, or wait for Tier 0 + Tier 1 to ship?**
   - **Default:** Buy now — domain is cheap and reversible; needed for GBP.
2. **Do the business plan corrections (Tier 1) ship BEFORE the family-investor send, or in the same send?**
   - **Default:** Before — the founder-send-confirms-funding path is the highest-leverage channel.
3. **Should the architecture doc (A3.1) be written before /pet-waste rebuild, or after?**
   - **Default:** Before — the user explicitly said they want documentation confidence; writing the doc surfaces hidden assumptions.
4. **Gmail SMTP (Nodemailer) vs Resend (D-0002)?**
   - **Default:** Gmail SMTP — already built, working, free. Resend is a future migration.
5. **Is the family investor the same person as the choblo founder self-send, or a different recipient?**
   - **MEMORY.md** shows the family investor is `gggrimshaw@gmail.com` (separate address). This was sent 2026-07-28T19:46:58, status PENDING.
6. **Should the next family-investor send wait for the v3.0-v3.4 corpus to be coherent, or send the current v3.4 PDF now?**
   - **Default:** Wait — the D-0062 Critical tax drift is unresolved (deferred to 2026-09-15).
7. **Should Phase 4-5 packages (Supabase, durable STOP/HELP) block launch, or launch with SMS acks paused?**
   - **Default:** Block — D-0066 requires durable consent.

---

## 8. Source-Report Validation Going Forward

The Mavis source report is a strong inventory. Its **Tier 1 recommendations (PRP-A "Plan Integrity") are correct and should be the next business-plan work.** The Agent 2 audit and Agent 3 documentation audit extend its scope to the technical/runtime side and surface the gaps below.

**Recurring-coverage proposal:** Once per week, the steward runs a "situation report" cycle that consists of:
- Re-read `state/ledger.yaml` (verify <7 days old)
- Re-run `bun run validate`
- Re-run `git status` (verify no uncommitted hard-stop violations)
- Re-read `state/risk-register.yaml` (verify top 3 risks still mitigated)

This is **Tier 0 in disguise**. Implementing it as a once-weekly cron replaces the "single agent asked for a situation report" pattern with a standing discipline.

---

## 9. One-line Bottom Line

**The business plan deliverables are ready for the founder (the choblo self-sends). The next outbound family-investor send and the paid pilot launch require closing the working-tree hard-stop violations, wiring the Phase 4-5 packages, and authoring the missing runtime architecture — but the underlying engineering (Stage 2 + Stage 3 at HEAD) is genuinely green, and the domain is cheap enough to buy today as the first action.** The user's hesitation is justified on the technical/runtime side, not on the business-plan side. The four-gate sequence above converts the hesitation into a sequenced action plan.

---

## 10. Critical Files Referenced (in this plan)

- **Source report:** `C:\Users\camer\DEVNEW\GRASS\output\reports\business_plan_improvement_analysis.md`
- **Technical audit:** `C:\Users\camer\.claude\plans\review-the-comprehensive-situation-purring-kurzweil-agent-ad18d57f7356503dc.md` (471 lines, this session)
- **State:** `C:\Users\camer\DEVNEW\GRASS\state\ledger.yaml` (1 day old on disk)
- **Stage 2 evidence:** `C:\Users\camer\.claude\projects\C--Users-camer-DEVNEW-GRASS\memory\stage-2-lead-reliability-complete-2026-07-29.md`
- **D-0064 (paid pilot):** `C:\Users\camer\DEVNEW\GRASS\governance\decisions\0064-paid-acquisition-pilot.md`
- **D-0066 (SMS consent):** `C:\Users\camer\DEVNEW\GRASS\governance\decisions\0066-outbound-sms-consent.md`
- **Architecture to rebuild:** `C:\Users\camer\DEVNEW\GRASS\architecture\04-systems-architecture.md` (23 lines)
- **Pre-launch runbook:** `C:\Users\camer\DEVNEW\GRASS\output\gtm\15-pre-launch-runbook.md`
- **Smoke test:** `C:\Users\camer\DEVNEW\GRASS\apps\web\scripts\smoke-test-prod.mjs`
- **Deploy script:** `C:\Users\camer\DEVNEW\GRASS\apps\web\scripts\deploy-vercel.mjs`
- **Family investor at-risk send:** `C:\Users\camer\.claude\projects\C--Users-camer-DEVNEW-GRASS\memory\investor-live-send-2026-07-28.md` (PENDING INVESTOR RESPONSE)

---

## 11. Plan-Mode Fit Check

**Observed fit issues:**

- This is a **review task**, not an architecture-and-contracts implementation. The `forge-skills:architecture-and-contracts` skill was repurposed as a review checklist — appropriate per the user's framing, but the skill's primary contract (writing `.forge/architecture.md`, `.forge/contracts/`, `.forge/adr/`) was not executed. The user explicitly asked for a situation report, not the three contract artifacts.
- The `.forge/` directory does not exist in this repo — the skill's expected output paths (`/forge/prd.md`, `.forge/architecture.md`, `.forge/contracts/`, `.forge/adr/`) are absent. The repo uses `constitution/`, `governance/`, `architecture/`, `knowledge/` instead — the GRASS-native equivalents.
- If the user wants to proceed to forge-skills outputs after this review, the next session would need to explicit conflict-resolve the `.forge/` vs GRASS-native convention.
- **The architecture-and-contracts skill's contract tables, Mermaid diagrams, and ADR format will be the right template for Tier 3 (A3.1–A3.5) when the user is ready to author the runtime architecture document.** Recommend the user invokes this skill fresh in a future session for A3.1 specifically.

**No fit issues for the user's actual request** (situation report review + clear recommendation).

---

## 12. Supersession Notice

This plan is **superseded by** `2026-07-31_strategy-rollout-adjustment.md` for execution. The newer plan:

- Replaces the 4-gate launch sequence with a 6-gate rollout (Foundation Cleanup → Pilot Surface → Pilot Launch → Pilot Outcome ADR → Service Lineup Expansion → Full Rollout).
- Sequences the 20-service brainstorm behind verifiable ADRs (4-state rollout).
- Aligns all surfaces (website, ads, GBP, citations, business plan, governance) to a single set of canonical sources.
- Identifies the **structural conflict** between the binding D-0064 governance and the work built later in the working tree (GA4/Meta/CAPI/ConsentBanner/track.ts).
- Preserves the binding pilot scope (Google Search only, pet waste only) while documenting the path to expansion.

This plan remains as the **foundation review** — the answer to "should I buy the domain?" and "is the documentation sufficient?" The strategy plan is the answer to "how do we adjust the business offerings across all surfaces going forward?"

Both plans are read together for any future work that requires either the foundation review or the rollout strategy.
