<?php
/**
 * header.php — drop-in replacement for the site header.
 * -----------------------------------------------------------------------
 * REQUIRES config.php to have been included first (it defines
 * SHERUBTSE_INIT plus the $stc_brand / $stc_nav / etc. arrays used
 * below). Include it exactly like the old header:
 *
 *     require_once __DIR__ . '/includes/config.php';
 *     include __DIR__ . '/includes/header.php';
 *
 * This file does NOT open <html>/<body> — it assumes the page's
 * existing template already does that, exactly as the previous
 * header.php did. Only the header markup, and this component's own
 * CSS/JS, are added.
 * -----------------------------------------------------------------------
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}  
?>
<!-- ===================== Sherubtse College — Header ===================== -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<link rel="stylesheet" href="<?php echo stc_asset('assets/css/variables.css'); ?>">
<link rel="stylesheet" href="<?php echo stc_asset('assets/css/navigation.css'); ?>">
<link rel="stylesheet" href="<?php echo stc_asset('assets/css/header.css'); ?>">

<a class="stc-skip-link" href="#main-content">Skip to main content</a>

<?php include __DIR__ . '/announcement.php'; ?>

<header class="stc-header" id="stcHeader" data-shrink="false">
  <!-- Utility top bar -->
  <div class="stc-topbar">
    <div class="stc-topbar__inner">
      <div class="stc-topbar__affiliation">
        <i class="bi bi-shield-check" aria-hidden="true"></i>
        <span><?php echo htmlspecialchars($stc_brand['affiliation'], ENT_QUOTES, 'UTF-8'); ?></span>
      </div>
      <ul class="stc-topbar__links">
        <?php foreach ($stc_quick_links as $link): ?>
          <li>
            <a href="<?php echo htmlspecialchars($link['url'], ENT_QUOTES, 'UTF-8'); ?>"
               <?php echo !empty($link['external']) ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>>
              <i class="bi <?php echo htmlspecialchars($link['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
              <?php echo htmlspecialchars($link['label'], ENT_QUOTES, 'UTF-8'); ?>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
      <ul class="stc-topbar__social">
        <?php foreach ($stc_social_links as $s): ?>
          <li>
            <a href="<?php echo htmlspecialchars($s['url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo htmlspecialchars($s['label'], ENT_QUOTES, 'UTF-8'); ?>">
              <i class="bi <?php echo htmlspecialchars($s['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>

  <!-- Scroll progress bar -->
  <div class="stc-progress" id="stcProgress" aria-hidden="true"></div>

  <!-- Main header row -->
  <div class="stc-header__main">
    <div class="stc-header__inner">
      <a href="<?php echo BASE_URL; ?>" class="stc-brand" aria-label="<?php echo htmlspecialchars($stc_brand['name'], ENT_QUOTES, 'UTF-8'); ?> — home">
        <img src="<?php echo htmlspecialchars($stc_brand['logo'], ENT_QUOTES, 'UTF-8'); ?>"
             alt="<?php echo htmlspecialchars($stc_brand['logo_alt'], ENT_QUOTES, 'UTF-8'); ?>" class="stc-brand__logo" width="48" height="48">
        <span class="stc-brand__text">
          <span class="stc-brand__name"><?php echo htmlspecialchars($stc_brand['name'], ENT_QUOTES, 'UTF-8'); ?></span>
          <span class="stc-brand__tagline"><?php echo htmlspecialchars($stc_brand['tagline'], ENT_QUOTES, 'UTF-8'); ?></span>
        </span>
      </a>

      <?php include __DIR__ . '/navigation.php'; ?>

      <div class="stc-header__actions">
        <button type="button" class="stc-icon-btn" id="stcSearchToggle" aria-haspopup="dialog" aria-controls="stcSearchOverlay" aria-label="Open search">
          <i class="bi bi-search" aria-hidden="true"></i>
        </button>
        <button type="button" class="stc-icon-btn stc-header__menu-btn" id="stcMobileToggle" aria-haspopup="dialog" aria-controls="stcMobileMenu" aria-expanded="false" aria-label="Open menu">
          <i class="bi bi-list" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</header>

<?php include __DIR__ . '/search.php'; ?>
<?php include __DIR__ . '/mobile-menu.php'; ?>

<!-- Spacer matched to header height so sticky positioning doesn't jump page content -->
<div class="stc-header-spacer" aria-hidden="true"></div>

<script src="<?php echo stc_asset('assets/js/header.js'); ?>" defer></script>
<script src="<?php echo stc_asset('assets/js/navigation.js'); ?>" defer></script>
<script src="<?php echo stc_asset('assets/js/mobile-menu.js'); ?>" defer></script>
<script src="<?php echo stc_asset('assets/js/search.js'); ?>" defer></script>
<!-- =================== /Sherubtse College — Header ==================== -->
