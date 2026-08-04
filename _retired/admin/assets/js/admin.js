/**
 * admin.js — shared admin-panel behaviour: toasts, mobile sidebar,
 * and a small fetch helper used by each section's own page script.
 */
(function () {
  'use strict';

  var toastHost = document.getElementById('stcToasts');

  window.stcToast = function (message, type) {
    if (!toastHost) return;
    var el = document.createElement('div');
    el.className = 'stc-admin-toast' + (type ? ' stc-admin-toast--' + type : '');
    el.setAttribute('role', 'status');
    var icon = type === 'error' ? 'bi-x-circle-fill' : (type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill');
    el.innerHTML = '<i class="bi ' + icon + '" aria-hidden="true"></i><span></span>';
    el.querySelector('span').textContent = message;
    toastHost.appendChild(el);
    window.setTimeout(function () {
      el.style.transition = 'opacity 200ms ease';
      el.style.opacity = '0';
      window.setTimeout(function () { el.remove(); }, 220);
    }, 4200);
  };

  /**
   * Submits a <form> as FormData via fetch, toggling a submit button's
   * disabled/label state and reporting the JSON {ok, message} response
   * as a toast. Used by every section's editor page.
   */
  window.stcAjaxSubmit = function (form, url, onSuccess) {
    var submitBtn = form.querySelector('[type="submit"]');
    var originalLabel = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-arrow-repeat" aria-hidden="true"></i> Saving…';
    }

    fetch(url, { method: 'POST', body: new FormData(form), credentials: 'same-origin' })
      .then(function (res) { return res.json().catch(function () { throw new Error('Unexpected server response.'); }); })
      .then(function (data) {
        if (data.ok) {
          window.stcToast(data.message || 'Saved.', 'success');
          if (typeof onSuccess === 'function') onSuccess(data);
        } else {
          window.stcToast(data.message || 'Could not save. Please try again.', 'error');
        }
      })
      .catch(function () {
        window.stcToast('Network error — please check your connection and try again.', 'error');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalLabel;
        }
      });
  };

  /* ---- Mobile sidebar toggle ---------------------------------------------- */
  var toggle = document.getElementById('stcSidebarToggle');
  var sidebar = document.getElementById('stcAdminSidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      var open = sidebar.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();
