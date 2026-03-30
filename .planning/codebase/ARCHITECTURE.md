# Architecture

**Analysis Date:** 2026-03-31

## Pattern Overview

**Overall:** Static Site Generation (SSG) with Astro Content Collections

**Key Characteristics:**
- Zero client-side JavaScript framework -- all pages are server-rendered to static HTML at build time
- Content-driven architecture using Astro Content Collections with Zod-validated Markdown
- File-based routing with a single dynamic route for session detail pages
- Single layout wrapping all pages; two reusable Astro components
- Tailwind CSS v4 with a custom `@theme` block for design tokens (no component library)
- Deployed as a fully static site to GitHub Pages via GitHub Actions

## Layers

**Content Layer:**
- Purpose: Stores structured seminar session data as Markdown with frontmatter
- Location: `src/content/sessions/`
- Contains: 13 Markdown files (session-01 through session-12 + session-bonus)
- Schema: `src/content.config.ts` -- defines a `sessions` collection using Zod
- Depends on: Astro's `glob` loader from `astro/loaders`
- Used by: Page layer via `getCollection('sessions')` and `render()`

**Page Layer:**
- Purpose: Defines routes and composes page-level markup
- Location: `src/pages/`
- Contains: 7 static page files + 1 dynamic route (`sessions/[...slug].astro`)
- Depends on: Layout layer, Component layer, Content layer
- Used by: Astro build system to generate static HTML

**Layout Layer:**
- Purpose: Provides shared HTML shell (head, nav, footer, fonts, meta)
- Location: `src/layouts/BaseLayout.astro`
- Contains: Single layout file with sticky nav, mobile hamburger menu, footer
- Depends on: Style layer (`src/styles/global.css`)
- Used by: Every page via `<BaseLayout title="...">` wrapper

**Component Layer:**
- Purpose: Reusable UI building blocks
- Location: `src/components/`
- Contains: 2 components -- `SessionCard.astro` and `AdoptionLadder.astro`
- Depends on: Tailwind CSS utility classes and theme tokens
- Used by: Page layer (`curriculum.astro`, `index.astro`, `about.astro`)

**Style Layer:**
- Purpose: Global theme definition and Tailwind CSS configuration
- Location: `src/styles/global.css`
- Contains: Tailwind v4 import + `@theme` block defining all design tokens
- Depends on: Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Used by: Layout layer (imported in `BaseLayout.astro`)

**Static Asset Layer:**
- Purpose: Files served as-is without processing
- Location: `public/`
- Contains: `favicon.ico`, `favicon.svg`, empty `templates/` directory
- Used by: HTML via `<link>` tags; base-path-aware references

## Data Flow

**Build-Time Content Pipeline:**

1. Astro reads `src/content.config.ts` and discovers the `sessions` collection
2. The `glob` loader scans `src/content/sessions/` for `**/*.md` files
3. Frontmatter is validated against the Zod schema (number, title, week, weekTheme, type, mission, level, keyMessage, deliverable, timeStructure, status, bookRef)
4. Pages call `getCollection('sessions')` to retrieve typed session data
5. `curriculum.astro` sorts sessions by `number` and groups by `week` (1-6)
6. `sessions/[...slug].astro` calls `getStaticPaths()` to generate one page per session
7. Markdown body is rendered via `render(entry)` which returns `{ Content, headings }`
8. All pages are wrapped in `BaseLayout` and output as static HTML to `dist/`

**Session Detail Page Data Flow:**

1. `getStaticPaths()` fetches all sessions and maps `entry.id` to route params
2. Session frontmatter populates header metadata cards (week, time, deliverable, bookRef)
3. `render(entry)` produces the `<Content />` component and `headings` array
4. Headings at depth 2-3 are extracted for the sticky Table of Contents sidebar
5. Previous/next navigation is computed by filtering `number >= 1`, sorting, and finding adjacent entries

**Curriculum Page Data Flow:**

1. `getCollection('sessions')` retrieves all sessions
2. Sessions are sorted by `number` ascending
3. A static `weeks = [1, 2, 3, 4, 5, 6]` array drives the week grouping
4. Sessions are filtered by `data.week === week` for each week
5. Each session is rendered as a `<SessionCard>` component with all frontmatter props

**State Management:**
- No client-side state management exists. The site is fully static.
- The only client-side JavaScript is an inline `<script is:inline>` in `BaseLayout.astro` that toggles the mobile navigation menu visibility via DOM `classList.toggle('hidden')`.
- All data fetching and transformation happens at build time in Astro component frontmatter blocks.

## Key Abstractions

**Content Collection -- Sessions:**
- Purpose: Single source of truth for all seminar session data
- Definition: `src/content.config.ts`
- Instances: `src/content/sessions/session-*.md` (13 files)
- Pattern: Zod schema validation + glob loader + frontmatter + Markdown body
- Key fields: `number` (ordering), `week` (grouping), `type` (concept/practice/special), `status` (completed/current/upcoming)

**BaseLayout:**
- Purpose: Shared page shell providing consistent nav, footer, meta tags, and font loading
- Location: `src/layouts/BaseLayout.astro`
- Props: `title` (required), `description` (optional with Korean default)
- Pattern: Astro `<slot />` for content injection

**SessionCard:**
- Purpose: Visual card for displaying session summary in curriculum grid
- Location: `src/components/SessionCard.astro`
- Props: All session frontmatter fields + optional `slug` for linking
- Pattern: Conditional styling based on `status` (border color) and `type` (badge color)

**AdoptionLadder:**
- Purpose: Visual progress indicator showing 5 learning levels across 6 weeks
- Location: `src/components/AdoptionLadder.astro`
- Props: `activeLevel` (optional number, default 0)
- Pattern: Responsive design with separate desktop (horizontal) and mobile (vertical) layouts

**BASE_URL Normalization:**
- Purpose: Handle GitHub Pages subpath deployment (`/agent-seminar`)
- Pattern: Every page and component that generates links includes:
  ```typescript
  const rawBase = import.meta.env.BASE_URL;
  const base = rawBase.endsWith('/') ? rawBase : rawBase + '/';
  ```
- Used in: All 8 page files + `SessionCard.astro` + `BaseLayout.astro`

## Entry Points

**Build Entry:**
- Location: `astro.config.mjs`
- Triggers: `npm run build` or `npm run dev`
- Responsibilities: Configures Astro with site URL, base path, and Tailwind CSS vite plugin

**Page Routes (File-Based):**
- `src/pages/index.astro` -> `/agent-seminar/`
- `src/pages/about.astro` -> `/agent-seminar/about/`
- `src/pages/curriculum.astro` -> `/agent-seminar/curriculum/`
- `src/pages/schedule.astro` -> `/agent-seminar/schedule/`
- `src/pages/resources.astro` -> `/agent-seminar/resources/`
- `src/pages/faq.astro` -> `/agent-seminar/faq/`
- `src/pages/season2.astro` -> `/agent-seminar/season2/`

**Dynamic Route:**
- `src/pages/sessions/[...slug].astro` -> `/agent-seminar/sessions/{session-id}/`
- Triggers: `getStaticPaths()` generates one route per content collection entry
- Responsibilities: Renders session detail page with metadata cards, TOC, content, and prev/next navigation

**CI/CD Entry:**
- Location: `.github/workflows/deploy.yml`
- Triggers: Push to `main` branch or manual `workflow_dispatch`
- Responsibilities: Checkout -> Node 22 setup -> `npm ci` -> `npm run build` -> Upload to GitHub Pages

## Error Handling

**Strategy:** Build-time validation via Zod schema; no runtime error handling needed for a static site

**Patterns:**
- Content schema validation: Zod enforces required fields (`number`, `title`, `week`, `weekTheme`, `type`, `level`, `keyMessage`, `deliverable`, `timeStructure`) and valid enums (`type`: concept/practice/special; `status`: completed/current/upcoming) at build time. Invalid frontmatter fails the build.
- Optional fields: `mission`, `bookRef` are `z.string().optional()` and conditionally rendered in templates with `{mission && (...)}` guards
- Default values: `status` defaults to `'upcoming'` via `z.enum([...]).default('upcoming')`
- No try/catch blocks exist anywhere in the codebase -- build failures surface through Astro's build pipeline

## Cross-Cutting Concerns

**Routing:** File-based routing with Astro's `src/pages/` convention. All internal links use the `base` variable pattern for GitHub Pages subpath compatibility. All links include trailing slashes.

**Fonts:** Loaded externally via CDN in `BaseLayout.astro`:
- IBM Plex Mono from Google Fonts (headings, labels, code)
- Pretendard Variable from jsDelivr (Korean body text)
- Preconnect hints for `cdn.jsdelivr.net`, `fonts.googleapis.com`, `fonts.gstatic.com`

**Responsive Design:** Mobile-first with `md:` breakpoint Tailwind modifiers. Key responsive patterns:
- Nav: hamburger menu on mobile, inline links on desktop (`md:flex`)
- Grid layouts: single column on mobile, multi-column on desktop (`md:grid-cols-2`, `md:grid-cols-3`)
- AdoptionLadder: vertical on mobile, horizontal on desktop
- Session detail TOC: hidden on mobile/tablet, visible sidebar on `lg:` breakpoint

**Internationalization:** Site language is Korean (`<html lang="ko">`). All UI text is hardcoded Korean. No i18n framework.

**Accessibility:**
- `aria-label` on nav elements and breadcrumb
- `role="main"` on `<main>`, `role="contentinfo"` on `<footer>`
- `aria-expanded` state on mobile menu toggle
- FAQ uses native `<details>/<summary>` elements

**SEO/Meta:**
- Dynamic `<title>` per page via layout prop
- Global meta description with Korean default
- `color-scheme: dark` inline style on `<html>`

---

*Architecture analysis: 2026-03-31*
