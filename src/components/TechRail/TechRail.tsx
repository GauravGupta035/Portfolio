import styles from './TechRail.module.css';

type TechRailProps = {
  items: readonly string[];
  label: string;
  className?: string;
};

// Enough entries to run the vertical rail the full height of a project block.
const minimumEntries = 16;

/** Project / Tech Rail: the technologies, repeated along a vertical strip. */
export function TechRail({ items, label, className }: TechRailProps) {
  const copies = items.length ? Math.ceil(minimumEntries / items.length) - 1 : 0;
  const repeats = Array.from({ length: copies }, () => items).flat();
  return (
    <ul className={className ? `${styles.rail} ${className}` : styles.rail} aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
      {repeats.map((item, index) => (
        <li key={`repeat-${index}`} className={styles.repeat} aria-hidden="true">
          {item}
        </li>
      ))}
    </ul>
  );
}
