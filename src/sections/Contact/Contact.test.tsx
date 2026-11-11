import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { contactSection, navigation, profile } from '../../content';
import { Contact } from './Contact';

const email = profile.socials.find((social) => social.label === 'Email')?.url;
const footer = () => screen.getByRole('list', { name: contactSection.linksLabel });

describe('Contact', () => {
  it('links the heading to the email address', () => {
    render(<Contact />);
    const heading = screen.getByRole('heading', { level: 2, name: contactSection.heading });
    expect(within(heading).getByRole('link')).toHaveAttribute('href', email);
  });

  it('shows every tag from content', () => {
    render(<Contact />);
    const list = screen.getByRole('list', { name: contactSection.tagsLabel });
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(contactSection.tags.map((tag) => tag.label));
  });

  it('points the footer links at the email, LinkedIn, GitHub and CV from content', () => {
    render(<Contact />);
    const links = within(footer()).getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual([
      'Email',
      'LinkedIn',
      'GitHub',
      navigation.cvLabel,
    ]);
    for (const label of ['Email', 'LinkedIn', 'GitHub'] as const) {
      const url = profile.socials.find((social) => social.label === label)?.url;
      expect(url).toBeDefined();
      expect(within(footer()).getByRole('link', { name: label })).toHaveAttribute('href', url);
    }
    expect(within(footer()).getByRole('link', { name: navigation.cvLabel })).toHaveAttribute(
      'href',
      `${import.meta.env.BASE_URL}${profile.cvPath}`,
    );
  });

  it('opens LinkedIn, GitHub and the CV in a new tab, and only the CV shows the arrow', () => {
    render(<Contact />);
    for (const label of ['LinkedIn', 'GitHub', navigation.cvLabel]) {
      const link = within(footer()).getByRole('link', { name: label });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')?.split(' ')).toContain('noopener');
      expect(link.querySelector('svg') !== null).toBe(label === navigation.cvLabel);
    }
    expect(within(footer()).getByRole('link', { name: 'Email' })).not.toHaveAttribute('target');
  });
});
