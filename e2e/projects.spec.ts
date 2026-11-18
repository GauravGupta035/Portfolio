import { expect, test } from '@playwright/test';
import { projects } from '../src/content/projects.ts';

test.describe('projects index', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('lists the four projects newest first', async ({ page }) => {
    await page.goto('/Portfolio/');
    const rows = page.getByRole('region', { name: 'Projects' }).getByRole('listitem');
    await expect(rows).toHaveCount(4);
    for (const [index, name] of [
      'Jot',
      'nimble-triage',
      'Primaros',
      'Interview Preparation Agent',
    ].entries()) {
      await expect(rows.nth(index).getByRole('link')).toHaveAccessibleName(new RegExp(`^${name}`));
    }
    await expect(page.getByText(/GenieSpeaks|Plagiarism Detector/)).toHaveCount(0);
  });

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
        .poll(() =>
          // A block can sit a fraction of a pixel above the edge, which rounds to -0.
          block.evaluate((element) => Math.abs(Math.round(element.getBoundingClientRect().top))),
        )
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
