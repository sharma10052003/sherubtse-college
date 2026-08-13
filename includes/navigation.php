<?php
/**
 * navigation.php — primary desktop navigation with mega menus.
 * Reads $stc_nav from config.php. To add/remove/reorder menu items,
 * edit that array only — this file never needs to change, with one
 * documented exception: a mega-menu column marked 'dynamic' => 'departments'
 * (see the Academics item in config.php) gets its links filled in here
 * from the real department list instead of a static array, so the menu
 * never goes stale when a department is renamed/added/removed.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

/**
 * Department names/slugs for the Academics mega menu, cached to a small
 * JSON file for 5 minutes so a Strapi lookup isn't added to every single
 * page load (this file is included by the header, i.e. every page).
 * Falls back to the last-known-good cache (even if stale) if Strapi is
 * unreachable, and to an empty column only if there's no cache at all —
 * never a fatal error, matching this project's resilience convention.
 * Deliberately only ever fetches {department_name, slug} — never the
 * `programmes` relation — so the header stays cheap.
 */
function stc_get_cached_nav_departments(): array
{
    $cacheFile = __DIR__ . '/cache/nav-departments.json';
    $ttl = 300;

    if (is_file($cacheFile) && (time() - filemtime($cacheFile)) < $ttl) {
        $cached = json_decode((string) file_get_contents($cacheFile), true);
        if (is_array($cached)) {
            return $cached;
        }
    }

    require_once __DIR__ . '/models/Department.php';
    $departments = stc_get_nav_departments();

    if ($departments) {
        $cacheDir = dirname($cacheFile);
        if (!is_dir($cacheDir)) {
            @mkdir($cacheDir, 0775, true);
        }
        @file_put_contents($cacheFile, json_encode($departments));
        return $departments;
    }

    if (is_file($cacheFile)) {
        $stale = json_decode((string) file_get_contents($cacheFile), true);
        if (is_array($stale)) {
            return $stale;
        }
    }

    return [];
}

foreach ($stc_nav as &$stc_nav_item) {
    if (empty($stc_nav_item['columns'])) {
        continue;
    }
    foreach ($stc_nav_item['columns'] as &$stc_nav_col) {
        if (($stc_nav_col['dynamic'] ?? '') === 'departments') {
            $stc_nav_col['links'] = array_map(static function (array $dept): array {
                return [
                    'label' => $dept['department_name'] ?? '',
                    'url'   => '/departments/' . rawurlencode($dept['slug'] ?? ''),
                    'icon'  => 'bi-building',
                ];
            }, stc_get_cached_nav_departments());
        }
    }
    unset($stc_nav_col);
}
unset($stc_nav_item);
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
