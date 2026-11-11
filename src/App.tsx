import { lazy, Suspense } from 'react';
import { navigation } from './content';
import { Hero } from './sections/Hero';
import { Nav } from './sections/Nav';
import styles from './App.module.css';

const GridOverlay = lazy(() =>
  import('./components/GridOverlay').then((module) => ({ default: module.GridOverlay })),
);

// The overlay ships in every build so it can be checked on the deployed site,
// but it only loads when the URL has a `?grid` flag.
const showGrid = () => new URLSearchParams(window.location.search).has('grid');

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* Placeholders so nav links have targets until each section ships. */}
        {navigation.links.map(({ label, sectionId }) => (
          <section key={sectionId} id={sectionId} aria-label={label} className={styles.section} />
        ))}
      </main>
      {showGrid() && (
        <Suspense fallback={null}>
          <GridOverlay />
        </Suspense>
      )}
    </>
  );
}
