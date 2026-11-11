import type { SkillCategory } from './types';

export const skillCategories: readonly SkillCategory[] = [
  {
    category: 'Languages & Frameworks',
    skills: [
      'C++',
      'Python',
      'JavaScript',
      'TypeScript',
      'Haskell',
      'ReactJS',
      'FastAPI',
      'HTML',
      'CSS',
      'Sass',
    ],
  },
  {
    category: 'Cloud and DevOps',
    skills: [
      'AWS (Lambda, EC2, S3)',
      'Oracle Cloud Infrastructure (OCI)',
      'Docker',
      'CI/CD',
      'GitHub Actions',
    ],
  },
  {
    category: 'AI & Intelligent Systems',
    skills: ['Gemini API', 'LangChain / LangGraph', 'LLM Integration'],
  },
  {
    category: 'Database Technologies',
    skills: ['SQL', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    category: 'Testing and Tools',
    skills: ['pytest', 'Unit Testing', 'Git', 'GitHub', 'Jira', 'Confluence', 'Postman', 'Figma'],
  },
];
