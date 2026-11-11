import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { OrganicShape } from '../OrganicShape';
import styles from './Cursor.module.css';
import { cursorStateFor, type CursorState } from './target';

// Only a mouse-like pointer gets the blob; touch-only devices and reduced motion keep the
// native cursor.
export const cursorQuery =
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

const follow = 18; // ms time constant of the easing; the blob is on the pointer within ~150ms

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia?.(cursorQuery);
  query?.addEventListener('change', onChange);
  return () => query?.removeEventListener('change', onChange);
};
const getSnapshot = () => window.matchMedia?.(cursorQuery).matches ?? false;
const getServerSnapshot = () => false;

/** Interaction / Cursor: a blob that follows the pointer, in default, hover and labelled states.
 * It never takes pointer events, so everything under it stays clickable. */
export function Cursor() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return enabled ? <CursorBlob /> : null;
}

function CursorBlob() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({ kind: 'default' });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const root = document.documentElement;
    root.classList.add(styles.active);

    let target: { x: number; y: number } | undefined;
    let position = { x: 0, y: 0 };
    let frame = 0;
    let last: number | undefined;

    const paint = () => {
      element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    };
    const step = (time: number) => {
      frame = 0;
      if (!target) return;
      const dt = last === undefined ? 16 : Math.min(time - last, 100);
      last = time;
      const ease = 1 - Math.exp(-dt / follow);
      position.x += (target.x - position.x) * ease;
      position.y += (target.y - position.y) * ease;
      if (Math.hypot(target.x - position.x, target.y - position.y) < 0.5) {
        position = { ...target };
        last = undefined;
      } else {
        frame = requestAnimationFrame(step);
      }
      paint();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      const first = !target;
      target = { x: event.clientX, y: event.clientY };
      if (first) {
        // The first move places the blob on the pointer rather than easing in from the corner.
        position = { ...target };
        paint();
      } else if (!frame) {
        frame = requestAnimationFrame(step);
      }
      setVisible(true);
      const next = cursorStateFor(event.target instanceof Element ? event.target : null);
      setState((current) =>
        current.kind === next.kind &&
        (current.kind !== 'label' || next.kind !== 'label' || current.label === next.label)
          ? current
          : next,
      );
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      root.classList.remove(styles.active);
    };
  }, []);

  const shown = visible && state.kind !== 'native';
  return (
    <div
      ref={ref}
      className={styles.cursor}
      data-testid="cursor"
      data-state={state.kind}
      data-visible={shown}
      aria-hidden="true"
    >
      <div className={styles.blob}>
        <OrganicShape shape="logo" className={styles.shape} />
        {state.kind === 'label' && <span className={styles.label}>{state.label}</span>}
      </div>
    </div>
  );
}
