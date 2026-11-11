import styles from './ProgressIndicator.module.css';

type ProgressIndicatorProps = {
  /** 1-based position of the current step. */
  current: number;
  total: number;
  /** Word for one step, read out as "<label> 1 of 3". */
  label: string;
};

const pad = (value: number) => String(value).padStart(2, '0');

/** Feedback / Progress Indicator: "01/03" beside a hairline track filled up to the current step. */
export function ProgressIndicator({ current, total, label }: ProgressIndicatorProps) {
  return (
    <p className={styles.indicator}>
      <span className={styles.count} aria-hidden="true">
        {pad(current)}/{pad(total)}
      </span>
      <span className={styles.hidden}>{`${label} ${current} of ${total}`}</span>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.fill} style={{ width: `${(current / total) * 100}%` }} />
      </span>
    </p>
  );
}
