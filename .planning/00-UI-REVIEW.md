# Phase 00 — UI Review (Full Site Audit)

**Audited:** 2026-03-31
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md exists)
**Screenshots:** Captured — desktop (1440x900), mobile (375x812), tablet (768x1024) across 6 pages
**Screenshot directory:** `.planning/ui-reviews/00-20260331-062339/`
**Dev server:** localhost:4321 (Astro default)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | All CTAs are specific, Korean copy is clear and purposeful throughout |
| 2. Visuals | 3/4 | Strong hierarchy overall; IBM Plex Mono on Korean H1s introduces visible word-spacing gaps |
| 3. Color | 3/4 | Token system is impeccable; blue/yellow off-theme colors introduced for session type badges |
| 4. Typography | 3/4 | Scale is well-controlled; `text-[10px]` arbitrary value used in 14 places instead of `text-xs` |
| 5. Spacing | 3/4 | Minor inconsistency — p-5 (42 uses) and p-6 (21 uses) coexist in semantically similar cards |
| 6. Experience Design | 2/4 | FAQ contact block has no actionable contact method; season2 exposes raw HTML placeholder to users; no focus-visible styles defined |

**Overall: 18/24**

---

## Top 3 Priority Fixes

1. **Raw HTML placeholder visible on season2.astro** — Users who navigate to `/season2/` see `<!-- Google Forms embed will be placed here -->` and `<iframe src="GOOGLE_FORMS_URL" ...>` rendered as visible text inside a dashed box. This actively signals an incomplete page to real users. Fix: either replace with a clean "coming soon" message or remove the entire feedback form section until the Google Forms URL is ready. (`src/pages/season2.astro` lines 143–148)

2. **FAQ contact section has no actionable contact channel** — The bottom of `faq.astro` reads "세미나 운영팀에 문의하시면 답변을 드리겠습니다" with no email, Slack channel, or link. Users who have a question they cannot find an answer to have nowhere to go. Fix: add the actual contact method (e.g., Slack channel name, email address, or a mailto link) to the contact card. (`src/pages/faq.astro` lines 173–175)

3. **No focus-visible styles defined** — No custom `:focus-visible` styles exist anywhere in the codebase. On the dark `#0a0a0a` background, browser-default outlines are nearly invisible. The FAQ accordion, progress bar links, and nav links are keyboard-navigable but produce no visible focus indicator. Fix: add `*:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` to `src/styles/global.css`.

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)

**Result:** No generic labels found. Zero instances of "Submit", "Click Here", "OK", "Cancel", or "Save" across all `.astro` files.

**Strengths:**
- All CTAs are specific and contextual: "커리큘럼 보기", "일정 확인", "더 많은 질문 보기 →", "Season 1 커리큘럼 보기". None are generic.
- Korean copy throughout is concise and uses domain-appropriate vocabulary (에이전트, 리터러시, 산출물). The tone matches a professional internal seminar context.
- Error and empty states are handled gracefully where relevant: the `deliverable` field shows "없음" (nothing) or renders a delivery item with `>>` prefix. Status badges use 진행중 (in progress), not generic labels.
- The hero headline "AI를 쓰는 것과 AI를 **운영**하는 것은 다릅니다." is memorable and specific — the bolded accent word "운영" reinforces the seminar's core distinction visually.
- Session key messages from frontmatter are substantive (e.g., "Claude는 여러 '표면'이 있고, 챗봇처럼 질문하는 것과 에이전트로 운영하는 것은 완전히 다른 경험입니다."), not placeholder lorem ipsum.

**Minor notes:**
- The FAQ "추가 질문" card (`faq.astro:174`) says to contact the seminar team but provides no mechanism. This is a copywriting gap but primarily an experience design failure (see Pillar 6).
- Section label text mixes Korean and English by convention ("ABOUT", "FORMAT", "MISSION", etc.). This is a deliberate design choice consistent across all pages and appropriate for a tech-literate audience.

---

### Pillar 2: Visuals (3/4)

**Screenshot observations:**

**Home (desktop):** Clear focal point — the hero H1 at 3xl/5xl with the accent-colored "운영" word draws the eye immediately. Good 60/30/10 visual split (dark bg / muted card text / accent green). The AdoptionLadder below the fold provides clear progressive disclosure.

**Curriculum (desktop):** Two-column card grid reads well. Left-border color coding (accent = current, muted = completed, bg-hover = upcoming) is a subtle but effective status indicator. The section label + week number pattern creates consistent rhythm across weeks.

**Session detail (mobile):** The progress bar at the top is a strong navigation affordance. Breadcrumb + session number + type badge + level badge stack clearly before the H1. The 2x2 meta cards (WEEK, TIME, DELIVERABLE, REFERENCE) are well-structured.

**FAQ (desktop):** Clean accordion list. The `>` indicator with `group-open:rotate-90` transition is a nice detail. The FAQ cards however extend to almost full viewport width without a visual constraint — the `max-w-3xl` wrapper is applied to the section but the accordion items touch the edges, creating a slightly heavy visual weight.

**Issues found:**

1. **IBM Plex Mono on Korean H1 headings creates visible word spacing** — IBM Plex Mono applies monospace character widths to Korean glyphs, resulting in exaggerated inter-character spacing. This is clearly visible in screenshots: "자주 묻는 질문", "세미나 소개", "커리큘럼", "일정" all display with wide gaps between Korean characters. This is an expected rendering artifact of using a Latin monospace font on CJK text, but it creates a slightly awkward visual effect at page-title scale. The effect is intentional in the design system (IBM Plex Mono is the heading font), but the word-spacing becomes pronounced at `text-4xl`. The hero H1 benefits from Korean letter spacing because the content is stylized ("AI를 쓰는 것과"), but simple single-word titles like "일정" look stretched. Fix option: add `tracking-tight` to inner-page H1s, or switch page-title H1s to `font-sans` while keeping section labels in `font-mono`.

2. **The AdoptionLadder at activeLevel=0 (index page) shows all 5 levels at opacity-50** — When no active level is set, the entire ladder looks dimmed with no focal point. The design intent (show the full ladder to communicate the journey) is clear, but a user's eye has nothing to rest on. A subtle fix: set `activeLevel={1}` on the homepage to show that the journey starts now, or add a label below the ladder contextualizing that this is the learning path.

3. **Session progress bar links lack visible accessible labels** — The 12 pill-shaped links in the session progress bar use only a `title` attribute (`title="Session N"`). These links have 6px height and are extremely small. On mobile (`session-mobile.png` confirms this), the progress bar is present but the individual segments are finger-tap sized only by virtue of the `flex-1` stretch. `title` attributes are not exposed to screen readers on focus and are invisible on touch devices. (`src/pages/sessions/[...slug].astro` line 53)

---

### Pillar 3: Color (3/4)

**Token usage:** All color values are defined in the `@theme` block in `src/styles/global.css` (lines 3-16). No hardcoded hex values appear in any `.astro` file.

**Exception:** One hardcoded `rgba(16, 185, 129, 0.05)` appears in the `<style is:global>` section of `[...slug].astro` line 314. This is the blockquote background — it duplicates `bg-accent/5` which is already available as a Tailwind opacity modifier. Fix: replace with `background: color-mix(in srgb, var(--color-accent) 5%, transparent)` or document as a known CSS-only exception.

**Accent usage volume:** `text-accent` appears 89 times, `bg-accent` 30 times, `border-accent` 9 times across all Astro files. High frequency is expected for a site that uses accent as both its brand color and functional UI color (labels, CTAs, status indicators, section markers). The usage is consistent with the design system's intent.

**Off-theme colors — session type badges:** Two non-design-system colors are used for concept and special session type badges:
- `bg-blue-500/10 text-blue-400 border-blue-500/20` for "개념" (concept) sessions — `SessionCard.astro:37`, `[...slug].astro:28`
- `bg-yellow-500/10 text-yellow-400 border-yellow-500/20` for "특별" (special) sessions — `SessionCard.astro:37`, `[...slug].astro:30`

These colors are not in the design system's `@theme` block and are not semantic tokens. While the visual effect is subtle (10% opacity backgrounds), they do introduce two additional hues that are not part of the declared palette. The "practice" badge correctly uses `bg-accent/10 text-accent`. Options: (a) add semantic tokens `--color-badge-concept` and `--color-badge-special` to the theme, or (b) simplify all badges to use accent/muted variants and rely on the label text alone to distinguish types.

**Color contrast:** The dark design system (#0a0a0a background, #f9fafb primary text) provides strong contrast. Muted text (#6b7280 on #0a0a0a) is approximately 4.6:1 — passing WCAG AA for normal text but not enhanced AA for large text. This is borderline but acceptable at the font sizes used.

---

### Pillar 4: Typography (3/4)

**Font sizes in use (from grep analysis):**
- `text-xs` — 135 instances (dominant label/caption size)
- `text-sm` — 73 instances (body/card text)
- `text-base` — 14 instances (description paragraphs)
- `text-lg` — 20 instances (section h2 headings)
- `text-xl` — 11 instances
- `text-2xl` — 9 instances (page H1 mobile)
- `text-3xl` — 1 instance (hero H1 mobile)
- `text-4xl` — 7 instances (page H1 desktop)
- `text-5xl` — 1 instance (hero H1 desktop)
- `text-[10px]` — 14 instances (arbitrary, below the design scale)

Total named sizes: 9 distinct steps. This is slightly above the "4 sizes" heuristic for simple sites, but for a content-rich site with a well-defined information hierarchy (labels / body / section heads / page heads / hero), this range is justified.

**The `text-[10px]` issue:** 14 uses of the arbitrary `text-[10px]` class appear across `AdoptionLadder.astro` (4 uses) and `[...slug].astro` (10 uses). This is the sub-caption size used for section labels in the session detail page ("SESSION PROGRESS", "WEEK", "TIME", "DELIVERABLE", "REFERENCE", "목차", "이전 세션", "다음 세션"). The intent is to have a smaller-than-xs label size for tight UI chrome. The fix is simple: add `--text-label: 10px` to the theme (or use `text-[0.625rem]` for rem parity), or accept `text-xs` (12px) at those use sites since the difference is minimal. Using an arbitrary pixel value bypasses the design token system.

**Font weights in use:** `font-bold` (44), `font-semibold` (60), `font-medium` (1). Only 2-3 weights — appropriately restrained. `font-medium` appears once and could be replaced with `font-semibold` for consistency.

**Font family split:** `font-mono` (IBM Plex Mono) is used for all headings, labels, CTAs, number displays, and code. `font-sans` (Pretendard) is the body default from the layout. This two-font approach is clear and well-executed. The contrast between the technical mono headings and the readable Korean sans body creates a distinctive tech-seminar aesthetic.

---

### Pillar 5: Spacing (3/4)

**Arbitrary spacing:** Only one arbitrary spacing value found: `lg:grid-cols-[1fr_200px]` in `[...slug].astro:129` — this is a grid column definition, not a spacing value, and is appropriate for the two-column TOC layout.

**Standard scale usage is strong.** All spacing uses Tailwind's standard 4px-step scale (p-1 through p-12, gap-1 through gap-12). No arbitrary `px`/`rem` padding or margin values exist in `.astro` files.

**Card padding inconsistency — p-5 vs p-6:**
- `p-5` (20px): 42 uses — primarily in FAQ accordion panels, schedule prep cards, vocabulary items, resources cards
- `p-6` (24px): 21 uses — primarily in index page feature cards, about page section cards, AdoptionLadder wrapper

Both values appear on semantically equivalent card components. For example, `faq.astro` uses `p-5` for Q/A items, but `schedule.astro` uses `p-6` for the Brown Bag explainer card. `index.astro` uses `p-6` for the FORMAT/MISSION/FOR EVERYONE cards, but `resources.astro` uses `p-5` for the vocabulary cards. These are visually close (4px difference) but represent an undeclared variance. The design system defines `--radius-card: 4px` and `--radius-btn: 2px` but does not define a canonical card padding value. Fix: establish a convention (p-5 for compact cards, p-6 for feature cards) and apply consistently.

**Section vertical rhythm:** `py-12` (48px) and `py-10` (40px) alternate as section padding across pages (25 total uses). Some pages use `py-12` for all sections, others mix `py-10` and `py-12`. This is minor but noticeable when comparing pages side-by-side.

---

### Pillar 6: Experience Design (2/4)

**Loading states:** None exist — appropriate for a fully static site. All content renders server-side at build time. No async operations.

**Error states:** None exist — appropriate. No user input forms, no dynamic data fetching.

**Empty states:** The `deliverable !== '없음'` check in `SessionCard.astro:60-62` elegantly handles "no deliverable" by showing "관찰 중심" instead of an empty value. The `bookRef` optional field is guarded with `{bookRef && (...)}` in `[...slug].astro:108`. These are well-handled.

**Status differentiation:** The session status system (completed/current/upcoming) is visually encoded via left-border color on `SessionCard.astro`. The `진행중` badge with `animate-pulse` on the current session is a good progressive indicator. However, all 12 sessions currently have `status: upcoming`, so the system is untested in production context.

**Critical issues:**

1. **season2.astro exposes raw HTML placeholder text** (`lines 143-148`): The feedback form section renders a dashed box containing the literal strings `<!-- Google Forms embed will be placed here -->` and `<iframe src="GOOGLE_FORMS_URL" ...></iframe>` as escaped HTML entities visible to all visitors. These appear to be developer notes that were accidentally left as visible content. While the `&lt;` escaping means no actual iframe is loaded, the displayed text looks like exposed implementation notes. This creates a trust issue for users who visit the page before Season 1 is complete.

2. **FAQ contact block has no contact channel** (`faq.astro:171-176`): The "추가 질문" section at the bottom of the FAQ page reads "세미나 운영팀에 문의하시면 답변을 드리겠습니다" — "contact the seminar operations team and we'll answer" — but provides no email, Slack channel name, or link. A user who has read all 10 FAQs and still has a question hits a dead end. This is the single place where a contact method is implied, making its absence especially frustrating.

3. **No focus-visible styles** (`src/styles/global.css` — absent): No `:focus-visible` or `:focus` styles are defined anywhere in the stylesheet. The browser default outline (typically a thin blue ring) is barely visible on `#0a0a0a` backgrounds. All interactive elements — nav links, FAQ accordions, session progress bar segments, CTA buttons, prev/next cards — would fail a keyboard accessibility check. The design system's emerald accent (`#10b981`) would provide excellent focus ring contrast against the dark background if applied.

4. **Season2 page is not linked from navigation** — The `season2.astro` page exists as a route (`/agent-seminar/season2/`) but has no link in the main navigation or mobile menu. It can only be reached by direct URL or links within content. This may be intentional (hiding an unfinished page), but if intentional it should have a clear discovery path or be blocked from indexing.

5. **No skip-to-content link** — Users who tab through the page must navigate all 5 nav links before reaching the main content. No `<a href="#main-content" class="sr-only focus:not-sr-only">` link exists in `BaseLayout.astro`.

**Positive patterns:**
- `aria-label` is correctly applied to the main nav, breadcrumb nav, TOC nav, and prev/next nav (`[...slug].astro`)
- `aria-expanded` is correctly updated on mobile menu toggle via JavaScript (`BaseLayout.astro:74-75`)
- `role="main"` and `role="contentinfo"` are present
- FAQ uses native `<details>/<summary>` for keyboard-accessible accordions
- The `<html lang="ko">` attribute is set correctly for Korean screen readers

---

## Registry Safety

No `components.json` detected — shadcn not initialized. Registry audit skipped.

---

## Files Audited

**Layout:**
- `src/layouts/BaseLayout.astro`

**Components:**
- `src/components/SessionCard.astro`
- `src/components/AdoptionLadder.astro`

**Pages:**
- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/curriculum.astro`
- `src/pages/schedule.astro`
- `src/pages/resources.astro`
- `src/pages/faq.astro`
- `src/pages/season2.astro`
- `src/pages/sessions/[...slug].astro`

**Styles:**
- `src/styles/global.css`

**Content (sample):**
- `src/content/sessions/session-01.md`

**Planning docs read:**
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/CONVENTIONS.md`

**Screenshots captured:**
- `home-desktop.png` — 1440x900
- `home-mobile.png` — 375x812
- `home-tablet.png` — 768x1024
- `curriculum-desktop.png` — 1440x900
- `session-desktop.png` — 1440x900 (session-01)
- `session-mobile.png` — 375x812 (session-01)
- `about-desktop.png` — 1440x900
- `faq-desktop.png` — 1440x900
