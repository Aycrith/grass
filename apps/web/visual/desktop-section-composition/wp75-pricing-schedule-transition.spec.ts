import { test } from '@playwright/test';

test('wp75 desktop pricing tiers + schedule timeline transition', async ({ page, browserName }) => {
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

  // Find the pricing tiers section
  await page.evaluate(() => {
    const pricing = document.querySelector('[class*="PricingTiers_root"]');
    if (!pricing) return;
    const r = pricing.getBoundingClientRect();
    const targetY = window.scrollY + r.top - 50;
    window.scrollTo(0, targetY);
  });

  await page.waitForTimeout(500);

  await page.screenshot({
    path: 'visual/test-output/_wp75-desktop-pricing-schedule-transition.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });

  console.log(`WP75_DESKTOP_PRICING_SCHEDULE captured`);
});
