import { useEffect, useRef, type CSSProperties } from 'react';
import { CapabilityCard } from '../../components/CapabilityCard';
import { SocialLinks } from '../../components/SocialLinks';
import { aboutSection, profile, skillCategories } from '../../content';
import { loadScrollMotion } from '../../motion';
import styles from './About.module.css';

// Tilt and drift are a wide-screen effect. Below 768px, or with reduced
// motion, the cards stay upright in a rail that scrolls by swipe or scrollbar.
export const driftQuery = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

// Each card's resting pose in Figma Page 1 at 1440px: its rotation in degrees,
// how far it sits below the rail top and, for the first card, how far it is
// pulled under the social column. Cards past the fifth reuse the poses.
const poses = [
  { tilt: -38, drop: 0, shift: -48 },
  { tilt: -12, drop: 39, shift: 0 },
  { tilt: 0, drop: 54, shift: 0 },
  { tilt: 18, drop: 66, shift: 0 },
  { tilt: -8, drop: 30, shift: 0 },
];

// Degrees each card turns off its Figma tilt as the section enters. It reaches the
// tilt at the Figma pose and twice this the other way as the section leaves.
const sway = 3;

const cvFile = profile.cvPath.split('/').pop();

export function About() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const element = section.current;
    const list = track.current;
    if (!element || !list || !window.matchMedia) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    void loadScrollMotion().then(({ gsap }) => {
      if (cancelled) return;
      const media = gsap.matchMedia();
      media.add(driftQuery, () => {
        // The rail drifts left while the section crosses the viewport: the
        // first card shows whole as it enters, the Figma pose a third of the
        // way through and the last card whole as it leaves.
        const overflow = () =>
          Math.max(list.scrollWidth - (list.parentElement?.clientWidth ?? 0), 0);
        const scrollTrigger = {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        };
        gsap.fromTo(
          list,
          { x: () => overflow() / 2 },
          { x: () => -overflow(), ease: 'none', scrollTrigger },
        );
        gsap.fromTo(
          list.querySelectorAll('article'),
          { rotation: sway },
          { rotation: -2 * sway, ease: 'none', scrollTrigger },
        );
      });
      revert = () => media.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <section ref={section} id="about" className={styles.about} aria-labelledby="about-heading">
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
      <div className={styles.rail}>
        <ul ref={track} className={styles.track} aria-label={aboutSection.cardsLabel}>
          {skillCategories.map((category, index) => {
            const { tilt, drop, shift } = poses[index % poses.length];
            return (
              <li
                key={category.category}
                className={styles.slot}
                style={
                  {
                    '--tilt': `${tilt}deg`,
                    '--drop': `${drop}px`,
                    '--shift': `${shift}px`,
                  } as CSSProperties
                }
              >
                <CapabilityCard category={category} />
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.side}>
        <SocialLinks
          className={styles.socials}
          socials={profile.socials}
          label={aboutSection.socialsLabel}
        />
      </div>
    </section>
  );
}
