'use client';

/**
 * ServiceHero — `/services/[slug]` page opener.
 *
 * Full-bleed image at top with editorial Fraunces display
 * heading + tagline + 60–120 word intro floating on top. Two
 * CTAs: primary "Get a free quote" + secondary "Call (727)
 * 555-0123".
 *
 * Reads from `lib/content.ts → serviceDetail[slug]` for copy
 * and `services[slug]` for imageSlot/imageAlt. The section is
 * data-driven from the page that mounts it (page.tsx passes
 * the slug); the component itself only consumes content.
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Breadcrumb, Eyebrow } from '@/components/site';
import { Button } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { type ServiceKey, serviceDetail, services } from '@/lib/content';

import styles from './ServiceHero.module.css';

interface ServiceHeroProps {
  /** Service slug — must be a key in `services` and `serviceDetail`. */
  slug: ServiceKey;
  className?: string | undefined;
}

export function ServiceHero({ slug, className }: ServiceHeroProps): ReactNode {
  const svc = services[slug];
  const detail = serviceDetail[slug];
  const phoneHref = `tel:${BUSINESS.phone}`;
  return (
    <section className={cn(styles.root, className)}>
      <div className={styles.media} aria-hidden="true">
        <Image
          src={svc.imageSlot}
          alt={svc.imageAlt}
          fill
          sizes="100vw"
          className={styles.image}
          priority
        />
        <div className={styles.scrim} />
      </div>

      <div className="container">
        <div className={styles.copy}>
          <FadeUp>
            <Breadcrumb
              tone="dark"
              className={styles.breadcrumb}
              items={[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/services' },
                { label: detail.name },
              ]}
            />
            <Eyebrow tone="dark" className={styles.eyebrow}>
              {svc.eyebrow} — {svc.title}
            </Eyebrow>
            <h1 className={styles.title}>{detail.name} in Largo, FL</h1>
            <p className={styles.tagline}>{detail.tagline}</p>
            <p className={styles.intro}>{detail.intro}</p>
            <div className={styles.actions}>
              <Button as="link" href="/quote" variant="sun" size="lg">
                Get a free quote
              </Button>
              <Button as="a" href={phoneHref} variant="outline" size="lg" inverse>
                Call {BUSINESS.phone}
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
