/**
 * president.js — scroll-reveal (photo from left, text from right)
 * and button ripple for the President's Welcome section.
 */
(function () {
  'use strict';

  var section = document.querySelector('.stc-president');
  if (!section) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.STC_ANIMATIONS_ENABLED === false;
  var targets = section.querySelectorAll('[data-reveal-variant]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    targets.forEach(function (el) { observer.observe(el); });
  }

  var btn = section.querySelector('.stc-president__btn');
  if (btn) {
    btn.addEventListener('click', function (e) {
      if (reduceMotion) return;
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      ripple.className = 'stc-ripple-effect';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      window.setTimeout(function () { ripple.remove(); }, 650);
    });
  }
})();
