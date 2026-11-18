import { expect, test, type Page } from '@playwright/test';
import { contactSection } from '../src/content/contactSection.ts';
import { navigation } from '../src/content/navigation.ts';

const footer = (page: Page) => page.getByRole('contentinfo');
const links = (page: Page) =>
  footer(page).getByRole('list', { name: contactSection.linksLabel }).getByRole('link');

async function showFooter(page: Page) {
  await page.goto('/Portfolio/');
  await footer(page).scrollIntoViewIfNeeded();
  await expect(footer(page)).toBeInViewport();
}

test.describe('footer at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('has no "Get in touch" heading or tag cloud', async ({ page }) => {
    await page.goto('/Portfolio/');
    await expect(page.getByRole('heading', { name: 'Get in touch' })).toHaveCount(0);
    // The only list left in the footer is the link row.
    await expect(footer(page).getByRole('list')).toHaveCount(1);
    await expect(footer(page).getByRole('listitem')).toHaveCount(5);
  });

  test('links are regular weight with each arrow beside and centred on its label', async ({
    page,
  }) => {
    await showFooter(page);
    await expect(links(page)).toHaveText([
      'Email',
      'LinkedIn',
      'GitHub',
      'Medium',
      navigation.cvLabel,
    ]);
    for (const link of await links(page).all()) {
      const { weight, gap, offset } = await link.evaluate((element) => {
        const label = element.querySelector('span')?.getBoundingClientRect();
        const arrow = element.querySelector('svg')?.getBoundingClientRect();
        if (!label || !arrow) throw new Error('link is missing its label or arrow');
        return {
          weight: Number(getComputedStyle(element).fontWeight),
          gap: arrow.left - label.right,
          offset: arrow.top + arrow.height / 2 - (label.top + label.height / 2),
        };
      });
      expect(weight).toBeLessThan(600);
      expect(gap).toBeGreaterThanOrEqual(0);
      expect(gap).toBeLessThanOrEqual(8);
      expect(Math.abs(offset)).toBeLessThanOrEqual(1);
    }
  });

  test('is a slim footer at the end of the page', async ({ page }) => {
    await showFooter(page);
    const { height, bottom, scrollHeight } = await footer(page).evaluate((element) => {
      const box = element.getBoundingClientRect();
      return {
        height: box.height,
        bottom: box.bottom + scrollY,
        scrollHeight: document.documentElement.scrollHeight,
      };
    });
    expect(height).toBeLessThanOrEqual(140);
    expect(Math.round(bottom)).toBe(scrollHeight);
  });
});

test.describe('footer with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('nothing in the footer animates', async ({ page }) => {
    await showFooter(page);
    await links(page).first().hover();
    const animated = await footer(page).evaluate(
      (element) =>
        [element, ...element.querySelectorAll('*')].filter((node) => {
          const style = getComputedStyle(node);
          const moving = (value: string) => value.split(',').some((part) => parseFloat(part) > 0);
          return moving(style.transitionDuration) || moving(style.animationDuration);
        }).length,
    );
    expect(animated).toBe(0);
    expect(
      await footer(page).evaluate((element) => element.getAnimations({ subtree: true }).length),
    ).toBe(0);
  });
});

test.describe('footer at 375px', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('shows every link with no horizontal scroll', async ({ page }) => {
    await showFooter(page);
    await expect(links(page)).toHaveCount(5);
    for (const link of await links(page).all()) {
      await expect(link).toBeInViewport({ ratio: 1 });
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});
