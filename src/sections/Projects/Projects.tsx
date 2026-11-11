import { ProjectIndexRow } from '../../components/ProjectIndexRow';
import { projects, projectsSection } from '../../content';
import { projectAnchor } from '../ProjectDetail';
import styles from './Projects.module.css';

export function Projects() {
  return (
    <section id="projects" className={styles.projects} aria-labelledby="projects-heading">
      <header className={styles.header}>
        <h2 id="projects-heading" className={styles.heading}>
          {projectsSection.heading}
        </h2>
        <hr className={styles.rule} />
        <p className={styles.range}>{projectsSection.range}</p>
      </header>
      <ul className={styles.list}>
        {projects.map((project) => (
          <li key={project.id} className={styles.item}>
            <ProjectIndexRow project={project} href={`#${projectAnchor(project)}`} />
          </li>
        ))}
      </ul>
    </section>
  );
}
