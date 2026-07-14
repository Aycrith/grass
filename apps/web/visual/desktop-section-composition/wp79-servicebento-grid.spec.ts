import { test } from '@playwright/test';

test('wp79 desktop servicebento 3x2 grid at 1280x800', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1280, height: 800 });
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

  // Find the service bento element
  const bentoBox = await page.evaluate(() => {
    const bento = document.querySelector('[class*="ServiceBento_root"]');
    if (!bento) return null;
    const r = bento.getBoundingClientRect();
    const targetY = window.scrollY + r.top - 50;
    window.scrollTo(0, targetY);
    return { y: targetY };
  });

  await page.waitForTimeout(500);

  await page.screenshot({
    path: 'visual/test-output/_wp79-desktop-servicebento-grid.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });

  console.log(`WP79_DESKTOP_SERVICEBENTO captured`);
});
