<?php
/**
 * search.php — animated full-screen search overlay.
 * Markup only; existing site search backend/endpoint is untouched —
 * this form posts to the same action the current site already uses.
 * Update SEARCH_ACTION below to match the existing search handler.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}
$stc_search_action = defined('SEARCH_ACTION') ? SEARCH_ACTION : '/search.php';
?>
<div class="stc-search-overlay" id="stcSearchOverlay" hidden>
  <div class="stc-search-overlay__panel" role="dialog" aria-modal="true" aria-label="Site search">
    <form class="stc-search-overlay__form" action="<?php echo htmlspecialchars($stc_search_action, ENT_QUOTES, 'UTF-8'); ?>" method="get" role="search">
      <i class="bi bi-search stc-search-overlay__icon" aria-hidden="true"></i>
      <label for="stcSearchInput" class="visually-hidden">Search the Sherubtse College website</label>
      <input type="search" name="q" id="stcSearchInput" class="stc-search-overlay__input"
             placeholder="Search programmes, news, people…" autocomplete="off">
      <button type="button" class="stc-search-overlay__close" id="stcSearchClose" aria-label="Close search">
        <i class="bi bi-x-lg" aria-hidden="true"></i>
      </button>
    </form>
    <p class="stc-search-overlay__hint">Press <kbd>Esc</kbd> to close</p>
  </div>
</div>
