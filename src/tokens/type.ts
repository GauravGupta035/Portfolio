// Type styles from Figma "00 Foundations" / 05 Typography. All styles use
// tracking 0 and automatic line height.
export const fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';

export type TypeStyle = { size: number; weight: 300 | 400 | 500 | 700 };

export const typeStyles = {
  'display-2xl': { size: 142, weight: 500 },
  'display-xl': { size: 128, weight: 500 },
  'display-l': { size: 96, weight: 500 },
  'heading-l': { size: 64, weight: 500 },
  'heading-m': { size: 32, weight: 500 },
  'heading-s': { size: 24, weight: 500 },
  'heading-s-strong': { size: 24, weight: 700 },
  'heading-feature': { size: 36, weight: 500 },
  'subtitle-l': { size: 53, weight: 300 },
  'body-l': { size: 32, weight: 300 },
  'body-m': { size: 24, weight: 400 },
  'body-s': { size: 20, weight: 300 },
  'body-xs': { size: 16, weight: 400 },
  'data-l': { size: 53, weight: 500 },
  'data-m': { size: 32, weight: 700 },
  'label-s': { size: 16, weight: 500 },
  meta: { size: 16, weight: 300 },
  'utility-m': { size: 20, weight: 400 },
  'utility-m-medium': { size: 20, weight: 500 },
  action: { size: 40, weight: 500 },
} as const satisfies Record<string, TypeStyle>;

export type TypeStyleName = keyof typeof typeStyles;
