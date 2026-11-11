import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressIndicator } from './ProgressIndicator';

describe('ProgressIndicator', () => {
  it('pads the count and fills the track up to the current step', () => {
    const { container } = render(<ProgressIndicator current={2} total={3} label="Role" />);
    expect(screen.getByText('02/03')).toBeInTheDocument();
    expect(screen.getByText('Role 2 of 3')).toBeInTheDocument();
    const fill = container.querySelector<HTMLElement>('[style]');
    expect(parseFloat(fill?.style.width ?? '')).toBeCloseTo((2 / 3) * 100);
  });
});
