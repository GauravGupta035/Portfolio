import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color, type ShaderMaterial } from 'three';
import { colorPrimitives } from '../../tokens/color';
import fragmentShader from './water.frag.glsl?raw';
import vertexShader from './water.vert.glsl?raw';

// three stores colours in linear space, but the canvas is `linear` and the shader writes its
// colours as is, so hand it the sRGB values the tokens name.
const tokenColor = (name: keyof typeof colorPrimitives) =>
  new Color(colorPrimitives[name]).convertLinearToSRGB();

export interface WaterSceneProps {
  /** How long the drain runs, in ms, asked once when the first frame is up. */
  duration: () => number;
  onReady: () => void;
  onDone: () => void;
}

function Water({ duration, onReady, onDone }: WaterSceneProps) {
  const size = useThree((state) => state.size);
  const start = useRef<number | undefined>(undefined);
  const length = useRef(1);
  const finished = useRef(false);
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uAspect: { value: 1 },
      uDeep: { value: tokenColor('violet-500') },
      uShallow: { value: tokenColor('violet-600') },
      uFoam: { value: tokenColor('neutral-00') },
    }),
    [],
  );

  useFrame(({ clock }) => {
    const shader = material.current;
    if (!shader) return;
    const now = clock.getElapsedTime() * 1000;
    if (start.current === undefined) {
      start.current = now;
      length.current = duration();
      onReady();
    }
    const progress = Math.min((now - start.current) / length.current, 1);
    shader.uniforms.uTime.value = now / 1000;
    shader.uniforms.uProgress.value = progress;
    shader.uniforms.uAspect.value = size.width / Math.max(size.height, 1);
    if (progress >= 1 && !finished.current) {
      finished.current = true;
      onDone();
    }
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        premultipliedAlpha
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/** The R3F canvas for the water intro. Loaded on its own, so three.js stays out of the main chunk. */
export default function WaterScene(props: WaterSceneProps) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power', premultipliedAlpha: true }}
      dpr={[1, 1.5]}
      flat
      linear
      // R3F sets pointer-events on its wrapper; the page under the water stays clickable.
      style={{ pointerEvents: 'none' }}
    >
      <Water {...props} />
    </Canvas>
  );
}
