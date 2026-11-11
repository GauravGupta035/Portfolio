// @vitest-environment node
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { projects } from '../../content';

const publicDir = path.resolve(import.meta.dirname, '../../../public');

/** Seconds, from the movie header (mvhd) box of an MP4. */
function mp4Duration(file: Buffer) {
  const mvhd = file.indexOf('mvhd', 0, 'latin1');
  if (mvhd < 0) throw new Error('No mvhd box');
  const version = file[mvhd + 4];
  // Version 1 boxes use 64-bit creation and modification times and duration.
  const timescale = file.readUInt32BE(mvhd + (version === 1 ? 24 : 16));
  const duration =
    version === 1 ? Number(file.readBigUInt64BE(mvhd + 28)) : file.readUInt32BE(mvhd + 20);
  return duration / timescale;
}

describe('project preview loops', () => {
  for (const project of projects) {
    describe(project.name, () => {
      const video = path.join(publicDir, project.preview.video);
      const poster = path.join(publicDir, project.preview.poster);

      it('has a rendered MP4 under 2 MB and 8 seconds', () => {
        expect(statSync(video).size).toBeLessThan(2 * 1024 * 1024);
        const duration = mp4Duration(readFileSync(video));
        expect(duration).toBeGreaterThan(0);
        expect(duration).toBeLessThan(8);
      });

      it('has a rendered poster', () => {
        // JPEG start of image marker.
        expect(readFileSync(poster).subarray(0, 2)).toEqual(Buffer.from([0xff, 0xd8]));
      });
    });
  }

  it('gives every project its own files', () => {
    const files = projects.flatMap((project) => [project.preview.video, project.preview.poster]);
    expect(new Set(files).size).toBe(files.length);
  });
});
