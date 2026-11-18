import { SkillLedger } from '../../components/SkillLedger';
import { aboutSection, profile, skillCategories } from '../../content';
import styles from './About.module.css';

const cvFile = profile.cvPath.split('/').pop();

export function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-heading">
      <header className={styles.header}>
        <h2 id="about-heading" className={styles.heading}>
          {aboutSection.heading}
        </h2>
        <div className={styles.intro}>
          <p className={styles.text}>{aboutSection.intro}</p>
          <a
            className={styles.cv}
            href={`${import.meta.env.BASE_URL}${profile.cvPath}`}
            download={cvFile}
          >
            {aboutSection.cvLabel}
            <svg className={styles.cvIcon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M8 2v10M3.5 7.5 8 12l4.5-4.5M2 14.5h12" />
            </svg>
          </a>
        </div>
      </header>
      <SkillLedger
        className={styles.ledger}
        categories={skillCategories}
        label={aboutSection.skillsLabel}
      />
    </section>
  );
}
