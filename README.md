# Sherubtse College — Header & Footer Redesign

A modular, production-ready Header and Footer for the Sherubtse College
website. Built to slot into the **existing** site as a drop-in
replacement — it does not touch page content, backend logic, the
database, routing, CMS, auth, or any existing JavaScript.

Design direction: an Eastern-Himalayan academic identity — deep robe
maroon and temple gold on a warm paper background, a serif display
face for gravitas, and a single restrained ridgeline motif nodding to
the Kanglung hillside campus — rather than a generic "university blue"
template. Full rationale in [`docs/BRANDING.md`](docs/BRANDING.md).

---

## Folder structure

```text
/includes
    config.php        ← single source of truth: branding, nav, footer content, guard constant
    header.php         ← <header> markup + enqueues header/nav CSS+JS
    footer.php          ← <footer> markup + enqueues footer CSS
    navigation.php        ← desktop mega-menu, reads $stc_nav from config.php
    mobile-menu.php        ← slide-out mobile panel, reads same config
    search.php              ← full-screen search overlay markup
    announcement.php         ← dismissible site-wide banner
    .htaccess                 ← blocks direct HTTP access to this folder

/assets
    /css
        variables.css   ← design tokens (colour, type, spacing, motion)
        header.css       ← topbar, sticky/glass header, search overlay, back-to-top
        navigation.css    ← mega menu + mobile panel
        footer.css         ← footer
    /js
        header.js        ← scroll shrink, progress bar, back-to-top, announcement dismiss
        navigation.js      ← mega menu hover/click/keyboard
        mobile-menu.js       ← slide-out panel, focus trap, accordion
        search.js              ← search overlay open/close, "/" shortcut
    /images
        sherubtse-logo.svg  ← placeholder crest — replace with real logo

/example
    index.php            ← minimal page showing the two-line integration

/docs
    BRANDING.md            ← design tokens, how to re-brand colours/fonts/logo
    CONTENT-GUIDE.md         ← how to edit navigation & footer content (non-developer friendly)
    SECURITY.md                ← include-guard + .htaccess details
    PERFORMANCE.md               ← Lighthouse/Core Web Vitals notes
    ACCESSIBILITY.md               ← WCAG 2.1 AA checklist
    BROWSER-COMPATIBILITY.md         ← supported browsers/devices
    MAINTENANCE.md                    ← ongoing upkeep guide
```

---

## Integration guide

Every existing page needs exactly **two additional lines** (plus one
`require_once` at the top). Nothing else about the page changes.

```php
<?php
require_once __DIR__ . '/includes/config.php';   // 1. bootstrap — brand/nav data + include guard
?>
<!DOCTYPE html>
<html lang="en">
<head>...existing head, unchanged...</head>
<body>

  <?php include __DIR__ . '/includes/header.php'; ?>   <!-- 2. new header -->

  <main id="main-content">
      ...existing page content, completely unchanged...
  </main>

  <?php include __DIR__ . '/includes/footer.php'; ?>   <!-- 3. new footer -->

</body>
</html>
```

Notes:

- `id="main-content"` on the main wrapper is what the accessibility
  "Skip to main content" link jumps to. Add it to the existing main
  wrapper if it doesn't already have an id (a `<main>`/`<div>` id is a
  one-attribute change, not a layout change).
- If old pages currently `include 'includes/header-old.php'`, keep the
  old files in place under a different name until every page has been
  switched over, then remove them — there's no need for a
  flag-day cutover.
- `BASE_URL` in `config.php` defaults to `/`. If the site (or a staging
  copy) lives in a subfolder, change that one constant.
- See `example/index.php` for a complete minimal page.

## Requirements

- PHP 8.0+
- No new server dependencies. Bootstrap Icons and Google Fonts load
  from CDN (see `docs/PERFORMANCE.md` for self-hosting instructions if
  the College prefers not to depend on external CDNs).

## Where to go next

| I want to... | Read |
|---|---|
| Change the logo, colours, or fonts | `docs/BRANDING.md` |
| Add/remove/reorder a navigation item or footer link | `docs/CONTENT-GUIDE.md` |
| Understand the access-control setup | `docs/SECURITY.md` |
| Check Lighthouse / Core Web Vitals notes | `docs/PERFORMANCE.md` |
| Review the accessibility checklist | `docs/ACCESSIBILITY.md` |
| Confirm browser/device support | `docs/BROWSER-COMPATIBILITY.md` |
| Do routine upkeep | `docs/MAINTENANCE.md` |
