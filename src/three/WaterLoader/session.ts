// Decides, once per page load, which intro the visitor gets.

export const seenKey = 'gg:intro-seen';

/** 'water' is the WebGL loader, 'fade' the plain fallback, 'none' a repeat visit this session. */
export type IntroMode = 'water' | 'fade' | 'none';

export const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

/** Probes for WebGL on a throwaway canvas that never enters the DOM. */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function readSeen(): boolean {
  try {
    return window.sessionStorage.getItem(seenKey) !== null;
  } catch {
    // Storage can be blocked; showing the intro again is the safe failure.
    return false;
  }
}

export function markIntroSeen() {
  try {
    window.sessionStorage.setItem(seenKey, '1');
  } catch {
    // Nothing to do: the intro just shows again next load.
  }
}

export function introMode(webgl: () => boolean = hasWebGL): IntroMode {
  if (readSeen()) return 'none';
  // Without matchMedia there is no way to honour reduced motion, so stay static.
  const reduced = window.matchMedia?.(reducedMotionQuery);
  if (!reduced || reduced.matches) return 'fade';
  return webgl() ? 'water' : 'fade';
}
