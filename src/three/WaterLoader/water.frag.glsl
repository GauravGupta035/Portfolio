// Water that fills the screen and drains below the bottom edge as uProgress goes 0 to 1.
uniform float uTime;
uniform float uProgress;
uniform float uAspect;
uniform vec3 uDeep;
uniform vec3 uShallow;
uniform vec3 uFoam;

varying vec2 vUv;

void main() {
  float t = uTime;
  float x = vUv.x * uAspect;

  // Ease in, so the water hangs for a moment before it falls away.
  float drain = uProgress * uProgress * (3.0 - 2.0 * uProgress);
  float level = mix(1.12, -0.18, drain);

  // The surface gets choppier as it drops.
  float chop = 0.012 + 0.04 * sin(3.14159 * uProgress);
  float surface = level
    + chop * sin(x * 7.0 + t * 3.1)
    + chop * 0.6 * sin(x * 13.0 - t * 4.7)
    + chop * 0.3 * sin(x * 23.0 + t * 6.3);

  float depth = surface - vUv.y;
  float water = smoothstep(-0.003, 0.003, depth);

  vec3 color = mix(uShallow, uDeep, clamp(depth * 1.6, 0.0, 1.0));
  // Slow moving light bands under the surface.
  float caustic = sin(x * 9.0 + vUv.y * 5.0 + t * 1.3) * sin(x * 4.0 - vUv.y * 11.0 - t * 0.9);
  color += 0.06 * caustic * uFoam;
  // A thin band of foam on the surface line.
  float foam = smoothstep(0.022, 0.0, depth) * water;
  color = mix(color, uFoam, foam * 0.85);

  gl_FragColor = vec4(color * water, water);
}
