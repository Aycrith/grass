/**
 * POST /api/review-handler — WP13 stub for the negative-review
 * feedback branch.
 *
 * Reviews left on /review (1-3 star branch) post here. The
 * payload is `{ rating, name, zip, message }`. v1 is a stub that:
 *
 *   1. Logs the payload to the server console (dev only;
 *      production traffic would forward to the Phase-3 backend,
 *      email the operator, or queue to a cron worker).
 *   2. Returns 200 OK so the form collapses into the "Sent"
 *      branch.
 *
 * This stub is intentionally minimal. The Phase-3 milestone
 * (Supabase `reviews` table + operator notification email)
 * wires this endpoint to real persistence. Until then, the
 * gate `reviewPage.reviewMagnetEnabled` should stay false
 * unless the steward actively wants to collect feedback in
 * the in-memory log.
 *
 * Important: do not enable this in production until the real
 * handler is wired. The current stub does not persist anything
 * beyond the Node.js process lifetime.
 */

import { type NextRequest, NextResponse } from 'next/server';

interface ReviewPayload {
  rating?: number;
  name?: string;
  zip?: string;
  message?: string;
}

function isReviewPayload(value: unknown): value is ReviewPayload {
  return typeof value === 'object' && value !== null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!isReviewPayload(payload)) {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
  }

  const { rating, name, zip, message } = payload;
  // Dev-only log. The Phase-3 wiring drops this and forwards to
  // Supabase + email.
  console.info('[review-handler] negative-review feedback received', {
    rating,
    name,
    zip,
    messagePreview: typeof message === 'string' ? message.slice(0, 140) : '',
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

export async function GET(): Promise<NextResponse> {
  // GET is not a valid verb for this endpoint; explicit 405.
  return NextResponse.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
}
