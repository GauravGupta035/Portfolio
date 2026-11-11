import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { projects } from '../src/content/projects';
import { projectsSection } from '../src/content/projectsSection';
import { colorPrimitives, semanticColors } from '../src/tokens/color';
import { fontFamily, typeStyles } from '../src/tokens/type';

const dark = semanticColors.dark;
const color = {
  page: colorPrimitives[dark['background-page']],
  text: colorPrimitives[dark['text-primary']],
  secondary: colorPrimitives[dark['text-secondary']],
  accent: colorPrimitives[dark['accent-primary']],
  border: colorPrimitives[dark['border-default']],
};

const type = (name: keyof typeof typeStyles) => ({
  fontSize: typeStyles[name].size,
  fontWeight: typeStyles[name].weight,
  letterSpacing: 0,
  lineHeight: 'normal',
});

// The organic outline as polar radii, wobbled by phase so the shape breathes without repeating
// within a loop.
function blobPath(cx: number, cy: number, radius: number, phase: number) {
  const steps = 48;
  const points = Array.from({ length: steps }, (_, step) => {
    const angle = (step / steps) * Math.PI * 2;
    const r =
      radius *
      (1 +
        0.08 * Math.sin(angle * 3 + phase) +
        0.05 * Math.sin(angle * 5 - phase * 2) +
        0.03 * Math.cos(angle * 2 + phase * 3));
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  return `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`;
}

/** 0 to 1 and back, eased, peaking in the middle of each item's turn. */
function spotlight(progress: number, index: number, count: number) {
  const distance = Math.abs(((progress * count - index + count + 0.5) % count) - 0.5);
  return Math.max(0, Math.cos(Math.min(distance, 1) * Math.PI) * 0.5 + 0.5);
}

export function ProjectPreview({ projectId }: { projectId: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const project = projects.find((candidate) => candidate.id === projectId);
  if (!project) throw new Error(`No project with id ${projectId}`);

  // Every motion is periodic over the composition, so the last frame runs into the first and
  // frame 0 doubles as the poster.
  const progress = frame / durationInFrames;
  const phase = progress * Math.PI * 2;
  const items = project.metrics
    ? project.metrics.map((metric) => ({ value: metric.value, label: metric.label }))
    : project.techRail.map((tech) => ({ value: tech, label: projectsSection.techRailLabel }));

  return (
    <AbsoluteFill style={{ backgroundColor: color.page, color: color.text, fontFamily }}>
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
        <path
          d={blobPath(width - 170, 170, 120, phase)}
          fill="none"
          stroke={color.accent}
          strokeWidth={2}
        />
        <path
          d={blobPath(width - 170, 170, 64, -phase + Math.PI)}
          fill={color.accent}
          transform={`rotate(${Math.sin(phase) * 12} ${width - 170} 170)`}
        />
      </svg>
      <div style={{ position: 'absolute', top: 48, left: 48, right: 340 }}>
        <p style={{ ...type('data-m'), margin: 0, color: color.accent }}>{project.year}</p>
        <h1
          style={{
            ...type('heading-l'),
            margin: '16px 0 0',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          {project.name}
        </h1>
        <p style={{ ...type('body-s'), margin: '16px 0 0', color: color.secondary }}>
          {project.category}
        </p>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 48,
          right: 48,
          bottom: 48,
          display: 'flex',
          gap: 32,
          borderTop: `1px solid ${color.border}`,
          paddingTop: 24,
        }}
      >
        {items.map((item, index) => {
          const lit = items.length === 1 ? 1 : spotlight(progress, index, items.length);
          return (
            <div key={item.value} style={{ flex: 1, minWidth: 0, opacity: 0.35 + lit * 0.65 }}>
              <div
                style={{
                  height: 2,
                  marginTop: -25,
                  marginBottom: 23,
                  backgroundColor: color.accent,
                  transform: `scaleX(${lit})`,
                  transformOrigin: 'left',
                }}
              />
              <p style={{ ...type('data-l'), margin: 0, whiteSpace: 'nowrap' }}>{item.value}</p>
              <p style={{ ...type('meta'), margin: '4px 0 0', color: color.secondary }}>
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
