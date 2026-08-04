/**
 * president-editor.js — live preview + photo preview + AJAX save for
 * admin/sections/president.php.
 */
(function () {
  'use strict';

  var form = document.getElementById('stcPresidentForm');
  if (!form) return;

  function updatePreview() {
    document.getElementById('presPreviewMessage').textContent = document.getElementById('presMessage').value || 'Your welcome message here';
    document.getElementById('presPreviewName').textContent = document.getElementById('presName').value;
    document.getElementById('presPreviewPosition').textContent = document.getElementById('presPosition').value || 'Position';
    document.getElementById('presPreviewBtn').textContent = document.getElementById('presButtonText').value || 'Button';
  }

  var photoInput = document.getElementById('presPhoto');
  if (photoInput) {
    photoInput.addEventListener('change', function () {
      var file = photoInput.files && photoInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        var host = document.getElementById('presPreviewPhoto');
        host.innerHTML = '<img src="' + e.target.result + '" alt="">';
      };
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener('input', updatePreview);
  updatePreview();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.stcAjaxSubmit(form, window.STC_PRESIDENT_SAVE_URL);
  });
})();
