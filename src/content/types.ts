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
  /** The card illustration. Figma only shows art for the first three categories. */
  illustration?: Image;
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

export interface BlogSection {
  heading: string;
}

export interface ContactTag {
  label: string;
  /** Top-left corner in Figma Page 1 at 1440px, measured from the tag field's top-left. */
  x: number;
  y: number;
}

export interface ContactSection {
  heading: string;
  /** Accessible name for the tag cloud. */
  tagsLabel: string;
  tags: readonly ContactTag[];
  /** Accessible name for the footer link row. */
  linksLabel: string;
  /** Socials shown in the footer row, in order. The CV link follows them. */
  links: readonly Social['label'][];
}

export interface AboutSection {
  heading: string;
  intro: string;
  /** Accessible name for the capability card rail. */
  cardsLabel: string;
  /** Accessible name for the vertical social links. */
  socialsLabel: string;
  cvLabel: string;
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
  /** Frames shown after `portrait.src` while the portrait is hovered, in order. */
  portraitHoverFrames: readonly PublicPath[];
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
