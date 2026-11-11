import { useEffect, type RefObject } from 'react';

// Drift and pointer avoidance need a wide screen, a mouse and permission to
// move. Everywhere else the tags stay at their Figma positions.
export const floatQuery =
  '(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

const drift = 12; // px each way
const reach = 180; // px from the pointer at which a tag starts to move away
const push = 90; // px a tag moves when the pointer is on its centre
const settle = 4; // per second; higher eases back faster

interface Tag {
  element: HTMLElement;
  x: number;
  y: number;
  phase: number;
  speed: number;
}

/** Floats every `[data-tag]` inside the field. Tags stay inside the field, which sits below the
 * heading, so they can never cover it. */
export function useTagFloat(field: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = field.current;
    const query = window.matchMedia?.(floatQuery);
    if (!element || !query) return;

    let frame = 0;
    let visible = false;
    let pointer: { x: number; y: number } | undefined;
    let last: number | undefined;
    const tags: Tag[] = Array.from(element.querySelectorAll<HTMLElement>('[data-tag]')).map(
      (tag, index) => ({
        element: tag,
        x: 0,
        y: 0,
        phase: index * 2.4,
        speed: 0.6 + (index % 4) * 0.12,
      }),
    );

    const step = (time: number) => {
      const dt = last === undefined ? 0 : Math.min((time - last) / 1000, 0.1);
      last = time;
      const seconds = time / 1000;
      const ease = 1 - Math.exp(-settle * dt);
      const bounds = element.getBoundingClientRect();
      for (const tag of tags) {
        const {
          offsetLeft: left,
          offsetTop: top,
          offsetWidth: width,
          offsetHeight: height,
        } = tag.element;
        let x = drift * Math.sin(seconds * tag.speed + tag.phase);
        let y = drift * Math.cos(seconds * tag.speed * 0.8 + tag.phase);
        if (pointer) {
          const dx = bounds.left + left + tag.x + width / 2 - pointer.x;
          const dy = bounds.top + top + tag.y + height / 2 - pointer.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < reach) {
            const strength = (1 - distance / reach) * push;
            x += (dx / distance) * strength;
            y += (dy / distance) * strength;
          }
        }
        tag.x += (x - tag.x) * ease;
        tag.y += (y - tag.y) * ease;
        tag.x = Math.min(Math.max(tag.x, -left), bounds.width - width - left);
        tag.y = Math.min(Math.max(tag.y, -top), bounds.height - height - top);
        tag.element.style.transform = `translate(${tag.x}px, ${tag.y}px)`;
      }
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (frame || !visible || !query.matches) return;
      last = undefined;
      frame = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const reset = () => {
      stop();
      for (const tag of tags) {
        tag.x = tag.y = 0;
        tag.element.style.transform = '';
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer = event.pointerType === 'mouse' ? { x: event.clientX, y: event.clientY } : undefined;
    };
    const onPointerLeave = () => {
      pointer = undefined;
    };
    const onQueryChange = () => (query.matches ? start() : reset());
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });

    observer.observe(element);
    query.addEventListener('change', onQueryChange);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    return () => {
      observer.disconnect();
      query.removeEventListener('change', onQueryChange);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      reset();
    };
  }, [field]);
}
