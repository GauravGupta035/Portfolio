import type { ComponentPropsWithoutRef } from 'react';
import styles from './NavLink.module.css';

type NavLinkProps = ComponentPropsWithoutRef<'a'> & {
  /** Marks the link for the section in view and shows the active arrow. */
  active?: boolean;
  /** Opens in a new tab and shows the external arrow. */
  external?: boolean;
};

/** Navigation / Link: default, hover (violet underline) and active (arrow) states. */
export function NavLink({ active, external, className, children, ...props }: NavLinkProps) {
  const classes = className ? `${styles.link} ${className}` : styles.link;
  return (
    <a
      className={classes}
      aria-current={active ? 'location' : undefined}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      {...props}
    >
      <span className={styles.label}>{children}</span>
      {(active || external) && (
        <svg
          className={external ? styles.externalArrow : styles.arrow}
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M3 13L13 3M5 3h8v8" />
        </svg>
      )}
    </a>
  );
}
