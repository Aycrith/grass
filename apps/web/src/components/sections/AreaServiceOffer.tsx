/**
 * AreaServiceOffer — third section of `/areas/[zip]`.
 *
 * Sand-bleached surface. 2-col (desktop) / 1-col (mobile) grid
 * of "this service is available in your ZIP" cards. Each card
 * links to the corresponding `/services/[slug]` page so
 * visitors can dive straight into the service detail they're
 * interested in without bouncing back to `/services` first.
 *
 * The 6 service slugs come from `lib/content.ts → services`;
 * each card reads `name` + `tagline` from there (same shape
 * the homepage ServiceBento uses), so visitors see consistent
 * copy across the whole site.
 */

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { StaggerGroup } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { Pill } from '@/components/ui';
import { cn } from '@/lib/cn';
import { services } from '@/lib/content';

import styles from './AreaServiceOffer.module.css';

interface AreaServiceOfferProps {
  /** Service-area ZIP — shown in the eyebrow so visitors see the route applies to them. */
  zip: string;
  className?: string | undefined;
}

export function AreaServiceOffer({ zip, className }: AreaServiceOfferProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <header className={styles.header}>
          <Eyebrow tone="default" dot>
            Services in {zip}
          </Eyebrow>
          <h2 className={styles.heading}>What we offer where you are.</h2>
          <p className={styles.tagline}>
            Every service is available in every ZIP we serve. Pick what you need today — you can add
            more later.
          </p>
        </header>

        <StaggerGroup as="div" className={styles.grid} childDelay={0.05} initialDelay={0.05}>
          {Object.values(services).map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className={styles.card}>
              <article>
                <div className={styles.imageWrap}>
                  <Image
                    src={service.imageSlot}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className={styles.scrim} />
                  <Pill tone="outline" size="sm" className={styles.zipPill}>
                    {zip}
                  </Pill>
                </div>
                <div className={styles.body}>
                  <h3 className={styles.title}>{service.title}</h3>
                  <p className={styles.bodyCopy}>{service.summary}</p>
                  <span className={styles.cta}>
                    Learn more <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
