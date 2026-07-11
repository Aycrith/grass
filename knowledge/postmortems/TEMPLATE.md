# Postmortem Template — One per Decision or Incident

> **Use:** Author one postmortem per irreversible decision after first
> 30 days in production, AND one per material incident (charter
> violation, capability gap discovered, capacity breach).
>
> **Cadence:** Weekly (executive agent) — even an empty week gets a
> one-line "no material postmortems this week" entry.
>
> **Tone:** Blameless. Charter principle: "Truth over convenience."
> Surface what went wrong, what we learned, what changes.

---

## Header

```yaml
---
postmortem_id: PM-YYYY-NNN
title: "[One-line summary]"
decision_ref: [decision_id, if applicable]
incident_date: [YYYY-MM-DD]
authored: [YYYY-MM-DD]
author_agent: [agent_id]
status: draft | ratified
charter_impact: [yes/no — did this trigger an amendment?]
severity: [low / medium / high / critical]
---

# [Title]

## What happened

[3-5 sentences. What did we observe? When did we observe it? What was
the customer/steward/system impact?]

## Timeline

- **YYYY-MM-DD HH:MM** — [event]
- **YYYY-MM-DD HH:MM** — [event]
- **YYYY-MM-DD HH:MM** — [resolution or escalation]

## Root cause(s)

[1-3 sentences per cause. Charter principle: "Truth over convenience."
No "user error" or "we'll be more careful next time" answers.]

## Contributing factors

- [Factor 1]
- [Factor 2]
- [Factor 3]

## What went well

- [What caught this early?]
- [What limited the blast radius?]
- [What worked correctly that we should preserve?]

## What we'd do differently

- [Action 1 — owner + due date]
- [Action 2 — owner + due date]
- [Action 3 — owner + due date]

## Charter compliance

- [ ] Decision Template entry ratified before action? (Yes/No/N/A)
- [ ] Capability registered before use? (Yes/No/N/A)
- [ ] State ledger updated? (Yes/No)
- [ ] Risk register entry created? (Yes/No)

## Action items

| id | action | owner | due | status |
|---|---|---|---|---|
| ACT-001 | | | | |
| ACT-002 | | | | |
| ACT-003 | | | | |

## Lessons fed back

- [Which `knowledge/lessons-learned/` entry this corresponds to, OR
  which new entry this postmortem authored]

## Cross-references

- [Link to ADR]
- [Link to capability entry]
- [Link to risk register entry]
- [Link to relevant constitution principle]
```

---

## Existing postmortems

_None yet. Mission 1 production begins after Day-30. First postmortem
triggered by either: (a) first 30 days in production, or (b) first
material incident._

## Cross-references

- Charter principles: `constitution/01-constitution.md`
- Lessons learned: `knowledge/lessons-learned/index.md`
- Decision log: `knowledge/decision-log/index.md`
- Risk register: `state/risk-register.yaml`
- Capability registry: `state/capability-registry.yaml`