import { expect, test, type Page } from '@playwright/test';
import { aboutSection } from '../src/content/aboutSection.ts';
import { contactSection } from '../src/content/contactSection.ts';
import { skillCategories } from '../src/content/skills.ts';

const section = (page: Page) => page.getByRole('region', { name: aboutSection.heading });
const cards = (page: Page) =>
  section(page).getByRole('list', { name: aboutSection.cardsLabel }).getByRole('article');

type Box = { left: number; right: number; top: number; bottom: number };

// Every card's box in the viewport and its rotation, read from the slot's
// `rotate` and the slot's and the card's transforms.
const cardBoxes = (page: Page) =>
  cards(page).evaluateAll((items) =>
    items.map((item) => {
      const { left, right, top, bottom } = item.getBoundingClientRect();
      const slot = item.parentElement;
      const turns = [
        slot ? getComputedStyle(slot).rotate : 'none',
        getComputedStyle(item).rotate,
        new DOMMatrix(slot ? getComputedStyle(slot).transform : 'none').b,
        new DOMMatrix(getComputedStyle(item).transform).b,
      ];
      return {
        left: Math.round(left),
        right: Math.round(right),
        top: Math.round(top),
        bottom: Math.round(bottom),
        upright: turns[0] === 'none' && turns[1] === 'none' && turns[2] === 0 && turns[3] === 0,
      };
    }),
  );

// Waits for the cards to stop moving, since Lenis eases every scroll.
async function settledBoxes(page: Page) {
  let previous = '';
  await expect
    .poll(async () => {
      const current = JSON.stringify(await cardBoxes(page));
      const settled = current === previous;
      previous = current;
      return settled;
    })
    .toBe(true);
  return JSON.parse(previous) as Awaited<ReturnType<typeof cardBoxes>>;
}

async function scrollTo(page: Page, y: number) {
  await page.evaluate((target) => window.scrollTo(0, target), y);
  await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(Math.round(y));
}

// The scroll position where the section's top sits at the bottom of the viewport.
const sectionEntry = (page: Page) =>
  section(page).evaluate((element) => element.getBoundingClientRect().top + scrollY - innerHeight);

// The scroll position where the contact heading's bottom sits on the viewport's bottom edge.
const contactHeadingInView = (page: Page) =>
  page
    .getByRole('heading', { name: contactSection.heading })
    .evaluate((element) =>
      Math.ceil(element.getBoundingClientRect().bottom + scrollY - innerHeight),
    );

async function load(page: Page) {
  await page.goto('/Portfolio/');
  await page.waitForLoadState('networkidle');
  await expect(cards(page)).toHaveCount(skillCategories.length);
  // Late enough for every section's scroll setup, including the experience pin above.
  await page.waitForTimeout(1000);
}

const overlaps = (a: Box, b: Box) =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

function expectWall(boxes: Box[], viewport: { width: number; height: number }) {
  expect(boxes).toHaveLength(skillCategories.length);
  for (const box of boxes) {
    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.top).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(viewport.width);
    expect(box.bottom).toBeLessThanOrEqual(viewport.height);
  }
  for (let i = 1; i < boxes.length; i++) {
    // Content order runs left to right.
    expect(boxes[i].left).toBeGreaterThanOrEqual(boxes[i - 1].right);
    for (let j = 0; j < i; j++) expect(overlaps(boxes[i], boxes[j])).toBe(false);
  }
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

  test('the cards start beyond the right edge as the section enters', async ({ page }) => {
    await load(page);
    await scrollTo(page, await sectionEntry(page));
    const boxes = await settledBoxes(page);
    expect(boxes.at(-1)?.left).toBeGreaterThanOrEqual(viewport.width);
  });

  test('the cards rest as an upright wall once the contact heading is in view', async ({
    page,
  }) => {
    await load(page);
    const y = await contactHeadingInView(page);
    await scrollTo(page, y);
    const wall = await settledBoxes(page);
    expectWall(wall, viewport);
    for (const box of wall) expect(box.upright).toBe(true);

    const socialsEdge = await section(page)
      .getByRole('list', { name: aboutSection.socialsLabel })
      .evaluate((list) => list.parentElement?.getBoundingClientRect().right ?? 0);
    expect(wall[0].left - socialsEdge).toBeGreaterThanOrEqual(0);
    expect(wall[0].left - socialsEdge).toBeLessThanOrEqual(48);

    await scrollTo(page, y + 300);
    const later = await settledBoxes(page);
    expect(later.map((box) => box.left)).toEqual(wall.map((box) => box.left));
  });
});

test.describe('about at 1024px', () => {
  const viewport = { width: 1024, height: 768 };
  test.use({ viewport });

  test('all five cards fit once the contact heading is in view', async ({ page }) => {
    await load(page);
    await scrollTo(page, await contactHeadingInView(page));
    expectWall(await settledBoxes(page), viewport);
  });
});

test.describe('about with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('the cards are already in the wall and do not move on scroll', async ({ page }) => {
    await load(page);
    const entry = await sectionEntry(page);
    await scrollTo(page, entry + 100);
    const before = await settledBoxes(page);
    expect(before).toHaveLength(skillCategories.length);
    for (const box of before) expect(box.upright).toBe(true);
    // In the wall: the last card ends inside the viewport, not past its right edge.
    expect(before.at(-1)?.right).toBeLessThanOrEqual(1440);
    await scrollTo(page, entry + 500);
    const after = await settledBoxes(page);
    // Only the page scrolls: every card moves up by the same 400px and not sideways.
    expect(after).toEqual(
      before.map((box) => ({ ...box, top: box.top - 400, bottom: box.bottom - 400 })),
    );
  });
});

test.describe('about at 375px', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('cards are upright in a rail that scrolls sideways, with no page scroll', async ({
    page,
  }) => {
    await page.goto('/Portfolio/');
    await section(page).scrollIntoViewIfNeeded();
    for (const box of await cardBoxes(page)) expect(box.upright).toBe(true);
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
