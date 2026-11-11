import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { projects, projectsSection } from '../../content';
import { projectAnchor } from '../ProjectDetail';
import { Projects } from './Projects';

describe('Projects', () => {
  it('shows the heading and the year range', () => {
    render(<Projects />);
    expect(
      screen.getByRole('heading', { level: 2, name: projectsSection.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(projectsSection.range)).toBeInTheDocument();
  });

  it('shows one row per project, in content order', () => {
    render(<Projects />);
    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(projects.length);
    rows.forEach((row, index) => {
      const { name, category, stack } = projects[index];
      expect(within(row).getByText(name)).toBeInTheDocument();
      expect(within(row).getByText(category)).toBeInTheDocument();
      expect(within(row).getByText(stack)).toBeInTheDocument();
    });
  });

  it("links each row to its project's detail block", () => {
    render(<Projects />);
    screen.getAllByRole('link').forEach((link, index) => {
      expect(link).toHaveAttribute('href', `#${projectAnchor(projects[index])}`);
    });
  });
});
