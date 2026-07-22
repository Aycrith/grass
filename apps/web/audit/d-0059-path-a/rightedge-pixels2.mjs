// Sample pixel colors from the right edge of the hero to identify
// the gray strip source. Uses sharp to decode the PNG.
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';

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

const buf = await page.screenshot({ clip: { x: 1700, y: 0, width: 220, height: 800 } });
fs.writeFileSync('audit/d-0059-path-a/rightedge-raw.png', buf);

const img = sharp(buf);
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

// Sample pixels at specific x positions across the strip
const sampleY = [100, 300, 500, 700];
const sampleX = [0, 30, 60, 90, 120, 150, 180, 210]; // 0 = x=1700 in full image, 220 = x=1920

console.log('width:', info.width, 'height:', info.height, 'channels:', info.channels);
for (const y of sampleY) {
  const row = [];
  for (const x of sampleX) {
    const idx = (y * info.width + x) * info.channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    row.push(`x=${(x + 1700).toString().padStart(4)}: ${hex} (${r},${g},${b})`);
  }
  console.log(`y=${y}:`);
  row.forEach((s) => console.log('  ', s));
}

await browser.close();
