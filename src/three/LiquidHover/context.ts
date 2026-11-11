import { createContext, useContext, useMemo, type PointerEvent, type RefObject } from 'react';
import type { LiquidHoverStore } from './store';

interface LiquidHoverContext {
  store: LiquidHoverStore;
  /** Mounts the shared scene; called on the first hover. */
  boot: () => void;
}

/** Null outside a provider and wherever the effect is off. */
export const Context = createContext<LiquidHoverContext | null>(null);

type Handlers = {
  onPointerEnter?: (event: PointerEvent) => void;
  onPointerMove?: (event: PointerEvent) => void;
  onPointerLeave?: (event: PointerEvent) => void;
};

/** Pointer handlers for a card that ripple its image. Empty outside a provider or where the
 * effect is off, so the card is just its markup. */
export function useLiquidHover(image: RefObject<HTMLImageElement | null>): Handlers {
  const context = useContext(Context);
  return useMemo(() => {
    if (!context) return {};
    const { store, boot } = context;
    return {
      onPointerEnter: (event) => {
        if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
        store.enter(image.current, event.clientX, event.clientY);
        boot();
      },
      onPointerMove: (event) => store.move(image.current, event.clientX, event.clientY),
      onPointerLeave: () => store.leave(image.current),
    };
  }, [context, image]);
}
