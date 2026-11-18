import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { contactSection, navigation, profile } from '../../content';
import { Contact } from './Contact';

const footer = () => screen.getByRole('list', { name: contactSection.linksLabel });

describe('Contact', () => {
  it('is a footer with the contact id and no heading or tag cloud', () => {
    render(<Contact />);
    const element = screen.getByRole('contentinfo');
    expect(element).toHaveAttribute('id', 'contact');
    expect(within(element).queryByRole('heading')).not.toBeInTheDocument();
    expect(within(element).getAllByRole('list')).toHaveLength(1);
  });

  it('points the footer links at the email, LinkedIn, GitHub, Medium and CV from content', () => {
    render(<Contact />);
    const links = within(footer()).getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual([
      'Email',
      'LinkedIn',
      'GitHub',
      'Medium',
      navigation.cvLabel,
    ]);
    for (const label of ['Email', 'LinkedIn', 'GitHub', 'Medium'] as const) {
      const url = profile.socials.find((social) => social.label === label)?.url;
      expect(url).toBeDefined();
      expect(within(footer()).getByRole('link', { name: label })).toHaveAttribute('href', url);
    }
    expect(within(footer()).getByRole('link', { name: navigation.cvLabel })).toHaveAttribute(
      'href',
      `${import.meta.env.BASE_URL}${profile.cvPath}`,
    );
  });

  it('opens LinkedIn, GitHub, Medium and the CV in a new tab, and every link shows the arrow', () => {
    render(<Contact />);
    for (const label of ['LinkedIn', 'GitHub', 'Medium', navigation.cvLabel]) {
      const link = within(footer()).getByRole('link', { name: label });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')?.split(' ')).toEqual(['noopener', 'noreferrer']);
    }
    expect(within(footer()).getByRole('link', { name: 'Email' })).not.toHaveAttribute('target');
    for (const link of within(footer()).getAllByRole('link')) {
      expect(link.querySelector('svg')).not.toBeNull();
    }
  });
});
