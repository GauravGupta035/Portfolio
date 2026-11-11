import { describe, expect, it } from 'vitest';
import { interpolatePath, wobblePath } from './morph';
import { logoArrowTip, organicShapes } from './shapes';

const commands = (path: string) => path.replace(/[-\d.\s]+/g, ' ').trim();

describe('wobblePath', () => {
  it('changes the outline but keeps its commands, so it can morph', () => {
    const wobbled = wobblePath('portrait', { amount: 0.025, phase: 1.9 });
    expect(wobbled).not.toBe(organicShapes.portrait.path);
    expect(commands(wobbled)).toBe(commands(organicShapes.portrait.path));
  });

  it('leaves the anchor point where it is', () => {
    const wobbled = wobblePath('logo', { amount: 0.12, phase: 2.2, anchor: logoArrowTip });
    expect(organicShapes.logo.path).toContain(`${logoArrowTip.x} ${logoArrowTip.y}`);
    expect(wobbled).toContain(`${logoArrowTip.x} ${logoArrowTip.y}`);
  });
});

describe('interpolatePath', () => {
  const from = 'M0 0C10 0 10 10 0 10Z';
  const to = 'M10 20C20 20 20 30 10 30Z';

  it('returns each end at 0 and 1', () => {
    expect(interpolatePath(from, to, 0)).toBe(from);
    expect(interpolatePath(from, to, 1)).toBe(to);
  });

  it('moves every number the same fraction of the way', () => {
    expect(interpolatePath(from, to, 0.5)).toBe('M5 10C15 10 15 20 5 20Z');
  });
});
