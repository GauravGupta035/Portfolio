import { lazy, Suspense, useEffect, useState } from 'react';
import { SceneBoundary } from '../SceneBoundary';
import { introMode, markIntroSeen, type IntroMode } from './session';
import styles from './WaterLoader.module.css';

const WaterScene = lazy(() => import('./WaterScene'));

// Timings in ms from the loader mounting.
const drainDuration = 1500;
const minDrain = 600;
const fadeOut = 300;
/** The whole intro is gone by this point, however slow the device or the chunk. */
export const loaderCap = 2500;
const fallbackFade = 400;

type Phase = 'cover' | 'draining' | 'fading' | 'done';

/** The intro: water covers the page on the first visit of a session, then drains to reveal the
 * hero. The hero renders underneath from the start; this only ever sits on top of it. */
export function WaterLoader() {
  const [mode] = useState<IntroMode>(() => introMode());
  return mode === 'none' ? null : <Intro mode={mode} />;
}

function Intro({ mode }: { mode: Exclude<IntroMode, 'none'> }) {
  const [phase, setPhase] = useState<Phase>('cover');
  const [mountedAt] = useState(() => performance.now());

  useEffect(() => {
    markIntroSeen();
    const timer =
      mode === 'water'
        ? window.setTimeout(
            () => setPhase((p) => (p === 'done' ? p : 'fading')),
            loaderCap - fadeOut,
          )
        : window.setTimeout(() => setPhase('done'), fallbackFade);
    return () => window.clearTimeout(timer);
  }, [mode]);

  useEffect(() => {
    if (phase !== 'fading') return;
    const timer = window.setTimeout(() => setPhase('done'), fadeOut);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === 'done') return null;

  // Read on the first frame: a late frame gets a shorter drain, so the water still clears before
  // the cap.
  const drain = () =>
    Math.max(
      minDrain,
      Math.min(drainDuration, loaderCap - fadeOut - (performance.now() - mountedAt)),
    );

  return (
    <div
      className={styles.loader}
      data-testid="intro-loader"
      data-mode={mode}
      data-phase={phase}
      aria-hidden="true"
    >
      {mode === 'water' && (
        <SceneBoundary onError={() => setPhase('fading')}>
          <Suspense fallback={null}>
            <WaterScene
              duration={drain}
              onReady={() => setPhase((p) => (p === 'cover' ? 'draining' : p))}
              onDone={() => setPhase('done')}
            />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
