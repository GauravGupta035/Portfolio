// The card image, rippling out from the pointer like a touched water surface. uStrength fades
// the whole effect, so at 0 this is the still image.
uniform sampler2D uImage;
uniform vec2 uPointer;
uniform float uTime;
uniform float uStrength;
uniform float uAspect;
// Scales the uvs to match the image's object-fit: cover crop.
uniform vec2 uCover;

varying vec2 vUv;

void main() {
  vec2 delta = vUv - uPointer;
  delta.x *= uAspect;
  float d = length(delta);

  // Rings that travel out from the pointer and die away with distance.
  float wave = sin(d * 38.0 - uTime * 9.0) * exp(-d * 4.5);
  vec2 dir = d > 0.0001 ? delta / d : vec2(0.0);
  dir.x /= uAspect;
  vec2 uv = vUv + dir * wave * 0.016 * uStrength;

  // A slow swell across the whole surface, so it reads as liquid and not a lens.
  uv += 0.004 * uStrength * vec2(sin(vUv.y * 12.0 + uTime * 2.0), cos(vUv.x * 10.0 + uTime * 1.7));

  uv = (uv - 0.5) * uCover + 0.5;
  gl_FragColor = texture2D(uImage, clamp(uv, 0.0, 1.0));
}
