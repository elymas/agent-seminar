# Agent Seminar — UI Audit Remediation

## What This Is

A quality pass on the AI Agent Seminar website (Astro v6 + Tailwind CSS v4 static site) to address all findings from the 6-pillar UI audit. The site scored 18/24 — the goal is to resolve every finding and reach production polish across copywriting, visuals, color, typography, spacing, and experience design.

## Core Value

Every page a seminar attendee can reach must feel intentionally finished — no placeholder content, no dead-end interactions, no invisible keyboard focus states.

## Requirements

### Validated

- ✓ 13-session content collection with Zod-validated frontmatter — existing
- ✓ Responsive layout with sticky nav, mobile hamburger menu — existing
- ✓ Design token system in `@theme` block (colors, radii, fonts) — existing
- ✓ Session detail pages with progress bar, meta cards, TOC — existing
- ✓ FAQ accordion with native `<details>/<summary>` — existing
- ✓ Curriculum grid with status-encoded left-border cards — existing
- ✓ AdoptionLadder 5-level visualization — existing
- ✓ GitHub Pages deployment via GitHub Actions — existing
- ✓ Correct `lang="ko"`, `aria-label`, `aria-expanded` usage — existing
- ✓ Specific Korean CTAs with no generic labels (Pillar 1: 4/4) — existing
- ✓ Semantic badge tokens (`--color-badge-concept`, `--color-badge-special`) in @theme — Validated in Phase 1
- ✓ Blockquote background uses `var(--color-accent-subtle)` theme token — Validated in Phase 1
- ✓ `--text-label` token replaces all `text-[10px]` arbitrary values — Validated in Phase 1
- ✓ `font-semibold` normalized (was `font-medium`) — Validated in Phase 1
- ✓ Global `*:focus-visible` ring on all interactive elements — Validated in Phase 2
- ✓ Skip-to-content link in BaseLayout (`본문으로 바로가기`) — Validated in Phase 2

### Active

- [ ] Fix raw HTML placeholder on season2.astro (visible `<!-- -->` and `<iframe>` text)
- [ ] Add actionable contact method to FAQ contact block
- [ ] Fix IBM Plex Mono word-spacing on Korean H1 headings
- [ ] Set AdoptionLadder activeLevel=1 on homepage
- [ ] Add accessible labels to session progress bar links
- [ ] Establish card padding convention (p-5 compact / p-6 feature) and apply consistently
- [ ] Normalize section vertical rhythm (`py-12` vs `py-10`) across pages

### Out of Scope

- Content changes to session Markdown files — audit found no copy issues
- New pages or features — this is a polish pass, not a feature release
- Design system overhaul — work within the existing `@theme` token system
- Season 2 content (Google Forms URL, actual season 2 curriculum) — not yet available
- Performance optimization — site is already static with no JS framework

## Context

- **Audience:** 광고 미디어렙 전직원 (advertising media rep employees) attending an AI Agent literacy seminar
- **Live URL:** https://elymas.github.io/agent-seminar/
- **Audit baseline:** 18/24 across 6 pillars (Copywriting 4/4, Visuals 3/4, Color 3/4, Typography 3/4, Spacing 3/4, Experience Design 2/4)
- **Existing codebase map:** `.planning/codebase/` (ARCHITECTURE.md, STACK.md)
- **Key files:** 7 static pages, 1 dynamic route, 1 layout, 2 components, 1 global CSS
- **Pillar 1 (Copywriting) is already 4/4** — no work needed there
- **Pillar 6 (Experience Design) has the most critical issues** — raw placeholder, dead-end contact, no focus styles

## Constraints

- **Tech stack:** Astro v6 + Tailwind CSS v4 — no new dependencies
- **Hosting:** GitHub Pages with `base: '/agent-seminar/'` — all URLs must respect base path
- **Fonts:** IBM Plex Mono (headings) + Pretendard (body) — keep the two-font system
- **Node.js:** >=22.12.0 (enforced in package.json)
- **No client-side JS framework:** Site is zero-JS SSG — fixes must be CSS/HTML only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Address all audit findings, not just top 3 | User wants to reach full polish (24/24 target) | — Pending |
| Keep IBM Plex Mono for headings | Distinctive tech-seminar aesthetic; fix spacing with `tracking-tight` instead of switching fonts | — Pending |
| Add semantic badge tokens rather than simplify to accent-only | Preserves visual distinction between session types while bringing colors into the design system | — Pending |
| Season2 placeholder → clean "coming soon" message | Can't add actual Google Forms URL yet; remove developer artifacts | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-31 after Phase 2 completion*
