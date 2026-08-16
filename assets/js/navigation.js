/**
 * navigation.js
 * Desktop mega-menu behaviour: hover-intent open, click/tap toggle,
 * full keyboard support (Enter/Space/Arrow/Escape), and closes when
 * focus or a click moves outside the open menu.
 */
(function () {
  'use strict';

  var items = document.querySelectorAll('.stc-nav__item--has-menu');
  if (!items.length) return;

  var OPEN_DELAY = 80;
  var CLOSE_DELAY = 200;
  var openTimer, closeTimer;

  function closeAll(except) {
    items.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var trigger = item.querySelector('.stc-nav__trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  // Mega panels are centered under their trigger by default, which
  // pushes them past the viewport edge for triggers near either side
  // (e.g. the last item or two before the header's search/menu
  // buttons). Nudge the panel back on-screen with an extra transform
  // offset rather than letting it clip or force a scrollbar.
  function positionMega(item) {
    var mega = item.querySelector('.stc-mega');
    if (!mega) return;
    mega.style.transform = ''; // back to the CSS default (centered) to measure cleanly
    var margin = 16;
    var rect = mega.getBoundingClientRect();
    var overflowRight = rect.right - (window.innerWidth - margin);
    var overflowLeft = margin - rect.left;
    var shift = 0;
    if (overflowRight > 0) shift = -overflowRight;
    else if (overflowLeft > 0) shift = overflowLeft;
    if (shift !== 0) {
      mega.style.transform = 'translate(calc(-50% + ' + shift + 'px), 0)';
    }
  }

  function openItem(item) {
    closeAll(item);
    item.classList.add('is-open');
    var trigger = item.querySelector('.stc-nav__trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    // Deferred a tick: measuring/overriding transform in the same tick
    // as the is-open class toggle races the CSS transition that toggle
    // just started, and the browser locks the property to the
    // transition's value until it resolves, silently ignoring our
    // inline override. A minimal setTimeout (unlike rAF, not paused on
    // a backgrounded/non-composited tab) is enough for the toggle's
    // initial style flush to land before we read and adjust position.
    setTimeout(function () { positionMega(item); }, 0);
  }

  function closeItem(item) {
    item.classList.remove('is-open');
    var trigger = item.querySelector('.stc-nav__trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  items.forEach(function (item) {
    var trigger = item.querySelector('.stc-nav__trigger');
    var mega = item.querySelector('.stc-mega');
    if (!trigger || !mega) return;

    // Hover intent (desktop mouse)
    item.addEventListener('mouseenter', function () {
      clearTimeout(closeTimer);
      openTimer = setTimeout(function () { openItem(item); }, OPEN_DELAY);
    });
    item.addEventListener('mouseleave', function () {
      clearTimeout(openTimer);
      closeTimer = setTimeout(function () { closeItem(item); }, CLOSE_DELAY);
    });

    // Click / tap toggle (also covers touch devices without hover)
    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });

    // Keyboard: Enter/Space handled natively by <button>; add Arrow/Escape.
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openItem(item);
        var firstLink = mega.querySelector('.stc-mega__link');
        if (firstLink) firstLink.focus();
      }
      if (e.key === 'Escape') {
        closeItem(item);
        trigger.focus();
      }
    });

    // Arrow-key roaming within an open panel
    mega.addEventListener('keydown', function (e) {
      var links = Array.prototype.slice.call(mega.querySelectorAll('.stc-mega__link'));
      var idx = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = links[idx + 1] || links[0];
        next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = links[idx - 1] || links[links.length - 1];
        prev.focus();
      } else if (e.key === 'Escape') {
        closeItem(item);
        trigger.focus();
      }
    });
  });

  // Close any open menu on outside click
  document.addEventListener('click', function (e) {
    var withinNav = e.target.closest('.stc-nav__item--has-menu');
    if (!withinNav) closeAll();
  });

  // Close on focus leaving the whole nav (tab out)
  document.addEventListener('focusin', function (e) {
    var withinNav = e.target.closest('.stc-nav__item--has-menu');
    if (!withinNav) closeAll();
  });

  // Close all on Escape anywhere
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  // Re-clamp the open panel's position if the viewport is resized
  // (e.g. rotating a tablet) while it's open.
  window.addEventListener('resize', function () {
    var openItem = document.querySelector('.stc-nav__item--has-menu.is-open');
    if (openItem) positionMega(openItem);
  });
})();
