import {
  OrganicMask,
  OrganicShape,
  organicShapes,
  useMorphPath,
  wobblePath,
} from '../../components/OrganicShape';
import { navigation, profile } from '../../content';
import styles from './Hero.module.css';
import { usePortraitSequence } from './usePortraitSequence';

const frames = [profile.portrait.src, ...profile.portraitHoverFrames];

// Frame 01 keeps the Figma outline; every later frame nudges the blob a little.
const maskPaths = frames.map((_, index) =>
  index === 0
    ? organicShapes.portrait.path
    : wobblePath('portrait', { amount: 0.025, phase: index * 1.9 }),
);

export function Hero() {
  const { portrait } = profile;
  const { frame, preload, handlers } = usePortraitSequence(frames.length);
  const maskPath = useMorphPath(maskPaths[frame], 300);
  return (
    <section className={styles.hero} aria-labelledby="hero-name">
      <h1 id="hero-name" className={styles.name}>
        {profile.name}
      </h1>
      <OrganicMask
        shape="portrait"
        path={maskPath}
        className={styles.portrait}
        tabIndex={0}
        {...handlers}
      >
        {frames.map(
          (src, index) =>
            (index === 0 || preload) && (
              <img
                key={src}
                className={styles.image}
                src={`${import.meta.env.BASE_URL}${src}`}
                alt={portrait.alt}
                aria-hidden={index === frame ? undefined : true}
                data-active={index === frame}
                width={1200}
                height={1600}
                fetchPriority={index === 0 ? 'high' : 'low'}
              />
            ),
        )}
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
