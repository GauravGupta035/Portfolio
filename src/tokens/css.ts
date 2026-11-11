import { colorPrimitives, semanticColors } from './color.ts';
import { grid, radius, spacing, stroke } from './layout.ts';
import { fontFamily, typeStyles } from './type.ts';

const px = (value: number) => (value === 0 ? '0' : `${value}px`);

/** Every token as a CSS custom property name and value, in declaration order. */
export function tokenVariables(): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [name, value] of Object.entries(colorPrimitives)) {
    vars[`--color-${name}`] = value;
  }
  for (const [surface, roles] of Object.entries(semanticColors)) {
    for (const [role, primitive] of Object.entries(roles)) {
      vars[`--color-${surface}-${role}`] = `var(--color-${primitive})`;
    }
  }
  for (const [name, value] of Object.entries(spacing)) vars[`--space-${name}`] = px(value);
  for (const [name, value] of Object.entries(stroke)) vars[`--stroke-${name}`] = px(value);
  for (const [name, value] of Object.entries(radius)) vars[`--radius-${name}`] = px(value);

  vars['--font-family'] = fontFamily;
  for (const [name, style] of Object.entries(typeStyles)) {
    vars[`--type-${name}-size`] = px(style.size);
    vars[`--type-${name}-weight`] = String(style.weight);
  }

  vars['--grid-width'] = px(grid.desktop.width);
  vars['--grid-columns'] = String(grid.desktop.columns);
  vars['--grid-column'] = px(grid.desktop.column);
  vars['--grid-gutter'] = px(grid.desktop.gutter);
  vars['--grid-margin'] = px(grid.desktop.margin);
  vars['--grid-mobile-margin'] = px(grid.mobile.margin);

  return vars;
}

/**
 * The stylesheet injected into index.html at build time: custom properties on
 * :root, the default (light) semantic roles, and one class per type style.
 */
export function tokenStylesheet(): string {
  const root = Object.entries(tokenVariables())
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  const surface = (name: string) =>
    Object.keys(semanticColors.light)
      .map((role) => `  --color-${role}: var(--color-${name}-${role});`)
      .join('\n');

  const typeClasses = Object.keys(typeStyles)
    .map(
      (name) =>
        `.type-${name} {\n  font-size: var(--type-${name}-size);\n  font-weight: var(--type-${name}-weight);\n  letter-spacing: 0;\n  line-height: normal;\n}`,
    )
    .join('\n');

  return [
    `:root {\n${root}\n${surface('light')}\n}`,
    `.surface-light {\n${surface('light')}\n}`,
    `.surface-dark {\n${surface('dark')}\n}`,
    typeClasses,
  ].join('\n');
}
