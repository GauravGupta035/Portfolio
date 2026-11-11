import type { Experience } from './types';

export const experiences: readonly Experience[] = [
  {
    title: 'Software Development Engineer - II',
    company: 'Tally Solutions',
    period: 'April 2025 - June 2025',
    achievements: [
      'Developed 20+ custom lambda functions across 10+ components to reduce dependency on AWS-native solutions, enabling smooth and efficient migration process between cloud platforms without loss of functionality',
      'Engineered an automated failover and self-healing system in TallyPrime on AWS, restoring operations for 30+ client systems during outages. Recognized with SPOT Award as Customer Delight Champion',
      'Enhanced XML and Math parsers and the Tally-to-Tally migration tool by addressing key defects, ensuring smooth data migration and stable core functionality',
    ],
  },
  {
    title: 'Software Development Engineer - I',
    company: 'Tally Solutions',
    period: 'April 2024 - April 2025',
    achievements: [
      'Spearheaded development of core features like file load source identification and placeholder collection attributes in Tally Prime Developer, optimizing third-party TDL file integration',
      'Identified and resolved critical bugs in Tally Prime, boosting product reliability and user satisfaction',
    ],
  },
  {
    title: 'Software Development Intern',
    company: 'Tally Solutions',
    period: 'September 2023 - April 2024',
    achievements: [
      'Contributed to development of core features for Tally Prime and Tally Prime Developer',
      'Worked on bug fixes and feature enhancements to improve product stability',
    ],
  },
];
