import { chromium } from 'playwright';

const b = await chromium.launch();

// 1) Cross-section context (SpecimenPlate + ServiceBento above + PricingTiers below)
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);

// Scroll to just before ServiceBento so the SpecimenPlate is in view
await p.evaluate(() => {
  const el = document.querySelector('section[data-test-section="specimen-plate"]');
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 200, behavior: 'instant' });
});
await p.waitForTimeout(2500);
await p.screenshot({ path: 'context-specimen-with-bento.png', fullPage: false });

// 2) Hover state on St. Augustine plate
const stAug = p.locator('figure').filter({ hasText: 'St. Augustinegrass' }).first();
await stAug.hover();
await p.waitForTimeout(800);
await p.screenshot({ path: 'specimen-hover-state.png', fullPage: false });

// 3) Just the SpecimenPlate section in isolation (clean)
await p.evaluate(() => {
  const el = document.querySelector('section[data-test-section="specimen-plate"]');
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 20, behavior: 'instant' });
});
await p.waitForTimeout(1500);
// Move mouse off the section to clear any hover state
await p.mouse.move(0, 0);
await p.waitForTimeout(500);
const section = p.locator('section[data-test-section="specimen-plate"]');
await section.screenshot({ path: 'specimen-plate-clean.png' });

await b.close();
console.log('captured');
