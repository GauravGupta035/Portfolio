import { expect, test, type Page } from '@playwright/test';
import { aboutSection } from '../src/content/aboutSection.ts';
import { skillCategories } from '../src/content/skills.ts';

const section = (page: Page) => page.getByRole('region', { name: aboutSection.heading });
const cards = (page: Page) =>
  section(page).getByRole('list', { name: aboutSection.cardsLabel }).getByRole('article');

// Every card's on-screen centre and rotation, the rotation read from the
// slot's `rotate` and the card's own transform.
const cardPoses = (page: Page) =>
  cards(page).evaluateAll((items) =>
    items.map((item) => {
      const { left, top, width, height } = item.getBoundingClientRect();
      const slot = item.parentElement;
      return {
        x: Math.round(left + width / 2),
        y: Math.round(top + height / 2 + scrollY),
        rotate: slot ? getComputedStyle(slot).rotate : '',
        transform: getComputedStyle(item).transform,
      };
    }),
  );

async function scrollToSection(page: Page, offset: number) {
  const top = await section(page).evaluate(
    (element) => element.getBoundingClientRect().top + scrollY,
  );
  await page.evaluate((y) => window.scrollTo(0, y), top + offset);
}

test.describe('about at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });

  test('downloads the CV from the CV button', async ({ page }) => {
    await page.goto('/Portfolio/');
    const cv = section(page).getByRole('link', { name: aboutSection.cvLabel });
    await cv.scrollIntoViewIfNeeded();
    const box = await cv.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(48);
    const [download] = await Promise.all([page.waitForEvent('download'), cv.click()]);
    expect(download.suggestedFilename()).toBe('Gaurav_Gupta_Resume.pdf');
  });

  test('moves the rail horizontally as the page scrolls', async ({ page }) => {
    await page.goto('/Portfolio/');
    await page.waitForLoadState('networkidle');
    await expect(cards(page)).toHaveCount(skillCategories.length);
    await scrollToSection(page, -600);
    await page.waitForTimeout(500);
    const before = await cardPoses(page);
    await scrollToSection(page, 300);
    await expect.poll(async () => (await cardPoses(page))[0].x).toBeLessThan(before[0].x - 100);
    const after = await cardPoses(page);
    // The rail moves as one piece: the gap between cards stays the same.
    expect(after[1].x - after[0].x).toBe(before[1].x - before[0].x);
  });

  test('shows the Figma pose a third of the way through the drift', async ({ page }) => {
    await page.goto('/Portfolio/');
    await page.waitForLoadState('networkidle');
    // Late enough for every section's scroll setup, including the experience pin above.
    await page.waitForTimeout(1000);
    // The drift runs over 1800px of scroll, from the section's top at the bottom of the
    // viewport, so a third of the way is its top 300px below the viewport top.
    await scrollToSection(page, -300);
    // The third card is upright and sits at 1038px in Figma.
    await expect
      .poll(async () =>
        cards(page)
          .nth(2)
          .evaluate((card) => Math.round(card.parentElement?.getBoundingClientRect().left ?? 0)),
      )
      .toBe(1038);
  });
});

test.describe('about with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('cards are upright and do not move on scroll', async ({ page }) => {
    await page.goto('/Portfolio/');
    await page.waitForLoadState('networkidle');
    await scrollToSection(page, -600);
    await page.waitForTimeout(500);
    const before = await cardPoses(page);
    expect(before).toHaveLength(skillCategories.length);
    for (const pose of before) {
      expect(pose.rotate).toBe('none');
      expect(pose.transform).toBe('none');
    }
    await scrollToSection(page, 300);
    await page.waitForTimeout(500);
    expect(await cardPoses(page)).toEqual(before);
  });
});

test.describe('about at 375px', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('cards are upright in a rail that scrolls sideways, with no page scroll', async ({
    page,
  }) => {
    await page.goto('/Portfolio/');
    await scrollToSection(page, 0);
    for (const pose of await cardPoses(page)) expect(pose.rotate).toBe('none');
    const rail = section(page).getByRole('list', { name: aboutSection.cardsLabel }).locator('..');
    const scroll = await rail.evaluate((element) => {
      element.scrollLeft = 200;
      return element.scrollLeft;
    });
    expect(scroll).toBeGreaterThan(0);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});
