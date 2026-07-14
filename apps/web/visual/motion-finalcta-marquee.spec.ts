import { test } from '@playwright/test';

test('wp88 motion verification at FinalCTABanner + MarqueeQuote (2 frames)', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  test.setTimeout(90_000);

  // Force motion=allow to override the global contextOptions.reducedMotion='reduce'
  const context = page.context();
  await context.close();
  const newContext = await context.browser()!.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'no-preference',
  });
  const newPage = await newContext.newPage();

  await newPage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await newPage.waitForTimeout(2000);

  // Scroll the entire page first to fire all IntersectionObservers
  await newPage.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 200;
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
  await newPage.waitForTimeout(1000);

  // Capture FinalCTABanner by its specific class
  await newPage.evaluate(() => {
    // Find section containing eyebrow text "09 — Ready when you are"
    const elements = Array.from(document.querySelectorAll('section'));
    const finalCta = elements.find((s) => {
      const text = s.textContent || '';
      return text.includes('Ready when you are') || text.includes('09');
    });
    if (finalCta) finalCta.scrollIntoView({ block: 'center' });
  });
  await newPage.waitForTimeout(1500);
  await newPage.screenshot({
    path: 'visual/test-output/_wp88-motion-finalcta.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP88_FINALCTA captured`);

  // Now scroll back to marquee and capture TWO frames to verify motion
  await newPage.evaluate(() => {
    // Find marquee by its section wrapper — it's the section after OperatorNote
    const sections = Array.from(document.querySelectorAll('section'));
    for (const s of sections) {
      const text = s.textContent || '';
      if (text.includes('If I can') && text.includes('locked gate')) {
        s.scrollIntoView({ block: 'center' });
        break;
      }
    }
  });
  await newPage.waitForTimeout(500);
  await newPage.screenshot({
    path: 'visual/test-output/_wp88-motion-marquee-t1.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  await newPage.waitForTimeout(800);
  await newPage.screenshot({
    path: 'visual/test-output/_wp88-motion-marquee-t2.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP88_MARQUEE_T1 and WP88_MARQUEE_T2 captured (motion check)`);

  await newContext.close();
});
