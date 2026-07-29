/**
 * redirect-medium.test.ts — Stage 3 acceptance: /t/[source] route
 * handler labels each channel with its correct per-row utm_medium.
 *
 * Per plan `review-the-plans-recently-lucky-catmull.md` Stage 3 §1:
 *   "/t/[source] no longer hardcodes utm_medium=social; paid channels
 *    labelled correctly per analytics/kpi-taxonomy.md."
 *
 * Run with:  bun test apps/web/tests/attribution/redirect-medium.test.ts
 *
 * Strategy: exercise the GET handler directly with synthetic NextRequest
 * objects, snapshot the destination URL and utm_medium for each channel
 * in CHANNELS, and assert the per-row medium matches
 * `analytics/kpi-taxonomy.md §3.2 Attribution Field Map`.
 */

import { describe, expect, it } from 'bun:test';

import { GET } from '@/app/t/[source]/route';

function makeReq(url: string): Request {
  return new Request(url, { method: 'GET' });
}

async function readDest(req: Request): Promise<URL> {
  const res = await GET(req as never, {
    params: Promise.resolve({ source: new URL(req.url).pathname.split('/').pop() ?? '' }),
  });
  expect(res.status).toBe(302);
  expect(res.headers.get('location')).not.toBeNull();
  return new URL(res.headers.get('location') as string);
}

describe('/t/[source] redirect: per-row utm_medium', () => {
  it('google-ads → /quote with utm_medium=cpc (was blanket social in v2)', async () => {
    const dest = await readDest(makeReq('http://localhost/t/google-ads'));
    expect(dest.pathname).toBe('/quote');
    expect(dest.searchParams.get('utm_source')).toBe('google_ads');
    expect(dest.searchParams.get('utm_medium')).toBe('cpc');
    expect(dest.searchParams.get('utm_campaign')).toBe('paid_search');
  });

  it('bing-ads → /quote with utm_medium=cpc', async () => {
    const dest = await readDest(makeReq('http://localhost/t/bing-ads'));
    expect(dest.searchParams.get('utm_medium')).toBe('cpc');
  });

  it('nextdoor-free-mow → /quote with utm_medium=social', async () => {
    const dest = await readDest(makeReq('http://localhost/t/nextdoor-free-mow'));
    expect(dest.pathname).toBe('/quote');
    expect(dest.searchParams.get('utm_source')).toBe('nextdoor');
    expect(dest.searchParams.get('utm_medium')).toBe('social');
    expect(dest.searchParams.get('utm_campaign')).toBe('free_first_mow');
  });

  it('craigslist → /quote with utm_medium=cpc (Craigslist is paid listing, not organic)', async () => {
    const dest = await readDest(makeReq('http://localhost/t/craigslist'));
    expect(dest.searchParams.get('utm_medium')).toBe('cpc');
  });

  it('thumbtack → /quote with utm_medium=cpc (lead-gen network)', async () => {
    const dest = await readDest(makeReq('http://localhost/t/thumbtack'));
    expect(dest.searchParams.get('utm_medium')).toBe('cpc');
  });

  it('door-hanger → /quote with utm_medium=print', async () => {
    const dest = await readDest(makeReq('http://localhost/t/door-hanger'));
    expect(dest.searchParams.get('utm_medium')).toBe('print');
    expect(dest.searchParams.get('utm_source')).toBe('door_hanger');
  });

  it('yard-sign → /quote with utm_medium=print', async () => {
    const dest = await readDest(makeReq('http://localhost/t/yard-sign'));
    expect(dest.searchParams.get('utm_medium')).toBe('print');
  });

  it('business-card → /contact (not /quote) with utm_medium=print', async () => {
    const dest = await readDest(makeReq('http://localhost/t/business-card'));
    expect(dest.pathname).toBe('/contact');
    expect(dest.searchParams.get('utm_medium')).toBe('print');
  });

  it('review-card → /review (post-service path) with utm_medium=print', async () => {
    const dest = await readDest(makeReq('http://localhost/t/review-card'));
    expect(dest.pathname).toBe('/review');
    expect(dest.searchParams.get('utm_medium')).toBe('print');
  });

  it('passes through gclid from inbound querystring', async () => {
    const dest = await readDest(
      makeReq('http://localhost/t/google-ads?gclid=ABC123&utm_term=mowing+largo'),
    );
    expect(dest.searchParams.get('gclid')).toBe('ABC123');
    expect(dest.searchParams.get('utm_term')).toBe('mowing largo');
  });

  it('passes through utm_content from inbound querystring', async () => {
    const dest = await readDest(
      makeReq('http://localhost/t/google-ads?utm_content=free_first_cleanup'),
    );
    expect(dest.searchParams.get('utm_content')).toBe('free_first_cleanup');
  });

  it('paused channel meta-ads → /channel-paused (D-0064 §0.1 hard-stop)', async () => {
    const res = await GET(makeReq('http://localhost/t/meta-ads') as never, {
      params: Promise.resolve({ source: 'meta-ads' }),
    });
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('/channel-paused');
  });

  it('unknown slug → fallback to /quote (does NOT 404)', async () => {
    const res = await GET(makeReq('http://localhost/t/unknown-channel') as never, {
      params: Promise.resolve({ source: 'unknown-channel' }),
    });
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('/quote');
  });
});
