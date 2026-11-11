import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { profile } from '../../content';
import { Hero } from './Hero';

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
});
