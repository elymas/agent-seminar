# Testing Patterns

**Analysis Date:** 2026-03-31

## Test Framework

**Runner:**
- None. No test framework is installed or configured.
- No `jest`, `vitest`, `playwright`, `cypress`, or any other test runner in `package.json`.
- No test files (`*.test.*`, `*.spec.*`) exist anywhere in the codebase.

**Run Commands:**
```bash
npm run dev        # Local development server (Astro dev)
npm run build      # Production build (Astro build) -- the primary quality gate
npm run preview    # Preview built output locally
```

There is no `npm test` script defined in `package.json`.

## Test File Organization

**Location:** Not applicable -- no tests exist.

**If tests are added,** follow Astro ecosystem conventions:
- Use Vitest (Astro's recommended test runner)
- Co-locate unit tests as `src/**/*.test.ts`
- Place E2E tests in `tests/` or `e2e/` at project root
- Add `vitest.config.ts` extending `astro.config.mjs`

## Type Checking

**TypeScript Configuration:**
- Config: `tsconfig.json` at project root
- Extends: `astro/tsconfigs/strict` (strict mode enabled)
- Includes: `.astro/types.d.ts` and all source files (`**/*`)
- Excludes: `dist/`

**Type Safety in Practice:**
- All Astro components define `interface Props` for prop typing
- Content collections use Zod schemas (`src/content.config.ts`) for frontmatter validation at build time
- `astro.config.mjs` has `// @ts-check` directive for JSDoc-based type checking

**Running Type Check:**
```bash
npx astro check    # Astro's built-in type checker (not currently in package.json scripts)
```

Note: There is no `typecheck` or `check` script in `package.json`. Type checking happens implicitly during `astro build`.

## Linting Configuration

**ESLint:** Not configured. No `.eslintrc`, `eslint.config.*`, or ESLint dependencies.

**Prettier:** Not configured. No `.prettierrc`, `.prettierignore`, or Prettier dependencies.

**Biome:** Not configured. No `biome.json`.

**EditorConfig:** Not present. No `.editorconfig` file.

**Consequence:** Code style consistency relies entirely on developer discipline and the conventions documented in `CLAUDE.md`. The 2-space indentation and single-quote style are maintained manually.

## Build Verification

**The production build (`npm run build`) is the primary and only automated quality gate.** It validates:

1. **Astro compilation** -- All `.astro` files compile without errors
2. **Content collection schema validation** -- Zod schemas in `src/content.config.ts` validate all frontmatter fields at build time. Missing or invalid fields cause build failure.
3. **Static path generation** -- `getStaticPaths()` in `src/pages/sessions/[...slug].astro` must produce valid paths for all content entries
4. **Import resolution** -- All component and module imports must resolve
5. **TypeScript type checking** -- Strict mode catches type errors during build
6. **Tailwind CSS processing** -- `@tailwindcss/vite` processes all utility classes

**Build output:** Static HTML/CSS/JS in `dist/` directory.

## CI/CD Quality Gates

**Pipeline:** GitHub Actions (`.github/workflows/deploy.yml`)

**Trigger:** Push to `main` branch, or manual `workflow_dispatch`

**Build Job Steps:**
1. Checkout code (`actions/checkout@v4`)
2. Setup Node.js 22 (`actions/setup-node@v4` with npm cache)
3. Install dependencies (`npm ci`)
4. Build (`npm run build`) -- **this is the only quality gate**
5. Upload `dist/` as pages artifact (`actions/upload-pages-artifact@v3`)

**Deploy Job:**
- Depends on successful build
- Deploys to GitHub Pages (`actions/deploy-pages@v4`)
- Environment: `github-pages`

**What is NOT in the pipeline:**
- No linting step
- No type checking step (separate from build)
- No unit tests
- No E2E tests
- No accessibility audits
- No Lighthouse / performance checks
- No visual regression tests
- No security scanning

**Concurrency:** `cancel-in-progress: false` -- queued deployments run sequentially, never cancelled.

## Content Validation

**Zod Schema (`src/content.config.ts`):**
```typescript
z.object({
  number: z.number(),
  title: z.string(),
  week: z.number(),
  weekTheme: z.string(),
  type: z.enum(['concept', 'practice', 'special']),
  mission: z.string().optional(),
  level: z.string(),
  keyMessage: z.string(),
  deliverable: z.string(),
  timeStructure: z.string(),
  status: z.enum(['completed', 'current', 'upcoming']).default('upcoming'),
  bookRef: z.string().optional(),
})
```

This validates every session markdown file's frontmatter at build time. Adding a new session with invalid/missing required fields will fail the build.

## Manual Testing Procedures

Based on project history and documentation:

**Local Development:**
```bash
npm run dev        # Start dev server, check pages visually
npm run build      # Verify production build succeeds
npm run preview    # Preview production build locally
```

**Link Verification:**
- The `rawBase` / `base` pattern in every page ensures links work with GitHub Pages' `/agent-seminar/` base path
- Historical fix: `fix(qa): ISSUE-001 -- fix all navigation links returning 404` indicates manual link checking was performed
- All internal links must end with trailing slash (e.g., `${base}curriculum/`)

**Design Review:**
- Git history shows a systematic design review process (FINDING-001 through FINDING-007)
- Each finding was a separate commit addressing a specific visual/UX issue
- Issues covered: card borders, heading sizes, line length, touch targets, font preconnects, color-scheme, text-wrap

**Content Review:**
- Session content reviewed for accuracy (e.g., `content: 점심시간 30분 → 하루 30분 컨셉 전환`)
- Bonus session hidden from navigation (`fix: hide bonus session from prev/next navigation`)

## Coverage

**Requirements:** None enforced. No coverage tooling configured.

**Effective coverage:** Zero percent -- no automated tests exist.

## Test Types

**Unit Tests:** None.

**Integration Tests:** None.

**E2E Tests:** None.

**Visual Regression Tests:** None.

**Accessibility Tests:** None automated, but some accessibility patterns are in place:
- `aria-label` on navigation elements (`src/layouts/BaseLayout.astro` lines 29, 60, 62)
- `aria-expanded` on mobile menu toggle
- `role="main"` on main content
- `role="contentinfo"` on footer
- `lang="ko"` on html element
- `color-scheme: dark` on html element

## Recommended Testing Additions

If testing is added to this project, prioritize in this order:

1. **Add `astro check` script** to `package.json` and CI pipeline for explicit type checking
2. **Add link validation** -- a simple script or Astro integration to verify no broken internal links
3. **Add Lighthouse CI** -- automated performance/accessibility scoring on each deploy
4. **Add Playwright E2E** -- verify page rendering, navigation, and mobile menu for the small number of routes

---

*Testing analysis: 2026-03-31*
