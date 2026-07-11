/**
 * /t/[source] — attribution redirector (route handler).
 *
 * Each social posting channel gets a stable short URL like
 * `/t/nextdoor-free-mow` that 302-redirects to /quote with the source
 * pre-attributed. The lead payload from /quote carries that source
 * into @grass/crm-core so conversion-by-channel is queryable later.
 *
 * Adding a new channel = one row in CHANNELS + one new social template
 * pointing to /t/<slug>. No code changes beyond this file.
 */

import { type NextRequest, NextResponse } from 'next/server';

const CHANNELS: Record<string, { dest: string; utm_source: string; utm_campaign: string }> = {
  'nextdoor-free-mow':     { dest: '/quote', utm_source: 'nextdoor', utm_campaign: 'free_first_mow' },
  'nextdoor-general':      { dest: '/quote', utm_source: 'nextdoor', utm_campaign: 'general_intro' },
  'nextdoor-hurricane':    { dest: '/quote', utm_source: 'nextdoor', utm_campaign: 'hurricane_prep' },
  'nextdoor-referral':     { dest: '/quote', utm_source: 'nextdoor', utm_campaign: 'referral_credit' },
  'fb-marketplace':        { dest: '/quote', utm_source: 'facebook', utm_campaign: 'marketplace_listing' },
  'fb-group':              { dest: '/quote', utm_source: 'facebook', utm_campaign: 'group_post' },
  'craigslist':            { dest: '/quote', utm_source: 'craigslist', utm_campaign: 'tampa_bay' },
  'door-hanger':           { dest: '/quote', utm_source: 'door_hanger', utm_campaign: 'neighborhood_drop' },
  'yard-sign':             { dest: '/quote', utm_source: 'yard_sign', utm_campaign: 'curb_appeal' },
  'business-card':         { dest: '/contact', utm_source: 'business_card', utm_campaign: 'in_person' },
  'review-card':           { dest: '/review', utm_source: 'review_magnet', utm_campaign: 'post_service' },
  'google-ads':            { dest: '/quote', utm_source: 'google_ads', utm_campaign: 'paid_search' },
  'bing-ads':              { dest: '/quote', utm_source: 'bing_ads', utm_campaign: 'paid_search' },
  'meta-ads':              { dest: '/quote', utm_source: 'meta_ads', utm_campaign: 'paid_social' },
  'nextdoor-local-deal':   { dest: '/quote', utm_source: 'nextdoor', utm_campaign: 'local_deal' },
  'thumbtack':             { dest: '/quote', utm_source: 'thumbtack', utm_campaign: 'lead_gen' },
};

export function generateStaticParams() {
  return Object.keys(CHANNELS).map(source => ({ source }));
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ source: string }> },
) {
  const { source } = await params;
  const channel = CHANNELS[source];
  if (!channel) {
    return NextResponse.redirect(new URL('/quote', req.url));
  }
  const url = new URL(channel.dest, req.url);
  url.searchParams.set('utm_source', channel.utm_source);
  url.searchParams.set('utm_campaign', channel.utm_campaign);
  url.searchParams.set('utm_medium', 'social');
  return NextResponse.redirect(url, { status: 302 });
}