import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);

const section = p.locator('section[data-test-section="pocket-map"]');
await section.scrollIntoViewIfNeeded();
await p.waitForTimeout(2500);
await section.screenshot({ path: 'pocket-map-desktop.png' });

// Cross-section view: PocketMap + OperatorStrip above + FieldLog below
await p.evaluate(() => {
  const el = document.querySelector('section[data-test-section="pocket-map"]');
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 250, behavior: 'instant' });
});
await p.waitForTimeout(1500);
await p.screenshot({ path: 'pocket-map-context.png' });

// Hover state on the map image
const mapImg = p.locator('section[data-test-section="pocket-map"] img');
await mapImg.hover();
await p.waitForTimeout(800);
await p.screenshot({ path: 'pocket-map-hover.png' });

// Mobile
const p2 = await b.newPage({ viewport: { width: 390, height: 844 } });
await p2.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p2.waitForTimeout(2500);
const section2 = p2.locator('section[data-test-section="pocket-map"]');
await section2.scrollIntoViewIfNeeded();
await p2.waitForTimeout(2000);
await section2.screenshot({ path: 'pocket-map-mobile.png' });

await b.close();
console.log('captured');
