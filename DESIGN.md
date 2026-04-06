# Design System — AI Agent Seminar

## Product Context
- **What this is:** 6-week, 12-session AI agent literacy seminar website for Korean advertising media rep professionals
- **Who it's for:** Ad industry professionals learning Claude Code AI agent operations (non-developers)
- **Space/industry:** Korean tech education, AI literacy training
- **Project type:** Static marketing/education site (Astro v6 + Tailwind CSS v4)

## Aesthetic Direction
- **Direction:** Industrial/Utilitarian with terminal inflections
- **Decoration level:** Minimal. Typography and structure do all the work. Visible grid lines and rules are the ornament.
- **Mood:** Austere, high-contrast, electrically focused. Operator console energy, not friendly SaaS. The site should feel like a controlled workspace for serious professionals.
- **Reference sites:** Elice (elice.io), AI Summit Seoul, AI Campus (ai-campus.kr), Next.js Learn, Anthropic Research page. Researched 2026-04-06. This site deliberately departs from the Korean ed-tech norm (light corporate SaaS) and AI conference norm (dark navy with cyan).

## Typography
- **Display/Headings:** IBM Plex Mono — monospace headings are the signature move, signaling technical authenticity to non-developer audience. Poster-scale, tight leading.
- **Body:** Pretendard Variable — best Korean web font, excellent readability at all sizes. Loaded via jsDelivr CDN.
- **Data/Labels:** JetBrains Mono — tabular-nums support, used for session numbers, timestamps, metadata, uppercase English labels.
- **Code:** JetBrains Mono
- **Loading:**
  - Pretendard: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css`
  - IBM Plex Mono: `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap`
  - JetBrains Mono: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap`
- **Scale:**
  - Hero headline: 40px / 2.5rem (md: 48px / 3rem)
  - Section heading (h2): 24px / 1.5rem
  - Subsection heading (h3): 18px / 1.125rem
  - Body: 15px / 0.9375rem
  - Small body: 13px / 0.8125rem
  - Labels/metadata: 11px / 0.6875rem
  - Micro labels: 10px / 0.625rem

## Color
- **Approach:** Restrained. Emerald accent used sparingly, only for action and key signals.
- **Background:** `#090A08` — mineral-black, slightly warmer than pure black
- **Surface (cards):** `#111814` — warm-shifted dark card background
- **Surface-2 (hover):** `#1A1F1A` — emphasis, hover states
- **Text primary:** `#F0EDE8` — warm white, not blue-white
- **Text secondary:** `#C8C4BC` — warm gray for supporting copy
- **Text muted:** `#7A7770` — warm muted for metadata, captions
- **Accent:** `#10b981` — emerald green, AI/terminal association
- **Accent hover:** `#34d399` — lighter emerald for hover states
- **Accent dim:** `rgba(16, 185, 129, 0.10)` — subtle accent backgrounds
- **Accent border:** `rgba(16, 185, 129, 0.20)` — subtle accent borders
- **Line/border:** `#262B26` — visible but quiet dividers
- **Semantic:** success `#10b981`, warning `#eab308`, error `#ef4444`, info `#3b82f6`
- **Badge concept:** `#3b82f6` with `rgba(59, 130, 246, 0.10)` bg
- **Badge special:** `#eab308` with `rgba(234, 179, 8, 0.10)` bg
- **Dark mode:** Primary. This is a dark-first site.
- **Light mode strategy:** Invert surfaces (`#F5F3EF` bg, `#FFFFFF` surface), darken text (`#1A1A18`), deepen accent (`#059669`). Same structure, warm undertones preserved.

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px) 3xl(64px)

## Layout
- **Approach:** Grid-disciplined with asymmetric hero
- **Grid:** Single column mobile, 2-3 columns desktop (md: breakpoint)
- **Max content width:** 960px (5xl)
- **Hero:** Asymmetric. Left: oversized headline stack. Right: info slab with metadata. Left-aligned by default, centered only for ceremonial moments.
- **Section rhythm:** Alternate between dense editorial blocks and sparse data panels. Horizontal rules as section dividers.
- **Border radius:**
  - btn: 2px (buttons, badges, inline elements)
  - card: 4px (cards, containers, alerts)
  - full: 9999px (avatars, pills, only when necessary)

## Motion
- **Approach:** Minimal-functional. CSS transitions only, no animation libraries.
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(150-200ms) medium(250-350ms)
- **Rules:**
  - `transition-colors` for hover states (150ms)
  - `backdrop-blur-sm` on sticky nav only
  - No entrance animations, no scroll-driven effects
  - No JavaScript animation frameworks

## Anti-Patterns (never use)
- Purple/violet gradients
- 3-column feature grid with icons in colored circles
- Centered-everything layouts (use left-aligned by default)
- Uniform bubbly border-radius (>8px)
- Gradient buttons
- Glassmorphism
- Decorative blobs or abstract illustrations
- Stock photography
- Fake code window chrome (unless showing real content)

## Font Loading Strategy
- Preconnect to `cdn.jsdelivr.net`, `fonts.googleapis.com`, `fonts.gstatic.com`
- All fonts loaded via CDN `<link rel="stylesheet">`
- `font-display: swap` via Google Fonts URL parameter

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-06 | Initial design system created | /design-consultation with competitive research (6 sites), Codex + Claude subagent outside voices |
| 2026-04-06 | Keep emerald #10b981 accent | AI/terminal association, brand identity, differentiates from Korean ed-tech blue/purple norm |
| 2026-04-06 | Keep IBM Plex Mono headings | Signature move signaling technical authenticity to non-developer audience |
| 2026-04-06 | Warm-shift neutrals | Mineral-black bg + warm white text creates comfortable reading contrast and depth |
| 2026-04-06 | Add JetBrains Mono for data | Tabular-nums support for session numbers, timestamps, metadata labels |
| 2026-04-06 | 2-4px border radius | Deliberate risk: signals precision and seriousness vs industry standard 8-16px |
