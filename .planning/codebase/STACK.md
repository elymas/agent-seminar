# Technology Stack

**Analysis Date:** 2026-03-31

## Languages

**Primary:**
- TypeScript (strict) - All Astro components, content config, and type definitions
- Configured via `tsconfig.json` extending `astro/tsconfigs/strict`

**Secondary:**
- Markdown - Content authoring for 13 session files in `src/content/sessions/`
- CSS - Theme and global styles in `src/styles/global.css`
- Inline JavaScript - Minimal client-side interactivity (mobile menu toggle in `src/layouts/BaseLayout.astro`)

## Runtime

**Environment:**
- Node.js >= 22.12.0 (enforced via `engines` field in `package.json`)
- Local development: Node.js v22.19.0
- CI: Node.js 22 (via `actions/setup-node@v4` in `.github/workflows/deploy.yml`)

**Module System:**
- ES Modules (`"type": "module"` in `package.json`)

## Package Manager

- npm v11.12.0
- Lockfile: `package-lock.json` (present, committed)
- No yarn.lock, pnpm-lock.yaml, or bun.lockb detected

## Frameworks

**Core:**
- Astro v6.0.8 (`astro@^6.0.8`) - Static site generation framework
  - Config: `astro.config.mjs`
  - Content Collections with glob loader and Zod schema validation (`src/content.config.ts`)
  - Markdown rendering via `@astrojs/markdown-remark@7.0.1` (transitive dependency)

**Styling:**
- Tailwind CSS v4.2.2 (`tailwindcss@^4.2.2`) - Utility-first CSS framework
  - Integrated as Vite plugin via `@tailwindcss/vite@4.2.2`
  - Uses Tailwind v4 `@theme` block for custom design tokens in `src/styles/global.css`
  - No separate `tailwind.config.js` - all config inline via CSS `@theme`

**Build/Dev:**
- Vite v7.3.1 (bundled with Astro 6, not a direct dependency)
  - Tailwind plugin registered in `astro.config.mjs` under `vite.plugins`

**Testing:**
- None configured. No test framework, no test files, no test scripts.

**Linting/Formatting:**
- None configured. No ESLint, Prettier, Biome, or other linting tools detected.

## Key Dependencies

**Production (3 total):**
- `astro@^6.0.8` - Core SSG framework
- `tailwindcss@^4.2.2` - CSS utility framework
- `@tailwindcss/vite@^4.2.2` - Vite plugin for Tailwind CSS v4

**Dev Dependencies:**
- None declared. All dependencies are in `dependencies` (not `devDependencies`).

**Extraneous (installed but not declared):**
- `@emnapi/runtime@1.9.1` - N-API compatibility layer (likely transitive)
- `tslib@2.8.1` - TypeScript runtime library (likely transitive)

**Notable absence:**
- No UI component library (React, Vue, Svelte, etc.) - pure Astro components
- No JavaScript framework integration - zero client-side JS framework
- No image optimization plugin (e.g., `@astrojs/image`)
- No sitemap plugin (e.g., `@astrojs/sitemap`)

## Scripts

Available via `npm run`:

```bash
npm run dev        # astro dev - Start development server
npm run build      # astro build - Build static site to dist/
npm run preview    # astro preview - Preview built site locally
npm run astro      # astro - Direct Astro CLI access
```

## Configuration

**Astro Configuration (`astro.config.mjs`):**
- `site`: `https://elymas.github.io` - Base URL for canonical URLs
- `base`: `/agent-seminar` - Subpath for GitHub Pages deployment
- `vite.plugins`: `[tailwindcss()]` - Tailwind CSS v4 via Vite plugin

**TypeScript Configuration (`tsconfig.json`):**
- Extends `astro/tsconfigs/strict` (strict mode)
- Includes `.astro/types.d.ts` for Astro type definitions
- Excludes `dist/` from compilation

**Tailwind Theme (`src/styles/global.css`):**
- Custom colors: `--color-bg` (#0a0a0a), `--color-accent` (#10b981), etc.
- Custom fonts: `--font-mono` (IBM Plex Mono), `--font-sans` (Pretendard)
- Custom radii: `--radius-card` (4px), `--radius-btn` (2px)

**Environment:**
- `.env` and `.env.production` in `.gitignore` but not present in working tree
- No environment variables required for build
- `import.meta.env.BASE_URL` used throughout for path normalization

## Build Output

- Output directory: `dist/`
- Output type: Static HTML (no SSR, no server output)
- Generated types: `.astro/` (gitignored)

## Platform Requirements

**Development:**
- Node.js >= 22.12.0
- npm (any recent version)
- No OS-specific requirements

**Production:**
- Static file hosting only (no server runtime needed)
- Currently deployed to GitHub Pages

---

*Stack analysis: 2026-03-31*
