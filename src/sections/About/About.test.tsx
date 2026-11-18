/// <reference types="node" />
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { aboutSection, profile, skillCategories } from '../../content';
import { About } from './About';

const rows = () =>
  within(screen.getByRole('list', { name: aboutSection.skillsLabel }))
    .getAllByRole('listitem')
    .filter((item) => item.querySelector('h3'));

describe('About', () => {
  it('shows the heading and the intro', () => {
    render(<About />);
    expect(
      screen.getByRole('heading', { level: 2, name: aboutSection.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(aboutSection.intro)).toBeInTheDocument();
  });

  it('lists every skill category in order, each followed by exactly its skills as tags', () => {
    render(<About />);
    expect(rows()).toHaveLength(5);
    rows().forEach((row, index) => {
      const { category, skills } = skillCategories[index];
      expect(within(row).getByRole('heading', { level: 3 })).toHaveTextContent(category);
      const tags = within(row).getByRole('list', { name: `${category} skills` });
      expect(
        within(tags)
          .getAllByRole('listitem')
          .map((item) => item.textContent),
      ).toEqual(skills);
      // Tags are plain text, not links or buttons.
      expect(within(tags).queryByRole('link')).not.toBeInTheDocument();
      expect(within(tags).queryByRole('button')).not.toBeInTheDocument();
    });
  });

  it('has no illustrations, cards or tilt left', () => {
    render(<About />);
    const section = screen.getByRole('region', { name: aboutSection.heading });
    expect(within(section).queryByRole('img')).not.toBeInTheDocument();
    expect(within(section).queryByRole('article')).not.toBeInTheDocument();
    for (const category of skillCategories) expect(category).not.toHaveProperty('illustration');
    expect(existsSync(join(process.cwd(), 'src/components/CapabilityCard'))).toBe(false);
    expect(existsSync(join(process.cwd(), 'public/images/skills'))).toBe(false);
    const source = readFileSync(join(process.cwd(), 'src/sections/About/About.tsx'), 'utf8');
    expect(source).not.toMatch(/entranceQuery|rotation|CapabilityCard/);
  });

  it('downloads the CV from the CV button', () => {
    render(<About />);
    const cv = screen.getByRole('link', { name: aboutSection.cvLabel });
    expect(cv).toHaveAttribute('href', `${import.meta.env.BASE_URL}${profile.cvPath}`);
    expect(cv).toHaveAttribute('download', 'Gaurav_Gupta_Resume.pdf');
  });

  it('has no social links, the footer holds them', () => {
    render(<About />);
    const section = screen.getByRole('region', { name: aboutSection.heading });
    for (const { label, url } of profile.socials) {
      expect(within(section).queryByRole('link', { name: label })).not.toBeInTheDocument();
      expect(section.querySelector(`a[href="${url}"]`)).toBeNull();
    }
    expect(within(section).getAllByRole('link')).toHaveLength(1);
    expect(existsSync(join(process.cwd(), 'src/components/SocialLinks'))).toBe(false);
  });
});
