import{a as e,n as t,o as n,r,s as i,t as a}from"./react-three-fiber.esm-DJEGWuvc.js";import{o,r as s,t as c}from"./index-Bshw9Zfh.js";var l=o(s(),1),u=`// The card image, rippling out from the pointer like a touched water surface. uStrength fades
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
`,d=`// A unit quad placed over the hovered image. uRect is its left, bottom, width and height as a
// fraction of the canvas.
uniform vec4 uRect;

varying vec2 vUv;

void main() {
  vUv = uv;
  vec2 p = uRect.xy + uv * uRect.zw;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`,f=c(),p=.25,m=.6,h=new e,g=new Map;function _(e,t){let n=g.get(e);return n||(n=h.load(e,t),g.set(e,n)),n}var v=e=>{let t=e.image;return!!t&&t.complete&&t.naturalWidth>0};function y({store:e}){let a=r(e=>e.gl),o=r(e=>e.invalidate),s=(0,l.useRef)(null),c=(0,l.useRef)(null),h=(0,l.useRef)(0),g=(0,l.useMemo)(()=>({uImage:{value:null},uRect:{value:new i},uPointer:{value:new n(.5,.5)},uTime:{value:0},uStrength:{value:0},uAspect:{value:1},uCover:{value:new n(1,1)}}),[]);return(0,l.useEffect)(()=>(o(),e.onWake(o)),[e,o]),t(({clock:t},n)=>{let r=c.current,i=s.current,l=e.target;if(!r||!i)return;let u=Math.min(n,.1);h.current=e.hovering?Math.min(1,h.current+u/p):Math.max(0,h.current-u/m);let d=l?_(l.currentSrc||l.src,o):null;if(!l||!d||!v(d)||h.current===0){i.visible=!1,a.domElement.setAttribute(`data-rippling`,`false`),e.hovering&&o();return}let f=a.domElement.getBoundingClientRect(),g=l.getBoundingClientRect(),y=Math.max(f.width,1),b=Math.max(f.height,1);r.uniforms.uRect.value.set((g.left-f.left)/y,(f.bottom-g.bottom)/b,g.width/y,g.height/b),r.uniforms.uPointer.value.set((e.pointer.x-g.left)/Math.max(g.width,1),1-(e.pointer.y-g.top)/Math.max(g.height,1));let x=g.width/Math.max(g.height,1),S=d.image,C=S.naturalWidth/S.naturalHeight;r.uniforms.uCover.value.set(C>x?x/C:1,C>x?1:C/x),r.uniforms.uAspect.value=x,r.uniforms.uImage.value=d,r.uniforms.uTime.value=t.getElapsedTime(),r.uniforms.uStrength.value=h.current,i.visible=!0,a.domElement.setAttribute(`data-rippling`,`true`),o()}),(0,f.jsxs)(`mesh`,{ref:s,frustumCulled:!1,visible:!1,children:[(0,f.jsx)(`planeGeometry`,{args:[1,1]}),(0,f.jsx)(`shaderMaterial`,{ref:c,vertexShader:d,fragmentShader:u,uniforms:g,depthTest:!1,depthWrite:!1})]})}function b({store:e}){return(0,f.jsx)(a,{gl:{alpha:!0,antialias:!1,powerPreference:`low-power`},dpr:[1,1.5],flat:!0,linear:!0,frameloop:`demand`,style:{pointerEvents:`none`},children:(0,f.jsx)(y,{store:e})})}export{b as default};