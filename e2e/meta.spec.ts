import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const dist = path.resolve(import.meta.dirname, '../dist');
const html = () => readFileSync(path.join(dist, 'index.html'), 'utf8');

const meta = (source: string, key: string) =>
  source.match(new RegExp(`<meta\\s+(?:name|property)="${key}"\\s+content="([^"]*)"`))?.[1];

// Width and height from the first start-of-frame marker of a JPEG.
function jpegSize(bytes: Buffer) {
  let offset = 2;
  while (offset < bytes.length) {
    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
    }
    offset += 2 + length;
  }
  throw new Error('No start-of-frame marker');
}

test('the description names Gaurav Gupta as a Software Engineer', () => {
  const source = html();
  expect(meta(source, 'description')).toMatch(/^Gaurav Gupta - Software Engineer\./);
  expect(source).not.toContain('Alok');
});

test('the page has Open Graph, Twitter and canonical metadata', () => {
  const source = html();
  const site = 'https://gauravgupta035.github.io/Portfolio/';
  expect(meta(source, 'og:title')).toBe('Gaurav Gupta');
  expect(meta(source, 'og:description')).toBe(meta(source, 'description') ?? 'missing');
  expect(meta(source, 'og:type')).toBe('website');
  expect(meta(source, 'og:url')).toBe(site);
  expect(meta(source, 'og:image')).toMatch(new RegExp(`^${site}\\S+$`));
  expect(meta(source, 'twitter:card')).toBe('summary_large_image');
  expect(source).toContain(`<link rel="canonical" href="${site}" />`);
});

test('the og:image is in the build at 1200 x 630 and under 300KB', () => {
  const image = new URL(meta(html(), 'og:image') ?? '').pathname.replace(/^\/Portfolio\//, '');
  const file = path.join(dist, image);
  expect(statSync(file).size).toBeLessThan(300 * 1024);
  expect(jpegSize(readFileSync(file))).toEqual({ width: 1200, height: 630 });
});
