# Maintenance Guide

## Day-to-day content changes

Handled entirely in `includes/config.php` — see
`docs/CONTENT-GUIDE.md`. No developer needed for adding a link, toggling
the announcement banner, or updating contact details.

## Re-branding

Handled entirely in `assets/css/variables.css` (colour/type/spacing)
and `includes/config.php` (logo path) — see `docs/BRANDING.md`.

## File ownership map

| Change requested | File(s) to touch |
|---|---|
| New nav item / footer link / portal | `includes/config.php` only |
| Colour, font, spacing | `assets/css/variables.css` only |
| Logo | `assets/images/` + one line in `config.php` |
| New header/footer *structure* (e.g. a 5th footer column) | `includes/footer.php` + `assets/css/footer.css` |
| New interactive behaviour | relevant file in `assets/js/` |
| Search endpoint changes | `SEARCH_ACTION` constant, or `includes/search.php` form `action` |

## Safe-change checklist

Before committing a change:

1. If you edited `config.php`: confirm the array syntax is still valid
   PHP (a missing comma is the most common break) — load any page
   locally and check for a PHP parse error.
2. If you edited a `.css` file: confirm you didn't remove a `--stc-*`
   variable another file still references (search the repo for the
   variable name before deleting it).
3. If you edited a `.js` file: confirm you didn't remove an `id` that
   another script also queries (e.g. `stcMobileMenu` is used by both
   `mobile-menu.php` and `mobile-menu.js`).
4. Re-run the accessibility and Lighthouse checks in
   `docs/ACCESSIBILITY.md` / `docs/PERFORMANCE.md` after any visual
   change, not just at initial launch.

## Extending the mega menu

Mega menus render from `columns` arrays in `config.php`; the CSS
(`.stc-mega__inner`) uses `grid-auto-flow: column`, so adding a 3rd or
4th column to any menu item needs no CSS change — it lays out
automatically. Very long menus (5+ columns) will start to feel
cramped on laptop screens; consider splitting into two top-level items
instead.

## Versioning recommendation

This package has no build tooling or dependency manifest by design
(no `package.json` / `composer.json` required to run it). If the
College's engineering team wants dependency tracking anyway (e.g. for
the optional minification step in `docs/PERFORMANCE.md`), add a
`package.json` scoped to `/assets` without affecting how PHP includes
the files.

## Who to contact

Update this section with the College's internal contacts:
- **Content changes** (nav/footer text): ______________________
- **Design/branding changes**: ______________________
- **Developer/technical owner**: ______________________
