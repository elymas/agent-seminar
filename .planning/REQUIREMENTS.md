# Requirements: Agent Seminar — UI Audit Remediation

**Defined:** 2026-03-31
**Core Value:** Every page a seminar attendee can reach must feel intentionally finished

## v1 Requirements

Requirements for audit remediation. Each maps to roadmap phases.

### Experience Design

- [x] **EXP-01**: Season2 page shows a clean "coming soon" message instead of raw HTML placeholder text
- [x] **EXP-02**: FAQ contact block includes an actionable contact method (email or Slack link)
- [x] **EXP-03**: All interactive elements show a visible `:focus-visible` ring using the accent color
- [x] **EXP-04**: BaseLayout includes a skip-to-content link for keyboard navigation
- [x] **EXP-05**: Session progress bar links have accessible labels (aria-label, not just title)

### Visuals

- [x] **VIS-01**: Korean H1 headings use `tracking-tight` to fix IBM Plex Mono word-spacing
- [x] **VIS-02**: Homepage AdoptionLadder renders with `activeLevel={1}` as a default focal point

### Color

- [x] **CLR-01**: Session type badge colors defined as semantic tokens in `@theme` block
- [x] **CLR-02**: Hardcoded `rgba()` in session detail blockquote replaced with theme token

### Typography

- [x] **TYP-01**: `text-[10px]` replaced with a `--text-label` theme token across all 14 uses
- [x] **TYP-02**: Single `font-medium` instance normalized to `font-semibold`

### Spacing

- [ ] **SPC-01**: Card padding follows convention: `p-5` for compact, `p-6` for feature cards
- [ ] **SPC-02**: Section vertical rhythm normalized to consistent `py-12` across pages

## v2 Requirements

None — this is a bounded audit remediation pass.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Content changes to session Markdown | Audit found no copy issues (Pillar 1: 4/4) |
| New pages or features | Polish pass, not a feature release |
| Design system overhaul | Work within existing `@theme` token system |
| Season 2 actual content (Google Forms URL) | Not yet available |
| Performance optimization | Site is already static SSG with no JS framework |
| Mobile app or PWA | Web-only static site |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLR-01 | Phase 1 | Complete |
| CLR-02 | Phase 1 | Complete |
| TYP-01 | Phase 1 | Complete |
| TYP-02 | Phase 1 | Complete |
| EXP-03 | Phase 2 | Complete |
| EXP-04 | Phase 2 | Complete |
| EXP-01 | Phase 3 | Complete |
| EXP-02 | Phase 3 | Complete (placeholder) |
| EXP-05 | Phase 3 | Complete |
| VIS-01 | Phase 4 | Complete |
| VIS-02 | Phase 4 | Complete |
| SPC-01 | Phase 5 | Pending |
| SPC-02 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0

---
*Requirements defined: 2026-03-31*
*Last updated: 2026-03-31 after roadmap creation — all 13 requirements mapped*
