import { expect, test, type Page } from '@playwright/test';
import { posts } from '../src/content/posts.ts';

const cards = (page: Page) => page.getByRole('region', { name: 'Blog' }).getByRole('link');
const layerCanvas = (page: Page) => page.getByTestId('liquid-hover').locator('canvas');

// Skip the water intro so its canvas never counts, and record every canvas that gets a WebGL
// context.
async function prepare(page: Page) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('gg:intro-seen', '1');
    const contexts: HTMLCanvasElement[] = [];
    (window as unknown as { __webgl: HTMLCanvasElement[] }).__webgl = contexts;
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      const context = (getContext as (...args: unknown[]) => unknown).call(this, type, ...rest);
      if (context && type.startsWith('webgl') && !contexts.includes(this)) contexts.push(this);
      return context;
    } as typeof getContext;
  });
}

// WebGL contexts on canvases in the page, leaving out the throwaway feature probes.
const liveContexts = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __webgl: HTMLCanvasElement[] }).__webgl.filter(
        (canvas) => canvas.isConnected,
      ).length,
  );

// Each card's link is what sits under the pointer at its image, canvas or not.
async function expectCardsLink(page: Page) {
  await expect(cards(page)).toHaveCount(posts.length);
  for (const [index, post] of posts.entries()) {
    const card = cards(page).nth(index);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveAttribute('href', post.url);
    await expect(card).toHaveAttribute('target', '_blank');
    const hit = await card.locator('img').evaluate((image) => {
      const { left, top, width, height } = image.getBoundingClientRect();
      const element = document.elementFromPoint(left + width / 2, top + height / 2);
      return element?.closest('a')?.getAttribute('href');
    });
    expect(hit).toBe(post.url);
  }
}

test.describe('blog liquid hover at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('hover starts the ripple and leaving returns to the still image', async ({ page }) => {
    await prepare(page);
    await page.goto('/Portfolio/');
    const card = cards(page).first();
    await card.scrollIntoViewIfNeeded();
    await card.locator('img').hover();
    await expect(layerCanvas(page)).toHaveAttribute('data-rippling', 'true');
    await page.mouse.move(5, 5);
    // Settles within about 600ms of leaving.
    await expect(layerCanvas(page)).toHaveAttribute('data-rippling', 'false', { timeout: 1000 });
  });

  test('shares one WebGL context across every card', async ({ page }) => {
    await prepare(page);
    await page.goto('/Portfolio/');
    for (let index = 0; index < posts.length; index++) {
      const card = cards(page).nth(index);
      await card.scrollIntoViewIfNeeded();
      await card.locator('img').hover();
      await expect(layerCanvas(page)).toHaveAttribute('data-rippling', 'true');
    }
    await expect(page.locator('canvas')).toHaveCount(1);
    expect(await liveContexts(page)).toBe(1);
    await expectCardsLink(page);
  });

  test('keeps the shader out of the main chunk', async ({ page, request }) => {
    await page.goto('/Portfolio/');
    const main = await page.locator('script[type="module"][src]').first().getAttribute('src');
    if (!main) throw new Error('No main script');
    const source = await (await request.get(main)).text();
    expect(source).not.toContain('uStrength');
  });
});

async function expectStillCards(page: Page) {
  await page.goto('/Portfolio/');
  for (let index = 0; index < posts.length; index++) {
    const card = cards(page).nth(index);
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    // The dark-variant hover still works.
    await expect(card).toHaveCSS('background-color', 'rgb(1, 1, 1)');
  }
  await page.waitForTimeout(300);
  await expect(page.getByTestId('liquid-hover')).toHaveCount(0);
  await expect(page.locator('canvas')).toHaveCount(0);
  await expectCardsLink(page);
}

test.describe('blog liquid hover with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('creates no canvas and the cards still link', async ({ page }) => {
    await prepare(page);
    await expectStillCards(page);
  });
});

test.describe('blog liquid hover without WebGL', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('creates no canvas and the cards still link', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('gg:intro-seen', '1');
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
    await expectStillCards(page);
  });
});
