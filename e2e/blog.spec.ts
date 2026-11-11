import { expect, test, type Locator, type Page } from '@playwright/test';
import { posts } from '../src/content/posts.ts';

// The dark variant uses Neutral 950 for the card and Neutral 00 for its text.
const dark = { background: 'rgb(1, 1, 1)', color: 'rgb(245, 245, 243)' };

const firstCard = (page: Page) =>
  page.getByRole('region', { name: 'Blog' }).getByRole('link', { name: posts[0].title });

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

  test('hover shows the dark variant', async ({ page }) => {
    await page.goto('/Portfolio/');
    const card = firstCard(page);
    await card.scrollIntoViewIfNeeded();
    await expect(card).not.toHaveCSS('background-color', dark.background);
    await card.hover();
    await expectDark(card);
  });

  test('keyboard focus shows the dark variant', async ({ page }) => {
    await page.goto('/Portfolio/');
    const card = firstCard(page);
    // Tab from the link just before the card so focus arrives by keyboard.
    await card.evaluate((element) => {
      const links = Array.from(document.querySelectorAll('a'));
      links[links.indexOf(element as HTMLAnchorElement) - 1]?.focus();
    });
    await page.keyboard.press('Tab');
    await expect(card).toBeFocused();
    await expectDark(card);
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
      expect(await columns(page)).toBe(count);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  });
}
