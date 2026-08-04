<?php
/**
 * mobile-menu.php — slide-out mobile navigation panel.
 * Reuses $stc_nav / $stc_quick_links / $stc_social_links from config.php
 * so mobile and desktop menus can never drift out of sync.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}
?>
<div class="stc-mobile" id="stcMobileMenu" hidden>
  <div class="stc-mobile__scrim" id="stcMobileScrim" tabindex="-1"></div>
  <div class="stc-mobile__panel" role="dialog" aria-modal="true" aria-label="Site navigation">
    <div class="stc-mobile__header">
      <span class="stc-mobile__title">Menu</span>
      <button type="button" class="stc-mobile__close" id="stcMobileClose" aria-label="Close menu">
        <i class="bi bi-x-lg" aria-hidden="true"></i>
      </button>
    </div>

    <ul class="stc-mobile__list">
      <?php foreach ($stc_nav as $i => $item):
          $hasChildren = !empty($item['columns']);
          $panelId = 'stcMobilePanel' . $i;
      ?>
      <li class="stc-mobile__item">
        <?php if ($hasChildren): ?>
          <button type="button" class="stc-mobile__link stc-mobile__trigger" aria-expanded="false" aria-controls="<?php echo $panelId; ?>">
            <?php echo htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8'); ?>
            <i class="bi bi-plus stc-mobile__plus" aria-hidden="true"></i>
          </button>
          <div class="stc-mobile__submenu" id="<?php echo $panelId; ?>" hidden>
            <?php foreach ($item['columns'] as $col): ?>
              <p class="stc-mobile__subheading"><?php echo htmlspecialchars($col['heading'], ENT_QUOTES, 'UTF-8'); ?></p>
              <ul>
                <?php foreach ($col['links'] as $link): ?>
                  <li><a href="<?php echo htmlspecialchars($link['url'], ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($link['label'], ENT_QUOTES, 'UTF-8'); ?></a></li>
                <?php endforeach; ?>
              </ul>
            <?php endforeach; ?>
          </div>
        <?php else: ?>
          <a href="<?php echo htmlspecialchars($item['url'], ENT_QUOTES, 'UTF-8'); ?>" class="stc-mobile__link">
            <?php echo htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8'); ?>
          </a>
        <?php endif; ?>
      </li>
      <?php endforeach; ?>
    </ul>

    <div class="stc-mobile__quick">
      <p class="stc-mobile__subheading">Quick Links</p>
      <ul class="stc-mobile__quicklist">
        <?php foreach ($stc_quick_links as $q): ?>
          <li>
            <a href="<?php echo htmlspecialchars($q['url'], ENT_QUOTES, 'UTF-8'); ?>"
               <?php echo !empty($q['external']) ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>>
              <i class="bi <?php echo htmlspecialchars($q['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
              <?php echo htmlspecialchars($q['label'], ENT_QUOTES, 'UTF-8'); ?>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>

    <div class="stc-mobile__social">
      <?php foreach ($stc_social_links as $s): ?>
        <a href="<?php echo htmlspecialchars($s['url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo htmlspecialchars($s['label'], ENT_QUOTES, 'UTF-8'); ?>">
          <i class="bi <?php echo htmlspecialchars($s['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</div>
