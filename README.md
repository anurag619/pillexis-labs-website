# Pillexis Labs — website

Astro static site for **Pillexis Labs Pvt Ltd**, a founder-led product and engineering studio. The homepage (`/`) sells the studio's two fixed-price sprints (AI Stack Audit + Ops Automation) to Indian D2C brands and funnels to a Cal.com call; `/ai-labs` carries the secondary "research-driven product studio" narrative across Productlogz, Quotesmatic, Migraine Logs, Forge, and Tether. Plus a blog and free AI tools. See the root [`CLAUDE.md`](../CLAUDE.md) for the full positioning.

## Git repository boundary

This `website/` directory is an independent Git repository. Run its Git and GitHub commands from this directory, or use `git -C website ...` from the Pillexis workspace root. The workspace root is not a Git repository. The sibling `forge/` directory is a separate repository with different branches, remotes, and deployment rules. Never combine website and Forge changes in one commit or pull request.

**Hard GitHub account rule:** This repository belongs to `anurag619`, and every GitHub operation must use that account. The `anuragrk10` account belongs to a different organization and must never be used for this repository. Before any `gh` mutation, verify or switch with `gh auth switch -h github.com -u anurag619`.

## Quick start

```bash
npm install
npm run dev       # local dev server at http://localhost:4321
npm run build     # static output → dist/
npm run preview   # serve the built dist/
```

## Stack

- **Astro 4** (static output, zero JS by default)
- **`@astrojs/sitemap`** — auto-generates `sitemap-index.xml`
- **`@astrojs/rss`** — generates the blog feed at `/rss.xml`
- **Content collections** — blog posts and author profiles, schema-validated
- **No CSS framework** — design tokens in `src/styles/tokens.css`, per-page CSS inline in `.astro` pages
- **Vanilla JS islands** for the quiz tools (no React/Vue/Svelte)

## Project layout

```
src/
├── layouts/
│   └── BaseLayout.astro       # HTML shell + GA4 + FB Pixel + SEO slot
├── components/
│   ├── SEO.astro              # title/description/canonical/OG/Twitter/JSON-LD
│   ├── BookingScripts.astro   # Cal.com embed + click + Schedule event wiring
│   └── tools/
│       └── Quiz.astro         # JSON-driven assessment engine (island)
├── pages/
│   ├── index.astro            # / — homepage (services for D2C)
│   ├── work-with-us.astro     # /work-with-us — services + booking
│   ├── ai-labs.astro          # /ai-labs — research-studio thesis page
│   ├── forge.astro            # /forge — Forge product landing page
│   ├── 404.astro
│   ├── rss.xml.js             # /rss.xml — blog feed
│   ├── tools/
│   │   ├── index.astro                 # /tools — tools hub
│   │   └── ai-build-readiness.astro    # first live tool
│   └── blog/
│       ├── index.astro        # /blog — index
│       ├── [slug].astro       # dynamic post pages
│       ├── tags/              # tag archive pages
│       └── authors/           # author archive pages
├── content/
│   ├── blog/                  # markdown blog posts
│   ├── authors/               # markdown author profiles
│   └── config.ts              # zod schema for both collections
├── data/tools/
│   └── ai-build-readiness.json  # questions + tiers + share copy
├── lib/
│   ├── quiz.js                # encode / decode / score / pickTier
│   └── analytics.js           # GA4 + Pixel event helpers
└── styles/
    └── tokens.css             # :root CSS variables (colors, fonts, radii)

netlify/
└── functions/
    └── cal-booking.ts         # Cal.com webhook → Meta Conversions API (server-side Schedule event)

public/
├── robots.txt
└── og/                        # OG images per page (placeholder folder)

legacy/                        # original static HTML (preserved for reference, not served)
```

## Adding a new free tool

A new tool is **~1 day of work** once the engine exists.

1. **Write the JSON**: `src/data/tools/<slug>.json`. Copy `ai-build-readiness.json` as a template. Fill in:
   - `questions[]` — each question has 4 options with weights (`w: 0–3`)
   - `tiers[]` — 3–4 tiers, sorted ascending by `max` score. Each tier has a headline, diagnosis, nextStep, and a studioLink CTA.
   - `share.{twitterText, linkedinText, copyText}` — share copy with `{tier}` placeholder.
2. **Create the page**: `src/pages/tools/<slug>.astro`. Copy `ai-build-readiness.astro` and swap the JSON import + slug. The Quiz component handles the rest.
3. **Register on the hub**: add a row to the `tools` array in `src/pages/tools/index.astro`.
4. **Verify**: `npm run build` and visit `/tools/<slug>` in preview.

## Per-page SEO

Every page uses `<BaseLayout>` and passes `title`, `description`, `path`, and optional `jsonLd`. The `<SEO>` component renders:

- `<title>`, `<meta description>`
- `<link rel="canonical">`
- Open Graph + Twitter Card meta
- JSON-LD structured data

Sitemap is regenerated on every build by `@astrojs/sitemap` at `/sitemap-index.xml`.

## Analytics

Two trackers, wired in `BaseLayout.astro` via env vars:

- **Google Analytics 4** — `PUBLIC_GA_ID`
- **Facebook Pixel** — `PUBLIC_FB_PIXEL_ID`

Both are loaded conditionally — if the env var is missing, the script tag isn't emitted (great for local dev).

Custom events fire from `src/lib/analytics.js`:

- `quiz_started`
- `quiz_question_answered` (with `question_id`)
- `quiz_completed` (with `tier`, `score`)
- `quiz_result_shared` (with `channel`: twitter / linkedin / copy)
- `quiz_cta_clicked` (with `destination`)

Both GA and Pixel receive the same events via the `track()` wrapper.

## Netlify deploy

The repo already includes `netlify.toml` with the build config. To connect Netlify:

1. **Build settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20
2. **Env vars**:
   - **Build-time, in `netlify.toml`** (`PUBLIC_*` → client-exposed, safe to commit): `PUBLIC_GA_ID`, `PUBLIC_FB_PIXEL_ID`. UI-set vars didn't propagate to the Astro build at deploy time, so the toml is the source of truth. See `../docs/marketing/META_ADS_LAUNCH.md` §5 for the debugging story.
   - **Runtime secrets, in the Netlify UI** (never commit): `META_CAPI_ACCESS_TOKEN`, `CAL_WEBHOOK_SECRET`, optionally `META_TEST_EVENT_CODE`. Used by the Cal.com webhook function (`netlify/functions/cal-booking.ts`) to fire the server-side Meta `Schedule` conversion. See the root `CLAUDE.md` "Booking conversion pipeline" section for details.
3. **Domain** — `pillexislabs.com` (already pointing at Netlify).
4. **Submit sitemap** to Google Search Console at `https://pillexislabs.com/sitemap-index.xml` after first deploy.

The `legacy/` folder of original HTML is preserved in the repo for reference but is not built into `dist/`.

## URL state for tools (share-first model)

The quiz uses URL-encoded answers (BoSar pattern):

```
/tools/ai-build-readiness?r=2103120123210#builder
```

- `r` is a base-N digit string (one digit per question, N = `base` field in JSON, default 4)
- `#` hash is the tier slug (`curious`, `tinkerer`, `builder`, `shipper`)

This makes results **shareable as URLs** — no server, no database. Anyone opening the link sees the result directly.

## Legacy HTML

`legacy/index.html` and `legacy/work-with-us.html` are the pre-migration static files, preserved as a fallback reference. They're git-tracked but not served. Delete them at any point once the Astro version is fully validated in production.
