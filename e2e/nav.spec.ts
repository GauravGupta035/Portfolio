import { expect, test } from '@playwright/test';
import { navigation } from '../src/content/navigation.ts';

test.describe('desktop nav', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const { label, sectionId } of navigation.links) {
    test(`"${label}" scrolls to #${sectionId}`, async ({ page }) => {
      await page.goto('/Portfolio/');
      await page
        .getByRole('navigation', { name: 'Main' })
        .getByRole('link', { name: label })
        .click();
      await expect(page).toHaveURL(new RegExp(`#${sectionId}$`));
      const section = page.locator(`#${sectionId}`);
      await expect
        .poll(() => section.evaluate((element) => Math.round(element.getBoundingClientRect().top)))
        .toBe(0);
    });
  }

  test('every nav link is reachable by Tab with a visible focus ring', async ({ page }) => {
    await page.goto('/Portfolio/');
    const nav = page.getByRole('navigation', { name: 'Main' });
    const expected = [
      navigation.logoLabel,
      ...navigation.links.map((link) => link.label),
      navigation.cvLabel,
    ];
    for (const name of expected) {
      await page.keyboard.press('Tab');
      const link =
        name === navigation.logoLabel
          ? page.getByRole('link', { name })
          : nav.getByRole('link', { name, exact: true });
      await expect(link).toBeFocused();
      await expect(link).toHaveCSS('outline-style', 'solid');
      await expect(link).not.toHaveCSS('outline-width', '0px');
    }
  });
});

test.describe('mobile nav', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('menu button opens and closes the list, traps focus and closes on Escape', async ({
    page,
  }) => {
    await page.goto('/Portfolio/');
    const button = page.getByRole('button', { name: navigation.menuLabel });
    await expect(page.getByRole('navigation').getByRole('list').first()).toBeHidden();

    await button.click();
    const dialog = page.getByRole('dialog', { name: navigation.menuLabel });
    await expect(dialog).toBeVisible();
    for (const { label } of navigation.links) {
      await expect(dialog.getByRole('link', { name: label })).toBeVisible();
    }

    // Tab through more stops than the menu has; focus must never leave it.
    const stops = navigation.links.length + 2;
    for (let i = 0; i < stops * 2; i += 1) {
      await page.keyboard.press('Tab');
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(
        true,
      );
    }
    for (let i = 0; i < stops; i += 1) {
      await page.keyboard.press('Shift+Tab');
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(
        true,
      );
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();

    await button.click();
    await dialog.getByRole('button', { name: navigation.closeLabel }).click();
    await expect(dialog).toBeHidden();
  });

  test('has no horizontal scroll', async ({ page }) => {
    await page.goto('/Portfolio/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});
