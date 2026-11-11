import { lazy, Suspense } from 'react';

const GridOverlay = lazy(() =>
  import('./components/GridOverlay').then((module) => ({ default: module.GridOverlay })),
);

// The overlay ships in every build so it can be checked on the deployed site,
// but it only loads when the URL has a `?grid` flag.
const showGrid = () => new URLSearchParams(window.location.search).has('grid');

export function App() {
  return (
    <>
      <main />
      {showGrid() && (
        <Suspense fallback={null}>
          <GridOverlay />
        </Suspense>
      )}
    </>
  );
}
