<?php
/**
 * admin/index.php — dashboard shell listing all 13 homepage sections
 * (plus Hero). Only Hero, President's Welcome, Image Gallery, Homepage
 * Layout and Design & Theme are wired up so far; the rest show as
 * "Coming soon" so the full navigation structure is visible from day
 * one without faking functionality.
 */
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/includes/auth.php';

$pageTitle = 'Dashboard';
$activeSection = '';
require __DIR__ . '/includes/layout-head.php';

$liveCount = 0;
foreach (array_merge($stc_admin_nav['sections'], $stc_admin_nav['pages'], $stc_admin_nav['settings']) as $item) {
    if ($item['live']) $liveCount++;
}
$totalCount = count($stc_admin_nav['sections']) + count($stc_admin_nav['pages']) + count($stc_admin_nav['settings']);
?>

<p class="stc-admin-lede">
  <?php echo $liveCount; ?> of <?php echo $totalCount; ?> homepage modules are live.
  Each new module is built the same way — database table, this dashboard,
  an editor page here, and an AJAX save endpoint — so nothing below ever
  needs a code change to update.
</p>

<div class="stc-admin-cards">
  <?php foreach ($stc_admin_nav['sections'] as $item): ?>
    <a class="stc-admin-card <?php echo !$item['live'] ? 'is-disabled' : ''; ?>"
       href="<?php echo $item['live'] ? htmlspecialchars(BASE_URL . 'admin/' . $item['href'], ENT_QUOTES, 'UTF-8') : '#'; ?>"
       <?php echo !$item['live'] ? 'aria-disabled="true" tabindex="-1"' : ''; ?>>
      <i class="bi <?php echo htmlspecialchars($item['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
      <span class="stc-admin-card__label"><?php echo htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8'); ?></span>
      <span class="stc-admin-card__status <?php echo $item['live'] ? 'is-live' : ''; ?>">
        <?php echo $item['live'] ? 'Live' : 'Coming soon'; ?>
      </span>
    </a>
  <?php endforeach; ?>
</div>

<h2 class="stc-admin-subheading">Pages</h2>
<div class="stc-admin-cards">
  <?php foreach ($stc_admin_nav['pages'] as $item): ?>
    <a class="stc-admin-card <?php echo !$item['live'] ? 'is-disabled' : ''; ?>"
       href="<?php echo $item['live'] ? htmlspecialchars(BASE_URL . 'admin/' . $item['href'], ENT_QUOTES, 'UTF-8') : '#'; ?>"
       <?php echo !$item['live'] ? 'aria-disabled="true" tabindex="-1"' : ''; ?>>
      <i class="bi <?php echo htmlspecialchars($item['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
      <span class="stc-admin-card__label"><?php echo htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8'); ?></span>
      <span class="stc-admin-card__status <?php echo $item['live'] ? 'is-live' : ''; ?>">
        <?php echo $item['live'] ? 'Live' : 'Coming soon'; ?>
      </span>
    </a>
  <?php endforeach; ?>
</div>

<h2 class="stc-admin-subheading">Settings</h2>
<div class="stc-admin-cards">
  <?php foreach ($stc_admin_nav['settings'] as $item): ?>
    <a class="stc-admin-card" href="<?php echo htmlspecialchars(BASE_URL . 'admin/' . $item['href'], ENT_QUOTES, 'UTF-8'); ?>">
      <i class="bi <?php echo htmlspecialchars($item['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
      <span class="stc-admin-card__label"><?php echo htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8'); ?></span>
      <span class="stc-admin-card__status is-live">Live</span>
    </a>
  <?php endforeach; ?>
</div>

<?php require __DIR__ . '/includes/layout-foot.php'; ?>
