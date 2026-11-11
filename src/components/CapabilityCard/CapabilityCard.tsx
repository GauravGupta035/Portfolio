import type { SkillCategory } from '../../content';
import styles from './CapabilityCard.module.css';

type CapabilityCardProps = {
  category: SkillCategory;
  className?: string;
};

/** About / Capability Card: a dark card with the category, its illustration and one tag per skill. */
export function CapabilityCard({ category, className }: CapabilityCardProps) {
  const { category: title, skills, illustration } = category;
  return (
    <article className={`surface-dark ${styles.card}${className ? ` ${className}` : ''}`}>
      <h3 className={styles.title}>{title}</h3>
      {illustration && (
        <img
          className={styles.illustration}
          src={`${import.meta.env.BASE_URL}${illustration.src}`}
          alt={illustration.alt}
          width={348}
          height={420}
          loading="lazy"
          decoding="async"
        />
      )}
      <ul className={styles.skills} aria-label={`${title} skills`}>
        {skills.map((skill) => (
          <li key={skill} className={styles.skill}>
            {skill}
          </li>
        ))}
      </ul>
    </article>
  );
}
