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
```

Install the Playwright browser once with `npx playwright install chromium`.
