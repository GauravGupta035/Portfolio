import { expect, test } from '@playwright/test';

test('loads the site under /Portfolio/', async ({ page }) => {
  await page.goto('/Portfolio/');
  await expect(page).toHaveTitle('Gaurav Gupta');
  await expect(page.getByRole('main')).toBeAttached();
});

test('renders the hero text before any WebGL chunk is requested', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Note when the hero name first shows, on the page's own clock.
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      const name = document.querySelector('h1');
      if (!name?.textContent || !name.checkVisibility()) return;
      (window as { heroShownAt?: number }).heroShownAt = performance.now();
      observer.disconnect();
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  await page.goto('/Portfolio/');
  // A first visit gets the water loader, which is the first thing to ask for WebGL.
  await expect(page.getByTestId('intro-loader').locator('canvas')).toBeAttached();
  const { heroShownAt, webgl } = await page.evaluate(() => ({
    heroShownAt: (window as { heroShownAt?: number }).heroShownAt,
    webgl: performance
      .getEntriesByType('resource')
      .filter((entry) => /\/(react-three-fiber|WaterScene|LiquidScene)[^/]*\.js$/.test(entry.name))
      .map((entry) => entry.startTime),
  }));
  expect(heroShownAt).toBeDefined();
  expect(webgl.length).toBeGreaterThan(0);
  for (const start of webgl) expect(start).toBeGreaterThanOrEqual(heroShownAt ?? Infinity);
});

test('serves the resume PDF', async ({ request }) => {
  const response = await request.get('/Portfolio/Gaurav_Gupta_Resume.pdf');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
});

test('serves the portrait images', async ({ request }) => {
  const response = await request.get('/Portfolio/images/01.jpg');
  expect(response.status()).toBe(200);
});
