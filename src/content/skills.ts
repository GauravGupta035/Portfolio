import type { SkillCategory } from './types';

export const skillCategories: readonly SkillCategory[] = [
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
  {
    category: 'Frontend',
    skills: ['JavaScript', 'TypeScript', 'React'],
  },
];
