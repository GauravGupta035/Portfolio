import { useEffect } from 'react';

export const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

let scrollMotion: Promise<typeof import('./scroll')> | undefined;

/** GSAP, ScrollTrigger and Lenis load in their own chunk, so the first paint never waits on them.
 * Every caller shares one promise, so sections set up their triggers in the order they asked,
 * which is page order. ScrollTrigger needs that for a pin to push the triggers below it. */
export const loadScrollMotion = () => (scrollMotion ??= import('./scroll'));

/** Runs the one Lenis instance for the app while the visitor allows motion. Call it once, in App. */
export function useSmoothScroll() {
  useEffect(() => {
    // jsdom has no matchMedia, and without it there is no way to honour reduced motion.
    const reduced = window.matchMedia?.(reducedMotionQuery);
    if (!reduced) return;
    let cancelled = false;
    let stop: (() => void) | undefined;
    let onChange = () => {};
    void loadScrollMotion().then(({ startSmoothScroll }) => {
      if (cancelled) return;
      onChange = () => {
        stop?.();
        stop = reduced.matches ? undefined : startSmoothScroll();
      };
      onChange();
      reduced.addEventListener('change', onChange);
    });
    return () => {
      cancelled = true;
      reduced.removeEventListener('change', onChange);
      stop?.();
    };
  }, []);
}
