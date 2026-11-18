import { expect, test, type Page } from '@playwright/test';
import { experiences } from '../src/content/experience.ts';

const total = String(experiences.length).padStart(2, '0');
const reading = (index: number) => `${String(index + 1).padStart(2, '0')}/${total}`;

// The pin spacer stays in flow while the section itself is fixed, so measure from it.
const pinStart = (page: Page) =>
  page.evaluate(() => {
    const spacer = document.getElementById('experience')?.parentElement;
    return spacer ? spacer.getBoundingClientRect().top + window.scrollY : 0;
  });

// The indicator on whichever card is painted on top at a point in the card area.
const visibleReading = (page: Page) =>
  page.evaluate(
    () =>
      document
        .elementFromPoint(window.innerWidth / 2, window.innerHeight / 3)
        ?.closest('article')
        ?.querySelector('p span[aria-hidden="true"]')?.textContent,
  );

async function expectCardsInNormalFlow(page: Page) {
  // Give the lazily loaded scroll code every chance to pin before checking.
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  const cards = page.locator('#experience').getByRole('article');
  await expect(cards).toHaveCount(experiences.length);
  let previousBottom = -Infinity;
  for (const card of await cards.all()) {
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeInViewport();
    const box = await card.boundingBox();
    const top = await card.evaluate((element) => element.getBoundingClientRect().top + scrollY);
    expect(top).toBeGreaterThanOrEqual(previousBottom - 1);
    previousBottom = top + (box?.height ?? 0);
  }
}

// Scrolls through every pinned card step, half way into each transition and
// then to the step itself, and hands each settled step to the check.
async function stepThroughPin(page: Page, check: (index: number) => Promise<void>) {
  await page.goto('/Portfolio/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#experience')).toHaveAttribute('data-pinned', '');
  const height = page.viewportSize()?.height ?? 0;
  for (let index = 0; index < experiences.length; index++) {
    for (const offset of index ? [-0.4, 0] : [0]) {
      const top = await pinStart(page);
      await page.evaluate((y) => window.scrollTo(0, y), top + (index + offset) * height);
      if (!offset) {
        await expect.poll(() => visibleReading(page)).toBe(reading(index));
        await check(index);
      }
    }
  }
}

// The card painted on top of the stack at the given step.
const topCard = (page: Page, index: number) =>
  page.locator('#experience').getByRole('article').nth(index);

test.describe('experience at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('keeps the heading fixed at the top, above the card on top', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 2, name: 'Experience' });
    const headingTops: number[] = [];
    await stepThroughPin(page, async (index) => {
      const headingBox = await heading.boundingBox();
      const cardBox = await topCard(page, index).boundingBox();
      headingTops.push(Math.round(headingBox?.y ?? -1));
      expect((headingBox?.y ?? 0) + (headingBox?.height ?? 0)).toBeLessThanOrEqual(
        cardBox?.y ?? -1,
      );
    });
    await expect(heading).toBeInViewport();
    expect(new Set(headingTops).size).toBe(1);
    expect(headingTops[0]).toBeGreaterThanOrEqual(0);
    expect(headingTops[0]).toBeLessThan(900 / 2);
  });
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
]) {
  test.describe(`experience at ${viewport.width} x ${viewport.height}`, () => {
    test.use({ viewport });

    test('shows the whole top card and its indicator at every step', async ({ page }) => {
      await stepThroughPin(page, async (index) => {
        const card = topCard(page, index);
        const clipped = await card.evaluate((article) => {
          const area = article.closest('ol')?.getBoundingClientRect();
          if (!area) return ['no card area'];
          const bottom = Math.min(area.bottom, window.innerHeight);
          const parts = article.querySelectorAll('h3, p, li');
          return Array.from(parts)
            .filter((part) => {
              const box = part.getBoundingClientRect();
              return box.height > 0 && (box.top < area.top - 0.5 || box.bottom > bottom + 0.5);
            })
            .map((part) => part.textContent ?? '');
        });
        expect(clipped).toEqual([]);
        await expect(card.getByText(reading(index))).toBeInViewport({ ratio: 1 });
      });
    });
  });
}

test.describe('experience with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('does not pin and shows every card in normal flow', async ({ page }) => {
    await page.goto('/Portfolio/');
    await expectCardsInNormalFlow(page);
  });
});

test.describe('experience at 375px', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('does not pin and has no horizontal scroll', async ({ page }) => {
    await page.goto('/Portfolio/');
    await expectCardsInNormalFlow(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});
