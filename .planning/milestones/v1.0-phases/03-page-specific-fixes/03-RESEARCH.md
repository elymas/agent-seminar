# Phase 3: Page-Specific Fixes — Research

**Researched:** 2026-03-31
**Domain:** Astro v6 SSG — HTML/CSS-only corrections for three discrete UI problems
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from PROJECT.md / STATE.md)

### Locked Decisions

- Season2 page: replace developer placeholder artifacts with a clean "coming soon" message. Google Forms URL is NOT yet available — do not attempt to embed an actual form.
- Tech stack: Astro v6 + Tailwind CSS v4 — no new dependencies permitted.
- Site is zero-JS SSG — all fixes must be HTML/CSS only (no client-side framework).
- Hosting: GitHub Pages with `base: '/agent-seminar/'` — all URLs must respect the base path.
- Fonts: IBM Plex Mono (headings) + Pretendard (body) — keep the two-font system.

### Claude's Discretion

- What contact method to display in the FAQ contact block — email address format vs Slack channel name, as long as it is actionable (something a user can actually use).
- Exact copy wording for the season2 "form coming soon" sub-section.
- Exact aria-label string content for the session progress bar links (must clearly identify the session number).

### Deferred Ideas (OUT OF SCOPE)

- Actual Google Forms embed URL for season2 (not yet available).
- New pages or features.
- Season 2 actual curriculum content.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EXP-01 | Season2 page shows a clean "coming soon" message instead of raw HTML placeholder text | See "EXP-01 Analysis" section — the dashed-border box currently renders escaped HTML tag text visible to all users |
| EXP-02 | FAQ contact block includes an actionable contact method (email or Slack link) | See "EXP-02 Analysis" section — the contact card currently has zero actionable mechanism |
| EXP-05 | Session progress bar links have accessible labels (aria-label, not just title) | See "EXP-05 Analysis" section — `title` attribute is not announced reliably by screen readers; `aria-label` is required |
</phase_requirements>

---

## Summary

Phase 3 addresses three self-contained UI problems in `src/pages/season2.astro`, `src/pages/faq.astro`, and `src/pages/sessions/[...slug].astro`. None of the fixes requires new libraries, build changes, or cross-file coordination beyond the single file per requirement. All fixes are HTML/CSS edits inside existing Astro component frontmatter/template blocks.

The most visually impactful fix is EXP-01: the season2 page currently renders escaped HTML comment text (`<!-- Google Forms embed will be placed here -->`) and an escaped `<iframe>` tag string as visible text content inside a styled dashed-border box. This is a developer artifact that reached production. The fix is to replace that dashed-border code-display box with a simple "준비 중" state message consistent with how the rest of the page communicates the "not yet live" status.

EXP-02 is a dead-end UX issue: the FAQ contact card tells users to contact the "세미나 운영팀" but provides no mechanism to do so. Adding a concrete email address (or Slack channel name) inside that card resolves it.

EXP-05 is a screen-reader accessibility gap: the 12 progress-bar segment `<a>` tags in `[...slug].astro` use only `title="Session N"` for identification. The `title` attribute is not reliably announced by screen readers (it is a mouse-hover tooltip, not an accessible name in most AT contexts). Adding `aria-label` with descriptive text is the correct WCAG 2.1 pattern for icon-only or visual-only links.

**Primary recommendation:** Three targeted single-file edits — no new abstractions, no dependencies, no structural changes.

---

## Standard Stack

No new libraries. All fixes use existing project primitives.

### Core (existing — no changes)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 6.0.8 | SSG framework — template authoring | Already in use |
| Tailwind CSS v4 | 4.2.2 | Utility classes via `@theme` tokens | Already in use |

### No new dependencies

All three fixes are expressible in Astro template syntax (JSX-like expressions) and existing Tailwind utility classes. No `npm install` required.

---

## Architecture Patterns

### File Scope

Each requirement maps to exactly one file:

| Requirement | File | Change Type |
|-------------|------|-------------|
| EXP-01 | `src/pages/season2.astro` | Replace one `<div>` block (lines 142–149) |
| EXP-02 | `src/pages/faq.astro` | Augment contact card (lines 171–176) |
| EXP-05 | `src/pages/sessions/[...slug].astro` | Add `aria-label` attribute to `<a>` in progress bar map (lines 45–56) |

### Pattern: Astro template expression for dynamic aria-label (EXP-05)

The progress bar is generated with an `.map()` expression:

```astro
{Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
  <a
    href={`${base}sessions/session-${n.toString().padStart(2, '0')}/`}
    class={`h-1.5 flex-1 rounded-full transition-colors ${...}`}
    title={`Session ${n}`}
    aria-label={`Session ${n}${n === number ? ' (현재 세션)' : ''}`}
  />
))}
```

The `aria-label` expression is a template literal using `n` (the iteration variable) and `number` (the current session's data prop), both already in scope. The `(현재 세션)` suffix on the active segment is optional but improves orientation for screen-reader users.

**Note:** `<a>` elements that contain no inner text (these are thin bar segments with no child content) depend entirely on `aria-label` for their accessible name. The `title` attribute alone does not satisfy WCAG 2.1 SC 4.1.2. [Source: MDN — aria-label, WCAG 2.1 Technique ARIA14]

### Pattern: Replacing dashed placeholder box (EXP-01)

The current offending block in `season2.astro` lines 142–149:

```astro
<div class="bg-bg-hover/50 rounded-card p-6 border border-dashed border-bg-hover">
  <p class="font-mono text-text-muted text-xs">
    &lt;!-- Google Forms embed will be placed here --&gt;
  </p>
  <p class="font-mono text-text-muted text-xs mt-2">
    &lt;iframe src="GOOGLE_FORMS_URL" ...&gt;&lt;/iframe&gt;
  </p>
</div>
```

This should be replaced with a neutral "준비 중" indicator consistent with the existing `"피드백 폼 준비 중"` heading above it. A simple status row (e.g., a muted label "폼 오픈 예정: Season 1 종료 후") removes the developer-artifact feel without implying an error.

The surrounding outer `<div>` (lines 132–150, the card with `?` icon) is already well-structured as a placeholder — only the inner dashed-border code-display box needs to change.

### Pattern: Actionable contact in FAQ card (EXP-02)

The current contact card at `faq.astro` lines 171–176:

```astro
<div class="bg-bg-card rounded-card p-6 text-center max-w-3xl">
  <p class="text-text-secondary text-sm mb-3">위에 없는 질문이 있으신가요?</p>
  <p class="text-text-muted text-xs">세미나 운영팀에 문의하시면 답변을 드리겠습니다.</p>
</div>
```

There is no `<a href="mailto:...">` or Slack reference. The fix is to add a contact mechanism. Per REQUIREMENTS.md: email address or Slack link. The planner must decide the actual contact value; the pattern is:

```astro
<a href="mailto:seminar@example.com" class="font-mono text-accent hover:text-accent-hover text-xs transition-colors">
  seminar@example.com
</a>
```

Or for a Slack channel:

```astro
<p class="text-text-muted text-xs mt-2">
  Slack <span class="font-mono text-text-secondary">#seminar-questions</span> 채널에 남겨주세요.
</p>
```

The correct contact value is **not known to this researcher** — it must be provided by the user or left as a clearly marked placeholder. The planner's task should include a note that the actual contact value is required.

---

## EXP-01 Analysis: season2.astro Placeholder

### What is rendering as visible text

Lines 143–148 of `season2.astro` render the following escaped HTML strings as on-screen text:

```
<!-- Google Forms embed will be placed here -->
<iframe src="GOOGLE_FORMS_URL" ...></iframe>
```

These are `&lt;` / `&gt;` HTML entities inside `<p>` tags, so they render as literal angle-bracket text. They are not invisible HTML comments — they are visible on-screen text content inside a styled `<div class="border-dashed">` box. Any user visiting `/season2/` sees this.

### Fix scope

Replace the inner dashed box (a `<div>` with two `<p>` children, ~8 lines) with a clean status indicator. The outer card structure (icon, heading, description) stays intact. No structural changes to the rest of the page.

---

## EXP-02 Analysis: FAQ Contact Block

### Current state

The contact section (lines 170–176) contains only prose text:
- "위에 없는 질문이 있으신가요?"
- "세미나 운영팀에 문의하시면 답변을 드리겠습니다."

There is no `<a>`, no `mailto:`, no Slack reference, no phone — nothing a user can act on. This is a dead-end interaction.

### Fix scope

Add one or two lines inside the existing card that give a reachable contact method. The card's visual structure stays the same. The contact value (email or Slack) is a content decision outside research scope — the planner must surface this as a required user input before execution, OR use a placeholder that is clearly marked for replacement.

### Contact value options

| Option | HTML pattern | Notes |
|--------|-------------|-------|
| Email | `<a href="mailto:X">X</a>` | Instantly actionable, universal |
| Slack channel | `<span class="font-mono">#channel</span>` + prose | Internal-only, no href needed |
| Both | Email + Slack | Most complete for an internal corporate seminar |

Given this is an internal corporate seminar (광고 미디어렙 전직원), a Slack channel reference is likely the primary contact method. Email may be a fallback. The planner should flag this as needing user input.

---

## EXP-05 Analysis: Progress Bar Accessible Labels

### Why `title` is insufficient

The `title` attribute on interactive elements:
- Is announced by some screen readers only in "browse mode," not focus mode
- Is never announced by iOS VoiceOver on touch devices
- Is not a valid accessible name source for elements that have no inner text content (ARIA spec: accessible name computation prefers `aria-label` > `aria-labelledby` > element content > `title`)

For `<a>` elements that are thin visual bars with no inner text, `title` provides zero accessible name in most AT contexts. WCAG 2.1 SC 4.1.2 (Name, Role, Value) requires every interactive element to have an accessible name.

### Current code (lines 45–56 of `[...slug].astro`)

```astro
<a
  href={`${base}sessions/session-${n.toString().padStart(2, '0')}/`}
  class={`h-1.5 flex-1 rounded-full transition-colors ${...}`}
  title={`Session ${n}`}
/>
```

The `<a>` is self-closing with no text content. Its only identification is `title`. This fails accessible name computation.

### Fix

Add `aria-label` to each link. Keep `title` as a tooltip fallback (no harm). The label should identify the destination clearly:

```astro
aria-label={`Session ${n}으로 이동`}
```

Or with current-session indicator:

```astro
aria-label={`Session ${n}${n === number ? ' (현재)' : ''}으로 이동`}
```

**Source:** WCAG 2.1 Technique ARIA14, MDN ARIA aria-label documentation.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible link names | Custom JS focus manager | `aria-label` HTML attribute | Native AT support, zero JS, WCAG compliant |
| "Coming soon" state | New component | Replace existing placeholder markup inline | One-off case, no reuse needed |
| Contact link | Form or modal | Plain `<a href="mailto:">` or Slack reference | Simplest actionable solution; site is zero-JS |

---

## Common Pitfalls

### Pitfall 1: Leaving the outer placeholder card when removing the inner box (EXP-01)

**What goes wrong:** Developer removes only the dashed-border inner `<div>` but leaves the `?` icon and "피드백 폼 준비 중" heading pointing to nothing. The card looks incomplete.

**How to avoid:** Keep the outer card structure intact. Only replace the inner dashed-border code-display box with a simple "폼 오픈 예정" text row. The outer card's `?` icon + heading + description remain as the "form is coming" message — the inner box was the only artifact.

### Pitfall 2: Using `aria-label` AND non-empty inner text that conflicts (EXP-05)

**What goes wrong:** If the `<a>` ever gains inner text content (e.g., a session number span added for visual purposes), the `aria-label` overrides the inner text completely for AT. Screen readers would announce the `aria-label` value and ignore the visible text.

**How to avoid:** The current `<a>` elements are self-closing with no inner text — this is not a current risk. If inner text is ever added, update or remove `aria-label` accordingly.

### Pitfall 3: Hardcoding a placeholder contact email that looks real (EXP-02)

**What goes wrong:** Plan executes with a fake `seminar@company.com` address that doesn't exist, making the site worse (a dead link is worse than no link).

**How to avoid:** Either get the real contact value from the user before execution, OR use a clearly-marked placeholder pattern like `[CONTACT_EMAIL]` in a code comment so it's obvious it needs replacement. The task action must include this as a required input.

### Pitfall 4: Korean text in `aria-label` vs English (EXP-05)

**What goes wrong:** Mixing Korean and English in `aria-label` can confuse some screen readers if the `lang` attribute isn't set on the element.

**How to avoid:** The page already has `lang="ko"` on `<html>` (set in `BaseLayout.astro`). Korean in `aria-label` is safe. English is also fine since "Session N" is a proper noun. Either works.

---

## Code Examples

### EXP-05: Correct aria-label pattern for progress bar links

```astro
{Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
  <a
    href={`${base}sessions/session-${n.toString().padStart(2, '0')}/`}
    class={`h-1.5 flex-1 rounded-full transition-colors ${
      n < number ? 'bg-text-muted/40' :
      n === number ? 'bg-accent' :
      'bg-bg-hover'
    }`}
    title={`Session ${n}`}
    aria-label={`Session ${n}${n === number ? ' (현재 세션)' : ''}으로 이동`}
  />
))}
```

### EXP-01: Replacement for dashed-border artifact box

Replace lines 142–149 of `season2.astro`:

```astro
<!-- Before: dashed developer-artifact box -->
<div class="bg-bg-hover/50 rounded-card p-6 border border-dashed border-bg-hover">
  <p class="font-mono text-text-muted text-xs">
    &lt;!-- Google Forms embed will be placed here --&gt;
  </p>
  <p class="font-mono text-text-muted text-xs mt-2">
    &lt;iframe src="GOOGLE_FORMS_URL" ...&gt;&lt;/iframe&gt;
  </p>
</div>
```

```astro
<!-- After: clean status indicator -->
<p class="font-mono text-text-muted text-xs">
  Season 1 진행 중 오픈 예정입니다.
</p>
```

### EXP-02: Augmented FAQ contact card

```astro
<!-- After: add contact mechanism to existing card -->
<div class="bg-bg-card rounded-card p-6 text-center max-w-3xl">
  <p class="text-text-secondary text-sm mb-3">위에 없는 질문이 있으신가요?</p>
  <p class="text-text-muted text-xs mb-3">세미나 운영팀에 문의하시면 답변을 드리겠습니다.</p>
  <a href="mailto:[CONTACT_EMAIL]" class="font-mono text-accent hover:text-accent-hover text-xs transition-colors">
    [CONTACT_EMAIL]
  </a>
</div>
```

Note: `[CONTACT_EMAIL]` is a required user-supplied value. The plan task must surface this as an input dependency.

---

## Environment Availability

Step 2.6: SKIPPED (no external dependencies — all changes are HTML/CSS template edits in existing `.astro` files).

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None configured — no test files, no test runner detected |
| Config file | None |
| Quick run command | `npm run build` (Astro build validates Zod schemas and template syntax) |
| Full suite command | `npm run build && npm run preview` (manual visual verification) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EXP-01 | `/season2/` renders no visible `<` or `>` angle-bracket text | smoke (manual) | `npm run build` then manual visual check | N/A — no test files |
| EXP-02 | FAQ contact card contains an `<a>` or actionable contact text | smoke (manual) | `npm run build` then manual visual check | N/A |
| EXP-05 | Progress bar `<a>` elements have `aria-label` attributes | smoke (manual + axe) | `npm run build` then manual or axe DevTools check | N/A |

### Sampling Rate

- **Per task commit:** `npm run build` (catches template/schema errors at build time)
- **Per wave merge:** `npm run build && npm run preview` + manual visual check of affected page
- **Phase gate:** All three pages visually verified in browser before `/gsd:verify-work`

### Wave 0 Gaps

No test infrastructure exists (none configured in project). Automated test files are out of scope for this phase (audit remediation pass). Manual verification via `npm run preview` is the validation mechanism.

None — existing build pipeline (`npm run build`) covers syntax/schema errors. Visual/accessibility verification is manual.

---

## Open Questions

1. **EXP-02: Actual contact email or Slack channel name**
   - What we know: The FAQ should have an actionable contact method (email or Slack per REQUIREMENTS.md)
   - What's unclear: The real contact value (email address or Slack channel name) for the seminar organizers is not present anywhere in the codebase
   - Recommendation: The plan task for EXP-02 must include a step that asks the user for the contact value, OR executes with a clearly marked placeholder (`[CONTACT_EMAIL]`) and notes it requires manual replacement. Do not fabricate an address.

---

## Sources

### Primary (HIGH confidence)

- Direct source inspection of `src/pages/season2.astro` — confirmed artifact lines 142–149
- Direct source inspection of `src/pages/faq.astro` — confirmed no contact mechanism lines 171–176
- Direct source inspection of `src/pages/sessions/[...slug].astro` — confirmed `title`-only pattern lines 45–56
- WCAG 2.1 SC 4.1.2 (Name, Role, Value) — `aria-label` requirement for interactive elements without text content
- MDN ARIA — `aria-label` accessible name computation priority over `title`

### Secondary (MEDIUM confidence)

- WCAG 2.1 Technique ARIA14 — use of `aria-label` to provide an accessible name for interactive elements that are icon-only / visual-only

### Tertiary (LOW confidence)

None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new dependencies; all changes are in existing Astro/Tailwind primitives already verified in Phases 1 and 2
- Architecture: HIGH — single-file edits with no cross-file dependencies; patterns directly observable in source
- Pitfalls: HIGH — all identified from direct source inspection plus WCAG documented behavior of `title` attribute

**Research date:** 2026-03-31
**Valid until:** 2026-06-30 (Astro 6 / Tailwind 4 are stable; WCAG 2.1 behavior of `title` is long-established)
