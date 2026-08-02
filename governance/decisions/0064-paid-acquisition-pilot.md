# D-0064 — Paid acquisition pilot scope and spend envelope

**Date:** 2026-07-28
**Status:** RATIFIED 2026-07-28 (founder disposition: ratify with explicit override record)
**Author:** Claude Code (with steward)
**Scope:** Mission 1 paid-traffic pilot. Channels: Google Search ONLY for the first test. Service line: pet-waste cleanup (per D-0065). Landing path: new `/pet-waste` page (per D-0064 §0). Spend envelope: all available free credits, expand with marketing budget if external investment materializes, continue while profitable.
**Review date:** 2026-08-28 (30 days post-launch or post-1st-paid-customer, whichever first)
**Confidence (shipped):** 0.65
**Supersedes:** none (first formal pilot-scope ratification)

---

## 0. The decision in one paragraph

Ratify the **first Mission 1 paid-acquisition pilot** with the following envelope:

1. **Channel:** Google Search ONLY. Meta, Microsoft, Yelp, Nextdoor, Thumbtack, and CAPI/retargeting are explicitly OUT of scope for this pilot. (Reintroduction of any of these before the pilot outcome ADR is written is a hard-stop per the plan's stop conditions.)
2. **Service line:** Pet-waste cleanup (per D-0065; capability `cap_pet_waste_cleanup` to be added to `state/capability-registry.yaml`).
3. **Landing path:** New `/pet-waste` page with short hero, offer copy, 3-field compact form (name, phone, ZIP), tap-to-call and tap-to-text buttons, and trust strip. The home page remains unchanged for organic traffic.
4. **Spend envelope:** Pilot runs on **all available free credits**. Pilot expands with a marketing budget only if external investment materializes. Pilot continues **while profitable**, stops when goals are met or unprofitable.
5. **Unit economics:** Pet-waste first cleanup $7.50 (50% off), recurring $15/week. Estimated gross margin ~70% (low consumables, low labor for solo founder). LTV ≈ $546/year gross profit per customer ($15/wk × 52 weeks × 70%).
6. **Profitability circuit-breaker:** Campaign pauses when CAC exceeds 12 weeks of gross profit (≈ $138/customer). Campaign continues while CAC stays below that ceiling.
7. **Lead SLA:** 5 minutes during business hours (Mon-Fri 7a-5p, Sat 8a-2p). Personal reply the next business morning after hours. Acknowledgement always within minutes via the existing auto-responder.
8. **SMS consent:** Standard TCPA-compliant checkbox required before any acknowledgement SMS is sent (per D-0066).
9. **Analytics:** Server-side PostHog only (the `lead_captured` event already wired in `apps/web/src/app/api/lead/route.ts`). No GA4, no Meta Pixel, no client tags.
10. **Claims:** All unsubstantiated trust/insurance/history/review claims are stripped. The site ships with honest copy only.

---

## 1. Problem

The steward wants an ad-led acquisition path because door-knocking is unsafe and personally unsuitable. Existing GTM drafts under `output/gtm/` (`README.md`, `01-landing-page-audit.md`, `02-tracking-stack-spec.md`, `03-google-ads-campaign-draft.md`) proposed a 6-8 day build-out that would have spent money on an unratified service line (pet-waste is a Month-10 revalidation candidate, not a ratified Mission 1 service), with unsubstantiated trust claims, conflicting budget totals, and a tracking stack whose consent-gating, event-ID dedupe, and duplicate-counting were all identified as broken before any pilot evidence existed.

The plan approved on 2026-07-28 (`C:\Users\camer\.claude\plans\review-the-plans-recently-lucky-catmull.md`) requires Stage 0 ratification before any engineering work begins. This ADR is that ratification.

---

## 2. Context

What we know:

- Pet-waste is a candidate Mission 2 service per `research/mission-2/candidates.md` and `weighted-scores.md`. The weighted-scores document lists pet-waste as a Month-10 revalidation candidate ("Brand fit (5%) — 3: 'Lawn care + pet waste' is natural for existing customers, slightly off-brand for new customers"). This pilot ratifies it as Mission 1 in the meantime.
- Free ad credits from new accounts are documented in `research/distribution/autonomous-paid-acquisition.md` (Google $500, Microsoft $100-200, Meta $50-200, Yelp $25-50, Nextdoor $50-100). The pilot uses Google only.
- The landing page already has a real lead API (`apps/web/src/app/api/lead/route.ts`), ZIP validation, ZIP persistence, accessible forms, a sticky `ConversionRail`, CLS=0, and a recent visual refresh.
- Production Lighthouse baseline is mobile 82 and predates the recent hero and editorial expansion; no fresh run exists.
- The hero on `apps/web/src/components/sections/HeroFieldTelemetry.tsx` has a 0.7s CTA entrance delay and a 350svh root that may render long-but-broken on coarse-pointer/touch-laptop devices wider than 767px.
- The privacy page (`apps/web/src/app/privacy/page.tsx`) currently states "no advertising or tracking cookies," consistent with the server-side-PostHog-only analytics posture.

What we explicitly don't know:

- The actual Google new-account credit amount (unverified; "$500" is the typical but not guaranteed amount).
- Whether the steward's actual response time during business hours will reliably hit 5 minutes.
- Whether $15/week × 70% margin × ~6 months average retention is the right LTV (the research estimate is 12 months of customer life).
- Whether paid search demand exists in the exact service area (Largo 33771 + 5 adjacent ZIPs).

---

## 3. Requirements

A successful ratification must:

1. Name exactly one channel (Google Search) and explicitly mark Meta, Microsoft, Yelp, Nextdoor, Thumbtack, retargeting, GA4, Meta Pixel, CAPI, and CallRail as OUT of scope.
2. Cite price and gross margin to existing research (`research/pricing/price-book.yaml`, `research/market/profitability-roadmap.md`).
3. Pre-commit to a circuit-breaker rule for stopping spend: pause when CAC > 12 weeks of gross profit per customer (≈ $138), continue otherwise.
4. Document the steward's explicit override of the plan's recommendation: the steward chose "go all in" with a profitability-based circuit-breaker instead of the plan's hard monthly cap and pre-committed numeric kill rule. This ADR is the on-the-record acknowledgement.
5. Document the steward's written acknowledgement that Google Ads daily budgets are not hard caps and can overspend up to ~2× daily within a month. Mitigation: account-level monthly cap set in the Google Ads UI, with the steward reviewing actual monthly spend within 7 days of any month end.
6. Update the GTM docs to mark `02-tracking-stack-spec.md` as DEFERRED and `03-google-ads-campaign-draft.md` as REVISED before any spend occurs.
7. Add a landing spec to `docs/specs/paid-pilot-landing-spec.md` before any landing-page code lands (Stage 1).
8. Ratify pet-waste as a Mission 1 service line via a separate ADR (D-0065) and capability registry entry (`cap_pet_waste_cleanup`).

---

## 4. Alternatives considered

| Option | Approach | Pro | Con | Verdict |
|---|---|---|---|---|
| A | **This ADR** — one Google Search campaign, profitability circuit-breaker, pet-waste landing page, server-side PostHog only | Single-channel simplicity; no new SaaS; aligns with steward override | No hard monthly cap; relies on steward's manual pause discipline | **Selected** — honors steward override explicitly |
| B | Plan as written — hard monthly cap, pre-committed kill rule at 3 booked jobs by Day 30 | Bounded exposure; cleaner experiment | Steward explicitly rejected | **Rejected** — steward override |
| C | Multi-platform (Google + Meta + Microsoft + Yelp + Nextdoor) per the GTM draft | Diversified channels | Solo founder cannot manage 5 dashboards + 5-min SLA; conflicts with $200/mo infra ceiling | **Rejected** — operational infeasibility |
| D | Skip paid ads entirely; rely on GBP + Nextdoor + organic | Zero ad spend | Steward explicitly wants paid acquisition to do most of the work | **Rejected** — strategic mismatch |
| E | Run on organic-only landing page tests (no spend) for 14 days first | Validates offer before spending | Slow; doesn't address steward's "door-knocking isn't my thing" strategic concern | **Rejected** — strategic mismatch |
| F | Full GA4 + Meta Pixel + CAPI per `02-tracking-stack-spec.md` | Higher-fidelity measurement | Requires consent-mode rewrites, privacy page rewrites, cookie banner becomes load-bearing; introduces duplicate-counting risk before offer validated | **Rejected** — over-instrumentation |

---

## 5. Evaluation matrix

| Criterion | A (this ADR) | B (plan as written) | C (multi-platform) | D (organic only) | E (organic landing tests) | F (full tracking stack) |
|---|---|---|---|---|---|---|
| Strategic fit (paid-led) | ✓ | ✓ | ✓ | ✗ | △ | ✓ |
| Operational feasibility (solo founder) | ✓ | ✓ | ✗ | ✓ | ✓ | △ |
| Spend exposure | unbounded (profitability) | bounded ($500/mo) | unbounded | $0 | $0 | unbounded |
| Decision-rule clarity | profitability-based | numeric | none | n/a | n/a | none |
| Infra ceiling ($200/mo) | ✓ (Google credit only) | ✓ | ✗ (5 platforms) | ✓ | ✓ | △ (depends on SaaS) |
| Time to first test | short (1 campaign) | medium | long (5 campaigns) | n/a | medium | long |
| Reversibility (pause speed) | <5 min | <5 min | <5 min per platform | n/a | n/a | <5 min per platform |

---

## 6. Decision

**Selected: Option A.** Ratify the pilot with one Google Search campaign, a profitability circuit-breaker, the new `/pet-waste` landing path, server-side PostHog analytics, and TCPA-compliant SMS consent. Mark all other channels and the full tracking-stack spec as DEFERRED until the pilot outcome ADR is written.

---

## 7. Risk register additions

| Risk ID | Title | Likelihood | Impact | Score | Owner | Mitigation |
|---|---|---|---|---|---|---|
| R-PILOT-001 | Unprofitable CAC after first 14 days | 4 (likely) | 4 (major) | 16 | marketing | Profitability circuit-breaker: pause campaign when CAC > $138/customer. Manual daily spend check. |
| R-PILOT-002 | Free credits not actually available | 3 (possible) | 4 (major) | 12 | marketing | Treat credits as zero until claimed. Cap first-month spend at $0 until credit confirmation. |
| R-PILOT-003 | Steward cannot sustain 5-min response SLA | 3 (possible) | 5 (catastrophic) | 15 | sales | Honest copy on landing page (5-min business hours, next-morning after hours). Pause campaign during known unavailable windows. |
| R-PILOT-004 | Pet-waste service turns out to be unviable (regulation, equipment, demand) | 2 (unlikely) | 4 (major) | 8 | operations | 14-day early read; pause if no qualified leads by Day 7. |
| R-PILOT-005 | Account-level monthly cap not honored by Google Ads (overspend >2× daily) | 2 (unlikely) | 4 (major) | 8 | marketing | Steward acknowledgement in writing; monthly cap set in Google Ads UI; reconciliation within 7 days of month end. |
| R-PILOT-006 | Lead SLA collapse → no qualified leads close | 3 (possible) | 4 (major) | 12 | sales | Auto-acknowledge SMS within 30 seconds regardless of personal-reply window; steward calendar block during active hours. |

---

## 8. Rollback

Rollback is the **fastest reversible lever first**:

1. **Pause the campaign** in Google Ads UI (<5 minutes).
2. **Revert landing-page changes** independently. Stages 2, 3, and 4 of the plan must be separately revertable; do not couple lead-reliability changes to hero/visual changes in one commit.
3. **Revert capability registry entry** if pilot aborts before any pet-waste customer is served.
4. **Revert privacy/cookie/consent changes** to pre-pilot state.

Each rollback step is independently executable; the order is "pause ads → revert page → revert registry → revert policy."

---

## 9. Steward overrides explicitly on the record

The plan (`C:\Users\camer\.claude\plans\review-the-plans-recently-lucky-catmull.md`) recommended:

1. A hard monthly cap (~$500).
2. A pre-committed numeric continue/kill rule expressed in leads and booked jobs by Day 30.
3. A bounded pilot with explicit end-state.

The steward explicitly overrode all three on 2026-07-28 in favor of:

1. "Go all in" — spend all available free credits, expand with marketing budget if investment materializes.
2. Profitability-based circuit-breaker (CAC < 12 weeks gross profit per customer, ≈ $138/customer).
3. Continue while profitable; stop when goals met or unprofitable.

This ADR is the on-the-record acknowledgement. Per the charter principle "no irreversible decision without a Decision Template," this ADR records:

- **Rationale:** Steward wants paid acquisition to do most of the customer-acquisition work; door-knocking is unsafe and personally unsuitable. Steward considers the plan's hard caps too conservative for the strategic situation.
- **Alternatives considered:** Six (see §4); all conservative options were explicitly rejected by the steward.
- **Risks:** Six additions to the risk register (see §7).
- **Review date:** 2026-08-28 (30 days post-launch or post-1st-paid-customer, whichever first).
- **Confidence:** 0.65 (medium-low; reflects steward's override of the plan's recommendation).

---

## 10. Critical files to modify as part of this ADR's ratification

| File | Action | Stage |
|---|---|---|
| `output/gtm/README.md` | Mark `02-tracking-stack-spec.md` as DEFERRED | Stage 0 |
| `output/gtm/03-google-ads-campaign-draft.md` | Mark as REVISED; replace with single-campaign version per this ADR | Stage 5 |
| `state/capability-registry.yaml` | Add `cap_pet_waste_cleanup` per D-0065 | Stage 0 |
| `state/risk-register.yaml` | Add R-PILOT-001 through R-PILOT-006 per §7 | Stage 0 |
| `state/ledger.yaml` | Add Phase 2 Day 14 entry recording this ratification | Stage 0 |
| `docs/specs/paid-pilot-landing-spec.md` | New spec per Stage 1 of the plan | Stage 1 |
| `governance/decisions/0065-pet-waste-service-ratification.md` | New ADR for capability registration (D-0065) | Stage 0 |
| `governance/decisions/0066-outbound-sms-consent.md` | New ADR for SMS consent (D-0066) | Stage 0 |
| `apps/web/src/app/api/lead/route.ts` | Lead capture reliability per Stage 2 | Stage 2 |
| `apps/web/src/app/quote/QuoteCalculator.tsx` | Attribution fields per Stage 3 | Stage 3 |
| `apps/web/src/app/contact/ContactForm.tsx` | Consent checkbox + attribution per Stages 2 + 3 | Stages 2 + 3 |
| `apps/web/src/app/t/[source]/route.ts` | Paid-traffic attribution labelling fix per Stage 3 | Stage 3 |
| `apps/web/src/app/pet-waste/page.tsx` | New landing page per Stage 4 | Stage 4 |
| `apps/web/src/components/sections/HeroFieldTelemetry.tsx` (and module CSS) | Hero reliability fixes per Stage 4 | Stage 4 |

---

## 11. Acceptance criteria

This ADR is fully ratified when:

- [x] Channel scope is fixed (Google Search only; others DEFERRED).
- [x] Service line is fixed (pet-waste; capability entry to follow).
- [x] Landing path is fixed (`/pet-waste`; new compact page).
- [x] Spend envelope is fixed (free credits; expand on investment).
- [x] Profitability circuit-breaker is fixed (CAC < $138/customer).
- [x] Lead SLA is fixed (5 min business hours; next-morning after hours).
- [x] SMS consent approach is fixed (TCPA-compliant checkbox per D-0066).
- [x] Analytics posture is fixed (server-side PostHog only).
- [x] Claims register decision is fixed (strip all unsubstantiated).
- [x] Steward overrides are explicitly on the record (this ADR §9).
- [x] Risk register updated (six new rows per §7).
- [ ] Capability registry updated (`cap_pet_waste_cleanup` per D-0065).
- [ ] Ledger updated (Phase 2 Day 14 entry).
- [ ] GTM docs updated (mark `02` DEFERRED; revise `03`).

---

## 12. Related ADRs and references

- **D-0065:** Pet-waste service-line ratification (companion ADR).
- **D-0066:** Outbound SMS consent language (companion ADR).
- **D-0060:** Five-plane hero architecture (preserved; do not regress).
- **D-0059:** Hero simplification and extension (preserved; do not regress).
- **C:\Users\camer\.claude\plans\review-the-plans-recently-lucky-catmull.md:** Approved plan; this ADR is Stage 0 ratification.
- **research/distribution/autonomous-paid-acquisition.md:** Free-credit mechanics source.
- **research/market/profitability-roadmap.md:** Unit-economics source.
- **research/pricing/price-book.yaml:** Price-point source.
- **research/mission-2/candidates.md:** Pet-waste Month-10 candidate status (now overridden for Mission 1).
- **research/mission-2/weighted-scores.md:** Pet-waste revalidation rubric (still applies for any future Mission 2 selection).
