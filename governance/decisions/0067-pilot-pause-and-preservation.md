# D-0067 — Pilot pause + GRASS preservation posture (owner pivot 2026-07-31)

**Date:** 2026-07-31
**Status:** RATIFIED 2026-07-31
**Author:** Claude Code (with steward)
**Scope:** Repo-wide preservation posture. Pauses the D-0064 paid-acquisition pilot at pre-launch (no ad spend ever incurred), removes the D-0064 §0.9 hard-stop violations that were committed to the working tree, and captures the pivot in a single commit + tag so the steward can resume cleanly from a new business/strategy.
**Review date:** 2027-01-31 (6 months — enough time for the steward to return to GRASS or to confirm the pivot is permanent)
**Confidence (shipped):** 0.85
**Supersedes:** none — this is the first pivot post-D-0064 ratification.

---

## 0. The decision in one paragraph

Pause the D-0064 paid-acquisition pilot at pre-launch. **No ad spend was ever incurred.** No customer commitments exist. Remove the §0.9 hard-stop violations that were committed to the working tree (GA4 + Meta Pixel + Meta CAPI + ConsentBanner + client-side tracking tags) so the repo, when the steward (or a future agent) returns, does not start the next session with a hidden compliance violation. Capture the pivot in **one commit + tag `pre-pivot-2026-07-31`** so the resume procedure is a single documented step. The D-0062 drift items remain deferred to the Q3 2026 reconciliation cycle per the original D-0062 ADR — this pivot does not change that posture.

---

## 1. Problem

The steward (Cameron) is pivoting to a new business/strategy. The GRASS repository is at a well-defined state: the D-0064 paid-acquisition pilot has been ratified but not launched (no Google Ads account created, no daily budget set, no spend). The risk is that the repo sits idle for weeks/months and:

- **Working-tree drift accumulates** — uncommitted hard-stop violations (GA4/Meta/CAPI/ConsentBanner) were committed to the working tree but never deployed; if the steward (or a future agent) returns and pushes them, the next session starts with a compliance violation.
- **Context is lost** — the 2026-07-31 strategy plan, the 6 state files, and the 6 governance ADRs are the institutional context; without a single documented resume procedure, a future session may relitigate decisions that were already settled.
- **Pilot obligations lag** — D-0064 commits to a 5-min lead response SLA, no Meta Pixel, no client-side analytics. If the steward wants to step out for 6+ months and then come back, the pilot posture must be unambiguous: paused or never-started.

The owner explicitly said: "I am planning to switch to developing a new business/strategy. I want this approach and its content saved in a responsible status which leaves thing in a proper clean status that will be easy to resume if necessary."

---

## 2. Context

What we know at the pivot date:

- **State at pivot:** Phase 2 Day 14 of 30. D-0064/0065/0066 ratified 2026-07-28. Pet-waste capability registered. /api/lead hardened at Stage 2/3 (22/22 route tests + 85/85 attribution tests green at HEAD). The Next.js 15 web app builds, typechecks, and passes 107/107 unit tests in `apps/web/tests/`.
- **What was NOT done:** No Google Ads account created. No Meta Pixel deployed. No Twilio A2P 10DLC registration. No GBP profile created. No Sunbiz LLC filing. No $1M GL insurance binding. No <$100 ad spend. No customers. No leads.
- **Working-tree state:** 42 uncommitted landing-page polish WPs (per the prior session memory). The D-0064 §0.9 hard-stop violations (GA4/Meta/CAPI/ConsentBanner/client-side tracking) were committed to the working tree but never deployed; they would be a compliance violation if deployed.
- **Capacity for cleanup:** One agent session. The owner is no longer the steward of the active codebase going forward (the next business/strategy is the active focus).

What we explicitly don't know:

- Whether the steward will return to GRASS in 6 months or ever. The pivot is unconditional.
- Whether the D-0062 drift items will be resolved by Q3 2026 — that decision is deferred to the original D-0062 ADR.

---

## 3. Required cleanup actions

A successful pivot must:

1. **Remove the D-0064 §0.9 hard-stop violations** from the working tree:
   - Delete `apps/web/src/components/analytics/` (5 files: AnalyticsProvider.tsx, ConsentBanner.tsx, ConsentBanner.module.css, GoogleAnalytics.tsx, MetaPixel.tsx).
   - Delete `apps/web/src/lib/server-track.ts` (GA4 MP + Meta CAPI fire-path).
   - Delete `apps/web/src/lib/track.ts` (window.gtag / window.fbq client-side tracking).
   - Delete `apps/web/src/lib/event-id.ts` (only consumed by the deleted files).
   - Remove AnalyticsProvider + ConsentBanner imports + JSX from `apps/web/src/app/layout.tsx`.
   - Remove GA4/CAPI fire-path from `apps/web/src/app/api/lead/route.ts`; preserve the server-side PostHog `fireLeadCapturedEvent` (the only allowed analytics fire-path per D-0064 §0.9).
   - Remove `trackFormStart`, `trackGenerateLead`, `eventId`, `analyticsConsent`, `form_variant` from `ContactForm.tsx`; the form payload keeps attribution fields (utm_source, gclid, etc.) but loses the analytics-consent/`event_id` denormalization.
   - Remove `trackContactClick` from `SiteHeader.tsx` (3 onClick handlers).
   - Strip `gtag`, `fbq`, `dataLayer`, `__analyticsConsent` from `apps/web/src/types/window.d.ts`.
2. **Annotate state files** — `state/ledger.yaml`, `state/risk-register.yaml`, `state/capability-registry.yaml` — with the pivot status. Pilot risks (R-PILOT-001..006) and capability risks (R-CAP-001..004) and SMS risks (R-SMS-001..004) all flipped to status=PAUSED with a `[STATUS: PAUSED 2026-07-31 per D-0067]` annotation in the description.
3. **Add R-PIVOT-001** — a new risk for "repo-forgetting" — to make the preservation work itself auditable.
4. **Add D-0067 + D-0068 to the ratified decisions list** in `state/ledger.yaml` (D-0064/0065/0066 were already authored as files but never registered in the ledger; this commit closes that gap).
5. **Write `output/plans/RESUMING.md`** — a step-by-step procedure the steward (or future agent) follows to resume GRASS in <10 minutes.
6. **Single commit + tag `pre-pivot-2026-07-31`** — the entire pivot is one atomic commit; the tag is the resume anchor.
7. **Verify the cleanup** — `bun run typecheck` PASS, `apps/web/tests/` 107/107 PASS, no `fbq`/`gtag`/`__analyticsConsent` matches in `apps/web/src/`.

---

## 4. Alternatives considered

| Option | Approach | Pro | Con | Verdict |
|---|---|---|---|---|
| A | **This ADR** — single preservation commit + tag, hard-stop cleanup, state annotation, RESUMING.md | Atomic; documented; clean resume | One-time cleanup effort | **Selected** |
| B | Leave the working tree as-is, write RESUMING.md | Lowest effort tonight | The next session starts with a compliance violation if anyone pushes the WIP | **Rejected** |
| C | Push the existing WIP to a `pivot-2026-07-31` branch, leave main untouched | Preserves the WIP for archaeology | The WIP is not architecturally meaningful; the cleanup is the durable artifact | **Rejected** |
| D | Archive the whole repo to a tarball, tag the commit, and start fresh | Cleanest possible slate | Loses the 2026-07-31 strategy plan + state files + audit trail | **Rejected** |

---

## 5. Decision

**Selected: Option A.** Single preservation commit + tag `pre-pivot-2026-07-31`. Hard-stop violations removed. State files annotated. `output/plans/RESUMING.md` written. D-0068 (landscape-capability-archive) ratified as the companion: all 6 active capabilities moved to status=reserved.

---

## 6. Risk register additions

A new risk is added to `state/risk-register.yaml`:

| Risk ID | Title | Likelihood | Impact | Score | Owner | Mitigation |
|---|---|---|---|---|---|---|
| R-PIVOT-001 | Repo-forgetting: GRASS resume fails because of working-tree rot or lost context | 3 (possible) | 4 (major) | 12 | knowledge | Single commit + tag; output/plans/RESUMING.md; status=PAUSED annotations on R-PILOT/R-CAP/R-SMS; capabilities moved to status=reserved per D-0068; sprint hygiene (commit at least weekly). |

R-PILOT-001..006, R-CAP-001..004, R-SMS-001..004 are all annotated with `[STATUS: PAUSED 2026-07-31 per D-0067 — pilot never launched]`. The risk scores are preserved (not zeroed) so a future reviewer can audit the original risk posture.

---

## 7. Rollback / Resume

The pivot is reversible. To resume GRASS:

1. **Read `output/plans/RESUMING.md`** (the step-by-step resume procedure).
2. **Checkout the tag:** `git checkout pre-pivot-2026-07-31` (or `git checkout main` if not on it).
3. **Author D-0069** (Pilot Outcome ADR) — this is the gate to first ad spend per D-0064 §6.
4. **Walk the 6 gates** in `output/plans/2026-07-31_strategy-rollout-adjustment.md` §8: foundation cleanup → pilot surface → pilot launch → pilot outcome ADR → service lineup expansion → full rollout.
5. **Commit at least weekly** during the new business/strategy so the next pivot (if any) starts from a clean working tree.

No irreversible ops occurred during the pivot. No domain was purchased. No customer data was collected. No ad spend was incurred. The D-0062 drift items remain deferred to Q3 2026 per the original D-0062 ADR — unchanged by this pivot.

---

## 8. What is NOT changed by this ADR

- **D-0064** (paid-acquisition pilot scope) — still RATIFIED. The pilot is the binding posture if the steward resumes. The pause is administrative, not a ratification change.
- **D-0065** (pet-waste service ratification) — still RATIFIED. Per D-0065 §0.7, the capability reverts to status=reserved if the pilot aborts; D-0068 records that revert.
- **D-0066** (outbound SMS consent) — still RATIFIED. The consent language is binding on any future form that ships.
- **D-0062** (source reconciliation exception) — still RATIFIED. Drift items remain deferred to Q3 2026.
- **D-0063** (Claude/Anthropic AI provider claim) — still RATIFIED. The 6-hour manual-window policy stands.
- **D-0001..D-0060** — all still RATIFIED. No historical ADR is changed.

---

## 9. Related ADRs and references

- **D-0068:** Landscape capability archive (companion — moves all 6 capabilities to status=reserved).
- **D-0064:** Paid acquisition pilot scope (still binding; this ADR is the pause mechanism).
- **D-0065:** Pet-waste service ratification (per §0.7, the capability reverts to reserved if pilot aborts).
- **D-0066:** Outbound SMS consent (still binding on any future form).
- **D-0062:** Source reconciliation exception (drift deferred to Q3 2026).
- **D-0063:** Claude/Anthropic AI provider claim (still binding).
- **`output/plans/RESUMING.md`:** The step-by-step resume procedure (newly written).
- **`output/plans/2026-07-31_strategy-rollout-adjustment.md`:** The 6-gate execution sequence (gates preservation posture assumes the steward will follow).
- **`state/ledger.yaml`:** Phase marked PAUSED AT PRE-LAUNCH; D-0067/D-0068 added to ratified list.
- **`state/risk-register.yaml`:** R-PIVOT-001 added; R-PILOT/CAP/SMS all annotated PAUSED.
- **`state/capability-registry.yaml`:** All 6 capabilities moved to status=reserved per D-0068.
