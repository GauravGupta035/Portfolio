import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { projects } from '../../content';
import { PreviewVideo } from './PreviewVideo';

const preview = projects[0].preview;
let observed: ((entries: { isIntersecting: boolean }[]) => void) | undefined;
let reduced: boolean;

beforeEach(() => {
  reduced = false;
  observed = undefined;
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduced,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: typeof observed) {
        observed = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const video = () => screen.getByLabelText('Preview') as HTMLVideoElement;
const scroll = (isIntersecting: boolean) => act(() => observed?.([{ isIntersecting }]));

describe('PreviewVideo', () => {
  it('is a muted, looping, inline video with its poster and no autoplay', () => {
    render(<PreviewVideo preview={preview} label="Preview" />);
    expect(video().muted).toBe(true);
    expect(video().loop).toBe(true);
    expect(video()).toHaveAttribute('playsinline');
    expect(video()).not.toHaveAttribute('autoplay');
    expect(video()).toHaveAttribute('preload', 'none');
    expect(video().getAttribute('src')).toBe(`${import.meta.env.BASE_URL}${preview.video}`);
    expect(video().getAttribute('poster')).toBe(`${import.meta.env.BASE_URL}${preview.poster}`);
  });

  it('plays only while in view', () => {
    render(<PreviewVideo preview={preview} label="Preview" />);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    scroll(true);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    scroll(false);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('never plays with reduced motion', () => {
    reduced = true;
    render(<PreviewVideo preview={preview} label="Preview" />);
    scroll(true);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it('keeps the poster without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<PreviewVideo preview={preview} label="Preview" />);
    expect(observed).toBeUndefined();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });
});
