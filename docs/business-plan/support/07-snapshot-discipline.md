# S-07 — Snapshot Discipline (`output/snapshots/<ts>/SUMMARY.md`)

**Document ID:** DOCS-BP-S-07-SNAPSHOT-DISCIPLINE
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent + build steward

---

## 1. Purpose

This document specifies the snapshot discipline — every snapshot directory under `output/snapshots/` must carry a `SUMMARY.md` that makes the snapshot self-describing and reproducible.

---

## 2. Snapshot directory layout

```
output/snapshots/
  <timestamp>_<description>/
    SUMMARY.md           (required)
    *.html               (artifact HTML)
    *.pdf                (artifact PDF)
    *.md                 (any MD sources)
    build_log.json       (build metadata)
```

### 2.1 Naming

`<timestamp>` is ISO 8601 UTC with hyphens (filesystem-safe): `2026-07-29T12-00-00Z`.

`<description>` is a short kebab-case slug: `post_v1.1_family_package`, `post_condensed_business_plan`.

---

## 3. SUMMARY.md format

```markdown
# Snapshot — <timestamp>

**Timestamp:** <UTC> (<EDT>)
**Version:** <version>
**Variants included:** <list>
**Description:** <one-line purpose>

## Files

| File | SHA-256 | Size |
|---|---|---:|
| business_plan_grass_condensed_v1.1.pdf | <hash> | <bytes> |
| business_plan_grass_mission1_v1.1.pdf | <hash> | <bytes> |
| cover_letter_v1.1_family.html | <hash> | <bytes> |
| business_plan_grass_summary_card_v1.1.pdf | <hash> | <bytes> |

## What changed since previous snapshot

<2–4 sentences>

## What was sent (if any)

| Timestamp | Recipient | Variant | Result |
|---|---|---|---|
| 2026-07-29T08:00 EDT | <email> | family | success |

## Send status

<success / failure / not-sent>

## Known limitations

- <list of unresolved placeholders, missing data, or warnings>

## Source SHA

<git-sha>

## Founder approval

- [ ] Approved: ____ Date: ____

## Rollback reference

To restore from this snapshot, copy files from this directory to
`output/procurement/`:

```bash
cp output/snapshots/<timestamp>_<description>/* output/procurement/
```
```

---

## 4. Required fields (minimum 12)

1. Timestamp (UTC + EDT)
2. Version
3. Variants included
4. Files (table with hashes + sizes)
5. What changed (narrative)
6. What was sent (table)
7. Send status
8. Known limitations
9. Source SHA
10. Founder approval status
11. Rollback reference (with copy command)
12. Description (one-line purpose)

---

## 5. Backfill for existing snapshots

For the three existing snapshots:

- `output/snapshots/2026-07-27T20-50_post_business_plan_build/`
- `output/snapshots/2026-07-27T23-06-31_post_business_plan_with_evaluation/`
- `output/snapshots/2026-07-28T00-41-26_post_condensed_business_plan/`

`SUMMARY.md` files are generated this cycle (A-11). Each captures the snapshot's contents from the build log and the existing `~/.owl/sent_emails.jsonl` entries.

---

## 6. Future snapshots (mandate)

From this cycle forward, every snapshot created by any build script automatically gets a `SUMMARY.md`. The build pipeline refuses to create a snapshot directory without one.

---

## 7. Acceptance evidence

- **A-AC13:** All 3 existing snapshots + any future snapshot have `SUMMARY.md`.

---

## 8. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |