import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.join(process.cwd(), 'audit', 'd0041');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 667 },
];

const SECTIONS = [
  { id: 'hero', name: 'hero' },
  { id: 'coverage', name: 'coverage' },
  { id: 'operator', name: 'operator' },
  { id: 'bento', name: 'bento' },
  { id: 'pricing', name: 'pricing' },
  { id: 'process', name: 'process' },
  { id: 'schedule', name: 'schedule' },
  { id: 'faq', name: 'faq' },
  { id: 'final-cta', name: 'final-cta' },
];

let browser;

try {
  browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: vp });
    const page = await context.newPage();

    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);

      // Full page
      await page.screenshot({
        path: path.join(OUT_DIR, `home-${vp.name}-full.png`),
        fullPage: true,
      });
      console.log(`[${vp.name}] full page captured`);

      // Section screenshots by scrolling to section IDs
      for (const section of SECTIONS) {
        try {
          const el = await page.locator(`#${section.id}`).first();
          const exists = (await el.count()) > 0;
          if (!exists) {
            console.warn(`[${vp.name}] section #${section.id} not found, skipping`);
            continue;
          }
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(400);
          await page.screenshot({
            path: path.join(OUT_DIR, `home-${vp.name}-${section.name}.png`),
          });
          console.log(`[${vp.name}] #${section.id} captured`);
        } catch (err) {
          console.error(`[${vp.name}] failed to capture #${section.id}:`, err.message);
        }
      }
    } catch (err) {
      console.error(`[${vp.name}] page failed:`, err.message);
    } finally {
      await context.close();
    }
  }
} catch (err) {
  console.error('Audit capture failed:', err.message);
  process.exit(1);
} finally {
  if (browser) await browser.close();
}

console.log(`\nCaptures saved to ${OUT_DIR}`);
