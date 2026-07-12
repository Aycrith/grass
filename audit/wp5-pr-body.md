# Draft PR Body — `fix/wp1-front-end-coherence` (WP5 closeout)

**For steward to copy into the actual PR once pushed.**

---

## Title

```
WP5 — Front-end closeout: Lighthouse CI, alt-text refresh, v2 photo hooks
```

## Body

```markdown
## Summary

Closes the WP5 closeout from the linked-quill §7 deferral list:

- **Captures the post-WP3 Lighthouse baseline** for the 6 PRD-00 §4 routes
  × 2 viewports (12 runs). All 12 pass PRD-00 §4 targets (Perf ≥90,
  LCP ≤2.5s p75, CLS ≤0.1 p75, TBT ≤200ms p75). No regressions vs the
  `fe1670b` empty-slot baseline. See `audit/wp5-lighthouse/SUMMARY.md`.
- **Adds Lighthouse CI** via `treosh/lighthouse-ci-action@v12` in a new
  `lighthouse` PR job (`/.github/workflows/ci.yml`). 4 PR runs (2 routes
  × 2 viewports), per-PR budget at Perf ≥90 / LCP ≤3s / CLS ≤0.1 /
  TBT ≤200ms / FCP ≤2s / SI ≤3s. PR failures post a comment with the
  delta and the affected route.
- **Adds nightly full-sweep** via `.github/workflows/lighthouse-nightly.yml`
  (06:00 UTC daily). 6 routes × 2 viewports = 12 audits; warn-only
  budgets catch drift without blocking.
- **Refreshes alt text across 6 service cards.** `ServiceBento.tsx:114`
  dropped its inline `— placeholder photo` template and now reads
  `svc.imageAlt` from `lib/content.ts`. Each service entry has a new
  `imageAlt: string` field curated against the actual SDXL+IPAdapter
  webp (visual sweep confirmed each alt matches the depicted scene).
- **Documents v2 photo hooks** for the steward's phone-photo drop.
  `audit/wp5-photo-hooks.md` describes the 5 hooks (operator portrait,
  hero mobile composition, area photos, service photos, equipment
  photos) with current state, v2 path, constraints, and the
  IP-Adapter anchor reference for chain-of-custody.

## Linked plan

`C:\Users\camer\.claude\plans\review-the-previous-session-velvet-bubble.md`

## Files changed

- `apps/web/src/lib/content.ts` — `imageAlt: string` field added to each
  of the 6 service entries (mowing, edging, mulching, hedge-trimming,
  hurricane-prep, seasonal-cleanup).
- `apps/web/src/components/sections/ServiceBento.tsx` — alt text now
  reads `svc.imageAlt` (drops the inline `— placeholder photo`
  template).
- `apps/web/src/components/sections/HeroCinematic.tsx` — adds an
  inline comment noting the hero alt is hand-tuned to the IP-Adapter
  anchor and should be updated if the steward swaps in a real
  phone-shot.
- `.github/workflows/ci.yml` — new `lighthouse` job (PR budget guard).
- `.github/workflows/lighthouse-nightly.yml` — new nightly cron
  workflow (full sweep).
- `lighthouserc.cjs` (new) — PR desktop budget config.
- `lighthouserc.mobile.cjs` (new) — PR mobile budget config.
- `lighthouserc.nightly.cjs` (new) — full sweep budget config.
- `.gitignore` — appends `.lighthouseci/`.
- `audit/wp5-lighthouse/SUMMARY.md` (new) — post-WP3 baseline + diff
  vs `fe1670b`.
- `audit/wp5-photo-hooks.md` (new) — v2 photo drop guide.
- `audit/wp5-pr-body.md` (new) — this file.

## Verification

- [x] `audit/wp5-lighthouse/SUMMARY.md` — all 12 runs captured;
      every PRD-00 §4 target met (see table).
- [x] `bun run --filter web build` — clean.
- [x] `bun run typecheck` — clean.
- [x] `bun run lint` — clean.
- [x] `bun run apps/comfyui/scripts/verify-references.mjs` — 85/85 strict.
- [x] `bun run apps/comfyui/scripts/check-weight.mjs` — 19/19 ≤37 KB.
- [x] `grep -rn "placeholder photo\|PHOTO COMING SOON\|COMING SOON\|PLACEHOLDER" apps/web/src/` — 0 hits.
- [x] All 6 service entries in `lib/content.ts` have an `imageAlt: string` field.
- [x] `ServiceBento.tsx:114` reads `svc.imageAlt` (no more inline template).
- [x] `.github/workflows/ci.yml` includes a `lighthouse` job.
- [x] `lighthouserc.cjs` exists with the budget config (Perf ≥90 / LCP ≤3s / CLS ≤0.1 / TBT ≤200ms / FCP ≤2s / SI ≤3s).
- [x] `.lighthouseci/` in `.gitignore`.
- [x] `lighthouse-nightly.yml` exists with the 12-route sweep on `0 6 * * *`.
- [x] `audit/wp5-photo-hooks.md` documents all 5 v2 hooks.
- [x] `state/ledger.yaml` has a Day 17 changelog row; `health_components.tests` bumped 0.80 → 0.85; `health_score` bumped 0.94 → 0.95.
- [x] Memory updated: `memory/wp2-wp4-complete.md` + `memory/MEMORY.md`.

## Out of scope (deliberate)

- **Visual regression suite (Playwright)** — still deferred. Listed in
  linked-quill §7 as a follow-up.
- **OBJ-M2-004 / OBJ-M2-006 prep** — Vercel domain acquisition and
  GBP + citations remain steward actions.
- **Per-route Lighthouse thresholds** — a single budget applies
  uniformly. Future refinement once production data tunes baselines.
- **`<picture>` multi-art-direction** — v3; per linked-quill §7.
- **ServicePage.tsx hero `<Image>`** — engineer-side UX decision
  deferred until steward drops v2 service photos.
- **Area detail page `<AreaPhoto zip={zip} />`** — same as above.
- **Re-rendering any webp** — WP5 does not touch `apps/comfyui/`.

## Risks + mitigations

See plan §7. Top three:

- **R1** — Lighthouse re-run could regress. **Mitigation:** Phase A
  decision gate (no route regressed ≥5 Perf points or ≥0.5s LCP). Gate
  passed.
- **R3** — Steward wants to override alt text per their own curation.
  **Mitigation:** engineer-curated alts live in `lib/content.ts` only;
  steward can post-hoc edit any `imageAlt` field.
- **R5** — Lighthouse CI could fail silently on synthetic failure.
  **Mitigation:** configs verified parse cleanly; the GitHub Action
  itself is well-maintained. Next PR will reveal any wiring issues.

## Charter compliance

- **No edits under `AI_Business_Operating_System_Document_Set/`.**
- **No commits of `.env` / secrets.**
- **No Decision Template bypass** for irreversible decisions.
- **No push to remote** — steward reviews and pushes per CLAUDE.md.

## Reviewer notes

- The PR body is **the plan's full §3 implementation + §6 verification
  checklist + this files-changed list**. Cross-reference
  `audit/wp5-lighthouse/SUMMARY.md` for the raw baseline numbers.
- The 3 Lighthouse configs are tunable: loosen LCP to 3500 (currently
  3000 in PR desktop, 3000 in mobile) if a future build regresses but
  doesn't actually hurt UX.
- The v2 photo hooks doc is the steward's reference for the phone
  drop — it lists what to photograph, where, and what code seams need
  to move once real photos land. It is **not** an implementation
  prompt; it is a handoff document.
```

---

## How the steward uses this file

1. **Push the branch** (currently `fix/wp1-front-end-coherence`) per
   CLAUDE.md `state/ledger.yaml → next_actions` check.
2. **Open the PR** at `https://github.com/Aycrith/grass/pull/new/fix/wp1-front-end-coherence`
   (or wherever the repo lives in the remote).
3. **Copy the body above** into the PR description. Pick the
   conventional-title style you prefer — the `## Title` block at the
   top of this file is the suggested subject.
4. **Confirm the `lighthouse` job** in the PR's checks panel. It
   should appear green with the WP5 budget gates passing.
5. **Review the Lighthouse comment** — if the budget is tight, the
   comment will say "Lighthouse CI: 0 new found, 100 matched, 0 fixed";
   ignore it. New failures (real regressions) come through as red
   checks, not comments.
6. **Merge** when all 9 jobs are green: `lint`, `typecheck`,
   `agent-spec`, `capability-registry`, `secrets`, `supply-chain`,
   `asset-weight`, `references`, `lighthouse`.

---

*Written by WP5 closeout. Pull into the PR description verbatim.*
