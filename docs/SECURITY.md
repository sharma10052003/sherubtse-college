# Security Implementation

## 1. Include files are never directly reachable

Two independent layers, so a misconfiguration in one doesn't expose
the other:

**Layer 1 — PHP guard constant.** `includes/config.php` defines
`SHERUBTSE_INIT` the moment it runs. Every other file in `/includes`
(`header.php`, `footer.php`, `navigation.php`, `mobile-menu.php`,
`search.php`, `announcement.php`) starts with:

```php
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}
```

If any of these files is requested directly
(`/includes/header.php` typed straight into a browser), the constant
was never defined, so the file immediately returns **HTTP 403** and
exits before rendering anything.

**Layer 2 — web-server rule.** `includes/.htaccess` denies all direct
HTTP requests to `.php`/`.inc` files in that folder outright (on
Apache/`mod_authz_core`), so the request never reaches PHP at all in
the normal case. This is defence in depth — the PHP guard on its own
is already sufficient, but the two together mean a server
misconfiguration in one layer doesn't remove the other.

> **If the site runs on Nginx instead of Apache**, `.htaccess` is
> ignored. Add the equivalent block to the server's `nginx.conf` /
> site config:
> ```nginx
> location ^~ /includes/ {
>     deny all;
>     return 403;
> }
> ```

## 2. Directory listing disabled

Both `includes/.htaccess` and `assets/.htaccess` set `Options -Indexes`,
so browsing to a folder URL without a specific filename doesn't reveal
a file listing.

## 3. Output escaping

Every piece of dynamic content from `config.php` (labels, URLs,
messages) is passed through `htmlspecialchars(..., ENT_QUOTES, 'UTF-8')`
before being echoed. This prevents stored/reflected XSS if `config.php`
is ever populated from a CMS field or database in the future rather
than hard-coded — the escaping is already in place either way.

## 4. External links

Every link that opens in a new tab (`target="_blank"`) also carries
`rel="noopener noreferrer"`, preventing the opened page from getting a
`window.opener` reference back into the College's site (reverse
tabnabbing).

## 5. No inline event handlers / no `eval`

All JavaScript is in external files (`assets/js/*.js`) using
`addEventListener`; there are no inline `onclick="..."` attributes and
no use of `eval`, `innerHTML` with unsanitised input, or
`document.write`. This keeps the component compatible with a strict
`Content-Security-Policy` (e.g. `script-src 'self'`) if/when the site
adopts one.

## 6. No new attack surface on forms/auth

This package adds no forms that submit anywhere except the **existing**
search endpoint (configurable via the `SEARCH_ACTION` constant,
defaulting to the site's current `/search.php`). It does not touch
login, session handling, CSRF tokens, or any existing form — those
remain exactly as they were.

## 7. Third-party dependencies

Bootstrap Icons and Google Fonts load from their official CDNs over
HTTPS. If the College's security policy requires zero third-party
requests, see the self-hosting note in `docs/PERFORMANCE.md`.
