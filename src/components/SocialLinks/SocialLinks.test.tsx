import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { profile } from '../../content';
import { SocialLinks } from './SocialLinks';

describe('SocialLinks', () => {
  it('gives every link its social label as accessible name and points it at content', () => {
    render(<SocialLinks socials={profile.socials} label="Social links" />);
    const list = screen.getByRole('list', { name: 'Social links' });
    const links = within(list).getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual([
      'GitHub',
      'LinkedIn',
      'Medium',
      'Email',
    ]);
    for (const { label, url } of profile.socials) {
      expect(within(list).getByRole('link', { name: label })).toHaveAttribute('href', url);
    }
  });

  it('opens every link but Email in a new tab', () => {
    render(<SocialLinks socials={profile.socials} label="Social links" />);
    for (const { label } of profile.socials) {
      const link = screen.getByRole('link', { name: label });
      if (label === 'Email') expect(link).not.toHaveAttribute('target');
      else {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link.getAttribute('rel')?.split(' ')).toContain('noopener');
      }
    }
  });
});
