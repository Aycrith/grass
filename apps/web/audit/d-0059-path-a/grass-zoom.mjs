// Multi-frame grass-blade zoom capture to verify the per-blade
// phase-offset sway is working: each blade should be at a different
// angle across frames, with the spread of phases creating the
// "wind moving across the lawn" shimmer.
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

const delays = [0, 700, 1400];
for (let i = 0; i < delays.length; i++) {
  if (i > 0) await page.waitForTimeout(delays[i] - delays[i - 1]);
  const filename = `grass-zoom-frame${i + 1}.png`;
  // Very tight zoom on the grass blade band. At 1920x800 the
  // NearLayer maps grass (viewBox y=636-680) to screen y=498-546.
  // Crop a 200x60 box at the top of the band to isolate individual
  // blade strokes.
  await page.screenshot({
    path: `audit/d-0059-path-a/${filename}`,
    clip: { x: 0, y: 490, width: 250, height: 80 },
  });
  console.log(`captured ${filename} (t=${delays[i]}ms)`);
}

await browser.close();
