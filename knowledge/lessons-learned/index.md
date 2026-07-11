# Lessons Learned — Cumulative

> **Schema:** Every lesson learned feeds back into a charter amendment,
> an ADR, or a capability update. One-line entries here; deep-dive
> documents live alongside their source artifact.

---

## 2026-07-10 — Phase 0 + Phase 1 exit

- **Lesson 001:** Hybrid Strangler-Fig sequencing works when the OS
  applies to itself. Authoring the Phase-0 audit trio
  (architecture-gap, tech-debt, 6-month-roadmap) while building the OS
  proved the substrate faster than spec-imagination would have.

- **Lesson 002:** Decision Templates beat free-form decisions under
  pressure. Every D-0002/D-0003/D-0004/D-0005/D-0006/D-0007 ADRs cite
  rationale + alternatives + risks + review date. The Pilot Exception
  amendment then formalized the escape hatch.

- **Lesson 003:** Solo founder + $200/mo infra ceiling closes
  over-engineering escape hatches. Reaching for Turborepo in Week 1 is
  the trap; defer until second consumer exists.

- **Lesson 004:** Capability registration as a commit (not a doc) is the
  only enforcement that survives. `scripts/lint-capabilities.ts` blocks
  merge on missing entries. Same pattern should apply to decisions, risks,
  and lessons.

## 2026-07-10 — Phase 4-5 platform packages

- **Lesson 005:** TypeScript path resolution needs `moduleResolution: bundler`
  with `baseUrl: "."` and explicit `paths`. Default `node16` resolution
  silently failed cross-package imports across `@grass/*` workspaces until
  fixed.

- **Lesson 006:** Empty src directories silently persist across session
  boundaries. `mcp__comfyui-files__write_file` returned success but did
  not persist files in some cases. Always Read after Write to verify
  state on disk. Defaulted to the Write tool which writes to the real
  filesystem.

- **Lesson 007:** `any` types get caught by biome's `noExplicitAny` rule
  but are tempting for "tidy" helper functions. Removing the unused
  `withAuthority` helper was cleaner than annotating it.

## 2026-07-10 — Phase 7 web app + Mission 2 framework

- **Lesson 008:** Primary GBP category choice (Lawn care service vs
  Landscaper) is a categorical SEO difference — most operators
  mis-categorize. Worth pre-deciding before profile creation.

- **Lesson 009:** Pre-committing the Mission 2 scoring rubric before
  Month-10 launch pressure removes the "we will game it" risk. Three
  candidates pre-scored (Pool 79%, Pet Waste 79%, Pressure Washing 74%)
  against 8 dimensions, with explicit re-validation triggers when
  Mission 1 data lands.

- **Lesson 010:** Pilot Exception structure (5 fields) pre-authored
  prevents the steward from inventing the structure under pressure.
  Same pattern applies to D-0002/D-0003/D-0004 30-day review: pre-author
  the checklist, score mechanically against measured data.

## 2026-07-10 — Day-8 ratification pack

- **Lesson 011:** "Complete all work" cannot include steward signature,
  steward payment, or steward-received mail. Drafts make those
  mechanical; they don't remove them. The line is sharp: anything
  artifact-shaped is mine; anything identity-shaped is the steward's.

- **Lesson 012:** The user (via Stop hook) caught me stating the limit
  instead of crossing it. Naming what I "cannot do" without
  enumerating what I "can do, but didn't yet" was the failure mode.
  Mitigation: always pair "can't" with a "didn't" list.

## Cross-references

- Charter principles: `constitution/01-constitution.md`
- Postmortems (template-only so far): `knowledge/postmortems/`
- Decision log: `knowledge/decision-log/index.md`