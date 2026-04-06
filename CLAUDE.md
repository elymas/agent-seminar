# AI Agent Seminar

광고 미디어렙 전직원 대상 Claude Code AI Agent 리터러시 세미나 웹사이트.

**Live:** https://elymas.github.io/agent-seminar/
**Repo:** https://github.com/elymas/agent-seminar

## Tech Stack

- **Framework:** Astro v6 (static site generation)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Content:** Astro Content Collections (Markdown with frontmatter schema)
- **Hosting:** GitHub Pages
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`)
- **Fonts:** IBM Plex Mono (headings) + Pretendard (Korean body)

## Commands

- dev: `npm run dev`
- build: `npm run build`
- preview: `npm run preview`

## Project Structure

```
src/
├── content/
│   └── sessions/          ← 13 Markdown files (12 sessions + 1 bonus)
├── content.config.ts      ← Content Collection schema (Zod validation)
├── layouts/
│   └── BaseLayout.astro   ← Shared layout (nav, footer, fonts)
├── components/
│   ├── SessionCard.astro  ← Curriculum card (links to detail page)
│   └── AdoptionLadder.astro ← 5-level progress visualization
├── pages/
│   ├── index.astro        ← Landing page
│   ├── about.astro        ← Seminar introduction
│   ├── curriculum.astro   ← 12-session overview grid
│   ├── schedule.astro     ← Schedule & preparation
│   ├── resources.astro    ← Templates & references
│   ├── faq.astro          ← FAQ (details/summary)
│   ├── season2.astro      ← Season 2 preview
│   └── sessions/
│       └── [...slug].astro ← Dynamic session detail pages
├── styles/
│   └── global.css         ← Tailwind v4 theme (@theme block)
public/
└── templates/             ← Downloadable template files
```

## Design System

- Background: `#0a0a0a` (dark), `#111827` (card)
- Accent: `#10b981` (emerald green)
- Text: `#f9fafb` (primary), `#d1d5db` (secondary), `#6b7280` (muted)
- Border-radius: `4px` (card), `2px` (button)
- Theme defined in `src/styles/global.css` using `@theme` block

## Content

- 12 seminar sessions (session-01.md through session-12.md)
- 1 hidden bonus session (session-bonus.md, week=0, not shown in curriculum)
- Sessions use frontmatter: number, title, week, weekTheme, type, mission, level, keyMessage, deliverable, timeStructure, status, bookRef
- Session types: concept (odd sessions), practice (even sessions), special (11, 12)

## Key URLs

- `/` — Landing with Adoption Ladder hero
- `/curriculum/` — 6-week, 12-session grid
- `/sessions/session-01/` through `/sessions/session-12/` — Detail pages
- `/sessions/session-bonus/` — Hidden: how this site was built
- `/resources/` — Copy-able templates (no file downloads)

## Safety

- Never commit `claude-master-guide.pdf` to the repo (21MB, redistribution rights unclear)
- BASE_URL requires trailing slash normalization (see `rawBase` pattern in all pages)
- Node.js 22+ required for Astro v6 (CI uses Node 22)

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Agent Seminar — UI Audit Remediation**

A quality pass on the AI Agent Seminar website (Astro v6 + Tailwind CSS v4 static site) to address all findings from the 6-pillar UI audit. The site scored 18/24 — the goal is to resolve every finding and reach production polish across copywriting, visuals, color, typography, spacing, and experience design.

**Core Value:** Every page a seminar attendee can reach must feel intentionally finished — no placeholder content, no dead-end interactions, no invisible keyboard focus states.

### Constraints

- **Tech stack:** Astro v6 + Tailwind CSS v4 — no new dependencies
- **Hosting:** GitHub Pages with `base: '/agent-seminar/'` — all URLs must respect base path
- **Fonts:** IBM Plex Mono (headings) + Pretendard (body) — keep the two-font system
- **Node.js:** >=22.12.0 (enforced in package.json)
- **No client-side JS framework:** Site is zero-JS SSG — fixes must be CSS/HTML only
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript (strict) - All Astro components, content config, and type definitions
- Configured via `tsconfig.json` extending `astro/tsconfigs/strict`
- Markdown - Content authoring for 13 session files in `src/content/sessions/`
- CSS - Theme and global styles in `src/styles/global.css`
- Inline JavaScript - Minimal client-side interactivity (mobile menu toggle in `src/layouts/BaseLayout.astro`)
## Runtime
- Node.js >= 22.12.0 (enforced via `engines` field in `package.json`)
- Local development: Node.js v22.19.0
- CI: Node.js 22 (via `actions/setup-node@v4` in `.github/workflows/deploy.yml`)
- ES Modules (`"type": "module"` in `package.json`)
## Package Manager
- npm v11.12.0
- Lockfile: `package-lock.json` (present, committed)
- No yarn.lock, pnpm-lock.yaml, or bun.lockb detected
## Frameworks
- Astro v6.0.8 (`astro@^6.0.8`) - Static site generation framework
- Tailwind CSS v4.2.2 (`tailwindcss@^4.2.2`) - Utility-first CSS framework
- Vite v7.3.1 (bundled with Astro 6, not a direct dependency)
- None configured. No test framework, no test files, no test scripts.
- None configured. No ESLint, Prettier, Biome, or other linting tools detected.
## Key Dependencies
- `astro@^6.0.8` - Core SSG framework
- `tailwindcss@^4.2.2` - CSS utility framework
- `@tailwindcss/vite@^4.2.2` - Vite plugin for Tailwind CSS v4
- None declared. All dependencies are in `dependencies` (not `devDependencies`).
- `@emnapi/runtime@1.9.1` - N-API compatibility layer (likely transitive)
- `tslib@2.8.1` - TypeScript runtime library (likely transitive)
- No UI component library (React, Vue, Svelte, etc.) - pure Astro components
- No JavaScript framework integration - zero client-side JS framework
- No image optimization plugin (e.g., `@astrojs/image`)
- No sitemap plugin (e.g., `@astrojs/sitemap`)
## Scripts
## Configuration
- `site`: `https://elymas.github.io` - Base URL for canonical URLs
- `base`: `/agent-seminar` - Subpath for GitHub Pages deployment
- `vite.plugins`: `[tailwindcss()]` - Tailwind CSS v4 via Vite plugin
- Extends `astro/tsconfigs/strict` (strict mode)
- Includes `.astro/types.d.ts` for Astro type definitions
- Excludes `dist/` from compilation
- Custom colors: `--color-bg` (#0a0a0a), `--color-accent` (#10b981), etc.
- Custom fonts: `--font-mono` (IBM Plex Mono), `--font-sans` (Pretendard)
- Custom radii: `--radius-card` (4px), `--radius-btn` (2px)
- `.env` and `.env.production` in `.gitignore` but not present in working tree
- No environment variables required for build
- `import.meta.env.BASE_URL` used throughout for path normalization
## Build Output
- Output directory: `dist/`
- Output type: Static HTML (no SSR, no server output)
- Generated types: `.astro/` (gitignored)
## Platform Requirements
- Node.js >= 22.12.0
- npm (any recent version)
- No OS-specific requirements
- Static file hosting only (no server runtime needed)
- Currently deployed to GitHub Pages
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Astro pages: `kebab-case.astro` (e.g., `src/pages/schedule.astro`, `src/pages/season2.astro`)
- Astro components: `PascalCase.astro` (e.g., `src/components/SessionCard.astro`, `src/components/AdoptionLadder.astro`)
- Astro layouts: `PascalCase.astro` (e.g., `src/layouts/BaseLayout.astro`)
- Content files: `kebab-case.md` with numbered suffix (e.g., `src/content/sessions/session-01.md` through `session-12.md`)
- Config files: `camelCase` TypeScript (e.g., `src/content.config.ts`, `astro.config.mjs`)
- CSS files: `kebab-case.css` (e.g., `src/styles/global.css`)
- Dynamic routes: use Astro rest params `[...slug].astro` (e.g., `src/pages/sessions/[...slug].astro`)
- Use PascalCase for component names matching the filename
- Components define a `Props` interface in the frontmatter for type safety
- camelCase for all JavaScript/TypeScript variables: `rawBase`, `weekSchedule`, `weekSessions`, `typeLabel`, `typeColor`
- Constants defined inline (no separate constants file)
- Inline `interface Props` in component frontmatter for prop typing
- Zod schemas for content collection validation in `src/content.config.ts`
## Code Style
- No Prettier, ESLint, or Biome configuration detected -- no automated formatter is configured
- Indentation: 2 spaces consistently across all `.astro`, `.ts`, `.css`, and `.md` files
- Quotes: Single quotes for JavaScript/TypeScript imports and strings
- Semicolons: Yes -- all JS/TS statements end with semicolons
- Trailing commas: Yes on multiline constructs (e.g., object properties, function parameters)
- HTML attributes: Use double quotes for attribute values in template markup (e.g., `class="..."`)
- Line length: No enforced limit, but lines generally stay under ~150 characters
- No linting tool configured (no `.eslintrc`, `biome.json`, or similar)
- TypeScript strict mode enabled via `tsconfig.json` extending `astro/tsconfigs/strict`
## Astro Component Patterns
## CSS / Tailwind Conventions
- Backgrounds: `bg-bg`, `bg-bg-card`, `bg-bg-hover`, `bg-accent`, `bg-accent/10`, `bg-accent/5`
- Text: `text-text-primary`, `text-text-secondary`, `text-text-muted`, `text-accent`
- Borders: `border-bg-hover`, `border-accent/30`, `border-accent/20`
- Rounded: `rounded-card` (4px for cards/containers), `rounded-btn` (2px for buttons/badges)
- Fonts: `font-mono` (IBM Plex Mono, headings/labels), `font-sans` (Pretendard, body text)
- Opacity variants: Use Tailwind opacity modifiers like `bg-accent/10`, `text-text-muted/40`
- Primary CTA: `bg-accent hover:bg-accent-hover text-bg font-mono text-sm font-semibold px-6 py-3 rounded-btn transition-colors`
- Secondary/outline: `border border-bg-hover hover:border-text-muted text-text-secondary hover:text-text-primary font-mono text-sm px-6 py-3 rounded-btn transition-colors`
- Mobile-first with `md:` breakpoint for tablets and `lg:` for desktop
- Use `hidden md:flex` / `md:hidden` for mobile/desktop component swapping (see `AdoptionLadder.astro`, mobile menu)
- Grid layouts: `grid md:grid-cols-2 gap-4` or `grid md:grid-cols-3 gap-6`
## Content Authoring Conventions
- Use `###` (h3) for top-level sections within session content (NOT `##` h2, as h2 gets special styling in `.session-content`)
- Actually, sessions use `##` and `###` freely -- both are styled. `##` gets a bottom border and larger font, `###` is slightly smaller
- Use `---` (horizontal rules) as section dividers between major sections
- Use `> blockquote` for tips, callouts, and important quotes
- Use markdown tables for comparison data
- Use fenced code blocks with language hints for code/template examples
- Use bold (`**text**`) for emphasis within paragraphs
- Use numbered lists for sequential steps, bullet lists for non-sequential items
- Regular sessions: `session-01.md` through `session-12.md` (zero-padded)
- Bonus session: `session-bonus.md` with `number: 0` and `week: 0`
- Session types alternate: odd = concept, even = practice, 11-12 = special
- All user-facing content is in Korean
- Technical terms remain in English (CLAUDE.md, Skill, MCP, Hook, etc.)
- Section labels use English uppercase (FORMAT, MISSION, NOTICE, etc.)
## Import Organization
- Relative paths only (no path aliases configured)
- Always include `.astro` extension in component imports
- Use bare specifiers for Astro built-ins: `'astro:content'`, `'astro/loaders'`
## Comment Style
## Git Commit Message Conventions
- `style` -- CSS/visual changes
- `style(design)` -- Design review findings (with `FINDING-NNN` identifier)
- `content` -- Content additions or changes
- `fix` -- Bug fixes
- `fix(qa)` -- QA-identified issues (with `ISSUE-NNN` identifier)
- `docs` -- Documentation changes
- Design findings: `style(design): FINDING-NNN -- description` (e.g., `style(design): FINDING-007 -- add preconnect for Google Fonts`)
- QA issues: `fix(qa): ISSUE-NNN -- description` (e.g., `fix(qa): ISSUE-001 -- fix all navigation links returning 404`)
- Content updates: `content: description` (e.g., `content: add hidden bonus session`)
- Simple style: `style: description` (e.g., `style: add line break between hero subtitle sentences`)
- Use em dash (`--`) not colon to separate issue ID from description
- Description starts lowercase
- Description is imperative mood ("add", "fix", "remove", not "added", "fixed")
- No period at the end of subject line
- Early commits (before conventions were established) used freeform messages
## Script Conventions
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Zero client-side JavaScript framework -- all pages are server-rendered to static HTML at build time
- Content-driven architecture using Astro Content Collections with Zod-validated Markdown
- File-based routing with a single dynamic route for session detail pages
- Single layout wrapping all pages; two reusable Astro components
- Tailwind CSS v4 with a custom `@theme` block for design tokens (no component library)
- Deployed as a fully static site to GitHub Pages via GitHub Actions
## Layers
- Purpose: Stores structured seminar session data as Markdown with frontmatter
- Location: `src/content/sessions/`
- Contains: 13 Markdown files (session-01 through session-12 + session-bonus)
- Schema: `src/content.config.ts` -- defines a `sessions` collection using Zod
- Depends on: Astro's `glob` loader from `astro/loaders`
- Used by: Page layer via `getCollection('sessions')` and `render()`
- Purpose: Defines routes and composes page-level markup
- Location: `src/pages/`
- Contains: 7 static page files + 1 dynamic route (`sessions/[...slug].astro`)
- Depends on: Layout layer, Component layer, Content layer
- Used by: Astro build system to generate static HTML
- Purpose: Provides shared HTML shell (head, nav, footer, fonts, meta)
- Location: `src/layouts/BaseLayout.astro`
- Contains: Single layout file with sticky nav, mobile hamburger menu, footer
- Depends on: Style layer (`src/styles/global.css`)
- Used by: Every page via `<BaseLayout title="...">` wrapper
- Purpose: Reusable UI building blocks
- Location: `src/components/`
- Contains: 2 components -- `SessionCard.astro` and `AdoptionLadder.astro`
- Depends on: Tailwind CSS utility classes and theme tokens
- Used by: Page layer (`curriculum.astro`, `index.astro`, `about.astro`)
- Purpose: Global theme definition and Tailwind CSS configuration
- Location: `src/styles/global.css`
- Contains: Tailwind v4 import + `@theme` block defining all design tokens
- Depends on: Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Used by: Layout layer (imported in `BaseLayout.astro`)
- Purpose: Files served as-is without processing
- Location: `public/`
- Contains: `favicon.ico`, `favicon.svg`, empty `templates/` directory
- Used by: HTML via `<link>` tags; base-path-aware references
## Data Flow
- No client-side state management exists. The site is fully static.
- The only client-side JavaScript is an inline `<script is:inline>` in `BaseLayout.astro` that toggles the mobile navigation menu visibility via DOM `classList.toggle('hidden')`.
- All data fetching and transformation happens at build time in Astro component frontmatter blocks.
## Key Abstractions
- Purpose: Single source of truth for all seminar session data
- Definition: `src/content.config.ts`
- Instances: `src/content/sessions/session-*.md` (13 files)
- Pattern: Zod schema validation + glob loader + frontmatter + Markdown body
- Key fields: `number` (ordering), `week` (grouping), `type` (concept/practice/special), `status` (completed/current/upcoming)
- Purpose: Shared page shell providing consistent nav, footer, meta tags, and font loading
- Location: `src/layouts/BaseLayout.astro`
- Props: `title` (required), `description` (optional with Korean default)
- Pattern: Astro `<slot />` for content injection
- Purpose: Visual card for displaying session summary in curriculum grid
- Location: `src/components/SessionCard.astro`
- Props: All session frontmatter fields + optional `slug` for linking
- Pattern: Conditional styling based on `status` (border color) and `type` (badge color)
- Purpose: Visual progress indicator showing 5 learning levels across 6 weeks
- Location: `src/components/AdoptionLadder.astro`
- Props: `activeLevel` (optional number, default 0)
- Pattern: Responsive design with separate desktop (horizontal) and mobile (vertical) layouts
- Purpose: Handle GitHub Pages subpath deployment (`/agent-seminar`)
- Pattern: Every page and component that generates links includes:
- Used in: All 8 page files + `SessionCard.astro` + `BaseLayout.astro`
## Entry Points
- Location: `astro.config.mjs`
- Triggers: `npm run build` or `npm run dev`
- Responsibilities: Configures Astro with site URL, base path, and Tailwind CSS vite plugin
- `src/pages/index.astro` -> `/agent-seminar/`
- `src/pages/about.astro` -> `/agent-seminar/about/`
- `src/pages/curriculum.astro` -> `/agent-seminar/curriculum/`
- `src/pages/schedule.astro` -> `/agent-seminar/schedule/`
- `src/pages/resources.astro` -> `/agent-seminar/resources/`
- `src/pages/faq.astro` -> `/agent-seminar/faq/`
- `src/pages/season2.astro` -> `/agent-seminar/season2/`
- `src/pages/sessions/[...slug].astro` -> `/agent-seminar/sessions/{session-id}/`
- Triggers: `getStaticPaths()` generates one route per content collection entry
- Responsibilities: Renders session detail page with metadata cards, TOC, content, and prev/next navigation
- Location: `.github/workflows/deploy.yml`
- Triggers: Push to `main` branch or manual `workflow_dispatch`
- Responsibilities: Checkout -> Node 22 setup -> `npm ci` -> `npm run build` -> Upload to GitHub Pages
## Error Handling
- Content schema validation: Zod enforces required fields (`number`, `title`, `week`, `weekTheme`, `type`, `level`, `keyMessage`, `deliverable`, `timeStructure`) and valid enums (`type`: concept/practice/special; `status`: completed/current/upcoming) at build time. Invalid frontmatter fails the build.
- Optional fields: `mission`, `bookRef` are `z.string().optional()` and conditionally rendered in templates with `{mission && (...)}` guards
- Default values: `status` defaults to `'upcoming'` via `z.enum([...]).default('upcoming')`
- No try/catch blocks exist anywhere in the codebase -- build failures surface through Astro's build pipeline
## Cross-Cutting Concerns
- IBM Plex Mono from Google Fonts (headings, labels, code)
- Pretendard Variable from jsDelivr (Korean body text)
- Preconnect hints for `cdn.jsdelivr.net`, `fonts.googleapis.com`, `fonts.gstatic.com`
- Nav: hamburger menu on mobile, inline links on desktop (`md:flex`)
- Grid layouts: single column on mobile, multi-column on desktop (`md:grid-cols-2`, `md:grid-cols-3`)
- AdoptionLadder: vertical on mobile, horizontal on desktop
- Session detail TOC: hidden on mobile/tablet, visible sidebar on `lg:` breakpoint
- `aria-label` on nav elements and breadcrumb
- `role="main"` on `<main>`, `role="contentinfo"` on `<footer>`
- `aria-expanded` state on mobile menu toggle
- FAQ uses native `<details>/<summary>` elements
- Dynamic `<title>` per page via layout prop
- Global meta description with Korean default
- `color-scheme: dark` inline style on `<html>`
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
