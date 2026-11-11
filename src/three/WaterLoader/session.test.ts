import { afterEach, describe, expect, it, vi } from 'vitest';
import { introMode, markIntroSeen, reducedMotionQuery } from './session';

const mockMotion = (reduced: boolean) =>
  vi.stubGlobal(
    'matchMedia',
    (query: string) => ({ matches: query === reducedMotionQuery && reduced }) as MediaQueryList,
  );

describe('introMode', () => {
  afterEach(() => {
    window.sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it('shows the water on a first visit with motion and WebGL', () => {
    mockMotion(false);
    expect(introMode(() => true)).toBe('water');
  });

  it('fades instead with reduced motion, even with WebGL', () => {
    mockMotion(true);
    expect(introMode(() => true)).toBe('fade');
  });

  it('fades instead without WebGL', () => {
    mockMotion(false);
    expect(introMode(() => false)).toBe('fade');
  });

  it('shows nothing once the intro was seen this session', () => {
    mockMotion(false);
    markIntroSeen();
    expect(introMode(() => true)).toBe('none');
  });
});
