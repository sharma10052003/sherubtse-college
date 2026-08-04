# Performance Notes

## Design choices made for speed

- **No framework runtime.** Plain ES6+ JavaScript, no React/Vue/jQuery
  — four small files (`header.js`, `navigation.js`, `mobile-menu.js`,
  `search.js`), each under ~3 KB unminified, loaded with `defer` so
  they never block initial render.
- **CSS is hand-written, not a Bootstrap override layer.** Only
  Bootstrap *Icons* (a font/CSS-only icon set) is used, not the full
  Bootstrap CSS/JS bundle, keeping the header/footer's own footprint
  small. If the rest of the site already loads Bootstrap 5 CSS/JS,
  nothing here conflicts with it — class names are all namespaced
  under `stc-` to avoid collisions.
- **`prefers-reduced-motion` is respected** — all transition/animation
  durations collapse to `0ms` for users who request it, in
  `variables.css`.
- **Mega menus and mobile panel are CSS-driven** (opacity/transform),
  not JS-animated, so they run on the compositor thread.
- **SVG logo & ridge motif** instead of raster images — no extra image
  requests, crisp at any pixel density, tiny file size.

## Request budget

The component adds:
- 4 CSS files, 4 JS files (all cacheable, same-origin)
- 1 Google Fonts stylesheet request (2 font families, 3 weights)
- 1 Bootstrap Icons stylesheet request (CDN)
- 1 logo image (SVG)

## Recommended production steps (not yet applied — see why below)

The files are shipped unminified and unbundled **on purpose**, so
they stay easy to read, diff, and hand off to future developers. Before
go-live, run them through the site's existing build step if one
exists:

```bash
# Example — adapt to whatever bundler the site already uses.
npx clean-css-cli assets/css/*.css -o assets/css/header-footer.min.css
npx terser assets/js/*.js -o assets/js/header-footer.min.js --compress --mangle
```

Then update the `<link>`/`<script>` tags in `header.php`/`footer.php`
to point at the minified files. Because everything is namespaced and
dependency-free, concatenation order only matters for the CSS
(`variables.css` must load first).

## Self-hosting fonts/icons (optional)

To remove the two CDN requests entirely (useful for a strict CSP or a
fully offline-capable build):

1. Download `Fraunces` and `Public Sans` as `.woff2` from Google Fonts,
   place under `assets/fonts/`, and replace the `<link>` tags in
   `header.php` with `@font-face` rules in `variables.css`.
2. Download the Bootstrap Icons webfont + CSS, place under
   `assets/icons/`, and swap the CDN `<link>` for a local one.

## Core Web Vitals notes

- **LCP**: the header is small and above-the-fold text/logo, not a
  large hero image, so it should not be the LCP element on most pages;
  if a page's LCP *is* inside the header (unlikely), ensure the logo
  SVG has explicit `width`/`height` (already set) to avoid layout
  shift while it decodes.
- **CLS**: header height is fixed via `--stc-header-h` /
  `--stc-header-h-shrunk` and the shrink transition only animates
  `height`/`transform`, not properties that reflow surrounding
  content; the announcement banner takes up real space in normal flow
  from first paint (no late-inserted banner pushing content down).
- **INP**: all click handlers (menu toggles, search open/close) are
  small, synchronous, and attached once at load — no per-scroll
  handler does more than a single `classList`/style write, batched via
  `requestAnimationFrame` in `header.js`.

## Suggested Lighthouse audit checklist before launch

- [ ] Run Lighthouse on a real page using this header/footer (not just
      `example/index.php`, which has minimal content)
- [ ] Confirm fonts use `font-display: swap` (already default via the
      Google Fonts URL used) or are self-hosted with `@font-face
      { font-display: swap; }`
- [ ] Serve the logo SVG with a long cache lifetime (see
      `assets/.htaccess`)
- [ ] Verify no console errors on pages that don't yet have a
      `main-content` id (the skip link will simply no-op, not error)
