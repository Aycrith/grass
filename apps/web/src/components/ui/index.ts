/**
 * Public exports for the UI primitive family.
 * Imported as:  import { Button, Card, Input, Accordion } from '@/components/ui';
 *
 * Type re-exports intentionally omitted — verified via `rg` that no
 * consumer in `apps/web/src/**` imports the prop types directly.
 * Adding them back is a 1-line change when a future consumer needs
 * them; keeping the barrel minimal makes the public surface easy
 * to scan.
 */

export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
export { Accordion } from './Accordion';
export { LogoMark } from './LogoMark';
export { LogoLockup } from './LogoLockup';
export { Illustration } from './Illustration';
export { SectionDivider } from './SectionDivider';
