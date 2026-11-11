# Portfolio

Personal portfolio for Gaurav Gupta, deployed to https://gauravgupta035.github.io/Portfolio/.

Built with Vite, React 19 and TypeScript. Requires Node 22 LTS. See `AGENTS.md` for the design source, structure and conventions.

## Scripts

```bash
npm run dev       # local dev server
npm run build     # typecheck, then production build into dist/
npm run preview   # serve dist/ under /Portfolio/
npm run lint      # ESLint and Prettier check
npm run format    # Prettier write
npm run test      # Vitest unit tests
npm run e2e       # Playwright smoke test against the built site (Chromium)
npm run remotion  # Remotion studio for the project preview compositions in remotion/
npm run render:previews  # render each project's preview MP4 and poster into public/previews/
```

Install the Playwright browser once with `npx playwright install chromium`.

The preview loops are rendered locally and committed, not rendered in CI. Re-run `npm run render:previews` after changing a project in `src/content/projects.ts` or a composition in `remotion/`. On Linux, Remotion's headless browser needs the same system libraries as Playwright's (`npx playwright install-deps chromium`).
