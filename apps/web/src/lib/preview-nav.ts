/**
 * Preview-nav — single source of truth for the /preview/* sidebar.
 *
 * Each entry renders as a card on the index page AND a nav link in the
 * sidebar. Order here is the order shown to the steward — most
 * confidence-giving artifacts first (brand, profit), execution details
 * after.
 */

export interface PreviewNavItem {
  slug: string;
  label: string;
  description: string;
}

export const PREVIEW_NAV: readonly PreviewNavItem[] = [
  {
    slug: 'brand',
    label: 'Brand & Voice',
    description: 'Guidelines, logo, name matrix',
  },
  {
    slug: 'profit',
    label: 'Profitability Roadmap',
    description: 'Month 0→12 cash projection + risk gates',
  },
  {
    slug: 'gbp',
    label: 'GBP Profile',
    description: 'Copy-paste-ready Google Business Profile content',
  },
  {
    slug: 'citations',
    label: 'Citation Plan',
    description: 'Tier 1-5 directories + NAP template',
  },
  {
    slug: 'ads',
    label: 'Ad Campaigns',
    description: 'Google, Meta, Bing, Yelp, NextDoor, Thumbtack',
  },
  {
    slug: 'distribution',
    label: 'Distribution Playbook',
    description: '8 $0-cost acquisition ideas',
  },
  {
    slug: 'compliance',
    label: 'Compliance Drafts',
    description: 'Licensing, BTRs, Sunbiz, insurance, equipment',
  },
  {
    slug: 'services',
    label: 'Service Copy',
    description: 'Editorial mirror of /services with annotations',
  },
  {
    slug: 'runbooks',
    label: 'Operational Runbooks',
    description: 'Day-of-mow, weather, hurricane mode, equipment, retention, accounting',
  },
  {
    slug: 'content',
    label: 'Customer Content',
    description: 'GBP Q&A, phone/email/SMS scripts, quotes, invoices, waivers, assets',
  },
  {
    slug: 'decisions',
    label: 'Decision Log',
    description: 'D-0001..0007 + 5 pending decisions',
  },
] as const;