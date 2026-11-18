import type { Project, ProjectPreview } from './types';

// `npm run render:previews` writes each project's loop and poster to these paths in public/.
const preview = (id: number): ProjectPreview => ({
  video: `previews/project-${id}.mp4`,
  poster: `previews/project-${id}.jpg`,
});

// Newest first; the index and the detail blocks follow this order.
export const projects: readonly Project[] = [
  {
    id: 3,
    name: 'Jot',
    subtitle: 'Spec-driven agentic development pipeline',
    category: 'Agentic engineering',
    stack: 'ASTRO + CLOUDFLARE WORKERS + D1 + GITHUB ACTIONS + TESSL',
    year: 2026,
    description:
      'A ticket-to-merge pipeline for a startup project: specs with tagged, testable acceptance criteria pass an automated spec gate, are implemented by coding agents, then go through CI, capped agent code review and manual testing before each merge.',
    metrics: [
      { value: '19', label: 'PRs merged in 4 days' },
      { value: '03', label: 'Maximum agent review rounds' },
      { value: '09', label: 'Enforced invariants in the planning engine' },
    ],
    link: { kind: 'site', url: 'https://jotyourday.com' },
    techRail: ['Astro', 'Cloudflare Workers', 'D1', 'GitHub Actions', 'Tessl'],
    preview: preview(3),
  },
  {
    id: 4,
    name: 'nimble-triage',
    subtitle: 'Open-source log triage CLI',
    category: 'Developer tools',
    stack: 'PYTHON + OLLAMA + SQLITE',
    year: 2026,
    description:
      'A Python CLI on PyPI that uses a local LLM to flag which log entries need human attention, with cached decisions and capped model requests to keep cost and behaviour predictable.',
    link: { kind: 'source', url: 'https://github.com/GauravGupta035/nimble-triage' },
    techRail: ['Python', 'Ollama', 'SQLite'],
    preview: preview(4),
  },
  {
    id: 1,
    name: 'Primaros',
    subtitle: 'Drug-Drug Interaction Platform',
    category: 'Clinical Systems',
    stack: 'PYTHON + fastAPI + POSTGRESQL + REDIS',
    year: 2025,
    description:
      'A clinical decision support system integrating 3 heterogeneous medical data sources into a unified domain model of 21,500+ drugs and 2.9 million directional interactions.',
    metrics: [
      { value: '21,500 +', label: 'Drugs' },
      { value: '03', label: 'Heterogeneous data sources' },
      { value: '2.9M', label: 'Directional interactions' },
    ],
    // Private project, so there is no link.
    techRail: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    preview: preview(1),
  },
  {
    id: 2,
    name: 'Interview Preparation Agent',
    category: 'AI systems',
    stack: 'PYTHON + LLM APIs',
    year: 2025,
    description:
      'Console based AI-powered agent that generates personalised learning, revision and behavioural questions and uses LLM APIs to provide feedback.',
    link: { kind: 'source', url: 'https://github.com/GauravGupta035/interview-prep-agent' },
    techRail: ['Python', 'LLM APIs'],
    preview: preview(2),
  },
];
