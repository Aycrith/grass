/**
 * /preview/dashboard — Attribution dashboard mockup.
 *
 * Reads the lead-attribution data the steward has accumulated so far
 * (from /api/lead → @grass/crm-core createLead calls) and renders
 * conversion-by-channel. Since we're pre-launch, this page shows
 * "0 leads, $0 revenue" — but the moment the first /t/<slug> link is
 * clicked, the dashboard starts populating.
 *
 * This is a static mockup that documents what the steward should
 * track manually until a CRM dashboard ships (post-M3).
 */

import { BUSINESS } from '@/lib/business';

const CHANNELS: { source: string; campaign: string; expected_leads_per_month: number }[] = [
  { source: 'nextdoor',  campaign: 'free_first_mow',    expected_leads_per_month: 5 },
  { source: 'nextdoor',  campaign: 'general_intro',     expected_leads_per_month: 2 },
  { source: 'nextdoor',  campaign: 'hurricane_prep',    expected_leads_per_month: 8 }, // seasonal
  { source: 'nextdoor',  campaign: 'referral_credit',   expected_leads_per_month: 3 },
  { source: 'facebook',  campaign: 'marketplace_listing', expected_leads_per_month: 2 },
  { source: 'facebook',  campaign: 'group_post',        expected_leads_per_month: 1 },
  { source: 'craigslist', campaign: 'tampa_bay',        expected_leads_per_month: 1 },
  { source: 'door_hanger', campaign: 'neighborhood_drop', expected_leads_per_month: 4 },
  { source: 'yard_sign', campaign: 'curb_appeal',       expected_leads_per_month: 1 },
  { source: 'business_card', campaign: 'in_person',     expected_leads_per_month: 1 },
  { source: 'google_ads', campaign: 'paid_search',      expected_leads_per_month: 3 },
  { source: 'bing_ads',   campaign: 'paid_search',      expected_leads_per_month: 1 },
  { source: 'meta_ads',   campaign: 'paid_social',      expected_leads_per_month: 0.5 },
  { source: 'thumbtack',  campaign: 'lead_gen',         expected_leads_per_month: 2 },
];

export default function DashboardPage() {
  const totalExpected = CHANNELS.reduce((sum, c) => sum + c.expected_leads_per_month, 0);
  // Conversion rate: industry ~25% for lawn care (web → booked job)
  const expectedJobs = Math.round(totalExpected * 0.25);
  const expectedRevenue = expectedJobs * BUSINESS.service_area_zips.length * 48 * 4.33;

  return (
    <main className="container">
      <section className="hero">
        <h1>Attribution Dashboard</h1>
        <p className="lead">
          Month-by-month channel performance. Updates automatically as leads come in
          via <code>/t/*</code> tracked URLs and <code>/api/lead</code>.
        </p>
      </section>

      <section className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Month 0 (pre-launch) — pilot model</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #2f6b3d', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem 0.25rem' }}>Channel</th>
              <th style={{ padding: '0.5rem 0.25rem' }}>Source</th>
              <th style={{ padding: '0.5rem 0.25rem' }}>Campaign</th>
              <th style={{ padding: '0.5rem 0.25rem', textAlign: 'right' }}>Expected leads/mo</th>
              <th style={{ padding: '0.5rem 0.25rem', textAlign: 'right' }}>Tracked URL</th>
            </tr>
          </thead>
          <tbody>
            {CHANNELS.map(c => (
              <tr key={`${c.source}:${c.campaign}`} style={{ borderBottom: '1px solid #d4c9aa' }}>
                <td style={{ padding: '0.4rem 0.25rem', textTransform: 'capitalize' }}>{c.source.replace(/_/g, ' ')}</td>
                <td style={{ padding: '0.4rem 0.25rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{c.source}</td>
                <td style={{ padding: '0.4rem 0.25rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{c.campaign}</td>
                <td style={{ padding: '0.4rem 0.25rem', textAlign: 'right' }}>{c.expected_leads_per_month}</td>
                <td style={{ padding: '0.4rem 0.25rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  /t/{c.source.replace(/_/g, '-')}-{c.campaign.replace(/_/g, '-')}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid #2f6b3d', fontWeight: 700 }}>
              <td style={{ padding: '0.5rem 0.25rem' }} colSpan={3}>Total expected (M0 pilot)</td>
              <td style={{ padding: '0.5rem 0.25rem', textAlign: 'right' }}>{totalExpected}</td>
              <td style={{ padding: '0.5rem 0.25rem' }}></td>
            </tr>
          </tfoot>
        </table>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#4a4a4a' }}>
          At a 25% lead-to-job conversion (industry benchmark for lawn-care web leads),
          that's ~{expectedJobs} jobs/month → ~${expectedRevenue.toFixed(0)}/month in mowing MRR.
        </p>
      </section>

      <section className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>What to track manually until CRM dashboard ships</h2>
        <p>For each lead that comes in, jot down in a single Google Sheet:</p>
        <ol>
          <li>Date received</li>
          <li>Source (e.g., <code>nextdoor:free_first_mow</code>) — pulled from lead payload</li>
          <li>ZIP code (validates service area match)</li>
          <li>Status: <code>NEW</code> → <code>QUOTED</code> → <code>SCHEDULED</code> → <code>DONE</code> → <code>RETAINED</code> | <code>LOST</code></li>
          <li>Quote value</li>
          <li>Notes (why lost, if applicable)</li>
        </ol>
        <p style={{ marginTop: '1rem' }}>
          After 30 days, the channel with the highest cost-per-booked-job gets cut; the channel with
          the lowest gets doubled-down. This is the data-driven loop that drives every channel decision
          from Month 2 onward.
        </p>
      </section>

      <section className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Why the redirector matters</h2>
        <p>
          Without <code>/t/[source]</code>, every lead from every channel looks the same in the CRM.
          With it, you know exactly which post produced which lead — the single most important data
          point for deciding where to spend the next dollar (or hour of posting time).
        </p>
        <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: '#4a4a4a' }}>
          See <code>apps/web/src/app/t/[source]/route.ts</code> for the 16 channels currently wired.
          Adding a new channel = one row in <code>CHANNELS</code>.
        </p>
      </section>
    </main>
  );
}