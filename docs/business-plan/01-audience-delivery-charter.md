# 01 — Audience & Delivery Charter

**Document ID:** DOCS-BP-01-CHARTER
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent
**Review cadence:** Before every external send; quarterly thereafter

---

## 1. Purpose

This document is the audience-and-delivery charter for the family seed investment package. It captures who the reader is, who the founder is in this delivery, what tone the package uses, and what the package physically contains. It is the contract between the document set and the human on the other end of the email.

If any other document in this framework conflicts with this charter, this charter wins — except where founder decisions in `18-founder-decisions.md` explicitly override.

---

## 2. Primary recipient persona

### 2.1 Who she is

The primary recipient is the founder's older female family member. She is, in this delivery, the **only investor** being approached for the lawn-service business. The previous three rounds of the plan were sent to `choblo@gmail.com` (the founder's own address while the package was staged) — but this delivery is for the family member, not the founder. The founder's address is the staging/test address; the family member's address is the production address.

Based on the user-provided profile:

- **Age band:** older adult.
- **Technical fluency:** non-technical. No AI/ML, no spreadsheet or financial-model fluency, no software-architecture literacy.
- **Domain fluency:** generally familiar with household budgeting, monthly bills, family lending patterns, perhaps prior experience lending money to a small business or relative.
- **Financial literacy:** understands checking accounts, savings, loans, interest rates, basic cash-flow concepts. Does **not** understand VC, cap tables, SAFE notes, MRR, ARR, gross vs. net margin, or pre/post-money valuation as industry terms.
- **Risk posture:** prudent, will stress-test downside. Not speculative; not a venture investor.
- **Motivation:** family relationship + belief in the founder's work ethic. **Not** chasing return on capital.
- **Decision style:** reads the package, considers the relationship implications, asks clarifying questions on the call, then decides.

### 2.2 What she is being asked to do

She is being asked to consider a **$15,000 seed investment** in a Florida single-member LLC that will operate a residential lawn-care business (Mission 1 of GRASS). The investment is structured as either:

- **Primary:** a **YC Post-Money SAFE (cap only, MFN)** — standard form for early-stage — at a **$400,000 valuation cap and 20% discount**, OR
- **Alternative:** a **Revenue Share Agreement (15% of monthly revenue, 1.75× cap, 36 months)** — more appropriate for a recurring-revenue service business with no traditional equity instrument, OR
- **Conservative:** a **0% family loan with 50%-of-free-cash repayment**, no equity, no board seat, no information rights (the GRASS project's default position, per `state/ledger.yaml` and `governance/decisions/0011-cash-min-activation.md`).

The choice is hers, with the founder's recommendation noted in the cover letter. **The call is the decision vehicle, not the email.**

### 2.3 What she will weigh

- **Family relationship implications.** Will this change how we relate? If the business fails, will it harm the relationship?
- **Capital preservation.** Is my $15,000 at risk? What is the worst-case loss?
- **Return possibility.** What is the realistic upside in years 1–5?
- **Founder's commitment.** Is Cameron actually going to do this for the long haul?
- **Honesty of the document.** Does the package tell me the truth, including the bad parts?
- **Simplicity.** Is the structure simple enough that I can explain it to my own advisor?

### 2.4 What she will NOT weigh

- The 13-agent autonomous AI architecture.
- Mission 2 candidates (pool, pressure wash, pet waste).
- D-0001 through D-0060 governance decisions.
- Tech stack (Next.js, Supabase, Stripe, Vercel, Bun).
- The long-range compounding-organization thesis.
- Decision-template compliance audits.
- Capability-registry maturity status.

---

## 3. Founder persona in this delivery

The founder is **Cameron Pike**, sole operator of Largo Lawn (the future trade name of the FL single-member LLC that will be formed at the first cash gate per D-0011 / `cash-min-activation.md`). In this delivery Cameron is:

- **Operator.** All field work is performed personally by Cameron through at least M12 (per D-0004 Solo Founder / Lean Operating Model).
- **Communicator.** Cameron writes and signs the email body, the cover letter, the talking points. The AI agents support drafting; Cameron approves.
- **Accountable.** Cameron is the responsible party for every dollar of the seed investment, every quarterly distribution decision, every monthly update.
- **Transparent.** Every assumption in the plan is footnoted; every forecast carries a "forecast — not a guarantee" label; every risk is on the page, not in the small print.

The **GRASS organization** is internal infrastructure. It does not appear in family-facing materials except as a single plain-language footnote in the long plan: *"Largo Lawn is operated as Mission 1 of the GRASS autonomous AI organization, which builds and runs the operational software, scheduling, accounting, and customer communication."*

---

## 4. Tone

The package uses these tone principles:

| Principle | What it means in practice |
|---|---|
| **Plain-language** | No jargon. "What you put in" not "capital contribution." "Money you might get back" not "distribution." "The business may not work" not "execution risk." |
| **Plain-numbers** | Whole dollars. No "5,175" when "$5,200" will do. Percentages rounded to whole numbers. Dates as Month + Year, not "M11." |
| **Honest about uncertainty** | "Forecast," "estimate," "could," "may," "if," "risk." The plan never claims certainty it does not have. |
| **Warm** | First names, family acknowledgment, gratitude for her time. Not corporate. Not stiff. |
| **Short** | 12-page condensed PDF, 1-page summary card, 1-page cover letter, 1-page email body. Long plan is reference, not reader-facing. |
| **No exploitation** | The document does not oversell. It does not overstate certainty. It does not use pressure tactics. She is family, not a prospect. |

---

## 5. Package contents (physical artifacts)

| # | Artifact | Format | Source | Sent? | Read by whom |
|---|---|---|---|---|---|
| 1 | **Plain-language email body** | HTML (Gmail-safe) | `support/04-send-wrapper.md` | YES | Recipient |
| 2 | **Family cover letter** | HTML (Gmail-safe) | `scripts/build_business_plan_cover_letter.py` → renamed `cover_letter_v1.1_family.html` | YES (as attachment) | Recipient |
| 3 | **Condensed business plan v1.1** | PDF (primary) + HTML | `scripts/build_condensed_business_plan.py` | YES (as attachment) | Recipient |
| 4 | **Summary card** | PDF (A4 landscape) + HTML | `support/09-family-talking-points.md` §5 | YES (as attachment) | Recipient (keeps) |
| 5 | **Long business plan v1.1** | PDF + HTML | `scripts/build_business_plan.py` | NO (reference only; sent only if asked) | Founder |
| 6 | **Plain-language FAQ** | MD | `support/09-family-talking-points.md` §6 | NO (founder prep only) | Founder |
| 7 | **Conference-call talking points** | MD | `support/09-family-talking-points.md` §1–4 | NO (founder prep only) | Founder |
| 8 | **Cap-table worksheet** | YAML + MD | `05-prp-d-family-investor-package.md` §3 | NO (founder working doc) | Founder |

**Rule:** Items 1–4 are the family package. Items 5–8 are the founder's package. There is **no overlap** — no internal working document leaks into the family-facing artifacts. The preflight script enforces this.

---

## 6. Delivery schedule

| Step | Time | Action | Confirmation |
|---|---|---|---|
| **T-24h** | 2026-07-28 evening | Plan review complete; all Q1–Q16 resolved; all artifacts built; preflight passes | `scripts/preflight.py --check-facts` exit 0 |
| **T-12h** | 2026-07-29 06:00 EDT | Founder reviews package; reconfirms recipient address; signs send checklist | Signed `output/procurement/send_checklist.md` |
| **T-0** | 2026-07-29 08:00 EDT | Email sent via `scripts/send_business_plan.py --family` | Entry in `~/.owl/sent_emails.jsonl` + sender confirmation |
| **T+0:30** | 2026-07-29 08:30 EDT | Founder checks inbox / send log; verifies attachments rendered; notes any bounce | Send-log hash check |
| **T+4h** | 2026-07-29 12:00 EDT | Family member likely to have opened the email; founder **does not** follow up by phone yet | — |
| **T+24h** | 2026-07-29 evening | Conference call (15-min slot) | Call notes captured in `support/10-conference-call-prep.md` |

The call is the decision vehicle. The package is read in 30–60 minutes, with 12+ hours to consider before the call.

---

## 7. Founder responsibilities

### 7.1 Before send (T-24h to T-0)

- [ ] Read the entire package as if you were her.
- [ ] Resolve every `[FOUNDER_CONFIRM]` placeholder.
- [ ] Confirm her email address (and ask her preference if uncertain).
- [ ] Print the summary card (you keep one, you send one).
- [ ] Test the PDF — open it on phone, on laptop, on tablet.
- [ ] Verify the email body in plain-text mode (no broken line wrapping).
- [ ] Run `scripts/preflight.py` and confirm exit 0.
- [ ] Run `scripts/send_business_plan.py --family --dry-run` and confirm attachments.

### 7.2 On the call (T+24h)

- [ ] Open with thanks for her time.
- [ ] Walk through the summary card in 60 seconds.
- [ ] Walk through the cover letter in 5 minutes.
- [ ] **Pause for questions before continuing.**
- [ ] Walk through use-of-funds in 3 minutes.
- [ ] Walk through return expectations + risk in 3 minutes.
- [ ] Take her questions. Do not over-answer. Do not promise outside the document.
- [ ] Capture every question and every answer in `support/10-conference-call-prep.md` post-call.

### 7.3 After the call (T+48h)

- [ ] Send a plain-language follow-up email summarizing the conversation.
- [ ] Confirm whether she is proceeding, deferring, declining, or asking for revisions.
- [ ] If proceeding: schedule the next step (signing, wire transfer, LLC formation, etc.).
- [ ] If deferring: ask her to set a date for the next conversation.
- [ ] If declining: thank her; do not pressure; close the loop.
- [ ] If revisions: capture her requested changes as a new decision; do NOT silently edit the canonical plan.

---

## 8. What this charter does NOT cover

- **Day-1 cap table as a formal legal agreement** — drafted separately (next cycle).
- **5-year financial model** — next cycle.
- **External-investor-grade compliance** — next cycle.
- **Source-reconciliation for 6.75% operational artifacts** — D-0062, next cycle.
- **Full content model / manifest architecture** — PRP-C, next cycle.
- **Operational documentation** for Mission 1 (this is an investment package, not an operations manual).

---

## 9. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |