'use client';

/**
 * ServiceDirectory — `/services` index page.
 *
 * 6-card directory laid out as a 12-col grid with the featured
 * mowing card spanning 8 cols and the others as 4-col tiles.
 * Reads from `lib/content.ts → services` for the short summary,
 * imageSlot, and price floors. The hero copy + subhead come
 * from `lib/content.ts → servicesIndex`.
 *
 * **Why a separate component?** The homepage uses `ServiceBento`,
 * which lives inside the warm cream section background and shows
 * the same six services inline with the rest of the landing page.
 * The `/services` index is a stand-alone customer-facing surface —
 * it gets a darker warm/sand background and a hero h1 so visitors
 * who land directly via search have proper orientation.
 *
 * Cards reuse the same hover lift + image scale motif as
 * `ServiceBento` so visitors feel visual continuity between / and
 * /services.
 */

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { FadeUp, useFadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { type ServiceKey, services, servicesIndex } from '@/lib/content';

import styles from './ServiceDirectory.module.css';

interface ServiceDirectoryProps {
  className?: string | undefined;
}

type VariantKey = ServiceKey;
type ServiceCopy = (typeof services)[ServiceKey];

const variantClass: Record<VariantKey, string> = {
  mowing: styles.cardMowing ?? '',
  edging: styles.cardEdging ?? '',
  mulching: styles.cardMulching ?? '',
  'hedge-trimming': styles.cardHedge ?? '',
  'hurricane-prep': styles.cardHurricane ?? '',
  'seasonal-cleanup': styles.cardSeasonal ?? '',
};

const ordered: ReadonlyArray<ServiceKey> = [
  'mowing',
  'edging',
  'mulching',
  'hedge-trimming',
  'hurricane-prep',
  'seasonal-cleanup',
];

const STAGGER_STEP_S = 0.06;
const STAGGER_INITIAL_S = 0.08;

const MotionLink = motion(Link);

interface ServiceDirectoryCardProps {
  svc: ServiceCopy;
  delay?: number;
}

/**
 * ServiceDirectoryCard — animated card root for the /services
 * directory grid. One card per service line. The motion(Link)
 * is the card root; it carries the fade-up variants itself so
 * the StaggerGroup wrapper can be removed. Stagger is driven by
 * a `delay` prop passed from the parent map. Replaces the prior
 * `<StaggerGroup>{...<Link>...}</StaggerGroup>` pattern (which
 * never triggered because plain `<Link>` children lacked
 * `variants={fadeUpVariants}`). `prefers-reduced-motion`
 * collapses duration + delay to near-zero.
 */
function ServiceDirectoryCard({ svc, delay = 0 }: ServiceDirectoryCardProps): ReactNode {
  const { ref, fadeUpProps } = useFadeUp<HTMLAnchorElement>(delay);

  return (
    <MotionLink
      ref={ref}
      href={`/services/${svc.slug}`}
      className={cn(styles.card, variantClass[svc.slug])}
      aria-label={`${svc.title}: ${svc.summary}`}
      {...fadeUpProps}
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
          <span className={styles.eyebrow}>
            {svc.eyebrow} — {svc.title}
          </span>
          <h2 className={styles.title}>{svc.title}</h2>
          <p className={styles.summary}>{svc.summary}</p>
          <span className={styles.cta}>
            Read more <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </article>
    </MotionLink>
  );
}

export function ServiceDirectory({ className }: ServiceDirectoryProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <FadeUp as="header" className={styles.header}>
          <Eyebrow tone="default" className={styles.headerEyebrow}>
            {servicesIndex.eyebrow}
          </Eyebrow>
          <h1 className={styles.headerTitle}>{servicesIndex.heading}</h1>
          <p className={styles.headerTagline}>{servicesIndex.tagline}</p>
        </FadeUp>

        <div className={styles.grid}>
          {ordered.map((key, i) => {
            const svc = services[key];
            return (
              <ServiceDirectoryCard
                key={svc.slug}
                svc={svc}
                delay={STAGGER_INITIAL_S + i * STAGGER_STEP_S}
              />
            );
          })}
        </div>

        <p className={styles.tail}>{servicesIndex.tail}</p>
      </div>
    </Section>
  );
}
