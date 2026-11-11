import type { Project } from '../../content';
import styles from './ProjectIndexRow.module.css';

type ProjectIndexRowProps = {
  project: Pick<Project, 'name' | 'category' | 'stack'>;
  /** The project's detail block, for example `#project-1`. */
  href: string;
};

/** Project / Index - Row: name, category and stack, linking to the detail block. */
export function ProjectIndexRow({ project, href }: ProjectIndexRowProps) {
  return (
    <a className={styles.row} href={href}>
      <span className={styles.name}>{project.name}</span>
      <span className={styles.category}>{project.category}</span>
      <span className={styles.stack}>{project.stack}</span>
    </a>
  );
}
