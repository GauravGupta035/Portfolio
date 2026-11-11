import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { seenKey } from './session';
import { WaterLoader } from './WaterLoader';

describe('WaterLoader without WebGL', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    window.sessionStorage.clear();
  });

  // jsdom has no matchMedia or WebGL, so this is the plain fade.
  it('fades out without a canvas and leaves the DOM', () => {
    const { container } = render(<WaterLoader />);
    expect(screen.getByTestId('intro-loader')).toHaveAttribute('data-mode', 'fade');
    expect(container.querySelector('canvas')).toBeNull();
    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByTestId('intro-loader')).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(seenKey)).not.toBeNull();
  });

  it('renders nothing on a repeat visit', () => {
    window.sessionStorage.setItem(seenKey, '1');
    render(<WaterLoader />);
    expect(screen.queryByTestId('intro-loader')).not.toBeInTheDocument();
  });
});
