import type { Experience } from '../../content';
import { ProgressIndicator } from '../ProgressIndicator';
import styles from './ExperienceCard.module.css';

type ExperienceCardProps = {
  experience: Experience;
  /** 1-based position of this card among `total`. */
  position: number;
  total: number;
  progressLabel: string;
  className?: string;
};

/** Experience / Card: role, company and period on the left, achievements on the right. */
export function ExperienceCard({
  experience,
  position,
  total,
  progressLabel,
  className,
}: ExperienceCardProps) {
  const titleId = `experience-${position}-title`;
  return (
    <article
      className={className ? `${styles.card} ${className}` : styles.card}
      aria-labelledby={titleId}
    >
      <div className={styles.inner}>
        <div className={styles.role}>
          <h3 id={titleId} className={styles.title}>
            {experience.title}
          </h3>
          <p className={styles.company}>{experience.company}</p>
          <p className={styles.period}>{experience.period}</p>
        </div>
        <ul className={styles.achievements}>
          {experience.achievements.map((achievement) => (
            <li key={achievement}>{achievement}</li>
          ))}
        </ul>
        <div className={styles.progress}>
          <ProgressIndicator current={position} total={total} label={progressLabel} />
        </div>
      </div>
    </article>
  );
}
