import { useEffect, useRef } from 'react';
import { ExperienceCard } from '../../components/ExperienceCard';
import { OrganicShape } from '../../components/OrganicShape';
import { experienceSection, experiences } from '../../content';
import { loadScrollMotion } from '../../motion';
import styles from './Experience.module.css';

// Pinning is a wide-screen effect. Below 768px, or with reduced motion, the
// cards stay a plain list.
const pinQuery = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

export function Experience() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = section.current;
    if (!element || !window.matchMedia) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    void loadScrollMotion().then(({ gsap }) => {
      if (cancelled) return;
      const media = gsap.matchMedia();
      media.add(pinQuery, () => {
        // The stacked layout only applies while the pin is live, so the list
        // is the fallback whenever this code does not run.
        element.dataset.pinned = '';
        const cards = Array.from(element.querySelectorAll<HTMLElement>('[data-card]'));
        const steps = cards.length - 1;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            pin: true,
            start: 'top top',
            end: () => `+=${steps * window.innerHeight}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        // Each card slides up over the one before it, one viewport of scroll per card.
        for (const card of cards.slice(1)) {
          timeline.fromTo(card, { yPercent: 100 }, { yPercent: 0, ease: 'none' });
        }
        return () => {
          delete element.dataset.pinned;
        };
      });
      revert = () => media.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <section
      ref={section}
      id="experience"
      className={styles.experience}
      aria-labelledby="experience-heading"
    >
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <OrganicShape shape="scroll" className={styles.shape} />
          <h2 id="experience-heading" className={styles.heading}>
            {experienceSection.heading}
          </h2>
        </div>
      </header>
      <ol className={styles.cards}>
        {experiences.map((experience, index) => (
          <li key={experience.title} className={styles.item} data-card>
            <ExperienceCard
              className={styles.card}
              experience={experience}
              position={index + 1}
              total={experiences.length}
              progressLabel={experienceSection.progressLabel}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
