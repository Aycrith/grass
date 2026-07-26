'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button, Card, Input } from '@/components/ui';
import { BUSINESS, inServiceArea } from '@/lib/business';
import { cn } from '@/lib/cn';
import { recallZip, rememberZip } from '@/lib/zip-memory';

import styles from './QuoteCalculator.module.css';

type LotSize = 'small' | 'medium' | 'large' | 'xlarge';
type Frequency = 'one-time' | 'bi-weekly' | 'weekly';
type AddOn = 'edging' | 'mulching' | 'hedge' | 'hurricane';

const LOT_SIZE_OPTIONS: ReadonlyArray<{ value: LotSize; label: string }> = [
  { value: 'small', label: 'Small — under 1/8 acre (~5,000 sq ft)' },
  { value: 'medium', label: 'Medium — 1/8 – 1/4 acre (~8,000 sq ft)' },
  { value: 'large', label: 'Large — 1/4 – 1/2 acre (~15,000 sq ft)' },
  { value: 'xlarge', label: 'X-Large — 1/2 – 3/4 acre (~25,000 sq ft)' },
];

const FREQUENCY_OPTIONS: ReadonlyArray<{ value: Frequency; label: string }> = [
  { value: 'one-time', label: 'One-time cut' },
  { value: 'bi-weekly', label: 'Bi-weekly (every 2 weeks)' },
  { value: 'weekly', label: 'Weekly (best value)' },
];

// Home ZIP hoisted to the front (most common), then the rest of
// BUSINESS.service_area_zips in their canonical order. The quote
// form's ZIP dropdown shows home base first because most leads
// come from the home ZIP (per the lead analytics), and the
// remaining 5 in canonical order so the dropdown matches every
// other surface (footer, sitemap, JSON-LD, coverage check).
const ZIP_OPTIONS: ReadonlyArray<string> = [
  BUSINESS.address.zip,
  ...BUSINESS.service_area_zips.filter((z) => z !== BUSINESS.address.zip),
];

// Pricing matrix — sourced from research/pricing/price-book.yaml (live Largo FL 2026)
const MOW_BASE: Record<LotSize, number> = {
  small: 35,
  medium: 48,
  large: 65,
  xlarge: 85,
};
const FREQ_MULTIPLIER: Record<Frequency, number> = {
  'one-time': 1.25,
  'bi-weekly': 1.1,
  weekly: 1.0,
};
const ADDON_PRICE: Record<AddOn, number> = {
  edging: 0, // included with weekly mowing
  mulching: 75,
  hedge: 80,
  hurricane: 95,
};

const ADDON_META: Record<AddOn, { label: string; priceSuffix: string }> = {
  edging: { label: 'Edging', priceSuffix: 'included weekly' },
  mulching: { label: 'Mulching', priceSuffix: '+$75/yd' },
  hedge: { label: 'Hedge trim', priceSuffix: '+$80' },
  hurricane: { label: 'Hurricane prep', priceSuffix: '+$95' },
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
  const [submitting, setSubmitting] = useState(false);
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

  // Read UTM params + ?zip= prefill + remembered ZIP once on mount
  // so attribution and the Coverage Check loop both flow through to
  // the lead. Precedence: ?zip= URL param > localStorage remembered
  // ZIP > default '33771'. The localStorage value is the user's
  // last entered ZIP across the homepage coverage check,
  // /contact, and /quote — one canonical "their ZIP" per device.
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
      return;
    }
    const remembered = recallZip();
    if (remembered && inServiceArea(remembered)) {
      setZip(remembered);
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
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a);
      else next.add(a);
      return next;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitted(null);
    // Persist the ZIP for next time across the homepage coverage
    // check + /contact + /quote. Successful submit confirms this
    // is a ZIP the user actually cares about — that's the right
    // moment to write.
    if (zip) rememberZip(zip);
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
      setSubmitted({
        ok: true,
        message: 'Quote request received. We will text or email within 24 hours.',
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please text or call us directly.';
      setSubmitted({ ok: false, message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted?.ok) {
    return (
      <Card variant="insight" className={cn(styles.successCard)}>
        <div className={cn(styles.successIconRow)}>
          <CheckCircle2 size={28} aria-hidden="true" className={cn(styles.successIcon)} />
          <h2 className={cn(styles.successHeading)}>Thanks — we got it.</h2>
        </div>
        <p className={cn(styles.successBody)}>{submitted.message}</p>
        <p className={cn(styles.successMeta)}>
          Reference: {fmtUSD(estimate.perVisit)}/visit · {freq} · lot: {lot}
        </p>
      </Card>
    );
  }

  // Service-area hint shown under the ZIP select.
  const zipOptions = ZIP_OPTIONS.map((z) => ({
    value: z,
    label:
      z === zip
        ? `${z} (you are here)`
        : serviceArea.includes(z)
          ? z
          : `${z} (outside primary area — text us)`,
  }));

  return (
    <Card variant="insight" className={cn(styles.root)}>
      <h2 className={cn(styles.h2)}>Estimate</h2>

      <div className={cn(styles.optionGrid)}>
        <Input
          label="Lot size"
          type="select"
          value={lot}
          onChange={(e) => setLot(e.target.value as LotSize)}
          options={LOT_SIZE_OPTIONS}
        />
        <Input
          label="Frequency"
          type="select"
          value={freq}
          onChange={(e) => setFreq(e.target.value as Frequency)}
          options={FREQUENCY_OPTIONS}
        />
        <Input
          label="ZIP code"
          type="select"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          options={zipOptions}
        />
      </div>

      <div className={cn(styles.addonBlock)}>
        <div className={cn(styles.addonLabel)}>Add-ons</div>
        <div className={cn(styles.addonList)} role="group" aria-label="Optional add-on services">
          {(['edging', 'mulching', 'hedge', 'hurricane'] as AddOn[]).map((a) => {
            const isOn = addons.has(a);
            const meta = ADDON_META[a];
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAddon(a)}
                aria-pressed={isOn}
                className={cn(styles.addonChip, isOn && styles.addonChipOn)}
              >
                {meta.label}{' '}
                <span className={cn(styles.addonPrice)}>({meta.priceSuffix})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={cn(styles.estimateBox)} aria-live="polite">
        <div className={cn(styles.estimateLabel)}>Estimated per visit</div>
        <div className={cn(styles.estimateValue)}>{fmtUSD(estimate.perVisit)}</div>
        {freq !== 'one-time' ? (
          <div className={cn(styles.estimateMeta)}>
            ~{fmtUSD(estimate.monthlyEstimate)}/month · billed per visit, no subscription
          </div>
        ) : null}
      </div>

      <form onSubmit={submit} className={cn(styles.form)}>
        <div className={cn(styles.nameRow)}>
          <Input
            label="First name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
          <Input
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          autoComplete="email"
        />
        <Input
          label="Phone"
          type="tel"
          value={phoneVal}
          onChange={(e) => setPhoneVal(e.target.value)}
          placeholder="(727) 313-8011"
          autoComplete="tel"
          helper="Recommended for fastest quote — a text beats email every time."
        />

        {submitted && !submitted.ok ? (
          <p className={cn(styles.errorBanner)} role="alert">
            {submitted.message}
          </p>
        ) : null}

        <div className={cn(styles.actions)}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            iconLeft={
              submitting ? (
                <Loader2 size={18} aria-hidden="true" className="ll-spin" />
              ) : undefined
            }
          >
            {submitting ? 'Sending…' : 'Send me this quote'}
          </Button>
          <p className={cn(styles.legal)}>
            We respond within 24 hours on business days. No spam, no list-rentals.
          </p>
        </div>
      </form>
    </Card>
  );
}
