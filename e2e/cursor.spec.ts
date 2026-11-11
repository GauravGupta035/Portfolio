import { expect, test, type Page } from '@playwright/test';

const cursor = (page: Page) => page.getByTestId('cursor');

// Centre of the blob in viewport pixels.
const blobCentre = (page: Page) =>
  cursor(page)
    .locator('div')
    .first()
    .evaluate((blob) => {
      const { left, top, width, height } = blob.getBoundingClientRect();
      return { x: left + width / 2, y: top + height / 2 };
    });

async function load(page: Page) {
  await page.goto('/Portfolio/');
  // The blob listens from its first commit, so wait for it before the first move.
  await expect(cursor(page)).toBeAttached();
  await page.mouse.move(200, 200);
  await expect(cursor(page)).toHaveAttribute('data-visible', 'true');
}

test.describe('cursor at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('follows the pointer within about 150ms', async ({ page }) => {
    await load(page);
    // Times, inside the page, how long after the move event the blob reaches the pointer.
    const arrived = page.evaluate(
      ({ x, y }) =>
        new Promise<number>((resolve) => {
          window.addEventListener(
            'pointermove',
            () => {
              const start = performance.now();
              const blob = document.querySelector('[data-testid="cursor"] > div');
              const check = () => {
                const box = blob?.getBoundingClientRect();
                if (
                  box &&
                  Math.hypot(box.left + box.width / 2 - x, box.top + box.height / 2 - y) < 2
                )
                  resolve(performance.now() - start);
                else requestAnimationFrame(check);
              };
              check();
            },
            { once: true },
          );
        }),
      { x: 900, y: 600 },
    );
    await page.waitForTimeout(50);
    await page.mouse.move(900, 600);
    expect(await arrived).toBeLessThanOrEqual(150);
    const centre = await blobCentre(page);
    expect(Math.abs(centre.x - 900)).toBeLessThan(2);
    expect(Math.abs(centre.y - 600)).toBeLessThan(2);
  });

  test('shows the label of an element with data-cursor', async ({ page }) => {
    await load(page);
    await page.evaluate(() => {
      const target = document.createElement('a');
      target.href = '#projects';
      target.dataset.cursor = 'View';
      target.textContent = 'Project';
      target.id = 'labelled';
      Object.assign(target.style, {
        position: 'fixed',
        top: '400px',
        left: '400px',
        padding: '40px',
      });
      document.body.append(target);
    });
    await page.locator('#labelled').hover();
    await expect(cursor(page)).toHaveAttribute('data-state', 'label');
    await expect(cursor(page)).toHaveText('View');
    await page.mouse.move(10, 880);
    await expect(cursor(page)).not.toHaveText('View');
  });

  test('grows on links', async ({ page }) => {
    await load(page);
    const size = () =>
      cursor(page)
        .locator('div')
        .first()
        .evaluate((blob) => blob.getBoundingClientRect().width);
    const resting = await size();
    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Blog' })
      .hover();
    await expect(cursor(page)).toHaveAttribute('data-state', 'hover');
    await expect.poll(size).toBeGreaterThan(resting);
  });

  test('links under the blob stay clickable', async ({ page }) => {
    await load(page);
    const link = page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Blog' });
    const box = await link.boundingBox();
    if (!box) throw new Error('No Blog link box');
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    // The blob is on the link before the click lands.
    await expect.poll(async () => Math.round((await blobCentre(page)).x)).toBe(Math.round(x));
    await expect(cursor(page)).toHaveCSS('pointer-events', 'none');
    await page.mouse.click(x, y);
    await expect(page).toHaveURL(/#blog$/);
  });
});

test.describe('cursor with touch', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('is not rendered', async ({ page }) => {
    await page.goto('/Portfolio/');
    await page.mouse.move(200, 200);
    await page.waitForTimeout(300);
    await expect(cursor(page)).toHaveCount(0);
  });
});

test.describe('cursor with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('is not rendered and the native cursor is kept', async ({ page }) => {
    await page.goto('/Portfolio/');
    await page.mouse.move(200, 200);
    await page.waitForTimeout(300);
    await expect(cursor(page)).toHaveCount(0);
    await expect(page.locator('body')).toHaveCSS('cursor', 'auto');
  });
});
