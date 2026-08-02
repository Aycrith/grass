'use client';

/**
 * PetWasteFAQ — page-local FAQ for the /pet-waste landing variant.
 *
 * Why a separate file: the page itself is a Server Component
 * (it exports metadata and renders a static <JsonLd>). The
 * Accordion primitive is a client component (Radix-backed),
 * so we keep the page boundary clean by isolating the only
 * client-rendered subtree into this file.
 *
 * The shared <FAQAccordion> section component hard-wires its
 * questions from lib/content.ts → faq, which is the pricing/
 * operator FAQ for the homepage. The pet-waste page needs
 * offer-specific Q&As (free first cleanup, $15/wk, areas
 * covered), so this local component renders the same
 * Accordion primitive with page-local items.
 */

import { Accordion } from '@/components/ui';

const ITEMS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "What's the free first cleanup, really?",
    a: 'One free pet waste cleanup of your yard, so you can see the quality before you commit. No card, no contract, no upsell.',
  },
  {
    q: 'How much is it after the free cleanup?',
    a: '$15 per week per yard, billed monthly, or $25 every other week. Cancel anytime — no contract. Multi-dog yards are the same price; we just take a little longer.',
  },
  {
    q: 'Do I have to be home?',
    a: "No. As long as the gate is unlocked (or you give us the code), we scoop. Most of our customers aren't home — they get a text when we're done.",
  },
  {
    q: 'What areas do you cover?',
    a: '33770, 33771, 33773, 33774, 33778, and 33756 — Largo, Pinellas Park, Seminole, and parts of St. Pete. If you are outside those ZIPs, leave a note and we will see what we can do.',
  },
  {
    q: 'Do you also mow lawns?',
    a: 'Yes — but pet waste is a separate service and the best way to start. Most of our weekly pet waste customers add mowing after a month or two, once they trust us with the yard.',
  },
];

export function PetWasteFAQ() {
  return <Accordion id="pet-waste-faq" items={ITEMS.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />;
}
