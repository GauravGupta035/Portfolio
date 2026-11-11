import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  TextureLoader,
  Vector2,
  Vector4,
  type Mesh,
  type ShaderMaterial,
  type Texture,
} from 'three';
import fragmentShader from './liquid.frag.glsl?raw';
import vertexShader from './liquid.vert.glsl?raw';
import type { LiquidHoverStore } from './store';

// Seconds for the ripple to build on enter and to settle after leave.
const rise = 0.25;
const settle = 0.6;

const loader = new TextureLoader();
const textures = new Map<string, Texture>();

/** One texture per image source, kept for the page's life so a second hover starts at once. The
 * canvas is `linear` and the texture has no colour space, so the pixels match the still image. */
function textureFor(src: string, onLoad: () => void): Texture {
  let texture = textures.get(src);
  if (!texture) {
    texture = loader.load(src, onLoad);
    textures.set(src, texture);
  }
  return texture;
}

const loaded = (texture: Texture) => {
  const image = texture.image as HTMLImageElement | undefined;
  return !!image && image.complete && image.naturalWidth > 0;
};

export interface LiquidSceneProps {
  store: LiquidHoverStore;
}

function Ripple({ store }: LiquidSceneProps) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const strength = useRef(0);
  const uniforms = useMemo(
    () => ({
      uImage: { value: null as Texture | null },
      uRect: { value: new Vector4() },
      uPointer: { value: new Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uStrength: { value: 0 },
      uAspect: { value: 1 },
      uCover: { value: new Vector2(1, 1) },
    }),
    [],
  );

  useEffect(() => {
    invalidate();
    return store.onWake(invalidate);
  }, [store, invalidate]);

  useFrame(({ clock }, delta) => {
    const shader = material.current;
    const quad = mesh.current;
    const image = store.target;
    if (!shader || !quad) return;

    const step = Math.min(delta, 0.1);
    strength.current = store.hovering
      ? Math.min(1, strength.current + step / rise)
      : Math.max(0, strength.current - step / settle);

    const texture = image ? textureFor(image.currentSrc || image.src, invalidate) : null;
    if (!image || !texture || !loaded(texture) || strength.current === 0) {
      quad.visible = false;
      gl.domElement.setAttribute('data-rippling', 'false');
      if (store.hovering) invalidate();
      return;
    }

    const canvas = gl.domElement.getBoundingClientRect();
    const box = image.getBoundingClientRect();
    const width = Math.max(canvas.width, 1);
    const height = Math.max(canvas.height, 1);
    shader.uniforms.uRect.value.set(
      (box.left - canvas.left) / width,
      (canvas.bottom - box.bottom) / height,
      box.width / width,
      box.height / height,
    );
    shader.uniforms.uPointer.value.set(
      (store.pointer.x - box.left) / Math.max(box.width, 1),
      1 - (store.pointer.y - box.top) / Math.max(box.height, 1),
    );

    const boxAspect = box.width / Math.max(box.height, 1);
    const source = texture.image as HTMLImageElement;
    const imageAspect = source.naturalWidth / source.naturalHeight;
    shader.uniforms.uCover.value.set(
      imageAspect > boxAspect ? boxAspect / imageAspect : 1,
      imageAspect > boxAspect ? 1 : imageAspect / boxAspect,
    );
    shader.uniforms.uAspect.value = boxAspect;
    shader.uniforms.uImage.value = texture;
    shader.uniforms.uTime.value = clock.getElapsedTime();
    shader.uniforms.uStrength.value = strength.current;
    quad.visible = true;
    gl.domElement.setAttribute('data-rippling', 'true');
    // Keep drawing until the surface is still; the last frame then clears the canvas.
    invalidate();
  });

  return (
    <mesh ref={mesh} frustumCulled={false} visible={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/** The one R3F canvas shared by every blog card. Loaded on its own, so three.js and the shader
 * stay out of the main chunk. It only draws while a card is hovered or settling. */
export default function LiquidScene({ store }: LiquidSceneProps) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
      flat
      linear
      frameloop="demand"
      style={{ pointerEvents: 'none' }}
    >
      <Ripple store={store} />
    </Canvas>
  );
}
