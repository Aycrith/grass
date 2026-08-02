# Pinellas Listing Media Pilot Spec

**Status:** DRAFT (Stage 1 deliverable per `governance/decisions/0070-pinellas-listing-media-pilot.md`)
**Date:** 2026-08-01
**Author:** Claude Code (with steward — pending ratification)
**Scope:** The operational spec for the 30-day Pinellas Listing Media pilot
per D-0070. Defines the 12-point envelope from D-0070 §0, equipment access
precondition, lead SLA, hard kill-switches, retry/resume path, and acceptance
criteria. **Pilot activation GATED on steward ratification of D-0070.**
**Review date:** 2026-08-30 (T+30 days from pilot activation; or upon steward
ratification, whichever first)

> **Do NOT implement any portion of this spec until D-0070 is RATIFIED.**
> The spec is filed at DRAFT so steward review has a concrete artifact to walk
> through, not as authorization for implementation. Per CLAUDE.md hard rule #10,
> no irreversible decision without a ratified Decision Template.

---

## 0. The decision in one paragraph (12-point envelope from D-0070 §0)

Run a **30-day photo-only listing-media pilot** in Pinellas County under a
**$300 total spend cap** (assuming Google Ads new-account $500 free credit
honored; cap = $0 cash until credit confirmed). **Entry-tier pricing $250-$300**
for drone-aerial + interior stills; **twilight add-on $150**. Success criterion
is BOTH **≥3 paid bookings** AND **≥$40/hr averaged** across all engagements
(threshold per D-0070 §9.1 Q5 framing answer (b) wage replacement; aggregation
rule: simple mean of all bookings). **Channel-agnostic distribution** (Google
Ads, NextDoor, Facebook Marketplace, agent-direct outreach — pilot does NOT
bet on any single channel). **Photo-only scope:** no 3D/Matterport, no drone-
roof-inspection, no cross-sell into Mission 1 landscaping (which remains
reserved under D-0068). **5-min business-hours lead SLA** (Mon-Fri 7a-5p,
Sat 8a-2p); next-morning after hours; auto-acknowledge SMS within 30 seconds
regardless of personal-reply window. **Premium-tier ($300+ bookings) evidence
threshold = 5 paid bookings** before 3D/Matterport ratifies via D-0072.
**Equipment access precondition** (drone OR founder-owned OR rented for the
duration) is a hard gate by Day -3. **FAA Part 107 trigger at first repeat
engagement** (≥3 paid bookings), not Day 1. **Hard kill-switch** at: spend
>$300 cap, margin <$40/hr AND <3 paid bookings at Day 14, scope violation
into Mission 1 landscaping, OR steward unavailable >3 consecutive days.

---

## 1. Problem

Per D-0070 §1: the post-pivot research cycle (v3/v4/v5/v6 workflows) surfaced
3 candidates (LISTING_MEDIA, SMB_COMPLIANCE, REMOTE_NATIONAL_DOWNSIZING).
LISTING_MEDIA survived both profitability filter AND adversarial verification.
SMB_COMPLIANCE and REMOTE_NATIONAL_DOWNSIZING were archived. The pilot tests
whether LISTING_MEDIA is a viable post-pivot direction under a 30-day
reversible envelope with hard kill-switches.

The pilot must:

- Validate (or refute) the v6 saturation finding (26+ competitors in Pinellas,
  entry pricing $149-$200) vs the modified D-0070 envelope ($250-$300 entry,
  twilight $150 add-on, $300 cap, ≥3 paid bookings AND ≥$30/hr averaged).
- Produce a Day-14 mid-pilot read AND a Day-30 final read with documented
  actuals (bookings, hours-burned, hours-billable, channel mix).
- Honor the v6 finding that the central success criterion is context-dependent
  ($30/hr framing — Q5 reflection question) — without Q5 framing answer, the
  success criterion itself is at risk.
- Channel-agnostic so pilot does not depend on any single distribution
  pathway (per Q3 binding constraint).
- Survive steward unavailability, hurricane conditions (R-HURR-001
  cap_hurricane_mode), and pilot scope drift into Mission 1.

---

## 2. Critical files (created or modified upon pilot activation)

| File | Action | Stage |
|---|---|---|
| `apps/web/src/app/listing-media/page.tsx` | **New** | Pilot Stage A (Day -7 to Day 0) |
| `apps/web/src/app/listing-media/listing-media.module.css` | **New** | Pilot Stage A |
| `apps/web/src/app/listing-media/ListingMediaForm.tsx` | **New** | Pilot Stage A |
| `apps/web/src/components/contact/ListingMediaForm.tsx` (or reuse `ContactForm.tsx` with variant prop) | **New or extend** | Pilot Stage A |
| `apps/web/src/lib/business.ts` | Extend with `BUSINESS.serviceAreas.listingMedia` | Pilot Stage A |
| `apps/web/src/app/api/lead/route.ts` | Extend `LeadInput` with `service: "listing-media"` field | Pilot Stage A |
| `apps/web/src/app/privacy/page.tsx` | Add listing-media disclosure section | Pilot Stage A |
| `output/pilot/listing-media/2026-MM-DD_runlog.md` | **New per-pilot-day** | Pilot Stage B (Day 1-30) |
| `output/pilot/listing-media/2026-MM-DD_actuals.md` | **New per-pilot-week** | Pilot Stage C (Day 7, 14, 21, 30) |
| `governance/decisions/0070a-pilot-outcome-ADR.md` | **New upon pilot close** | Pilot Stage D (Day 30+) |

> **Status gate:** All file actions are CONDITIONAL on D-0070 ratification.
> No file is created until steward signs D-0070.

---

## 3. Equipment access precondition (HARD gate by Day -3)

Per D-0070 §0.2: equipment is a hard precondition. Pilot does not launch
without one of the following confirmed by Day -3:

- **Option A — Founder-owned drone** (DJI Mini 4 Pro or equivalent ≤249g
  registration-exempt category preferred). FAA Part 107 NOT required for
  ≤249g drone operated under hobby rules; commercial operation requires
  Part 107 regardless of weight.
- **Option B — Rented drone** at standard Pinellas rate ($150-$300/day).
  Drone does not need to be ≤249g; rental company may handle Part 107
  paperwork as part of rental agreement.
- **Option C — Founder-owned non-drone camera setup** (interior stills only,
  no aerial). Entry tier offered at $200 (no drone premium); twilight
  add-on available; pilot remains viable.

**Verification (Day -3):**
- Equipment physically present and tested (1 calibration flight or 1 test
  shoot).
- Charged batteries, formatted SD cards, backup equipment in case of failure.
- Insurance: equipment rental company provides liability coverage; founder-
  owned equipment covered under existing homeowner/renter policy OR new
  equipment rider ($50-$100/yr typical).

**Failure mode:** If equipment not confirmed by Day -3, pilot launch slips by
7 days. If still not confirmed at Day 0, pilot aborts and D-0070 closes
without D-0072 (no premium-tier ratifies).

---

## 4. Lead SLA + secondary signal

### 4.1 Primary SLA (5-min business hours)

Per D-0070 §0.7: 5-minute response during business hours (Mon-Fri 7a-5p,
Sat 8a-2p); next-morning after hours.

- **Auto-acknowledge SMS within 30 seconds** regardless of personal-reply
  window (uses Twilio, per existing Mission 1 architecture — see D-0066).
- **Honest copy** on `/listing-media` landing: "5-minute response during
  business hours (Mon-Fri 7a-5p, Sat 8a-2p); next-morning after hours."
- **Steward calendar block** during active hours (calendar invite,
  reoccurring, blocker).
- **Pause campaign** during known unavailable windows (vacation,
  off-grid, sick day >2 days).

### 4.2 Secondary signal (lead-quality measurement)

Per D-0070 §0.7 secondary signal: actual booking conversion rate at Day 7.

- Lead-to-booking conversion = (bookings) / (qualified leads) where
  "qualified lead" = lead who confirms property access window.
- **Target at Day 7:** ≥40% lead-to-booking conversion.
- **Target at Day 14:** ≥50% lead-to-booking conversion OR redesign trigger.

**Detection signal:** Lead-to-booking conversion <25% at Day 7 → pause
and investigate landing-page copy, form friction, or pricing mismatch.

### 4.3 Channel attribution

Channel-agnostic distribution means tracking which channel each lead arrives
from is required even if no single channel is preferred:

- Google Ads UTM tags: `?utm_source=google&utm_medium=cpc&utm_campaign=pilot-listing-media`
- NextDoor posts: `?utm_source=nextdoor&utm_medium=post&utm_campaign=pilot-listing-media`
- Facebook Marketplace: `?utm_source=fbmp&utm_medium=listing&utm_campaign=pilot-listing-media`
- Agent-direct outreach: tracked manually in `output/pilot/listing-media/channels.csv`

Per-booking channel attribution recorded in `output/pilot/listing-media/actuals.md`.

---

## 5. Pricing + service tier structure

### 5.1 Entry tier ($250-$300)

Drone-aerial hero shot (single angle, ≤249g drone OR rented drone) + interior
stills (≤10 photos, smartphone-quality acceptable for entry tier). Edit:
basic color correction + horizon leveling + standard export.

Pricing variation:

- $250: 5 interior stills + 1 drone-aerial + 1 twilight (sunset) — 90 min on-site
- $275: 8 interior stills + 2 drone-aerial angles — 120 min on-site
- $300: 10 interior stills + 3 drone-aerial angles + 1 twilight — 150 min on-site

### 5.2 Twilight add-on ($150)

Sunset/sunrise shoot scheduled within 30 min of golden hour. Adds 60-90 min
on-site. Higher-margin because customer is buying premium scheduling, not
extra equipment time.

### 5.3 Premium tier (3D/Matterport) — DEFERRED per D-0070 §0.9

Not in pilot scope. If 5+ paid bookings at $300+ reached, premium-tier
ratifies via D-0072. Pilot remains valid without premium-tier.

### 5.4 Cap (total spend $300 per pilot)

Per D-0070 §0.3: pilot total spend cap = $300. Assumes Google Ads new-account
$500 free credit; if credit denied, $0 cash spend until steward explicit
approval. Channel-agnostic allows pivoting spend allocation to higher-ROI
channel as Day 7 actuals come in.

---

## 6. Success criterion (central)

Per D-0070 §0.6 and v6 synthesis §D (Q5 binding constraint):

> **Pilot SUCCEEDS if and only if BOTH conditions met:**
> (1) ≥3 paid bookings
> (2) ≥$30/hr averaged across all engagements
> **Aggregation rule:** simple mean of all bookings (total margin /
> total hours-burned).

**Hours-burned** = on-site time + editing + listing prep + client comms.
**Hours-billable** = total time charged against bookings revenue.
**Margin** = bookings revenue − direct costs (no allocated overhead).
**Margin/hr averaged** = total margin / total hours-burned.

### 6.1 Q5 framing flag (BLOCKING)

Per v6 synthesis §D: the $30/hr threshold is context-dependent. Without
steward confirmation that this is the right axis, the central success
criterion itself is at risk. **D-0070 §9.5 (Q-V6-RATIFICATION-RESET-001
#5) is BLOCKING** for ratification.

Possible framings (interview ready):

- **Frame A:** $30/hr is the minimum learning-investment return (pilot pays
  for what steward learns about real-estate listing economics, even if
  per-engagement revenue is below market wage).
- **Frame B:** $30/hr is the wage replacement threshold (pilot must equal
  or exceed the equivalent hourly wage steward could earn in alternative
  employment).
- **Frame C:** $30/hr is the contribution margin threshold (pilot must
  exceed the threshold above which reinvestment into premium-tier
  equipment is justified).

### 6.2 Redesign trigger at Day 14

Per D-0070 §6: if margin <$30/hr AND <3 paid bookings at Day 14, pilot
redesigns (does not auto-abort). Redesign path: revisit pricing, channel
mix, or service tier structure. Steward must authorize redesign.

### 6.3 Hard abort triggers

- 0 paid bookings by Day 14 → pilot aborts (D-0070 §6).
- Margin <$10/hr AND <3 paid bookings at Day 21 → pilot aborts.
- Spend >$300 cap → pilot aborts.
- Scope violation into Mission 1 landscaping → pilot aborts.
- Steward unavailable >3 consecutive days → pilot pauses; >7 days → aborts.

---

## 7. Premium-tier evidence threshold

Per D-0070 §0.8: premium-tier ($300+ bookings) ratifies via D-0072 only
when **≥5 paid bookings at $300+ reached**. Premium-tier includes 3D/
Matterport, drone-roof-inspection, virtual staging — none of which are in
pilot scope.

**Detection signal:** At Day 30, count bookings at $300+. If ≥5, draft
D-0072 (premium-tier ratify) for steward review.

**Defer path:** If threshold not reached at Day 30, premium-tier remains
deferred. Pilot may continue (or end); premium-tier decision moves to
Day 60 review.

---

## 8. Hard kill-switch (must implement in automation)

Per D-0070 §0.12:

```typescript
// apps/web/src/lib/listing-media-kill-switch.ts (DRAFT — not implemented)
export function checkKillSwitch(state: PilotState): KillSwitchDecision {
  if (state.totalSpendUsd > 300) return { action: 'abort', reason: 'cap_exceeded' };
  if (state.daysSinceLaunch >= 14 && state.paidBookings < 3 && state.marginPerHrAvg < 30) {
    return { action: 'redesign', reason: 'mid_pilot_miss' };
  }
  if (state.scopeViolationFlags.includes('mission_1_landscaping')) {
    return { action: 'abort', reason: 'scope_violation' };
  }
  if (state.stewardUnavailableDays >= 3) {
    return { action: 'pause', reason: 'steward_unavailable' };
  }
  if (state.stewardUnavailableDays >= 7) {
    return { action: 'abort', reason: 'steward_unavailable_extended' };
  }
  return { action: 'continue' };
}
```

**Manual override:** Steward may abort at any time without trigger. Steward
override is documented in `output/pilot/listing-media/runlog.md`.

---

## 9. Retry / resume path

Per D-0070 §11: if pilot aborts pre-success-criterion, steward has 2 paths:

1. **Retry with adjusted parameters** (different channel mix, different
   pricing, different service tier structure). Requires D-0070b (pilot
   retry ADR). Cost: 30 days + new envelope.
2. **Decline to retry** — close pilot and pursue different direction.
   Requires D-0070c (pilot close ADR).

If pilot succeeds: ratify via D-0070d (pilot success ADR) and either
(a) expand via D-0072 (premium-tier) or (b) continue at current scope.

---

## 10. Acceptance criteria (D-0070 §11)

Pilot meets acceptance criteria if and only if:

- ✅ Equipment access confirmed by Day -3
- ✅ Landing page `/listing-media` deployed by Day 0
- ✅ Lead SLA measured and documented daily in `runlog.md`
- ✅ At least 1 paid booking by Day 14 (else abort path)
- ✅ Success criterion (≥3 bookings AND ≥$30/hr averaged) met by Day 30
- ✅ Channel attribution tracked for every booking
- ✅ Margin/hr calculation documented weekly in `actuals.md`
- ✅ No scope violation into Mission 1 landscaping
- ✅ Kill-switch tested at least once during pilot (synthetic test)

---

## 11. Related artifacts

- **D-0070** (DRAFT): `governance/decisions/0070-pinellas-listing-media-pilot.md`
  — the ratified (or pending) Decision Template.
- **D-0071** (DRAFT): `governance/decisions/0071-remote-national-downsizing-DECLINED.md`
  — the DECLINED posture on REMOTE_NATIONAL_DOWNSIZING.
- **v6 synthesis**: `output/research/2026-08-01_v6-ratification-reset-synthesis.md`
  — the research foundation.
- **State files**: `state/ledger.yaml`, `state/risk-register.yaml`,
  `state/capability-registry.yaml` — research-cycle posture recorded;
  pilot posture pending steward ratification.
- **Capability**: `state/capability-registry.yaml → cap_listing_media_photo`
  (status=research).
- **Risks**: `state/risk-register.yaml → R-LM-001..010` (research-state,
  activate upon ratification).

---

## 12. Pending steward decisions

Pilot activation requires:

1. **Q5 framing answer** (D-0070 §9.5, Q-V6-RATIFICATION-RESET-001 #5) —
   blocks central success criterion. **Most critical.**
2. **22 reflection answers** in D-0070 §9 (or authorize defaults for any).
3. **5 reflection answers** in D-0071 §9 (or authorize defaults for any).
4. **Steward signature** on D-0070 + D-0071 to move from DRAFT to RATIFIED.
5. **Steward direction** on whether to update state files (ledger,
   risk-register, capability-registry) to reflect active pilot posture.
6. **Steward direction** on whether to commit (the ADRs + spec are
   untracked).

---

## 13. Critical files for spec reader

| File | Purpose |
|---|---|
| `governance/decisions/0070-pinellas-listing-media-pilot.md` | The DRAFT ADR |
| `governance/decisions/0071-remote-national-downsizing-DECLINED.md` | The DECLINED ADR |
| `output/research/2026-08-01_v6-ratification-reset-synthesis.md` | Research synthesis |
| `state/capability-registry.yaml → cap_listing_media_photo` | Capability entry |
| `state/risk-register.yaml → R-LM-001..010` | Research-state risks |
| `CLAUDE.md` | Charter-binding hard rules |
| `constitution/01-constitution.md` | Immutable principles |
| `governance/05-decision-framework.md` | Decision Template format |

---

**End of spec. Status: DRAFT. Do NOT implement until D-0070 is RATIFIED.**
