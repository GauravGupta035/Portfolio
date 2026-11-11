import { OrganicMask, OrganicShape } from '../../components/OrganicShape';
import { navigation, profile } from '../../content';
import styles from './Hero.module.css';

export function Hero() {
  const { portrait } = profile;
  return (
    <section className={styles.hero} aria-labelledby="hero-name">
      <h1 id="hero-name" className={styles.name}>
        {profile.name}
      </h1>
      <OrganicMask shape="portrait" className={styles.portrait}>
        <img
          className={styles.image}
          src={`${import.meta.env.BASE_URL}${portrait.src}`}
          alt={portrait.alt}
          width={1200}
          height={1600}
          fetchPriority="high"
        />
      </OrganicMask>
      <p className={styles.role}>{profile.role}</p>
      <a className={styles.scroll} href={`#${navigation.links[0].sectionId}`}>
        <OrganicShape shape="scroll" className={styles.scrollShape} />
        <span className={styles.scrollLabel}>{navigation.scrollLabel}</span>
        <svg
          className={styles.scrollArrow}
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M8 1v14M2 9l6 6 6-6" />
        </svg>
      </a>
      <hr className={styles.rule} />
      <dl className={styles.metadata}>
        {profile.heroMetadata.map(({ label, lines }) => (
          <div key={label} className={styles.metadataBlock}>
            <dt className={styles.metadataLabel}>{label}</dt>
            {lines.map((line) => (
              <dd key={line}>{line}</dd>
            ))}
          </div>
        ))}
      </dl>
    </section>
  );
}
