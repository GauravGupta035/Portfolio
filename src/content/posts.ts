import type { Post } from './types';

export const posts: readonly Post[] = [
  {
    title: 'Can a Local LLM Actually Drive a Software Engineering Agent?',
    excerpt:
      'I wanted to find out whether a laptop could run an AI coding agent well enough to be genuinely useful.',
    image: {
      src: 'images/blog/local-llm-agent.jpg',
      alt: 'Illustration of a laptop inside a loop of code, test and review steps',
    },
    url: 'https://medium.com/@guptagaurav035/can-a-local-llm-actually-drive-a-software-engineering-agent-92b0c5ad0d04?sharedUserId=guptagaurav035',
  },
];
