import { Metric } from '../../components/Metric';
import { NavLink } from '../../components/NavLink';
import { TechRail } from '../../components/TechRail';
import { projects, projectsSection, type Project } from '../../content';
import { projectAnchor } from './anchor';
import { PreviewVideo } from './PreviewVideo';
import styles from './ProjectDetail.module.css';

function ProjectBlock({ project }: { project: Project }) {
  const anchor = projectAnchor(project);
  return (
    <article id={anchor} className={styles.block} aria-labelledby={`${anchor}-title`}>
      <h3 id={`${anchor}-title`} className={styles.title}>
        {project.name}
      </h3>
      {project.subtitle && <p className={styles.subtitle}>{project.subtitle}</p>}
      <div className={styles.meta}>
        <p className={styles.year}>{project.year}</p>
        {project.sourceUrl && (
          <NavLink
            className={styles.source}
            href={project.sourceUrl}
            external
            aria-label={`${projectsSection.viewSourceLabel}, ${project.name}`}
          >
            {projectsSection.viewSourceLabel}
          </NavLink>
        )}
      </div>
      <p className={styles.description}>{project.description}</p>
      {project.metrics && (
        <dl className={styles.metrics}>
          {project.metrics.map((metric) => (
            <Metric key={metric.label} {...metric} />
          ))}
        </dl>
      )}
      <PreviewVideo
        className={styles.preview}
        preview={project.preview}
        label={`${projectsSection.previewLabel}, ${project.name}`}
      />
      <TechRail
        className={styles.rail}
        items={project.techRail}
        label={`${projectsSection.techRailLabel}, ${project.name}`}
      />
    </article>
  );
}

export function ProjectDetail() {
  return (
    <section className={`surface-dark ${styles.detail}`} aria-label={projectsSection.detailLabel}>
      {projects.map((project) => (
        <ProjectBlock key={project.id} project={project} />
      ))}
    </section>
  );
}
