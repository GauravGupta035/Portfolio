import type { SkillCategory } from './types';

export const skillCategories: readonly SkillCategory[] = [
  {
    category: 'Languages & Frameworks',
    illustration: {
      src: 'images/skills/languages-frameworks.jpg',
      alt: 'Abstract network of nodes, a blue triangle and green circles and hexagons',
    },
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
    illustration: {
      src: 'images/skills/cloud-devops.jpg',
      alt: 'A grey cloud above stacked black blocks wired with red-tipped lines',
    },
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
    illustration: {
      src: 'images/skills/ai-intelligent-systems.jpg',
      alt: 'A profile of a head split into circuit traces in red, black and cream',
    },
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
