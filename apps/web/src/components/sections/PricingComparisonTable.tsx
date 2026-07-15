/**
 * PricingComparisonTable — `/pricing` rate table.
 *
 * Sand-bleached surface. Two columns: service line + rate.
 * Service labels are hardcoded English strings (they don't
 * change quarterly the way the rates do); rates read from
 * `lib/business.ts → PRICING_FLOOR_CENTS` so the steward only
 * edits one file to change a number.
 *
 * Below the rates table sits a row of three "discounts &
 * recurring" cards (from `pricingPage.discounts`) and a
 * "what's not on the list" section (from `pricingPage.
 * notIncluded`). Both pull copy from `lib/content.ts →
 * pricingPage` so the steward edits one file for the whole
 * page.
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { PRICING_FLOOR_CENTS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { pricingPage } from '@/lib/content';

import styles from './PricingComparisonTable.module.css';

interface PricingComparisonTableProps {
  className?: string | undefined;
}

const RATES: ReadonlyArray<{ label: string; value: string }> = [
  {
    label: 'Mowing (small lot ≤0.25 ac)',
    value: `$${(PRICING_FLOOR_CENTS.mowing_per_visit_small / 100).toFixed(0)} / visit`,
  },
  {
    label: 'Mowing (medium lot 0.25–0.5 ac)',
    value: `$${(PRICING_FLOOR_CENTS.mowing_per_visit_medium / 100).toFixed(0)} / visit`,
  },
  {
    label: 'Mowing (large lot 0.5–1 ac)',
    value: `$${(PRICING_FLOOR_CENTS.mowing_per_visit_large / 100).toFixed(0)} / visit`,
  },
  {
    label: 'Edging (standalone)',
    value: `$${(PRICING_FLOOR_CENTS.edging_per_linear_ft / 100).toFixed(2)} / linear ft`,
  },
  {
    label: 'Mulch (pine bark, bulk)',
    value: `$${(PRICING_FLOOR_CENTS.mulch_per_cubic_yard / 100).toFixed(0)} / yd³ (materials)`,
  },
  {
    label: 'Mulch install labor',
    value: `$${(PRICING_FLOOR_CENTS.mulch_install_per_cubic_yard / 100).toFixed(0)} / yd³ (labor)`,
  },
  {
    label: 'Hedge trimming',
    value: `$${(PRICING_FLOOR_CENTS.hedge_trim_per_linear_ft / 100).toFixed(2)} / linear ft`,
  },
  {
    label: 'Hurricane prep',
    value: `From $${(PRICING_FLOOR_CENTS.hurricane_prep_base / 100).toFixed(0)}`,
  },
  {
    label: 'Seasonal cleanup',
    value: `From $${(PRICING_FLOOR_CENTS.seasonal_cleanup_base / 100).toFixed(0)}`,
  },
];

export function PricingComparisonTable({ className }: PricingComparisonTableProps): ReactNode {
  return (
    <>
      <Section rhythm="loose" className={cn(styles.tableSection, className)}>
        <div className="container">
          <FadeUp>
            <Eyebrow tone="default" className={styles.tableEyebrow}>
              Floor rates
            </Eyebrow>
            <h2 className={styles.tableHeading}>What it costs.</h2>
            <p className={styles.tableIntro}>
              These are the published floor rates. Final pricing depends on lot size, slope, gated
              back-fences, and scope. Most lawns fall inside the floor; bigger yards bump the price.
            </p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">Rate</th>
                </tr>
              </thead>
              <tbody>
                {RATES.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeUp>
        </div>
      </Section>

      <Section rhythm="loose" className={cn(styles.discountSection)}>
        <div className="container">
          <header className={styles.subhead}>
            <Eyebrow tone="default" >
              {pricingPage.discountEyebrow}
            </Eyebrow>
            <h2 className={styles.subheadHeading}>{pricingPage.discountIntro}</h2>
          </header>
          <div className={styles.discountGrid}>
            {pricingPage.discounts.map((d) => (
              <FadeUp key={d.label} className={styles.discountCard}>
                <span className={styles.discountLabel}>{d.label}</span>
                <p className={styles.discountBody}>{d.body}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section rhythm="loose" className={cn(styles.notIncludedSection)}>
        <div className="container">
          <FadeUp className={styles.notIncluded}>
            <Eyebrow tone="default" >
              {pricingPage.notIncludedTitle}
            </Eyebrow>
            <p className={styles.notIncludedBody}>{pricingPage.notIncludedBody}</p>
            <ul className={styles.notIncludedList}>
              {pricingPage.notIncluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className={styles.notIncludedTail}>{pricingPage.notIncludedTail}</p>
          </FadeUp>
        </div>
      </Section>

      <Section rhythm="loose" className={cn(styles.taxSection)}>
        <div className="container">
          <FadeUp className={styles.tax}>
            <Eyebrow tone="default" >
              {pricingPage.taxEyebrow}
            </Eyebrow>
            <p className={styles.taxBody}>{pricingPage.taxBody}</p>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
