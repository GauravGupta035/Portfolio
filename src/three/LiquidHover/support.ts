import { hasWebGL } from '../WaterLoader/session';

// Only a mouse-like pointer gets the ripple; touch devices and reduced motion keep the still
// image and the dark-variant hover.
export const liquidHoverQuery =
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export function liquidHoverSupported(webgl: () => boolean = hasWebGL): boolean {
  return (window.matchMedia?.(liquidHoverQuery).matches ?? false) && webgl();
}
