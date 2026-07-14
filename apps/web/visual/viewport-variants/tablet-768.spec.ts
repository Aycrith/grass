import { test } from '@playwright/test';

test('wp83 tablet viewport 768x1024 hero composition', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.addStyleTag({ content: `* { animation: none !important; transition: none !important; }` });
  await page.waitForTimeout(500);

  // Scroll the entire page first to fire all IntersectionObservers
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  await page.screenshot({
    path: 'visual/test-output/_wp83-tablet-hero-768.png',
    clip: { x: 0, y: 0, width: 768, height: 1024 },
    timeout: 60_000,
  });

  console.log(`WP83_TABLET_HERO_768 captured`);
});
