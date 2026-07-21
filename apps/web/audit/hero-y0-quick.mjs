// Quick capture script for hero-y0 (single shot, no port iteration)
import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => console.log('pageerror:', e.message));
page.on('console', (m) => {
  if (m.type() === 'error') console.log('console.error:', m.text());
});

try {
  await page.goto('http://localhost:3001/', { waitUntil: 'load', timeout: 60000 });
  console.log('loaded, url=', page.url());
  await page.waitForTimeout(2000);
  const isGrass = await page.evaluate(() => Boolean(document.querySelector('[data-test-section="hero"]')));
  console.log('hasHero:', isGrass);
  await page.screenshot({ path: 'apps/web/audit/d-0049-second-scene/hero-y0.png' });
  console.log('captured');
} catch (e) {
  console.log('error:', e.message);
}

await browser.close();
