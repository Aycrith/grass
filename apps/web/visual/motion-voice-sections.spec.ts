import { test } from '@playwright/test';

test('wp87 motion verification at OperatorNote + MarqueeQuote + FinalCTA + OperatorStrip', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  test.setTimeout(120_000);

  // Force motion=allow to override the global contextOptions.reducedMotion='reduce'
  const context = page.context();
  await context.close();
  const newContext = await context.browser()!.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'no-preference',
  });
  const newPage = await newContext.newPage();

  await newPage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

  // Wait for full page load + initial reveal animations
  await newPage.waitForTimeout(2000);

  // Find section anchors by scrolling to each
  // OperatorStrip — contains "Hi, I'm Operator."
  // OperatorNote — contains "Same guy, same day, every week."
  // MarqueeQuote — bottom of section
  // FinalCTABanner — page's strongest moment, deep-green

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

  // Scroll back to top first
  await newPage.evaluate(() => window.scrollTo(0, 0));
  await newPage.waitForTimeout(500);

  // Capture OperatorStrip (full bio block)
  await newPage.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2, h3')).find(h => h.textContent?.includes("Hi, I'm Operator"));
    if (heading) heading.scrollIntoView({ block: 'center' });
  });
  await newPage.waitForTimeout(1500);
  await newPage.screenshot({
    path: 'visual/test-output/_wp87-motion-operatorstrip.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP87_MOTION_OPERATORSTRIP captured`);

  // Capture OperatorNote (the pull-quote voice moment)
  await newPage.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h3, h2')).find(h => h.textContent?.includes('Same guy'));
    if (heading) heading.scrollIntoView({ block: 'center' });
  });
  await newPage.waitForTimeout(1500);
  await newPage.screenshot({
    path: 'visual/test-output/_wp87-motion-operatornote.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP87_MOTION_OPERATORNOTE captured`);

  // Capture MarqueeQuote (scrolling customer quotes)
  await newPage.evaluate(() => {
    // Find the marquee container by class pattern
    const marquee = document.querySelector('[class*="marquee"], [class*="Marquee"]');
    if (marquee) marquee.scrollIntoView({ block: 'center' });
  });
  await newPage.waitForTimeout(1500);
  await newPage.screenshot({
    path: 'visual/test-output/_wp87-motion-marquee.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP87_MOTION_MARQUEE captured`);

  // Capture FinalCTABanner (the page's climax)
  await newPage.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2, h3, p')).find(h => {
      const t = h.textContent || '';
      return t.includes('Ready to book') || t.includes('Tired of') || t.includes('fed up') || t.includes('Stop') || t.includes('yard work');
    });
    if (heading) heading.scrollIntoView({ block: 'center' });
  });
  await newPage.waitForTimeout(1500);
  await newPage.screenshot({
    path: 'visual/test-output/_wp87-motion-finalcta.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP87_MOTION_FINALCTA captured`);

  await newContext.close();
});
