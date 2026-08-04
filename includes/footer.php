<?php
/**
 * footer.php — drop-in replacement for the site footer.
 * Requires config.php to already be included (same page load as
 * header.php). Does not close </body></html> — the page template does.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}
?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/footer.css">

<!-- ===================== Sherubtse College — Footer ===================== -->
<footer class="stc-footer">
  <!-- Ridgeline motif — a single restrained nod to Kanglung's hillside setting -->
  <div class="stc-footer__ridge" aria-hidden="true">
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" focusable="false">
      <path d="M0,60 L0,34 L120,18 L240,40 L360,10 L500,30 L620,4 L760,26 L900,12 L1040,36 L1180,16 L1320,32 L1440,20 L1440,60 Z"></path>
    </svg>
  </div>

  <div class="stc-footer__main">
    <div class="stc-footer__inner stc-footer__grid">
      <!-- Column 1: About -->
      <div class="stc-footer__col stc-footer__col--about">
        <a href="<?php echo BASE_URL; ?>" class="stc-footer__brand">
          <img src="<?php echo htmlspecialchars($stc_brand['logo'], ENT_QUOTES, 'UTF-8'); ?>" alt="" width="40" height="40">
          <span><?php echo htmlspecialchars($stc_brand['name'], ENT_QUOTES, 'UTF-8'); ?></span>
        </a>
        <p class="stc-footer__desc"><?php echo htmlspecialchars($stc_footer['about'], ENT_QUOTES, 'UTF-8'); ?></p>
        <p class="stc-footer__motto"><?php echo htmlspecialchars($stc_footer['motto'], ENT_QUOTES, 'UTF-8'); ?></p>
        <div class="stc-footer__social">
          <?php foreach ($stc_social_links as $s): ?>
            <a href="<?php echo htmlspecialchars($s['url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo htmlspecialchars($s['label'], ENT_QUOTES, 'UTF-8'); ?>">
              <i class="bi <?php echo htmlspecialchars($s['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
            </a>
          <?php endforeach; ?>
        </div>
      </div>

      <!-- Columns 2 & 3: link groups from config -->
      <?php foreach ($stc_footer['columns'] as $col): ?>
        <div class="stc-footer__col">
          <h3 class="stc-footer__heading"><?php echo htmlspecialchars($col['heading'], ENT_QUOTES, 'UTF-8'); ?></h3>
          <ul class="stc-footer__links">
            <?php foreach ($col['links'] as $link): ?>
              <li>
                <a href="<?php echo htmlspecialchars($link['url'], ENT_QUOTES, 'UTF-8'); ?>"
                   <?php echo !empty($link['external']) ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>>
                  <?php echo htmlspecialchars($link['label'], ENT_QUOTES, 'UTF-8'); ?>
                </a>
              </li>
            <?php endforeach; ?>
          </ul>
        </div>
      <?php endforeach; ?>

      <!-- Column 4: Contact -->
      <div class="stc-footer__col">
        <h3 class="stc-footer__heading">Contact</h3>
        <ul class="stc-footer__contact">
          <li><i class="bi bi-geo-alt" aria-hidden="true"></i><span><?php echo htmlspecialchars($stc_footer['contact']['address'], ENT_QUOTES, 'UTF-8'); ?></span></li>
          <li><i class="bi bi-telephone" aria-hidden="true"></i><a href="tel:<?php echo htmlspecialchars($stc_footer['contact']['phone'], ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($stc_footer['contact']['phone'], ENT_QUOTES, 'UTF-8'); ?></a></li>
          <li><i class="bi bi-envelope" aria-hidden="true"></i><a href="mailto:<?php echo htmlspecialchars($stc_footer['contact']['email'], ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($stc_footer['contact']['email'], ENT_QUOTES, 'UTF-8'); ?></a></li>
        </ul>
        <a class="stc-footer__map-link" href="<?php echo htmlspecialchars($stc_footer['contact']['map_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-map" aria-hidden="true"></i> View on Google Maps
        </a>
      </div>
    </div>
  </div>

  <div class="stc-footer__bottom">
    <div class="stc-footer__inner stc-footer__bottom-inner">
      <p class="stc-footer__copyright">
        &copy; <?php echo date('Y'); ?> <?php echo htmlspecialchars($stc_brand['name'], ENT_QUOTES, 'UTF-8'); ?>. All rights reserved.
      </p>
      <ul class="stc-footer__legal">
        <?php foreach ($stc_footer['bottom_links'] as $link): ?>
          <li><a href="<?php echo htmlspecialchars($link['url'], ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($link['label'], ENT_QUOTES, 'UTF-8'); ?></a></li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>

  <button type="button" class="stc-back-to-top" id="stcBackToTop" aria-label="Back to top" hidden>
    <i class="bi bi-arrow-up" aria-hidden="true"></i>
  </button>
</footer>
<!-- =================== /Sherubtse College — Footer ==================== -->
