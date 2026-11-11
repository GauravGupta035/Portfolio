import { describe, expect, it } from 'vitest';
import agents from '../../AGENTS.md?raw';
import { colorPrimitives, radius, spacing, stroke, tokenStylesheet, tokenVariables } from '.';

// AGENTS.md lists the Figma Foundations values; the tokens must cover all of them.
const section = agents.slice(
  agents.indexOf('## Design tokens'),
  agents.indexOf('\n## ', agents.indexOf('## Design tokens') + 1),
);
const line = (prefix: string) => {
  const found = section.split('\n').find((text) => text.trimStart().startsWith(`- ${prefix}`));
  if (!found) throw new Error(`AGENTS.md has no "${prefix}" line`);
  return found;
};
const numbers = (text: string) =>
  [...text.matchAll(/(\d+)\s*px/g)].map((match) => Number(match[1]));

describe('design tokens', () => {
  it('include every colour primitive from AGENTS.md', () => {
    const documented = [...line('Color primitives').matchAll(/#[0-9A-F]{6}/gi)].map((m) => m[0]);
    expect(documented).toHaveLength(7);
    expect(Object.values(colorPrimitives)).toEqual(expect.arrayContaining(documented));
  });

  it('include every spacing step from AGENTS.md', () => {
    const documented = line('Spacing').replace(/^.*?:/, '').match(/\d+/g)?.map(Number);
    expect(documented).toEqual([4, 8, 12, 16, 24, 32, 48, 64, 96, 128]);
    expect(Object.values(spacing)).toEqual(documented);
  });

  it('include every stroke and radius from AGENTS.md', () => {
    const [strokeText, radiusText] = line('Stroke').split('Radius');
    expect(Object.values(stroke)).toEqual(numbers(strokeText));
    expect(Object.values(radius)).toEqual(radiusText.match(/\d+/g)?.map(Number));
  });

  it('emit every token as a custom property on :root', () => {
    const css = tokenStylesheet();
    for (const [name, value] of Object.entries(tokenVariables())) {
      expect(css).toContain(`${name}: ${value};`);
    }
    expect(css).toMatch(/^:root \{/);
  });

  it('emit a class for every type style', () => {
    const css = tokenStylesheet();
    expect(css).toContain('.type-display-2xl {');
    expect(css).toContain('.type-action {');
    expect(tokenVariables()['--type-display-2xl-size']).toBe('142px');
    expect(tokenVariables()['--type-heading-s-strong-weight']).toBe('700');
  });
});
