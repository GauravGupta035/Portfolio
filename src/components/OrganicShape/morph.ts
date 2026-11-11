import { organicShapes, type OrganicShapeName } from './shapes';

// Every shape path is absolute M/C/Z, so its numbers read as x,y pairs. Morphing keeps the
// commands and moves only the numbers, which lets any two variants of a shape interpolate.
const number = /-?\d*\.?\d+/g;

const numbersOf = (path: string) => (path.match(number) ?? []).map(Number);

function withNumbers(path: string, values: readonly number[]) {
  let index = 0;
  return path.replace(number, () => String(Math.round(values[index++] * 100) / 100));
}

export interface WobbleOptions {
  /** Largest radial push, as a fraction of the distance from the centre. */
  amount: number;
  /** Shifts the ripple around the shape; each phase gives a different outline. */
  phase: number;
  /** A point on the outline, in viewBox units, that stays where it is. */
  anchor?: { x: number; y: number };
}

/** A variant of a shape with its outline rippled in and out around the centre. Nearby points
 * move together, so the outline stays smooth. */
export function wobblePath(shape: OrganicShapeName, { amount, phase, anchor }: WobbleOptions) {
  const { width, height, path } = organicShapes[shape];
  const values = numbersOf(path);
  const cx = width / 2;
  const cy = height / 2;
  for (let i = 0; i < values.length; i += 2) {
    const x = values[i];
    const y = values[i + 1];
    const angle = Math.atan2((y - cy) / height, (x - cx) / width);
    let push = amount * (Math.sin(3 * angle + phase) + 0.5 * Math.sin(5 * angle - 1.7 * phase));
    if (anchor) {
      const distance = Math.hypot((x - anchor.x) / width, (y - anchor.y) / height);
      push *= 1 - Math.exp(-((distance / 0.3) ** 2));
    }
    values[i] = cx + (x - cx) * (1 + push);
    values[i + 1] = cy + (y - cy) * (1 + push);
  }
  return withNumbers(path, values);
}

/** The path `progress` of the way from `from` to `to`. Both must share one set of commands. */
export function interpolatePath(from: string, to: string, progress: number) {
  const a = numbersOf(from);
  const b = numbersOf(to);
  return withNumbers(
    to,
    b.map((value, index) => a[index] + (value - a[index]) * progress),
  );
}
