# Retrospective

## Milestone: v1.0 — UI Audit Remediation

**Shipped:** 2026-03-31
**Phases:** 5 | **Plans:** 5

### What Was Built

- 8 semantic design tokens in `@theme` block replacing all hardcoded badge colors, blockquote backgrounds, and arbitrary font sizes
- Global keyboard accessibility: `*:focus-visible` ring + skip-to-content link
- Season2 placeholder cleanup, FAQ contact method, accessible progress bar labels
- Korean H1 heading legibility fix with `tracking-tight`
- Consistent `py-12` section rhythm across all pages

### What Worked

- Blast-radius ordering (tokens → accessibility → per-page → visual → spacing) meant zero rework — each phase built on the previous
- Single-plan phases kept execution focused and fast
- Atomic commits per task made progress verifiable at each step
- All 13 requirements mapped to phases at roadmap creation — no scope drift

### What Was Inefficient

- CLI one-liner extraction from SUMMARY.md files produced poor results (only Phase 1 extracted correctly)
- Phase 4 had only 1 commit for 2 requirements (VIS-01 + VIS-02) — could have been atomic per requirement

### Patterns Established

- Badge colors: `bg-badge-{type}-bg text-badge-{type} border-badge-{type}-border` pattern
- Label micro-copy: `text-label` utility class for 10px tracking-widest uppercase labels
- Two font weights only: 400 (regular) and 600 (semibold)
- Section rhythm: `py-12` as universal section padding

### Key Lessons

- For bounded audit remediation, blast-radius ordering is the right approach — avoids cascading rework
- Universal CSS selectors (`*:focus-visible`) are preferable to per-component focus styling for SSG sites
- Placeholder values (`[CONTACT_EMAIL]`) should be flagged as known gaps, not marked as fully complete

### Cost Observations

- Sessions: 1 (single-session milestone)
- Timeline: 5 days wall-clock, executed in one session
- Notable: All 5 phases completed same day — small, focused phases execute fast

## Cross-Milestone Trends

| Milestone | Phases | Plans | Timeline | Key Pattern |
|-----------|--------|-------|----------|-------------|
| v1.0 | 5 | 5 | 5 days | Blast-radius ordering |
