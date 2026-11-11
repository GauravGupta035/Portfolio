import { lazy, Suspense, useCallback, useMemo, useState, type ReactNode } from 'react';
import { SceneBoundary } from '../SceneBoundary';
import { Context } from './context';
import styles from './LiquidHover.module.css';
import { LiquidHoverStore } from './store';
import { liquidHoverSupported } from './support';

const LiquidScene = lazy(() => import('./LiquidScene'));

/** Gives the cards inside it a liquid hover on their images, drawn by one lazily loaded WebGL
 * canvas laid over them. Without a fine pointer, with reduced motion or without WebGL it renders
 * only its children. */
export function LiquidHoverProvider({ children }: { children: ReactNode }) {
  const [supported] = useState(() => liquidHoverSupported());
  const [booted, setBooted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [store] = useState(() => new LiquidHoverStore());
  const boot = useCallback(() => setBooted(true), []);
  const context = useMemo(() => (supported ? { store, boot } : null), [supported, store, boot]);

  return (
    <Context value={context}>
      <div className={styles.root}>
        {children}
        {booted && !failed && (
          <div className={styles.layer} data-testid="liquid-hover" aria-hidden="true">
            <SceneBoundary onError={() => setFailed(true)}>
              <Suspense fallback={null}>
                <LiquidScene store={store} />
              </Suspense>
            </SceneBoundary>
          </div>
        )}
      </div>
    </Context>
  );
}
