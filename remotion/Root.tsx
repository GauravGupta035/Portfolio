import { Composition } from 'remotion';
import { projects } from '../src/content/projects';
import { compositionId, durationInFrames, fps, previewSize } from './config';
import { ProjectPreview } from './ProjectPreview';

export function Root() {
  return (
    <>
      {projects.map((project) => (
        <Composition
          key={project.id}
          id={compositionId(project.id)}
          component={ProjectPreview}
          defaultProps={{ projectId: project.id }}
          durationInFrames={durationInFrames}
          fps={fps}
          {...previewSize}
        />
      ))}
    </>
  );
}
