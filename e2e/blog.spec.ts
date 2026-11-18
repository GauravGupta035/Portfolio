import { expect, test, type Locator, type Page } from '@playwright/test';
import { posts } from '../src/content/posts.ts';

// The dark variant uses Neutral 950 for the card and Neutral 00 for its text.
const dark = { background: 'rgb(1, 1, 1)', color: 'rgb(245, 245, 243)' };

const cards = (page: Page) => page.getByRole('region', { name: 'Blog' }).getByRole('link');

async function expectDark(card: Locator) {
  await expect(card).toHaveCSS('background-color', dark.background);
  await expect(card).toHaveCSS('color', dark.color);
}

// Column count of the card grid, from the resolved track list.
const columns = (page: Page) =>
  page
    .getByRole('region', { name: 'Blog' })
    .getByRole('list')
    .evaluate((list) => getComputedStyle(list).gridTemplateColumns.split(' ').length);

test.describe('blog card states at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('shows both posts in order, the factory post second', async ({ page }) => {
    await page.goto('/Portfolio/');
    await expect(cards(page)).toHaveCount(2);
    await expect(cards(page).nth(1).getByRole('heading', { level: 3 })).toHaveText(
      'Test the factory before you trust it',
    );
    await expect(cards(page).nth(1).locator('img')).toHaveAttribute(
      'src',
      /images\/blog\/test-the-factory\.svg$/,
    );
  });

  for (const [index, post] of posts.entries()) {
    test(`hover shows the dark variant on "${post.title}"`, async ({ page }) => {
      await page.goto('/Portfolio/');
      const card = cards(page).nth(index);
      await card.scrollIntoViewIfNeeded();
      await expect(card).not.toHaveCSS('background-color', dark.background);
      await card.hover();
      await expectDark(card);
    });

    test(`keyboard focus shows the dark variant on "${post.title}"`, async ({ page }) => {
      await page.goto('/Portfolio/');
      const card = cards(page).nth(index);
      // Tab from the link just before the card so focus arrives by keyboard.
      await card.evaluate((element) => {
        const links = Array.from(document.querySelectorAll('a'));
        links[links.indexOf(element as HTMLAnchorElement) - 1]?.focus();
      });
      await page.keyboard.press('Tab');
      await expect(card).toBeFocused();
      await expectDark(card);
    });
  }

  test('the factory image loads at the card ratio', async ({ page }) => {
    await page.goto('/Portfolio/');
    const image = cards(page).nth(1).locator('img');
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    const ratio = await image.evaluate(
      (img: HTMLImageElement) => img.naturalWidth / img.naturalHeight,
    );
    expect(ratio).toBeCloseTo(660 / 528, 3);
  });
});

for (const [width, count] of [
  [1440, 3],
  [768, 2],
  [375, 1],
] as const) {
  test.describe(`blog at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test(`lays the cards out in ${count} column${count > 1 ? 's' : ''}`, async ({ page }) => {
      await page.goto('/Portfolio/');
      await expect(cards(page)).toHaveCount(2);
      expect(await columns(page)).toBe(count);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  });
}
