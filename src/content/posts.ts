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
  {
    title: 'Test the factory before you trust it',
    excerpt:
      "I used Tessl to build Jot's waitlist website, learned what it takes to build a truly reliable AI software factory and then rebuilt the pipeline on Claude.",
    image: {
      src: 'images/blog/test-the-factory.svg',
      alt: 'Illustration of tickets on an assembly line passing through checks and a test gate into a merge',
    },
    url: 'https://medium.com/@guptagaurav035/test-the-factory-before-you-trust-it-82b7f3467fd5?sharedUserId=guptagaurav035',
  },
];
