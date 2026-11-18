import { useEffect, useRef } from 'react';
import type { SkillCategory } from '../../content';
import { loadScrollMotion } from '../../motion';
import styles from './SkillLedger.module.css';

// Rows only fade in while the visitor allows motion. Otherwise, or before the
// motion chunk loads, they are simply shown.
const revealQuery = '(prefers-reduced-motion: no-preference)';

type SkillLedgerProps = {
  categories: readonly SkillCategory[];
  /** Accessible name for the list of categories. */
  label: string;
  className?: string;
};

/** About / Skill Ledger: one row per category, its name beside its skill tags. */
export function SkillLedger({ categories, label, className }: SkillLedgerProps) {
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const element = list.current;
    if (!element || !window.matchMedia) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    void loadScrollMotion().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const media = gsap.matchMedia();
      media.add(revealQuery, () => {
        // Each row waits below its place until it scrolls into view. Rows that
        // enter together rise one after another.
        const rows = gsap.utils.toArray<HTMLElement>(element.children);
        gsap.set(rows, { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(rows, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.1 }),
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
    <ul
      ref={list}
      className={`${styles.ledger}${className ? ` ${className}` : ''}`}
      aria-label={label}
    >
      {categories.map(({ category, skills }) => (
        <li key={category} className={styles.row}>
          <h3 className={styles.label}>{category}</h3>
          <ul className={styles.skills} aria-label={`${category} skills`}>
            {skills.map((skill) => (
              <li key={skill} className={styles.skill}>
                {skill}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
