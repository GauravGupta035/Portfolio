import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders an empty main landmark', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeEmptyDOMElement();
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
