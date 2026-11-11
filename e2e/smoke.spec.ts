import { expect, test } from '@playwright/test';

test('loads the site under /Portfolio/', async ({ page }) => {
  await page.goto('/Portfolio/');
  await expect(page).toHaveTitle('Gaurav Gupta');
  await expect(page.getByRole('main')).toBeAttached();
});

test('serves the resume PDF', async ({ request }) => {
  const response = await request.get('/Portfolio/Gaurav_Gupta_Resume.pdf');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
});

test('serves the portrait images', async ({ request }) => {
  const response = await request.get('/Portfolio/images/01.jpg');
  expect(response.status()).toBe(200);
});
