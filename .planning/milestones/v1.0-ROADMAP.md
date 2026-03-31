# Roadmap: Agent Seminar — UI Audit Remediation

## Overview

Thirteen targeted CSS/HTML fixes across five audit pillars, applied in blast-radius order: design system tokens first (so later phases can reference them), then cross-cutting accessibility changes, then per-page edits, then visual tuning, then a final spacing consistency pass. Each phase leaves the site in a verifiably improved state.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Design System Tokens** - Add semantic color and typography tokens to the `@theme` block (completed 2026-03-31)
- [x] **Phase 2: Global Accessibility** - Add `:focus-visible` ring styles and skip-to-content link in BaseLayout (completed 2026-03-31)
- [x] **Phase 3: Page-Specific Fixes** - Fix season2 placeholder, FAQ contact block, and session progress bar labels (completed 2026-03-31)
- [x] **Phase 4: Visual Tuning** - Fix IBM Plex Mono heading word-spacing and set AdoptionLadder focal point
- [x] **Phase 5: Spacing Consistency** - Normalize card padding and section vertical rhythm across all pages (completed 2026-03-31)

## Phase Details

### Phase 1: Design System Tokens
**Goal**: The design token layer is complete — all colors and type sizes used across the site are named, semantic values in `@theme` rather than hardcoded literals
**Depends on**: Nothing (first phase)
**Requirements**: CLR-01, CLR-02, TYP-01, TYP-02
**Success Criteria** (what must be TRUE):
  1. Session type badge colors (`concept`, `special`) come from named `@theme` tokens, not inline `rgba()` or hex values
  2. Session detail page blockquote background uses a theme token, not a hardcoded `rgba()` call
  3. The 10px label size exists as a `--text-label` token and no `text-[10px]` arbitrary class appears anywhere in the codebase
  4. Font weight for the affected element reads `font-semibold`, not `font-medium`
**Plans:** 1/1 plans complete

Plans:
- [x] 01-01-PLAN.md — Add 8 semantic tokens to @theme and replace all hardcoded values across 4 files

**UI hint**: yes

### Phase 2: Global Accessibility
**Goal**: Keyboard and screen-reader users can navigate every page without relying on mouse — focus is always visible and the main content region is reachable by a single keystroke
**Depends on**: Phase 1
**Requirements**: EXP-03, EXP-04
**Success Criteria** (what must be TRUE):
  1. Tabbing through any page shows a clearly visible accent-color ring on each focused interactive element
  2. A "Skip to main content" link appears at the top of the DOM on every page and is functional when activated by keyboard
  3. No interactive element (nav links, buttons, accordion toggles, session cards) is left without a visible focus indicator
**Plans:** 1 plan

Plans:
- [x] 02-01-PLAN.md — Add global focus-visible ring and skip-to-content link across 2 files

**UI hint**: yes

### Phase 3: Page-Specific Fixes
**Goal**: Three rough user-facing edges are resolved — the season2 page no longer shows developer artifacts, the FAQ contact block gives users an actual way to reach the organizers, and session progress bar navigation is accessible to assistive technology
**Depends on**: Phase 2
**Requirements**: EXP-01, EXP-02, EXP-05
**Success Criteria** (what must be TRUE):
  1. Visiting `/season2/` shows a clean "coming soon" message — no raw HTML comment text, no visible `<iframe>` tag text
  2. The FAQ contact block contains a reachable contact method (email address or Slack link) a user can act on
  3. Session progress bar links have descriptive `aria-label` attributes (not just `title`) that screen readers announce correctly
**Plans**: TBD
**UI hint**: yes

### Phase 4: Visual Tuning
**Goal**: Heading legibility and the homepage hero visualization are both intentional — Korean H1 text no longer shows excessive Mono word-spacing, and the AdoptionLadder communicates entry-level engagement by default
**Depends on**: Phase 3
**Requirements**: VIS-01, VIS-02
**Success Criteria** (what must be TRUE):
  1. Korean text in H1 headings uses `tracking-tight`, eliminating the visual gap created by IBM Plex Mono's default letter-spacing
  2. The homepage AdoptionLadder renders with level 1 visually highlighted without any user interaction
**Plans**: TBD
**UI hint**: yes

### Phase 5: Spacing Consistency
**Goal**: Card padding and section spacing follow declared conventions throughout the site — no card deviates from the compact/feature padding rule, no section deviates from the rhythm baseline
**Depends on**: Phase 4
**Requirements**: SPC-01, SPC-02
**Success Criteria** (what must be TRUE):
  1. All compact-context cards use `p-5` and all feature-context cards use `p-6` — no other card padding values appear
  2. All section-level vertical padding reads `py-12` — no pages use `py-10` or other values for section rhythm
  3. A visual scan of the curriculum, schedule, resources, and about pages shows consistent internal spacing
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design System Tokens | 1/1 | Complete   | 2026-03-31 |
| 2. Global Accessibility | 1/1 | Complete   | 2026-03-31 |
| 3. Page-Specific Fixes | 1/1 | Complete   | 2026-03-31 |
| 4. Visual Tuning | 1/1 | Complete   | 2026-03-31 |
| 5. Spacing Consistency | 1/1 | Complete   | 2026-03-31 |
