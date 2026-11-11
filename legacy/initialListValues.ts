import { Experience, Project, SkillCategory } from "./model";

export const experiences: Experience[] = [
  {
    title: "Software Development Engineer - II",
    company: "Tally Solutions",
    period: "April 2025 - June 2025",
    achievements: [
      "Developed 20+ custom lambda functions across 10+ components to reduce dependency on AWS-native solutions, enabling smooth and efficient migration process between cloud platforms without loss of functionality",
      "Engineered an automated failover and self-healing system in TallyPrime on AWS, restoring operations for 30+ client systems during outages. Recognized with SPOT Award as Customer Delight Champion",
      "Enhanced XML and Math parsers and the Tally-to-Tally migration tool by addressing key defects, ensuring smooth data migration and stable core functionality",
    ],
  },
  {
    title: "Software Development Engineer - I",
    company: "Tally Solutions",
    period: "April 2024 - April 2025",
    achievements: [
      "Spearheaded development of core features like file load source identification and placeholder collection attributes in Tally Prime Developer, optimizing third-party TDL file integration",
      "Identified and resolved critical bugs in Tally Prime, boosting product reliability and user satisfaction",
    ],
  },
  {
    title: "Software Development Intern",
    company: "Tally Solutions",
    period: "September 2023 - April 2024",
    achievements: [
      "Contributed to development of core features for Tally Prime and Tally Prime Developer",
      "Worked on bug fixes and feature enhancements to improve product stability",
    ],
  },
];

export const projectList: Array<Project> = [
  {
    id: 1,
    name: "Primaros: Drug-Drug Interaction Platform",
    description:
      "A clinical decision support system integrating 3 heterogeneous medical data sources into a unified domain model of 21,500+ drugs and 2.9 million directional interactions.",
    stack: "PYTHON + fastAPI + POSTGRESQL + REDIS",
  },
  {
    id: 2,
    name: "Interview Preparation Agent",
    description:
      "Console based AI-powered agent that generates personalised learning, revision and behavioural questions and uses LLM APIs to provide feedback.",
    stack: "PYTHON + LLM APIs",
    link: new URL("https://github.com/GauravGupta035/interview-prep-agent"),
  },
  {
    id: 3,
    name: "GenieSpeaks",
    description:
      "It is one-stop shop for reviews for tech products aggregated from websites like Amazon and Flipkart.",
    stack: "REACTJS",
    link: new URL("https://github.com/GauravGupta035/PD_GenieSpeaks"),
  },
  {
    id: 4,
    name: "Plagiarism Detector",
    description:
      "Application to help users detect plagiarism between two documents using Knuth Morris Pratt (KMP) Algorithm.",
    stack: "PYTHON",
    link: new URL("https://github.com/GauravGupta035/PlagiarismDetector"),
  },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Languages & Frameworks",
    skills: [
      "C++",
      "Python",
      "JavaScript",
      "TypeScript",
      "Haskell",
      "ReactJS",
      "FastAPI",
      "HTML",
      "CSS",
      "Sass",
    ],
  },
  {
    category: "Cloud and DevOps",
    skills: [
      "AWS (Lambda, EC2, S3)",
      "Oracle Cloud Infrastructure (OCI)",
      "Docker",
      "CI/CD",
      "GitHub Actions",
    ],
  },
  {
    category: "AI and Intelligent Systems",
    skills: ["Gemini API", "LangChain / LangGraph", "LLM Integration"],
  },
  {
    category: "Database Technologies",
    skills: ["SQL", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    category: "Testing and Tools",
    skills: [
      "pytest",
      "Unit Testing",
      "Git",
      "GitHub",
      "Jira",
      "Confluence",
      "Postman",
      "Figma",
    ],
  },
];
