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

  it('shows each link with its own label, opening it in a new tab, and none without a link', () => {
    render(<ProjectDetail />);
    const labels = Object.values(projectsSection.linkLabels).join('|');
    for (const project of projects) {
      const link = within(block(project.name)).queryByRole('link', {
        name: new RegExp(`^(${labels}), `),
      });
      if (!project.link) {
        expect(link).not.toBeInTheDocument();
        continue;
      }
      const label = projectsSection.linkLabels[project.link.kind];
      expect(link).toHaveAccessibleName(`${label}, ${project.name}`);
      expect(link).toHaveTextContent(label);
      expect(link).toHaveAttribute('href', project.link.url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link?.getAttribute('rel')?.split(' ')).toContain('noopener');
    }
  });

  it.each([
    ['Jot', 'Visit site', 'https://jotyourday.com'],
    ['nimble-triage', 'View source', 'https://github.com/GauravGupta035/nimble-triage'],
    [
      'Interview Preparation Agent',
      'View source',
      'https://github.com/GauravGupta035/interview-prep-agent',
    ],
  ])('links %s with "%s"', (name, label, href) => {
    render(<ProjectDetail />);
    const link = within(block(name)).getByRole('link', { name: `${label}, ${name}` });
    expect(link).toHaveAttribute('href', href);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('shows 2026 on the Jot and nimble-triage blocks', () => {
    render(<ProjectDetail />);
    for (const name of ['Jot', 'nimble-triage']) {
      expect(within(block(name)).getByText('2026')).toBeInTheDocument();
    }
  });

  it('shows no link on Primaros', () => {
    render(<ProjectDetail />);
    expect(within(block('Primaros')).queryByRole('link')).not.toBeInTheDocument();
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
