import type { Project } from './types';

export const projects: readonly Project[] = [
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
    // Private project, so there is no source link.
    techRail: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
  },
  {
    id: 2,
    name: 'Interview Preparation Agent',
    category: 'AI systems',
    stack: 'PYTHON + LLM APIs',
    year: 2025,
    description:
      'Console based AI-powered agent that generates personalised learning, revision and behavioural questions and uses LLM APIs to provide feedback.',
    sourceUrl: 'https://github.com/GauravGupta035/interview-prep-agent',
    techRail: ['Python', 'LLM APIs'],
  },
  {
    id: 3,
    name: 'GenieSpeaks',
    subtitle: 'Reviews without the search.',
    category: 'Web application',
    stack: 'REACTJS',
    year: 2025,
    description:
      'It is one-stop shop for reviews for tech products aggregated from websites like Amazon and Flipkart.',
    sourceUrl: 'https://github.com/GauravGupta035/PD_GenieSpeaks',
    techRail: ['React'],
  },
  {
    id: 4,
    name: 'Plagiarism Detector',
    subtitle: 'Knuth Morris Pratt',
    category: 'Algorithms',
    stack: 'PYTHON',
    year: 2025,
    description:
      'Application to help users detect plagiarism between two documents using Knuth Morris Pratt (KMP) Algorithm.',
    sourceUrl: 'https://github.com/GauravGupta035/PlagiarismDetector',
    techRail: ['Python'],
  },
];
