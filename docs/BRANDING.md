# Branding Guide

## Design rationale

Most university redesigns default to "institutional blue." This one
instead draws its palette from Bhutanese textile colour — deep maroon
(as worn in monastic and formal dress) and temple gold — set against a
warm paper background, so the site reads distinctly as an Eastern
Himalayan academic institution rather than a generic template. The
single signature element is a thin ridgeline silhouette in the footer,
a quiet nod to Kanglung's hillside campus setting — used exactly once,
not repeated as decoration.

## Where everything lives

All visual tokens are CSS custom properties in
**`assets/css/variables.css`**. Change a value there and it updates
everywhere the token is used — no need to hunt through header.css,
footer.css, or navigation.css.

## Colour

```css
--stc-maroon:      #7A1B2B;  /* primary brand colour */
--stc-maroon-dark: #4E1019;  /* top utility bar, shrunk-header shadow */
--stc-gold:        #C7962C;  /* accent — links, icons, active states */
--stc-gold-light:  #E8C97A;  /* hover states on dark backgrounds */
--stc-ridge:       #24161A;  /* footer background */
--stc-paper:       #FAF7F1;  /* header/page background */
```

To re-brand, replace these six values with the College's approved hex
codes. Keep contrast in mind — see `docs/ACCESSIBILITY.md` for the
minimum ratios these tokens were chosen to satisfy.

## Typography

```css
--stc-font-display: 'Fraunces', Georgia, serif;      /* headings, brand name, mega-menu headings */
--stc-font-body:    'Public Sans', -apple-system, ...; /* nav, body copy, footer */
```

Both load from Google Fonts in `includes/header.php` via a single
`<link>` tag with `font-display: swap` behaviour (Google Fonts serves
`display=swap` automatically in the URL used here), so text is never
invisible while the webfont loads. To swap typefaces, change both the
Google Fonts `<link href>` in `header.php` and the two variables above
together — they must stay in sync.

## Logo

Replace `assets/images/sherubtse-logo.svg` with the College's official
crest. Recommended: SVG, square canvas, transparent background, under
~30 KB. If only a raster logo is available, a 96×96 (2x of 48×48) PNG
also works — just update the `<img>` `src` and remove the
`width`/`height="48"` attributes' implicit aspect-ratio assumption if
the artwork isn't square.

Update the path once, in `includes/config.php`:

```php
'logo' => BASE_URL . 'assets/images/sherubtse-logo.svg',
```

## Dark mode (ready, not required)

`variables.css` already defines a `[data-theme="dark"]` token override.
To turn it on, add `data-theme="dark"` to `<html>` (via a theme toggle
script, or based on the visitor's OS preference) — no other file needs
to change.

## Spacing & radius

The 4px-based spacing scale (`--stc-space-1` … `--stc-space-8`) and
border-radius tokens (`--stc-radius-sm/md/lg`) control the density of
the whole component. Increasing `--stc-radius-md`/`lg` gives a softer,
rounder feel; reducing it moves toward the flatter, sharper-cornered
look used by MIT/Stanford-style sites.
