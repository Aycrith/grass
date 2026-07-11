/**
 * /api/lead — Lead capture endpoint.
 *
 * Validates input, calls @grass/crm-core createLead, and dispatches the
 * auto-acknowledgement via @grass/notifications-core sendLeadResponse.
 *
 * Charter binding: lead:create allows customer / crew_member / steward / system
 * principal kinds, but the website's anonymous visitor is unauthenticated.
 * We construct a transient `system` principal representing the inbound
 * webhook so the same authority ladder applies.
 *
 * Response is intentionally minimal — never leak internal IDs to the
 * browser. The `lead_id` here is for support only, stored in PostHog.
 */

import { inServiceArea } from '@/lib/business';
import type { Principal } from '@grass/auth';
import { createLead } from '@grass/crm-core';
import { sendLeadResponse } from '@grass/notifications-core';
import { NextResponse } from 'next/server';

interface LeadInput {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  zip: string;
  message?: string;
  source?: string;
}

function validateLead(
  input: Partial<LeadInput>,
): { ok: true; data: LeadInput } | { ok: false; error: string } {
  if (!input.first_name || input.first_name.trim().length < 1) {
    return { ok: false, error: 'First name required.' };
  }
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { ok: false, error: 'Valid email required.' };
  }
  if (!input.zip || !/^\d{5}$/.test(input.zip)) {
    return { ok: false, error: '5-digit ZIP code required.' };
  }
  if (!inServiceArea(input.zip)) {
    return {
      ok: false,
      error: `Sorry — we don't currently service ${input.zip}. We cover ${process.env.NEXT_PUBLIC_SERVICE_AREA ?? '33756, 33770, 33771, 33773, 33774, 33778'}.`,
    };
  }
  return {
    ok: true,
    data: {
      first_name: input.first_name.trim(),
      ...(input.last_name?.trim() ? { last_name: input.last_name.trim() } : {}),
      email: input.email.trim().toLowerCase(),
      ...(input.phone?.trim() ? { phone: input.phone.trim() } : {}),
      zip: input.zip.trim(),
      ...(input.message?.trim() ? { message: input.message.trim() } : {}),
      source: input.source ?? 'website',
    },
  };
}

const systemPrincipal: Principal = { kind: 'system', workflow_id: 'wf_lead_capture' };

export async function POST(req: Request) {
  let body: Partial<LeadInput>;
  try {
    body = (await req.json()) as Partial<LeadInput>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  const validated = validateLead(body);
  if (!validated.ok) {
    return NextResponse.json({ ok: false, error: validated.error }, { status: 400 });
  }

  try {
    // 1. Persist lead via CRM service layer.
    const lead = await createLead(
      {
        first_name: validated.data.first_name,
        ...(validated.data.last_name ? { last_name: validated.data.last_name } : {}),
        ...(validated.data.phone ? { primary_phone: '' } : {}),
        email: validated.data.email,
        ...(validated.data.phone ? { phone: validated.data.phone } : {}),
        zip: validated.data.zip,
        ...(validated.data.message ? { message: validated.data.message } : {}),
        source:
          (validated.data.source as
            | 'gbp'
            | 'website'
            | 'referral'
            | 'yard_sign'
            | 'nextdoor'
            | 'manual'
            | undefined) ?? 'website',
      },
      systemPrincipal,
    );

    // 2. Auto-acknowledge via notifications (SMS if phone present, else email).
    await sendLeadResponse(
      {
        first_name: lead.first_name,
        ...(lead.phone ? { phone: lead.phone } : {}),
        email: lead.email,
        preferred_contact_method: lead.phone ? 'sms' : 'email',
      },
      systemPrincipal,
    );

    // 3. PostHog event (fire-and-forget — never block UX on analytics).
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      void fetch(`${process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'}/capture/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
          event: 'lead_captured',
          distinct_id: lead.id,
          properties: { zip: lead.zip, source: lead.source },
        }),
      });
    }

    return NextResponse.json({
      ok: true,
      message: 'Thanks — we will be in touch within 24 hours.',
    });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
