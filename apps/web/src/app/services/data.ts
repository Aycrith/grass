/**
 * Service-page content — single source of truth for the 6 service pages.
 *
 * Keeping content in /data lets us (a) re-render the same copy in JSON-LD or
 * marketing emails without duplication, (b) keep the page.tsx files thin.
 */

import type { ServiceContent } from '@/components/ServicePage';

export const SERVICES: Record<string, ServiceContent> = {
  mowing: {
    name: 'Lawn Mowing',
    tagline:
      'Weekly, bi-weekly, or monthly push-mowing for residential lots up to 1 acre in Largo, FL.',
    intro:
      'Our mowing service includes push-mowing or riding-mowing (depending on lot size), edging along all hard surfaces, and blowing clippings off walks, drives, and beds. We mow at 3.0–3.5 inches for St. Augustine grass — the optimal height for Pinellas County lawns.',
    bullets: [
      'Push-mowing for lots ≤0.5 acre',
      'Riding-mowing for lots 0.5–1 acre',
      'Mechanical edging along curbs, walks, and bed lines',
      'Blowing clippings off all hard surfaces',
      'Grass-cycling or bagged clippings (your choice)',
      'Service reminders sent the day before',
    ],
    pricing: 'From $45 per visit (small lots) to $95 per visit (large lots)',
    faqs: [
      {
        q: 'How often should I mow in Florida?',
        a: 'During the growing season (April–October), weekly mowing is ideal. During cooler months, bi-weekly is usually sufficient. We will recommend a schedule based on your lot.',
      },
      {
        q: 'Do you mow in the rain?',
        a: 'No — wet mowing causes clumping and ruts. If your scheduled day is rained out, we auto-reschedule to the next clear day at no charge.',
      },
      {
        q: 'What if I have a locked gate or dogs?',
        a: `We'll note gate codes and dog status in your property file at quote-time. Crew is briefed before every visit.`,
      },
    ],
  },
  edging: {
    name: 'Lawn Edging',
    tagline: 'Mechanical edging for crisp, clean lines along curbs, walkways, and bed edges.',
    intro:
      'Our edging service uses a power edger to cut a defined edge along all hard surfaces — driveways, sidewalks, patios — and along landscape bed borders. Edging is typically bundled with mowing visits but can be scheduled standalone.',
    bullets: [
      'Mechanical edging with commercial edger (not a string trimmer)',
      'Cuts a clean 1–1.5" deep edge',
      'Edging along all curbs, walks, patios',
      'Bed-line edging for defined bed borders',
      'Cleanup of all debris after edging',
    ],
    pricing: 'From $0.75 per linear foot (standalone) or included with mowing',
    faqs: [
      {
        q: 'How often should I edge?',
        a: 'Every 2–4 weeks is typical. Edging every mow visit keeps lines razor-sharp; less frequent edging is fine if you prefer a more natural look.',
      },
      {
        q: 'Can you edge along pavers without damaging them?',
        a: 'Yes — we adjust the edger depth to match the paver height. For irregular natural stone, we recommend bed-line edging instead.',
      },
    ],
  },
  mulching: {
    name: 'Mulch Installation',
    tagline:
      'Bulk mulch delivery and professional installation — pine bark, cypress, or hardwood blends.',
    intro:
      'Fresh mulch does three things: suppresses weeds, retains moisture (critical in Florida summers), and instantly upgrades curb appeal. We deliver in bulk (not bagged) and install to a 2–3 inch depth with proper bed-edge definition.',
    bullets: [
      'Bulk delivery (truckload) — no bagged-mess on your driveway',
      'Pine bark, cypress, or hardwood blends available',
      '2–3 inch depth per UF/IFAS recommendation',
      'Bed edges redefined before install',
      'Old mulch removal available as add-on',
    ],
    pricing: 'From $110 per cubic yard installed (materials + labor)',
    faqs: [
      {
        q: 'Which mulch is best for Florida?',
        a: 'Pine bark is our most popular — it breaks down slowly and is locally sourced. Cypress is longer-lasting. Hardwood holds color the longest but costs more.',
      },
      {
        q: 'Do you remove old mulch first?',
        a: 'Yes, as an add-on. Fresh mulch on top of old, compacted mulch can suffocate roots — we recommend removal every 2–3 years.',
      },
      {
        q: 'When is the best time to mulch in FL?',
        a: 'Spring (March–May) and fall (October–November) are ideal — mulch holds winter warmth and summer moisture best.',
      },
    ],
  },
  'hedge-trimming': {
    name: 'Hedge & Shrub Trimming',
    tagline: 'Seasonal hedge and shrub trimming for healthy, attractive landscaping.',
    intro:
      'Hedges and shrubs in Pinellas County grow year-round and need trimming 2–4 times per year to stay healthy and attractive. We trim to shape, remove dead wood, and clean up all debris — hauling it off-site.',
    bullets: [
      'Trimming of all hedge and shrub varieties',
      'Heights up to 12 ft (ladder work)',
      'Dead-wood removal',
      'Shape maintenance (rounded, squared, or naturalistic)',
      'All debris hauled off-site',
    ],
    pricing: 'From $2.25 per linear foot (height-dependent)',
    faqs: [
      {
        q: 'When is the best time to trim hedges in FL?',
        a: 'Most shrubs benefit from trimming in late spring (after the spring growth flush) and mid-fall. Avoid heavy trimming during peak summer heat.',
      },
      {
        q: 'How much can you trim off without killing the plant?',
        a: 'Generally no more than 1/3 of the live growth at a time. We assess each species before starting.',
      },
    ],
  },
  'hurricane-prep': {
    name: 'Hurricane Prep & Cleanup',
    tagline:
      'Pre-storm yard securing and post-storm debris removal — June through November in Pinellas County.',
    intro:
      'Florida hurricane season runs June 1 – November 30. Our hurricane service has two phases: pre-storm preparation (securing loose items, removing vulnerable branches, taking down lightweight decor) and post-storm cleanup (debris removal, fallen limb haul-off, damaged tree assessment).',
    bullets: [
      'Pre-storm: secure outdoor furniture, decor, and lightweight items',
      'Pre-storm: identify and remove vulnerable branches',
      'Pre-storm: photograph yard condition for insurance',
      'Post-storm: debris removal and haul-off',
      'Post-storm: tree damage assessment',
    ],
    pricing: 'From $120 base + debris volume',
    faqs: [
      {
        q: 'When do you trigger hurricane mode?',
        a: `When a named storm is forecast within 48 hours and Pinellas County is in the cone, OR when sustained winds reach ${30}+ mph locally. In hurricane mode we pause regular scheduling and dispatch prep visits.`,
      },
      {
        q: 'Do you work during the storm?',
        a: 'No — outdoor work stops when winds hit 30 mph sustained. We resume 24 hours after the storm passes and conditions are safe.',
      },
      {
        q: 'Will insurance cover hurricane cleanup?',
        a: 'Many homeowner policies cover debris removal after a named storm. We provide detailed invoices with photos to support your claim.',
      },
    ],
  },
  'seasonal-cleanup': {
    name: 'Seasonal Cleanup',
    tagline: 'Spring and fall yard cleanup — leaves, debris, bed prep, and haul-off.',
    intro: `Pinellas County's subtropical climate means we don't get a hard leaf drop like the northeast, but spring and fall still bring heavy cleanup needs. We remove leaves, debris, dead annuals, and prep beds for the next season.`,
    bullets: [
      'Leaf removal and blowing',
      'Bed cleanup and edging',
      'Dead annual and perennial removal',
      'Debris haul-off (no piles left behind)',
      'Optional: mulch refresh bundled with cleanup',
    ],
    pricing: 'From $180 base + lot size',
    faqs: [
      {
        q: 'How often should I schedule seasonal cleanup?',
        a: 'Twice a year is typical — late March (spring) and late November (fall). Some lots with heavy tree coverage benefit from a third visit in mid-summer.',
      },
      {
        q: 'Do you take the debris or leave it for city pickup?',
        a: 'We haul everything off-site. City bulk pickup is unpredictable and leaves piles at the curb for weeks.',
      },
    ],
  },
};

export function isKnownService(slug: string): slug is keyof typeof SERVICES {
  return slug in SERVICES;
}
