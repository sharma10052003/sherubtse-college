<?php
/**
 * admin/sections/president.php — President's Welcome editor.
 */
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../../includes/models/President.php';

$president = stc_get_president_content();

$pageTitle = "President's Welcome";
$activeSection = 'president';
require __DIR__ . '/../includes/layout-head.php';
?>

<form id="stcPresidentForm" class="stc-admin-layout" enctype="multipart/form-data" novalidate>
  <?php echo stc_csrf_field(); ?>
  <div>
    <div class="stc-admin-panel">
      <h2>Message</h2>
      <div class="stc-admin-field">
        <label for="presName">Name</label>
        <input type="text" id="presName" name="name" maxlength="150" value="<?php echo htmlspecialchars($president['name'], ENT_QUOTES, 'UTF-8'); ?>" placeholder="Leave blank to hide the name line">
      </div>
      <div class="stc-admin-field">
        <label for="presPosition">Position</label>
        <input type="text" id="presPosition" name="position" maxlength="150" required value="<?php echo htmlspecialchars($president['position'], ENT_QUOTES, 'UTF-8'); ?>">
      </div>
      <div class="stc-admin-field">
        <label for="presMessage">Welcome message</label>
        <textarea id="presMessage" name="message" maxlength="2000" rows="8" required><?php echo htmlspecialchars($president['message'], ENT_QUOTES, 'UTF-8'); ?></textarea>
      </div>
      <div class="stc-admin-grid-2">
        <div class="stc-admin-field">
          <label for="presButtonText">Button text</label>
          <input type="text" id="presButtonText" name="button_text" maxlength="60" required value="<?php echo htmlspecialchars($president['button_text'], ENT_QUOTES, 'UTF-8'); ?>">
        </div>
        <div class="stc-admin-field">
          <label for="presButtonUrl">Button link</label>
          <input type="text" id="presButtonUrl" name="button_url" maxlength="255" required value="<?php echo htmlspecialchars($president['button_url'], ENT_QUOTES, 'UTF-8'); ?>">
        </div>
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>Photo & Signature</h2>
      <div class="stc-admin-grid-2">
        <div class="stc-admin-field">
          <label for="presPhoto">Photo</label>
          <input type="file" id="presPhoto" name="photo" accept="image/jpeg,image/png,image/webp">
          <span class="stc-admin-hint">JPG/PNG/WebP, max 10MB.<?php if (!empty($president['photo_path'])): ?> Current: <code><?php echo htmlspecialchars($president['photo_path'], ENT_QUOTES, 'UTF-8'); ?></code><?php endif; ?></span>
        </div>
        <div class="stc-admin-field">
          <label for="presSignature">Signature (optional)</label>
          <input type="file" id="presSignature" name="signature" accept="image/jpeg,image/png,image/webp">
          <span class="stc-admin-hint">Transparent PNG works best.<?php if (!empty($president['signature_path'])): ?> Current: <code><?php echo htmlspecialchars($president['signature_path'], ENT_QUOTES, 'UTF-8'); ?></code><?php endif; ?></span>
        </div>
      </div>
    </div>

    <div class="stc-admin-form-actions">
      <button type="submit" class="stc-admin-btn stc-admin-btn--primary"><i class="bi bi-save" aria-hidden="true"></i> Save changes</button>
      <span class="stc-admin-hint">Changes go live on the homepage immediately after saving.</span>
    </div>
  </div>

  <aside class="stc-admin-preview">
    <p class="stc-admin-preview__label">Live preview (approximate)</p>
    <div class="stc-president-preview" id="presidentPreview">
      <div class="stc-president-preview__photo" id="presPreviewPhoto">
        <?php if (!empty($president['photo_path'])): ?>
          <img src="<?php echo htmlspecialchars(BASE_URL . 'assets/uploads/president/' . rawurlencode($president['photo_path']), ENT_QUOTES, 'UTF-8'); ?>" alt="">
        <?php else: ?>
          <i class="bi bi-person-fill"></i>
        <?php endif; ?>
      </div>
      <p id="presPreviewMessage"><?php echo htmlspecialchars($president['message'], ENT_QUOTES, 'UTF-8'); ?></p>
      <p class="stc-president-preview__name" id="presPreviewName"><?php echo htmlspecialchars($president['name'], ENT_QUOTES, 'UTF-8'); ?></p>
      <p class="stc-president-preview__position" id="presPreviewPosition"><?php echo htmlspecialchars($president['position'], ENT_QUOTES, 'UTF-8'); ?></p>
      <span class="stc-president-preview__btn" id="presPreviewBtn"><?php echo htmlspecialchars($president['button_text'], ENT_QUOTES, 'UTF-8'); ?></span>
    </div>
  </aside>
</form>

<link rel="stylesheet" href="<?php echo BASE_URL; ?>admin/assets/css/president-editor.css">
<script>window.STC_PRESIDENT_SAVE_URL = <?php echo json_encode(BASE_URL . 'admin/ajax/president-save.php'); ?>;</script>
<script src="<?php echo BASE_URL; ?>admin/assets/js/president-editor.js" defer></script>

<?php require __DIR__ . '/../includes/layout-foot.php'; ?>
