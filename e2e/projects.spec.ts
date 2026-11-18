import { expect, test, type Page } from '@playwright/test';
import { projectsSection } from '../src/content/projectsSection.ts';
import { projects } from '../src/content/projects.ts';

// The bar is the heading row above the index; the range is its last child.
const bar = (page: Page) => page.getByRole('region', { name: 'Projects' }).locator('header');

// Horizontal overflow inside the bar, and between the bar and the page.
const barOverflow = (page: Page) =>
  bar(page).evaluate(
    (header) =>
      header.scrollWidth -
      header.clientWidth +
      Math.max(0, header.getBoundingClientRect().right - document.documentElement.clientWidth),
  );

test.describe('projects index', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('shows the range in violet, aligned to the right edge of the bar', async ({ page }) => {
    await page.goto('/Portfolio/');
    const range = bar(page).getByText(projectsSection.range, { exact: true });
    await expect(range).toHaveText('‘25 - ’26');
    await expect(bar(page)).not.toContainText('21');
    // Accent/Primary on the light surface is Violet 500.
    await expect(range).toHaveCSS('color', 'rgb(98, 69, 245)');
    const [rangeBox, barBox] = await Promise.all([range.boundingBox(), bar(page).boundingBox()]);
    expect(
      Math.abs(
        (rangeBox?.x ?? 0) + (rangeBox?.width ?? 0) - (barBox?.x ?? 0) - (barBox?.width ?? 0),
      ),
    ).toBeLessThanOrEqual(1);
    expect(await barOverflow(page)).toBeLessThanOrEqual(0);
  });

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

  test('shows the range without overflowing the bar', async ({ page }) => {
    await page.goto('/Portfolio/');
    await expect(bar(page).getByText(projectsSection.range, { exact: true })).toBeVisible();
    await expect(bar(page)).not.toContainText('21');
    expect(await barOverflow(page)).toBeLessThanOrEqual(0);
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

  test('gives each project link a tap area at least 44px tall without overlaps', async ({
    page,
  }) => {
    await page.goto('/Portfolio/');
    const labels = Object.values(projectsSection.linkLabels).join('|');
    const links = page
      .getByRole('article')
      .getByRole('link', { name: new RegExp(`^(${labels}),`) });
    await expect(links).toHaveCount(projects.filter((project) => project.link).length);
    // Page coordinates, so links in different blocks compare without scrolling.
    const boxes = await links.evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return {
          top: box.top + scrollY,
          bottom: box.bottom + scrollY,
          left: box.left,
          right: box.right,
        };
      }),
    );
    for (const box of boxes) expect(box.bottom - box.top).toBeGreaterThanOrEqual(44);
    for (const [index, a] of boxes.entries())
      for (const b of boxes.slice(index + 1))
        expect(a.top < b.bottom && b.top < a.bottom && a.left < b.right && b.left < a.right).toBe(
          false,
        );
  });
});
