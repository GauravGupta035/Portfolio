# AGENTS.md

Personal portfolio for Gaurav Gupta, rebuilt from scratch. The existing Create React App + Chakra code in `src/` is legacy: replace it, do not extend it. Keep `public/Gaurav_Gupta_Resume.pdf` and `public/images/`.

## Source of truth

Figma: https://www.figma.com/design/MyonqOpYDtXtw5nrocS1vy/Gaurav

| Page | Contents |
| --- | --- |
| 00 Foundations | Color, Spacing, Stroke, Radius, Typography, Grid |
| 01 Components | Primitives, Navigation, Content, Data & Feedback, Project, Interaction, Experience, Blog, About |
| 02 Behaviour | Hero portrait hover sequence |
| Page 1 | Full desktop page (1440px), plus design review comments |
| Page 2 | Empty, ignore |

When the design and this file disagree, the design wins. Read the Figma comments on Page 1 before building a section; they carry animation requirements.

## Stack

- Vite + React 19 + TypeScript (strict). Static build, no server.
- Styling: CSS Modules or vanilla-extract with design tokens as CSS custom properties. No UI kit.
- 3D and shaders: Three.js via `@react-three/fiber` and `@react-three/drei`. Custom GLSL for liquid effects.
- DOM and scroll animation: GSAP + ScrollTrigger, Lenis for smooth scroll.
- Remotion: only for pre-rendered video (project preview loops, social/OG video) and, if useful, the intro loader via `@remotion/player`. Never use it for anything interactive or pointer-driven; that belongs to Three.js/GSAP.
- Lint/format: ESLint + Prettier. Tests: Vitest + Testing Library, Playwright for a smoke test.
- Deploy: GitHub Pages at `https://gauravgupta035.github.io/Portfolio/` (set Vite `base: '/Portfolio/'`). Update `.github/workflows` to Node 22 LTS.

## Commands

```bash
npm run dev        # local dev server
npm run build      # typecheck + production build
npm run lint
npm run test
npm run remotion   # Remotion studio (videos live in remotion/)
```

## Structure

```
src/
  tokens/        colors, spacing, type, grid (single source, exported to CSS vars)
  components/    one folder per Figma component, named as in Figma (e.g. ProjectIndexRow)
  sections/      Hero, Projects, ProjectDetail, Experience, Blog, About, Contact, Footer
  three/         R3F scenes, shaders (*.glsl), WebGL helpers
  motion/        GSAP timelines, ScrollTrigger setup, Lenis
  content/       typed data: projects, experience, posts, skills (no copy hardcoded in JSX)
remotion/        Remotion compositions and render scripts
```

## Design tokens (from 00 Foundations)

- Color primitives: Neutral 00 `#F5F5F3`, 200 `#E9E9E7`, 400 `#B3B3B3`, 600 `#666666`, 950 `#010101`; Violet 500 `#6245F5`, Violet 600 `#7B61FF`.
  - Known Figma discrepancy: Violet 500/600 captions and bound swatches are swapped, and Light Background uses Neutral 200 though the specimen shows `#F5F5F3`. Use the bound variable values and flag it, do not guess.
- Semantic roles (light and dark): Background/Page, Text/Primary, Text/Secondary, Accent/Primary (violet), Border/Default, Border/Strong. Sections alternate light (neutral) and dark (950) surfaces.
- Spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px.
- Stroke: hairline 1px, strong 2px. Radius: 0 or 4px only.
- Type (all tracking 0, line height auto): Display 2XL/XL/L 142/128/96 Medium; Heading L/M/S 64/32/24 Medium, S Strong 24 Bold, Feature 36 Medium; Subtitle L 53 Light; Body L/M/S/XS 32 Light, 24 Regular, 20 Light, 16 Regular; Data L 53 Medium, Data M 32 Bold; Label S 16 Medium; Meta 16 Light; Utility M 20 Regular/Medium; Action 40 Medium. Font family is a grotesk sans; confirm the exact family in Figma Dev Mode.
- Grid: desktop 1440px, 12 columns, 97px columns, 16px gutters, 50px side margins. Tablet (1024px, 8 cols, 32px margins) is an unvalidated candidate. No mobile design exists yet: build a sensible single-column layout and keep it on the same tokens.

## Page sections (Page 1, top to bottom)

1. Nav: GG blob logo, Projects, Experience, Blog, About, Contact, CV (external arrow).
2. Hero: name in Display, "Software Engineer", portrait in an organic blob mask with violet stroke, violet "Scroll" blob, metadata row (Education, Based in, Focused on).
3. Projects index: '21 to '25, rows with name, category, stack.
4. Project detail (dark): per project title, subtitle, description, metrics (Data L), year marker, VIEW SOURCE link, vertical tech rail on the right edge.
5. Experience: pinned "EXPERIENCE" heading with stacked cards and a 01/03 progress indicator.
6. Blog: article card grid.
7. About: intro text, rotated capability cards (Languages & Frameworks, Cloud & DevOps, AI & Intelligent Systems) in a horizontal rail, vertical social links.
8. Get in touch (dark): floating technology tag cloud, footer links Email, LinkedIn, GitHub, CV.

## Animation spec

- Loader: "loading as water"; liquid fills/clears the screen, then the hero appears. Three.js shader (or a Remotion-rendered clip if the shader is too heavy).
- Logo: the GG organic shape morphs on hover; the arrow tip sits on the shape's border.
- Hero portrait: on hover cycle images 01 to 05 and repeat; on mouse leave return to 01. Blob mask can morph between frames.
- Custom cursor: blob cursor with default, hover and labelled states (Interaction / Cursor component).
- Blog cards: liquid hover distortion (WebGL).
- Experience: scroll-pinned heading, cards advance with scroll, progress indicator updates.
- About: capability cards rotate/drift in a scroll-driven rail.
- Contact: tech tags float and react to the pointer.

## Rules

- Respect `prefers-reduced-motion`: disable WebGL effects and scroll-jacking, show static states.
- Lazy-load Three.js scenes and Remotion players; the hero must render text before any WebGL boots. Target Lighthouse performance 90+ on desktop.
- Every animation has a non-WebGL fallback; feature-detect WebGL.
- Semantic HTML, keyboard reachable nav and links, visible focus, alt text on all images.
- Content changes go in `src/content/`, never inline in components.
- Feedback from Figma comments: About section needs a bigger CTA with CV download.
- Writing style for all docs, comments and commits: no em-dashes.

## Working an issue

This file is written for Tessl agents. Every task starts from a GitHub issue. Before writing code:

1. Read the issue fully, including acceptance criteria and comments. If requirements are ambiguous or contradict the design, comment on the issue and stop rather than guess.
2. Open the referenced Figma page/component and its comments. Match tokens, spacing and behaviour exactly.
3. Analyse the codebase: find existing tokens, components, hooks and content that already cover part of the work. Reuse before adding. Note anything the change could break.
4. Write a short plan in the PR description: files to touch, approach, how each acceptance criterion is verified.
5. Implement the smallest change that meets the criteria. No unrelated refactors.
6. Verify: `npm run lint`, `npm run test`, `npm run build` all pass. For UI work, check desktop and mobile widths and `prefers-reduced-motion`, and attach a screenshot or clip to the PR.
7. Link the PR to the issue and tick off each acceptance criterion.

## Commit rules

```
[ISSUE-ID] short summary of the change (single line, imperative)

* individual change, with the reason if not obvious
* another change
```

- One logical change per commit; every commit references its issue ID.
- Summary line under 72 characters, no trailing period.
- Bullets say what changed and why, not how the code works.
- No AI attribution or Co-Authored-By trailers.
