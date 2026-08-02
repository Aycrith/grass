# S-04 — Send Wrapper & Resend (`scripts/send_business_plan.py`)

**Document ID:** DOCS-BP-S-04-SEND-WRAPPER
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent

---

## 1. Purpose

This document specifies the extended send wrapper that handles all sending scenarios: full plan, condensed, with-evaluation, family package, summary card, and resend with correction summary.

---

## 2. Entry point

```bash
python scripts/send_business_plan.py [flags]
```

---

## 3. Flags

| Flag | Effect |
|---|---|
| `--condensed` | Attach condensed PDF only |
| `--with-evaluation` | Attach long plan + evaluator addendum |
| `--family` | Attach condensed PDF + family cover letter + summary card |
| `--summary-card` | Attach summary card only |
| `--resend <version>` | Resend prior version with correction summary |
| `--dry-run` | Print what would be sent; do not send |
| `--send` | Actually send (requires `--confirm-recipient`) |
| `--no-rebuild` | Use existing artifacts (do not rebuild) |
| `--attach-html` | Also attach HTML versions |
| `--pdf-only` | Skip HTML attachments |
| `--to <email>` | Recipient email address |
| `--subject <subject>` | Email subject line |
| `--confirm-recipient` | Required for any `--send` action |

### 3.1 Behavior matrix

| Flags | Attachments | Subject |
|---|---|---|
| (default) | long PDF + cover letter | "Largo Lawn Business Plan" |
| `--condensed` | condensed PDF + cover letter | "Largo Lawn Business Plan — Condensed" |
| `--with-evaluation` | long PDF + evaluator addendum + cover letter | "Largo Lawn Business Plan — With Evaluation" |
| `--family` | condensed PDF + family cover letter + summary card | "Largo Lawn — A small lawn-care business in Largo, FL" |
| `--summary-card` | summary card only | "Largo Lawn — Summary" |
| `--resend v1.0` | (current variant attachments) + correction summary in body | (current variant subject) + " (corrected)" |

---

## 4. Resend correction summary format

When `--resend` is used, the email body is prefixed with:

```
[CORRECTED — v1.1 supersedes v1.0]

This is an updated version of the Largo Lawn Business Plan. Three
factual corrections have been applied:

1. Florida minimum wage: $14.00/hr (current through 2026-09-29)
   and $15.00/hr (from 2026-09-30), per FL Constitution Amendment 2.
   [Previous: $13.00/hr]

2. Pinellas County sales tax: 7.0% (FL 6% + Pinellas 1.0% surtax),
   per FL DOR DR-15DSS 2026, effective 2025-01-01.
   [Previous: 6.75%]

3. Industry net margin benchmark: 10–15%, per NALP / IBISWorld 2026.
   [Previous: 7.9–13%]

No other material changes. Forecasts and structure are unchanged.
```

---

## 5. Confirmation gate

`--send` requires `--confirm-recipient` to proceed. If `--confirm-recipient` is absent, exit 1 with:

```
[BLOCK] --send requires --confirm-recipient for safety.
This prevents accidental sends to the wrong address.
```

`--confirm-recipient` echoes the recipient address back for visual verification:

```
[CONFIRM] Recipient: <email>
[CONFIRM] Attachments: [list]
[CONFIRM] Subject: <subject>

Proceed with send? Type recipient email to confirm: <email>
```

---

## 6. Send log

Every successful send appends to `~/.owl/sent_emails.jsonl`:

```json
{
  "timestamp": "2026-07-29T08:00:00-04:00",
  "to": "<email>",
  "subject": "<subject>",
  "attachments": [
    {"filename": "...", "sha256": "...", "size_bytes": 12345}
  ],
  "variant": "family",
  "version": "1.1",
  "result": "success",
  "build_sha": "..."
}
```

---

## 7. Acceptance evidence

- **A-AC6:** `--family --dry-run --to <email>` lists condensed PDF + family cover letter + summary card.
- **A-AC7:** `--resend v1.0 --dry-run` shows correction summary in email body preview.

---

## 8. Safety properties

- Default behavior unchanged (only flags opt in to new behavior).
- All --send requires --confirm-recipient.
- All sends logged.
- No send without explicit operator invocation (no auto-send).

---

## 9. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |