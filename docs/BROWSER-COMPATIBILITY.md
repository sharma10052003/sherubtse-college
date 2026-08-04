# Browser & Device Compatibility

## Desktop browsers (latest 2 major versions tested against)

| Browser | Support |
|---|---|
| Chrome / Edge (Chromium) | Full support |
| Firefox | Full support |
| Safari | Full support |
| Opera (Chromium-based) | Full support |

## Techniques used and their support level

- **`backdrop-filter` (glassmorphism header)**: supported in all
  evergreen browsers listed above. A solid `--stc-glass-bg` colour is
  still set as the base `background`, so browsers without
  `backdrop-filter` support simply show a solid (not blurred) header —
  a graceful, non-broken fallback.
- **CSS custom properties (design tokens)**: supported everywhere
  targeted; no build step required.
- **CSS Grid** (footer layout) and **Flexbox** (header, nav, mobile
  panel): universally supported in the target matrix.
- **`IntersectionObserver`** (optional scroll-reveal utility): guarded
  with a feature check (`if ('IntersectionObserver' in window)`) in
  `header.js` — pages simply don't reveal-animate on any browser old
  enough to lack it, nothing errors.
- **`:focus-visible`**: supported in all evergreen browsers; older
  browsers fall back to always showing focus rings, which is a safe
  (more visible, not less accessible) fallback.

## Responsive breakpoints

| Range | Layout |
|---|---|
| ≥ 992px (desktop/laptop) | Full mega-menu navigation inline in header |
| 768–991px (tablet) | Mega-menu collapses into the slide-out mobile panel; utility-bar quick links thin out to avoid crowding |
| ≤ 767px (mobile) | Compact header, tagline hidden, topbar reduced to essentials, full slide-out navigation |

All breakpoints are tested down to a 320px viewport width.

## Print

Not specially optimized in this pass — the header/footer will print
as shown on screen. If a print stylesheet is desired later, the
`stc-` namespace makes it straightforward to add a `@media print`
block that hides `.stc-header`, `.stc-back-to-top`, and
`.stc-search-overlay`.

## Known non-goals

- Internet Explorer 11 is not supported (matches current mainstream
  university-site practice; CSS Grid + custom properties + `let`/`const`
  usage throughout would require a substantial transpile/polyfill
  layer that isn't justified for a browser with negligible remaining
  traffic).
