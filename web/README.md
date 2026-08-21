# Sherubtse College — web (Astro frontend)

Static frontend for the Sherubtse College website, built with Astro against the Strapi
CMS in `../cms`. See `../docs/DECISIONS.md` and `../cms/docs/CONTENT-MODEL.md` for the
architectural context — this is Track B of that rebuild.

## Pinned versions (record here on day one — see Stack, Structure & Wireframes §01,
"pin your versions and write them down")

| Tool | Version |
|---|---|
| Node | 24.18.1 |
| npm | 11.16.0 |
| Astro | 7.2.4 |
| Strapi (in `../cms`) | 5.51.1 |
| Database (production target) | PostgreSQL — not yet provisioned; local dev uses Strapi's SQLite |

If a fresh clone behaves differently than expected, check these first before assuming a
code problem — "it worked on the old laptop" is the exact failure mode this table exists
to prevent.

## Architecture

- **Static output only.** Every page is generated at build time from Strapi's REST API.
  Strapi is never called from the browser and never exposed publicly — see
  `src/lib/strapi.ts`.
- **No client-side framework.** Plain Astro components, plain CSS with custom properties
  (`src/styles/tokens.css`). The site is read-heavy and mostly static; JavaScript is
  reserved for the few interactions that genuinely need it (calendar filtering, search,
  mobile menu) — see the performance budget below.
- **Design tokens and layout rules come from the Visual Style Guide** (v1.4) — colours,
  type scale, spacing scale, and the mobile-first CSS methodology are not
  reinterpreted here; `tokens.css` is authored directly from that document.

## Mobile-first CSS rule (checkable in review)

Base CSS is the mobile layout. Every media query uses `min-width`. Never `max-width`.
A `max-width` query in a diff means the rule was broken — see Style Guide §09.

## Performance budget (target — CI enforcement is a Track D follow-up)

HTML 30KB · CSS 30KB · JS 0KB default (max 30KB on pages that need it) · Fonts 120KB ·
Images 300KB/page · **page total 500KB, target 350KB** · LCP < 2.5s on 4G · < 25 requests.

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Local dev server, `localhost:4321` |
| `npm run build` | Static build to `./dist/`, then runs Pagefind indexing |
| `npm run preview` | Preview the production build locally |

## Environment

Copy `.env.example` to `.env` and set `STRAPI_URL` / `STRAPI_API_TOKEN` (same read-only
token pattern as `includes/config.local.php` on the PHP side — never commit the real
value).
