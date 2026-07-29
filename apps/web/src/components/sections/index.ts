/**
 * Public exports for the homepage section components.
 *
 * Verified consumers (rg -e "import.*<name> from '@/components/sections'"):
 *   - app/page.tsx (homepage) consumes ~15 of these
 *   - app/visual-test/page.tsx (visual baseline) consumes the
 *     "library" components (EditorialBreak, MarqueeQuote,
 *     ServiceAreaStats) that are not on the home composition
 *     but kept for screenshot baselines
 *   - app/services, app/areas, app/pricing, app/about, app/contact,
 *     app/quote, app/review each consume their own hero + body sections
 *
 * The following are NOT re-exported because no consumer imports them
 * from the barrel (some are imported via relative paths within the
 * same directory, which is fine):
 *   - HeroStorybookLayer (used by HeroFieldTelemetry via './HeroStorybookLayer')
 *   - TrustStrip, OperatorNote, TestimonialQuote, EmptyState
 *
 * When a future page needs one of these, add the export — it's 1 line.
 */

export { HeroFieldTelemetry } from './HeroFieldTelemetry';
export { FieldLog } from './FieldLog';
export { BehindTheScenes } from './BehindTheScenes';
export { PocketMap } from './PocketMap';
export { SpecimenPlate } from './SpecimenPlate';
export { OperatorStrip } from './OperatorStrip';
export { ServiceBento } from './ServiceBento';
export { ServiceDirectory } from './ServiceDirectory';
export { ServiceHero } from './ServiceHero';
export { ServiceIncludes } from './ServiceIncludes';
export { ServiceBeforeAfter } from './ServiceBeforeAfter';
export { ServiceFAQ } from './ServiceFAQ';
export { ServiceCTA } from './ServiceCTA';
export { PricingTiers } from './PricingTiers';
export { PricingHero } from './PricingHero';
export { PricingComparisonTable } from './PricingComparisonTable';
export { PricingFAQ } from './PricingFAQ';
export { EditorialBreak } from './EditorialBreak';
export { ProcessSteps } from './ProcessSteps';
export { ServiceAreaMap } from './ServiceAreaMap';
export { FAQAccordion } from './FAQAccordion';
export { AboutHero } from './AboutHero';
export { OperatorBio } from './OperatorBio';
export { ContactHero } from './ContactHero';
export { QuoteHero } from './QuoteHero';
export { QuoteConfirmation } from './QuoteConfirmation';
export { ReviewMagnet } from './ReviewMagnet';
export { ReviewMagnetForm } from './ReviewMagnetForm';
export { FinalCTABanner } from './FinalCTABanner';
export { MarqueeQuote } from './MarqueeQuote';
export { ServiceAreaStats } from './ServiceAreaStats';
export { ScheduleTimeline } from './ScheduleTimeline';
export { EquipmentShowcase } from './EquipmentShowcase';
export { AreaHero } from './AreaHero';
export { AreaNeighborhoodNotes } from './AreaNeighborhoodNotes';
export { AreaServiceOffer } from './AreaServiceOffer';
export { AreaFAQ } from './AreaFAQ';
export { AreaCTA } from './AreaCTA';
