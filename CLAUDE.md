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
