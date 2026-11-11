// Spacing, stroke, radius and grid from Figma "00 Foundations" / 02 to 06.
export const spacing = {
  '4': 4,
  '8': 8,
  '12': 12,
  '16': 16,
  '24': 24,
  '32': 32,
  '48': 48,
  '64': 64,
  '96': 96,
  '128': 128,
} as const;

export const stroke = {
  hairline: 1,
  strong: 2,
} as const;

export const radius = {
  none: 0,
  default: 4,
} as const;

export const grid = {
  desktop: {
    width: 1440,
    columns: 12,
    column: 97,
    gutter: 16,
    margin: 50,
  },
  // No mobile design exists yet: one column with 16px side gutters.
  mobile: {
    maxWidth: 767,
    columns: 1,
    margin: 16,
  },
} as const;
