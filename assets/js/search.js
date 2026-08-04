/**
 * search.js
 * Animated full-screen search overlay: open via icon or "/" shortcut,
 * close via icon, Escape, or clicking outside the panel.
 * This is markup/UX only — it submits to the existing search endpoint
 * configured in includes/search.php and does not alter search logic.
 */
(function () {
  'use strict';

  var toggle = document.getElementById('stcSearchToggle');
  var overlay = document.getElementById('stcSearchOverlay');
  var closeBtn = document.getElementById('stcSearchClose');
  var input = document.getElementById('stcSearchInput');
  if (!toggle || !overlay) return;

  var lastFocused = null;

  function openSearch() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    if (input) input.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeSearch() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeSearch();
  }

  toggle.addEventListener('click', openSearch);
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);

  // Click outside the panel closes the overlay
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeSearch();
  });

  // "/" keyboard shortcut to open search, unless typing in a field
  document.addEventListener('keydown', function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    var typing = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable;
    if (e.key === '/' && !typing && overlay.hidden) {
      e.preventDefault();
      openSearch();
    }
  });
})();
