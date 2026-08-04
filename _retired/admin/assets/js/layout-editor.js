/**
 * layout-editor.js — native HTML5 drag-and-drop reorder for the
 * Homepage Layout manager, plus AJAX save. No external library.
 */
(function () {
  'use strict';

  var form = document.getElementById('stcLayoutForm');
  var list = document.getElementById('stcLayoutList');
  if (!form || !list) return;

  var dragEl = null;

  list.querySelectorAll('.stc-layout-row').forEach(function (row) {
    row.addEventListener('dragstart', function () {
      dragEl = row;
      row.classList.add('is-dragging');
    });
    row.addEventListener('dragend', function () {
      row.classList.remove('is-dragging');
      list.querySelectorAll('.is-dragover').forEach(function (r) { r.classList.remove('is-dragover'); });
    });
    row.addEventListener('dragover', function (e) {
      e.preventDefault();
      if (row === dragEl) return;
      row.classList.add('is-dragover');
    });
    row.addEventListener('dragleave', function () {
      row.classList.remove('is-dragover');
    });
    row.addEventListener('drop', function (e) {
      e.preventDefault();
      row.classList.remove('is-dragover');
      if (!dragEl || row === dragEl) return;
      var rows = Array.from(list.children);
      var dragIndex = rows.indexOf(dragEl);
      var dropIndex = rows.indexOf(row);
      if (dragIndex < dropIndex) {
        row.after(dragEl);
      } else {
        row.before(dragEl);
      }
    });

    var toggle = row.querySelector('.stc-layout-row__toggle input');
    if (toggle) {
      var syncDisabledLook = function () { row.classList.toggle('is-section-disabled', !toggle.checked); };
      toggle.addEventListener('change', syncDisabledLook);
      syncDisabledLook();
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // Rebuild the order[] hidden inputs to match the current DOM order.
    Array.from(list.children).forEach(function (row) {
      var hidden = row.querySelector('input[name="order[]"]');
      if (hidden) hidden.value = row.dataset.id;
    });
    window.stcAjaxSubmit(form, window.STC_LAYOUT_SAVE_URL);
  });
})();
