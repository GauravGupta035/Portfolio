import { expect, test, type Page } from '@playwright/test';
import { profile } from '../src/content/profile.ts';

const loader = (page: Page) => page.getByTestId('intro-loader');
const heroName = (page: Page) => page.getByRole('heading', { level: 1 });

test.describe('water loader', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('shows the canvas on a first visit, then leaves the DOM', async ({ page }) => {
    await page.goto('/Portfolio/');
    await expect(loader(page)).toHaveAttribute('data-mode', 'water');
    await expect(loader(page).locator('canvas')).toBeAttached();
    // The hero is in the DOM underneath from the start.
    await expect(heroName(page)).toBeVisible();
    await expect(loader(page)).toHaveCount(0, { timeout: 3000 });
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('does not show again on a reload in the same session', async ({ page }) => {
    await page.goto('/Portfolio/');
    await expect(loader(page)).toHaveCount(0, { timeout: 3000 });
    await page.reload();
    await expect(heroName(page)).toBeVisible();
    await expect(loader(page)).toHaveCount(0);
    await page.waitForTimeout(300);
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('keeps three.js out of the main chunk', async ({ page, request }) => {
    await page.goto('/Portfolio/');
    const main = await page.locator('script[type="module"][src]').first().getAttribute('src');
    if (!main) throw new Error('No main script');
    const source = await (await request.get(main)).text();
    expect(source).not.toContain('WebGLRenderer');
  });
});

async function expectStaticIntro(page: Page) {
  const started = Date.now();
  await page.goto('/Portfolio/');
  await expect(heroName(page)).toBeVisible();
  await expect(page.getByRole('img', { name: profile.portrait.alt })).toBeVisible();
  // The plain fade is gone, so nothing sits over the hero.
  await expect(loader(page)).toHaveCount(0, { timeout: 500 });
  expect(Date.now() - started).toBeLessThan(1500);
  await page.waitForTimeout(300);
  await expect(page.locator('canvas')).toHaveCount(0);
}

test.describe('water loader with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('creates no canvas and shows the hero within 500ms', async ({ page }) => {
    await expectStaticIntro(page);
  });
});

test.describe('water loader without WebGL', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('creates no canvas and shows the hero within 500ms', async ({ page }) => {
    await page.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        type: string,
        ...rest: unknown[]
      ) {
        if (type.startsWith('webgl')) return null;
        return (getContext as (...args: unknown[]) => unknown).call(this, type, ...rest);
      } as typeof getContext;
    });
    await expectStaticIntro(page);
  });
});
