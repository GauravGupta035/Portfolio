import { lazy, Suspense } from 'react';
import { navigation, type SectionId } from './content';
import { useSmoothScroll } from './motion';
import { Hero } from './sections/Hero';
import { Nav } from './sections/Nav';
import { ProjectDetail } from './sections/ProjectDetail';
import { Projects } from './sections/Projects';
import styles from './App.module.css';

const GridOverlay = lazy(() =>
  import('./components/GridOverlay').then((module) => ({ default: module.GridOverlay })),
);

const shippedSections = new Set<SectionId>(['projects']);

// The overlay ships in every build so it can be checked on the deployed site,
// but it only loads when the URL has a `?grid` flag.
const showGrid = () => new URLSearchParams(window.location.search).has('grid');

export function App() {
  useSmoothScroll();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <ProjectDetail />
        {/* Placeholders so nav links have targets until each section ships. */}
        {navigation.links
          .filter(({ sectionId }) => !shippedSections.has(sectionId))
          .map(({ label, sectionId }) => (
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
