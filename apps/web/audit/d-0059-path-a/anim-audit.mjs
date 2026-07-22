// Diagnostic script: evaluate the DOM to verify each animation class
// is actually applied and the CSS animation is running. Outputs
// the computed animation-name, animation-duration, and current
// rotation for a few sample elements.
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
await page.waitForTimeout(2000);

// Inspect the .palmFronds and .blade elements
const result = await page.evaluate(() => {
  // Find the storybook layer
  const layer = document.querySelector('[data-test-section="hero"]');
  if (!layer) return { error: 'hero section not found' };

  // Find all elements with transform-box: fill-box (our new animations)
  const allEls = document.querySelectorAll('*');
  const palmFrondsEls = [];
  const bladeEls = [];
  const farPalmsEls = [];
  const sunRaysEls = [];

  for (const el of allEls) {
    const cls = (el.className.baseVal || el.className || '').toString();
    const cs = getComputedStyle(el);
    if (cls.includes('palmFronds')) {
      palmFrondsEls.push({
        tag: el.tagName,
        animationName: cs.animationName,
        animationDuration: cs.animationDuration,
        transformOrigin: cs.transformOrigin,
        transformBox: cs.transformBox,
      });
    } else if (cls.includes('blade')) {
      bladeEls.push({
        tag: el.tagName,
        animationName: cs.animationName,
        animationDuration: cs.animationDuration,
        transformOrigin: cs.transformOrigin,
        transformBox: cs.transformBox,
        animationDelay: cs.animationDelay,
      });
    } else if (cls.includes('farPalmsSway')) {
      farPalmsEls.push({
        tag: el.tagName,
        animationName: cs.animationName,
        animationDuration: cs.animationDuration,
        transformOrigin: cs.transformOrigin,
        transformBox: cs.transformBox,
      });
    } else if (cls.includes('sunRaysLong') || cls.includes('sunRaysShort')) {
      sunRaysEls.push({
        tag: el.tagName,
        cls: cls,
        animationName: cs.animationName,
        animationDuration: cs.animationDuration,
        transformOrigin: cs.transformOrigin,
      });
    }
  }

  return {
    palmFronds: { count: palmFrondsEls.length, samples: palmFrondsEls.slice(0, 3) },
    blades: { count: bladeEls.length, samples: bladeEls.slice(0, 3) },
    farPalms: { count: farPalmsEls.length, samples: farPalmsEls },
    sunRays: { count: sunRaysEls.length, samples: sunRaysEls.slice(0, 4) },
  };
});

console.log(JSON.stringify(result, null, 2));

await browser.close();
