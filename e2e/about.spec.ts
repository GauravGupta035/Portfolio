import { expect, test, type Page } from '@playwright/test';
import { aboutSection } from '../src/content/aboutSection.ts';
import { skillCategories } from '../src/content/skills.ts';

const section = (page: Page) => page.getByRole('region', { name: aboutSection.heading });
const cards = (page: Page) =>
  section(page).getByRole('list', { name: aboutSection.cardsLabel }).getByRole('article');

type Box = { left: number; right: number; top: number; bottom: number };

// Every card's box in the viewport and its rotation, read from the slot's
// `rotate` and the slot's and the card's transforms. `angle` is the slot's
// transform rotation in degrees.
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
        angle: slot
          ? (() => {
              const { a, b } = new DOMMatrix(getComputedStyle(slot).transform);
              return Math.round((Math.atan2(b, a) * 180) / Math.PI);
            })()
          : 0,
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

// The scroll position where the footer's top edge sits on the viewport's bottom edge.
const footerTopInView = (page: Page) =>
  page
    .locator('#contact')
    .evaluate((element) => Math.ceil(element.getBoundingClientRect().top + scrollY - innerHeight));

// The page's last scroll position, where the footer is fully in view.
const pageBottom = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollHeight - innerHeight);

async function load(page: Page) {
  await page.goto('/Portfolio/');
  await page.waitForLoadState('networkidle');
  await expect(cards(page)).toHaveCount(skillCategories.length);
  // Late enough for every section's scroll setup, including the experience pin above.
  await page.waitForTimeout(1000);
}

const overlaps = (a: Box, b: Box) =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

// The wall ends 48px from the viewport's right edge, give or take 8px.
function expectRightMargin(boxes: Box[], viewport: { width: number }) {
  const margin = viewport.width - (boxes.at(-1)?.right ?? 0);
  expect(margin).toBeGreaterThanOrEqual(40);
  expect(margin).toBeLessThanOrEqual(56);
}

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

  test('the cards start tilted beyond the right edge as the section enters', async ({ page }) => {
    await load(page);
    await scrollTo(page, await sectionEntry(page));
    const boxes = await settledBoxes(page);
    expect(boxes.at(-1)?.left).toBeGreaterThanOrEqual(viewport.width);
    expect(boxes.some((box) => box.angle !== 0 && box.right > viewport.width)).toBe(true);

    await scrollTo(page, await pageBottom(page));
    for (const box of await settledBoxes(page)) expect(box.angle).toBe(0);
  });
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]) {
  test.describe(`about at ${viewport.width}px`, () => {
    test.use({ viewport });

    test('the cards rest as an upright wall that fills the space once the footer reaches the viewport', async ({
      page,
    }) => {
      await load(page);
      const y = await footerTopInView(page);
      await scrollTo(page, y);
      const wall = await settledBoxes(page);
      expectWall(wall, viewport);
      expectRightMargin(wall, viewport);
      for (const box of wall) expect(box.upright).toBe(true);

      const sectionBottom = await section(page).evaluate((element) =>
        Math.round(element.getBoundingClientRect().bottom),
      );
      for (const box of wall) {
        expect(sectionBottom - box.bottom).toBeGreaterThanOrEqual(40);
        expect(sectionBottom - box.bottom).toBeLessThanOrEqual(56);
        expect(box.bottom - box.top).toBe(wall[0].bottom - wall[0].top);
      }

      const socialsEdge = await section(page)
        .getByRole('list', { name: aboutSection.socialsLabel })
        .evaluate((list) => list.parentElement?.getBoundingClientRect().right ?? 0);
      expect(wall[0].left - socialsEdge).toBeGreaterThanOrEqual(0);
      expect(wall[0].left - socialsEdge).toBeLessThanOrEqual(48);

      await scrollTo(page, await pageBottom(page));
      const later = await settledBoxes(page);
      expect(later.map((box) => box.left)).toEqual(wall.map((box) => box.left));
    });
  });
}

test.describe('about at 1024px', () => {
  const viewport = { width: 1024, height: 768 };
  test.use({ viewport });

  test('all five cards fit once the footer is fully in view', async ({ page }) => {
    await load(page);
    await scrollTo(page, await pageBottom(page));
    const wall = await settledBoxes(page);
    expectWall(wall, viewport);
    expectRightMargin(wall, viewport);
  });
});

test.describe('about with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('the cards are already in the wall and do not move on scroll', async ({ page }) => {
    await load(page);
    const entry = await sectionEntry(page);
    await scrollTo(page, entry);
    for (const box of await settledBoxes(page)) expect(box.upright).toBe(true);
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
    await scrollTo(page, await pageBottom(page));
    for (const box of await settledBoxes(page)) expect(box.upright).toBe(true);
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
