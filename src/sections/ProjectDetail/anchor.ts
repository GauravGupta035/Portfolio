import type { Project } from '../../content';

/** The id of a project's detail block, which its index row links to. */
export const projectAnchor = (project: Pick<Project, 'id'>) => `project-${project.id}`;
