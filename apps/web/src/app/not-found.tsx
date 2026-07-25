/**
 * 404 — not-found page.
 *
 * Editorial 404 in the brand voice. The previous implementation was a
 * bare `<section>` with two `<a className="btn">` stubs and a hard-coded
 * `--gray-700` background on the call button. The 2026-07-25 rebuild
 * uses the canonical <Section> + <Eyebrow> + <Card> + <Button> primitives
 * so the 404 reads as part of the site instead of a half-finished stub.
 *
 * Voice: "we couldn't find that page" is the honest framing — no
 * fake-quirky "the lawn ate it" copy, since the 404 is sometimes
 * hit by crawlers / mis-linked external sites and the operator's
 * tone is more about clarity than charm here. The CTA rail still
 * points at the three most-likely next steps (home, quote, phone).
 */

import { Compass, Home, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { Button, Card, Illustration } from '@/components/ui';
import { BUSINESS } from '@/lib/business';

import styles from './not-found.module.css';

export default function NotFound(): ReactNode {
  return (
    <>
      <Section tone="soft" rhythm="loose" className={styles.hero}>
        <div className="container">
          <FadeUp className={styles.copy}>
            <Eyebrow tone="default" className={styles.eyebrow}>
              404 · Page not found
            </Eyebrow>
            <h1 className={styles.title}>
              That yard isn&rsquo;t on the route.
            </h1>
            <p className={styles.lede}>
              We couldn&rsquo;t find the page you were looking for. It may have moved,
              been renamed, or never existed. Try one of the links below &mdash; or
              give us a call and we&rsquo;ll point you in the right direction.
            </p>
            <div className={styles.illustration}>
              <Illustration
                src="/illustrations/empty-state-yard.svg"
                width={420}
                height={280}
                alt=""
              />
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section tone="default" rhythm="loose" className={styles.actions}>
        <div className="container">
          <FadeUp className={styles.cardGrid}>
            <Card variant="insight">
              <h2 className={styles.cardTitle}>
                <Home size={18} aria-hidden="true" className={styles.cardIcon} />
                Start at the homepage
              </h2>
              <p className={styles.cardBody}>
                Coverage check, pricing, the route schedule, and a one-tap path to
                a free quote &mdash; everything lives one click from the front door.
              </p>
              <div className={styles.cardFooter}>
                <Button as="link" href="/" variant="primary" size="md">
                  Go home
                </Button>
              </div>
            </Card>

            <Card variant="insight">
              <h2 className={styles.cardTitle}>
                <Compass size={18} aria-hidden="true" className={styles.cardIcon} />
                Jump to a service
              </h2>
              <p className={styles.cardBody}>
                Mowing, edging, mulching, hedge trimming, hurricane prep, or a
                seasonal cleanup &mdash; each page has the price floor, what&rsquo;s
                included, and a one-tap quote.
              </p>
              <div className={styles.cardFooter}>
                <Button as="link" href="/services" variant="primary" size="md">
                  Browse services
                </Button>
                <Link href="/areas" className={styles.secondaryLink}>
                  Or pick your ZIP &rarr;
                </Link>
              </div>
            </Card>

            <Card variant="insight">
              <h2 className={styles.cardTitle}>
                <Phone size={18} aria-hidden="true" className={styles.cardIcon} />
                Or just call
              </h2>
              <p className={styles.cardBody}>
                If a human is faster, here&rsquo;s the number. We&rsquo;re in the
                truck between 7&nbsp;AM and 5&nbsp;PM on weekdays, so leave a
                text if we miss you.
              </p>
              <dl className={styles.contactList}>
                <div className={styles.contactRow}>
                  <dt>
                    <Phone size={14} aria-hidden="true" />
                    <span className="sr-only">Phone</span>
                  </dt>
                  <dd>
                    <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>
                  </dd>
                </div>
                <div className={styles.contactRow}>
                  <dt>
                    <Mail size={14} aria-hidden="true" />
                    <span className="sr-only">Email</span>
                  </dt>
                  <dd>
                    <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
                  </dd>
                </div>
              </dl>
            </Card>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
