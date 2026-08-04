/**
 * header.js
 * Handles: sticky-shrink header state, scroll progress bar,
 * announcement banner dismissal (persisted for the session),
 * and the back-to-top button. No dependencies (vanilla ES6+).
 */
(function () {
  'use strict';

  var header = document.getElementById('stcHeader');
  var progress = document.getElementById('stcProgress');
  var backToTop = document.getElementById('stcBackToTop');
  var announcement = document.getElementById('stcAnnouncement');
  var announcementClose = document.getElementById('stcAnnouncementClose');

  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || document.documentElement.scrollTop;

      // Header intentionally does not shrink on scroll — kept at full
      // size at all scroll positions (data-shrink stays "false").

      // Scroll progress bar
      if (progress) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
        progress.style.width = pct + '%';
      }

      // Back-to-top visibility
      if (backToTop) {
        if (y > 480) {
          backToTop.hidden = false;
          backToTop.classList.add('is-visible');
        } else {
          backToTop.classList.remove('is-visible');
        }
      }

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
    backToTop.addEventListener('transitionend', function () {
      if (!backToTop.classList.contains('is-visible') && (window.scrollY || 0) <= 480) {
        backToTop.hidden = true;
      }
    });
  }

  // Announcement banner — dismiss for this browser session only.
  if (announcement && announcementClose) {
    try {
      if (sessionStorage.getItem('stcAnnouncementDismissed') === '1') {
        announcement.classList.add('stc-announcement--hidden');
      }
    } catch (e) { /* storage unavailable — banner just stays visible */ }

    announcementClose.addEventListener('click', function () {
      announcement.classList.add('stc-announcement--hidden');
      try { sessionStorage.setItem('stcAnnouncementDismissed', '1'); } catch (e) {}
    });
  }

  // Smooth scrolling for in-page anchor links (#section), respecting
  // reduced-motion preference. Does not touch links to other pages.
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  // Lightweight scroll-reveal: opt in per-element with class="stc-reveal".
  // Existing page content is untouched unless it already uses this class.
  if ('IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('.stc-reveal');
    if (revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('stc-reveal--visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }
})();
