import type { Metric as MetricData } from '../../content';
import styles from './Metric.module.css';

/** Data / Metric: a value in Data L over its label. Render inside a `<dl>`. */
export function Metric({ value, label }: MetricData) {
  return (
    <div className={styles.metric}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  );
}
