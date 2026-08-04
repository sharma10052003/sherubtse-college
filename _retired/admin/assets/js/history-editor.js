/**
 * history-editor.js — three repeaters (timeline, legacy, traditions),
 * a light live preview, and AJAX save for admin/sections/history.php.
 * Depends on admin.js (stcAjaxSubmit/stcToast).
 */
(function () {
  'use strict';

  var form = document.getElementById('stcHistoryForm');
  if (!form) return;

  function wireRepeater(containerId, addBtnId, templateId) {
    var container = document.getElementById(containerId);
    var addBtn = document.getElementById(addBtnId);
    var template = document.getElementById(templateId);
    if (!container || !addBtn || !template) return;

    container.addEventListener('click', function (e) {
      var removeBtn = e.target.closest('.stc-admin-repeater__remove');
      if (removeBtn) removeBtn.closest('[data-row]').remove();
    });

    addBtn.addEventListener('click', function () {
      container.appendChild(template.content.cloneNode(true));
    });
  }

  wireRepeater('timelineRepeater', 'addTimeline', 'timelineRowTemplate');
  wireRepeater('legacyRepeater', 'addLegacy', 'legacyRowTemplate');
  wireRepeater('traditionsRepeater', 'addTradition', 'traditionRowTemplate');

  function updatePreview() {
    document.getElementById('histPreviewTitle').textContent = document.getElementById('histHeroTitle').value || 'Title';
    document.getElementById('histPreviewSubtitle').textContent = document.getElementById('histHeroSubtitle').value;
    document.getElementById('histPreviewIntro').textContent = document.getElementById('histHeroIntro').value;
    document.getElementById('histPreviewMotto').textContent = '“' + (document.getElementById('histMotto').value || '') + '”';
  }
  form.addEventListener('input', updatePreview);
  updatePreview();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.stcAjaxSubmit(form, window.STC_HISTORY_SAVE_URL);
  });
})();
