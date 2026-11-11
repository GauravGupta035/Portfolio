import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { navigation, profile } from '../../content';
import { Nav } from './Nav';

describe('Nav', () => {
  it('links each section by id', () => {
    render(<Nav />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    for (const { label, sectionId } of navigation.links) {
      expect(within(nav).getByRole('link', { name: label })).toHaveAttribute(
        'href',
        `#${sectionId}`,
      );
    }
  });

  it('opens the CV PDF in a new tab', () => {
    render(<Nav />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    const cv = within(nav).getByRole('link', { name: navigation.cvLabel });
    expect(cv.getAttribute('href')).toMatch(/Gaurav_Gupta_Resume\.pdf$/);
    expect(cv.getAttribute('href')).toBe(`${import.meta.env.BASE_URL}${profile.cvPath}`);
    expect(cv).toHaveAttribute('target', '_blank');
    expect(cv.getAttribute('rel')?.split(' ')).toContain('noopener');
  });

  it('links the logo to the top of the page', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: navigation.logoLabel })).toHaveAttribute(
      'href',
      '#top',
    );
  });

  it('marks the link for the current hash as active', () => {
    window.history.replaceState(null, '', '/#blog');
    render(<Nav />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(within(nav).getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current');
    window.history.replaceState(null, '', '/');
  });

  it('opens the menu, traps focus and closes on Escape', () => {
    render(<Nav />);
    const button = screen.getByRole('button', { name: navigation.menuLabel });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    const dialog = screen.getByRole('dialog', { name: navigation.menuLabel });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const close = within(dialog).getByRole('button', { name: navigation.closeLabel });
    const cv = within(dialog).getByRole('link', { name: navigation.cvLabel });
    expect(close).toHaveFocus();

    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
    expect(cv).toHaveFocus();
    fireEvent.keyDown(cv, { key: 'Tab' });
    expect(close).toHaveFocus();

    fireEvent.keyDown(close, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('closes the menu when a link is chosen', () => {
    render(<Nav />);
    fireEvent.click(screen.getByRole('button', { name: navigation.menuLabel }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('link', { name: 'About' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
