/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { experiences, posts, profile, projects, skillCategories } from '.';
import { legacyExperiences, legacyProjects, legacySkillCategories } from './legacyStrings.fixture';

// The owner asked for the Figma category wording where it differs from the legacy text.
const renamedSkillCategories: Record<string, string> = {
  'AI and Intelligent Systems': 'AI & Intelligent Systems',
};

const isHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

const publicDir = join(process.cwd(), 'public');

describe('content', () => {
  it('keeps every legacy experience string unchanged', () => {
    expect(experiences).toEqual(legacyExperiences);
  });

  it('keeps every legacy project string unchanged', () => {
    expect(projects).toHaveLength(legacyProjects.length);
    for (const legacy of legacyProjects) {
      const project = projects.find((p) => p.id === legacy.id);
      expect(project).toBeDefined();
      if (!project) continue;
      const fullName = project.subtitle ? `${project.name}: ${project.subtitle}` : project.name;
      expect([project.name, fullName]).toContain(legacy.name);
      expect(project.description).toBe(legacy.description);
      expect(project.stack).toBe(legacy.stack);
      expect(project.sourceUrl).toBe(legacy.link);
    }
  });

  it('keeps every legacy skill string unchanged', () => {
    expect(skillCategories.map(({ category, skills }) => ({ category, skills }))).toEqual(
      legacySkillCategories.map(({ category, skills }) => ({
        category: renamedSkillCategories[category] ?? category,
        skills,
      })),
    );
  });

  it('gives every project with a source URL a valid https URL', () => {
    for (const { name, sourceUrl } of projects) {
      if (sourceUrl === undefined) continue;
      expect(isHttpsUrl(sourceUrl), `${name}: ${sourceUrl}`).toBe(true);
    }
  });

  it('flags an invalid source URL', () => {
    expect(isHttpsUrl('github.com/GauravGupta035')).toBe(false);
    expect(isHttpsUrl('not a url')).toBe(false);
  });

  it('links posts and socials to valid URLs', () => {
    for (const { url } of posts) expect(isHttpsUrl(url), url).toBe(true);
    for (const { label, url } of profile.socials) {
      const valid = label === 'Email' ? /^mailto:[^@\s]+@[^@\s]+$/.test(url) : isHttpsUrl(url);
      expect(valid, url).toBe(true);
    }
  });

  it('points at files that exist in public/', () => {
    const paths = [
      profile.cvPath,
      profile.portrait.src,
      ...posts.map((post) => post.image.src),
      ...skillCategories.flatMap(({ illustration }) => (illustration ? [illustration.src] : [])),
    ];
    for (const path of paths) expect(existsSync(join(publicDir, path)), path).toBe(true);
  });
});
