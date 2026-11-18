import { expect, test, type Page } from '@playwright/test';
import { navigation } from '../src/content/navigation.ts';
import { profile } from '../src/content/profile.ts';

const frames = [profile.portrait.src, ...profile.portraitHoverFrames];
const portraitImages = /\/images\/0[1-5]\.jpg$/;

// Only the frame on show is exposed to assistive tech, so this is the visible image.
const portrait = (page: Page) => page.getByRole('img', { name: profile.portrait.alt });
const frameOnShow = async (page: Page) =>
  ((await portrait(page).getAttribute('src')) ?? '').replace(/^\/Portfolio\//, '');

async function loadHero(page: Page) {
  await page.goto('/Portfolio/');
  await expect(portrait(page)).toBeVisible();
  // Let the preloaded frames finish so the hover runs on what is already fetched.
  await page.waitForLoadState('networkidle');
}

// Hovers the portrait and checks every frame shows in order, then 01 again.
async function expectSequence(page: Page) {
  await portrait(page).hover();
  const seen = [await frameOnShow(page)];
  const started = Date.now();
  while (seen.length < frames.length + 1 && Date.now() - started < 4000) {
    const current = await frameOnShow(page);
    if (current !== seen[seen.length - 1]) seen.push(current);
    await page.waitForTimeout(40);
  }
  expect(seen).toEqual([...frames, frames[0]]);
}

// Every image the page has fetched, with when it started and finished, whether it started before
// the load event, and its size on the wire.
async function imageRequests(page: Page) {
  await page.waitForLoadState('load');
  return page.evaluate(() => {
    const [navigation] = performance.getEntriesByType(
      'navigation',
    ) as PerformanceNavigationTiming[];
    return (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
      .filter((entry) => entry.initiatorType === 'img')
      .map((entry) => ({
        path: new URL(entry.name).pathname,
        start: entry.startTime,
        end: entry.responseEnd,
        beforeLoad: entry.startTime < navigation.loadEventStart,
        bytes: entry.encodedBodySize,
      }));
  });
}

test.describe('hero portrait at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('hovering steps through 01 to 05 and back to 01', async ({ page }) => {
    await loadHero(page);
    await expectSequence(page);
  });

  test('only frame 01 is requested before the load event, the rest after it and on hover', async ({
    page,
  }) => {
    // A slow 01 makes any hover frame that starts alongside it show up.
    await page.route(`**/${frames[0]}`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await route.continue();
    });
    await page.goto('/Portfolio/');
    await expect(portrait(page)).toBeVisible();
    const images = await imageRequests(page);
    // React renders after the load event fires, so 01 may start after it too, but nothing else may.
    const early = images.filter((image) => image.beforeLoad);
    expect(early.map((image) => image.path).filter((path) => portraitImages.test(path))).toEqual(
      early.some((image) => image.path === `/Portfolio/${frames[0]}`)
        ? [`/Portfolio/${frames[0]}`]
        : [],
    );
    // Frames 02 to 05 are hover only, so they come off the first load's image bytes.
    const bytes = early.reduce((total, image) => total + image.bytes, 0);
    expect(bytes).toBeLessThanOrEqual(850_000 - 500_000);

    // Without a hover, the later frames still arrive once 01 is in.
    const hoverFrames = frames.slice(1).map((frame) => `/Portfolio/${frame}`);
    await expect
      .poll(
        async () =>
          (await imageRequests(page)).filter((image) => hoverFrames.includes(image.path)).length,
      )
      .toBe(hoverFrames.length);
    const after = await imageRequests(page);
    const first = after.find((image) => image.path === `/Portfolio/${frames[0]}`);
    expect(first).toBeDefined();
    for (const image of after.filter((entry) => hoverFrames.includes(entry.path)))
      expect(image.start, image.path).toBeGreaterThanOrEqual(first?.end ?? Infinity);

    await expectSequence(page);
  });

  test('mouse leave shows 01 within 100ms', async ({ page }) => {
    await loadHero(page);
    await portrait(page).hover();
    await expect.poll(() => frameOnShow(page)).toBe(frames[2]);
    await page.mouse.move(10, 880);
    await expect.poll(() => frameOnShow(page), { timeout: 100, intervals: [10] }).toBe(frames[0]);
  });

  test('keyboard focus steps through the frames like hover', async ({ page }) => {
    await loadHero(page);
    await page
      .locator('[tabindex="0"]')
      .filter({ has: portrait(page) })
      .focus();
    await expect.poll(() => frameOnShow(page)).not.toBe(frames[0]);
    await page.keyboard.press('Tab');
    await expect.poll(() => frameOnShow(page)).toBe(frames[0]);
  });

  test('no portrait image is requested after the first hover', async ({ page }) => {
    await loadHero(page);
    const requests: string[] = [];
    page.on('request', (request) => {
      if (portraitImages.test(new URL(request.url()).pathname)) requests.push(request.url());
    });
    await portrait(page).hover();
    await page.waitForTimeout(frames.length * 400 + 600);
    await page.mouse.move(10, 880);
    await portrait(page).hover();
    await page.waitForTimeout(1000);
    expect(requests).toEqual([]);
  });
});

test.describe('hero portrait with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('hovering keeps image 01', async ({ page }) => {
    await loadHero(page);
    await portrait(page).hover();
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(150);
      expect(await frameOnShow(page)).toBe(frames[0]);
    }
  });
});

const logoPath = (page: Page) =>
  page
    .getByRole('link', { name: navigation.logoLabel })
    .locator('svg path')
    .first()
    .getAttribute('d');

test.describe('nav logo at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('is the blob and monogram only, and its outline morphs on hover', async ({ page }) => {
    await page.goto('/Portfolio/');
    const logo = page.getByRole('link', { name: navigation.logoLabel });
    await expect(logo.locator('svg')).toHaveCount(1);
    const rest = await logoPath(page);
    await logo.hover();
    await page.waitForTimeout(600);
    expect(await logoPath(page)).not.toBe(rest);
  });
});

test.describe('nav logo with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('keeps its outline on hover', async ({ page }) => {
    await page.goto('/Portfolio/');
    const rest = await logoPath(page);
    await page.getByRole('link', { name: navigation.logoLabel }).hover();
    await page.waitForTimeout(600);
    expect(await logoPath(page)).toBe(rest);
  });
});
