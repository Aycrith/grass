# `@grass/notifications-core` — Twilio SMS + Resend email

> **Phase:** draft (Phase 4-5 wire to Twilio + Resend).
> **Owner agent:** operations (transactional), marketing (review requests).

## Capabilities served

| Capability | Function |
|---|---|
| (lead response) | `sendLeadResponse` |
| cap_review_request | `sendReviewRequest` |
| (invoice dunning) | `sendInvoiceReminder` |
| (hurricane cascade) | `sendStormNotice` |
| (job on-the-way) | `sendJobDispatch` |

## Channel choice

Per `Customer.preferred_contact_method`:
- `sms` → Twilio (transactional only, not marketing)
- `email` → Resend + React Email
- `phone` → voicemail drop (Phase 6+)

## Public API

```typescript
export interface SmsResult { sid: string; status: 'queued' | 'sent' | 'failed'; }
export interface EmailResult { id: string; status: 'queued' | 'sent' | 'failed'; }

export async function sendSms(to: string, body: string, p: Principal): Promise<SmsResult>;
export async function sendEmail(to: string, subject: string, body_html: string, p: Principal): Promise<EmailResult>;
export async function sendLeadResponse(lead: Lead, p: Principal): Promise<SmsResult | EmailResult>;
export async function sendReviewRequest(job: Job, p: Principal): Promise<SmsResult>;
export async function sendInvoiceReminder(invoice: Invoice, day: number, p: Principal): Promise<SmsResult | EmailResult>;
export async function sendStormNotice(customer: Customer, stormName: string, p: Principal): Promise<SmsResult | EmailResult>;
export async function sendJobDispatch(job: Job, etaMinutes: number, p: Principal): Promise<SmsResult>;
```

## Cost guardrails (per CLAUDE.md $200/mo infra ceiling)

| Channel | Per-unit cost | Monthly cap (solo founder) |
|---|---|---|
| Twilio SMS (US outbound) | $0.0079 | $20 (≈ 2500 SMS) |
| Resend email | $0.0004 | $5 (≈ 12K emails) |
| Twilio voice (voicemail drop) | $0.014/min | $10 |

Hard fail if monthly spend exceeds cap; charter-compliance warning.

## Tests

- `service.test.ts` — channel routing by Customer.preferred_contact_method
- `guardrails.test.ts` — monthly spend cap behavior