/**
 * gallery-editor.js — repeater rows, per-row image preview, live
 * preview grid, and AJAX save for admin/sections/gallery.php.
 * Depends on admin.js (stcAjaxSubmit/stcToast).
 */
(function () {
  'use strict';

  var form = document.getElementById('stcGalleryForm');
  if (!form) return;

  var container = document.getElementById('imagesRepeater');
  var addBtn = document.getElementById('addImage');
  var template = document.getElementById('imageRowTemplate');

  function wireRow(row) {
    var fileInput = row.querySelector('[data-file-input]');
    var thumb = row.querySelector('[data-thumb]');
    if (!fileInput) return;
    fileInput.addEventListener('change', function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        thumb.src = e.target.result;
        thumb.hidden = false;
        updatePreview();
      };
      reader.readAsDataURL(file);
    });
  }

  container.querySelectorAll('[data-row]').forEach(wireRow);

  container.addEventListener('click', function (e) {
    var removeBtn = e.target.closest('.stc-admin-repeater__remove');
    if (removeBtn) {
      removeBtn.closest('[data-row]').remove();
      updatePreview();
    }
  });

  addBtn.addEventListener('click', function () {
    var frag = template.content.cloneNode(true);
    container.appendChild(frag);
    var row = container.lastElementChild;
    wireRow(row);
    updatePreview();
  });

  container.addEventListener('input', updatePreview);
  container.addEventListener('change', updatePreview);

  function updatePreview() {
    var host = document.getElementById('galPreviewGrid');
    host.innerHTML = '';
    container.querySelectorAll('[data-row]').forEach(function (row) {
      var thumb = row.querySelector('[data-thumb]');
      if (thumb && !thumb.hidden && thumb.src) {
        var img = document.createElement('img');
        img.src = thumb.src;
        host.appendChild(img);
      } else {
        var tile = document.createElement('div');
        tile.className = 'stc-gallery-editor__empty-tile';
        tile.innerHTML = '<i class="bi bi-image"></i>';
        host.appendChild(tile);
      }
    });
  }

  updatePreview();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.stcAjaxSubmit(form, window.STC_GALLERY_SAVE_URL);
  });
})();
