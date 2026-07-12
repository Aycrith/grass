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

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { StaggerGroup } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { type ServiceKey, services, servicesIndex } from '@/lib/content';

import styles from './ServiceDirectory.module.css';

interface ServiceDirectoryProps {
  className?: string | undefined;
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

const ordered: ReadonlyArray<ServiceKey> = [
  'mowing',
  'edging',
  'mulching',
  'hedge-trimming',
  'hurricane-prep',
  'seasonal-cleanup',
];

export function ServiceDirectory({ className }: ServiceDirectoryProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <header className={styles.header}>
          <Eyebrow tone="default" dot className={styles.headerEyebrow}>
            {servicesIndex.eyebrow}
          </Eyebrow>
          <h1 className={styles.headerTitle}>{servicesIndex.heading}</h1>
          <p className={styles.headerTagline}>{servicesIndex.tagline}</p>
        </header>

        <StaggerGroup as="div" className={styles.grid} childDelay={0.06} initialDelay={0.08}>
          {ordered.map((key) => {
            const svc = services[key];
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
              </Link>
            );
          })}
        </StaggerGroup>

        <p className={styles.tail}>{servicesIndex.tail}</p>
      </div>
    </Section>
  );
}
