/**
 * contact.js — scroll-reveal and click/tap-to-flip contact cards for
 * the Contact Us page (/contact).
 */
(function () {
  'use strict';

  var page = document.querySelector('.stc-contact');
  if (!page) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.STC_ANIMATIONS_ENABLED === false;

  /* ---- Scroll reveal (shared convention, see history.js) ---------------- */
  var revealTargets = page.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---- Click/tap-to-flip contact cards ------------------------------------ */
  var cards = page.querySelectorAll('.stc-contact__card');
  cards.forEach(function (card) {
    var toggle = function () {
      var flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'Escape' && card.classList.contains('is-flipped')) {
        card.classList.remove('is-flipped');
        card.setAttribute('aria-pressed', 'false');
      }
    });
  });
})();
