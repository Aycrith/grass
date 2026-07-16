'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { inServiceArea } from '@/lib/business';

type LotSize = 'small' | 'medium' | 'large' | 'xlarge';
type Frequency = 'one-time' | 'bi-weekly' | 'weekly';
type AddOn = 'edging' | 'mulching' | 'hedge' | 'hurricane';

const LOT_SIZE_LABELS: Record<LotSize, { label: string; approx: string }> = {
  small:   { label: 'Small',  approx: 'Under 1/8 acre (~5,000 sq ft)' },
  medium:  { label: 'Medium', approx: '1/8 – 1/4 acre (~8,000 sq ft)' },
  large:   { label: 'Large',  approx: '1/4 – 1/2 acre (~15,000 sq ft)' },
  xlarge:  { label: 'X-Large', approx: '1/2 – 3/4 acre (~25,000 sq ft)' },
};

const ZIP_OPTIONS = ['33771', '33770', '33778', '33773', '33774', '33756'];

// Pricing matrix — sourced from research/pricing/price-book.yaml (live Largo FL 2026)
const MOW_BASE: Record<LotSize, number> = {
  small:  35,
  medium: 48,
  large:  65,
  xlarge: 85,
};
const FREQ_MULTIPLIER: Record<Frequency, number> = {
  'one-time': 1.25,
  'bi-weekly': 1.10,
  weekly: 1.0,
};
const ADDON_PRICE: Record<AddOn, number> = {
  edging: 0,        // included with weekly mowing
  mulching: 75,
  hedge: 80,
  hurricane: 95,
};

function fmtUSD(n: number): string {
  return `$${n.toFixed(0)}`;
}

export function QuoteCalculator({
  serviceArea,
}: { serviceArea: readonly string[] }) {
  const [lot, setLot] = useState<LotSize>('medium');
  const [freq, setFreq] = useState<Frequency>('weekly');
  const [addons, setAddons] = useState<Set<AddOn>>(new Set(['edging']));
  const [zip, setZip] = useState<string>('33771');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneVal, setPhoneVal] = useState('');
  const [submitted, setSubmitted] = useState<null | { ok: boolean; message: string }>(null);
  const [utm, setUtm] = useState<{ source: string; campaign: string; medium: string } | null>(null);

  // D-0028: read the `?zip=` search param (set by the Coverage Check
  // CTA on the homepage ServiceAreaMap) and prefill the ZIP select if
  // it points at a ZIP in our service area. Falls through silently if
  // the param is missing, malformed, or outside the route — preserves
  // the existing "33771" default. Search-params reading via the
  // Next 15 client hook opts the route into dynamic rendering; the
  // parent page wraps this component in <Suspense> so the rest of the
  // /quote page can still prerender statically.
  const searchParams = useSearchParams();

  // Read UTM params + ?zip= prefill once on mount so attribution
  // and the Coverage Check loop both flow through to the lead.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source');
    const campaign = params.get('utm_campaign');
    const medium = params.get('utm_medium');
    if (source) setUtm({ source, campaign: campaign ?? '', medium: medium ?? '' });

    const zipParam = searchParams?.get('zip');
    if (zipParam && inServiceArea(zipParam)) {
      setZip(zipParam);
    }
  }, [searchParams]);

  const estimate = useMemo(() => {
    const base = MOW_BASE[lot];
    const mowed = base * FREQ_MULTIPLIER[freq];
    const addonTotal = Array.from(addons).reduce((sum, a) => sum + ADDON_PRICE[a], 0);
    const perVisit = mowed + addonTotal;
    return { perVisit, monthlyEstimate: perVisit * (freq === 'weekly' ? 4.33 : freq === 'bi-weekly' ? 2.17 : 0) };
  }, [lot, freq, addons]);

  const toggleAddon = (a: AddOn) => {
    setAddons(prev => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a); else next.add(a);
      return next;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phoneVal,
      zip,
      message: `lot=${lot} freq=${freq} addons=${Array.from(addons).join(',')} est_per_visit=$${estimate.perVisit.toFixed(0)}`,
      source: utm ? `${utm.source}:${utm.campaign}` : 'quote-calculator:direct',
    };
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'lead capture failed' }));
        throw new Error(err.error ?? 'lead capture failed');
      }
      setSubmitted({ ok: true, message: 'Quote request received. We will text or email within 24 hours.' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please text or call us directly.';
      setSubmitted({ ok: false, message: msg });
    }
  };

  if (submitted?.ok) {
    return (
      <section className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#2f6b3d' }}>Thanks — we got it.</h2>
        <p>{submitted.message}</p>
        <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: '#4a4a4a' }}>
          Reference: {fmtUSD(estimate.perVisit)}/visit · {freq} · lot: {lot}
        </p>
      </section>
    );
  }

  return (
    <section className="card" style={{ marginTop: '2rem' }}>
      <h2 style={{ marginTop: 0 }}>Estimate</h2>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Lot size</div>
          <select value={lot} onChange={e => setLot(e.target.value as LotSize)} style={{ width: '100%', padding: '0.5rem' }}>
            {(Object.keys(LOT_SIZE_LABELS) as LotSize[]).map(s => (
              <option key={s} value={s}>{LOT_SIZE_LABELS[s].label} — {LOT_SIZE_LABELS[s].approx}</option>
            ))}
          </select>
        </label>

        <label>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Frequency</div>
          <select value={freq} onChange={e => setFreq(e.target.value as Frequency)} style={{ width: '100%', padding: '0.5rem' }}>
            <option value="one-time">One-time cut</option>
            <option value="bi-weekly">Bi-weekly (every 2 weeks)</option>
            <option value="weekly">Weekly (best value)</option>
          </select>
        </label>

        <label>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>ZIP code</div>
          <select value={zip} onChange={e => setZip(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
            {ZIP_OPTIONS.map(z => (
              <option key={z} value={z}>{z}{serviceArea.includes(z) ? '' : ' (outside primary area — text us)'}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Add-ons</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {(['edging', 'mulching', 'hedge', 'hurricane'] as AddOn[]).map(a => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAddon(a)}
              aria-pressed={addons.has(a)}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '999px',
                border: '1px solid #2f6b3d',
                background: addons.has(a) ? '#2f6b3d' : 'white',
                color: addons.has(a) ? '#f7f1e3' : '#1a2f25',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              {a === 'hurricane' ? 'Hurricane prep (+$95)' : a === 'mulching' ? 'Mulching (+$75/yd)' : a === 'hedge' ? 'Hedge trim (+$80)' : 'Edging (included weekly)'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f7f1e3', borderRadius: '8px' }}>
        <div style={{ fontSize: '0.95rem', color: '#4a4a4a' }}>Estimated per visit</div>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2f6b3d', lineHeight: 1 }}>{fmtUSD(estimate.perVisit)}</div>
        {freq !== 'one-time' && (
          <div style={{ fontSize: '0.85rem', color: '#4a4a4a', marginTop: '0.25rem' }}>
            ~{fmtUSD(estimate.monthlyEstimate)}/month · billed per visit, no subscription
          </div>
        )}
      </div>

      <form onSubmit={submit} style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr' }}>
          <label>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>First name</div>
            <input
              type="text"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </label>
          <label>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Last name</div>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </label>
        </div>
        <label>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Email</div>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@example.com"
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </label>
        <label>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Phone (recommended for fastest quote)</div>
          <input
            type="tel"
            value={phoneVal}
            onChange={e => setPhoneVal(e.target.value)}
            placeholder="(727) 555-0123"
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </label>
        <button type="submit" style={{
          padding: '0.75rem 1rem',
          background: '#2f6b3d',
          color: '#f7f1e3',
          border: 0,
          borderRadius: '6px',
          fontWeight: 700,
          fontSize: '1rem',
          cursor: 'pointer',
        }}>
          Send me this quote
        </button>
        {submitted && !submitted.ok && (
          <div style={{ color: '#a83232', fontSize: '0.9rem' }}>{submitted.message}</div>
        )}
      </form>
    </section>
  );
}
