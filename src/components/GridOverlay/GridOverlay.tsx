import { grid } from '../../tokens';
import { Grid } from '../Grid';
import styles from './GridOverlay.module.css';

/** Developer aid that draws the layout columns over the page. */
export function GridOverlay() {
  return (
    <div className={styles.overlay} aria-hidden="true" data-testid="grid-overlay">
      <Grid className={styles.grid}>
        {Array.from({ length: grid.desktop.columns }, (_, index) => (
          <div key={index} className={styles.column} data-testid="grid-column" />
        ))}
      </Grid>
    </div>
  );
}
