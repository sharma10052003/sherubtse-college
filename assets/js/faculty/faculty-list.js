/**
 * faculty-list.js — directory page: reveal-on-scroll, stat counters,
 * and AJAX search/filter against ajax/faculty-list.php. No dependencies,
 * matches the reveal/counter conventions used elsewhere on the site
 * (see assets/js/homepage/hero.js, assets/js/pages/history.js).
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.STC_ANIMATIONS_ENABLED === false;

  /* ---- Reveal-on-scroll --------------------------------------------------- */
  var revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-variant]');
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

  /* ---- Animated stat counters --------------------------------------------- */
  var counters = document.querySelectorAll('.stc-counter');
  if (counters.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) { el.textContent = el.dataset.target; });
    } else {
      var runCounter = function (el) {
        var target = parseInt(el.dataset.target, 10) || 0;
        var duration = 1400;
        var start = null;
        function step(ts) {
          if (start === null) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(step);
      };
      var counterObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  /* ---- AJAX search & filter ------------------------------------------------ */
  var grid = document.getElementById('stcFacultyGrid');
  var skeleton = document.getElementById('stcFacultySkeleton');
  var emptyState = document.getElementById('stcFacultyEmptyState');
  var resultsCount = document.getElementById('stcFacultyResultsCount');
  var searchInput = document.getElementById('stcFacultySearch');
  var departmentSelect = document.getElementById('stcFacultyDepartment');
  var positionSelect = document.getElementById('stcFacultyPosition');
  var qualificationSelect = document.getElementById('stcFacultyQualification');
  var researchAreaSelect = document.getElementById('stcFacultyResearchArea');

  if (!grid || !window.STC_FACULTY_AJAX_URL) return;

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function renderCard(f) {
    var profileUrl = window.STC_FACULTY_PROFILE_BASE + encodeURIComponent(f.slug);
    var media = f.profile_picture_url
      ? '<img src="' + escapeHtml(f.profile_picture_url) + '" alt="' + escapeHtml(f.full_name) + '" loading="lazy">'
      : '<div class="stc-faculty-card__placeholder"><i class="bi bi-person-fill" aria-hidden="true"></i></div>';
    var department = f.department ? '<p class="stc-faculty-card__department"><i class="bi bi-building" aria-hidden="true"></i> ' + escapeHtml(f.department) + '</p>' : '';
    var qualification = f.highest_qualification ? '<p class="stc-faculty-card__qualification"><i class="bi bi-mortarboard" aria-hidden="true"></i> ' + escapeHtml(f.highest_qualification) + '</p>' : '';
    var tags = (f.research_areas || []).slice(0, 3).map(function (t) {
      return '<span class="stc-faculty-card__tag">' + escapeHtml(t) + '</span>';
    }).join('');
    var email = f.college_email ? '<a href="mailto:' + escapeHtml(f.college_email) + '" aria-label="Email ' + escapeHtml(f.full_name) + '"><i class="bi bi-envelope-fill" aria-hidden="true"></i></a>' : '';
    var linkedin = f.linkedin_url ? '<a href="' + escapeHtml(f.linkedin_url) + '" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="bi bi-linkedin" aria-hidden="true"></i></a>' : '';
    var scholar = f.google_scholar_url ? '<a href="' + escapeHtml(f.google_scholar_url) + '" target="_blank" rel="noopener" aria-label="Google Scholar"><i class="bi bi-mortarboard-fill" aria-hidden="true"></i></a>' : '';

    return (
      '<article class="stc-faculty-card is-visible">' +
        '<a href="' + escapeHtml(profileUrl) + '" class="stc-faculty-card__media">' + media + '</a>' +
        '<div class="stc-faculty-card__body">' +
          '<h3 class="stc-faculty-card__name"><a href="' + escapeHtml(profileUrl) + '">' + escapeHtml(f.full_name) + '</a></h3>' +
          '<p class="stc-faculty-card__position">' + escapeHtml(f.position) + '</p>' +
          department + qualification +
          (tags ? '<div class="stc-faculty-card__tags">' + tags + '</div>' : '') +
          '<div class="stc-faculty-card__footer">' +
            '<div class="stc-faculty-card__social">' + email + linkedin + scholar + '</div>' +
            '<a href="' + escapeHtml(profileUrl) + '" class="stc-faculty-card__btn">View Profile <i class="bi bi-arrow-right" aria-hidden="true"></i></a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  var debounceTimer = null;
  function fetchFaculty() {
    var params = new URLSearchParams({
      q: searchInput ? searchInput.value.trim() : '',
      department: departmentSelect ? departmentSelect.value : '',
      position: positionSelect ? positionSelect.value : '',
      qualification: qualificationSelect ? qualificationSelect.value : '',
      research_area: researchAreaSelect ? researchAreaSelect.value : '',
    });

    if (skeleton) skeleton.hidden = false;
    grid.hidden = true;
    if (emptyState) emptyState.hidden = true;

    fetch(window.STC_FACULTY_AJAX_URL + '?' + params.toString(), { headers: { 'Accept': 'application/json' } })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        var rows = json.data || [];
        grid.innerHTML = rows.map(renderCard).join('');
        if (resultsCount) {
          resultsCount.textContent = rows.length + ' faculty member' + (rows.length === 1 ? '' : 's') + ' found';
        }
        if (emptyState) emptyState.hidden = rows.length !== 0;
      })
      .catch(function () {
        if (resultsCount) resultsCount.textContent = 'Could not load faculty right now — please try again.';
      })
      .finally(function () {
        if (skeleton) skeleton.hidden = true;
        grid.hidden = false;
      });
  }

  [searchInput, departmentSelect, positionSelect, qualificationSelect, researchAreaSelect].forEach(function (el) {
    if (!el) return;
    var evt = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evt, function () {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(fetchFaculty, 300);
    });
  });

  /* ---- Dynamic department-themed background ------------------------------- */
  var article = document.getElementById('stcFacultyArticle');
  var bgLayers = {
    '': 'default',
    'humanities-social-sciences': 'gradient',
    'mathematical-data-sciences': 'tri',
    'natural-sciences': 'particles',
  };

  function updateBackgroundEffect(deptSlug) {
    if (!article) return;
    var layerName = bgLayers[deptSlug] || 'default';
    article.setAttribute('data-dept', deptSlug || '');
    document.querySelectorAll('.stc-faculty-bgfx__layer').forEach(function (layer) {
      var isMatch = layer.classList.contains('stc-faculty-bgfx__layer--' + layerName);
      layer.classList.toggle('is-active', isMatch);
    });
  }

  if (departmentSelect) {
    departmentSelect.addEventListener('change', function () {
      updateBackgroundEffect(departmentSelect.value);
    });
    updateBackgroundEffect(departmentSelect.value);
  }
})();
