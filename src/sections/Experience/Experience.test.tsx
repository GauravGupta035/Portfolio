import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { experienceSection, experiences } from '../../content';
import { Experience } from './Experience';

const startYear = (period: string) => Number(period.match(/\d{4}/)?.[0]);

describe('Experience', () => {
  it('shows the heading', () => {
    render(<Experience />);
    expect(
      screen.getByRole('heading', { level: 2, name: experienceSection.heading }),
    ).toBeInTheDocument();
  });

  it('renders one card per role from content, newest first', () => {
    render(<Experience />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(3);
    const years = cards.map((card, index) => {
      const { title, company, period, achievements } = experiences[index];
      expect(within(card).getByRole('heading', { level: 3, name: title })).toBeInTheDocument();
      expect(within(card).getByText(company)).toBeInTheDocument();
      expect(within(card).getByText(period)).toBeInTheDocument();
      for (const achievement of achievements) {
        expect(within(card).getByText(achievement)).toBeInTheDocument();
      }
      return startYear(within(card).getByText(period).textContent ?? '');
    });
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it('numbers each card out of the total', () => {
    render(<Experience />);
    screen.getAllByRole('article').forEach((card, index) => {
      expect(within(card).getByText(`0${index + 1}/03`)).toBeInTheDocument();
      expect(
        within(card).getByText(`${experienceSection.progressLabel} ${index + 1} of 3`),
      ).toBeInTheDocument();
    });
  });
});
