import { test } from '@playwright/test';

test('wp85 hero motion choreography at t=0, 500, 1500, 3000ms', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1280, height: 800 });

  // Navigate WITHOUT networkidle wait so we capture early frames
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

  // Capture at t=0 (right after DOM ready)
  await page.screenshot({
    path: 'visual/test-output/_wp85-motion-t0.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP85_MOTION_T0 captured (t=0ms)`);

  // Wait and capture at t=500ms (early choreography: sun + palm + mower fade-ups starting)
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'visual/test-output/_wp85-motion-t500.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP85_MOTION_T500 captured (t=500ms)`);

  // Wait and capture at t=1500ms (mid choreography: most layers visible, ambient loops starting)
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: 'visual/test-output/_wp85-motion-t1500.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP85_MOTION_T1500 captured (t=1500ms)`);

  // Wait and capture at t=3000ms (all mounted, ambient loops running)
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: 'visual/test-output/_wp85-motion-t3000.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    timeout: 60_000,
  });
  console.log(`WP85_MOTION_T3000 captured (t=3000ms)`);
});
