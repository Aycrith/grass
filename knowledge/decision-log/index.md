# Decision Log — Master Index

> **Schema:** Every decision in `governance/decisions/` gets a one-line
> entry here with its decision_id, status, rationale, and review date.
> Postmortems trace back to decisions via this index.

---

## Ratified decisions

| decision_id | slug | status | ratified | review_date | rationale | ADR |
|---|---|---|---|---|---|---|
| D-0001 | pilot-exception | ratified | 2026-07-10 | 2026-08-09 | Hybrid Strangler-Fig sequencing requires a formal exception mechanism to stay charter-compliant | `constitution/charter-amendments/pilot-exception.md` |
| D-0002 | tech-stack-primary | ratified | 2026-07-10 | 2026-10-10 | TypeScript strict + Bun + Next.js + Supabase + Stripe + Vercel + Jobber. Solo leverage, $200/mo ceiling, managed services | `governance/decisions/0002-tech-stack.md` |
| D-0003 | mission-1-service-area | ratified | 2026-07-10 | 2026-09-01 | Largo 33771 single-city hyperlocal tractable for solo founder; year-round mowing | `governance/decisions/0003-service-area.md` |
| D-0004 | operating-model-lean | ratified | 2026-07-10 | 2026-10-01 | Forces architectural discipline; $200/mo ceiling; close over-engineering escape hatches | `governance/decisions/0004-operating-model.md` |
| D-0005 | entity-choice | ratified | 2026-07-10 | 2026-10-10 | FL single-member LLC, disregarded entity for tax (simplicity > S-Corp payroll savings at solo-founder scale) | `governance/decisions/0005-entity-choice.md` |
| D-0006 | insurance-broker | ratified | 2026-07-10 | 2026-10-10 | Specialist broker with 3 quotes; ≥$1M GL; workers comp exemption | `governance/decisions/0006-insurance-broker.md` |
| D-0007 | brand-domain | ratified (phase A) | 2026-07-10 | 2026-10-10 | Local-keyword-anchored + matching .com; phase B = concrete name | `governance/decisions/0007-brand-domain.md` |

## Pending decisions

| decision_id | slug | due_date | confidence | blocked_by | rationale_pending |
|---|---|---|---|---|---|
| D-0005-B | sunbiz-formation-submission | 2026-07-25 | — | steward signature | Awaiting Sunbiz filing. Draft at `drafts/sunbiz/articles-of-organization.md`. |
| D-0006-B | insurance-bind | 2026-07-30 | — | 3 broker quotes | Awaiting 3 quotes + steward bind decision. |
| D-0007-B | brand-name-pick | 2026-07-20 | — | domain availability check | Awaiting domain check + steward selection from top 3. |

## Superseded / reversed decisions

_None yet._

## Cross-references

- ADRs: `governance/decisions/`
- Charter amendment process: `constitution/01-constitution.md`
- Decision framework: `governance/05-decision-framework.md`
- 30-day review checklist (D-0002/D-0003/D-0004): `governance/decisions/review-checklist-d0002-d0004.md`