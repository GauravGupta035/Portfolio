import type { SkillCategory } from './types';

export const skillCategories: readonly SkillCategory[] = [
  {
    category: 'Backend Engineering',
    illustration: {
      src: 'images/skills/database-technologies.svg',
      alt: 'A stack of black database cylinders wired with lines to red and black dots',
    },
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
    illustration: {
      src: 'images/skills/cloud-devops.jpg',
      alt: 'A grey cloud above stacked black blocks wired with red-tipped lines',
    },
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
    illustration: {
      src: 'images/skills/ai-intelligent-systems.jpg',
      alt: 'A profile of a head split into circuit traces in red, black and cream',
    },
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
    illustration: {
      src: 'images/skills/testing-tools.svg',
      alt: 'A black checklist with ticks, a magnifier with a red centre and a grey wrench',
    },
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
  {
    category: 'Frontend',
    illustration: {
      src: 'images/skills/languages-frameworks.jpg',
      alt: 'Abstract network of nodes, a blue triangle and green circles and hexagons',
    },
    skills: ['JavaScript', 'TypeScript', 'React'],
  },
];
