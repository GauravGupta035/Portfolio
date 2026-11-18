import { AbsoluteFill, Img, staticFile } from 'remotion';
import { organicShapes } from '../src/components/OrganicShape/shapes';
import { profile } from '../src/content/profile';
import { socialPreviewSize } from './config';
import { colorPrimitives, semanticColors } from '../src/tokens/color';
import { fontFamily, typeStyles } from '../src/tokens/type';

const light = semanticColors.light;
const color = {
  page: colorPrimitives[light['background-page']],
  text: colorPrimitives[light['text-primary']],
  accent: colorPrimitives[light['accent-primary']],
};

const type = (name: keyof typeof typeStyles) => ({
  fontSize: typeStyles[name].size,
  fontWeight: typeStyles[name].weight,
  letterSpacing: 0,
  lineHeight: 'normal',
});

const { width: shapeWidth, height: shapeHeight, path } = organicShapes.portrait;
// The hero portrait at 1.3x, so it fills most of the card's height.
const portrait = { width: shapeWidth * 1.3, height: shapeHeight * 1.3 };

/** The link preview card: the hero's name, role and portrait on the light page background. */
export function SocialPreview() {
  return (
    <AbsoluteFill style={{ backgroundColor: color.page, color: color.text, fontFamily }}>
      <div style={{ position: 'absolute', left: 50, bottom: 64, textTransform: 'uppercase' }}>
        <h1 style={{ ...type('display-2xl'), margin: 0, lineHeight: 0.9 }}>
          {profile.name.split(' ').map((word) => (
            <span key={word} style={{ display: 'block' }}>
              {word}
            </span>
          ))}
        </h1>
        <p style={{ ...type('subtitle-l'), margin: '24px 0 0' }}>{profile.role}</p>
      </div>
      <svg
        width={portrait.width}
        height={portrait.height}
        viewBox={`0 0 ${shapeWidth} ${shapeHeight}`}
        style={{
          position: 'absolute',
          right: 50,
          top: (socialPreviewSize.height - portrait.height) / 2,
        }}
      >
        <defs>
          <clipPath id="portrait">
            <path d={path} />
          </clipPath>
        </defs>
        <foreignObject width={shapeWidth} height={shapeHeight} clipPath="url(#portrait)">
          <Img
            src={staticFile(profile.portrait.src)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)' }}
          />
        </foreignObject>
        <path d={path} fill="none" stroke={color.accent} strokeWidth={2 / 1.3} />
      </svg>
    </AbsoluteFill>
  );
}
