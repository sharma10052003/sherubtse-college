<?php
/**
 * navigation.php — primary desktop navigation with mega menus.
 * Reads $stc_nav from config.php. To add/remove/reorder menu items,
 * edit that array only — this file never needs to change.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}
?>
<nav class="stc-nav" aria-label="Primary">
  <ul class="stc-nav__list" id="stcNavList">
    <?php foreach ($stc_nav as $i => $item):
        $hasChildren = !empty($item['columns']);
        $menuId = 'stcMega' . $i;
    ?>
    <li class="stc-nav__item<?php echo $hasChildren ? ' stc-nav__item--has-menu' : ''; ?>">
      <?php if ($hasChildren): ?>
        <button type="button"
                class="stc-nav__link stc-nav__trigger"
                aria-expanded="false"
                aria-controls="<?php echo $menuId; ?>">
          <?php echo htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8'); ?>
          <i class="bi bi-chevron-down stc-nav__chevron" aria-hidden="true"></i>
        </button>
        <div class="stc-mega" id="<?php echo $menuId; ?>" role="region"
             aria-label="<?php echo htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8'); ?> menu">
          <div class="stc-mega__inner">
            <?php foreach ($item['columns'] as $col): ?>
              <div class="stc-mega__col">
                <p class="stc-mega__heading"><?php echo htmlspecialchars($col['heading'], ENT_QUOTES, 'UTF-8'); ?></p>
                <ul class="stc-mega__links">
                  <?php foreach ($col['links'] as $link): ?>
                    <li>
                      <a href="<?php echo htmlspecialchars($link['url'], ENT_QUOTES, 'UTF-8'); ?>" class="stc-mega__link">
                        <?php if (!empty($link['icon'])): ?>
                          <i class="bi <?php echo htmlspecialchars($link['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
                        <?php endif; ?>
                        <span><?php echo htmlspecialchars($link['label'], ENT_QUOTES, 'UTF-8'); ?></span>
                      </a>
                    </li>
                  <?php endforeach; ?>
                </ul>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      <?php else: ?>
        <a href="<?php echo htmlspecialchars($item['url'], ENT_QUOTES, 'UTF-8'); ?>" class="stc-nav__link">
          <?php echo htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8'); ?>
        </a>
      <?php endif; ?>
    </li>
    <?php endforeach; ?>
  </ul>
</nav>
