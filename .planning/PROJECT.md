# Agent Seminar — AI Agent Literacy Seminar Website

## What This Is

A polished static website for an AI Agent literacy seminar targeting advertising media rep employees. Built with Astro v6 + Tailwind CSS v4, deployed to GitHub Pages. All 6 audit pillars (copywriting, visuals, color, typography, spacing, experience design) have been addressed — the site is production-ready.

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
- ✓ Specific Korean CTAs with no generic labels — existing
- ✓ Semantic badge tokens (`--color-badge-concept`, `--color-badge-special`) — v1.0
- ✓ Blockquote background uses `var(--color-accent-subtle)` theme token — v1.0
- ✓ `--text-label` token replaces all `text-[10px]` arbitrary values — v1.0
- ✓ `font-semibold` normalized (was `font-medium`) — v1.0
- ✓ Global `*:focus-visible` ring on all interactive elements — v1.0
- ✓ Skip-to-content link in BaseLayout — v1.0
- ✓ Season2 shows clean "coming soon" message — v1.0
- ✓ FAQ contact block includes actionable contact method — v1.0
- ✓ Session progress bar links have accessible labels — v1.0
- ✓ Korean H1 headings use `tracking-tight` — v1.0
- ✓ AdoptionLadder renders with `activeLevel={1}` default — v1.0
- ✓ Card padding convention (`p-5` compact / `p-6` feature) — v1.0
- ✓ Section vertical rhythm normalized to `py-12` — v1.0

### Active

(None — next milestone not yet planned)

### Out of Scope

- Content changes to session Markdown files — audit found no copy issues
- New pages or features — this was a polish pass
- Design system overhaul — worked within existing `@theme` token system
- Season 2 content (Google Forms URL, actual curriculum) — not yet available
- Performance optimization — site is already static with no JS framework
- Mobile app or PWA — web-only static site
- Offline mode — static site served from CDN

## Context

- **Audience:** 광고 미디어렙 전직원 attending AI Agent literacy seminar
- **Live URL:** https://elymas.github.io/agent-seminar/
- **Shipped:** v1.0 UI Audit Remediation (2026-03-31) — 13/13 requirements resolved
- **Codebase:** ~4,000 LOC (Astro + TypeScript + CSS + Markdown)
- **Tech stack:** Astro v6, Tailwind CSS v4, GitHub Pages, GitHub Actions
- **Outstanding:** `[CONTACT_EMAIL]` placeholder in FAQ page needs real email address

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Address all audit findings, not just top 3 | User wants full polish (24/24 target) | ✓ Good — all 13 shipped |
| Keep IBM Plex Mono for headings | Distinctive tech-seminar aesthetic; fix spacing with `tracking-tight` | ✓ Good — legibility resolved |
| Add semantic badge tokens rather than simplify to accent-only | Preserves visual distinction between session types | ✓ Good — clean token system |
| Season2 placeholder → clean "coming soon" message | Can't add actual Google Forms URL yet; remove developer artifacts | ✓ Good — clean UX |
| Universal `*:focus-visible` selector (not per-component) | Single rule covers all interactive elements | ✓ Good — zero maintenance |
| Blast-radius ordering: tokens → accessibility → per-page → visual → spacing | Earlier phases provide foundation for later ones | ✓ Good — no rework needed |

## Constraints

- **Tech stack:** Astro v6 + Tailwind CSS v4 — no new dependencies
- **Hosting:** GitHub Pages with `base: '/agent-seminar/'` — all URLs must respect base path
- **Fonts:** IBM Plex Mono (headings) + Pretendard (body) — two-font system
- **Node.js:** >=22.12.0 (enforced in package.json)
- **No client-side JS framework:** Zero-JS SSG — fixes must be CSS/HTML only

---
*Last updated: 2026-03-31 after v1.0 milestone*
