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

  function openItem(item) {
    closeAll(item);
    item.classList.add('is-open');
    var trigger = item.querySelector('.stc-nav__trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
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
})();
