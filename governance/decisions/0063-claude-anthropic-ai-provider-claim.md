# D-0063 — Claude/Anthropic AI provider claim ratification + 6-hour manual-window policy

**Date:** 2026-07-28
**Status:** RATIFIED 2026-07-28 (founder disposition: "Create real ADR files (Recommended)")
**Author:** Claude Code (with steward)
**Scope:** `content/facts.yaml` keys `ai-model-primary` (line 389-397) and `ai-model-fallback` (line 399-407); long-plan v1.1 row L5 in `scripts/build_business_plan.py` ~line 692-699; `scripts/build_facts_check.py` cross-validation; the family package (no direct reference).
**Review date:** 2026-12-31 (Q4 2026 / year-end cycle)
**Confidence (shipped):** 0.90
**Supersedes:** nothing (first formal ratification of the AI-provider doctrine)

---

## 0. The decision in one paragraph

Ratify the canonical claim that **the primary AI model family is Claude/Anthropic** (canonical key `ai-model-primary: claude-anthropic`, `content/facts.yaml` lines 389-397) and that a **6-hour continuous outage triggers a manual operating window** (canonical key `ai-model-fallback`, `content/facts.yaml` lines 399-407; the threshold was raised from 4h → 6h on 2026-07-28 to match the bulk of real Anthropic mid-2026 incident durations per StatusGator tracking). The doctrine is that **the durable artifact is the model family / fallback policy, not the specific provider** — so a future rename (e.g., to a successor provider) does not require a new ADR, only a `facts.yaml` version bump under the same drift-discipline rules. **Do not** change the provider claim or the 6-hour threshold without a successor ADR.

---

## 1. Problem

Long-plan v1.1 row L5 (`scripts/build_business_plan.py` ~line 692-699) names **Claude/Anthropic** as the primary AI model with a 4-hour retry threshold and a secondary-model-same-family fallback. The canonical state in `content/facts.yaml` lines 389-407 carries:

- `ai-model-primary: claude-anthropic` (line 390)
- `ai-model-fallback: secondary-model-same-family` (line 400)
- Threshold note: `>6h continuous outage triggers manual operating window (raised from 4h→6h to match the bulk of real Anthropic mid-2026 incident durations per StatusGator tracking)` (line 407)

The pre-correction long plan referenced `architecture/04-systems-architecture.md` for this doctrine; exploration on 2026-07-28 revealed that file (24 lines) contains ZERO references to Claude or Anthropic. The doctrine lives in `content/facts.yaml` alone. The 4h → 6h threshold change also needs a formal record so the next reconciliation cycle doesn't accidentally revert it.

Additionally, two risk rows (RR-AI-01 "AI model provider outage" and RR-AI-02 "Agent drift") were surfaced during the v1.1 research and need to be added to `state/risk-register.yaml` per the same audit.

## 2. Context

- **What the v1.1 patch added (L5):** Section "AI model provider & fallback" with Claude primary, 4-hour retry, secondary fallback, manual-window policy. The 4h threshold is **stale**; the canonical state is 6h.
- **What the research confirmed:** Anthropic incident durations from StatusGator for June-July 2026 ranged 9-17 hours. A 4-hour retry threshold would have triggered the manual window during every real outage in that window — wrong operating posture.
- **What is NOT a problem:** The family package (3 attachments: condensed PDF, summary card, cover letter) does NOT name Claude/Anthropic directly. The long plan is a reference document; the family investor receives the condensed plan.
- **Why the doctrine is "durable artifact, not provider":** The 13-agent GRASS org is built around an "AI-native operations" model where the AI layer is a swappable component. Pinning the doctrine to "Claude/Anthropic specifically" would require a new ADR every time the provider changes; pinning it to "the model family + fallback policy + threshold" is stable across renames.

## 3. Requirements

A successful ratification must:

1. **Pin the canonical state** (`ai-model-primary: claude-anthropic`, `ai-model-fallback: secondary-model-same-family`, 6h threshold) to a durable artifact. Done in `content/facts.yaml` lines 389-407; this ADR is the governance record.
2. **Fix the L5 citation** so the long plan points to the actual canonical source (`content/facts.yaml` keys), not a stale reference (`architecture/04-systems-architecture.md` which contains no AI doctrine).
3. **Document the 6-hour threshold rationale** (StatusGator incident durations 9-17h in June-July 2026) so a future reconciliation cycle doesn't lower it back to 4h.
4. **Add RR-AI-01 and RR-AI-02 to the risk register** with owner, mitigation, and review date.
5. **Allow future provider renames** to proceed via a `facts.yaml` version bump without requiring a new ADR.

## 4. Alternatives considered

| Option | Approach | Pro | Con | Verdict |
|---|---|---|---|---|
| A | Pin doctrine to "Claude/Anthropic specifically" (provider-locked) | Most explicit | Every rename requires new ADR; brittle | **Rejected** — defeats the swappable-component design |
| B | Pin doctrine to "model family + fallback + threshold" (this ADR) | Stable across renames; one canonical source | Reader has to look up the provider in facts.yaml | **Selected** |
| C | Make provider + threshold dynamically configurable (env vars) | Maximum flexibility | Adds runtime complexity; reduces auditability | **Rejected** — overkill for a 1-org business |
| D | Defer ratification until after the family send | Lets the family investor see a clean story first | Leaves the canonical-vs-L5 drift in place for the next reader | **Rejected** — drift is the problem, not the solution |

## 5. Evaluation matrix

| Criterion | A (provider-locked) | B (artifact-locked) | C (env-var) | D (defer) |
|---|---|---|---|---|
| Survives provider rename? | NO | YES | YES | YES |
| Audit trail of threshold change? | Implicit | Explicit (this ADR) | Implicit | N/A |
| Reader finds canonical state in 1 hop? | YES | YES (facts.yaml + this ADR) | NO (runtime) | N/A |
| Risk-register rows added? | Maybe | YES (R.4 below) | N/A | NO |
| Blocks send? | NO | NO | NO | YES (drift) |
| Satisfies Requirement 1 (pin canonical)? | YES | YES | PARTIAL | NO |
| Satisfies Requirement 2 (fix L5 citation)? | YES | YES | YES | NO |
| Satisfies Requirement 3 (document 6h)? | Implicit | YES | Implicit | NO |
| Satisfies Requirement 4 (risk rows)? | Maybe | YES | N/A | NO |
| Satisfies Requirement 5 (rename-able)? | NO | YES | YES | YES |

**Selected: Option B (artifact-locked).** Wins on every "audit trail" / "fix L5" / "risk rows" axis. The 1-hop reader path is via `content/facts.yaml` lines 389-407 (canonical) + this ADR (governance). A future rename requires only `facts.yaml` version bump + drift-discipline rules.

## 6. Decision

**Ratify the canonical state:**

1. `ai-model-primary: claude-anthropic` — durable as long as the provider is Anthropic. Future rename is a `facts.yaml` version bump under PRP-A A-7 drift discipline; this ADR does not need to be re-issued.
2. `ai-model-fallback: secondary-model-same-family` — the fallback procedure (use a secondary model in the same family, e.g., Claude Haiku, when primary unavailable).
3. **6-hour continuous outage threshold** for triggering the manual operating window. Raised from 4h → 6h on 2026-07-28 per the StatusGator incident-duration analysis. Rationale: Anthropic outages June-July 2026 ranged 9-17h, so a 4h threshold would have fired during every real incident; 6h aligns with the lower edge of the real-incident distribution while still being tight enough to catch genuine outages (vs transient blips).
4. **Long-plan v1.1 row L5** is AMENDED: the citation `architecture/04-systems-architecture.md` is replaced with `content/facts.yaml` (keys: `ai-model-primary`, `ai-model-fallback`); the 4h threshold is replaced with 6h; the §08 section title gains "(see D-0063)" suffix. L5 disposition recorded in Phase C.1 SUMMARY.md per Phase A.2.b.
5. **Risk register:** RR-AI-01 ("AI model provider outage, >6h") and RR-AI-02 ("Agent drift over time") are added to `state/risk-register.yaml` with owner = engineering division, mitigation = (see facts.yaml + D-0063), review date 2026-12-31.

### 6.1 Doctrine durability test

The doctrine "durable artifact is the model family / fallback policy / threshold, not the provider" passes the following durability test:

- **Rename within Anthropic** (e.g., `claude-anthropic` → `claude-opus-5`): facts.yaml version bump, no ADR change. ✓
- **Rename to a different provider** (e.g., `claude-anthropic` → `gpt-openai`): facts.yaml version bump + drift-discipline notes; this ADR is NOT superseded because the doctrine (family + fallback + threshold) is unchanged. ✓
- **Rename to a multi-provider mix** (e.g., primary = Anthropic for narrative, OpenAI for embeddings): facts.yaml schema change (split `ai-model-primary` into `ai-model-primary-narrative` and `ai-model-primary-embeddings`); this ADR is NOT superseded, but `content/facts.yaml` schema bump requires a new ADR D-NNNN. ✓ (Future state; not current.)

### 6.2 Owner and schedule

- **Owner:** Claude Code (engineering division per `agents/engineering.md` for the build_business_plan.py edit; research division per `agents/research.md` for the risk register rows).
- **Schedule:** L5 amendment landed 2026-07-28 (V1.1 audit, Phase A.2.b of the customized perfection plan). Risk register rows added 2026-07-28. This ADR is the durable record.
- **Tracking:** Persistent Tracking Items table of the perfection plan; calendar reminder 2026-12-24 (7-day warning) and 2026-12-31 (target).

## 7. Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Provider renames mid-cycle and facts.yaml doesn't get version-bumped | Low | High | Drift-discipline (PRP-A A-7) requires version bump on any fact change; preflight.py checks for stale facts at send time |
| 6h threshold is wrong (too long or too short for real incident durations) | Medium | Medium | Review date 2026-12-31; StatusGator tracking ongoing; threshold can be adjusted in facts.yaml without re-issuing this ADR |
| Reader of long plan sees stale 4h threshold (if L5 amendment doesn't propagate) | Low | Medium | Phase A.2.b audit disposition; rebuild via `python scripts/build_business_plan.py` propagates the L5 edit to all consumers |
| Agent drift (RR-AI-02) actually manifests | Medium | Medium | Risk register review (weekly); engineering division monitors for drift signals; constitution/03-execution-plan.md exit criteria are the structural defense |
| Reader looks in `architecture/04-systems-architecture.md` for the doctrine (since the pre-correction citation was there) | Medium | Low | Phase A.4 of the perfection plan adds a redirect comment to that file; L5 amendment cites facts.yaml directly |

## 8. Rollback

If the 6h threshold proves wrong, or if the doctrine needs to be re-pinned to a specific provider:

1. **Threshold change:** Edit `content/facts.yaml` key `ai-model-fallback` notes field (line 407). facts.yaml version bump. Drift-discipline regenerates facts.lock.yaml. No ADR change needed.
2. **Provider change:** Edit `content/facts.yaml` key `ai-model-primary`. facts.yaml version bump. Drift-discipline regenerates facts.lock.yaml. Pre-flight checks the family package for any direct provider references (none in the 3 attachments as of 2026-07-28). No ADR change needed UNLESS the rename changes the schema (e.g., multi-provider).
3. **Schema change (multi-provider):** Issue a new ADR D-NNNN superseding this one. Update constitution/02-charter.md if the change affects org doctrine.
4. **Complete retraction of the doctrine:** Issue D-NNNN "AI provider doctrine retired." Update facts.yaml to remove the keys. Long plan L5 section deleted (not amended).

No irreversible commitment is made by this ADR — the doctrine is artifact-locked, not provider-locked, so all paths are reversible at the facts.yaml layer.

## 9. Confidence

**0.90** (shipped). High confidence because:
- The canonical state in facts.yaml is internally consistent (line 389-407).
- The 6h threshold rationale (StatusGator incident durations 9-17h) is research-grounded.
- The L5 amendment is mechanical (citation fix + threshold update) and has been applied.
- The risk register rows are derived from the same research and tie back to the doctrine.

Confidence is not 0.95+ because:
- The doctrine durability test (§6.1) is forward-looking and depends on the drift-discipline staying in force.
- The risk register rows are new and unverified against real incidents.
- A future provider rename will test the "no ADR change needed" claim; the test has not been performed.

## 10. Review date

**2026-12-31.** The Q4 / year-end cycle. Review checklist:
- Has the provider changed? (If yes: facts.yaml version bump check.)
- Has the 6h threshold held up against real incidents? (If no: edit notes; if yes: confirm.)
- Have RR-AI-01 / RR-AI-02 materialized? (If yes: incident postmortem + new ADR.)
- Is the doctrine "durable artifact, not provider" still the right framing? (If no: new ADR D-NNNN supersedes this one.)

If 2026-12-31 passes without review, Claude Code escalates to founder via the steward channel.

---

## Appendix A — Canonical keys (verbatim from `content/facts.yaml`)

```yaml
- key: ai-model-primary
  value: "claude-anthropic"
  units: string
  source: "org doctrine (self-reference: this file content/facts.yaml keys ai-model-primary and ai-model-fallback constitute the durable doctrine; architecture/04-systems-architecture.md does NOT contain AI doctrine — canonical state lives here)"
  effective: "2026-07-28"
  review: "2026-12-31"
  confidence: 5
  scope: long-plan
  notes: "Primary AI model family. May change; doctrine is the durable artifact, not the provider."

- key: ai-model-fallback
  value: "secondary-model-same-family"
  units: string
  source: "org doctrine (see ai-model-primary; canonical state lives in this file content/facts.yaml)"
  effective: "2026-07-28"
  review: "2026-12-31"
  confidence: 4
  scope: long-plan
  notes: "Fallback procedure: secondary Anthropic model (haiku) when primary unavailable. >6h continuous outage triggers manual operating window (raised from 4h→6h to match the bulk of real Anthropic mid-2026 incident durations per StatusGator tracking)."
```

## Appendix B — L5 amendment (in `scripts/build_business_plan.py`)

Pre-correction (v1.1 L5 as landed 2026-07-28):
> AI model provider & fallback — Claude primary + 4hr retry + secondary + manual window

Post-correction (Phase A.2.b L5 amendment, applied 2026-07-28):
> AI model provider & fallback — Claude primary + 6hr retry (raised from 4h to match StatusGator 2026-06/07 incident durations) + secondary same-family + manual window. See `content/facts.yaml` (keys: ai-model-primary, ai-model-fallback) and D-0063.

## Appendix C — Risk register rows to add to `state/risk-register.yaml`

```yaml
- id: RR-AI-01
  title: "AI model provider outage (>6h continuous)"
  likelihood: medium
  impact: high
  owner: engineering
  mitigation: "see content/facts.yaml ai-model-fallback + governance/decisions/0063-claude-anthropic-ai-provider-claim.md"
  review: 2026-12-31
  status: open

- id: RR-AI-02
  title: "Agent drift over time (13 agents diverging from doctrine)"
  likelihood: medium
  impact: medium
  owner: knowledge
  mitigation: "Weekly agent-spec lint via scripts/lint-agents.ts; constitution/03-execution-plan.md exit criteria are the structural defense"
  review: 2026-12-31
  status: open
```

## Appendix D — Relationship to other ADRs

- **D-0062** (Source Reconciliation Exception) — independent; not affected.
- **D-0060** (Five-plane hero architecture) — visual; not affected.
- **D-0059** (Hero simplification + extension) — visual; not affected.
- **PRP-A A-7** (facts.yaml lock + drift discipline) — the canonical-source policy this ratification operates under.
- **V1.1 row L5** in `scripts/build_business_plan.py` — the patch that surfaced the gap; amended in this ratification.
- **State/risk-register.yaml** — receives RR-AI-01 and RR-AI-02 per Appendix C.

---

**End of D-0063.**
