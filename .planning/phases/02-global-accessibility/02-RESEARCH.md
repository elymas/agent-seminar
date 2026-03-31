# Phase 2: Global Accessibility - Research

**Researched:** 2026-03-31
**Domain:** CSS accessibility — `:focus-visible` ring styles, skip-to-content link pattern
**Confidence:** HIGH

## Summary

Phase 2 adds two accessibility features to a zero-JS Astro SSG: a global `:focus-visible` outline rule and a skip-to-content link in `BaseLayout.astro`. The UI-SPEC (02-UI-SPEC.md) was approved before research began and serves as the authoritative design contract. Research confirms all design decisions in the UI-SPEC are technically sound and consistent with WCAG 2.4.1 and modern browser behavior.

The implementation is confined to exactly two files: `src/styles/global.css` (add `*:focus-visible` rule and `.sr-only` utility) and `src/layouts/BaseLayout.astro` (add skip link as first `<body>` child; add `id="main-content"` to `<main>`). The existing codebase has zero focus styles and zero skip links — both are net-new additions with no conflicts to resolve.

A key Tailwind v4 pitfall (`outline-none` breaking `:focus-visible` overrides) does not affect this project: a grep confirms no `outline-none` class anywhere in the source.

**Primary recommendation:** Add one global CSS rule and one HTML snippet to `BaseLayout.astro`. No per-component changes needed.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EXP-03 | All interactive elements show a visible `:focus-visible` ring using the accent color | Single `*:focus-visible` rule in `global.css` covers all current and future interactive elements universally. Accent color `#10b981` has ~5.4:1 contrast ratio against `#0a0a0a` background — WCAG AA compliant. |
| EXP-04 | BaseLayout includes a skip-to-content link for keyboard navigation | Insert `<a href="#main-content">` as first `<body>` child in `BaseLayout.astro`. Add `id="main-content"` to existing `<main>` element. Use `.sr-only` + `:focus` reveal pattern (not `display:none`). |
</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.2.2 (installed) | Utility classes for skip link visible state | Already in project — `bg-accent`, `text-bg`, `font-mono`, `font-semibold`, `px-4 py-2`, `rounded-btn` |
| Plain CSS | n/a | `*:focus-visible` rule + `.sr-only` utility | No library needed; pure CSS in `global.css` |

### Supporting

No additional libraries. This phase is CSS-only.

**Installation:** None required.

---

## Architecture Patterns

### Recommended File Changes

```
src/styles/global.css        ← add *:focus-visible rule + .sr-only utility class
src/layouts/BaseLayout.astro ← add skip link before <nav>; add id="main-content" to <main>
```

No other files change. The global CSS rule covers all interactive elements site-wide automatically.

### Pattern 1: Global `:focus-visible` Ring

**What:** Single universal selector rule that applies the accent-color outline to all focusable elements when navigated via keyboard. Does not fire on mouse clicks (`:focus-visible` heuristic).

**When to use:** Any project where you want consistent, site-wide focus treatment without per-component annotation.

**Example:**
```css
/* Source: Tailwind CSS docs — global base styles, WCAG 1.4.11 */
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

This goes in `src/styles/global.css` after the `@theme` block as a bare CSS rule (not inside `@theme`).

### Pattern 2: Skip-to-Content Link

**What:** Visually hidden link that becomes visible on keyboard focus. Must be first in DOM, before `<nav>`. Target anchor must exist on the same page.

**When to use:** WCAG 2.4.1 (Level A) — required whenever a page has repeated navigation blocks before main content.

**Example:**
```html
<!-- In BaseLayout.astro — first child of <body>, before <nav> -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-accent focus:text-bg focus:font-mono focus:font-semibold focus:text-sm focus:px-4 focus:py-2 focus:rounded-btn"
>
  본문으로 바로가기
</a>
```

```html
<!-- <main> element in BaseLayout.astro — add id attribute -->
<main id="main-content" class="max-w-5xl mx-auto px-4 py-8" role="main">
```

**Alternative approach (pure CSS `.sr-only` class in global.css):**
```css
/* Source: WebAIM skip navigation pattern, Tailwind's own sr-only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

Both approaches (Tailwind `sr-only` + `focus:not-sr-only` variant vs. plain CSS `.sr-only` with `:focus` rule) are valid. The Tailwind utility approach is preferred here because the project already uses Tailwind exclusively and avoids adding a custom CSS class.

### Anti-Patterns to Avoid

- **`display:none` on skip link:** Removes it from keyboard tab order entirely. Use `sr-only` off-screen positioning instead.
- **`outline: none` without replacement:** Leaves keyboard users with no focus indicator. The current codebase has no `outline-none` — do not introduce it.
- **`outline-none` in Tailwind v4:** In Tailwind v4, `outline-none` compiles to `outline-style: none` (not `outline: 2px solid transparent` as in v3), which can interfere with `:focus-visible` overrides. Use `outline-hidden` if suppression is ever needed. This project does not need it.
- **Skip link targeting a non-focusable element:** The `<main id="main-content">` element needs `tabindex="-1"` only if you want focus to visually land inside it (some screen readers need it). For this project the link activates scroll-to, which is sufficient — no `tabindex` needed.
- **Using `:focus` instead of `:focus-visible` for the ring:** `:focus` fires on mouse click too, creating visible rings on click interaction. Use `:focus-visible` for the ring; use `:focus` only for the skip link reveal (which is intentional on both keyboard and any focus trigger).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Screen-reader-only visually-hidden element | Custom "invisible" CSS with `opacity: 0` or `visibility: hidden` | `.sr-only` pattern (Tailwind utility or equivalent CSS) | `opacity:0`/`visibility:hidden` hide from AT too; `sr-only` hides visually but keeps in accessibility tree and tab order |
| Per-element focus styles | Adding `focus-visible:outline-accent focus-visible:outline-2` to every `<a>` and `<button>` | Single `*:focus-visible` rule in `global.css` | Universal selector covers all current and future elements; per-element annotation is fragile |

**Key insight:** CSS `*:focus-visible` is a zero-maintenance pattern — any interactive element added in future phases automatically receives the correct ring without additional work.

---

## Common Pitfalls

### Pitfall 1: Tailwind v4 `outline-none` Breakage

**What goes wrong:** Using `outline-none` utility in Tailwind v4 sets `outline-style: none` (not `outline: 2px solid transparent` as in v3). A subsequent `:focus-visible` rule with `outline-color` or `outline-width` only partially overrides, leaving no visible ring in some browsers.

**Why it happens:** Tailwind v4 separated `outline-style` from `outline-width`/`outline-color`. The v3 `outline-none` was a composite shorthand; v4 is not.

**How to avoid:** Never add `outline-none` to this project. Use `outline-hidden` if you need to suppress the browser default for a specific element (it preserves forced-colors mode).

**Warning signs:** Focused element shows no ring despite `*:focus-visible` rule being present.

**Status for this project:** Not applicable — no `outline-none` exists anywhere in the codebase (verified by grep).

### Pitfall 2: Skip Link Target Has No Scroll Anchor

**What goes wrong:** `href="#main-content"` activates but nothing happens if no element with `id="main-content"` exists in the DOM.

**Why it happens:** Current `<main>` has `role="main"` but no `id` attribute.

**How to avoid:** Add `id="main-content"` to the `<main>` element in `BaseLayout.astro` in the same PR as the skip link.

**Warning signs:** Clicking/activating skip link causes URL to append `#main-content` but page does not scroll or shift focus.

### Pitfall 3: Skip Link Hidden with `display:none`

**What goes wrong:** `display:none` removes the element from keyboard tab order, so keyboard users can never reach or activate the skip link.

**Why it happens:** Developers mistake "visually hidden" for "hidden from everything."

**How to avoid:** Use the `sr-only` pattern (absolute position, 1px × 1px, clipped). Tailwind's `sr-only` + `focus:not-sr-only` variant pair is the correct implementation.

**Warning signs:** Tab key skips over the skip link entirely; it never receives focus.

### Pitfall 4: z-index Below Nav

**What goes wrong:** Skip link becomes visible on focus but renders behind the sticky nav (z-50), making it invisible.

**Why it happens:** Sticky nav has `z-50`. Skip link fixed position must be above it.

**How to avoid:** Use `z-[60]` on the visible skip link state (as specified in UI-SPEC).

**Warning signs:** Skip link receives focus and keyboard users can activate it but it is not visible.

---

## Code Examples

### Complete `*:focus-visible` rule for `global.css`

```css
/* Source: WCAG 1.4.11, MDN :focus-visible, Tailwind docs */
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

Place this after the closing brace of the `@theme` block (line 30 of current `global.css`).

### Skip link HTML for `BaseLayout.astro`

```html
<!-- First child of <body>, before <nav aria-label="Main navigation"> -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-accent focus:text-bg focus:font-mono focus:font-semibold focus:text-sm focus:px-4 focus:py-2 focus:rounded-btn"
>
  본문으로 바로가기
</a>
```

### Updated `<main>` element

```html
<!-- Change: add id="main-content" -->
<main id="main-content" class="max-w-5xl mx-auto px-4 py-8" role="main">
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `:focus` for ring (fires on click too) | `:focus-visible` (keyboard-only heuristic) | CSS Selectors Level 4 — broad support from 2022 | No mouse-click rings; keyboard rings remain |
| `clip: rect(0,0,0,0)` for sr-only | `clip-path: inset(50%)` or Tailwind's `.sr-only` | Modern CSS; Tailwind standardized | Both work; Tailwind's version is well-maintained |
| `tabindex="0"` on skip link target | No tabindex needed on `<main>` for scroll | 2024 WebAIM guidance | Fewer DOM annotations needed |

**No deprecated/outdated patterns in scope for this phase.**

---

## Open Questions

1. **`focus:not-sr-only` availability in Tailwind v4**
   - What we know: `sr-only` and `focus:not-sr-only` were established Tailwind v3 utilities. In Tailwind v4, `not-sr-only` reversal works as a variant.
   - What's unclear: Whether Tailwind v4's JIT correctly generates `focus:not-sr-only` without any additional config.
   - Recommendation: If `focus:not-sr-only` does not produce the expected output during build, fall back to an explicit `.skip-link` custom class in `global.css` using the raw CSS pattern (absolute off-screen + `:focus { position: fixed; ... }`). Either way the result is identical.

---

## Environment Availability

Step 2.6: SKIPPED (no external dependencies — CSS/HTML-only changes with no CLI tools, services, or databases required).

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None configured — no test framework detected |
| Config file | None |
| Quick run command | `npm run build` (Astro build validates HTML/Astro syntax and Zod schemas) |
| Full suite command | `npm run build` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EXP-03 | All interactive elements show `:focus-visible` ring | smoke/manual | `npm run build` (build success confirms CSS syntax valid) | N/A — manual keyboard test |
| EXP-04 | Skip link appears at top of DOM, functional when activated | smoke/manual | `npm run build` (build success); manual Tab key test | N/A — manual keyboard test |

### Sampling Rate

- **Per task commit:** `npm run build` — verifies no syntax errors or broken schema
- **Per wave merge:** `npm run build` + manual keyboard tab test in browser
- **Phase gate:** Build passes + keyboard tab through any page shows accent ring + skip link functions

### Wave 0 Gaps

None — no test infrastructure exists and none is required. The phase is two CSS/HTML additions. Verification is manual keyboard testing in browser after `npm run build && npm run preview`. No test files to create.

---

## Project Constraints (from CLAUDE.md)

| Directive | Implication for This Phase |
|-----------|---------------------------|
| No new dependencies | CSS-only implementation; no npm install needed |
| Astro v6 + Tailwind CSS v4 only | `*:focus-visible` is plain CSS; skip link uses existing Tailwind utilities |
| No client-side JS framework | Focus ring is pure CSS; no JS required |
| GitHub Pages base path `/agent-seminar/` | Skip link is `href="#main-content"` (fragment, not path) — unaffected by base path |
| Korean user-facing copy | Skip link text: `본문으로 바로가기` |
| `font-mono` for labels/headings | Skip link uses `font-mono font-semibold text-sm` (matches primary CTA convention) |
| `rounded-btn` (2px) for buttons | Skip link visible state uses `rounded-btn` |
| Accent color `#10b981` | Focus ring and skip link background both use `var(--color-accent)` |
| `z-50` on sticky nav | Skip link visible state uses `z-[60]` to appear above nav |
| GSD workflow for all edits | All changes go through `/gsd:execute-phase` |

---

## Sources

### Primary (HIGH confidence)

- Codebase inspection — `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/SessionCard.astro`, `src/pages/sessions/[...slug].astro`, `src/pages/faq.astro` — confirmed no existing focus styles, no `outline-none`, no `id="main-content"`
- [02-UI-SPEC.md](02-UI-SPEC.md) — approved design contract specifying all dimensions

### Secondary (MEDIUM confidence)

- [Tailwind CSS v4 GitHub Issue #15152](https://github.com/tailwindlabs/tailwindcss/issues/15152) — `outline-none` breakage in v4; confirmed `outline-hidden` is the fix. Not applicable to this project (no `outline-none` in codebase).
- [WebAIM: Skip Navigation Links](https://webaim.org/techniques/skipnav/) — `sr-only` + `:focus` reveal pattern; `display:none` prohibition
- [WCAG 2.4.1 — Bypass Blocks](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-skip.html) — Level A requirement for skip links

### Tertiary (LOW confidence)

None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — project stack is known, no new packages needed
- Architecture: HIGH — two-file change fully specified in UI-SPEC; codebase inspection confirms no conflicts
- Pitfalls: HIGH — Tailwind v4 `outline-none` issue verified from official GitHub; skip link patterns verified from WebAIM

**Research date:** 2026-03-31
**Valid until:** 2026-09-30 (stable CSS/HTML patterns; no fast-moving ecosystem)
