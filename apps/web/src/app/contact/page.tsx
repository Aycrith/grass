/**
 * /contact — lead-capture page.
 *
 * Mounts the canonical ContactHero + the existing
 * <ContactForm> client component (which posts to /api/lead).
 * The form is preserved as-is — only its editorial frame is
 * upgraded to the section library.
 *
 * When /contact?source=hurricane is hit, the hero surfaces a
 * clay-bordered hurricane-mode callout so visitors know prep /
 * cleanup requests are being prioritized.
 */

import { ContactHero } from '@/components/sections';
import { Container, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get a free lawn-care quote in ${BUSINESS.address.city}, FL. We respond within 24 hours during business days.`,
  alternates: { canonical: '/contact' },
};

interface ContactProps {
  searchParams: Promise<{ source?: string }>;
}

export default async function ContactPage({ searchParams }: ContactProps) {
  const { source } = await searchParams;
  return (
    <>
      <ContactHero hurricaneMode={source === 'hurricane'} />
      <Section tone="soft" rhythm="loose">
        <Container>
          <ContactForm source={source} />
        </Container>
      </Section>
    </>
  );
}
