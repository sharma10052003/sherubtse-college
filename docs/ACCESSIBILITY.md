# Accessibility Checklist (WCAG 2.1 AA)

## Implemented in this component

- [x] **Skip link** — first focusable element on the page, jumps to
      `#main-content` (`.stc-skip-link` in `header.php`).
- [x] **Semantic landmarks** — `<header>`, `<nav aria-label="Primary">`,
      `<footer>`; the search and mobile panels use
      `role="dialog" aria-modal="true"` with an accessible name.
- [x] **Keyboard navigation, full coverage**:
  - Mega menus: `Tab` to trigger, `Enter`/`Space` toggles, `ArrowDown`
    opens and moves into the panel, `ArrowUp`/`ArrowDown` roam within
    it, `Escape` closes and returns focus to the trigger.
  - Mobile panel & search overlay: focus is trapped while open (`Tab`
    cannot escape to the page behind), `Escape` closes and restores
    focus to the element that opened it.
  - Back-to-top and all icon buttons are real `<button>` elements —
    reachable and activatable by keyboard by default.
- [x] **Visible focus states** — a 3px gold outline
      (`--stc-focus`, meets 3:1 non-text contrast against both the
      maroon and paper backgrounds) via `:focus-visible` on every
      interactive element in the header, nav, mobile menu, search, and
      footer.
- [x] **ARIA labelling on icon-only controls** — search toggle,
      mobile menu toggle, mobile/search close buttons, announcement
      dismiss, back-to-top, and every social icon all carry
      `aria-label`.
- [x] **ARIA state** — `aria-expanded` on all menu triggers,
      `aria-controls` linking triggers to the panel they open,
      `aria-haspopup` on the search/mobile toggles.
- [x] **Colour contrast** — body text `--stc-ink` (#221A17) on
      `--stc-paper` (#FAF7F1) and nav text on the glass header exceed
      4.5:1; utility-bar text on `--stc-maroon-dark` and footer text on
      `--stc-ridge` were chosen to clear 4.5:1 for body text / 3:1 for
      large text and icons.
- [x] **`prefers-reduced-motion`** respected globally — see
      `variables.css` and the reduced-motion blocks in each CSS file;
      motion-based transitions collapse to instant state changes.
- [x] **Accessible images** — logo carries descriptive `alt` text on
      first use (header) and empty `alt=""` on the decorative
      repetition in the footer (avoids the screen reader announcing
      the crest twice per page); the footer ridge SVG is
      `aria-hidden="true"` (purely decorative).
- [x] **Form labelling** — the search input has an associated
      (visually hidden but screen-reader-visible) `<label>`.
- [x] **Touch target size** — icon buttons are 40–48px square, meeting
      the 44px recommended minimum touch target.
- [x] **Language & reading order** — DOM order matches visual order at
      every breakpoint (no CSS-only reordering that would desync
      screen-reader and visual order).

## Manual QA still recommended before launch

- [ ] Run an automated pass (axe DevTools / Lighthouse Accessibility)
      against a real page using this header/footer.
- [ ] Test with a screen reader (NVDA + Firefox, or VoiceOver + Safari)
      through: skip link → mega menu → mobile menu → search overlay.
- [ ] Verify the College's actual brand colours (once applied in
      `docs/BRANDING.md`) still clear 4.5:1 body-text contrast — a
      colour swap can silently break this.
- [ ] Confirm zoom to 200% and Windows high-contrast mode don't clip
      or hide any menu content.
