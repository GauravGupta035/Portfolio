import{i as e,n as t,r as n,t as r}from"./react-three-fiber.esm-DlfeJ6Lv.js";import{o as i,r as a,t as o}from"./index-Bp62pffs.js";var s=i(a(),1),c={"neutral-00":`#F5F5F3`,"neutral-200":`#E9E9E7`,"neutral-400":`#B3B3B3`,"neutral-600":`#666666`,"neutral-950":`#010101`,"violet-500":`#6245F5`,"violet-600":`#7B61FF`},l=`// Water that fills the screen and drains below the bottom edge as uProgress goes 0 to 1.
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
`,u=`// A 2x2 plane drawn straight in clip space, so it always covers the viewport.
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,d=o(),f=t=>new e(c[t]).convertLinearToSRGB();function p({duration:e,onReady:r,onDone:i}){let a=n(e=>e.size),o=(0,s.useRef)(void 0),c=(0,s.useRef)(1),p=(0,s.useRef)(!1),m=(0,s.useRef)(null),h=(0,s.useMemo)(()=>({uTime:{value:0},uProgress:{value:0},uAspect:{value:1},uDeep:{value:f(`violet-500`)},uShallow:{value:f(`violet-600`)},uFoam:{value:f(`neutral-00`)}}),[]);return t(({clock:t})=>{let n=m.current;if(!n)return;let s=t.getElapsedTime()*1e3;o.current===void 0&&(o.current=s,c.current=e(),r());let l=Math.min((s-o.current)/c.current,1);n.uniforms.uTime.value=s/1e3,n.uniforms.uProgress.value=l,n.uniforms.uAspect.value=a.width/Math.max(a.height,1),l>=1&&!p.current&&(p.current=!0,i())}),(0,d.jsxs)(`mesh`,{frustumCulled:!1,children:[(0,d.jsx)(`planeGeometry`,{args:[2,2]}),(0,d.jsx)(`shaderMaterial`,{ref:m,vertexShader:u,fragmentShader:l,uniforms:h,transparent:!0,premultipliedAlpha:!0,depthTest:!1,depthWrite:!1})]})}function m(e){return(0,d.jsx)(r,{gl:{alpha:!0,antialias:!1,powerPreference:`low-power`,premultipliedAlpha:!0},dpr:[1,1.5],flat:!0,linear:!0,style:{pointerEvents:`none`},children:(0,d.jsx)(p,{...e})})}export{m as default};