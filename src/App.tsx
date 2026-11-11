import { lazy, Suspense } from 'react';
import { useSmoothScroll } from './motion';
import { About } from './sections/About';
import { Blog } from './sections/Blog';
import { Contact } from './sections/Contact';
import { Experience } from './sections/Experience';
import { Hero } from './sections/Hero';
import { Nav } from './sections/Nav';
import { ProjectDetail } from './sections/ProjectDetail';
import { Projects } from './sections/Projects';

const GridOverlay = lazy(() =>
  import('./components/GridOverlay').then((module) => ({ default: module.GridOverlay })),
);

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
        <Experience />
        <Blog />
        <About />
        <Contact />
      </main>
      {showGrid() && (
        <Suspense fallback={null}>
          <GridOverlay />
        </Suspense>
      )}
    </>
  );
}
