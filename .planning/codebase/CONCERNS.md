# Codebase Concerns

**Analysis Date:** 2026-03-31

## Tech Debt

**Duplicated BASE_URL Normalization Pattern:**
- Issue: The same `rawBase` / `base` trailing-slash normalization snippet is copy-pasted in every page and component (10 occurrences total).
- Files:
  - `src/pages/index.astro` (lines 4-5)
  - `src/pages/about.astro` (lines 4-5)
  - `src/pages/curriculum.astro` (lines 6-7)
  - `src/pages/schedule.astro` (lines 3-4)
  - `src/pages/resources.astro` (lines 3-4)
  - `src/pages/faq.astro` (lines 3-4)
  - `src/pages/season2.astro` (lines 3-4)
  - `src/pages/sessions/[...slug].astro` (lines 15-16)
  - `src/components/SessionCard.astro` (lines 15-16)
  - `src/layouts/BaseLayout.astro` (lines 10-11)
- Impact: Updating the normalization logic requires changing 10 files. Easy to miss one during a refactor.
- Fix approach: Extract to a shared utility function in `src/utils/base.ts` that all pages/components import. Alternatively, since `BaseLayout.astro` already computes `base`, pass it down as a prop or use Astro's built-in mechanisms.
- Severity: **LOW** (works correctly, just repetitive)

**Duplicated Navigation Links (Desktop + Mobile):**
- Issue: Navigation links are defined twice in `BaseLayout.astro` -- once for desktop (`#nav-links`, lines 39-45) and once for mobile (`#mobile-menu`, lines 47-55). The page names, URLs, and order must be kept in sync manually.
- Files: `src/layouts/BaseLayout.astro` (lines 39-55)
- Impact: Adding or renaming a nav link requires editing two places in the same file. Risk of desync.
- Fix approach: Define nav items as an array in the frontmatter and iterate over it for both desktop and mobile views.
- Severity: **LOW**

**Hardcoded Schedule Data Duplicates Content Collection:**
- Issue: `schedule.astro` defines `weekSchedule` as a hardcoded inline array (lines 7-13) with week themes and session titles. This duplicates data already available in the sessions content collection (each session has `week`, `weekTheme`, `title`, and `number` fields).
- Files: `src/pages/schedule.astro` (lines 7-13)
- Impact: If session titles or week themes change in the Markdown frontmatter, the schedule page will show stale data. Content drift is likely.
- Fix approach: Query the sessions collection with `getCollection('sessions')` and derive the schedule from it, similar to how `curriculum.astro` works.
- Severity: **MEDIUM**

**Hardcoded FAQ Content in Template:**
- Issue: All 10 FAQ items are hardcoded directly in `faq.astro` (177 lines of HTML). No content collection or data file is used.
- Files: `src/pages/faq.astro` (lines 1-177)
- Impact: Adding/editing FAQ items requires modifying Astro template code. Non-technical content editors cannot update FAQs without touching component code.
- Fix approach: Create a `faqs` content collection (YAML or Markdown) or a JSON data file in `src/data/faqs.json`, then iterate in the template.
- Severity: **LOW** (small site with a single maintainer)

**Package Name is "temp":**
- Issue: `package.json` has `"name": "temp"` instead of a meaningful project name like `"agent-seminar"`.
- Files: `package.json` (line 2)
- Impact: Minor -- only affects `npm ls` output and any tools that reference the package name. No functional impact.
- Fix approach: Rename to `"agent-seminar"`.
- Severity: **LOW**

## Known Bugs

No runtime bugs detected in the current codebase. The historical BASE_URL 404 bug (documented in `src/content/sessions/session-bonus.md`, line 213) has been fixed.

## Security Considerations

**21MB PDF Committed to Git Repository:**
- Risk: `claude-master-guide.pdf` (20MB) is tracked by git (committed in `fffc5f9`). The CLAUDE.md explicitly warns: "Never commit `claude-master-guide.pdf` to the repo (21MB, redistribution rights unclear)." Despite this warning, the file IS in git history.
- Files: `claude-master-guide.pdf` (project root)
- Current mitigation: None. The file is not in `.gitignore`.
- Recommendations:
  1. Add `claude-master-guide.pdf` to `.gitignore` immediately.
  2. Use `git filter-branch` or `git-filter-repo` to purge it from history if redistribution rights are a genuine concern.
  3. The `.git/` directory is 19MB, almost entirely this one file.
- Severity: **HIGH** (potential IP/redistribution rights violation; bloats clone size)

**No Content Security Policy (CSP) Headers:**
- Risk: The site loads external resources from `cdn.jsdelivr.net`, `fonts.googleapis.com`, `fonts.gstatic.com`, and embeds YouTube iframes. No CSP meta tag or HTTP header restricts which origins can serve content.
- Files: `src/layouts/BaseLayout.astro` (lines 21-25), `src/content/sessions/session-05.md` (line 53)
- Current mitigation: GitHub Pages does not support custom HTTP headers. CSP via `<meta>` tag is possible.
- Recommendations: Add a `<meta http-equiv="Content-Security-Policy">` tag to `BaseLayout.astro` `<head>` restricting `script-src`, `style-src`, `frame-src` to known origins.
- Severity: **LOW** (static site with no user input, low attack surface)

**External Font CDN Dependency:**
- Risk: If `cdn.jsdelivr.net` or `fonts.googleapis.com` experiences downtime, fonts will fail to load. The fallback chain (`Pretendard`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`) handles this gracefully for body text, but `IBM Plex Mono` has only `monospace` as fallback which may cause layout shifts.
- Files: `src/layouts/BaseLayout.astro` (lines 24-25)
- Current mitigation: `preconnect` links reduce latency. System font fallbacks are defined in `src/styles/global.css` (lines 12-13).
- Recommendations: Consider self-hosting fonts via `@fontsource/ibm-plex-mono` and `@fontsource/pretendard` packages for reliability and privacy.
- Severity: **LOW**

## Performance Issues

**Render-Blocking External Stylesheets:**
- Problem: Two external font stylesheets are loaded in `<head>` without `media="print"` swap trick or `font-display: swap` control. They are render-blocking.
- Files: `src/layouts/BaseLayout.astro` (lines 24-25)
- Cause: Google Fonts stylesheet already uses `&display=swap`, but the Pretendard stylesheet from jsdelivr does not guarantee `font-display: swap` behavior.
- Improvement path:
  1. Self-host fonts to eliminate external requests entirely.
  2. Alternatively, use `<link rel="preload" as="style">` pattern to make font loading non-blocking.
- Severity: **LOW** (site is lightweight at ~532KB total build; fonts are the main bottleneck)

**YouTube Iframe Loaded Eagerly:**
- Problem: Session 5 embeds a YouTube iframe directly in Markdown content. This iframe loads YouTube's full player (~1-2MB) regardless of whether the user scrolls to it.
- Files: `src/content/sessions/session-05.md` (lines 52-54)
- Cause: Raw `<iframe>` with no `loading="lazy"` attribute.
- Improvement path: Add `loading="lazy"` to the iframe, or replace with a lite-youtube-embed facade that loads the player only on click.
- Severity: **LOW** (only affects one session page)

**No Image Optimization Pipeline:**
- Problem: The project has no images currently (no `<img>` tags found), but if images are added in the future, there is no `@astrojs/image` or similar optimization integration configured.
- Files: `astro.config.mjs`
- Improvement path: Install `@astrojs/image` or Astro's built-in `<Image>` component when images are needed.
- Severity: **LOW** (not a current issue)

## Accessibility Gaps

**No Skip-to-Content Link:**
- Problem: There is no "skip to main content" link for keyboard and screen reader users. Users must tab through all navigation links before reaching page content.
- Files: `src/layouts/BaseLayout.astro`
- Current state: The `<main>` element has `role="main"` but no anchor target for skip navigation.
- Recommendations: Add a visually hidden `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>` as the first child of `<body>`, and add `id="main-content"` to the `<main>` element.
- Severity: **MEDIUM**

**No Focus Styles Defined:**
- Problem: No custom `:focus` or `:focus-visible` styles are defined anywhere in the codebase. The browser default focus indicators may be invisible or poorly contrasted against the dark `#0a0a0a` background.
- Files: `src/styles/global.css`, `src/layouts/BaseLayout.astro`
- Recommendations: Add global focus-visible styles, e.g., `*:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` in `src/styles/global.css`.
- Severity: **MEDIUM**

**Progress Bar Links Lack Accessible Labels:**
- Problem: The session progress bar in `[...slug].astro` renders 12 small `<a>` links (1.5 units tall) with only a `title` attribute and no visible text or `aria-label`. Screen readers will announce them as unlabeled links.
- Files: `src/pages/sessions/[...slug].astro` (lines 44-56)
- Recommendations: Add `aria-label={`Session ${n}`}` to each progress bar link segment.
- Severity: **MEDIUM**

**FAQ Details/Summary Lacks Keyboard Feedback:**
- Problem: The FAQ accordion uses native `<details>/<summary>` which is keyboard accessible, but the `>` indicator rotation (`group-open:rotate-90`) is CSS-only and may not communicate state changes to screen readers.
- Files: `src/pages/faq.astro` (lines 20-32)
- Current mitigation: `<details>` natively communicates expanded/collapsed state to assistive technology.
- Severity: **LOW** (native semantics cover the basics)

**Mobile Menu Accessibility:**
- Problem: The mobile hamburger menu toggle button correctly uses `aria-expanded` and `aria-label`, but the controlled element (`#mobile-menu`) lacks `aria-labelledby` or `role="menu"` attributes.
- Files: `src/layouts/BaseLayout.astro` (lines 34, 47)
- Recommendations: Add `aria-controls="mobile-menu"` to the toggle button and `role="navigation"` to the mobile menu div.
- Severity: **LOW**

## SEO Issues

**No Open Graph / Twitter Card Meta Tags:**
- Problem: The site has no `og:title`, `og:description`, `og:image`, `twitter:card`, or other social sharing meta tags. Links shared on Slack, Twitter, KakaoTalk, etc., will show plain text or nothing.
- Files: `src/layouts/BaseLayout.astro` (lines 16-27)
- Current state: Only `<meta name="description">` and `<title>` are present.
- Recommendations: Add Open Graph and Twitter Card meta tags in `BaseLayout.astro`. Include an OG image (e.g., a branded card for social sharing).
- Severity: **MEDIUM** (reduces shareability for a public-facing site)

**No Canonical URL Tag:**
- Problem: No `<link rel="canonical">` tag is present. While Astro's `site` config is set, canonical URLs are not emitted.
- Files: `src/layouts/BaseLayout.astro`
- Recommendations: Add `<link rel="canonical" href={Astro.url.href} />` to `<head>`.
- Severity: **LOW**

**No Sitemap or robots.txt:**
- Problem: No `robots.txt` file exists in `public/`. No `@astrojs/sitemap` integration is configured. Search engines have no guidance on crawling.
- Files: `astro.config.mjs`, `public/` directory
- Recommendations:
  1. Add `public/robots.txt` with `User-agent: * Allow: /`.
  2. Install `@astrojs/sitemap` and add it to `astro.config.mjs` integrations.
- Severity: **LOW** (internal seminar site; SEO may not be a priority)

**No Structured Data (JSON-LD):**
- Problem: No schema.org structured data (Course, Event, etc.) is present. Given this is a seminar/course site, Course or EducationalOrganization schema would improve search appearance.
- Files: `src/layouts/BaseLayout.astro`
- Severity: **LOW**

## Maintainability Risks

**Large Session Detail Page Component:**
- Problem: `[...slug].astro` is 337 lines including 148 lines of global CSS. This single file handles: static path generation, session data extraction, progress bar, breadcrumb, header, meta cards, mission block, TOC sidebar, markdown content rendering, prev/next navigation, and all session content typography.
- Files: `src/pages/sessions/[...slug].astro` (337 lines)
- Impact: Modifying session detail layout requires editing one large file. The global styles (lines 188-336) could affect other pages unexpectedly.
- Fix approach: Extract the `<style is:global>` block into a dedicated `src/styles/session-content.css` file and import it. Consider breaking the page into sub-components (SessionHeader, SessionMeta, SessionNav).
- Severity: **LOW** (manageable at current size, but a scaling risk)

**Session Content Schema Has Loose Types:**
- Problem: The `level` field in content schema is `z.string()` with no validation. Values like `"Level 1: Prompting"` and `"종합"` and `"실전 케이스 스터디"` are all valid. There's no enum constraint.
- Files: `src/content.config.ts` (line 11)
- Impact: Typos in level names will not be caught at build time.
- Fix approach: Change to `z.enum()` or `z.string().regex()` to validate the pattern.
- Severity: **LOW**

**Empty `public/templates/` Directory:**
- Problem: The `public/templates/` directory exists but contains zero files. The `CLAUDE.md` mentions "Downloadable template files" here, but the `resources.astro` page instead shows copy-paste code blocks.
- Files: `public/templates/` (empty directory)
- Impact: Confusing to developers -- the directory implies downloadable files exist but none do. The resources page does not link to anything in this directory.
- Fix approach: Either remove the empty directory or populate it with `.md` template files and link to them from the resources page.
- Severity: **LOW**

## Deployment Risks

**No Build Validation in CI:**
- Problem: The GitHub Actions workflow (`deploy.yml`) runs `npm run build` but has no additional validation steps -- no linting, no link checking, no build output verification.
- Files: `.github/workflows/deploy.yml` (lines 28-30)
- Impact: A broken link or malformed page deploys without warning. The historical 404 bug was only caught by manual QA.
- Fix approach: Add a step after build to run a link checker (e.g., `lychee`, `broken-link-checker`) against the `dist/` output. Consider adding `astro check` for TypeScript validation.
- Severity: **MEDIUM**

**No Preview/Staging Environment:**
- Problem: The CI pipeline deploys directly to production (GitHub Pages) on every push to `main`. There is no staging or preview deployment for PRs.
- Files: `.github/workflows/deploy.yml`
- Impact: Any broken commit to `main` immediately goes live. No opportunity for review.
- Fix approach: Consider adding a PR preview deployment (Netlify Deploy Preview, Vercel Preview, or GitHub Pages preview via a separate workflow).
- Severity: **LOW** (acceptable for a small internal site)

**No Custom 404 Page:**
- Problem: No `src/pages/404.astro` exists. GitHub Pages will serve its default 404 page, which is unstyled and doesn't match the site design.
- Files: `src/pages/` (missing `404.astro`)
- Impact: Users who navigate to a non-existent URL see a generic GitHub 404 page with no way to navigate back to the site.
- Fix approach: Create `src/pages/404.astro` with the site layout and a helpful message linking back to the home page.
- Severity: **MEDIUM**

## Content Risks

**Google Forms Placeholder Not Implemented:**
- Problem: `season2.astro` contains a placeholder for a Google Forms embed (lines 129-151) that shows mock HTML code to users: `<!-- Google Forms embed will be placed here -->` and `<iframe src="GOOGLE_FORMS_URL" ...>`. This looks like unfinished development exposed to users.
- Files: `src/pages/season2.astro` (lines 129-151)
- Impact: Users see placeholder code that suggests the page is incomplete.
- Fix approach: Either implement the Google Form embed or remove the placeholder section entirely until the form URL is ready.
- Severity: **LOW** (page is for future Season 2; may be intentionally placeholder)

**All Session Statuses Are "upcoming":**
- Problem: Every session Markdown file has `status: upcoming` in frontmatter. There is no mechanism to automatically update status based on date. Status must be manually changed per session file.
- Files: `src/content/sessions/session-01.md` through `session-12.md` (frontmatter `status` field)
- Impact: As the seminar progresses, someone must manually update 12 files to reflect `current` and `completed` states. Forgetting causes the UI to misrepresent progress.
- Fix approach: Add a `date` field to frontmatter and compute status dynamically in page templates based on the current date. Alternatively, accept manual updates as the workflow.
- Severity: **LOW**

**Bonus Session Discoverable Only via Direct URL:**
- Problem: `session-bonus.md` (week=0, number=0) is not linked from any navigation or page. It is accessible at `/sessions/session-bonus/` but completely hidden. The session progress bar only shows sessions 1-12.
- Files: `src/content/sessions/session-bonus.md`, `src/pages/sessions/[...slug].astro` (line 19: filters for `number >= 1`)
- Impact: Intentionally hidden as a "hidden session," but there is no Easter egg or hint for users to discover it.
- Severity: **LOW** (intentional design choice per CLAUDE.md)

## Browser Compatibility

**`text-balance` Without Fallback:**
- Problem: `text-balance` (via Tailwind's `text-balance` class) is used on the hero H1 in `index.astro`. This CSS property has limited browser support (Chrome 114+, Firefox 121+, no Safari support as of early 2026).
- Files: `src/pages/index.astro` (line 11)
- Impact: Safari users will see default text wrapping. Not a breaking issue -- the text just won't be aesthetically balanced.
- Severity: **LOW** (progressive enhancement; no functional impact)

**`backdrop-blur-sm` Without Fallback:**
- Problem: `backdrop-filter: blur()` is used on the sticky nav (`backdrop-blur-sm`). This has good modern browser support but may render without blur on older browsers. The fallback `bg-bg/95` (95% opacity background) ensures readability regardless.
- Files: `src/layouts/BaseLayout.astro` (line 29)
- Impact: Older browsers show solid semi-transparent background instead of blur. Acceptable degradation.
- Severity: **LOW**

**Tailwind v4 `@theme` Block:**
- Problem: Tailwind CSS v4's `@theme` directive is used for design tokens. This is processed at build time by the Tailwind Vite plugin, so it has no browser compatibility concern.
- Files: `src/styles/global.css` (lines 3-16)
- Impact: None at runtime. Build tool handles transformation.
- Severity: **LOW** (no issue)

## Dependencies at Risk

**Astro Minor Version Behind:**
- Risk: Astro `6.0.8` is installed but `6.1.2` is available. The semver range `^6.0.8` allows auto-update via `npm update`.
- Impact: Missing bug fixes and improvements from two minor versions.
- Migration plan: Run `npm update astro` to pull latest 6.x.
- Severity: **LOW**

**Minimal Dependency Tree:**
- Risk: The project has only 3 direct dependencies (`astro`, `tailwindcss`, `@tailwindcss/vite`). This is a strength, not a risk. The total dependency tree is 358 packages (256 production), which is minimal for a modern JS project.
- Impact: Low supply chain risk. No known vulnerabilities (`npm audit` returns 0 issues).
- Severity: **LOW** (positive observation)

**No Lock on GitHub Actions Versions:**
- Risk: CI workflow uses `actions/checkout@v4`, `actions/setup-node@v4`, etc., with major version tags. These tags can be updated by the action maintainers to include breaking changes.
- Files: `.github/workflows/deploy.yml` (lines 22, 24, 33, 45)
- Impact: A malicious or broken update to a GitHub Action could compromise the build or deployment.
- Fix approach: Pin to exact commit SHAs instead of version tags: `actions/checkout@<sha>`.
- Severity: **LOW** (standard practice for most projects; pinning is ideal for high-security requirements)

## Test Coverage Gaps

**No Tests Exist:**
- What's not tested: The entire codebase has zero tests. No test framework, no test files, no test configuration.
- Files: No `*.test.*`, `*.spec.*`, `jest.config.*`, `vitest.config.*`, or `playwright.config.*` files exist.
- Risk: Regressions in content rendering, navigation, or layout changes go undetected until manual inspection.
- Priority: **LOW** -- This is a static content site with no dynamic logic, API calls, or user interactions. The cost/benefit of adding tests is low. If tests were added, the highest value would be:
  1. Link checking in CI (validates all internal links resolve)
  2. Build smoke test (validates all pages generate without errors)
  3. Accessibility audit via `axe-core` or `pa11y`

## Missing Critical Features

**No Contact/Inquiry Method:**
- Problem: The FAQ page says "세미나 운영팀에 문의하시면 답변을 드리겠습니다" (Contact the seminar team for answers) but provides no email, form, or Slack channel link.
- Files: `src/pages/faq.astro` (lines 172-176)
- Blocks: Users with questions have no actionable way to reach the seminar team.
- Severity: **MEDIUM**

---

*Concerns audit: 2026-03-31*
