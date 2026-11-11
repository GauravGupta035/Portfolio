export type CursorState =
  { kind: 'default' } | { kind: 'hover' } | { kind: 'label'; label: string } | { kind: 'native' };

// Text entry keeps the native caret, so the blob gets out of the way there.
const nativeSelector =
  'input:not([type="button"], [type="submit"], [type="reset"], [type="checkbox"], [type="radio"]), textarea, select, [contenteditable=""], [contenteditable="true"]';
const interactiveSelector =
  'a[href], button, input[type="button"], input[type="submit"], input[type="reset"], [role="button"], label[for], summary';

/** What the cursor shows over `element`: a label declared with `data-cursor`, the larger hover
 * blob on links and buttons, the native cursor in text inputs, or the default blob. */
export function cursorStateFor(element: Element | null): CursorState {
  if (!element) return { kind: 'default' };
  if (element.closest(nativeSelector)) return { kind: 'native' };
  const labelled = element.closest('[data-cursor]');
  const label = labelled?.getAttribute('data-cursor')?.trim();
  if (label) return { kind: 'label', label };
  if (element.closest(interactiveSelector)) return { kind: 'hover' };
  return { kind: 'default' };
}
