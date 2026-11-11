// Renders each project's preview loop (H.264 MP4) and poster (its first frame, JPEG) into
// public/previews/. Run with `npm run render:previews`; the output is committed.
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { projects } from '../src/content/projects.ts';
import { compositionId } from './config.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

const serveUrl = await bundle({ entryPoint: path.join(root, 'remotion/index.ts') });

for (const project of projects) {
  const composition = await selectComposition({
    serveUrl,
    id: compositionId(project.id),
    inputProps: { projectId: project.id },
  });
  const video = path.join(publicDir, project.preview.video);
  const poster = path.join(publicDir, project.preview.poster);
  await mkdir(path.dirname(video), { recursive: true });
  await mkdir(path.dirname(poster), { recursive: true });

  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    crf: 28,
    muted: true,
    outputLocation: video,
    inputProps: { projectId: project.id },
  });
  await renderStill({
    serveUrl,
    composition,
    frame: 0,
    imageFormat: 'jpeg',
    jpegQuality: 85,
    output: poster,
    inputProps: { projectId: project.id },
  });
  console.log(`${project.name}: ${project.preview.video}, ${project.preview.poster}`);
}
