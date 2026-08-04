/**
 * gallery.js — category filter, scroll-reveal, and an accessible
 * lightbox for the Campus Gallery homepage section. No dependencies.
 */
(function () {
  'use strict';

  var section = document.querySelector('.stc-gallery');
  if (!section) return;

  var images = window.STC_GALLERY_IMAGES || [];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.STC_ANIMATIONS_ENABLED === false;

  /* ---- Category filter ----------------------------------------------------- */
  var filterButtons = section.querySelectorAll('.stc-gallery__filters button');
  var items = section.querySelectorAll('.stc-gallery__item');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      var filter = btn.dataset.filter;
      items.forEach(function (item) {
        item.hidden = !(filter === 'all' || item.dataset.category === filter);
      });
    });
  });

  /* ---- Scroll reveal -------------------------------------------------------- */
  var revealTargets = [];
  var heading = section.querySelector('.stc-gallery__header h2');
  if (heading) revealTargets.push(heading);
  items.forEach(function (el) { revealTargets.push(el); });

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
    }, { threshold: 0.1 });
    revealTargets.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Lightbox -------------------------------------------------------------- */
  var lightbox = document.getElementById('stcLightbox');
  if (!lightbox || !images.length) return;

  var lbImage = document.getElementById('stcLightboxImage');
  var lbCaption = document.getElementById('stcLightboxCaption');
  var closeBtn = document.getElementById('stcLightboxClose');
  var prevBtn = document.getElementById('stcLightboxPrev');
  var nextBtn = document.getElementById('stcLightboxNext');
  var currentIndex = 0;
  var lastFocused = null;
  var TRANSITION_NAME = 'stc-gallery-transition';
  var canViewTransition = !reduceMotion && typeof document.startViewTransition === 'function';

  function setContent(index) {
    currentIndex = (index + images.length) % images.length;
    var img = images[currentIndex];
    lbImage.src = img.src;
    lbImage.alt = img.caption || '';
    lbCaption.textContent = img.caption || '';
  }

  /** Cross-fades between photos while the lightbox is already open
   *  (Prev/Next and arrow keys) — same element, so the View
   *  Transitions API produces a smooth opacity cross-fade for free. */
  function show(index) {
    if (canViewTransition && !lightbox.hidden) {
      document.startViewTransition(function () { setContent(index); });
    } else {
      setContent(index);
    }
  }

  /** Opens the lightbox, morphing the clicked grid thumbnail into the
   *  full-size photo via a shared view-transition-name. */
  function open(index, sourceImg) {
    lastFocused = document.activeElement;

    function mutate() {
      if (sourceImg) sourceImg.style.viewTransitionName = '';
      setContent(index);
      lightbox.hidden = false;
      lbImage.style.viewTransitionName = TRANSITION_NAME;
      document.body.style.overflow = 'hidden';
    }

    if (canViewTransition && sourceImg) {
      sourceImg.style.viewTransitionName = TRANSITION_NAME;
      document.startViewTransition(mutate);
    } else {
      mutate();
    }
    closeBtn.focus();
  }

  /** Closes the lightbox, morphing back into the corresponding grid
   *  thumbnail (falls back to a plain fade if it's filtered out of view). */
  function close() {
    var targetItem = items[currentIndex];
    var targetImg = targetItem ? targetItem.querySelector('img') : null;

    function mutate() {
      lbImage.style.viewTransitionName = '';
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }

    if (canViewTransition && targetImg && !targetItem.hidden) {
      targetImg.style.viewTransitionName = TRANSITION_NAME;
      document.startViewTransition(mutate).finished.finally(function () {
        targetImg.style.viewTransitionName = '';
      });
    } else {
      mutate();
    }
    if (lastFocused) lastFocused.focus();
  }

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      open(parseInt(item.dataset.index, 10) || 0, item.querySelector('img'));
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { show(currentIndex + 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
    if (e.key === 'Tab') {
      // Simple focus trap within the three lightbox controls.
      var focusable = [closeBtn, prevBtn, nextBtn];
      var idx = focusable.indexOf(document.activeElement);
      e.preventDefault();
      var next = e.shiftKey ? (idx <= 0 ? focusable.length - 1 : idx - 1) : (idx === focusable.length - 1 ? 0 : idx + 1);
      focusable[next].focus();
    }
  });
})();
