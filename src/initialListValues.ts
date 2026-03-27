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
    name: "Interview Preparation Agent",
    description:
      "Console based AI-powered agent that generates personalised learning, revision and behavioural questions and uses LLM APIs to provide feedback.",
    stack: "PYTHON + LLM APIs",
    link: new URL("https://github.com/GauravGupta035/interview-prep-agent"),
  },
  {
    id: 2,
    name: "GenieSpeaks",
    description:
      "It is one-stop shop for reviews for tech products aggregated from websites like Amazon and Flipkart.",
    stack: "REACTJS",
    link: new URL("https://github.com/GauravGupta035/PD_GenieSpeaks"),
  },
  {
    id: 3,
    name: "Plagiarism Detector",
    description:
      "Application to help users detect plagiarism between two documents using Knuth Morris Pratt (KMP) Algorithm.",
    stack: "PYTHON",
    link: new URL("https://github.com/GauravGupta035/PlagiarismDetector"),
  },
  {
    id: 4,
    name: "Smart Notes",
    description:
      "Mobile application that aims to provide concise and thoroughly explained notes to students.",
    stack: "FLUTTER",
    link: new URL("https://github.com/GauravGupta035/SmartNotes"),
  },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Languages & Frameworks",
    skills: [
      "C++",
      "Python",
      "JavaScript",
      "Haskell",
      "ReactJS",
      "FastAPI",
      "HTML",
      "CSS",
      "Sass",
    ],
  },
  {
    category: "Cloud Technologies",
    skills: ["Amazon Web Services (AWS)", "Oracle Cloud Infrastructure (OCI)"],
  },
  {
    category: "AI and Intelligent Systems",
    skills: ["Gemini API", "LangChain / LangGraph", "LLM Integration"],
  },
  {
    category: "Database Technologies",
    skills: ["SQL", "MongoDB", "Amazon S3"],
  },
  {
    category: "Tools & Platforms",
    skills: ["Git", "GitHub", "Jira", "Confluence", "Postman", "Figma"],
  },
];
