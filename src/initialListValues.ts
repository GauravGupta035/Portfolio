import { Project, Skill } from "./model";

export const projectList: Array<Project> = [
    {
        id: 1,
        name: 'GenieSpeaks',
        description: 'It is one-stop shop for reviews for tech products aggregated from websites like Amazon and Flipkart.',
        stack: 'REACTJS',
        link: new URL('https://github.com/GauravGupta035/PD_GenieSpeaks')
    },
    {
        id: 2,
        name: 'Smart Notes',
        description: 'Mobile application that aims to provide concise and thoroughly explained notes to students.',
        stack: 'FLUTTER',
        link: new URL('https://github.com/shivansh1012/SmartNotes')
    },
    {
        id: 3,
        name: 'News Aggregator',
        description: 'An application to scrape latest news articles of various fields according to user interests and send scheduled emails to their respective email IDs.',
        stack: 'PYTHON',
        link: new URL('https://github.com/GauravGupta035/PyNewsAggregator')
    },
    {
        id: 4,
        name: 'Plagiarism Detector',
        description: 'Application to help users detect plagiarism between two documents using Knuth Morris Pratt (KMP) Algorithm.',
        stack: 'PYTHON',
        link: new URL('https://github.com/GauravGupta035/PlagiarismDetector')
    }
]

export const skillList1: Array<Skill> = [
    {
        id: 1,
        name: 'ReactJS'
    },
    {
        id: 2,
        name: 'Flutter/Dart'
    },
    {
        id: 3,
        name: 'Docker'
    },
    {
        id: 4,
        name: 'AWS'
    },
    {
        id: 5,
        name: 'OCI'
    },
    {
        id: 6,
        name: 'Amazon S3'
    }
]

export const skillList2: Array<Skill> = [
    {
        id: 1,
        name: 'Python'
    },
    {
        id: 2,
        name: 'Kubernetes'
    },
    {
        id: 3,
        name: 'Jira'
    },
    {
        id: 4,
        name: 'Confluence'
    },
    {
        id: 5,
        name: 'SQL'
    },
    {
        id: 6,
        name: 'MongoDB'
    },
]

export const skillList3: Array<Skill> = [
    {
        id: 1,
        name: 'Javascript'
    },
    {
        id: 2,
        name: 'Typescript'
    },
    {
        id: 3,
        name: 'C++'
    },
    {
        id: 4,
        name: 'Git'
    },
    {
        id: 5,
        name: 'GitHub'
    },
    {
        id: 6,
        name: 'Figma'
    },
]