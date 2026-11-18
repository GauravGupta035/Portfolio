import { expect, test, type Page } from '@playwright/test';
import { aboutSection } from '../src/content/aboutSection.ts';
import { skillCategories } from '../src/content/skills.ts';

const section = (page: Page) => page.getByRole('region', { name: aboutSection.heading });
const ledger = (page: Page) =>
  section(page).getByRole('list', { name: aboutSection.skillsLabel, exact: true });

// Every row's label box, tag list box and tag boxes in the viewport, plus whether
// any tag clips its own text.
const rowBoxes = (page: Page) =>
  ledger(page).evaluate((list) =>
    Array.from(list.children).map((row) => {
      const box = (element: Element) => {
        const { left, right, top, bottom } = element.getBoundingClientRect();
        return { left, right, top, bottom };
      };
      const label = row.querySelector('h3');
      const tags = row.querySelector('ul');
      return {
        row: box(row),
        label: label ? box(label) : null,
        tags: tags ? box(tags) : null,
        tagBoxes: tags ? Array.from(tags.children).map(box) : [],
        tagClipped: tags
          ? Array.from(tags.children).some(
              (tag) => tag.scrollWidth > tag.clientWidth || tag.scrollHeight > tag.clientHeight,
            )
          : true,
      };
    }),
  );

// Each row's opacity, visibility and transform.
const rowStyles = (page: Page) =>
  ledger(page).evaluate((list) =>
    Array.from(list.children).map((row) => {
      const style = getComputedStyle(row);
      return { opacity: style.opacity, visibility: style.visibility, transform: style.transform };
    }),
  );

const horizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

async function scrollTo(page: Page, y: number) {
  await page.evaluate((target) => window.scrollTo(0, target), y);
  await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(Math.round(y));
}

const pageBottom = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollHeight - innerHeight);

async function load(page: Page) {
  await page.goto('/Portfolio/');
  await page.waitForLoadState('networkidle');
  // Rows waiting to be revealed are hidden from the accessibility tree, so count the elements.
  await expect(ledger(page).locator(':scope > li > h3')).toHaveCount(skillCategories.length);
  // Late enough for every section's scroll setup, including the experience pin above.
  await page.waitForTimeout(1000);
}

test.describe('about at 1440px', () => {
  const viewport = { width: 1440, height: 900 };
  test.use({ viewport, acceptDownloads: true });

  test('downloads the CV from the CV button', async ({ page }) => {
    await page.goto('/Portfolio/');
    const cv = section(page).getByRole('link', { name: aboutSection.cvLabel });
    await cv.scrollIntoViewIfNeeded();
    const box = await cv.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(48);
    const [download] = await Promise.all([page.waitForEvent('download'), cv.click()]);
    expect(download.suggestedFilename()).toBe('Gaurav_Gupta_Resume.pdf');
  });

  test('each label sits left of its tags, rows do not overlap and no tag is clipped', async ({
    page,
  }) => {
    await load(page);
    await scrollTo(page, await pageBottom(page));
    const rows = await rowBoxes(page);
    expect(rows).toHaveLength(skillCategories.length);
    rows.forEach(({ row, label, tags, tagBoxes, tagClipped }, index) => {
      if (!label || !tags) throw new Error(`row ${index} is missing its label or tags`);
      expect(label.right).toBeLessThanOrEqual(tags.left);
      // The label column is about one third of the row.
      expect(tags.left - row.left).toBeGreaterThan((row.right - row.left) / 4);
      expect(tags.left - row.left).toBeLessThan((row.right - row.left) / 2);
      expect(tagClipped).toBe(false);
      for (const tag of tagBoxes) {
        expect(tag.left).toBeGreaterThanOrEqual(tags.left - 0.5);
        expect(tag.right).toBeLessThanOrEqual(Math.min(tags.right, viewport.width) + 0.5);
        expect(tag.bottom).toBeLessThanOrEqual(row.bottom + 0.5);
      }
      if (index > 0) expect(row.top).toBeGreaterThanOrEqual(rows[index - 1].row.bottom - 0.5);
    });
  });

  test('the header and ledger share the page margin with no empty left column', async ({
    page,
  }) => {
    await load(page);
    await section(page).scrollIntoViewIfNeeded();
    const {
      heading,
      ledger: list,
      sectionLeft,
    } = await section(page).evaluate((element) => {
      const left = (selector: string) =>
        element.querySelector(selector)?.getBoundingClientRect().left ?? NaN;
      return {
        heading: left('h2'),
        ledger: left('ul'),
        sectionLeft: element.getBoundingClientRect().left,
      };
    });
    expect(Math.abs(heading - list)).toBeLessThanOrEqual(1);
    // The 50px page margin, not a 120px social column.
    expect(heading - sectionLeft).toBeLessThanOrEqual(51);
    await expect(section(page).getByRole('link')).toHaveCount(1);
  });

  test('rows start hidden and are revealed as they scroll into view', async ({ page }) => {
    await load(page);
    for (const { opacity } of await rowStyles(page)) expect(opacity).toBe('0');
    await scrollTo(page, await pageBottom(page));
    await expect
      .poll(async () => (await rowStyles(page)).every(({ opacity }) => opacity === '1'))
      .toBe(true);
    for (const { visibility, transform } of await rowStyles(page)) {
      expect(visibility).toBe('visible');
      expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform);
    }
  });
});

test.describe('about with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('every row is fully visible with no transform at any scroll position', async ({ page }) => {
    await load(page);
    const bottom = await pageBottom(page);
    for (const y of [0, bottom / 2, bottom - 900, bottom]) {
      await scrollTo(page, Math.max(0, Math.round(y)));
      for (const { opacity, visibility, transform } of await rowStyles(page)) {
        expect(opacity).toBe('1');
        expect(visibility).toBe('visible');
        expect(transform).toBe('none');
      }
    }
  });
});

for (const width of [375, 768, 1024, 1440]) {
  test.describe(`about at ${width}px`, () => {
    test.use({ viewport: { width, height: 812 } });

    test('the page has no horizontal overflow', async ({ page }) => {
      await load(page);
      await section(page).scrollIntoViewIfNeeded();
      expect(await horizontalOverflow(page)).toBe(0);
      await scrollTo(page, await pageBottom(page));
      expect(await horizontalOverflow(page)).toBe(0);
    });
  });
}

test.describe('about at 375px', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('each label sits above its tags', async ({ page }) => {
    await load(page);
    for (const { label, tags } of await rowBoxes(page)) {
      if (!label || !tags) throw new Error('a row is missing its label or tags');
      expect(label.bottom).toBeLessThanOrEqual(tags.top + 0.5);
    }
  });

  test('no category heading breaks inside a word', async ({ page }) => {
    await load(page);
    const headings = await ledger(page)
      .locator(':scope > li > h3')
      .evaluateAll((elements) =>
        elements.map((heading) => {
          // A word that wraps inside itself spans more than one line box.
          const range = document.createRange();
          const text = heading.firstChild;
          const words: { word: string; lines: number }[] = [];
          if (text?.nodeType === Node.TEXT_NODE) {
            const content = text.textContent ?? '';
            for (const match of content.matchAll(/\S+/g)) {
              range.setStart(text, match.index);
              range.setEnd(text, match.index + match[0].length);
              const tops = new Set(
                Array.from(range.getClientRects()).map((rect) => Math.round(rect.top)),
              );
              words.push({ word: match[0], lines: tops.size });
            }
          }
          return { fits: heading.scrollWidth <= heading.clientWidth, words };
        }),
      );
    expect(headings).toHaveLength(skillCategories.length);
    for (const { fits, words } of headings) {
      expect(fits).toBe(true);
      for (const { word, lines } of words) expect(lines, word).toBe(1);
    }
  });
});
