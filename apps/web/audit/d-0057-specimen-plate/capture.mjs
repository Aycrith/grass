import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);

// Scroll to the SpecimenPlate section
const section = p.locator('section[data-test-section="specimen-plate"]');
await section.scrollIntoViewIfNeeded();
await p.waitForTimeout(2000); // let entry animations finish
await section.screenshot({ path: 'specimen-plate-desktop.png' });

// Mid-grid capture
const grid = section.locator('div').filter({ hasText: 'St. Augustinegrass' }).first();
await grid.screenshot({ path: 'specimen-plate-grid.png' });

// Mobile
const p2 = await b.newPage({ viewport: { width: 390, height: 844 } });
await p2.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p2.waitForTimeout(2500);
const section2 = p2.locator('section[data-test-section="specimen-plate"]');
await section2.scrollIntoViewIfNeeded();
await p2.waitForTimeout(2000);
await section2.screenshot({ path: 'specimen-plate-mobile.png' });

await b.close();
console.log('captured');
