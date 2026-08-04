/**
 * mobile-menu.js
 * Slide-out mobile navigation: open/close, accordion-style submenus,
 * focus trap while open, Escape to close, body scroll lock.
 */
(function () {
  'use strict';

  var toggle = document.getElementById('stcMobileToggle');
  var menu = document.getElementById('stcMobileMenu');
  var closeBtn = document.getElementById('stcMobileClose');
  var scrim = document.getElementById('stcMobileScrim');
  if (!toggle || !menu) return;

  var panel = menu.querySelector('.stc-mobile__panel');
  var lastFocused = null;

  function getFocusable() {
    return panel.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

  function openMenu() {
    lastFocused = document.activeElement;
    menu.hidden = false;
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
    var focusable = getFocusable();
    if (focusable.length) focusable[0].focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeMenu() {
    menu.hidden = true;
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }
    if (e.key === 'Tab') {
      var focusable = Array.prototype.slice.call(getFocusable());
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (scrim) scrim.addEventListener('click', closeMenu);

  // Accordion submenus
  menu.querySelectorAll('.stc-mobile__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var panelId = trigger.getAttribute('aria-controls');
      var submenu = document.getElementById(panelId);
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close any other open submenu (single-open accordion)
      menu.querySelectorAll('.stc-mobile__trigger[aria-expanded="true"]').forEach(function (other) {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      if (submenu) submenu.hidden = isOpen;
    });
  });
})();
