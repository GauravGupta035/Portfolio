import type { Profile } from './types';

export const profile: Profile = {
  name: 'Gaurav Gupta',
  monogram: 'GG',
  role: 'Software Engineer',
  portrait: {
    src: 'images/01.jpg',
    alt: 'Gaurav Gupta smiling in a black T-shirt in front of a rock wall',
  },
  heroMetadata: [
    { label: 'Education', lines: ['MSc Computer Science', 'University of St Andrews'] },
    { label: 'Based in', lines: ['United Kingdom'] },
    { label: 'Focused on', lines: ['Distributed Systems', 'Cloud Native Applications'] },
  ],
  socials: [
    { label: 'GitHub', url: 'https://github.com/GauravGupta035' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/gauravgupta035/' },
    { label: 'Medium', url: 'https://medium.com/@guptagaurav035' },
    { label: 'Email', url: 'mailto:guptagaurav035@gmail.com' },
  ],
  cvPath: 'Gaurav_Gupta_Resume.pdf',
};
