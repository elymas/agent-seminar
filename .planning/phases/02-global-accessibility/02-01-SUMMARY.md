---
phase: 02-global-accessibility
plan: 01
subsystem: accessibility
tags: [focus-ring, skip-link, keyboard-navigation, wcag, css, layout]
dependency_graph:
  requires: []
  provides: [global-focus-visible-ring, skip-to-content-link]
  affects: [src/styles/global.css, src/layouts/BaseLayout.astro]
tech_stack:
  added: []
  patterns: ["*:focus-visible universal CSS selector", "sr-only/focus:not-sr-only Tailwind pattern for skip links"]
key_files:
  created: []
  modified:
    - src/styles/global.css
    - src/layouts/BaseLayout.astro
decisions:
  - "Used *:focus-visible universal selector (not per-component) — covers all interactive elements with single rule"
  - "Used Tailwind sr-only/focus:not-sr-only pattern for skip link — no display:none, preserves tab order"
  - "focus:z-[60] for skip link — places above sticky nav at z-50"
metrics:
  duration: 71s
  completed: 2026-03-31
  tasks_completed: 2
  files_modified: 2
---

# Phase 02 Plan 01: Global Keyboard Accessibility Summary

**One-liner:** Global `:focus-visible` ring on every interactive element plus a Korean skip-to-content link using Tailwind's sr-only/focus:not-sr-only pattern.

## What Was Built

Added two keyboard accessibility improvements that apply globally to every page of the seminar site:

1. **Universal focus-visible ring** (`src/styles/global.css`): A single `*:focus-visible` rule appended after the `@theme` block applies a 2px `#10b981` (accent green) outline with 2px offset to every interactive element whenever navigated by keyboard. Mouse clicks do not trigger the ring (`:focus-visible` only fires on keyboard focus per browser spec).

2. **Skip-to-content link** (`src/layouts/BaseLayout.astro`): A `<a href="#main-content">본문으로 바로가기</a>` element inserted as the first child of `<body>`, before the sticky nav. It is visually hidden via `sr-only` but surfaces on the first Tab press using `focus:not-sr-only`. Uses `focus:z-[60]` to overlay the sticky nav (`z-50`), `focus:bg-accent focus:text-bg` for primary CTA styling, and `focus:rounded-btn` for the 2px radius token. The `<main>` element received `id="main-content"` to serve as the fragment target.

## Requirements Addressed

- **EXP-03** (add `:focus-visible` styles to global CSS) — Complete
- **EXP-04** (add skip-to-content link in BaseLayout) — Complete

## Commits

| Task | Description | Commit |
|------|-------------|--------|
| 1 | Add `*:focus-visible` ring rule to global.css | `9f464e9` |
| 2 | Add skip link and `id="main-content"` to BaseLayout | `be3df99` |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — both changes are fully wired and functional.

## Self-Check: PASSED

- [x] `src/styles/global.css` contains `*:focus-visible {` after line 16
- [x] `src/layouts/BaseLayout.astro` contains `href="#main-content"` (line 30)
- [x] `src/layouts/BaseLayout.astro` contains `本문으로 바로가기` (line 33)
- [x] `src/layouts/BaseLayout.astro` contains `id="main-content"` on `<main>` (line 64)
- [x] Skip link appears before `<nav>` in DOM order
- [x] No `outline-none` in `global.css`
- [x] Commits `9f464e9` and `be3df99` exist in git log
- [x] `npm run build` exits 0 after both tasks
