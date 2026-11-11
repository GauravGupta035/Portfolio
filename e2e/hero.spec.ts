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

test.describe('hero portrait at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('hovering steps through 01 to 05 and back to 01', async ({ page }) => {
    await loadHero(page);
    await portrait(page).hover();
    const seen = [await frameOnShow(page)];
    const started = Date.now();
    while (seen.length < frames.length + 1 && Date.now() - started < 4000) {
      const current = await frameOnShow(page);
      if (current !== seen[seen.length - 1]) seen.push(current);
      await page.waitForTimeout(40);
    }
    expect(seen).toEqual([...frames, frames[0]]);
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

test.describe('nav logo at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  // The arrow's top-right corner, in the logo shape's viewBox units, and whether it is on the
  // outline: inside the fill, with a point just beyond it outside.
  const arrowTip = (page: Page) =>
    page.getByRole('link', { name: navigation.logoLabel }).evaluate((link) => {
      const [shape, arrow] = Array.from(link.querySelectorAll('svg'));
      const path = shape.querySelector('path') as SVGPathElement;
      const box = shape.getBoundingClientRect();
      const { width, height } = shape.viewBox.baseVal;
      const tip = arrow.getBoundingClientRect();
      const toShape = (x: number, y: number) =>
        new DOMPoint(((x - box.left) / box.width) * width, ((y - box.top) / box.height) * height);
      return {
        onBorder:
          path.isPointInFill(toShape(tip.right - 0.3, tip.top + 0.3)) &&
          !path.isPointInFill(toShape(tip.right + 1, tip.top - 1)),
        path: path.getAttribute('d'),
      };
    });

  test('the arrow tip sits on the shape border at rest and on hover', async ({ page }) => {
    await page.goto('/Portfolio/');
    const rest = await arrowTip(page);
    expect(rest.onBorder).toBe(true);
    await page.getByRole('link', { name: navigation.logoLabel }).hover();
    await page.waitForTimeout(600);
    const hover = await arrowTip(page);
    expect(hover.path).not.toBe(rest.path);
    expect(hover.onBorder).toBe(true);
  });
});
