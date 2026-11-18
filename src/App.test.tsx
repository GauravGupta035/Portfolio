import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { navigation, profile } from './content';

describe('App', () => {
  it('renders a target section for every nav link', () => {
    render(<App />);
    for (const { sectionId } of navigation.links) {
      expect(document.getElementById(sectionId)).toBeInTheDocument();
    }
  });

  it('links each social exactly once on the page, in the footer', () => {
    render(<App />);
    const footer = screen.getByRole('contentinfo');
    for (const { label, url } of profile.socials) {
      const links = Array.from(document.querySelectorAll('a')).filter(
        (link) => link.getAttribute('href') === url,
      );
      expect(links, label).toHaveLength(1);
      expect(within(footer).getByRole('link', { name: label })).toBe(links[0]);
    }
  });
});

describe('App grid overlay', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('is absent without the ?grid flag', () => {
    render(<App />);
    expect(screen.queryByTestId('grid-overlay')).not.toBeInTheDocument();
  });

  it('draws 12 columns with the ?grid flag', async () => {
    window.history.replaceState(null, '', '/?grid');
    render(<App />);
    expect(await screen.findAllByTestId('grid-column')).toHaveLength(12);
  });
});
