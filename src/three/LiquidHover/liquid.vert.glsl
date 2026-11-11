// A unit quad placed over the hovered image. uRect is its left, bottom, width and height as a
// fraction of the canvas.
uniform vec4 uRect;

varying vec2 vUv;

void main() {
  vUv = uv;
  vec2 p = uRect.xy + uv * uRect.zw;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
