import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Blog } from '../../sections/Blog';
import { liquidHoverSupported } from './support';

const mockMatchMedia = (matches: boolean) =>
  vi.stubGlobal('matchMedia', (query: string) => ({ matches, media: query }));

describe('liquidHoverSupported', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('needs a fine hovering pointer without reduced motion, and WebGL', () => {
    mockMatchMedia(true);
    expect(liquidHoverSupported(() => true)).toBe(true);
    expect(liquidHoverSupported(() => false)).toBe(false);
    mockMatchMedia(false);
    expect(liquidHoverSupported(() => true)).toBe(false);
  });

  it('is off without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(liquidHoverSupported(() => true)).toBe(false);
  });
});

describe('LiquidHoverProvider without support', () => {
  // jsdom has no matchMedia or WebGL, so the cards are their plain markup.
  it('creates no layer or canvas when a card is hovered', () => {
    const { container } = render(<Blog />);
    const card = screen.getAllByRole('link')[0];
    fireEvent.pointerEnter(card, { pointerType: 'mouse' });
    fireEvent.pointerLeave(card, { pointerType: 'mouse' });
    expect(screen.queryByTestId('liquid-hover')).not.toBeInTheDocument();
    expect(container.querySelector('canvas')).toBeNull();
  });
});
