// Check the storybook's children coverage at x=1880 to understand
// why the SVG content doesn't cover the right edge.
import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: true,
  timeout: 300000,
  executablePath: 'C:\\Users\\camer\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu-sandbox'],
});
const ctx = await browser.newContext({ viewport: { width: 1920, height: 800 }, reducedMotion: 'no-preference' });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 30000 });
await page.waitForSelector('[data-test-section="hero"]', { timeout: 30000 });
await page.waitForTimeout(3000);

const audit = await page.evaluate(() => {
  // Get the storybook layer
  const layer = document.querySelector('[class*="HeroStorybookLayer_layer"]');
  if (!layer) return { error: 'layer not found' };

  const lr = layer.getBoundingClientRect();
  const cs = getComputedStyle(layer);

  // Get all child elements (not just SVG paths)
  const children = Array.from(layer.querySelectorAll('*'));
  const coverage = children
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    })
    .map((el) => {
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        cls: (el.className.baseVal || el.className || '').toString().substring(0, 50),
        left: r.left,
        right: r.right,
        width: r.width,
        covers1880: r.left <= 1880 && r.right >= 1880,
      };
    });

  return {
    layer: {
      left: lr.left,
      right: lr.right,
      width: lr.width,
      background: cs.background.substring(0, 100),
      filter: cs.filter,
      zIndex: cs.zIndex,
      isolation: cs.isolation,
    },
    childrenCount: children.length,
    childrenCovering1880: coverage.filter((c) => c.covers1880).length,
    childrenNotCovering1880: coverage.filter((c) => !c.covers1880 && c.left < 1900 && c.right > 1800).slice(0, 10),
  };
});

console.log(JSON.stringify(audit, null, 2));

await browser.close();
