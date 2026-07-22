// Multi-frame capture to verify the rev8 part-wise palm animation:
// the trunk should be in the SAME position across all frames (rooted),
// while the fronds should be in DIFFERENT positions (swaying).
// Captures 4 frames at 1920x800 spaced ~1.75s apart, so a 7s frond
// period will show 4 distinct phase positions of the canopy.
import { chromium } from 'playwright';
import path from 'node:path';

const browser = await chromium.launch({
  headless: true,
  timeout: 300000,
  executablePath: 'C:\\Users\\camer\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu-sandbox'],
});
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 800 },
  reducedMotion: 'no-preference',
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 30000 });
await page.waitForSelector('[data-test-section="hero"]', { timeout: 30000 });
await page.waitForTimeout(2000);

const frameDelays = [0, 1750, 3500, 5250];
for (let i = 0; i < frameDelays.length; i++) {
  if (i === 0) {
    // First frame: 0ms additional wait
  } else {
    await page.waitForTimeout(frameDelays[i] - frameDelays[i - 1]);
  }
  const filename = `hero-1920-rev8-frame${i + 1}.png`;
  await page.screenshot({
    path: path.join('audit/d-0059-path-a', filename),
    fullPage: false,
  });
  console.log(`captured ${filename} (t=${frameDelays[i]}ms)`);
}

await browser.close();
