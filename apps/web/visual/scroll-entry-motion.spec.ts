import { test } from '@playwright/test';

test('wp89 scroll-entry motion at ServiceBento + PricingTiers + ScheduleTimeline + EditorialBreak', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  test.setTimeout(180_000);

  // Force motion=allow
  const context = page.context();
  await context.close();
  const newContext = await context.browser()!.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'no-preference',
  });
  const newPage = await newContext.newPage();

  await newPage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await newPage.waitForTimeout(2000);

  // Pre-warm: scroll the entire page first so all sections render
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
      }, 30);
    });
  });
  await newPage.waitForTimeout(500);

  // Strategy for each section: scroll all the way to top, then jump to
  // section's top edge with offset so the section's BOTTOM edge is just
  // above the viewport. Then scroll DOWN into the section to fire
  // useInView with margin:'-10% 0px'. Capture immediately (early) and
  // after settled.

  // Helper: scroll to absolute position
  const scrollToY = async (y: number) => {
    await newPage.evaluate((targetY) => {
      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
    }, y);
  };

  const capturePair = async (label: string, earlyName: string, lateName: string, scrollTarget: number) => {
    // Scroll up first to reset IntersectionObserver
    await scrollToY(0);
    await newPage.waitForTimeout(200);

    // Scroll DOWN to just above the section (section top just below viewport)
    await scrollToY(scrollTarget - 100);
    await newPage.waitForTimeout(100);

    // Capture the section by jumping to its top via scrollIntoView
    await newPage.evaluate((targetY) => {
      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
    }, scrollTarget);

    // Wait minimal time for useInView to register but animation to be in progress
    await newPage.waitForTimeout(80);
    await newPage.screenshot({
      path: `visual/test-output/_wp89-${label}-${earlyName}.png`,
      clip: { x: 0, y: 0, width: 1280, height: 800 },
      timeout: 60_000,
    });

    // Wait for animation to settle
    await newPage.waitForTimeout(1500);
    await newPage.screenshot({
      path: `visual/test-output/_wp89-${label}-${lateName}.png`,
      clip: { x: 0, y: 0, width: 1280, height: 800 },
      timeout: 60_000,
    });
    console.log(`WP89_${label.toUpperCase()} ${earlyName} + ${lateName} captured`);
  };

  // Get absolute Y of each section by selector text
  const getY = async (text: string): Promise<number> => {
    return newPage.evaluate((searchText) => {
      const all = Array.from(document.querySelectorAll('section'));
      const target = all.find((s) => (s.textContent || '').includes(searchText));
      return target ? target.getBoundingClientRect().top + window.scrollY : 0;
    }, text);
  };

  // EditorialBreak — section with "Every Tuesday" or "Every TUESDAY"
  const editorialY = await getY('Every TUESDAY');
  await capturePair('editorial', 'early', 'settled', editorialY);

  // ServiceBento — section with "From $110" or "by the yard"
  const bentoY = await getY('From $');
  await capturePair('bento', 'early', 'settled', bentoY);

  // PricingTiers — section with "$48" or "$185" (the price tiers)
  const pricingY = await getY('$185');
  await capturePair('pricing', 'early', 'settled', pricingY);

  // ScheduleTimeline — section with "Which day" or "Monday"
  const scheduleY = await getY('Which day');
  await capturePair('schedule', 'early', 'settled', scheduleY);

  await newContext.close();
});
