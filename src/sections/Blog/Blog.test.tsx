import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { blogSection, posts } from '../../content';
import { Blog } from './Blog';

describe('Blog', () => {
  it('shows the heading', () => {
    render(<Blog />);
    expect(
      screen.getByRole('heading', { level: 2, name: blogSection.heading }),
    ).toBeInTheDocument();
  });

  it('renders one card per post from content', () => {
    render(<Blog />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(posts.length);
    links.forEach((link, index) => {
      const { title, excerpt } = posts[index];
      expect(within(link).getByRole('heading', { level: 3, name: title })).toBeInTheDocument();
      expect(within(link).getByText(excerpt)).toBeInTheDocument();
    });
  });

  it('makes each card a single link to the post in a new tab', () => {
    render(<Blog />);
    screen.getAllByRole('listitem').forEach((item, index) => {
      const links = within(item).getAllByRole('link');
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute('href', posts[index].url);
      expect(links[0]).toHaveAttribute('target', '_blank');
      expect(links[0].getAttribute('rel')?.split(' ')).toContain('noopener');
      expect(links[0].tabIndex).toBe(0);
    });
  });

  it('lazy-loads each card image with alt text', () => {
    render(<Blog />);
    screen.getAllByRole('link').forEach((link, index) => {
      const image = within(link).getByRole('img', { name: posts[index].image.alt });
      expect(posts[index].image.alt).not.toBe('');
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image.getAttribute('src')).toMatch(new RegExp(`${posts[index].image.src}$`));
    });
  });
});
