/**
 * /t/[source] — attribution redirector (route handler).
 *
 * Each social posting channel gets a stable short URL like
 * `/t/nextdoor-free-mow` that 302-redirects to /quote (or /contact,
 * /review) with the source + medium pre-attributed. The lead payload
 * from /quote or /contact carries that source into @grass/crm-core so
 * conversion-by-channel is queryable later.
 *
 * Stage 3 (per steward resolution Q-2):
 *  - The hardcoded `utm_medium: 'social'` blanket is replaced with a
 *    per-row `utm_medium` (controlled vocab: cpc | social | referral
 *    | email | print). This was the biggest source of attribution
 *    noise in the v2 redirector — every Google Ads click landed as
 *    `social`.
 *  - The `meta-ads` slug is REMOVED from CHANNELS (D-0064 §0.1 hard-
 *    stop on Meta spend before Stage 6 outcome ADR). Any inbound
 *    `/t/meta-ads` 302-redirects to `/channel-paused` so existing
 *    links fail soft rather than 404.
 *  - gclid/utm_term/utm_content are now passed through to the
 *    destination URL so the QuoteCalculator / ContactForm capture
 *    picks them up on mount.
 *
 * Adding a new channel = one row in CHANNELS. No code changes beyond
 * this file (except for paused channels, which need a row in
 * PAUSED_CHANNELS).
 */

import { type NextRequest, NextResponse } from 'next/server';

/**
 * Controlled vocab for utm_medium — imported from `@/lib/channels`
 * (single source of truth shared with the legacy migration script).
 */
import { type UtmMedium } from '@/lib/channels';

const CHANNELS: Record<
  string,
  { dest: string; utm_source: string; utm_campaign: string; utm_medium: UtmMedium }
> = {
  'nextdoor-free-mow': {
    dest: '/quote',
    utm_source: 'nextdoor',
    utm_campaign: 'free_first_mow',
    utm_medium: 'social',
  },
  'nextdoor-general': {
    dest: '/quote',
    utm_source: 'nextdoor',
    utm_campaign: 'general_intro',
    utm_medium: 'social',
  },
  'nextdoor-hurricane': {
    dest: '/quote',
    utm_source: 'nextdoor',
    utm_campaign: 'hurricane_prep',
    utm_medium: 'social',
  },
  'nextdoor-referral': {
    dest: '/quote',
    utm_source: 'nextdoor',
    utm_campaign: 'referral_credit',
    utm_medium: 'referral',
  },
  'nextdoor-local-deal': {
    dest: '/quote',
    utm_source: 'nextdoor',
    utm_campaign: 'local_deal',
    utm_medium: 'social',
  },
  'fb-marketplace': {
    dest: '/quote',
    utm_source: 'facebook',
    utm_campaign: 'marketplace_listing',
    utm_medium: 'social',
  },
  'fb-group': {
    dest: '/quote',
    utm_source: 'facebook',
    utm_campaign: 'group_post',
    utm_medium: 'social',
  },
  craigslist: {
    dest: '/quote',
    utm_source: 'craigslist',
    utm_campaign: 'tampa_bay',
    utm_medium: 'cpc',
  },
  'door-hanger': {
    dest: '/quote',
    utm_source: 'door_hanger',
    utm_campaign: 'neighborhood_drop',
    utm_medium: 'print',
  },
  'yard-sign': {
    dest: '/quote',
    utm_source: 'yard_sign',
    utm_campaign: 'curb_appeal',
    utm_medium: 'print',
  },
  'business-card': {
    dest: '/contact',
    utm_source: 'business_card',
    utm_campaign: 'in_person',
    utm_medium: 'print',
  },
  'review-card': {
    dest: '/review',
    utm_source: 'review_magnet',
    utm_campaign: 'post_service',
    utm_medium: 'print',
  },
  'google-ads': {
    dest: '/quote',
    utm_source: 'google_ads',
    utm_campaign: 'paid_search',
    utm_medium: 'cpc',
  },
  'bing-ads': {
    dest: '/quote',
    utm_source: 'bing_ads',
    utm_campaign: 'paid_search',
    utm_medium: 'cpc',
  },
  thumbtack: {
    dest: '/quote',
    utm_source: 'thumbtack',
    utm_campaign: 'lead_gen',
    utm_medium: 'cpc',
  },
};

/**
 * Paused channels — slugs that previously existed in CHANNELS but are
 * intentionally dormant. Inbound clicks get a soft 302 to
 * `/channel-paused` instead of a 404. Adding a slug here is the
 * mechanism for sunsetting a channel without breaking links.
 *
 * `meta-ads` is paused per D-0064 §0.1 (Meta spend hard-stopped before
 * Stage 6 outcome ADR).
 */
const PAUSED_CHANNELS: ReadonlySet<string> = new Set(['meta-ads']);

export function generateStaticParams() {
  return [...Object.keys(CHANNELS), ...PAUSED_CHANNELS].map((source) => ({ source }));
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ source: string }> }) {
  const { source } = await params;

  // Paused channels (D-0064 §0.1) → soft 302 to /channel-paused.
  if (PAUSED_CHANNELS.has(source)) {
    return NextResponse.redirect(new URL('/channel-paused', req.url), { status: 302 });
  }

  const channel = CHANNELS[source];
  if (!channel) {
    // Unknown channel — fall through to /quote so the visitor isn't
    // dropped. The attribution lib will still capture whatever URL
    // params are present.
    return NextResponse.redirect(new URL('/quote', req.url), { status: 302 });
  }

  const url = new URL(channel.dest, req.url);
  url.searchParams.set('utm_source', channel.utm_source);
  url.searchParams.set('utm_medium', channel.utm_medium);
  url.searchParams.set('utm_campaign', channel.utm_campaign);

  // Pass through any click-tracking params Google/Bing auto-appended.
  // These get re-captured by captureAttribution() on the destination
  // page mount, so they flow through to the lead row's utm_term /
  // utm_content / gclid fields.
  const passthroughParams = ['utm_term', 'utm_content', 'gclid', 'msclkid'];
  const incoming = new URL(req.url).searchParams;
  for (const p of passthroughParams) {
    const v = incoming.get(p);
    if (v) url.searchParams.set(p, v);
  }

  return NextResponse.redirect(url, { status: 302 });
}
