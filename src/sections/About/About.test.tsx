/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { aboutSection, profile, skillCategories } from '../../content';
import { About } from './About';

const cards = () =>
  within(screen.getByRole('list', { name: aboutSection.cardsLabel })).getAllByRole('article');

describe('About', () => {
  it('shows the heading and the intro', () => {
    render(<About />);
    expect(
      screen.getByRole('heading', { level: 2, name: aboutSection.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(aboutSection.intro)).toBeInTheDocument();
  });

  it('renders one card per skill category with all its skills', () => {
    render(<About />);
    expect(cards()).toHaveLength(skillCategories.length);
    cards().forEach((card, index) => {
      const { category, skills, illustration } = skillCategories[index];
      expect(within(card).getByRole('heading', { level: 3, name: category })).toBeInTheDocument();
      expect(
        within(within(card).getByRole('list'))
          .getAllByRole('listitem')
          .map((item) => item.textContent),
      ).toEqual(skills);
      if (illustration) {
        expect(within(card).getByRole('img', { name: illustration.alt })).toHaveAttribute(
          'src',
          `${import.meta.env.BASE_URL}${illustration.src}`,
        );
      } else {
        expect(within(card).queryByRole('img')).not.toBeInTheDocument();
      }
    });
  });

  it('shows an illustration with alt text on every card', () => {
    render(<About />);
    cards().forEach((card) => {
      const image = within(card).getByRole('img');
      expect(image.getAttribute('alt')?.trim()).not.toBe('');
    });
  });

  it('draws the database and testing illustrations as SVGs in the skills folder', () => {
    for (const name of ['Database Technologies', 'Testing and Tools']) {
      const src = skillCategories.find(({ category }) => category === name)?.illustration?.src;
      expect(src, name).toMatch(/^images\/skills\/[\w-]+\.svg$/);
      if (!src) continue;
      const svg = readFileSync(join(process.cwd(), 'public', src), 'utf8');
      expect(svg).toContain('viewBox="0 0 348 420"');
    }
  });

  it('downloads the CV from the CV button', () => {
    render(<About />);
    const cv = screen.getByRole('link', { name: aboutSection.cvLabel });
    expect(cv).toHaveAttribute('href', `${import.meta.env.BASE_URL}${profile.cvPath}`);
    expect(cv).toHaveAttribute('download', 'Gaurav_Gupta_Resume.pdf');
  });

  it('lists the social links by name', () => {
    render(<About />);
    const socials = screen.getByRole('list', { name: aboutSection.socialsLabel });
    for (const { label } of profile.socials) {
      expect(within(socials).getByRole('link', { name: label })).toBeInTheDocument();
    }
  });
});
