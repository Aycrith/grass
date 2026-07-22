// Investigate the right-edge gray strip: check the computed
// z-index, opacity, filter, and bounding box of every layer
// at the right edge of the hero.
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
  const hero = document.querySelector('[data-test-section="hero"]');
  if (!hero) return { error: 'hero not found' };

  // Find all elements that intersect the right edge (x=1850, y=400)
  const point = { x: 1850, y: 400 };
  const elements = document.elementsFromPoint(point.x, point.y);

  // Get computed style and bounding box for each
  const details = elements.map((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      cls: (el.className.baseVal || el.className || '').toString(),
      zIndex: cs.zIndex,
      position: cs.position,
      opacity: cs.opacity,
      filter: cs.filter,
      mixBlendMode: cs.mixBlendMode,
      background: cs.background.substring(0, 100),
      width: r.width,
      height: r.height,
      left: r.left,
      right: r.right,
    };
  });

  return { point, elements: details };
});

console.log(JSON.stringify(audit, null, 2));

await browser.close();
