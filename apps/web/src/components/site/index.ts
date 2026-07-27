/**
 * Public exports for the site primitive family.
 * Imported as:  import { Container, Section, Eyebrow, SiteHeader, SiteFooter, HurricaneBanner } from '@/components/site';
 *
 * Type re-exports intentionally omitted — verified via `rg` that no
 * consumer in `apps/web/src/**` imports the prop types directly.
 * Adding them back is a 1-line change when a future consumer needs
 * them; keeping the barrel minimal makes the public surface easy
 * to scan.
 */

export { Container } from './Container';
export { Section } from './Section';
export { Eyebrow } from './Eyebrow';
export { SiteHeader } from './SiteHeader';
export { SiteFooter } from './SiteFooter';
export { HurricaneBanner } from './HurricaneBanner';
export { ConversionRail } from './ConversionRail';
export { Breadcrumb } from './Breadcrumb';
export { CookieConsent } from './CookieConsent';
