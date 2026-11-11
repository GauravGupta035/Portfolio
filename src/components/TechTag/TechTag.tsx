import type { ComponentPropsWithoutRef } from 'react';
import styles from './TechTag.module.css';

/** Content / Technology Tag: a technology name in a violet hairline box. */
export function TechTag({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span className={className ? `${styles.tag} ${className}` : styles.tag} {...props} />;
}
