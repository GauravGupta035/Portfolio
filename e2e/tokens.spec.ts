import { expect, test } from '@playwright/test';
import { tokenVariables } from '../src/tokens/css.ts';

test('exposes every design token as a custom property on :root', async ({ page }) => {
  await page.goto('/Portfolio/');
  const names = Object.keys(tokenVariables());
  const values = await page.evaluate(
    (list) =>
      Object.fromEntries(
        list.map((name) => [
          name,
          getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
        ]),
      ),
    names,
  );
  expect(names.filter((name) => !values[name])).toEqual([]);
  expect(values).toMatchObject({
    '--color-violet-500': '#6245F5',
    '--color-light-background-page': '#E9E9E7',
    '--color-dark-text-primary': '#F5F5F3',
    '--space-128': '128px',
    '--type-display-2xl-size': '142px',
    '--grid-margin': '50px',
  });
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(233, 233, 231)');
});

test('grid overlay spans 50px to 1390px at 1440px wide', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/Portfolio/?grid');
  const columns = page.getByTestId('grid-column');
  await expect(columns).toHaveCount(12);
  const first = await columns.first().boundingBox();
  const last = await columns.last().boundingBox();
  expect(first?.x).toBeCloseTo(50, 0);
  expect(first?.width).toBeCloseTo(97, 0);
  expect((last?.x ?? 0) + (last?.width ?? 0)).toBeCloseTo(1390, 0);
});

test('grid collapses to one column at 375px without horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/Portfolio/?grid');
  const visible = page.getByTestId('grid-column').filter({ visible: true });
  await expect(visible).toHaveCount(1);
  const box = await visible.boundingBox();
  expect(box?.x).toBeCloseTo(16, 0);
  expect(box?.width).toBeCloseTo(375 - 32, 0);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test('requests no font from a third-party origin', async ({ page, baseURL }) => {
  const origin = new URL(baseURL ?? '').origin;
  const foreignFonts: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (new URL(url).origin === origin || url.startsWith('data:')) return;
    if (
      request.resourceType() === 'font' ||
      /fonts\.(googleapis|gstatic)|typekit|fonts\.com/.test(url)
    ) {
      foreignFonts.push(url);
    }
  });
  await page.goto('/Portfolio/?grid', { waitUntil: 'networkidle' });
  expect(foreignFonts).toEqual([]);
});
