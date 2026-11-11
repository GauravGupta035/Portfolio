// Hover state shared by every card and the one scene that draws the effect. It is a plain
// mutable object read each frame, so pointer moves never re-render React.

export class LiquidHoverStore {
  /** The image of the card under the pointer, or of the card last left while it settles. */
  target: HTMLImageElement | null = null;
  hovering = false;
  /** Pointer position in viewport pixels. */
  pointer = { x: 0, y: 0 };
  private wake: () => void = () => {};

  enter(target: HTMLImageElement | null, x: number, y: number) {
    this.target = target;
    this.hovering = true;
    this.move(target, x, y);
  }

  move(target: HTMLImageElement | null, x: number, y: number) {
    if (target !== this.target) return;
    this.pointer = { x, y };
    this.wake();
  }

  leave(target: HTMLImageElement | null) {
    if (target !== this.target) return;
    this.hovering = false;
    this.wake();
  }

  /** The scene registers how to ask for a frame while it is mounted. */
  onWake(wake: () => void) {
    this.wake = wake;
    return () => {
      this.wake = () => {};
    };
  }
}
