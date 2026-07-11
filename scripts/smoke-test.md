# GRASS — Smoke-Test Protocol (re-runnable)

> **Purpose.** Prove the OS can apply to itself. A new Claude Code session,
> pointed at this repo, must be able to: (a) load context from `CLAUDE.md`,
> (b) enumerate the open items in `state/ledger.yaml`, (c) translate that
> enumeration into a concrete next-action set, all **without** a steward
> correction.
>
> **Re-run policy.** Re-run on every Phase transition. Log transcript
> appended below.

---

## Pass criteria (ALL must succeed for Phase 0 + Phase 1 exit)

1. **Read CLAUDE.md first.** New session loads the canonical index, which
   cross-links constitution, state ledger, risk register, capability
   registry, agent specs.
2. **Enumerate ledger `objectives.active` + `next_actions.immediate` +
   `next_actions.week_2`.** No human intervention.
3. **Identify the next 3 concrete commits** the steward would have to author
   without the OS.
4. **Confirm all charter-compliance tests pass** (`bun run test:charter`).
5. **Confirm `git status` is clean** OR explains every uncommitted file as
   the current deliverable.
6. **No irreversible decision proposed without a Decision Template entry
   present in `governance/decisions/`.**

---

## How to run

```bash
bun run test:charter && bun test && bun run validate
```

All three must pass green. Output of each is the new transcript entry.

---

## Smoke-test transcript log (newest first)

### Run #2 — 2026-07-10, post Phase 4-7 build-out

```text
$ bun run test:charter
✓ lint-agents: 13 agent specs validated against schema.
✓ lint-capabilities: 9 capabilities validated against registry schema.
✓ ledger-freshness: state/ledger.yaml is 1.1 days old (limit: 7).
✓ Charter compliance: all checks passed.

$ bun test
131 pass, 0 fail, 182 expect() calls

$ bun run validate
✓ biome check .                  (Checked 87 files. No fixes applied.)
✓ tsc --noEmit                   (root + apps/web both clean)
✓ bun run test:charter           (all green)

$ cd apps/web && bun run build
✓ Compiled successfully
✓ 18 routes generated
  - 1 home (/), 1 services index, 6 service detail (SSG)
  - 1 areas index, 6 area detail (SSG), 1 pricing, 1 about, 1 contact
  - 1 gbp (noindex), 1 privacy, 1 terms, 1 404
  - 1 API: /api/lead
  - 1 sitemap.xml, 1 robots.txt

$ git log --oneline | head -10
5486ed5 fix(web): apps/web builds end-to-end — close 12 type errors + path resolution
d8e8a9b docs(drafts+knowledge): close the ratification pack + seed knowledge management
2bebe7d docs(ratification): Day-8 pack — 6 drafts ready to execute + Mission 2 scored + 30-day review
fa239de docs(phase-10): Mission 2 readiness framework + 3 candidate verticals
62632a0 feat(web): Phase 7 landscaping MVP web app (Next.js 15, 18 pages)
7d8e907 feat(platform): Phase 4-5 platform packages (auth, crm-core, payments-core, scheduling-core, notifications-core, database)
77509f2 feat(os-substrate): Phase 2-3 digital twins + workflows + testing + observability
```

**STATUS: PASS.** All D-0001 through D-0007 ADRs are committed
(`governance/decisions/0001-pilot-exception.md` + 6 numbered ADRs).
The OS is now self-verifying: tests pass on `bun test`, types pass on
`tsc`, charter-compliance passes on every push, and the Next.js
production build generates 18 unique routes.

### Run #1 — 2026-07-10, Phase 0 + 1 exit

[See git history — original Day-5 transcript. Superseded by Run #2.]\
