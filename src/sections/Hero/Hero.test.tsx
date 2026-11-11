import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { profile } from '../../content';
import { Hero } from './Hero';
import { frameDuration } from './usePortraitSequence';

const base = import.meta.env.BASE_URL;

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce && query.includes('reduce'),
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

const shownFrame = () =>
  screen.getByRole('img', { name: profile.portrait.alt }).getAttribute('src');

describe('Hero', () => {
  it('shows the name as the page heading and the role', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument();
    expect(screen.getByText(profile.role)).toBeInTheDocument();
  });

  it('gives the portrait its alt text from content', () => {
    render(<Hero />);
    const portrait = screen.getByRole('img', { name: profile.portrait.alt });
    expect(profile.portrait.alt).not.toBe('');
    expect(portrait.getAttribute('src')).toBe(`${import.meta.env.BASE_URL}${profile.portrait.src}`);
  });

  it('lists every metadata block from content', () => {
    render(<Hero />);
    for (const { label, lines } of profile.heroMetadata) {
      expect(screen.getByText(label, { selector: 'dt' })).toBeInTheDocument();
      for (const line of lines)
        expect(screen.getByText(line, { selector: 'dd' })).toBeInTheDocument();
    }
  });

  describe('portrait sequence', () => {
    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllGlobals();
    });

    it('steps through every frame while hovered and returns to the first on leave', () => {
      vi.useFakeTimers();
      stubReducedMotion(false);
      render(<Hero />);
      const portrait = screen
        .getByRole('img', { name: profile.portrait.alt })
        .closest('[tabindex]');
      expect(portrait).not.toBeNull();
      if (!portrait) return;

      fireEvent.pointerEnter(portrait);
      const frames = [profile.portrait.src, ...profile.portraitHoverFrames, profile.portrait.src];
      for (const frame of frames) {
        expect(shownFrame()).toBe(`${base}${frame}`);
        act(() => vi.advanceTimersByTime(frameDuration));
      }

      fireEvent.pointerLeave(portrait);
      expect(shownFrame()).toBe(`${base}${profile.portrait.src}`);
    });

    it('stays on the first frame with reduced motion', () => {
      vi.useFakeTimers();
      stubReducedMotion(true);
      render(<Hero />);
      const portrait = screen
        .getByRole('img', { name: profile.portrait.alt })
        .closest('[tabindex]');
      if (portrait) fireEvent.focus(portrait);
      act(() => vi.advanceTimersByTime(frameDuration * 3));
      expect(shownFrame()).toBe(`${base}${profile.portrait.src}`);
    });
  });
});
