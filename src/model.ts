export interface Experience {
  title: string;
  company: string;
  period: string;
  achievements: string[];
}

export interface Project {
    id: number;
    name: string;
    description: string;
    stack: string;
    link: URL;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}