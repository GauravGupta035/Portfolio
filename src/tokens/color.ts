// Colour primitives and semantic roles from Figma "00 Foundations" / 01 Color.
//
// Known Figma discrepancy: the Violet 500/600 captions and bound swatches are
// swapped, and Light Background/Page is bound to Neutral 200 although the
// specimen shows #F5F5F3. These values follow the bound variables, as AGENTS.md
// asks. Revisit once the Figma file is corrected.
export const colorPrimitives = {
  'neutral-00': '#F5F5F3',
  'neutral-200': '#E9E9E7',
  'neutral-400': '#B3B3B3',
  'neutral-600': '#666666',
  'neutral-950': '#010101',
  'violet-500': '#6245F5',
  'violet-600': '#7B61FF',
} as const;

export type ColorPrimitive = keyof typeof colorPrimitives;

export type SemanticRole =
  | 'background-page'
  | 'text-primary'
  | 'text-secondary'
  | 'accent-primary'
  | 'border-default'
  | 'border-strong';

// Sections alternate light (neutral) and dark (950) surfaces, so both sets are
// always available rather than toggled as a site theme.
export const semanticColors = {
  light: {
    // Bound to Neutral 200 in Figma, see the discrepancy note above.
    'background-page': 'neutral-200',
    'text-primary': 'neutral-950',
    'text-secondary': 'neutral-600',
    'accent-primary': 'violet-500',
    'border-default': 'neutral-400',
    'border-strong': 'neutral-950',
  },
  dark: {
    'background-page': 'neutral-950',
    'text-primary': 'neutral-00',
    'text-secondary': 'neutral-400',
    'accent-primary': 'violet-600',
    'border-default': 'neutral-600',
    'border-strong': 'neutral-00',
  },
} as const satisfies Record<'light' | 'dark', Record<SemanticRole, ColorPrimitive>>;

export type Surface = keyof typeof semanticColors;
