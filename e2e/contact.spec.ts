import { expect, test, type Page } from '@playwright/test';
import { contactSection } from '../src/content/contactSection.ts';

const section = (page: Page) => page.getByRole('region', { name: contactSection.heading });
const tags = (page: Page) =>
  section(page).getByRole('list', { name: contactSection.tagsLabel }).getByRole('listitem');

// Every tag's on-screen top-left corner, rounded to the pixel.
const tagPositions = (page: Page) =>
  tags(page).evaluateAll((items) =>
    items.map((item) => {
      const { left, top } = item.getBoundingClientRect();
      return `${Math.round(left)},${Math.round(top)}`;
    }),
  );

async function showSection(page: Page) {
  await page.goto('/Portfolio/');
  await section(page).scrollIntoViewIfNeeded();
  await expect(section(page)).toBeInViewport();
}

test.describe('contact at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('tags drift without input', async ({ page }) => {
    await showSection(page);
    const before = await tagPositions(page);
    await page.waitForTimeout(2000);
    const after = await tagPositions(page);
    expect(after).toHaveLength(contactSection.tags.length);
    expect(after.filter((position, index) => position !== before[index]).length).toBeGreaterThan(0);
  });

  test('tags stay clear of the heading while the pointer moves across them', async ({ page }) => {
    await showSection(page);
    const heading = await section(page).getByRole('heading', { level: 2 }).boundingBox();
    expect(heading).not.toBeNull();
    if (!heading) return;
    for (let step = 0; step < 40; step++) {
      const x = heading.x + ((step * 97) % heading.width);
      const y = heading.y + heading.height + 10 + ((step * 53) % 200);
      await page.mouse.move(x, y, { steps: 4 });
      const overlaps = await tags(page).evaluateAll(
        (items, box) =>
          items.filter((item) => {
            const rect = item.getBoundingClientRect();
            return (
              rect.top < box.y + box.height - 0.5 &&
              rect.bottom > box.y &&
              rect.left < box.x + box.width &&
              rect.right > box.x
            );
          }).length,
        heading,
      );
      expect(overlaps).toBe(0);
    }
  });
});

test.describe('contact with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('tags stay at their positions', async ({ page }) => {
    await showSection(page);
    const before = await tagPositions(page);
    await page.mouse.move(720, 450);
    await page.waitForTimeout(2000);
    expect(await tagPositions(page)).toEqual(before);
  });
});

test.describe('contact at 375px', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('lists the tags under the heading with no horizontal scroll', async ({ page }) => {
    await showSection(page);
    const headingBottom = await section(page)
      .getByRole('heading', { level: 2 })
      .evaluate((element) => element.getBoundingClientRect().bottom);
    for (const tag of await tags(page).all()) {
      const box = await tag.boundingBox();
      expect(box?.y ?? 0).toBeGreaterThanOrEqual(headingBottom);
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});
