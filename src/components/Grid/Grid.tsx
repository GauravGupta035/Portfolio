import type { ComponentPropsWithoutRef, ElementType } from 'react';
import styles from './Grid.module.css';

type GridProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

/** Page layout grid: 12 columns, 16px gutters, 50px margins at 1440px. */
export function Grid<T extends ElementType = 'div'>({ as, className, ...props }: GridProps<T>) {
  const Component: ElementType = as ?? 'div';
  return (
    <Component className={className ? `${styles.grid} ${className}` : styles.grid} {...props} />
  );
}
