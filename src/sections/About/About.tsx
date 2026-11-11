import { useEffect, useRef } from 'react';
import { CapabilityCard } from '../../components/CapabilityCard';
import { SocialLinks } from '../../components/SocialLinks';
import { aboutSection, profile, skillCategories } from '../../content';
import { loadScrollMotion } from '../../motion';
import styles from './About.module.css';

// The cards slide into their wall from 768px up. Below that, or with reduced
// motion, they stay put: in the wall, or in a rail that scrolls sideways.
export const entranceQuery = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

// Share of the entrance each card takes to slide in. The rest of the entrance
// staggers the cards' starts, so they arrive one after another in content order.
const slide = 0.6;

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
      media.add(entranceQuery, () => {
        // Every card starts just past the right edge of the viewport. The
        // entrance runs from the section's top at the bottom of the viewport
        // to its bottom there, before the contact heading below comes into view.
        const slots = gsap.utils.toArray<HTMLElement>(list.children);
        const offscreen = (slot: HTMLElement) =>
          window.innerWidth -
          slot.getBoundingClientRect().left +
          (Number(gsap.getProperty(slot, 'x')) || 0);
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        const stagger = slots.length > 1 ? (1 - slide) / (slots.length - 1) : 0;
        slots.forEach((slot, index) => {
          timeline.fromTo(
            slot,
            { x: () => offscreen(slot) },
            { x: 0, duration: slide, ease: 'power2.out' },
            index * stagger,
          );
        });
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
          {skillCategories.map((category) => (
            <li key={category.category} className={styles.slot}>
              <CapabilityCard category={category} />
            </li>
          ))}
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
