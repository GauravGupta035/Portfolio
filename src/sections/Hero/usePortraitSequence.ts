import { useEffect, useRef, useState } from 'react';
import { reducedMotionQuery } from '../../motion';

export const frameDuration = 400; // ms each frame shows while hovered

/** Steps through `count` frames while the portrait is hovered or focused, and repeats. Leaving
 * returns to the first frame. With reduced motion the first frame is all there is. */
export function usePortraitSequence(count: number) {
  const [frame, setFrame] = useState(0);
  // The later frames mount after first paint, or on the first hover if that comes sooner.
  const [preload, setPreload] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setPreload(true));
    return () => {
      cancelAnimationFrame(frameId);
      window.clearInterval(timer.current);
    };
  }, []);

  const start = () => {
    setPreload(true);
    if (timer.current !== undefined || window.matchMedia?.(reducedMotionQuery).matches !== false)
      return;
    timer.current = window.setInterval(
      () => setFrame((index) => (index + 1) % count),
      frameDuration,
    );
  };

  const stop = () => {
    window.clearInterval(timer.current);
    timer.current = undefined;
    setFrame(0);
  };

  return {
    frame,
    preload,
    handlers: { onPointerEnter: start, onPointerLeave: stop, onFocus: start, onBlur: stop },
  };
}
