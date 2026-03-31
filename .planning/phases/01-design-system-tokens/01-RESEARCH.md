# Phase 1: Design System Tokens - Research

**Researched:** 2026-03-31
**Domain:** Tailwind CSS v4 `@theme` token system, CSS custom properties
**Confidence:** HIGH

---

## Summary

Phase 1 is a surgical token-introduction pass. Four new requirements (CLR-01, CLR-02, TYP-01, TYP-02) each map to a small, precise set of file edits: add tokens to `src/styles/global.css`, then replace hardcoded values in the two `.astro` files that reference them.

The current `@theme` block has 13 tokens. This phase adds 8 more — 6 for badge colors (CLR-01), 1 for accent-subtle (CLR-02), and 1 for label font size (TYP-01) — and changes one `font-medium` to `font-semibold` (TYP-02). No structural changes, no new dependencies, no new pages.

The most important technical finding is how Tailwind v4 maps `@theme` CSS custom properties to utility classes. Specifically: `--text-{name}` tokens generate `text-{name}` font-size utilities (same namespace as `--text-xs`, `--text-sm`), and `--color-{name}` tokens generate `bg-{name}`, `text-{name}`, and `border-{name}` utilities. Both naming conventions are confirmed from the installed `tailwindcss@4.2.2` source.

**Primary recommendation:** Follow the UI-SPEC implementation checklist verbatim. All token names and replacement targets are pre-verified against the installed Tailwind v4 source and the actual line numbers in the codebase.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CLR-01 | Session type badge colors defined as semantic tokens in `@theme` block | 6 tokens added to `@theme`; 2 files updated (`[...slug].astro` `typeColor` record + `SessionCard.astro` ternary). Confirmed Tailwind v4 `--color-*` namespace generates `bg-*`, `text-*`, `border-*` utilities. |
| CLR-02 | Hardcoded `rgba()` in session detail blockquote replaced with theme token | 1 token `--color-accent-subtle` added to `@theme`; 1 inline `<style>` property in `[...slug].astro` line 314 replaced with `var(--color-accent-subtle)`. |
| TYP-01 | `text-[10px]` replaced with a `--text-label` theme token across all 14 uses | 1 token `--text-label: 10px` added to `@theme`; 14 instances replaced in 2 files. Confirmed `--text-{name}` generates `text-{name}` font-size utility in Tailwind v4. |
| TYP-02 | Single `font-medium` instance normalized to `font-semibold` | 1 class replacement in `[...slug].astro` line 147. No token needed — `font-semibold` already maps to existing Tailwind utility. |
</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.2.2 (installed) | Utility-first CSS framework | Already in use; `@theme` block is the v4 token mechanism |
| Astro | 6.0.8 (installed) | Static site generator | Already in use; all edits are in `.astro` template files |

### Supporting

No new libraries. This phase is CSS custom property declarations and class name substitutions only.

### Alternatives Considered

None applicable. The project constraint is "no new dependencies" and this phase is entirely within the existing `@theme` system.

**Installation:** None required.

---

## Architecture Patterns

### Tailwind v4 `@theme` Token Naming Convention

**Confirmed from `node_modules/tailwindcss/theme.css` and `dist/lib.js`:**

| CSS Custom Property Namespace | Generates Utility Classes |
|-------------------------------|--------------------------|
| `--color-{name}` | `bg-{name}`, `text-{name}`, `border-{name}`, `ring-{name}` |
| `--text-{name}` | `text-{name}` (font-size) |
| `--font-{name}` | `font-{name}` (font-family) |

**IMPORTANT:** The `--text` namespace in Tailwind v4 is used for **both** font-size tokens (via `--text-{name}`) and has sub-namespaces for color (`--text-color`), decoration, etc. The token `--text-label: 10px` placed in `@theme` correctly generates a `text-label` font-size utility — exactly the same mechanism used by `--text-xs: 0.75rem` → `text-xs`. This is HIGH confidence (verified from installed source).

### Token Declaration Pattern (Tailwind v4)

```css
/* Source: src/styles/global.css @theme block */
@theme {
  /* Existing pattern */
  --color-accent: #10b981;

  /* New color tokens — CLR-01 */
  --color-badge-concept: #3b82f6;
  --color-badge-concept-bg: rgba(59, 130, 246, 0.10);
  --color-badge-concept-border: rgba(59, 130, 246, 0.20);
  --color-badge-special: #eab308;
  --color-badge-special-bg: rgba(234, 179, 8, 0.10);
  --color-badge-special-border: rgba(234, 179, 8, 0.20);

  /* New color token — CLR-02 */
  --color-accent-subtle: rgba(16, 185, 129, 0.05);

  /* New text size token — TYP-01 */
  --text-label: 10px;
}
```

### Tailwind v4 Opacity Modifier Limitation

**What:** Tailwind v4's opacity modifier syntax (e.g., `bg-badge-concept/10`) uses `color-mix()` internally. This works when the token is a solid color (no alpha channel). When a token is already defined with rgba opacity baked in (e.g., `--color-badge-concept-bg: rgba(59, 130, 246, 0.10)`), the opacity modifier will not further combine correctly.

**Resolution:** The UI-SPEC already accounts for this by defining separate explicit tokens for each opacity level:
- `--color-badge-concept` — solid color for `text-badge-concept`
- `--color-badge-concept-bg` — pre-computed 10% rgba for `bg-badge-concept-bg`
- `--color-badge-concept-border` — pre-computed 20% rgba for `border-badge-concept-border`

This pattern matches how the existing `bg-accent/10` works vs. the new badge approach.

### Existing Codebase Pattern — Badge Colors

**Current hardcoded pattern (to be replaced):**

```astro
// Source: src/pages/sessions/[...slug].astro lines 27-31
const typeColor: Record<string, string> = {
  concept: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  practice: 'bg-accent/10 text-accent border-accent/20',
  special: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};
```

**Target pattern after CLR-01:**

```astro
const typeColor: Record<string, string> = {
  concept: 'bg-badge-concept-bg text-badge-concept border-badge-concept-border',
  practice: 'bg-accent/10 text-accent border-accent/20',
  special: 'bg-badge-special-bg text-badge-special border-badge-special-border',
};
```

`practice` is unchanged — it already uses existing theme tokens.

### Existing Codebase Pattern — SessionCard Badge (CLR-01)

**Current hardcoded ternary in `src/components/SessionCard.astro` line 37:**

```astro
type === 'practice' ? 'bg-accent/10 text-accent' : type === 'special' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'
```

**Note:** `SessionCard.astro` badge does not have a `border-*` class (unlike `[...slug].astro`). The replacement only needs `bg-*` and `text-*` tokens, not `border-*`.

### Existing Codebase Pattern — Blockquote (CLR-02)

**Current inline style in `src/pages/sessions/[...slug].astro` line 314 (inside `<style is:global>`):**

```css
background: var(--color-accent);
background: rgba(16, 185, 129, 0.05);
```

**Note:** There are two `background:` declarations — line 313 sets `var(--color-accent)` as a fallback, line 314 overrides it with the rgba. After the fix, line 313 can remain as-is (it is overridden) or both can be collapsed. The UI-SPEC specifies replacing only the `rgba()` line. The cleaner approach is to remove line 313 entirely since `--color-accent-subtle` carries the full intent.

### Anti-Patterns to Avoid

- **Using `--color-text-{name}` for badge text:** The text color utility `text-badge-concept` is generated from `--color-badge-concept`, not `--color-text-badge-concept`. The `--color-text-*` namespace is reserved for the existing semantic text hierarchy.
- **Using opacity modifiers on rgba tokens:** Do not write `bg-badge-concept-bg/50` — the token already encodes opacity. Use the token name directly.
- **Forgetting the `border` class in `[...slug].astro`:** The session header badge uses `border` class with `border-{typeColor}`. `SessionCard.astro` does not use border on its badge. Do not add border tokens to `SessionCard.astro`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font-size utility for 10px | Custom CSS class or `@layer` override | `--text-label: 10px` in `@theme` | Tailwind v4 auto-generates `text-label` utility with correct CSS custom property wiring |
| Opacity-reduced badge backgrounds | Compute rgba values inline in templates | Named tokens `--color-badge-concept-bg` | Single source of truth; consistent across `[...slug].astro` and `SessionCard.astro` |

**Key insight:** Tailwind v4's `@theme` is the designated mechanism for exactly this type of token extension. There is no need for `@layer utilities` or arbitrary value workarounds.

---

## Common Pitfalls

### Pitfall 1: `--text-label` Conflict with Text Color Namespace

**What goes wrong:** Tailwind v4 has a `--text-color` sub-namespace under `--text`. A developer unfamiliar with v4's resolution order might worry that `--text-label` is ambiguous or conflicts with color resolution.

**Why it happens:** The lib.js source shows `--text` namespace includes `--text-color`, `--text-decoration-color`, etc. as sub-namespaces. However the main `--text-{name}` token (without a `-color` suffix) is resolved as a font-size value.

**How to avoid:** Trust the pattern. `--text-xs`, `--text-sm`, etc. are all in the `--text-*` namespace in `theme.css` and generate font-size utilities. `--text-label: 10px` follows the same pattern.

**Warning signs:** If `text-label` generates a color utility instead of font-size, check that the value is a length unit (px, rem, em), not a color value.

### Pitfall 2: Duplicate Background Declaration in Blockquote Style

**What goes wrong:** Line 313 of `[...slug].astro` sets `background: var(--color-accent)` immediately before the rgba override on line 314. If only line 314 is changed, line 313 remains as a confusing remnant.

**Why it happens:** The original author wrote a fallback pattern: solid accent as fallback, then the transparent override. The fallback was never needed (CSS processes both lines and line 314 wins).

**How to avoid:** Remove line 313 when replacing line 314. The single `background: var(--color-accent-subtle)` line is complete and self-documenting.

### Pitfall 3: `SessionCard.astro` Badge Missing Border Token

**What goes wrong:** Adding `border-badge-concept-border` to `SessionCard.astro` when that component's badge has no `border` class.

**Why it happens:** The `[...slug].astro` badge uses a `border` class with `border-{typeColor}`. `SessionCard.astro` does not. Looking only at the token names and applying them to both files incorrectly.

**How to avoid:** Check the surrounding classes for each badge element before replacing. `SessionCard.astro` line 37: replace only `bg-*` and `text-*` portions.

### Pitfall 4: Line Number Drift

**What goes wrong:** UI-SPEC specifies line numbers (e.g., "line 147 of `[...slug].astro`"). If any earlier edits in the same file add or remove lines, subsequent line numbers shift.

**Why it happens:** Multi-edit passes in a single file.

**How to avoid:** Apply all edits to `[...slug].astro` in reverse line order (bottom-to-top) so earlier line numbers remain stable. Or use pattern matching rather than raw line numbers.

---

## Code Examples

### Token Declaration (verified from `theme.css` namespace pattern)

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* ... existing tokens ... */

  /* CLR-01: Session type badge colors */
  --color-badge-concept: #3b82f6;
  --color-badge-concept-bg: rgba(59, 130, 246, 0.10);
  --color-badge-concept-border: rgba(59, 130, 246, 0.20);
  --color-badge-special: #eab308;
  --color-badge-special-bg: rgba(234, 179, 8, 0.10);
  --color-badge-special-border: rgba(234, 179, 8, 0.20);

  /* CLR-02: Blockquote callout background */
  --color-accent-subtle: rgba(16, 185, 129, 0.05);

  /* TYP-01: Micro label font size */
  --text-label: 10px;
}
```

### TYP-01 Replacement Pattern

```astro
<!-- Before -->
<span class="font-mono text-[10px] text-text-muted tracking-widest uppercase">Session Progress</span>

<!-- After -->
<span class="font-mono text-label text-text-muted tracking-widest uppercase">Session Progress</span>
```

### TYP-02 Replacement (single instance)

```astro
<!-- Before: [..slug].astro line 147 -->
heading.depth === 2 ? 'text-text-secondary font-medium' : 'text-text-muted pl-2'

<!-- After -->
heading.depth === 2 ? 'text-text-secondary font-semibold' : 'text-text-muted pl-2'
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 `theme.extend` in `tailwind.config.js` | Tailwind v4 `@theme` block in CSS | v4.0 (2024) | Token declaration is now CSS-native, no JS config |
| `text-[10px]` arbitrary values | Named `--text-{name}` token + `text-name` utility | This phase | Removes arbitrary value, adds semantic meaning |
| Tailwind built-in `blue-500`, `yellow-500` | Project semantic `badge-concept`, `badge-special` | This phase | Design intent visible in class names |

**Deprecated/outdated:**
- `tailwind.config.js` with `theme.extend.colors`: Not used in this project. Tailwind v4 uses `@theme` in CSS instead.
- `@apply` for token consumption: Not needed here — all replacements are direct utility class references.

---

## Open Questions

1. **Line 313 blockquote fallback removal**
   - What we know: Line 313 (`background: var(--color-accent)`) is overridden by line 314 and has no functional effect
   - What's unclear: Whether the planner should specify removing line 313 as part of CLR-02 or leave it
   - Recommendation: Remove line 313 when replacing line 314. The UI-SPEC says "replace line 314" but leaving a dead declaration behind is messy. The plan task should cover both lines.

2. **`--text-label` line height companion**
   - What we know: Tailwind's built-in text size tokens have a `--text-{name}--line-height` companion (e.g., `--text-xs--line-height: calc(1 / 0.75)`). Custom tokens don't require it.
   - What's unclear: Whether omitting `--text-label--line-height` causes any rendering difference vs the current `text-[10px]` arbitrary class
   - Recommendation: Omit the line-height companion. The existing `text-[10px]` uses no explicit line-height, and none of the 14 instances set a line-height modifier. The browser default applies in both cases — behavior is identical.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 1 is purely CSS/HTML token additions and class name substitutions with no external dependencies beyond the already-installed `tailwindcss@4.2.2`.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None configured (no test files, no test scripts, no test framework) |
| Config file | none |
| Quick run command | `npm run build` (build-time type check + content schema validation) |
| Full suite command | `npm run build` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CLR-01 | `concept` and `special` badge classes reference `badge-*` tokens, not `blue-*/yellow-*` | smoke | `npm run build` (build fails on invalid Astro syntax) | N/A — build validation |
| CLR-01 | No `bg-blue-500`, `text-blue-400`, `bg-yellow-500`, `text-yellow-400` in badge positions | manual-only | `grep -r "blue-500\|yellow-500\|yellow-400\|blue-400" src/` | N/A — grep audit |
| CLR-02 | No `rgba(16, 185, 129` in source files | manual-only | `grep -r "rgba" src/` | N/A — grep audit |
| TYP-01 | No `text-[10px]` anywhere in codebase | manual-only | `grep -r "text-\[10px\]" src/` | N/A — grep audit |
| TYP-02 | No `font-medium` anywhere in codebase | manual-only | `grep -r "font-medium" src/` | N/A — grep audit |

**Note:** This project has no test framework. All validation is:
1. **Build validation:** `npm run build` — verifies Astro compiles and content schemas validate
2. **Grep audits:** Post-implementation checks confirming no hardcoded values remain
3. **Visual inspection:** Load the built site to verify badge colors render correctly

### Sampling Rate

- **Per task commit:** `npm run build` (ensures no syntax errors introduced)
- **Per wave merge:** `npm run build` + grep audits for all four requirements
- **Phase gate:** `npm run build` green + all four grep audits return zero matches

### Wave 0 Gaps

None — no test framework setup required. Build validation (`npm run build`) is the existing CI gate and covers all Phase 1 changes.

---

## Sources

### Primary (HIGH confidence)

- `node_modules/tailwindcss/theme.css` (installed v4.2.2) — `--text-*` namespace tokens confirming `--text-{name}` → `text-{name}` font-size utility pattern
- `node_modules/tailwindcss/dist/lib.js` (installed v4.2.2) — `--color` and `--text` namespace resolution map, `resolveWith` function showing font-size resolution path
- `src/styles/global.css` — existing `@theme` block structure
- `src/pages/sessions/[...slug].astro` — all 10 `text-[10px]` instances, 1 `font-medium` instance, blockquote rgba, `typeColor` record
- `src/components/AdoptionLadder.astro` — 4 `text-[10px]` instances
- `src/components/SessionCard.astro` — badge ternary with `blue-500`/`yellow-500` references

### Secondary (MEDIUM confidence)

None required — all findings verified from installed package source.

### Tertiary (LOW confidence)

None.

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — verified from installed package, no external lookup needed
- Architecture: HIGH — `@theme` token namespace behavior confirmed from `lib.js` source
- Pitfalls: HIGH — derived from direct code inspection of the three affected files
- Validation: HIGH — build-only project with known validation path

**Research date:** 2026-03-31
**Valid until:** 2026-06-30 (stable — Tailwind v4.2.x minor updates unlikely to change `@theme` namespace behavior)
