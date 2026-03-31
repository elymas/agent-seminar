---
phase: 1
slug: design-system-tokens
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — static site, build-only verification |
| **Config file** | astro.config.mjs |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | CLR-01 | build + grep | `npm run build && grep -c 'badge-concept' src/styles/global.css` | ✅ | ⬜ pending |
| 01-01-02 | 01 | 1 | CLR-02 | build + grep | `npm run build && grep -c 'accent-subtle' src/styles/global.css` | ✅ | ⬜ pending |
| 01-01-03 | 01 | 1 | TYP-01 | build + grep | `npm run build && ! grep -r 'text-\[10px\]' src/` | ✅ | ⬜ pending |
| 01-01-04 | 01 | 1 | TYP-02 | build + grep | `npm run build && grep 'font-semibold' src/pages/sessions/\[...slug\].astro` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework needed — build verification + grep checks are sufficient for CSS token work.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Badge colors visually match design spec | CLR-01 | CSS token values produce correct visual appearance | Inspect session cards in browser, verify concept=emerald, special=amber badge colors |
| Blockquote background subtle and readable | CLR-02 | Visual quality check | Open any session detail page, verify blockquote has subtle accent background |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
