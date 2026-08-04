/**
 * theme-toggle.js — dark/light mode switch.
 * The FOUC-avoiding inline bootstrap script in index.php's <head> already
 * applies the stored/preferred theme before first paint; this file only
 * wires up the toggle button's click behaviour and keeps its icon/ARIA
 * state in sync.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'stc-theme';
  var btn = document.getElementById('stcThemeToggle');
  if (!btn) return;

  var icon = btn.querySelector('i');

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function syncButton() {
    var dark = isDark();
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    if (icon) {
      icon.className = dark ? 'bi bi-sun' : 'bi bi-moon-stars';
    }
  }

  btn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    if (next === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* private mode */ }
    syncButton();
  });

  syncButton();
})();
