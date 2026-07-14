import { test } from '@playwright/test';

test('wp85b hero motion WITH motion enabled', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  test.setTimeout(60_000);

  // Force motion=allow to override the global contextOptions.reducedMotion='reduce'
  const context = page.context();
  await context.close();
  const newContext = await context.browser()!.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'no-preference',
  });
  const newPage = await newContext.newPage();

  // Navigate WITHOUT networkidle wait so we capture early frames
  await newPage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

  // Capture at t=0
  await newPage.screenshot({
    path: 'visual/test-output/_wp85b-motion-t0.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP85B_MOTION_T0 captured (t=0ms)`);

  // t=300ms (early choreography: sun + palm starting)
  await newPage.waitForTimeout(300);
  await newPage.screenshot({
    path: 'visual/test-output/_wp85b-motion-t300.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP85B_MOTION_T300 captured (t=300ms)`);

  // t=800ms (mid choreography: most layers visible)
  await newPage.waitForTimeout(500);
  await newPage.screenshot({
    path: 'visual/test-output/_wp85b-motion-t800.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP85B_MOTION_T800 captured (t=800ms)`);

  // t=2000ms (all settled, ambient loops running)
  await newPage.waitForTimeout(1200);
  await newPage.screenshot({
    path: 'visual/test-output/_wp85b-motion-t2000.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP85B_MOTION_T2000 captured (t=2000ms)`);

  await newContext.close();
});
