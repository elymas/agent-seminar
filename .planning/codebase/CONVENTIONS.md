# Coding Conventions

**Analysis Date:** 2026-03-31

## Naming Patterns

**Files:**
- Astro pages: `kebab-case.astro` (e.g., `src/pages/schedule.astro`, `src/pages/season2.astro`)
- Astro components: `PascalCase.astro` (e.g., `src/components/SessionCard.astro`, `src/components/AdoptionLadder.astro`)
- Astro layouts: `PascalCase.astro` (e.g., `src/layouts/BaseLayout.astro`)
- Content files: `kebab-case.md` with numbered suffix (e.g., `src/content/sessions/session-01.md` through `session-12.md`)
- Config files: `camelCase` TypeScript (e.g., `src/content.config.ts`, `astro.config.mjs`)
- CSS files: `kebab-case.css` (e.g., `src/styles/global.css`)
- Dynamic routes: use Astro rest params `[...slug].astro` (e.g., `src/pages/sessions/[...slug].astro`)

**Components:**
- Use PascalCase for component names matching the filename
- Components define a `Props` interface in the frontmatter for type safety

**Variables:**
- camelCase for all JavaScript/TypeScript variables: `rawBase`, `weekSchedule`, `weekSessions`, `typeLabel`, `typeColor`
- Constants defined inline (no separate constants file)

**Types:**
- Inline `interface Props` in component frontmatter for prop typing
- Zod schemas for content collection validation in `src/content.config.ts`

## Code Style

**Formatting:**
- No Prettier, ESLint, or Biome configuration detected -- no automated formatter is configured
- Indentation: 2 spaces consistently across all `.astro`, `.ts`, `.css`, and `.md` files
- Quotes: Single quotes for JavaScript/TypeScript imports and strings
- Semicolons: Yes -- all JS/TS statements end with semicolons
- Trailing commas: Yes on multiline constructs (e.g., object properties, function parameters)
- HTML attributes: Use double quotes for attribute values in template markup (e.g., `class="..."`)
- Line length: No enforced limit, but lines generally stay under ~150 characters

**Linting:**
- No linting tool configured (no `.eslintrc`, `biome.json`, or similar)
- TypeScript strict mode enabled via `tsconfig.json` extending `astro/tsconfigs/strict`

## Astro Component Patterns

**Frontmatter Block:**
Every `.astro` file starts with a fenced frontmatter block (`---`). The standard order is:
1. Imports (layout, components, Astro APIs)
2. Props interface (if component accepts props)
3. Props destructuring from `Astro.props`
4. BASE_URL normalization (the `rawBase`/`base` pattern)
5. Data fetching / computed values

**BASE_URL Normalization Pattern (CRITICAL):**
Every page and component that generates links includes this exact pattern at the top of its frontmatter:
```typescript
const rawBase = import.meta.env.BASE_URL;
const base = rawBase.endsWith('/') ? rawBase : rawBase + '/';
```
All internal `href` values use template literals with `base`: `` href={`${base}curriculum/`} ``

Always include this pattern in any new page or component that generates links. Trailing slashes on link paths are mandatory (e.g., `${base}about/` not `${base}about`).

**Props Pattern:**
Components define an explicit `interface Props` and destructure with defaults:
```typescript
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'default value' } = Astro.props;
```

**Layout Wrapping:**
All pages wrap content in `<BaseLayout title="Page Title">`. The layout handles `<html>`, `<head>`, `<nav>`, `<main>`, `<footer>`, and the mobile menu script.

**Content Collection Querying:**
Use `getCollection('sessions')` from `astro:content`. Sort results explicitly:
```typescript
const sessions = await getCollection('sessions');
const sorted = sessions.sort((a, b) => a.data.number - b.data.number);
```

**Dynamic Pages:**
Use `getStaticPaths()` with `getCollection` for content-driven pages. Access frontmatter via `entry.data` and render markdown via `await render(entry)`.

**Conditional Rendering:**
Use inline ternary expressions and `&&` short-circuit for conditional JSX:
```astro
{mission && (
  <p>...</p>
)}
{status === 'current' && (
  <span>진행중</span>
)}
```

## CSS / Tailwind Conventions

**Theme System:**
All design tokens are defined in `src/styles/global.css` using Tailwind v4's `@theme` block:
```css
@theme {
  --color-bg: #0a0a0a;
  --color-bg-card: #111827;
  --color-bg-hover: #1f2937;
  --color-accent: #10b981;
  --color-accent-hover: #34d399;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-text-muted: #6b7280;
  --font-mono: "IBM Plex Mono", monospace;
  --font-sans: "Pretendard", -apple-system, BlinkMacSystemFont, sans-serif;
  --radius-card: 4px;
  --radius-btn: 2px;
}
```

**Always use theme tokens, never raw color values.** Use `bg-bg`, `text-accent`, `border-bg-hover`, `rounded-card`, `rounded-btn`, `font-mono`, `font-sans` etc. in Tailwind classes.

**Utility Class Patterns:**
- Backgrounds: `bg-bg`, `bg-bg-card`, `bg-bg-hover`, `bg-accent`, `bg-accent/10`, `bg-accent/5`
- Text: `text-text-primary`, `text-text-secondary`, `text-text-muted`, `text-accent`
- Borders: `border-bg-hover`, `border-accent/30`, `border-accent/20`
- Rounded: `rounded-card` (4px for cards/containers), `rounded-btn` (2px for buttons/badges)
- Fonts: `font-mono` (IBM Plex Mono, headings/labels), `font-sans` (Pretendard, body text)
- Opacity variants: Use Tailwind opacity modifiers like `bg-accent/10`, `text-text-muted/40`

**Card Pattern:**
Cards use a consistent set of classes:
```html
<div class="bg-bg-card rounded-card p-6 border border-bg-hover">
```
With optional hover: `hover:bg-bg-hover transition-colors`

**Section Label Pattern:**
Sections start with an uppercase English label in mono font:
```html
<p class="font-mono text-accent text-xs tracking-widest uppercase mb-4">SECTION NAME</p>
```

**Page Header Pattern:**
Every page follows this header structure:
```html
<section class="py-12">
  <p class="font-mono text-accent text-xs tracking-widest uppercase mb-4">English Label</p>
  <h1 class="font-mono text-2xl md:text-4xl font-bold mb-6">Korean Title</h1>
  <p class="text-text-secondary text-base leading-relaxed max-w-3xl">Description</p>
</section>
```

**Button Patterns:**
- Primary CTA: `bg-accent hover:bg-accent-hover text-bg font-mono text-sm font-semibold px-6 py-3 rounded-btn transition-colors`
- Secondary/outline: `border border-bg-hover hover:border-text-muted text-text-secondary hover:text-text-primary font-mono text-sm px-6 py-3 rounded-btn transition-colors`

**Responsive Approach:**
- Mobile-first with `md:` breakpoint for tablets and `lg:` for desktop
- Use `hidden md:flex` / `md:hidden` for mobile/desktop component swapping (see `AdoptionLadder.astro`, mobile menu)
- Grid layouts: `grid md:grid-cols-2 gap-4` or `grid md:grid-cols-3 gap-6`

**Scoped Styles:**
Only `src/pages/sessions/[...slug].astro` uses `<style is:global>` for markdown content typography. All other styling uses Tailwind utility classes exclusively.

**No Custom CSS Classes:**
Apart from `.session-content` used for markdown content styling, there are no custom CSS class definitions. Use Tailwind utilities for everything.

## Content Authoring Conventions

**Frontmatter Schema (enforced by Zod in `src/content.config.ts`):**
```yaml
---
number: 1                    # Session number (0 for bonus)
title: "Korean title here"   # Session title in Korean, quoted
week: 1                      # Week number (0 for bonus, 1-6 for regular)
weekTheme: "Theme text"      # Week theme in Korean, quoted
type: concept                # One of: concept, practice, special
mission: "Mission text"      # Optional, quoted
level: "Level 1: Prompting"  # Level descriptor
keyMessage: "Key message"    # One-sentence summary, quoted
deliverable: "산출물 name"    # Deliverable name or "없음"
timeStructure: "10분 + 15분 + 5분"  # Time breakdown
status: upcoming             # One of: completed, current, upcoming
bookRef: "Ch.X.X title"     # Optional book reference, quoted
---
```

**Markdown Structure in Session Files:**
- Use `###` (h3) for top-level sections within session content (NOT `##` h2, as h2 gets special styling in `.session-content`)
- Actually, sessions use `##` and `###` freely -- both are styled. `##` gets a bottom border and larger font, `###` is slightly smaller
- Use `---` (horizontal rules) as section dividers between major sections
- Use `> blockquote` for tips, callouts, and important quotes
- Use markdown tables for comparison data
- Use fenced code blocks with language hints for code/template examples
- Use bold (`**text**`) for emphasis within paragraphs
- Use numbered lists for sequential steps, bullet lists for non-sequential items

**Session Numbering:**
- Regular sessions: `session-01.md` through `session-12.md` (zero-padded)
- Bonus session: `session-bonus.md` with `number: 0` and `week: 0`
- Session types alternate: odd = concept, even = practice, 11-12 = special

**Content Language:**
- All user-facing content is in Korean
- Technical terms remain in English (CLAUDE.md, Skill, MCP, Hook, etc.)
- Section labels use English uppercase (FORMAT, MISSION, NOTICE, etc.)

## Import Organization

**Order in Astro frontmatter:**
1. Astro framework imports (`astro:content`, `astro/loaders`)
2. Layout import (`../layouts/BaseLayout.astro`)
3. Component imports (`../components/SessionCard.astro`)
4. Style imports (`../styles/global.css` -- only in BaseLayout)

**Import Path Style:**
- Relative paths only (no path aliases configured)
- Always include `.astro` extension in component imports
- Use bare specifiers for Astro built-ins: `'astro:content'`, `'astro/loaders'`

## Comment Style

**HTML Comments in Templates:**
Use `<!-- Comment -->` for section markers within page templates. Comments describe the section that follows:
```html
<!-- Notice -->
<section>...</section>

<!-- Week schedule table -->
<section>...</section>
```

**Korean section comments** are used when the section name is in Korean:
```html
<!-- 왜 AI Agent인가? -->
<!-- 사전 준비 -->
<!-- 추가 질문 -->
```

**Numbered items** use comment labels like `<!-- Q1 -->`, `<!-- Q2 -->` for FAQ items.

**No inline code comments:** There are zero `//` or `/* */` comments in any source files. Logic is kept simple enough to be self-documenting.

## Git Commit Message Conventions

**Format:** `type(scope): description`

**Types used:**
- `style` -- CSS/visual changes
- `style(design)` -- Design review findings (with `FINDING-NNN` identifier)
- `content` -- Content additions or changes
- `fix` -- Bug fixes
- `fix(qa)` -- QA-identified issues (with `ISSUE-NNN` identifier)
- `docs` -- Documentation changes

**Patterns:**
- Design findings: `style(design): FINDING-NNN -- description` (e.g., `style(design): FINDING-007 -- add preconnect for Google Fonts`)
- QA issues: `fix(qa): ISSUE-NNN -- description` (e.g., `fix(qa): ISSUE-001 -- fix all navigation links returning 404`)
- Content updates: `content: description` (e.g., `content: add hidden bonus session`)
- Simple style: `style: description` (e.g., `style: add line break between hero subtitle sentences`)

**Style notes:**
- Use em dash (`--`) not colon to separate issue ID from description
- Description starts lowercase
- Description is imperative mood ("add", "fix", "remove", not "added", "fixed")
- No period at the end of subject line
- Early commits (before conventions were established) used freeform messages

## Script Conventions

**Inline Scripts:**
Use `<script is:inline>` in Astro for client-side JavaScript (see mobile menu toggle in `src/layouts/BaseLayout.astro`). Keep scripts minimal -- this is a static content site.

**No External JS Libraries:**
There are zero JavaScript dependencies beyond the Astro/Tailwind build toolchain. No React, Vue, or other UI frameworks.

---

*Convention analysis: 2026-03-31*
