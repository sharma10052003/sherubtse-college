/**
 * programmes-list.js — catalogue page: reveal-on-scroll and AJAX
 * search/filter against ajax/programmes-list.php. Directly modeled on
 * assets/js/faculty/faculty-list.js. No dependencies.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.STC_ANIMATIONS_ENABLED === false;

  function observeReveal(targets) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(function (el) { observer.observe(el); });
  }
  observeReveal(document.querySelectorAll('[data-reveal]'));

  var grid = document.getElementById('stcProgrammeGrid');
  var skeleton = document.getElementById('stcProgrammeSkeleton');
  var emptyState = document.getElementById('stcProgrammeEmptyState');
  var resultsCount = document.getElementById('stcProgrammeResultsCount');
  var searchInput = document.getElementById('stcProgrammeSearch');
  var departmentSelect = document.getElementById('stcProgrammeDepartment');
  var levelSelect = document.getElementById('stcProgrammeLevel');

  if (!grid || !window.STC_PROGRAMMES_AJAX_URL) return;

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function renderCard(p) {
    var url = window.STC_PROGRAMME_DETAIL_BASE + encodeURIComponent(p.slug);
    var media = p.hero_image_url
      ? '<img src="' + escapeHtml(p.hero_image_url) + '" alt="' + escapeHtml(p.programme_name) + '" loading="lazy">'
      : '<div class="stc-faculty-card__placeholder"><i class="bi bi-mortarboard-fill" aria-hidden="true"></i></div>';
    var level = p.level ? '<span class="inline-block text-xs font-semibold uppercase tracking-wide text-gold mb-1">' + escapeHtml(p.level.charAt(0).toUpperCase() + p.level.slice(1)) + '</span>' : '';
    var department = p.department ? '<p class="stc-faculty-card__department"><i class="bi bi-building" aria-hidden="true"></i> ' + escapeHtml(p.department) + '</p>' : '';
    var duration = p.duration ? '<p class="stc-faculty-card__qualification"><i class="bi bi-clock-history" aria-hidden="true"></i> ' + escapeHtml(p.duration) + '</p>' : '';
    var desc = p.short_description ? '<p class="text-ink-soft text-sm mt-2 line-clamp-2">' + escapeHtml(p.short_description) + '</p>' : '';

    return (
      '<article class="stc-faculty-card is-visible">' +
        '<a href="' + escapeHtml(url) + '" class="stc-faculty-card__media">' + media + '</a>' +
        '<div class="stc-faculty-card__body">' +
          level +
          '<h3 class="stc-faculty-card__name"><a href="' + escapeHtml(url) + '">' + escapeHtml(p.programme_name) + '</a></h3>' +
          department + duration + desc +
          '<div class="stc-faculty-card__footer">' +
            '<a href="' + escapeHtml(url) + '" class="stc-faculty-card__btn">View Programme <i class="bi bi-arrow-right" aria-hidden="true"></i></a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  var debounceTimer = null;
  function fetchProgrammes() {
    var params = new URLSearchParams({
      q: searchInput ? searchInput.value.trim() : '',
      department: departmentSelect ? departmentSelect.value : '',
      level: levelSelect ? levelSelect.value : '',
    });

    if (skeleton) skeleton.hidden = false;
    grid.hidden = true;
    if (emptyState) emptyState.hidden = true;

    fetch(window.STC_PROGRAMMES_AJAX_URL + '?' + params.toString(), { headers: { 'Accept': 'application/json' } })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        var programmes = json.programmes || [];
        var total = json.total || 0;

        grid.innerHTML = programmes.map(renderCard).join('');

        if (resultsCount) {
          resultsCount.textContent = total + ' programme' + (total === 1 ? '' : 's') + ' found';
        }
        if (emptyState) emptyState.hidden = total !== 0;
      })
      .catch(function () {
        if (resultsCount) resultsCount.textContent = 'Could not load programmes right now — please try again.';
      })
      .finally(function () {
        if (skeleton) skeleton.hidden = true;
        grid.hidden = false;
      });
  }

  [searchInput, departmentSelect, levelSelect].forEach(function (el) {
    if (!el) return;
    var evt = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evt, function () {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(fetchProgrammes, 300);
    });
  });
})();
