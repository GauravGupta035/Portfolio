/** A path relative to the site root, resolved against `import.meta.env.BASE_URL` when rendered. */
export type PublicPath = string;

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  id: number;
  name: string;
  subtitle?: string;
  category: string;
  stack: string;
  year: number;
  description: string;
  metrics?: readonly Metric[];
  sourceUrl?: string;
  techRail: readonly string[];
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  achievements: readonly string[];
}

export interface SkillCategory {
  category: string;
  skills: readonly string[];
}

export interface Image {
  src: PublicPath;
  alt: string;
}

export interface Post {
  title: string;
  excerpt: string;
  image: Image;
  url: string;
}

export interface HeroMetadata {
  label: string;
  lines: readonly string[];
}

export interface Social {
  label: 'GitHub' | 'LinkedIn' | 'Medium' | 'Email';
  url: string;
}

export interface Profile {
  name: string;
  role: string;
  heroMetadata: readonly HeroMetadata[];
  socials: readonly Social[];
  cvPath: PublicPath;
}
