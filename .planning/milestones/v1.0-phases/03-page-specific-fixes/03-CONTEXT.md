# Phase 3: Page-Specific Fixes — Context

**Created:** 2026-03-31
**Status:** Approved

## Decisions

### EXP-01: Season2 Placeholder Cleanup
- Replace only the inner dashed-border code-display box (lines 142–149) with a single muted text line
- Keep outer card structure (? icon, heading, description) intact
- Replacement copy: `Season 1 진행 중 오픈 예정입니다.`
- Defer section padding fix (py-10→py-12) to Phase 5

### EXP-02: FAQ Contact Method
- Contact type: Email `mailto:` link
- Contact value: **Placeholder** `[CONTACT_EMAIL]` — user will replace before deploy
- Display format: Styled monospace link below existing prose text
- No extra Korean label before the link

### EXP-05: Progress Bar Accessible Labels
- Label language: Mixed — `Session N으로 이동` (Session is a proper noun)
- Current-session indicator: Yes — `Session N (현재 세션)으로 이동` for active segment
- Keep existing `title` attribute alongside `aria-label`

## Dependencies

- No cross-file dependencies — each fix is a single-file edit
- No new dependencies required
- EXP-02 contact value requires manual replacement before production deploy
