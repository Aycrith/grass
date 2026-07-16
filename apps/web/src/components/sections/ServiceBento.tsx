'use client';

/**
 * ServiceBento — Mission 1 services index section.
 *
 * Six-card asymmetric grid driven by `lib/content.ts → services`.
 * Layout (desktop):
 *
 *   [ mowing featured — 8 col    | mulching — 4 col   ]
 *   [ edging — 4 | hedge — 4     | hurricane — 4        ]
 *   [ seasonal cleanup — full-width callout              ]
 *
 * Cards are `<Link>` wrapping `<article>` for proper semantics
 * and keyboard navigation. Hover: lift -4px + image scale 1.03.
 *
 * Featured flag on `services.mowing` flips its column-span to 8
 * and gives it the sand gradient surface treatment.
 *
 * **Hurricane mode**: when `BUSINESS.hurricaneModeActive === true`,
 * the section exposes `data-hurricane-mode="true"` and the
 * hurricane-prep card gains a 2px sun border (the visual signal
 * mirrors the site-wide HurricaneBanner). Stays dormant when the
 * flag is false (default).
 *
 * D-0030 (Wave C of three sequential design changes) — visual
 * system hygiene pass:
 *   - Eyebrow removed. Per the ≤3-eyebrow rule, only Hero /
 *     Coverage / FinalCTA get eyebrows. The "What I do" label
 *     was redundant with the heading "Six things, done well."
 *   - Tertiary "Learn more →" micro-CTAs removed. The whole
 *     card is already a link, so the arrow competed with the
 *     primary affordance. The card title + visual body now
 *     carry the clickability signal (cursor + lift on hover).
 *   - StaggerGroup wrapper removed (below-fold = static per
 *     D-0030 motion gating). The grid renders flat on first
 *     paint, no fade-up cascade.
 */

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Section } from '@/components/site';
import { BUSINESS, PRICING_FLOOR_CENTS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { type ServiceKey, services } from '@/lib/content';

import { ServiceBentoIcon } from './ServiceBentoIcon';
import styles from './ServiceBento.module.css';

interface ServiceBentoProps {
  className?: string;
}

type VariantKey = ServiceKey;

const variantClass: Record<VariantKey, string> = {
  mowing: styles.cardMowing ?? '',
  edging: styles.cardEdging ?? '',
  mulching: styles.cardMulching ?? '',
  'hedge-trimming': styles.cardHedge ?? '',
  'hurricane-prep': styles.cardHurricane ?? '',
  'seasonal-cleanup': styles.cardSeasonal ?? '',
};

function formatPrice(key: ServiceKey): { from: string; price: string } {
  const f = PRICING_FLOOR_CENTS;
  switch (key) {
    case 'mowing':
      return { from: 'From', price: `$${(f.mowing_per_visit_small / 100).toFixed(0)}/visit` };
    case 'edging':
      return {
        from: 'From',
        price: `$${(f.edging_per_linear_ft / 100).toFixed(2)}/linear ft`,
      };
    case 'mulching':
      return {
        from: 'From',
        price: `$${((f.mulch_per_cubic_yard + f.mulch_install_per_cubic_yard) / 100).toFixed(0)}/yd³`,
      };
    case 'hedge-trimming':
      return {
        from: 'From',
        price: `$${(f.hedge_trim_per_linear_ft / 100).toFixed(2)}/linear ft`,
      };
    case 'hurricane-prep':
      return { from: 'From', price: `$${(f.hurricane_prep_base / 100).toFixed(0)}` };
    case 'seasonal-cleanup':
      return { from: 'From', price: `$${(f.seasonal_cleanup_base / 100).toFixed(0)}` };
  }
}

export function ServiceBento({ className }: ServiceBentoProps): ReactNode {
  const ordered: ReadonlyArray<ServiceKey> = [
    'mowing',
    'mulching',
    'edging',
    'hedge-trimming',
    'hurricane-prep',
    'seasonal-cleanup',
  ];

  return (
    <Section
      rhythm="loose"
      className={cn(styles.root, className)}
      data-hurricane-mode={BUSINESS.hurricaneModeActive ? 'true' : undefined}
    >
      <div className="container">
        <header className={styles.header}>
          <h2 className={styles.headerHeading}>Six things, done well.</h2>
          <p className={styles.headerSub}>
            I keep the service list short on purpose. Six things, no crew swap, no upsell. If you
            need something not listed, ask. Half of what I do is the stuff nobody else lists.
          </p>
        </header>

        <div className={styles.grid}>
          {ordered.map((key) => {
            const svc = services[key];
            const { from, price } = formatPrice(key);
            return (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className={cn(styles.card, variantClass[key])}
                aria-label={`${svc.title}: ${svc.summary}`}
              >
                <article>
                  <div className={styles.imageWrap}>
                    <Image
                      src={svc.imageSlot}
                      alt={svc.imageAlt}
                      fill
                      sizes="(max-width: 980px) 100vw, 50vw"
                    />
                  </div>
                  <div className={styles.body}>
                    <ServiceBentoIcon service={key} className={styles.icon} />
                    <h3 className={styles.title}>{svc.title}</h3>
                    <p className={styles.summary}>{svc.summary}</p>
                    <p className={styles.price}>
                      <span className={styles.priceFrom}>{from}</span>
                      <span>{price}</span>
                    </p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
