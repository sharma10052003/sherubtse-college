/**
 * hero-editor.js — repeater rows, live preview, and AJAX save for
 * admin/sections/hero.php. Depends on admin.js (stcAjaxSubmit/stcToast).
 */
(function () {
  'use strict';

  var form = document.getElementById('stcHeroForm');
  if (!form) return;

  /* ---- Repeaters (stats / badges) ---------------------------------------- */
  function wireRepeater(containerId, addBtnId, templateId) {
    var container = document.getElementById(containerId);
    var addBtn = document.getElementById(addBtnId);
    var template = document.getElementById(templateId);

    container.addEventListener('click', function (e) {
      var removeBtn = e.target.closest('.stc-admin-repeater__remove');
      if (removeBtn) {
        removeBtn.closest('[data-row]').remove();
        updatePreview();
      }
    });

    addBtn.addEventListener('click', function () {
      container.appendChild(template.content.cloneNode(true));
      updatePreview();
    });

    container.addEventListener('input', updatePreview);
  }

  /* ---- Live preview -------------------------------------------------------- */
  var previewBg = document.getElementById('previewBg');
  var previewOverlay = document.getElementById('previewOverlay');
  var previewRoot = document.getElementById('heroPreview');
  var mediaField = document.getElementById('mediaField');
  var bgTypeSelect = document.getElementById('bgType');
  var mediaInput = document.getElementById('heroMedia');
  var overlayOpacityInput = document.getElementById('overlayOpacity');
  var overlayOpacityValue = document.getElementById('overlayOpacityValue');
  var overlayStyleSelect = document.getElementById('overlayStyle');

  function updateMediaFieldVisibility() {
    var type = bgTypeSelect.value;
    mediaField.hidden = (type === 'gradient');
    if (mediaInput) mediaInput.accept = type === 'video' ? 'video/mp4' : 'image/jpeg,image/png,image/webp';
  }

  function updatePreview() {
    document.getElementById('previewTitle').textContent = document.getElementById('heroTitle').value || 'Your headline here';
    document.getElementById('previewSubtitle').textContent = document.getElementById('heroSubtitle').value || '';
    document.getElementById('previewCta1').textContent = document.getElementById('cta1Text').value || 'Primary button';
    document.getElementById('previewCta2').textContent = document.getElementById('cta2Text').value || 'Secondary button';

    overlayOpacityValue.textContent = overlayOpacityInput.value;
    previewOverlay.style.opacity = (parseInt(overlayOpacityInput.value, 10) / 100).toFixed(2);

    previewRoot.classList.toggle('is-light', overlayStyleSelect.value === 'light');
    previewOverlay.style.background = overlayStyleSelect.value === 'dark' ? 'rgba(10,10,10,0.7)'
      : overlayStyleSelect.value === 'light' ? 'rgba(255,255,255,0.55)'
      : 'rgba(34,26,23,0.6)';

    var badgesHost = document.getElementById('previewBadges');
    badgesHost.innerHTML = '';
    document.querySelectorAll('#badgesRepeater [data-row]').forEach(function (row) {
      var label = row.querySelector('[name="badges_label[]"]').value;
      var icon = row.querySelector('[name="badges_icon[]"]').value || 'bi-star-fill';
      if (!label) return;
      var span = document.createElement('span');
      span.innerHTML = '<i class="bi ' + icon.replace(/[^a-z0-9-]/gi, '') + '" aria-hidden="true"></i>';
      span.appendChild(document.createTextNode(label));
      badgesHost.appendChild(span);
    });

    var statsHost = document.getElementById('previewStats');
    statsHost.innerHTML = '';
    document.querySelectorAll('#statsRepeater [data-row]').forEach(function (row) {
      var value = row.querySelector('[name="stats_value[]"]').value || '0';
      var suffix = row.querySelector('[name="stats_suffix[]"]').value || '';
      var label = row.querySelector('[name="stats_label[]"]').value;
      if (!label) return;
      var div = document.createElement('div');
      div.innerHTML = '<strong>' + value + suffix + '</strong>' + label;
      statsHost.appendChild(div);
    });
  }

  bgTypeSelect.addEventListener('change', function () {
    updateMediaFieldVisibility();
    if (bgTypeSelect.value === 'gradient') {
      previewBg.classList.remove('has-image');
      previewBg.style.removeProperty('--preview-img');
    }
  });

  if (mediaInput) {
    mediaInput.addEventListener('change', function () {
      var file = mediaInput.files && mediaInput.files[0];
      if (!file || bgTypeSelect.value !== 'image') return;
      var reader = new FileReader();
      reader.onload = function (e) {
        previewBg.classList.add('has-image');
        previewBg.style.setProperty('--preview-img', 'url(' + e.target.result + ')');
      };
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener('input', updatePreview);

  wireRepeater('statsRepeater', 'addStat', 'statRowTemplate');
  wireRepeater('badgesRepeater', 'addBadge', 'badgeRowTemplate');

  updateMediaFieldVisibility();
  updatePreview();

  /* ---- Save --------------------------------------------------------------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.stcAjaxSubmit(form, window.STC_HERO_SAVE_URL);
  });
})();
