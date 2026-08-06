/**
 * faculty-profile.js — individual profile page: reveal-on-scroll and a
 * simple accessible lightbox for the gallery sections. No dependencies.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.STC_ANIMATIONS_ENABLED === false;

  /* ---- Reveal-on-scroll --------------------------------------------------- */
  var revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-variant]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Gallery lightbox ---------------------------------------------------- */
  var lightbox = document.getElementById('stcFacultyProfileLightbox');
  var lbImage = document.getElementById('stcFacultyProfileLightboxImage');
  var closeBtn = document.getElementById('stcFacultyProfileLightboxClose');
  var items = document.querySelectorAll('.stc-faculty-gallery-item');
  if (!lightbox || !lbImage || !items.length) return;

  var lastFocused = null;

  function openLightbox(src, alt) {
    lastFocused = document.activeElement;
    lbImage.src = src;
    lbImage.alt = alt || '';
    lightbox.hidden = false;
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lbImage.src = '';
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  items.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = btn.querySelector('img');
      openLightbox(btn.dataset.lightboxSrc, img ? img.alt : '');
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
})();
