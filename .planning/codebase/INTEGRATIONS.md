# External Integrations

**Analysis Date:** 2026-03-31

## APIs & External Services

This is a static site with no backend API calls, no REST/GraphQL endpoints, and no runtime external service dependencies. All integrations are build-time or CDN-based.

## CDN / Font Services

**jsDelivr CDN:**
- Purpose: Serve Pretendard Korean web font
- URL: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css`
- Loaded in: `src/layouts/BaseLayout.astro` (line 24)
- Preconnect: `<link rel="preconnect" href="https://cdn.jsdelivr.net" />` (line 21)
- Version pinned: v1.3.9

**Google Fonts:**
- Purpose: Serve IBM Plex Mono heading/code font
- URL: `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap`
- Loaded in: `src/layouts/BaseLayout.astro` (line 25)
- Preconnect: Two `<link rel="preconnect">` tags for `fonts.googleapis.com` and `fonts.gstatic.com` (lines 22-23)
- Weights: 400, 500, 600, 700
- Display strategy: `swap`

## Data Storage

**Databases:**
- None. Content is stored as Markdown files in `src/content/sessions/`.

**File Storage:**
- Local filesystem only. Static assets in `public/` directory.
- Two favicon files: `public/favicon.svg`, `public/favicon.ico`

**Caching:**
- None. GitHub Pages provides CDN-level caching.

## Authentication & Identity

- None. This is a public static website with no authentication.

## Monitoring & Observability

**Error Tracking:**
- None configured.

**Analytics:**
- None configured. No Google Analytics, Plausible, or similar.

**Logs:**
- No runtime logging. Build-time only via Astro CLI output.

## CI/CD & Deployment

**Hosting:**
- GitHub Pages
- Live URL: `https://elymas.github.io/agent-seminar/`
- Repository: `https://github.com/elymas/agent-seminar`

**CI Pipeline (`.github/workflows/deploy.yml`):**
- Trigger: Push to `main` branch, or manual `workflow_dispatch`
- Runner: `ubuntu-latest`
- Concurrency: Group `pages`, cancel-in-progress disabled (safe deploys)

**Build Job Steps:**
1. `actions/checkout@v4` - Clone repository
2. `actions/setup-node@v4` - Install Node.js 22 with npm cache
3. `npm ci` - Install dependencies from lockfile
4. `npm run build` - Build static site
5. `actions/upload-pages-artifact@v3` - Upload `dist/` as Pages artifact

**Deploy Job Steps:**
1. `actions/deploy-pages@v4` - Deploy artifact to GitHub Pages
- Requires `build` job to complete first
- Uses `github-pages` environment
- Outputs deployed page URL

**GitHub Pages Permissions:**
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

## Environment Configuration

**Required env vars:**
- None required for build or deployment
- `import.meta.env.BASE_URL` is provided by Astro from `astro.config.mjs` `base` setting

**Secrets location:**
- No secrets required. No API keys, tokens, or credentials.
- `.env` and `.env.production` are gitignored but do not exist in the working tree

## Webhooks & Callbacks

**Incoming:**
- None.

**Outgoing:**
- None.

## Third-Party Scripts

**Client-side:**
- No third-party JavaScript loaded
- No analytics scripts
- No tracking pixels
- No cookie consent banners
- Only inline script: mobile navigation menu toggle in `src/layouts/BaseLayout.astro` (lines 69-79)

## External Content Dependencies

**Font Availability:**
- Site renders correctly without external fonts (system font fallbacks defined in `--font-sans` and `--font-mono`)
- Pretendard falls back to `-apple-system, BlinkMacSystemFont, sans-serif`
- IBM Plex Mono falls back to generic `monospace`

**No Runtime Dependencies:**
- All pages are pre-rendered at build time
- No client-side data fetching
- No dynamic API calls
- Site functions fully offline once loaded

---

*Integration audit: 2026-03-31*
