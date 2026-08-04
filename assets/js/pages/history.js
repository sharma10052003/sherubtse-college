/**
 * history.js — scroll-reveal, Heritage Gallery filter+lightbox (View
 * Transitions where supported), and the Then-vs-Now comparison
 * slider for the History & Heritage page (/about/history).
 */
(function () {
  'use strict';

  var page = document.querySelector('.stc-history');
  if (!page) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.STC_ANIMATIONS_ENABLED === false;

  /* ---- Scroll reveal (generic fade-up + the timeline's left/right cards) ---- */
  var revealTargets = page.querySelectorAll('[data-reveal], [data-reveal-variant]');
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

  /* ---- Timeline: scroll-driven progress line ----------------------------------
     Fills the gold overlay over the static line as the timeline scrolls
     through the viewport — purely a visual progress cue, so it's safe
     to just snap to 100% under reduced-motion instead of animating. */
  var timelineEl = document.getElementById('stcHistoryTimeline');
  var progressEl = document.getElementById('stcTimelineProgress');
  if (timelineEl && progressEl) {
    if (reduceMotion) {
      progressEl.style.clipPath = 'inset(0 0 0% 0)';
    } else {
      var ticking = false;
      var updateProgress = function () {
        var rect = timelineEl.getBoundingClientRect();
        var vh = window.innerHeight;
        var total = rect.height + vh * 0.5;
        var scrolled = vh * 0.5 - rect.top;
        var pct = Math.max(0, Math.min(1, total > 0 ? scrolled / total : 0));
        progressEl.style.clipPath = 'inset(0 0 ' + ((1 - pct) * 100) + '% 0)';
        ticking = false;
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { window.requestAnimationFrame(updateProgress); ticking = true; }
      }, { passive: true });
      window.addEventListener('resize', updateProgress);
      updateProgress();
    }
  }

  /* ---- Heritage Gallery: filter + lightbox ----------------------------------- */
  var gallerySection = page.querySelector('.stc-history__gallery');
  if (gallerySection) {
    var images = window.STC_HISTORY_GALLERY_IMAGES || [];
    var filterButtons = gallerySection.querySelectorAll('.stc-history__gallery-filters button');
    var items = gallerySection.querySelectorAll('.stc-history__gallery-item');

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        var filter = btn.dataset.filter;
        items.forEach(function (item) { item.hidden = !(filter === 'all' || item.dataset.category === filter); });
      });
    });

    var lightbox = document.getElementById('stcHistoryLightbox');
    if (lightbox && images.length) {
      var lbImage = document.getElementById('stcHistoryLightboxImage');
      var lbCaption = document.getElementById('stcHistoryLightboxCaption');
      var closeBtn = document.getElementById('stcHistoryLightboxClose');
      var prevBtn = document.getElementById('stcHistoryLightboxPrev');
      var nextBtn = document.getElementById('stcHistoryLightboxNext');
      var currentIndex = 0;
      var lastFocused = null;
      var TRANSITION_NAME = 'stc-history-gallery-transition';
      var canViewTransition = !reduceMotion && typeof document.startViewTransition === 'function';

      var setContent = function (index) {
        currentIndex = (index + images.length) % images.length;
        var img = images[currentIndex];
        lbImage.src = img.src;
        lbImage.alt = img.caption || '';
        lbCaption.textContent = img.caption || '';
      };

      var show = function (index) {
        if (canViewTransition && !lightbox.hidden) {
          document.startViewTransition(function () { setContent(index); });
        } else {
          setContent(index);
        }
      };

      var open = function (index, sourceImg) {
        lastFocused = document.activeElement;
        var mutate = function () {
          if (sourceImg) sourceImg.style.viewTransitionName = '';
          setContent(index);
          lightbox.hidden = false;
          lbImage.style.viewTransitionName = TRANSITION_NAME;
          document.body.style.overflow = 'hidden';
        };
        if (canViewTransition && sourceImg) {
          sourceImg.style.viewTransitionName = TRANSITION_NAME;
          document.startViewTransition(mutate);
        } else {
          mutate();
        }
        closeBtn.focus();
      };

      var close = function () {
        var targetItem = items[currentIndex];
        var targetImg = targetItem ? targetItem.querySelector('img') : null;
        var mutate = function () {
          lbImage.style.viewTransitionName = '';
          lightbox.hidden = true;
          document.body.style.overflow = '';
        };
        if (canViewTransition && targetImg && !targetItem.hidden) {
          targetImg.style.viewTransitionName = TRANSITION_NAME;
          document.startViewTransition(mutate).finished.finally(function () { targetImg.style.viewTransitionName = ''; });
        } else {
          mutate();
        }
        if (lastFocused) lastFocused.focus();
      };

      items.forEach(function (item) {
        item.addEventListener('click', function () {
          open(parseInt(item.dataset.index, 10) || 0, item.querySelector('img'));
        });
      });

      closeBtn.addEventListener('click', close);
      prevBtn.addEventListener('click', function () { show(currentIndex - 1); });
      nextBtn.addEventListener('click', function () { show(currentIndex + 1); });
      lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
      document.addEventListener('keydown', function (e) {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(currentIndex - 1);
        if (e.key === 'ArrowRight') show(currentIndex + 1);
      });
    }
  }

  /* ---- Then vs Now comparison slider ------------------------------------------ */
  var slider = document.getElementById('stcThenNowSlider');
  var range = document.getElementById('stcThenNowRange');
  if (slider && range) {
    var update = function () {
      slider.style.setProperty('--stc-slider-pos', range.value + '%');
    };
    range.addEventListener('input', update);
    update();
  }
})();
