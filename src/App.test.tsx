import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { navigation } from './content';

describe('App', () => {
  it('renders a target section for every nav link', () => {
    render(<App />);
    for (const { sectionId } of navigation.links) {
      expect(document.getElementById(sectionId)).toBeInTheDocument();
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
