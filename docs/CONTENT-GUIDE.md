# Updating Navigation & Footer Content

Everything editable lives in **one file**: `includes/config.php`. You
never need to open `header.php`, `footer.php`, or `navigation.php` to
change content — those files just read from `config.php` and draw the
menus automatically.

## Add a simple navigation link (no dropdown)

Find `$stc_nav` in `config.php` and add a line like:

```php
['label' => 'Alumni', 'url' => '/alumni'],
```

## Add a link inside an existing dropdown (e.g. "Academics")

Find the matching `columns` array and add a link to one of its
`links` lists:

```php
['label' => 'Exchange Programmes', 'url' => '/academics/exchange', 'icon' => 'bi-airplane'],
```

`icon` is optional — it must be a class name from [Bootstrap
Icons](https://icons.getbootstrap.com/) (already loaded on every
page). Omit it and the link still works, just without an icon.

## Add a brand-new dropdown menu

Copy an existing entry in `$stc_nav` that has a `columns` array (e.g.
"Academics") and edit its `label` and `columns`. The mega-menu layout
adapts automatically — no CSS changes needed for 2–4 columns.

## Reorder menu items

Reorder the entries in the `$stc_nav` array — the menu renders in the
same order as the array.

## Update quick-link portals (Student Portal, VLE, Library, etc.)

Edit `$stc_quick_links` — same `label` / `url` / `icon` shape as above,
plus `'external' => true` for links that should open in a new tab
(used for anything leaving the main site, e.g. the portal subdomains).

## Update the footer

- **Footer link columns** ("Quick Links", "Resources"): edit
  `$stc_footer['columns']`.
- **Contact details**: edit `$stc_footer['contact']` (address, phone,
  email, Google Maps link).
- **About text / motto**: edit `$stc_footer['about']` and
  `$stc_footer['motto']`.
- **Bottom bar links** (Privacy, Terms, Accessibility, Credits): edit
  `$stc_footer['bottom_links']`.
- **Copyright year** updates itself automatically (uses the server's
  current year) — nothing to edit.

## Turn the announcement banner on/off

```php
$stc_announcement = [
    'active'  => true,   // set to false to hide the banner site-wide
    'message' => 'Admissions for the 2027 academic year open on 1 December 2026.',
    'link'    => ['label' => 'Learn more', 'url' => '/admissions'],
    'dismissible' => true,
];
```

## Social links

Edit `$stc_social_links` — appears in both the top utility bar and the
footer automatically, so you only update it once.

## A note on safety

Every value you type into `config.php` is automatically escaped
before it's printed to the page (via `htmlspecialchars`), so typing an
ampersand, quote, or apostrophe in a label is always safe and will
never break the page's HTML.
