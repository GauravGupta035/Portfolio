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

export interface ProjectsSection {
  heading: string;
  /** Year range shown beside the index heading. */
  range: string;
  detailLabel: string;
  viewSourceLabel: string;
  techRailLabel: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  achievements: readonly string[];
}

export interface ExperienceSection {
  heading: string;
  /** Prefix for the progress indicator's accessible name, as in "Role 1 of 3". */
  progressLabel: string;
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
  /** Short mark shown beside the logo shape in the nav. */
  monogram: string;
  role: string;
  portrait: Image;
  heroMetadata: readonly HeroMetadata[];
  socials: readonly Social[];
  cvPath: PublicPath;
}

export type SectionId = 'projects' | 'experience' | 'blog' | 'about' | 'contact';

export interface NavigationLink {
  label: string;
  sectionId: SectionId;
}

export interface Navigation {
  links: readonly NavigationLink[];
  cvLabel: string;
  logoLabel: string;
  menuLabel: string;
  closeLabel: string;
  scrollLabel: string;
}
