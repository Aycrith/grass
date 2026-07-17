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

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { FadeUp, useFadeUp } from '@/components/motion';
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

const STAGGER_STEP_S = 0.06;
const STAGGER_INITIAL_S = 0.05;

const MotionLink = motion(Link);

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

function TiltCard({
  children,
  className,
  href,
  ariaLabel,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  ariaLabel: string;
  delay?: number;
}): ReactNode {
  const { ref, fadeUpProps } = useFadeUp<HTMLAnchorElement>(delay);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionLink
      ref={ref}
      href={href}
      className={className}
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...fadeUpProps}
    >
      <motion.article
        className={styles.tiltInner}
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.article>
    </MotionLink>
  );
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
      data-test-section="service-bento"
      data-hurricane-mode={BUSINESS.hurricaneModeActive ? 'true' : undefined}
    >
      <div className="container">
        <FadeUp as="header" className={styles.header}>
          <h2 className={styles.headerHeading}>Six things, done well.</h2>
          <p className={styles.headerSub}>
            I keep the service list short on purpose. Six things, no crew swap, no upsell. If you
            need something not listed, ask. Half of what I do is the stuff nobody else lists.
          </p>
        </FadeUp>

        <div className={styles.grid}>
          {ordered.map((key, i) => {
            const svc = services[key];
            const { from, price } = formatPrice(key);
            return (
              <TiltCard
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className={cn(styles.card, variantClass[key])}
                ariaLabel={`${svc.title}: ${svc.summary}`}
                delay={STAGGER_INITIAL_S + i * STAGGER_STEP_S}
              >
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
              </TiltCard>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
