import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { projects, projectsSection } from '../../content';
import { projectAnchor } from './anchor';
import { ProjectDetail } from './ProjectDetail';

const block = (name: string) => screen.getByRole('article', { name });

describe('ProjectDetail', () => {
  it('renders a block per project with the id its index row links to', () => {
    render(<ProjectDetail />);
    for (const project of projects) {
      expect(block(project.name)).toHaveAttribute('id', projectAnchor(project));
      expect(
        within(block(project.name)).getByRole('heading', { level: 3, name: project.name }),
      ).toBeInTheDocument();
      expect(within(block(project.name)).getByText(project.description)).toBeInTheDocument();
      expect(within(block(project.name)).getByText(String(project.year))).toBeInTheDocument();
    }
  });

  it('shows VIEW SOURCE only for projects with a source URL, opening it in a new tab', () => {
    render(<ProjectDetail />);
    const viewSource = new RegExp(projectsSection.viewSourceLabel, 'i');
    for (const project of projects) {
      const link = within(block(project.name)).queryByRole('link', { name: viewSource });
      if (!project.sourceUrl) {
        expect(link).not.toBeInTheDocument();
        continue;
      }
      expect(link).toHaveAttribute('href', project.sourceUrl);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link?.getAttribute('rel')?.split(' ')).toContain('noopener');
    }
    expect(projects.some((project) => !project.sourceUrl)).toBe(true);
  });

  it('shows the three Primaros metrics with their labels', () => {
    render(<ProjectDetail />);
    const primaros = block('Primaros');
    const terms = within(primaros).getAllByRole('term');
    const values = within(primaros).getAllByRole('definition');
    expect(values.map((value) => value.textContent)).toEqual(['21,500 +', '03', '2.9M']);
    expect(terms.map((term) => term.textContent)).toEqual([
      'Drugs',
      'Heterogeneous data sources',
      'Directional interactions',
    ]);
  });

  it('lists each technology once for assistive tech in the tech rail', () => {
    render(<ProjectDetail />);
    for (const project of projects) {
      const rail = within(block(project.name)).getByRole('list', {
        name: `${projectsSection.techRailLabel}, ${project.name}`,
      });
      expect(
        within(rail)
          .getAllByRole('listitem')
          .map((item) => item.textContent),
      ).toEqual(project.techRail);
    }
  });
});
