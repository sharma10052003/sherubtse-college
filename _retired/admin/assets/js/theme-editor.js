/**
 * theme-editor.js — color-picker/hex sync, live swatch + sample-card
 * preview, and AJAX save for admin/sections/theme.php.
 */
(function () {
  'use strict';

  var form = document.getElementById('stcThemeForm');
  if (!form) return;

  var HEX_RE = /^#[0-9A-Fa-f]{6}$/;
  var SWATCH_KEYS = ['color_primary', 'color_secondary', 'color_accent', 'color_background', 'color_card', 'color_border'];

  /* ---- Keep each color <input type=color> in sync with its hex text field --- */
  form.querySelectorAll('[data-pair]').forEach(function (colorInput) {
    var key = colorInput.dataset.pair;
    var textInput = form.querySelector('[data-pair-text="' + key + '"]');

    colorInput.addEventListener('input', function () {
      textInput.value = colorInput.value;
      updatePreview();
    });
    textInput.addEventListener('input', function () {
      if (HEX_RE.test(textInput.value)) {
        colorInput.value = textInput.value;
        updatePreview();
      }
    });
  });

  function val(name) {
    var el = form.elements[name];
    return el ? el.value : '';
  }

  function updatePreview() {
    var swatchHost = document.getElementById('previewSwatches');
    swatchHost.innerHTML = '';
    SWATCH_KEYS.forEach(function (key) {
      var sw = document.createElement('span');
      sw.style.background = val(key);
      sw.title = key;
      swatchHost.appendChild(sw);
    });

    var card = document.getElementById('previewCard');
    var title = document.getElementById('previewCardTitle');
    var btn = document.getElementById('previewCardBtn');

    card.style.background = val('color_card');
    card.style.color = val('color_text');
    card.style.border = '1px solid ' + val('color_border');
    card.style.borderRadius = (val('radius_card') || 18) + 'px';
    title.style.color = val('color_primary');
    title.style.fontFamily = "'" + val('font_heading') + "', serif";
    card.style.fontFamily = "'" + val('font_body') + "', sans-serif";

    btn.style.background = val('color_accent');
    btn.style.color = val('color_button_text');
    btn.style.borderRadius = (val('radius_button') || 10) + 'px';

    var opacityOut = document.getElementById('overlayOpacityOut');
    if (opacityOut) opacityOut.textContent = val('hero_overlay_opacity');
  }

  form.addEventListener('input', updatePreview);
  updatePreview();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.stcAjaxSubmit(form, window.STC_THEME_SAVE_URL);
  });
})();
