import { useEffect, useRef, useState } from 'react';
import { interpolatePath } from './morph';

export type Ease = (progress: number) => number;

export const easeInOut: Ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** Overshoots and settles like a drop of liquid finding its shape. */
export const easeLiquid: Ease = (t) =>
  t >= 1 ? 1 : 1 - 2 ** (-10 * t) * Math.cos(t * Math.PI * 2.5);

/** Tweens a path towards `target` whenever it changes, starting from wherever it is now. */
export function useMorphPath(target: string, duration: number, ease: Ease = easeInOut) {
  const [path, setPath] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (from === target) return;
    let frame = 0;
    let start: number | undefined;
    const step = (time: number) => {
      start ??= time;
      const progress = Math.min((time - start) / duration, 1);
      current.current = progress === 1 ? target : interpolatePath(from, target, ease(progress));
      setPath(current.current);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, ease]);

  return path;
}
