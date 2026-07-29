/**
 * AreaServiceOffer — `/areas/[zip]` services grid.
 *
 * Reuses the existing `services` export from `lib/content.ts`
 * rather than re-defining a per-area service list. Each of the
 * 6 services renders as a 3-up card (3 columns on desktop,
 * 1 on mobile) with the existing painted icon, title, summary,
 * and a per-service "From $X" price floor pulled from
 * `PRICING_FLOOR_CENTS` in `lib/business.ts`.
 *
 * The whole card is a link to `/services/[slug]` (the canonical
 * service detail page) — the same affordance pattern as
 * ServiceBento on the homepage.
 *
 * Surfaces a muted backdrop (sand-bleached) so the service
 * cards sit between the cream challenges section above and
 * the cream FAQ section below, in the same rhythm as
 * ServiceIncludes on the /services pages.
 *
 * D-0030 rule: below-the-fold sections render flat (no FadeUp
 * wrappers).
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

import { Container, Eyebrow, Section } from '@/components/site';
import { PRICING_FLOOR_CENTS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { type ServiceKey, services } from '@/lib/content';

import { ServiceBentoIcon } from './ServiceBentoIcon';
import styles from './AreaServiceOffer.module.css';

interface AreaServiceOfferProps {
  /** ZIP for the eyebrow line + CTA prefill. */
  zip: string;
  className?: string | undefined;
}

/**
 * Map ServiceKey → "From $X" floor price string. Same format
 * as ServiceBento's formatPrice(), kept locally so this
 * component does not import a private helper from a sibling.
 */
function floorPrice(key: ServiceKey): string {
  const f = PRICING_FLOOR_CENTS;
  switch (key) {
    case 'mowing':
      return `From $${(f.mowing_per_visit_small / 100).toFixed(0)}/visit`;
    case 'edging':
      return `From $${(f.edging_per_linear_ft / 100).toFixed(2)}/linear ft`;
    case 'mulching':
      return `From $${((f.mulch_per_cubic_yard + f.mulch_install_per_cubic_yard) / 100).toFixed(0)}/yd³`;
    case 'hedge-trimming':
      return `From $${(f.hedge_trim_per_linear_ft / 100).toFixed(2)}/linear ft`;
    case 'hurricane-prep':
      return `From $${(f.hurricane_prep_base / 100).toFixed(0)}`;
    case 'seasonal-cleanup':
      return `From $${(f.seasonal_cleanup_base / 100).toFixed(0)}`;
  }
}

export function AreaServiceOffer({ zip, className }: AreaServiceOfferProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <Container>
        <div className={styles.header}>
          <Eyebrow tone="default">What we do here</Eyebrow>
          <h2 className={styles.heading}>Six services, no franchise swap.</h2>
          <p className={styles.subhead}>
            Six residential lawn-care lines for {zip} and the surrounding Pinellas neighborhoods.
            The same solo operator, the same gear, the same route day every week. No crew swap, no
            upsell, no surprise fees.
          </p>
        </div>

        <ul className={styles.grid}>
          {(
            [
              'mowing',
              'edging',
              'mulching',
              'hedge-trimming',
              'hurricane-prep',
              'seasonal-cleanup',
            ] as const satisfies readonly ServiceKey[]
          ).map((key) => {
            const svc = services[key];
            return (
              <li key={svc.slug} className={styles.cardLi}>
                <Link
                  href={`/services/${svc.slug}`}
                  className={styles.card}
                  aria-label={`${svc.title}: ${svc.summary}`}
                >
                  <article>
                    <ServiceBentoIcon service={key} className={styles.icon} />
                    <h3 className={styles.title}>{svc.title}</h3>
                    <p className={styles.summary}>{svc.summary}</p>
                    <p className={styles.price}>{floorPrice(key)}</p>
                  </article>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
