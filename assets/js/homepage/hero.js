/**
 * hero.js — counter animation, button ripple, scroll indicator.
 * No dependencies, no inline handlers (matches header/footer JS convention).
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.STC_ANIMATIONS_ENABLED === false;

  /* ---- Animated stat counters, triggered once when scrolled into view --- */
  var counters = document.querySelectorAll('.stc-counter');
  if (counters.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = el.dataset.target;
      });
    } else {
      var runCounter = function (el) {
        var target = parseInt(el.dataset.target, 10) || 0;
        var duration = 1400;
        var start = null;

        function step(timestamp) {
          if (start === null) start = timestamp;
          var progress = Math.min((timestamp - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target.toLocaleString();
          }
        }
        requestAnimationFrame(step);
      };

      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });

      counters.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---- Button ripple effect ---------------------------------------------- */
  document.querySelectorAll('.stc-hero__btn').forEach(function (btn) {
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
  });

  /* ---- Scroll indicator --------------------------------------------------- */
  var scrollBtn = document.getElementById('stcHeroScroll');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      var hero = document.querySelector('.stc-hero');
      var next = hero && hero.nextElementSibling;
      var target = next || hero;
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  }
})();
