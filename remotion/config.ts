// Shared by the compositions and the render script, which runs in plain Node, so nothing here
// may import from the bundle.

/** 2x the preview slot beside each description in the project detail section. */
export const previewSize = { width: 960, height: 540 };

export const fps = 30;

/** Six seconds, inside the 8 second budget the site allows for a preview loop. */
export const durationInFrames = 6 * fps;

export const compositionId = (projectId: number) => `ProjectPreview-${projectId}`;
