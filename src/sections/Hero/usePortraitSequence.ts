import { useCallback, useEffect, useRef, useState } from 'react';
import { reducedMotionQuery } from '../../motion';

export const frameDuration = 400; // ms each frame shows while hovered

/** Steps through `count` frames while the portrait is hovered or focused, and repeats. Leaving
 * returns to the first frame. With reduced motion the first frame is all there is. */
export function usePortraitSequence(count: number) {
  const [frame, setFrame] = useState(0);
  // The later frames mount once the page's load event has fired and the first frame is in, or on
  // the first hover if that comes sooner, so they never compete with the first frame.
  const [pageLoaded, setPageLoaded] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  // Frames that have decoded. The sequence waits on a frame until the next one is here, so a
  // hover never shows a blank frame.
  const decoded = useRef(new Set([0]));
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const load = () => setPageLoaded(true);
    if (document.readyState === 'complete') load();
    else window.addEventListener('load', load, { once: true });
    return () => {
      window.removeEventListener('load', load);
      window.clearInterval(timer.current);
    };
  }, []);

  const start = () => {
    setHovered(true);
    if (timer.current !== undefined || window.matchMedia?.(reducedMotionQuery).matches !== false)
      return;
    timer.current = window.setInterval(
      () =>
        setFrame((index) => {
          const next = (index + 1) % count;
          return decoded.current.has(next) ? next : index;
        }),
      frameDuration,
    );
  };

  const stop = () => {
    window.clearInterval(timer.current);
    timer.current = undefined;
    setFrame(0);
  };

  /** Call when frame `index` has loaded; it joins the sequence once decoded. */
  const frameLoaded = useCallback((index: number, image: HTMLImageElement) => {
    if (index === 0) {
      setFirstLoaded(true);
      return;
    }
    image.decode().then(
      () => decoded.current.add(index),
      () => {},
    );
  }, []);

  return {
    frame,
    preload: hovered || (pageLoaded && firstLoaded),
    frameLoaded,
    handlers: { onPointerEnter: start, onPointerLeave: stop, onFocus: start, onBlur: stop },
  };
}
