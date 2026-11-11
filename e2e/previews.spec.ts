import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import { projects } from '../src/content/projects.ts';

const video = (page: Page, name: string) => page.getByRole('article', { name }).locator('video');

const state = (page: Page, name: string) =>
  video(page, name).evaluate((element: HTMLVideoElement) => ({
    paused: element.paused,
    time: element.currentTime,
  }));

// Skip the water intro so the page is interactive straight away.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.sessionStorage.setItem('gg:intro-seen', '1'));
});

test.describe('project previews at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('are muted and inline, and play only while in the viewport', async ({ page }) => {
    await page.goto('/Portfolio/');
    for (const project of projects) {
      const element = video(page, project.name);
      await expect(element).toHaveAttribute('playsinline');
      await expect(element).not.toHaveAttribute('autoplay');
      expect(await element.evaluate((node: HTMLVideoElement) => node.muted)).toBe(true);
      expect((await state(page, project.name)).paused).toBe(true);
    }

    const [first, second] = projects;
    await video(page, first.name).scrollIntoViewIfNeeded();
    await expect.poll(async () => (await state(page, first.name)).time).toBeGreaterThan(0);
    expect((await state(page, first.name)).paused).toBe(false);
    expect((await state(page, second.name)).paused).toBe(true);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(async () => (await state(page, first.name)).paused).toBe(true);
  });
});

test.describe('project previews with reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('do not autoplay and show the poster', async ({ page }) => {
    await page.goto('/Portfolio/');
    for (const project of projects) {
      const element = video(page, project.name);
      await element.scrollIntoViewIfNeeded();
      await expect(element).toBeInViewport();
      await expect(element).toHaveAttribute('poster', `/Portfolio/${project.preview.poster}`);
      // Give a wrongly started video time to advance.
      await page.waitForTimeout(500);
      expect(await state(page, project.name)).toEqual({ paused: true, time: 0 });
    }
  });
});

test('the site build does not bundle Remotion', () => {
  const assets = path.resolve(import.meta.dirname, '../dist/assets');
  const scripts = readdirSync(assets).filter((file) => file.endsWith('.js'));
  expect(scripts.length).toBeGreaterThan(0);
  for (const file of scripts) {
    expect(readFileSync(path.join(assets, file), 'utf8'), file).not.toMatch(/remotion/i);
  }
});
