/// <reference types="node" />
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { experiences, posts, profile, projects, skillCategories } from '.';
import { legacyExperiences, legacyProjects } from './legacyStrings.fixture';

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
    for (const legacy of legacyProjects) {
      const project = projects.find((p) => p.id === legacy.id);
      expect(project).toBeDefined();
      if (!project) continue;
      const fullName = project.subtitle ? `${project.name}: ${project.subtitle}` : project.name;
      expect([project.name, fullName]).toContain(legacy.name);
      expect(project.description).toBe(legacy.description);
      expect(project.stack).toBe(legacy.stack);
      expect(project.link?.url).toBe(legacy.link);
    }
  });

  it("lists the CV's skills by category, in order", () => {
    expect(skillCategories.map(({ category, skills }) => ({ category, skills }))).toEqual([
      {
        category: 'Backend Engineering',
        skills: [
          'C++',
          'Python',
          'Java',
          'FastAPI',
          'REST APIs',
          'PostgreSQL',
          'Redis',
          'MongoDB',
          'SQL',
          'Multi-threading',
        ],
      },
      {
        category: 'Cloud & DevOps',
        skills: [
          'AWS (Lambda, EC2, S3)',
          'Oracle Cloud (OCI)',
          'Docker',
          'Docker Compose',
          'CI/CD',
          'GitHub Actions',
        ],
      },
      {
        category: 'AI Engineering',
        skills: [
          'LangGraph agents',
          'LLM integration',
          'Gemini API',
          'Ollama',
          'Claude Code',
          'Tessl',
          'Software Factory development',
        ],
      },
      {
        category: 'Testing & Tooling',
        skills: [
          'pytest',
          'Unit testing',
          'LLM mocking',
          'Git',
          'GitHub',
          'Postman',
          'Jira',
          'Confluence',
        ],
      },
      { category: 'Frontend', skills: ['JavaScript', 'TypeScript', 'React'] },
    ]);
  });

  it('drops the skills the CV no longer lists', () => {
    const source = readFileSync(join(process.cwd(), 'src/content/skills.ts'), 'utf8');
    for (const removed of ['Haskell', 'HTML', 'CSS', 'Sass', 'Figma', 'ReactJS', 'LangChain']) {
      expect(source, removed).not.toContain(removed);
    }
  });

  it('lists the projects newest first, with Jot and nimble-triage as ids 3 and 4', () => {
    expect(projects.map(({ id, name }) => ({ id, name }))).toEqual([
      { id: 3, name: 'Jot' },
      { id: 4, name: 'nimble-triage' },
      { id: 1, name: 'Primaros' },
      { id: 2, name: 'Interview Preparation Agent' },
    ]);
  });

  it('links Jot to its website and nimble-triage to its source, both in 2026', () => {
    const jot = projects.find((p) => p.name === 'Jot');
    const triage = projects.find((p) => p.name === 'nimble-triage');
    expect(jot).toMatchObject({
      year: 2026,
      link: { kind: 'site', url: 'https://jotyourday.com' },
    });
    expect(triage).toMatchObject({
      year: 2026,
      link: { kind: 'source', url: 'https://github.com/GauravGupta035/nimble-triage' },
    });
    expect(triage?.metrics).toBeUndefined();
  });

  it('no longer mentions the dropped projects', () => {
    const contentDir = join(process.cwd(), 'src/content');
    // This file names them to search for them, so it is the one file not checked.
    const files = readdirSync(contentDir).filter((file) => file !== 'content.test.ts');
    for (const file of files) {
      const text = readFileSync(join(contentDir, file), 'utf8');
      expect(text, file).not.toMatch(/GenieSpeaks|Plagiarism Detector/);
    }
  });

  it('gives every project link a valid https URL', () => {
    for (const { name, link } of projects) {
      if (link === undefined) continue;
      expect(isHttpsUrl(link.url), `${name}: ${link.url}`).toBe(true);
    }
  });

  it('flags an invalid link URL', () => {
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
      ...profile.portraitHoverFrames,
      ...posts.map((post) => post.image.src),
    ];
    for (const path of paths) expect(existsSync(join(publicDir, path)), path).toBe(true);
  });

  it('lists the factory post second with its own illustration', () => {
    expect(posts).toHaveLength(2);
    const post = posts[1];
    expect(post.title).toBe('Test the factory before you trust it');
    expect(post.excerpt).toBe(
      "I used Tessl to build Jot's waitlist website, learned what it takes to build a truly reliable AI software factory and then rebuilt the pipeline on Claude.",
    );
    expect(post.url).toBe(
      'https://medium.com/@guptagaurav035/test-the-factory-before-you-trust-it-82b7f3467fd5?sharedUserId=guptagaurav035',
    );
    expect(post.image.src).toBe('images/blog/test-the-factory.svg');
    expect(post.image.alt.trim()).not.toBe('');
    const svg = readFileSync(join(publicDir, post.image.src), 'utf8');
    expect(svg).toMatch(/viewBox="0 0 660 528"/);
  });
});
