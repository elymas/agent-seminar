---
phase: 3
slug: page-specific-fixes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None configured — no test runner in project |
| **Config file** | None |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run preview` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run preview`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | EXP-01 | build + manual | `npm run build` | N/A | ⬜ pending |
| 03-01-02 | 01 | 1 | EXP-02 | build + manual | `npm run build` | N/A | ⬜ pending |
| 03-01-03 | 01 | 1 | EXP-05 | build + manual | `npm run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework install needed — build pipeline (`npm run build`) catches syntax/schema errors, visual/accessibility verification is manual.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `/season2/` shows no angle-bracket developer artifact text | EXP-01 | Visual content check — no test runner | `npm run preview`, visit `/agent-seminar/season2/`, confirm no `<` or `>` text visible |
| FAQ contact card has actionable `<a>` or contact reference | EXP-02 | Content/UX check — no test runner | `npm run preview`, visit `/agent-seminar/faq/`, confirm contact link present and clickable |
| Progress bar links announce `aria-label` in screen reader | EXP-05 | AT interaction check | `npm run preview`, visit any session page, inspect `<a>` elements in progress bar for `aria-label` attribute |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
