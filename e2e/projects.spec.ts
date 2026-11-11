import { expect, test } from '@playwright/test';
import { projects } from '../src/content/projects.ts';

test.describe('projects index', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const project of projects) {
    test(`"${project.name}" row scrolls its detail block into view`, async ({ page }) => {
      await page.goto('/Portfolio/');
      await page
        .getByRole('region', { name: 'Projects' })
        .getByRole('link', { name: new RegExp(`^${project.name}`) })
        .click();
      await expect(page).toHaveURL(new RegExp(`#project-${project.id}$`));
      const block = page.getByRole('article', { name: project.name });
      await expect
        .poll(() => block.evaluate((element) => Math.round(element.getBoundingClientRect().top)))
        .toBe(0);
      await expect(block).toBeInViewport();
    });
  }
});

test.describe('projects at 375px', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('has no horizontal scroll', async ({ page }) => {
    await page.goto('/Portfolio/');
    await page
      .getByRole('article', { name: projects[projects.length - 1].name })
      .scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });

  test('stacks each block in one column with the tech rail as a row under it', async ({ page }) => {
    await page.goto('/Portfolio/');
    for (const project of projects) {
      const block = page.getByRole('article', { name: project.name });
      const rail = block.getByRole('list', { name: new RegExp(project.name) });
      const [blockBox, railBox, description] = await Promise.all([
        block.boundingBox(),
        rail.boundingBox(),
        block.getByText(project.description).boundingBox(),
      ]);
      expect(railBox && description && railBox.y).toBeGreaterThan(
        (description?.y ?? 0) + (description?.height ?? 0),
      );
      expect(railBox?.width).toBeGreaterThan(railBox?.height ?? 0);
      expect((railBox?.x ?? 0) + (railBox?.width ?? 0)).toBeLessThanOrEqual(
        (blockBox?.x ?? 0) + (blockBox?.width ?? 0),
      );
    }
  });
});
