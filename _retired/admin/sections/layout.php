<?php
/**
 * admin/sections/layout.php — Homepage Layout manager.
 * Controls the homepage_sections registry: drag-and-drop reorder,
 * enable/disable, and optional scheduled publish/unpublish windows.
 * This only ever touches ordering/visibility metadata — each
 * section's own content is edited on its own page (sections/hero.php,
 * sections/gallery.php, etc).
 */
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../../includes/models/HomepageSections.php';

$sections = stc_get_all_sections();

$pageTitle = 'Homepage Layout';
$activeSection = 'layout';
require __DIR__ . '/../includes/layout-head.php';
?>

<p class="stc-admin-lede">
  Drag rows by the handle to reorder the homepage. Turn a section off to hide it
  immediately without deleting its content, or schedule a publish/unpublish window
  (leave both blank to show whenever enabled).
</p>

<form id="stcLayoutForm" class="stc-admin-panel">
  <?php echo stc_csrf_field(); ?>
  <ul class="stc-layout-list" id="stcLayoutList">
    <?php foreach ($sections as $section): ?>
      <li class="stc-layout-row" draggable="true" data-id="<?php echo (int) $section['id']; ?>">
        <span class="stc-layout-row__handle" aria-hidden="true"><i class="bi bi-grip-vertical"></i></span>
        <span class="stc-layout-row__label">
          <?php echo htmlspecialchars($section['label'], ENT_QUOTES, 'UTF-8'); ?>
          <code><?php echo htmlspecialchars($section['section_key'], ENT_QUOTES, 'UTF-8'); ?></code>
        </span>
        <label class="stc-layout-row__toggle">
          <input type="checkbox" name="enabled_<?php echo (int) $section['id']; ?>" <?php echo $section['is_enabled'] ? 'checked' : ''; ?>>
          <span>Enabled</span>
        </label>
        <label class="stc-layout-row__schedule">
          Publish
          <input type="datetime-local" name="publish_<?php echo (int) $section['id']; ?>" value="<?php echo $section['publish_at'] ? date('Y-m-d\TH:i', strtotime($section['publish_at'])) : ''; ?>">
        </label>
        <label class="stc-layout-row__schedule">
          Unpublish
          <input type="datetime-local" name="unpublish_<?php echo (int) $section['id']; ?>" value="<?php echo $section['unpublish_at'] ? date('Y-m-d\TH:i', strtotime($section['unpublish_at'])) : ''; ?>">
        </label>
        <input type="hidden" name="order[]" value="<?php echo (int) $section['id']; ?>">
      </li>
    <?php endforeach; ?>
  </ul>

  <div class="stc-admin-form-actions">
    <button type="submit" class="stc-admin-btn stc-admin-btn--primary"><i class="bi bi-save" aria-hidden="true"></i> Save layout</button>
    <span class="stc-admin-hint">Changes apply to the homepage immediately after saving.</span>
  </div>
</form>

<link rel="stylesheet" href="<?php echo BASE_URL; ?>admin/assets/css/layout-editor.css">
<script>window.STC_LAYOUT_SAVE_URL = <?php echo json_encode(BASE_URL . 'admin/ajax/layout-save.php'); ?>;</script>
<script src="<?php echo BASE_URL; ?>admin/assets/js/layout-editor.js" defer></script>

<?php require __DIR__ . '/../includes/layout-foot.php'; ?>
